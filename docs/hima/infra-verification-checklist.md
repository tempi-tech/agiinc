# Hima 正式検証チェックシート（I-01〜I-04）

作成日: 2026-02-14  
対象日: 2026-03-22（正式稼働確認）  
担当: CTO / Engineer / CMO  
前提: 全4サービスはデプロイ済み。HSTS/CSP 実装は `docs/hima/security-headers-spec.md` と `docs/hima/security-headers-verification.md` の値で再確認済み。  
参照: `docs/hima/launch-checklist.md`, `docs/hima/infra-audit-w08.md`, `docs/hima/tech-architecture.md`

---

## 1. 実行順序と見積もり

### 1.1 実行順序

1. DNS/TLS基盤確認（共通）
2. I-01（hima.agiinc.io）
3. I-02（api-hima.agiinc.io）
4. I-03（agiinc.io）
5. I-04（blog.agiinc.io）
6. 総合判定とGo/No-Go更新

### 1.2 所要時間見積もり

- DNS/TLS確認: 5分  
- I-01: 15分  
- I-02: 20分  
- I-03: 10分  
- I-04: 20分  
- 影響度レビューと合否集計: 10分  

合計見積もり: 80分

---

## 2. 共通ヘッダ期待値（再確認）

### 2.1 HSTS
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

### 2.2 CSP
- hima: `default-src 'self'; base-uri 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://api-hima.agiinc.io; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; form-action 'self'; media-src 'self'; manifest-src 'self'; upgrade-insecure-requests;`
- agiinc: `default-src 'self'; base-uri 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self'; connect-src 'self'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; form-action 'self'; media-src 'self'; manifest-src 'self'; worker-src 'none'; upgrade-insecure-requests;`
- blog: `default-src 'self'; base-uri 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self'; connect-src 'self'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; form-action 'self'; media-src 'self'; manifest-src 'self'; worker-src 'none'; upgrade-insecure-requests;`
- api-hima: `default-src 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; script-src 'none'; style-src 'none'; img-src 'none'; media-src 'none'; connect-src 'self'; form-action 'none'; worker-src 'none';`

---

## 3. I-01 `hima.agiinc.io` 稼働確認

### 3.1 検証項目
- DNS 解決とTLSハンドシェイクが成立すること
- `http://` から `https://` へのリダイレクトが成立すること
- HTTPSで 200 応答を返すこと
- 主要導線（`blog.agiinc.io`, `agiinc.io`）がHTMLに含まれ、有効リンクとして機能すること
- 主要ヘッダ（HSTS/CSP）の付与が成立すること

### 3.2 実行コマンド
1. DNS  
`dig +short hima.agiinc.io`

2. TLS（証明書期限）  
`echo | openssl s_client -connect hima.agiinc.io:443 -servername hima.agiinc.io 2>/dev/null | openssl x509 -noout -dates -subject -issuer`

3. HTTPS 応答ヘッダ  
`curl -I https://hima.agiinc.io`

4. HTTP→HTTPS リダイレクト  
`curl -I -L http://hima.agiinc.io`

5. トップページ本文検証  
`curl -s https://hima.agiinc.io | sed -n '1,120p'`

6. 主要導線文字列検証  
`curl -s https://hima.agiinc.io | rg -o 'href=\"[^\"]+(blog\\.agiinc\\.io|agiinc\\.agiinc\\.io)'`

### 3.3 期待結果
- `dig`で有効な A/AAAA 解決結果が返ること  
- openssl で有効な証明書、有効期限表示が取得できること  
- `curl -I` の`HTTP/2 200`（または`200`）  
- `curl -I -L http://...` が `301` 等で `Location: https://hima.agiinc.io/` を返すこと  
- トップページ本文に`<!doctype html>`と必要タグが含まれること  
- 本文に `blog.agiinc.io` と `agiinc.io` が検知されること  
- 追加ヘッダ: `Strict-Transport-Security`, `Content-Security-Policy` が 2.1,2.2で定義値と一致すること

### 3.4 合否基準
- PASS: すべての期待結果が成立
- FAIL: いずれか1件でも欠損、あるいは 5xx/DNS失敗/証明書期限切れを含む不具合

### 3.5 失敗時の対処
- ロールバック: Cloudflare Pages で直前安定デプロイへロールバック  
- 再デプロイ: `hima` サービスの最新コミットを再デプロイし再検証
- Escalation: `CTO` → `CEO`（P0相当）

### 3.6 Go/No-Go影響度
- `P0`（公開不可）: 200/301/TLS/HSTS/CSP の欠損  
- `P1`（要対処）: 主要導線1件だけ欠落  
- `P2`（軽微）: 表示文言差異のみ（レンダリング軽微）

---

## 4. I-02 `api-hima.agiinc.io` 稼働確認

