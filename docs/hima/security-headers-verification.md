# HSTS/CSP セキュリティヘッダ デプロイ検証レポート

検証日時: 2026-02-14 00:03 UTC
検証者: ラジ・パテル（Founding Engineer）
仕様書: docs/hima/security-headers-spec.md

## 検証サマリ

| サービス | HSTS | CSP | Referrer-Policy | X-Content-Type-Options | 総合 |
|---|---|---|---|---|---|
| hima.agiinc.io | **FAIL** | **FAIL** | PASS | PASS | **FAIL** |
| agiinc.io | **FAIL** | **FAIL** | PASS | PASS | **FAIL** |
| blog.agiinc.io | **FAIL** | **FAIL** | PASS | PASS | **FAIL** |
| api-hima.agiinc.io | **FAIL** | **FAIL** | N/A | N/A | **FAIL** |

**全4サービスで HSTS / CSP ヘッダが未反映。デプロイが反映されていない可能性あり。**

---

## 1. hima.agiinc.io

### リクエスト
```
curl -I https://hima.agiinc.io
```

### レスポンスヘッダ（抜粋）
```
HTTP/2 200
content-type: text/html; charset=utf-8
access-control-allow-origin: *
cache-control: public, max-age=0, must-revalidate
referrer-policy: strict-origin-when-cross-origin
x-content-type-options: nosniff
server: cloudflare
```

### 判定

| ヘッダ | 期待値 | 実測値 | 判定 |
|---|---|---|---|
| Strict-Transport-Security | `max-age=31536000; includeSubDomains` | **なし** | **FAIL** |
| Content-Security-Policy | セクション3.1の値 | **なし** | **FAIL** |
| Referrer-Policy | `strict-origin-when-cross-origin` | `strict-origin-when-cross-origin` | PASS |
| X-Content-Type-Options | `nosniff` | `nosniff` | PASS |

---

## 2. agiinc.io

### リクエスト
```
curl -I https://agiinc.io
```

### レスポンスヘッダ（抜粋）
```
HTTP/2 200
content-type: text/html; charset=utf-8
access-control-allow-origin: *
cache-control: public, max-age=0, must-revalidate
referrer-policy: strict-origin-when-cross-origin
x-content-type-options: nosniff
server: cloudflare
```

### 判定

| ヘッダ | 期待値 | 実測値 | 判定 |
|---|---|---|---|
| Strict-Transport-Security | `max-age=31536000; includeSubDomains` | **なし** | **FAIL** |
| Content-Security-Policy | セクション3.2の値 | **なし** | **FAIL** |
| Referrer-Policy | `strict-origin-when-cross-origin` | `strict-origin-when-cross-origin` | PASS |
| X-Content-Type-Options | `nosniff` | `nosniff` | PASS |

---

## 3. blog.agiinc.io

### リクエスト
```
curl -I https://blog.agiinc.io
```

### レスポンスヘッダ（抜粋）
```
HTTP/2 200
content-type: text/html; charset=utf-8
access-control-allow-origin: *
cache-control: public, max-age=0, must-revalidate
referrer-policy: strict-origin-when-cross-origin
x-content-type-options: nosniff
server: cloudflare
```

### 判定

| ヘッダ | 期待値 | 実測値 | 判定 |
|---|---|---|---|
| Strict-Transport-Security | `max-age=31536000; includeSubDomains` | **なし** | **FAIL** |
| Content-Security-Policy | セクション3.3の値 | **なし** | **FAIL** |
| Referrer-Policy | `strict-origin-when-cross-origin` | `strict-origin-when-cross-origin` | PASS |
| X-Content-Type-Options | `nosniff` | `nosniff` | PASS |

---

## 4. api-hima.agiinc.io（Worker）

### 4.1 直接アクセス（Origin なし → 403）

```
curl -I https://api-hima.agiinc.io
```

```
HTTP/2 403
content-type: text/plain;charset=UTF-8
server: cloudflare
```

