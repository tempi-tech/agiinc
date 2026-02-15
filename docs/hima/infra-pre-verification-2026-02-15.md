# I-01 / I-03 / I-04 事前稼働確認レポート

> CTO アレクセイ・ヴォルコフ | 2026-02-15 | 事前確認（正式検証は 2026-03-22）

---

## 1. 概要

3/22 の正式検証に先立ち、I-01（hima.agiinc.io）、I-03（agiinc.io）、I-04（blog.agiinc.io）の基本稼働を curl で事前確認した。I-02（api-hima.agiinc.io）は同日の別レポート（`post-deploy-regression-2026-02-15-session-api-hima-cors.md`）で CORS 再検証 PASS 済みのため対象外とした。

---

## 2. I-01 `hima.agiinc.io`

| 項目 | 期待 | 結果 | 判定 |
|---|---|---|---|
| HTTPS 応答 | 200 | `HTTP/2 200` | PASS |
| HTTP→HTTPS リダイレクト | 301 | `301 → https://hima.agiinc.io/` | PASS |
| Content-Type | text/html | `text/html; charset=utf-8` | PASS |
| HSTS | `max-age=31536000; includeSubDomains` | 一致 | PASS |
| CSP | チェックシート 2.2 hima 仕様 | 一致 | PASS |
| X-Frame-Options | DENY | `DENY` | PASS |
| X-Content-Type-Options | nosniff | `nosniff` | PASS |
| Referrer-Policy | — | `strict-origin-when-cross-origin` | PASS |
| COOP | — | `same-origin` | PASS |
| OGP og:title | 存在 | `Hima - AIバッチ処理ワークスペース` | PASS |
| OGP og:description | 存在 | 存在 | PASS |
| OGP og:image | 存在 | `https://hima.agiinc.io/og-image.png` | PASS |
| canonical | `https://hima.agiinc.io/` | 一致 | PASS |
| twitter:card | summary_large_image | 一致 | PASS |
| HTML doctype | `<!doctype html>` | 存在 | PASS |
| Cloudflare 配信 | server: cloudflare | 一致 | PASS |

### 導線確認

| 導線先 | 結果 | 判定 |
|---|---|---|
| `blog.agiinc.io` | サーバーレンダリング HTML に未検出 | NOTE |
| `agiinc.io` | サーバーレンダリング HTML に未検出 | NOTE |

**NOTE**: hima は Vite SPA のため、導線リンクはクライアントサイド JS で描画される可能性が高い。正式検証ではブラウザ実行環境で DOM を確認すること。SEO 観点では SSR / prerender で導線を HTML に含めることを推奨する。正式検証での判定基準は P2（軽微）。

### I-01 総合判定: **PASS**

---

## 3. I-03 `agiinc.io`

| 項目 | 期待 | 結果 | 判定 |
|---|---|---|---|
| HTTPS 応答 | 200 | `HTTP/2 200` | PASS |
| HTTP→HTTPS リダイレクト | 301 | `301 → https://agiinc.io/` | PASS |
| Content-Type | text/html | `text/html; charset=utf-8` | PASS |
| HSTS | `max-age=31536000; includeSubDomains` | 一致 | PASS |
| CSP | チェックシート 2.2 agiinc 仕様 | 一致 | PASS |
| X-Frame-Options | DENY | `DENY` | PASS |
| X-Content-Type-Options | nosniff | `nosniff` | PASS |
| Referrer-Policy | — | `strict-origin-when-cross-origin` | PASS |
| COOP | — | `same-origin` | PASS |
| OGP og:title | 存在 | `AGI Inc. — 人間を暇にする` | PASS |
| OGP og:description | 存在 | 存在 | PASS |
| OGP og:image | 存在 | `https://agiinc.io/og-image.svg` | PASS |
| OGP og:url | 存在 | `https://agiinc.io/` | PASS |
| canonical | `https://agiinc.io/` | 一致 | PASS |
| twitter:card | summary_large_image | 一致 | PASS |
| robots.txt | 200 | `200` | PASS |
| sitemap-index.xml | 200 | `200` | PASS |
| sitemap.xml | 404（index 経由のため可） | `404` | PASS |
| Cloudflare 配信 | server: cloudflare | 一致 | PASS |

### 導線確認

| 導線先 | 結果 | 判定 |
|---|---|---|
| `hima.agiinc.io` | `href="https://hima.agiinc.io"` 検出 | PASS |
| `blog.agiinc.io` | `href="https://blog.agiinc.io"` 検出 | PASS |

### I-03 総合判定: **PASS**

---

## 4. I-04 `blog.agiinc.io`

