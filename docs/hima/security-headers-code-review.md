# HSTS/CSP コードレビュー結果（2026-02-14）

## 対象
- `products/hima/public/_headers`
- `products/site/www/public/_headers`
- `products/site/blog/public/_headers`
- `products/hima/worker/src/index.ts`
- `docs/hima/security-headers-spec.md`

## 総合判定
- コードレビュー観点では実装は概ね仕様に整合。
- 4サービス共通での `FAIL` は、`docs/hima/security-headers-verification.md` の結果通り、**実装未反映（デプロイ経路）**が主因。

## 1) `_headers` フォーマット（Cloudflare Pages）

### `products/hima/public/_headers`
- 判定: PASS
- 理由: 先頭の `/*` に対して `Strict-Transport-Security`, `Content-Security-Policy`, `Referrer-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Cross-Origin-Opener-Policy` が1行ずつ定義され、Cloudflare Pages 仕様の書式と一致。
- 検証観点: 仕様書セクション3.1のHMA CSPと一致（`data:`含む `img-src`、`connect-src 'self' https://api-hima.agiinc.io` を含む）。

### `products/site/www/public/_headers`
- 判定: PASS
- 理由: スニペットが`/*`配下にヘッダを適用し、仕様セクション3.2（`worker-src 'none'`含む）と一致。

### `products/site/blog/public/_headers`
- 判定: PASS
- 理由: スニペットが`/*`配下にヘッダを適用し、仕様セクション3.3と一致。

## 2) Workerのヘッダ付与ロジック

### `products/hima/worker/src/index.ts`
- 判定: PASS（ロジック上）
- 確認ポイント:
  - `SECURITY_HEADERS` が `Strict-Transport-Security` と `Content-Security-Policy` を定義し、`jsonResponse` で共通付与。
  - 403/400/429/OPTIONS/上流代理レスポンスすべてで `jsonResponse(...)` 経由している。
  - `upstream response` も `jsonResponse(response.body, { ...headers: responseHeaders })` で受け、上書きルール上でセキュリティヘッダは最終的に付与される想定。
- 差分観点: `docs/hima/security-headers-spec.md` のセクション3.4と完全一致。
- 注意: `verification` に `openai` 側HSTS（`...; preload`）が見えているのは、Worker内ヘッダ付与が反映していない旧実行時の挙動である可能性が高い。

## 3) CSP / HSTS 仕様整合
- `docs/hima/security-headers-spec.md` と実装は、指摘された4サービスの値・指令セット上で整合。
- 追加指摘: 仕様では `upgrade-insecure-requests` がPages側で明記されており、`_headers` 側でも適用されている。

## 4) デプロイ未反映の原因推定と修正指示（優先順）

1. Cloudflare Pages の再デプロイ不足（最優先）
- 指示:
  - Pagesプロジェクトごとに手動再デプロイを実行し、デプロイログで `public/_headers` が反映済みか確認。
  - `hima`: `public/_headers` が出力アーティファクト（例: `dist/_headers`）に含まれるかを確認。
- 期待:
  - `curl -I https://hima.agiinc.io` で `strict-transport-security` と `content-security-policy` が表示される。

2. Worker の再デプロイ不足（最優先）
- 指示:
  - `products/hima/worker` で `wrangler deploy`（本番環境）を実行。
  - ルートトリガーが `api-hima.agiinc.io/*` を対象にしているか確認。
- 期待:
  - `curl -I -X OPTIONS 'https://api-hima.agiinc.io/https://api.openai.com/v1/chat/completions' -H 'Origin: https://hima.agiinc.io'` の応答に HSTS/CSP が付与される。

3. キャッシュ由来の古いレスポンス配信
- 指示:
  - 各ページの Cloudflare キャッシュをパージ。
  - `cache-control` の影響を避けるため、配信確認時はシークレットブラウザ/`curl -I` で再測定。

4. 実運用監視のCI化（再発防止）
- 指示:
  - CI/CDに、デプロイ後ヘッダ監査ステップを追加。
  - `hima/agiinc/blog/api-hima` 4エンドポイントの `curl -I` チェックを回す（HSTS/CSP必須チェック）。

## 結論
- 現時点では、実装品質自体はレビュー基準上問題なし。FAIL の主因はデプロイ反映未完了（Pages/Worker）であり、上記修正指示を実行すれば是正可能。
