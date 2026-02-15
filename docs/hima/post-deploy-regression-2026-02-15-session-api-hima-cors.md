# api-hima CORS 再デプロイ検証レポート（2026-02-15）

- 実施日: 2026-02-15
- 環境: 本番 (`api-hima.agiinc.io`)
- リポジトリ: `agiinc-hima`
- 対象コミット: `68382ea`
- デプロイ成果物: Worker Version `7bcb2666-2072-4101-a74e-eecc7552a403`
- 実施者: CTO（再確認実施）
- 参照: `docs/hima/launch-checklist.md`

## 前提

- `ALLOWED_ORIGIN=https://hima.agiinc.io`
- 405/401/403 は API キー未設定前提で許容。重要なのは「許可 Origin のときに CORS ヘッダが付与されるか」と「不許可 Origin には付与されないか」。

## 実施コマンドと結果

1. 許可 Origin の OPTIONS プリフライト

```bash
curl -i -s -X OPTIONS \
  -H 'Origin: https://hima.agiinc.io' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: content-type,authorization,x-api-key,anthropic-version' \
  'https://api-hima.agiinc.io'
```

結果（先頭ヘッダ）:
- ステータス: `HTTP/2 204`
- `access-control-allow-origin: https://hima.agiinc.io`
- `access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS`
- `access-control-allow-headers: Content-Type, Authorization, x-api-key, anthropic-version`
- `strict-transport-security` および `content-security-policy` が付与

2. 許可外 Origin の OPTIONS リクエスト

```bash
curl -i -s -X OPTIONS \
  -H 'Origin: https://evil.example.com' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: content-type,authorization,x-api-key,anthropic-version' \
  'https://api-hima.agiinc.io'
```

結果（先頭ヘッダ）:
- ステータス: `HTTP/2 403`
- `access-control-allow-origin` は未付与
- CSP/HSTS は付与済み
- ボディ: `Forbidden`

3. 許可 Origin の通常 POST（OpenAI 経路、APIキー未設定）

```bash
curl -i -s -X POST \
  -H 'Origin: https://hima.agiinc.io' \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: test-key' \
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}]}' \
  'https://api-hima.agiinc.io/https://api.openai.com/v1/chat/completions'
```

結果（先頭ヘッダ）:
- ステータス: `HTTP/2 401`
- `access-control-allow-origin: https://hima.agiinc.io`
- OpenAI から `invalid_request_error`（API key missing）を受け取り、転送到達を確認

## 判定

- 許可 Origin（`hima.agiinc.io`）: CORSヘッダ付与 **PASS**
- 許可外 Origin: CORSヘッダ不付与 **PASS**
- OPTIONS プリフライト: `204` + allow headers **PASS**

## 結論

api-hima の CORS Origin 制御 P1 再デプロイ後検証を完了。対象項目は本番環境で `PASS`。
