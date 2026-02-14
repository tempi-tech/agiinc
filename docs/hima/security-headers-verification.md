# HSTS/CSP セキュリティヘッダ デプロイ検証レポート（再検証版）

検証日時: 2026-02-14 10:49 JST  
検証者: ラジ・パテル（Founding Engineer）  
仕様書: docs/hima/security-headers-spec.md

## 検証サマリ

| サービス | HSTS | CSP | Referrer-Policy | X-Content-Type-Options | 総合 |
|---|---|---|---|---|---|
| hima.agiinc.io | **PASS** | **PASS** | PASS | PASS | **PASS** |
| agiinc.io | **PASS** | **PASS** | PASS | PASS | **PASS** |
| blog.agiinc.io | **PASS** | **PASS** | PASS | PASS | **PASS** |
| api-hima.agiinc.io | **PASS** | **PASS** | N/A | N/A | **PASS** |

---

## 1. hima.agiinc.io

### リクエスト
```bash
curl -I https://hima.agiinc.io
```

### レスポンスヘッダ（抽出）
```text
strict-transport-security: max-age=31536000; includeSubDomains
content-security-policy: default-src 'self'; base-uri 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://api-hima.agiinc.io; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; form-action 'self'; media-src 'self'; manifest-src 'self'; upgrade-insecure-requests;
cross-origin-opener-policy: same-origin
referrer-policy: strict-origin-when-cross-origin
x-content-type-options: nosniff
x-frame-options: DENY
```

### 判定

| ヘッダ | 期待値 | 実測値 | 判定 |
|---|---|---|---|
| Strict-Transport-Security | `max-age=31536000; includeSubDomains` | 上記一致 | PASS |
| Content-Security-Policy | 仕様書3.1の値 | 上記一致 | PASS |
| Referrer-Policy | `strict-origin-when-cross-origin` | 上記一致 | PASS |
| X-Content-Type-Options | `nosniff` | 上記一致 | PASS |

---

## 2. agiinc.io

### リクエスト
```bash
curl -I https://agiinc.io
```

### レスポンスヘッダ（抽出）
```text
strict-transport-security: max-age=31536000; includeSubDomains
content-security-policy: default-src 'self'; base-uri 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self'; connect-src 'self'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; form-action 'self'; media-src 'self'; manifest-src 'self'; worker-src 'none'; upgrade-insecure-requests;
cross-origin-opener-policy: same-origin
referrer-policy: strict-origin-when-cross-origin
x-content-type-options: nosniff
x-frame-options: DENY
```

### 判定

| ヘッダ | 期待値 | 実測値 | 判定 |
|---|---|---|---|
| Strict-Transport-Security | `max-age=31536000; includeSubDomains` | 上記一致 | PASS |
| Content-Security-Policy | 仕様書3.2の値 | 上記一致 | PASS |
| Referrer-Policy | `strict-origin-when-cross-origin` | 上記一致 | PASS |
| X-Content-Type-Options | `nosniff` | 上記一致 | PASS |

---

## 3. blog.agiinc.io

### リクエスト
```bash
curl -I https://blog.agiinc.io
```

### レスポンスヘッダ（抽出）
```text
strict-transport-security: max-age=31536000; includeSubDomains
content-security-policy: default-src 'self'; base-uri 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self'; connect-src 'self'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; form-action 'self'; media-src 'self'; manifest-src 'self'; worker-src 'none'; upgrade-insecure-requests;
cross-origin-opener-policy: same-origin
referrer-policy: strict-origin-when-cross-origin
x-content-type-options: nosniff
x-frame-options: DENY
```

### 判定

| ヘッダ | 期待値 | 実測値 | 判定 |
|---|---|---|---|
| Strict-Transport-Security | `max-age=31536000; includeSubDomains` | 上記一致 | PASS |
| Content-Security-Policy | 仕様書3.3の値 | 上記一致 | PASS |
| Referrer-Policy | `strict-origin-when-cross-origin` | 上記一致 | PASS |
| X-Content-Type-Options | `nosniff` | 上記一致 | PASS |

---

## 4. api-hima.agiinc.io（Worker）

### 4.1 直接アクセス

```bash
curl -I https://api-hima.agiinc.io
```

```text
strict-transport-security: max-age=31536000; includeSubDomains
content-security-policy: default-src 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; script-src 'none'; style-src 'none'; img-src 'none'; media-src 'none'; connect-src 'self'; form-action 'none'; worker-src 'none';
```

### 4.2 OPTIONS

```bash
curl -I -X OPTIONS 'https://api-hima.agiinc.io/https://api.openai.com/v1/chat/completions' -H 'Origin: https://hima.agiinc.io'
```

```text
strict-transport-security: max-age=31536000; includeSubDomains
content-security-policy: default-src 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; script-src 'none'; style-src 'none'; img-src 'none'; media-src 'none'; connect-src 'self'; form-action 'none'; worker-src 'none';
access-control-allow-origin: https://hima.agiinc.io
access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
access-control-allow-headers: Content-Type, Authorization, x-api-key, anthropic-version
```

### 4.3 上流転送

```bash
curl -I -H 'Origin: https://hima.agiinc.io' \
  'https://api-hima.agiinc.io/https://api.openai.com/v1/models'
```

```text
strict-transport-security: max-age=31536000; includeSubDomains
content-security-policy: default-src 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; script-src 'none'; style-src 'none'; img-src 'none'; media-src 'none'; connect-src 'self'; form-action 'none'; worker-src 'none';
```

### 判定

| ヘッダ | 期待値 | 実測値 | 判定 |
|---|---|---|---|
| Strict-Transport-Security | `max-age=31536000; includeSubDomains` | 上記一致 | PASS |
| Content-Security-Policy | 仕様書3.4の値 | 上記一致 | PASS |
| CORS ヘッダ | 正常 | 正常 | PASS |

---

## 5. 再デプロイ / 再検証結果

- Pages: `hima`, `agiinc-www`, `agiinc-blog` へ再デプロイを実施。
- Worker: `products/hima/worker` から `wrangler deploy` を実施。
- API サービス（`api-hima.agiinc.io`）含め、4サービスとも HSTS と CSP は PASS。
- Cloudflare キャッシュパージは、既存 API トークン権限（`zone` 設定）では `cache purge` が不可だったため実行不可。  
  （`zone_settings:edit` と `zone:read` は有効、`cache purge` 権限が不足）
