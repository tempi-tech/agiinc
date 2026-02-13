# Hima セキュリティヘッダ仕様（HSTS / CSP）

作成日: 2026-02-13
対象: hima / agiinc / blog / api-hima の4サービス

## 1. 目的
- 全HTTPS応答に`Strict-Transport-Security`を付与する。
- 各サービス特性に合わせた`Content-Security-Policy`を最小権限制御で追加する。
- Cloudflare Pagesは`_headers`、Cloudflare WorkerはWorkerコード内でヘッダ付与する。

## 2. 共通要件

### 2.1 HSTS
全サービスで以下を設定する。

- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

補足
- `preload`は今回未指定。
- `includeSubDomains`は全サービス共通。

## 2.2 CSP方針
- `default-src`を起点に最小権限で記載。
- `unsafe-inline`は必要箇所のみ許可。
- `object-src`/`base-uri`/`frame-ancestors`は原則`none`寄りで固定。

## 3. サービス別ヘッダ仕様

### 3.1 hima.agiinc.io（Cloudflare Pages / React SPA）

a) HSTS
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

b) CSP
- `Content-Security-Policy:`
  `default-src 'self';`
  `base-uri 'self';`
  `script-src 'self';`
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;`
  `font-src 'self' https://fonts.gstatic.com;`
  `img-src 'self' data:;`
  `connect-src 'self' https://api-hima.agiinc.io;`
  `object-src 'none';`
  `frame-src 'none';`
  `frame-ancestors 'none';`
  `form-action 'self';`
  `media-src 'self';`
  `manifest-src 'self';`
  `upgrade-insecure-requests;`

理由:
- SPA本体とJSは同一オリジン。
- Google Fonts利用のため`fonts.googleapis.com / fonts.gstatic.com`を許可。
- API呼び出し先はプロキシ経由の`https://api-hima.agiinc.io`のみ。

---

### 3.2 agiinc.io（Cloudflare Pages / Astro SSG）

a) HSTS
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

b) CSP（厳格）
- `Content-Security-Policy:`
  `default-src 'self';`
  `base-uri 'self';`
  `script-src 'self';`
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;`
  `font-src 'self' https://fonts.gstatic.com;`
  `img-src 'self';`
  `connect-src 'self';`
  `object-src 'none';`
  `frame-src 'none';`
  `frame-ancestors 'none';`
  `form-action 'self';`
  `media-src 'self';`
  `manifest-src 'self';`
  `worker-src 'none';`
  `upgrade-insecure-requests;`

### 3.3 blog.agiinc.io（Cloudflare Pages / Astro SSG）

a) HSTS
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

b) CSP（厳格）
- `Content-Security-Policy:`
  `default-src 'self';`
  `base-uri 'self';`
  `script-src 'self';`
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;`
  `font-src 'self' https://fonts.gstatic.com;`
  `img-src 'self';`
  `connect-src 'self';`
  `object-src 'none';`
  `frame-src 'none';`
  `frame-ancestors 'none';`
  `form-action 'self';`
  `media-src 'self';`
  `manifest-src 'self';`
  `worker-src 'none';`
  `upgrade-insecure-requests;`

### 3.4 api-hima.agiinc.io（Cloudflare Worker）

a) HSTS
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

b) CSP（最小）
- `Content-Security-Policy: default-src 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; script-src 'none'; style-src 'none'; img-src 'none'; media-src 'none'; connect-src 'self'; form-action 'none'; worker-src 'none';`

理由:
- APIエンドポイントはJSON転送専用。
- ブラウザが誤ってページ文脈として扱うリスクを抑制する。

## 4. 実装手順（担当: Founding Engineer）

### 4.1 Pagesサービス（共通）
1. 各サービスの`public/_headers`に以下を追加。

- `hima`:
  - `products/hima/public/_headers`
- `agiinc`:
  - `products/site/www/public/_headers`
- `blog`:
  - `products/site/blog/public/_headers`

2. `_headers`内容（例: ドメインごと同様に1行ずつ置換）

```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy: <該当サービスのCSP>
  Referrer-Policy: strict-origin-when-cross-origin
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Cross-Origin-Opener-Policy: same-origin
```

### 4.2 Worker（api-hima）
1. `products/hima/worker/src/index.ts`の各Response生成箇所に共通ヘッダを付与。
2. `OPTIONS`/403/429/400/200の全分岐で共通ヘッダが付くように、ヘルパー関数化する。

実装イメージ（差分要旨）
- セキュリティヘッダ定数を定義
  - `strict-transport-security`と`content-security-policy`を含める
- `jsonResponse(body, status, init)`等のラッパでヘッダを追加
- 取得済みレスポンスに対して`responseHeaders.set(...)`で上書き追加

## 5. テスト方法

### 5.1 Pages（hima/agiinc/blog）
- ヘッダ確認
  - `curl -I https://hima.agiinc.io`
  - `curl -I https://agiinc.io`
  - `curl -I https://blog.agiinc.io`
- 検証項目
  - `Strict-Transport-Security`が上記値
  - `Content-Security-Policy`が対象サービスの値
  - `Referrer-Policy`, `X-Content-Type-Options`

### 5.2 Worker（api-hima）
- 主要分岐を確認
  - `curl -I https://api-hima.agiinc.io`（現在403）
  - `curl -I -X OPTIONS https://api-hima.agiinc.io/https://api.openai.com/v1/chat/completions -H 'Origin: https://hima.agiinc.io'`
  - `curl -I -H 'Origin: https://hima.agiinc.io' 'https://api-hima.agiinc.io/invalid-target'`
  - `curl -I -H 'Origin: https://hima.agiinc.io' 'https://api-hima.agiinc.io/https://api.openai.com/v1/models'`
- 各応答にHSTS/CSPが付与され、CORSヘッダも従来どおり存在することを確認

### 5.3 デプロイ後確認
- ブラウザにて`https://...`ヘッダを再確認。
- Cloudflareキャッシュが有効な場合は対象サービスのキャッシュパージ後に再検証。
- 継続監視: 週次ヘルスチェックレポートに`HSTS`/`CSP`項目を追加。

