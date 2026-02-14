# Hima インフラ統合監査（事前チェック）

作成日: 2026-02-14 12:58:56 JST
実施者: AGI Inc. CTO（アレクセイ・ヴォルコフ）
対象: hima.agiinc.io / api-hima.agiinc.io / agiinc.io / blog.agiinc.io
参照: `docs/hima/security-headers-spec.md`

## サマリ

HSTS/CSP 実装は **4サービスでヘッダ付与自体は到達確認済み**。
一方で、SEO 要件として明示されている `robots.txt` / `sitemap.xml` / OGP メタ情報はサービス横断で不一致があり、**I-03 は要是正**。特に `hima.agiinc.io` は `robots.txt` / `sitemap.xml` が SPA の HTML を返しており、形式が不正。

---

## I-01 HTTPS + ステータス確認

### 実測結果

| サービス | HTTPS ステータス | HTTP→HTTPS 挙動 |
|---|---:|---|
| hima.agiinc.io | 200 | 301 → https://hima.agiinc.io/ |
| api-hima.agiinc.io | 403 | 403 |
| agiinc.io | 200 | 301 → https://agiinc.io/ |
| blog.agiinc.io | 200 | 301 → https://blog.agiinc.io/ |

### 判定
- `hima`/`agiinc`/`blog`: 正常到達
- `api-hima`: 到達自体は 403 で、Worker 根本仕様（ルート無効化）を前提とする想定。API エンドポイント導線は 4xx による拒否は仕様内であるため、**要件として「稼働可能」判定。**

---

## I-02 セキュリティヘッダ確認（HSTS / CSP）

### 実測結果

| サービス | HSTS | CSP | 仕様適合 | 補足 |
|---|---|---|---|---|
| hima.agiinc.io | `max-age=31536000; includeSubDomains` | `default-src 'self'; base-uri 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://api-hima.agiinc.io; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; form-action 'self'; media-src 'self'; manifest-src 'self'; upgrade-insecure-requests;` | PASS | 仕様 3.1 一致 |
| agiinc.io | `max-age=31536000; includeSubDomains` | `default-src 'self'; base-uri 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self'; connect-src 'self'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; form-action 'self'; media-src 'self'; manifest-src 'self'; worker-src 'none'; upgrade-insecure-requests;` | PASS | 仕様 3.2 一致 |
| blog.agiinc.io | `max-age=31536000; includeSubDomains` | `default-src 'self'; base-uri 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self'; connect-src 'self'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; form-action 'self'; media-src 'self'; manifest-src 'self'; worker-src 'none'; upgrade-insecure-requests;` | PASS | 仕様 3.3 一致 |
| api-hima.agiinc.io | `max-age=31536000; includeSubDomains` | `default-src 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; script-src 'none'; style-src 'none'; img-src 'none'; media-src 'none'; connect-src 'self'; form-action 'none'; worker-src 'none';` | PASS | 仕様 3.4 一致 |

### CORS補足（Worker）
- OPTIONS: 204 / `access-control-allow-origin: https://hima.agiinc.io` / `allow-methods: GET, POST, PUT, DELETE, OPTIONS` / `allow-headers: Content-Type, Authorization, x-api-key, anthropic-version`
- GET（`api-hima.agiinc.io/`）: 400 / HSTS + CSP 付与済み
- GET（`api-hima.agiinc.io/https://api.openai.com/v1/chat/completions`）: 401 / HSTS + CSP 付与済み

---

## I-03 OGP / SEO 確認

### 1) ページメタ

| サービス | `og:title` | `og:image` | canonical | robots.txt | sitemap |
|---|---|---|---|---|---|
| hima.agiinc.io | 取得不可（空） | 取得不可（空） | 取得不可（空） | 取得不可（HTMLを返却） | `sitemap.xml` が HTML を返却（不正） |
| agiinc.io | `AGI Inc. — 人間を暇にする` | `https://agiinc.io/og-image.svg` | `https://agiinc.io/` | 正常（`/robots.txt`） | `robots.txt` は `sitemap-index.xml` を参照。`/sitemap.xml` は 404 |
| blog.agiinc.io | `AGI Inc. Blog` | `https://blog.agiinc.io/og-image.png` | `https://blog.agiinc.io/` | 正常（`/robots.txt`） | `robots.txt` は `sitemap-index.xml` を参照。`/sitemap.xml` は 404 |

### 判定
- `agiinc.io` / `blog.agiinc.io`: OGP と canonical は PASS。
- `hima.agiinc.io`: OGP/SEO メタと robots/sitemap の運用形が未整備。
- いずれも `sitemap-index.xml`（agiinc/blog）は有効で、`/sitemap.xml` 404 は意図した場合のみ pass。ただし hima は `sitemap.xml` が 404 ではなく HTML 返却となるため不正。

---

## I-04 導線確認（LP/会社/ブログ）

### 測定結果

- LP（hima）→ブログ: `https://blog.agiinc.io` が SPA バンドル内に存在（1件）
- LP（hima）→会社サイト: `https://agiinc.io` が SPA バンドル内に存在（1件）
- ブログ（トップ）→LP: `hima.agiinc.io` は未検出
- 会社（agiinc.io）→LP: `hima.agiinc.io` は検出
- 会社（agiinc.io）→ブログ: `blog.agiinc.io` は検出

### 判定
- LP からの主要導線（hima→blog/agiinc）は実装あり。
- ブログ→LP は未確認。

---

## B2 記事確認（`/posts/ai-copy-paste-hell/`）

- URL: `https://blog.agiinc.io/posts/ai-copy-paste-hell/`
- ステータス: 200
- `og:title`: `AI のコピペ地獄を終わらせる — Hima の設計思想 — AGI Inc. Blog`
- `og:image`: `https://blog.agiinc.io/og-image.png`
- canonical: `https://blog.agiinc.io/posts/ai-copy-paste-hell/`

---

## 総合判定

- I-01: **PASS（要件通り到達）**
- I-02: **PASS（HSTS/CSP 実装整合）**
- I-03: **FAIL（hima の robots/sitemap/OGP/Canonical の不足）**
- I-04: **PARTIAL（blog→LP 未導線）**

## 対応アクション（優先）

1. hima 側の SEO リリース資産追加（`robots.txt` と `sitemap.xml`（or sitemap-index の明示）および OGP/`canonical` 付与）
2. `blog.agiinc.io` のヘッダ/フッターメニューに `hima.agiinc.io` への導線追加
3. 上記反映後、I-03/I-04 を再検証し再監査