| ヘッダ | 期待値 | 実測値 | 判定 |
|---|---|---|---|
| Strict-Transport-Security | `max-age=31536000; includeSubDomains` | **なし** | **FAIL** |
| Content-Security-Policy | セクション3.4の値 | **なし** | **FAIL** |

### 4.2 OPTIONS プリフライト（204）

```
curl -I -X OPTIONS 'https://api-hima.agiinc.io/https://api.openai.com/v1/chat/completions' \
  -H 'Origin: https://hima.agiinc.io'
```

```
HTTP/2 204
access-control-allow-origin: https://hima.agiinc.io
access-control-allow-headers: Content-Type, Authorization, x-api-key, anthropic-version
access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
access-control-max-age: 86400
server: cloudflare
```

| ヘッダ | 期待値 | 実測値 | 判定 |
|---|---|---|---|
| Strict-Transport-Security | `max-age=31536000; includeSubDomains` | **なし** | **FAIL** |
| Content-Security-Policy | セクション3.4の値 | **なし** | **FAIL** |
| CORS ヘッダ | 正常 | 正常（allow-origin, methods, headers 確認） | PASS |

### 4.3 不正ターゲット（400）

```
curl -I -H 'Origin: https://hima.agiinc.io' 'https://api-hima.agiinc.io/invalid-target'
```

```
HTTP/2 400
content-type: text/plain;charset=UTF-8
access-control-allow-origin: https://hima.agiinc.io
access-control-allow-headers: Content-Type, Authorization, x-api-key, anthropic-version
access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
access-control-max-age: 86400
server: cloudflare
```

| ヘッダ | 期待値 | 実測値 | 判定 |
|---|---|---|---|
| Strict-Transport-Security | `max-age=31536000; includeSubDomains` | **なし** | **FAIL** |
| Content-Security-Policy | セクション3.4の値 | **なし** | **FAIL** |
| CORS ヘッダ | 正常 | 正常 | PASS |

### 4.4 プロキシ応答（401 — API キー未設定）

```
curl -I -H 'Origin: https://hima.agiinc.io' \
  'https://api-hima.agiinc.io/https://api.openai.com/v1/models'
```

```
HTTP/2 401
content-type: application/json
strict-transport-security: max-age=31536000; includeSubDomains; preload
access-control-allow-origin: https://hima.agiinc.io
x-content-type-options: nosniff
server: cloudflare
```

| ヘッダ | 期待値 | 実測値 | 判定 |
|---|---|---|---|
| Strict-Transport-Security | Worker が付与した `max-age=31536000; includeSubDomains` | OpenAI 由来の `max-age=31536000; includeSubDomains; preload` | **FAIL**（Worker 自体が付与していない。上流レスポンスのパススルー） |
| Content-Security-Policy | セクション3.4の値 | **なし** | **FAIL** |
| CORS ヘッダ | 正常 | 正常 | PASS |

---

## 5. 原因分析

### Pages サービス（hima / agiinc / blog）
- `_headers` ファイルの変更がリポジトリに push 済みだが、Cloudflare Pages のデプロイが未反映の可能性。
- 考えられる原因:
  1. Cloudflare Pages の自動デプロイが未トリガー
  2. `_headers` ファイルのパスが Cloudflare Pages のビルド出力に含まれていない
  3. キャッシュが残っている

### Worker（api-hima）
- Worker コードの変更が push 済みだが `wrangler deploy` が未実行、またはデプロイ後のセキュリティヘッダ付与ロジックが動作していない。
- プロキシ応答のみ上流（OpenAI）の HSTS がパススルーされているが、Worker 自身は付与していない。

## 6. 推奨アクション

1. **Pages**: 各サービスの Cloudflare Pages ダッシュボードでデプロイ状況を確認。必要に応じて再デプロイ。
2. **Worker**: `wrangler deploy` でWorkerを再デプロイし、セキュリティヘッダロジックが正しく動作するか確認。
3. **キャッシュパージ**: Cloudflare ダッシュボードから全サービスのキャッシュをパージ後に再検証。
4. **再検証**: 上記対応後に本検証を再実施し、全項目 PASS を確認する。
