# post-deploy regression report (Session 5-10, 2026-02-14)

実施日時: 2026-02-14

## 検証対象
- hima.agiinc.io
- api-hima.agiinc.io
- agiinc.io
- blog.agiinc.io

## 結果サマリー
| サービス | PASS/FAIL | 重要度 | 備考 |
|---|---:|---:|---|
| hima.agiinc.io | PASS | - | 主要項目到達/SEO/セキュリティヘッダ/OGP画像とも期待通り |
| api-hima.agiinc.io | FAIL | P1 | 仕様意図（hima.agiinc.io以外は拒否想定）に対し、`evil.example.com` の OPTIONS 応答でも `access-control-allow-origin` が付与 |
| agiinc.io | PASS | - | トップ表示/OGP画像取得/CSP/HSTS 正常 |
| blog.agiinc.io | PASS | - | B1/B2/B4記事、導線、OGP、HSTS/CSP 正常 |

---

## 1) hima.agiinc.io
- PASS: `https://hima.agiinc.io/` が `200` で到達
- PASS: `robots.txt` の `content-type` が `text/plain; charset=utf-8`
- PASS: `sitemap.xml` の `content-type` が `application/xml`
- PASS: `og:title`, `og:description`, `og:image`, `og:url`, `og:site_name` が `<head>` から確認
- PASS: `canonical` が `https://hima.agiinc.io/`
- PASS: `strict-transport-security` が返却 (`max-age=31536000; includeSubDomains`)
- PASS: `content-security-policy` が付与
- PASS: `https://hima.agiinc.io/og-image.png` が `200`, `content-type: image/png`

---

## 2) api-hima.agiinc.io
- PASS: `GET /` が `403` で応答（未定義ルートとして応答可能。到達性とヘッダ付与は確認）
- PASS: `403` 応答で `HSTS` / `CSP` が付与
- PASS: `OPTIONS`（`Origin: https://hima.agiinc.io`）で `204` と `access-control-allow-origin: https://hima.agiinc.io` を返却
- **FAIL (P1):** `OPTIONS`（`Origin: https://evil.example.com`）でも `access-control-allow-origin: https://evil.example.com` を返却。`hima.agiinc.io` のみ許可するという CORS Origin 制御方針から逸脱。

---

## 3) agiinc.io
- PASS: `https://agiinc.io/` が `200` で表示可能
- PASS: OGP メタの `og:image` は `https://agiinc.io/og-image.svg`
- PASS: `https://agiinc.io/og-image.svg` が `200`, `content-type: image/svg+xml`
- PASS: `strict-transport-security` 付与
- PASS: `content-security-policy` 付与
- PASS: `hima.agiinc.io` への明示リンクが `<body>` 内に存在
- PASS: `canonical` が `https://agiinc.io/`

---

## 4) blog.agiinc.io
- PASS: `https://blog.agiinc.io/` が `200`
- PASS: B1記事 `https://blog.agiinc.io/posts/ai-company-first-30-days/` が `200`、OGP/Canonical取得可
- PASS: B2記事 `https://blog.agiinc.io/posts/ai-copy-paste-hell/` が `200`、OGP/Canonical取得可
- PASS: B4記事 `https://blog.agiinc.io/posts/hima-how-to-use-guide/`（draft）も `200`
- PASS: 各記事本文に `hima.agiinc.io` と `agiinc.io` の導線文字列が存在
- PASS: 共通 OGP画像 `https://blog.agiinc.io/og-image.png` が `200`, `content-type: image/png`
- PASS: `strict-transport-security` が各記事で付与
- PASS: `content-security-policy` が各記事で付与

---

## 重要アクション
1. `api-hima.agiinc.io` の OPTIONS 判定を修正し、許可 Origin 外では `access-control-allow-origin` を付与しない実装へ戻すこと。
2. 修正後、以下を再実行すること。
   - `curl -sI -X OPTIONS -H 'Origin: https://evil.example.com' -H 'Access-Control-Request-Method: POST' https://api-hima.agiinc.io`
   - 期待: `access-control-allow-origin` 非返却 または 4xx/5xx