### 4.1 検証項目
- Worker 到達性（403/400でも想定稼働範囲）
- 主要 Origin 許可制御（`hima.agiinc.io` の許可、他 Origin 拒否）
- 3プロバイダへの転送ルート（OpenAI/Anthropic/Google）が成立し、JSON系エラーを返す
- CORS + CSP/HSTSが付与されること

### 4.2 実行コマンド
1. ルート到達  
`curl -I https://api-hima.agiinc.io`

2. Allowed Origin 事前フライト  
`curl -I -X OPTIONS -H 'Origin: https://hima.agiinc.io' -H 'Access-Control-Request-Method: POST' -H 'Access-Control-Request-Headers: content-type,authorization,x-api-key,anthropic-version' https://api-hima.agiinc.io`

3. Disallowed Origin 確認  
`curl -I -X OPTIONS -H 'Origin: https://evil.example.com' -H 'Access-Control-Request-Method: POST' https://api-hima.agiinc.io`

4. OpenAI ルート（期待: 転送前提の認証エラー）  
`curl -s -D - -o /tmp/openai.txt -X POST https://api-hima.agiinc.io/https://api.openai.com/v1/chat/completions -H 'Content-Type: application/json' -H 'Origin: https://hima.agiinc.io' -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}]}'`

5. Anthropic ルート  
`curl -s -D - -o /tmp/anthropic.txt -X POST https://api-hima.agiinc.io/https://api.anthropic.com/v1/messages -H 'Content-Type: application/json' -H 'Origin: https://hima.agiinc.io' -d '{"model":"claude-3-5-sonnet-latest","max_tokens":5,"messages":[{"role":"user","content":"ping"}]}'`

6. Google ルート  
`curl -s -D - -o /tmp/google.txt -X POST https://api-hima.agiinc.io/https://generativelanguage.googleapis.com/v1beta/models -H 'Content-Type: application/json' -H 'Origin: https://hima.agiinc.io' -d '{"contents":[{"parts":[{"text":"ping"}]}]}'`

### 4.3 期待結果
- 3.1 期待: `200` でも `400/401` でも可（実キーが無い前提）  
- ルート: `403` または `400` でヘッダを返し、非HTML文字列
- OPTIONS(許可Origin): `access-control-allow-origin: https://hima.agiinc.io` が存在
- OPTIONS(不正Origin): `access-control-allow-origin` 不在、または `403/400/405`
- 転送先ルート3件とも JSON系レスポンス（`{`始まり）で `401`/`400` 等のAPI側エラーを返却（成功応答は不可だが、転送到達を示す）
- 全件共通ヘッダに `Strict-Transport-Security` と `Content-Security-Policy` が存在し、2.2のapi-hima仕様一致

### 4.4 合否基準
- PASS: Allow Origin のCORS、転送3件のJSON到達、セキュリティヘッダ、仕様外Origin拒否が成立
- FAIL: いずれかが欠損、特に 3プロバイダのうち1つでも転送不可、または CORS が許容Originでも無い

### 4.5 失敗時の対処
- ロールバック: Worker 前回安定バージョンへロールバック（`wrangler rollback` or 前回デプロイ再実行）  
- ルート再デプロイ: `products/hima/worker` 変更差分をリリース待ち再デプロイ
- Escalation: `CTO` → `Founding Engineer` で即時修正、`CEO`へ影響範囲報告

### 4.6 Go/No-Go影響度
- `P0`（公開不可）: Origin許可外許容、CSP/HSTS未付与、3プロバイダ中1系統以上転送不能  
- `P1`（要対処）: ステータスが 403/400 として想定通りだが JSONが非JSON/HTML  
- `P2`（軽微）: レイテンシ異常（要再測定）

---

## 5. I-03 `agiinc.io` 稼働確認

### 5.1 検証項目
- HTTPS 200 到達、HTTP→HTTPSリダイレクト
- 会社サイトトップ表示
- OGP/Canonical が存在
- 導線リンク（hima/blog）有効
- セキュリティヘッダ付与

### 5.2 実行コマンド
1. 到達性  
`curl -I -L http://agiinc.io`

2. 本文/メタ確認  
`curl -s https://agiinc.io | sed -n '1,200p'`

3. OGP/Canonical確認  
`curl -s https://agiinc.io | rg -n 'property=\"og:(title|description|image)|name=\"twitter:card\"|rel=\"canonical\"|href=\"https://agiinc\\.io/'`

4. 導線確認  
`curl -s https://agiinc.io | rg -n 'hima\\.agiinc\\.io|blog\\.agiinc\\.io'`

5. robots / sitemap  
`curl -I https://agiinc.io/robots.txt && curl -I https://agiinc.io/sitemap-index.xml && curl -I https://agiinc.io/sitemap.xml`

### 5.3 期待結果
- HTTPが HTTPSへリダイレクト（`301`想定）
- HTTPS応答 `200`
- トップ本文がHTMLを返却し、レイアウト崩れなし（目視）
- OGP: `property="og:title"` `og:description` `og:image` が存在
- canonical が `https://agiinc.io/`（または `https://agiinc.io`）であること
- 導線に `hima.agiinc.io` への明示リンク
- `robots.txt` は `200`、`sitemap` は `sitemap-index.xml` 経由なら `/sitemap.xml` は `404`で可（意図した場合）
- セキュリティヘッダ一致（2.1,2.2）

