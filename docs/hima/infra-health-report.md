# Hima Infrastructure Health Baseline Report

作成日時: 2026-02-13T18:11:40Z
対象: ローンチ前ベースライン（4サービス）

## 対象サービス
- hima.agiinc.io
- api-hima.agiinc.io
- agiinc.io
- blog.agiinc.io

## 測定方法
- `curl` による HTTPS ヘルスチェック（ステータス＋`time_total`）
- HTTP→HTTPS リダイレクト確認（`curl -I http://...`）
- HTTPS レスポンスヘッダ確認（HSTS/CSP 等）
- DNS 確認（`dig +short A/AAAA/CNAME`）
- API Worker の CORS 確認（`OPTIONS` preflight + `Origin` 付き GET）

## 1) ヘルスチェック（単発）

| サービス | HTTPSステータス | `curl time_total`（秒） | 備考 |
|---|---:|---:|---|
| hima.agiinc.io | 200 | 0.272573 | 取得可能 |
| api-hima.agiinc.io | 403 | 0.153195 | ルートが禁止（403） |
| agiinc.io | 200 | 0.172023 | 取得可能 |
| blog.agiinc.io | 200 | 0.120232 | 取得可能 |

## 1b) レスポンス時間ベースライン（5回平均）

| サービス | サンプル数 | 平均（秒） | 最小（秒） | 最大（秒） |
|---|---:|---:|---:|---:|
| hima.agiinc.io | 5 | 0.106367 | 0.067986 | 0.165239 |
| api-hima.agiinc.io | 5 | 0.062373 | 0.047526 | 0.078255 |
| agiinc.io | 5 | 0.118842 | 0.074511 | 0.188855 |
| blog.agiinc.io | 5 | 0.103164 | 0.070946 | 0.143297 |

## 2) HTTPS リダイレクト

- hima.agiinc.io: `HTTP 301 Moved Permanently` → `https://hima.agiinc.io/`
- api-hima.agiinc.io: HTTPアクセス時も HTTPS にリダイレクトせず `HTTP 403`
- agiinc.io: `HTTP 301 Moved Permanently` → `https://agiinc.io/`
- blog.agiinc.io: `HTTP 301 Moved Permanently` → `https://blog.agiinc.io/`

## 3) セキュリティヘッダ確認

| サービス | HSTS | CSP | Referrer-Policy | X-Content-Type-Options | 備考 |
|---|---|---|---|---|---|
| hima.agiinc.io | ❌ 未確認（未設定） | ❌ 未確認（未設定） | ✅ `strict-origin-when-cross-origin` | ✅ `nosniff` | |
| api-hima.agiinc.io | ❌（403 応答時ヘッダのみ） | ❌ | なし | なし | 403 応答時のみ取得。 |
| agiinc.io | ❌ 未確認（未設定） | ❌ 未確認（未設定） | ✅ `strict-origin-when-cross-origin` | ✅ `nosniff` | |
| blog.agiinc.io | ❌ 未確認（未設定） | ❌ 未確認（未設定） | ✅ `strict-origin-when-cross-origin` | ✅ `nosniff` | |

## 4) DNS（Cloudflare向け解決）

共通して A/AAAA が Cloudflare Anycast IP（`104.21.14.73`, `172.67.158.44`, `2606:4700:3030::6815:e49`, `2606:4700:3036::ac43:9e2c` 系）へ解決。

- hima.agiinc.io: `CNAME` 無し、A/AAAA 解決あり
- api-hima.agiinc.io: `CNAME` 無し、A/AAAA 解決あり
- agiinc.io: `CNAME` 無し、A/AAAA 解決あり
- blog.agiinc.io: `CNAME` 無し、A/AAAA 解決あり

## 5) API Worker（api-hima.agiinc.io）CORS

- `OPTIONS`:
  - `HTTP/2 204`
  - `access-control-allow-origin: https://hima.agiinc.io`
  - `access-control-allow-headers: Content-Type, Authorization, x-api-key, anthropic-version`
  - `access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS`
- `Origin` 指定 GET:
  - `HTTP/2 400`（レスポンスボディ: `Missing or invalid target URL`）
  - 上記の CORS 許可ヘッダは付与

## 検出事項（修正なし・記録のみ）

1. `api-hima.agiinc.io` が HTTPSルートで `403` を返す。
2. 4サービスとも明示的な `Strict-Transport-Security` を確認できず。
3. `Content-Security-Policy` は4サービスで確認できず（現状のヘッダ内に未設定）。
4. API ワーカーは CORS は設定されているが、ルート GET が対象外（400）。

## I-01〜I-04 事前確認対応

- I-01: HTTPS可用性 — 全サービスで到達可能（api ルートは 403）。
- I-02: リダイレクト・TLS周辺挙動 — 主要3サービスはHTTP→HTTPS 301、APIは直接403（要要件確認）。
- I-03: DNS・エッジ到達 — Cloudflare への到達を確認。
- I-04: API CORS — Worker はOPTIONSで許可設定あり、Originヘッダ付与を確認。