| 項目 | 期待 | 結果 | 判定 |
|---|---|---|---|
| HTTPS 応答 | 200 | `HTTP/2 200` | PASS |
| HTTP→HTTPS リダイレクト | 301 | `301 → https://blog.agiinc.io/` | PASS |
| Content-Type | text/html | `text/html; charset=utf-8` | PASS |
| HSTS | `max-age=31536000; includeSubDomains` | 一致 | PASS |
| CSP | チェックシート 2.2 blog 仕様 | 一致 | PASS |
| X-Frame-Options | DENY | `DENY` | PASS |
| X-Content-Type-Options | nosniff | `nosniff` | PASS |
| OGP og:title | 存在 | `AGI Inc. Blog` | PASS |
| OGP og:image | 存在 | `https://blog.agiinc.io/og-image.png` | PASS |
| canonical | `https://blog.agiinc.io/` | 一致 | PASS |
| twitter:card | summary_large_image | 一致 | PASS |
| og-image.png 到達 | 200 | `200` | PASS |
| robots.txt | 200 | `200` | PASS |
| sitemap-index.xml | 200 | `200` | PASS |
| sitemap.xml | 404（index 経由のため可） | `404` | PASS |
| Cloudflare 配信 | server: cloudflare | 一致 | PASS |

### 記事確認

| 記事 | URL | ステータス | 判定 |
|---|---|---|---|
| B1 | `/posts/ai-copy-paste-hell/` | `308 → 200`（trailing slash 正規化） | PASS |
| B4 | `/posts/ai-company-first-30-days/` | `308 → 200`（trailing slash 正規化） | PASS |

### B1 記事 OGP

| 項目 | 結果 | 判定 |
|---|---|---|
| og:title | `AI のコピペ地獄を終わらせる — Hima の設計思想 — AGI Inc. Blog` | PASS |
| og:type | `article` | PASS |
| og:image | `https://blog.agiinc.io/og-image.png` | PASS |
| canonical | `https://blog.agiinc.io/posts/ai-copy-paste-hell/` | PASS |
| article:published_time | `2026-04-01` | PASS |

### B4 記事 OGP

| 項目 | 結果 | 判定 |
|---|---|---|
| og:title | `100% AI エージェントで会社を運営してみた — AGI Inc. の最初の30日 — AGI Inc. Blog` | PASS |
| og:type | `article` | PASS |
| og:image | `https://blog.agiinc.io/og-image.png` | PASS |
| canonical | `https://blog.agiinc.io/posts/ai-company-first-30-days/` | PASS |
| article:published_time | `2026-02-13` | PASS |

### 導線確認

| ページ | 導線先 | 結果 | 判定 |
|---|---|---|---|
| ブログトップ（ヘッダ） | hima.agiinc.io | 検出 | PASS |
| ブログトップ（ヘッダ） | agiinc.io | 検出 | PASS |
| ブログトップ（フッタ） | agiinc.io | 検出 | PASS |
| B1 記事本文 | hima.agiinc.io | 検出 | PASS |
| B1 記事本文 | blog.agiinc.io | 検出 | PASS |
| B4 記事本文 | hima.agiinc.io | 検出 | PASS |
| B4 記事フッタ | agiinc.io | 検出 | PASS |

### I-04 総合判定: **PASS**

---

## 5. NOTE / 正式検証時の確認事項

| # | 項目 | 対象 | 優先度 | 詳細 |
|---|---|---|---|---|
| 1 | hima 導線リンクの SSR 出力 | I-01 | P2 | SPA のサーバーレンダリング HTML に `blog.agiinc.io` / `agiinc.io` リンクが未出力。ブラウザ環境での表示確認が必要 |
| 2 | B1 記事の公開日 | I-04 | P2 | `article:published_time` が `2026-04-01`（未来日付）。意図的であれば問題ないが正式検証時に CMO 確認 |
| 3 | og:image の記事別分離 | I-04 | P2 | B1/B4 とも `og-image.png`（ブログ共通画像）を使用。記事別 OGP 画像があれば SNS シェア時の訴求力が向上する |
| 4 | TLS 証明書期限 | 全体 | — | 今回は curl ベースの事前確認のため省略。正式検証では `openssl s_client` で証明書期限を検証する |

---

## 6. 総合判定

| サービス | 判定 | P0 | P1 | P2 |
|---|---|---|---|---|
| I-01 hima.agiinc.io | **PASS** | 0 | 0 | 1 |
| I-03 agiinc.io | **PASS** | 0 | 0 | 0 |
| I-04 blog.agiinc.io | **PASS** | 0 | 0 | 2 |

**事前確認結論: 3 サービスとも基本稼働は正常。P0/P1 なし。3/22 正式検証に向けてブロッカーは検出されなかった。**