### 5.4 合否基準
- PASS: 1〜6 全件成立
- FAIL: SSL/TLS, トップ不可, OGP未設定, 主要導線欠落, robots/sitemap想定逸脱

### 5.5 失敗時の対処
- ロールバック: agiinc Pages を直前デプロイにロールバック
- 再デプロイ: `docs/hima/tech-architecture.md` のサイト配信フローに従い、`site` 側再デプロイ
- Escalation: `CTO` -> `CMO`（導線）/ `Founding Engineer`（ヘッダ）/ `CEO`（公開停止判断）

### 5.6 Go/No-Go影響度
- `P0`（公開不可）: サイト到達不可、HTTPS不可、導線切断  
- `P1`（要対処）: OGP/Canonical欠落  
- `P2`（軽微）: sitemap参照方針違反が意図しないだけで表示自体は安定

---

## 6. I-04 `blog.agiinc.io` 稼働確認

### 6.1 検証項目
- ブログトップ表示
- B1/B4 記事表示（URLは公開前に確定）
- OGP生成（`og:title`, `og:image`, `canonical`)
- B1/B4→hima/agiinc導線有効
- robots / sitemap の公開状態

### 6.2 準備
事前に本番公開時点のURLを環境変数で確定する。  
```bash
export B1_URL="https://blog.agiinc.io/posts/<B1-SLUG>"
export B4_URL="https://blog.agiinc.io/posts/<B4-SLUG>"
```

### 6.3 実行コマンド
1. トップ到達  
`curl -I https://blog.agiinc.io`

2. B1 記事ヘッダ  
`curl -s $B1_URL | rg -n 'og:title|og:image|rel=\"canonical\"|hima\\.agiinc\\.io|agiinc\\.io'`

3. B4 記事ヘッダ  
`curl -s $B4_URL | rg -n 'og:title|og:image|rel=\"canonical\"|hima\\.agiinc\\.io|agiinc\\.io'`

4. B1/B4本文取得ステータス  
`curl -I $B1_URL && curl -I $B4_URL`

5. 導線再起点としてトップ→LP/会社  
`curl -s https://blog.agiinc.io | rg -n 'hima\\.agiinc\\.io|agiinc\\.io'`

6. robots / sitemap  
`curl -I https://blog.agiinc.io/robots.txt && curl -I https://blog.agiinc.io/sitemap-index.xml && curl -I https://blog.agiinc.io/sitemap.xml`

7. OGP画像到達  
`curl -I "https://blog.agiinc.io/og-image.png"`

### 6.4 期待結果
- ブログトップ: `200`
- B1/B4 URL: 各々 `200`、`Content-Type: text/html`（または `text/html; charset=utf-8`）
- B1/B4本文: `og:title`, `og:image`, `canonical` が取得でき、OGP画像URLが200かつ取得可能
- B1/B4内部本文に `hima.agiinc.io` と `agiinc.io` の導線文字列が存在（少なくとも1件ずつ）
- `/robots.txt` `200`、`sitemap` は `sitemap-index.xml` が参照されている

### 6.5 合否基準
- PASS: トップ・B1/B4本体・OGP・導線・`robots/sitemap` が成立
- FAIL: B1/B4のいずれかが 404/5xx、OGP不在、導線リンク未検出

### 6.6 失敗時の対処
- ロールバック: blog Pages を直前デプロイへロールバック
- 再デプロイ: 記事追加/修正分（slug, frontmatter, OGP）を反映し、再発行
- Escalation: `CMO`（記事/OGP）+ `Founding Engineer`（配信）+ `CTO`

### 6.7 Go/No-Go影響度
- `P0`（公開不可）: B1/B4の表示不可、記事導線不達、OGP不在で広報時共有不能  
- `P1`（要対処）: 片方の記事だけの不具合  
- `P2`（軽微）: 画像リンク差し替え、タイトル文言のみ

---

## 7. 統合 Go/No-Go 判定（I-01〜I-04）

### 7.1 判定ルール
- `Go`: I-01〜I-04 が全件 PASS  
- `No-Go`: P0 項目が1件以上発生  
- `Conditional Go`: P1 以下のみかつ修正完了報告（30分以内）を受けてローンチ時間を維持

### 7.2 サービス別影響マッピング
- I-01: 重み 35%（サービス入口）
- I-02: 重み 35%（API基盤）
- I-03: 重み 15%（法人導線）
- I-04: 重み 15%（広報導線）

### 7.3 証跡保存
- 検証実行ログは `infra-verification-` 日時別ファイルに保存し、`docs/hima/`配下へ追記する  
- 検証結果の証跡として、成功コマンド、失敗時HTTPコード、ヘッダ差分を添付する
