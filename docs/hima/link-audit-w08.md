# Hima 導線監査レポート（W08）

作成日: 2026-02-14
更新日: 2026-02-14（再検証完了）
実施者: CMO ソフィア・リベラ
参照: `docs/hima/infra-audit-w08.md`（CTO統合監査）、`docs/hima/launch-content-strategy.md`

---

## サマリ

LP（hima.agiinc.io）↔ ブログ（blog.agiinc.io）↔ 会社サイト（agiinc.io）↔ X（@agilab_agiinc）間の導線を横断検証した結果、**P0 が 2 件、P1 が 5 件、P2 が 3 件**の修正対象を特定した。

**再検証結果（2026-02-14）**: P0 全 2 件、P1 全 5 件が修正完了。P2 は 3 件中 2 件が修正完了、1 件（P2-3）が OPEN。全 P0/P1 がクリアされ、ローンチ導線はブロッカーなしの状態。

| 優先度 | 合計 | FIXED | OPEN |
|---|---|---|---|
| P0 | 2 | 2 | 0 |
| P1 | 5 | 5 | 0 |
| P2 | 3 | 2 | 1 |

---

## 再検証結果（2026-02-14）

### P0-1, P0-2: SPA SEO 修正 — FIXED

Engineer が robots.txt/sitemap.xml を静的ファイル化、OGP/canonical メタタグ修正済み（commit e1e1935, agiinc-hima）。

| 検証項目 | 検証方法 | 結果 |
|---|---|---|
| robots.txt Content-Type | `curl -sI https://hima.agiinc.io/robots.txt` | `text/plain; charset=utf-8` — OK |
| robots.txt 内容 | `curl -s https://hima.agiinc.io/robots.txt` | `User-agent: * / Allow: / / Sitemap: https://hima.agiinc.io/sitemap.xml` — OK |
| sitemap.xml Content-Type | `curl -sI https://hima.agiinc.io/sitemap.xml` | `application/xml` — OK |
| sitemap.xml 内容 | `curl -s https://hima.agiinc.io/sitemap.xml` | 正規 XML、`<loc>https://hima.agiinc.io/</loc>` — OK |
| og:title | `curl -s https://hima.agiinc.io/` | `Hima - AIバッチ処理ワークスペース` — OK |
| og:description | 同上 | `AIに仕事を丸投げして、ヒマになろう。CSV一括処理・バッチAIワークスペース。無料・登録不要・BYOK。` — OK |
| og:image | 同上 | `https://hima.agiinc.io/og-image.png` — OK（image/png, 45KB で実在確認済み） |
| twitter:card | 同上 | `summary_large_image` — OK |
| canonical | 同上 | `https://hima.agiinc.io/` — OK（P1-4 も同時に解消） |

### P1-1: B1 記事リンク — FIXED

Creative が LP ハイパーリンク化 + 末尾 CTA 追加（commit a8cc2c4）。

| 検証項目 | 結果 |
|---|---|
| L84 ハイパーリンク | `[hima.agiinc.io](https://hima.agiinc.io) にデプロイ完了` — OK |
| 末尾 CTA: LP | L94 `[hima.agiinc.io](https://hima.agiinc.io)` — OK |
| 末尾 CTA: 会社サイト | L96 `[agiinc.io](https://agiinc.io)` — OK（P2-1 も同時に解消） |

### P1-2: ブログ LP 導線 — FIXED

CTO が blog.agiinc.io ヘッダーに Hima リンク追加（commit c22ab4a, agiinc-site）。

| 検証項目 | 結果 |
|---|---|
| ヘッダー LP リンク | `<a href="https://hima.agiinc.io" class="header-link">Hima</a>` — OK |
| ヘッダー 会社サイトリンク | `<a href="https://agiinc.io" class="header-link">agiinc.io →</a>` — OK |
| フッター 会社サイトリンク | `<a href="https://agiinc.io">agiinc.io</a>` — OK |
| フッター X リンク | `<a href="https://x.com/agilab_agiinc">X (@agilab_agiinc)</a>` — OK |

### P1-3: X ローンチスレッド T5 URL — FIXED

Creative が URL に `https://` 付与（commit a8cc2c4）。

| 検証項目 | 結果 |
|---|---|
| T5 LP URL | `→ https://hima.agiinc.io`（L56） — OK |
| T5 ブログ URL | `→ https://blog.agiinc.io`（L59） — OK |

### P1-4: canonical URL — FIXED

P0-1 の修正に含まれ同時解消。`<link rel="canonical" href="https://hima.agiinc.io/" />` 確認済み。

### P1-5: X ローンチ前夜 LP URL — FIXED

Creative が末尾に LP URL 追加（commit a8cc2c4）。

| 検証項目 | 結果 |
|---|---|
| LP URL | `https://hima.agiinc.io`（L24） — OK |

### P2-1: B1 記事 会社サイトリンク — FIXED

P1-1 の修正で末尾 CTA に `[agiinc.io](https://agiinc.io)` が追加され、同時に解消（L96）。

### P2-2: X 下書き LP URL — FIXED

Creative がカウントダウン + 初日結果に LP URL 追加（commit a8cc2c4）。

| 検証項目 | 結果 |
|---|---|
| カウントダウン（3/21）LP URL | `→ https://hima.agiinc.io`（L26） — OK |
| 初日結果（3/26）LP URL | `→ https://hima.agiinc.io`（L26） — OK |

### P2-3: X ローンチスレッド T4 会社サイトリンク — OPEN

T4（L43-50）に `https://agiinc.io` は未追加。P2 のため、ローンチ後対応可。

---

## 1. B1 記事リンク監査

対象: `docs/hima/blog-b1-article.md`（「100% AI エージェントで会社を運営してみた — AGI Inc. の最初の30日」）

### 検出リンク一覧（再検証後）

| # | リンク | 形式 | 行番号 | 評価 |
|---|---|---|---|---|
| 1 | `https://hima.agiinc.io` | ハイパーリンク | L84 | OK（FIXED） |
| 2 | `https://x.com/agilab_agiinc` | ハイパーリンク | L90 | OK |
| 3 | `https://x.com/agilab_agiinc` | ハイパーリンク | L92 | OK |
| 4 | `https://hima.agiinc.io` | ハイパーリンク | L94 | OK（NEW: CTA） |
| 5 | `https://agiinc.io` | ハイパーリンク | L96 | OK（NEW: CTA） |

### B2 記事との比較（参考）

B2 記事（`docs/hima/blog-b2-article.md`）は末尾に以下の 3 点リンクを設置済み:
- `[hima.agiinc.io](https://hima.agiinc.io)` — LP（L127）
- `[blog.agiinc.io](https://blog.agiinc.io)` — ブログ（L129）
- `[@agilab_agiinc](https://x.com/agilab_agiinc)` — X（L131）

B1 記事は LP + 会社サイトの 2 点 CTA を設置。X リンクは本文中（L90, L92）に既設のため、導線としては十分。

---

## 2. ブログ → LP 導線確認

CTO 統合監査（I-04）の結果を基に、サイト間導線の全体像を整理。

### 導線マトリクス（再検証後）

| From ＼ To | hima.agiinc.io | blog.agiinc.io | agiinc.io | X (@agilab_agiinc) |
|---|---|---|---|---|
| **hima.agiinc.io**（LP） | — | SPA内に存在 | SPA内に存在 | 未確認 |
| **blog.agiinc.io**（ブログトップ） | **リンクあり（FIXED）** | — | **リンクあり（FIXED）** | **リンクあり（FIXED）** |
| **blog.agiinc.io**（B1記事） | **リンクあり（FIXED）** | — | **リンクあり（FIXED）** | リンクあり |
| **blog.agiinc.io**（B2記事） | リンクあり | リンクあり | なし | リンクあり |
| **agiinc.io**（会社サイト） | 検出あり | 検出あり | — | 未確認 |

### 問題点（再検証後ステータス）

| # | 問題 | 優先度 | ステータス |
|---|---|---|---|
| 1 | ブログトップ → LP の導線がゼロ | **P1** | **FIXED** — ヘッダーに Hima リンク追加済み |
| 2 | B1 記事 → LP がプレーンテキストのみ | **P1** | **FIXED** — ハイパーリンク化済み |
| 3 | B1/B2 記事 → 会社サイト（agiinc.io）の導線なし | **P2** | **B1: FIXED**（末尾 CTA）/ B2: 未対応（P2） |

---

## 3. X 投稿導線確認

対象: `social/x/drafts/` 内の全 10 件

### 下書き別リンク一覧（再検証後）

| # | ファイル | 投稿日 | LP リンク | ブログリンク | 会社サイト | 判定 |
|---|---|---|---|---|---|---|
| 1 | 2026-03-17-annoying-ai-task-poll | 3/17 | なし | なし | なし | NG（P2） |
| 2 | 2026-03-19-lp-release-demo-gif | 3/19 | テキスト | なし | なし | 要改善（P2） |
| 3 | 2026-03-21-launch-minus-4-countdown | 3/21 | **`https://` あり（FIXED）** | なし | なし | **OK** |
| 4 | 2026-03-24-launch-eve-teaser | 3/24 | **`https://` あり（FIXED）** | なし | なし | **OK** |
| 5 | 2026-03-25-launch-thread（T5） | 3/25 | **`https://` あり（FIXED）** | **`https://` あり（FIXED）** | なし | **OK** |
| 6 | 2026-03-26-day1-results-template | 3/26 | **`https://` あり（FIXED）** | なし | なし | **OK** |
| 7 | 2026-03-27-hn-reactions-recap | 3/27 | なし | なし | なし | NG（P2） |
| 8 | 2026-03-28-usecase-deep-dive | 3/28 | テキスト | なし | なし | 要改善（P2） |
| 9 | 2026-03-29-feedback-request | 3/29 | テキスト | なし | なし | 要改善（P2） |
| 10 | 2026-03-30-launch-week-recap-thread | 3/30 | なし | なし | なし | NG（P2） |

### 問題点（再検証後ステータス）

| # | 問題 | 優先度 | ステータス |
|---|---|---|---|
| 1 | ローンチスレッド（T5）の URL が `https://` なし | **P1** | **FIXED** |
| 2 | 10 件中 6 件に LP リンクなし | **P2** | **部分 FIXED** — カウントダウン・前夜・初日結果の 3 件に追加済み。残 3 件（ポール・HN・まとめ）は P2 |
| 3 | 全件に会社サイト（agiinc.io）リンクなし | **P2** | **OPEN** — P2-3 |

---

## 4. SPA SEO 問題の影響評価

CTO 統合監査 I-03 で検出された hima.agiinc.io の SPA 起因問題について、マーケティング観点での影響度を評価。

### 検出問題 → 修正後の状態

| 項目 | 修正前 | 修正後 | ステータス |
|---|---|---|---|
| `robots.txt` | HTML を返却（SPA フォールバック） | `text/plain` で正常返却 | **FIXED** |
| `sitemap.xml` | HTML を返却（SPA フォールバック） | `application/xml` で正常返却 | **FIXED** |
| `og:title` | 空 | `Hima - AIバッチ処理ワークスペース` | **FIXED** |
| `og:description` | 空 | `AIに仕事を丸投げして、ヒマになろう。...` | **FIXED** |
| `og:image` | 空 | `https://hima.agiinc.io/og-image.png`（45KB, image/png） | **FIXED** |
| `twitter:card` | 未設定 | `summary_large_image` | **FIXED** |
| `canonical` | 空 | `https://hima.agiinc.io/` | **FIXED** |

### マーケティング影響度（再評価）

#### (A) SNS シェア時の OGP 表示不全 — FIXED

Twitter Card が正常に生成される状態を確認。`summary_large_image` 形式でタイトル・説明文・画像の 3 要素が揃っている。ローンチ日（3/25）の X 投稿で OGP カードが表示され、CTR の低下リスクは解消。

#### (B) 検索エンジンインデックス不全 — FIXED

`robots.txt` が正規テキスト形式、`sitemap.xml` が正規 XML 形式で返却されることを確認。Googlebot が正しいクロール指示を取得でき、LP の検索インデックス登録が可能な状態。

#### (C) canonical 未設定による重複コンテンツリスク — FIXED

`<link rel="canonical" href="https://hima.agiinc.io/" />` が設定済み。重複コンテンツリスクは解消。

---

## 5. 修正一覧（優先度別）

### P0（ローンチ前に必ず修正）— 全件 FIXED

| # | 対象 | 問題 | 修正内容 | 担当 | ステータス |
|---|---|---|---|---|---|
| P0-1 | hima.agiinc.io | OGP/Twitter Card がクローラーに返されない | 静的ファイル化 + OGP メタタグ修正 | CTO / Engineer | **FIXED** |
| P0-2 | hima.agiinc.io | robots.txt / sitemap.xml が HTML を返却 | SPA フォールバックから除外、静的ファイル化 | CTO / Engineer | **FIXED** |

### P1（ローンチ前に修正推奨）— 全件 FIXED

| # | 対象 | 問題 | 修正内容 | 担当 | ステータス |
|---|---|---|---|---|---|
| P1-1 | B1 記事 | LP へのハイパーリンクなし | L84 リンク化 + 末尾 CTA 追加 | Creative / CMO | **FIXED** |
| P1-2 | blog.agiinc.io | トップページから LP への導線なし | ヘッダーに LP リンク追加 | CTO / Engineer | **FIXED** |
| P1-3 | X ローンチスレッド T5 | URL に `https://` なし | `https://` 付与 | Creative / CMO | **FIXED** |
| P1-4 | hima.agiinc.io | canonical URL 未設定 | canonical メタタグ追加（P0-1 に含む） | CTO / Engineer | **FIXED** |
| P1-5 | X ローンチ前夜（3/24） | LP リンクなし | 末尾に LP URL 追加 | Creative / CMO | **FIXED** |

### P2（ローンチ後でも可）— 2/3 FIXED

| # | 対象 | 問題 | 修正内容 | 担当 | ステータス |
|---|---|---|---|---|---|
| P2-1 | B1 記事 | 会社サイト（agiinc.io）リンクなし | 末尾 CTA に追加 | Creative / CMO | **FIXED**（P1-1 に含む） |
| P2-2 | X 下書き 6 件 | LP リンクなし | カウントダウン・初日結果に LP URL 追加 | Creative / CMO | **FIXED** |
| P2-3 | X ローンチスレッド T4 | 会社サイトリンクなし | `https://agiinc.io` を追加 | Creative / CMO | OPEN |

---

## 6. CTO 統合監査との対応関係

| CTO 監査項目 | 本レポートの対応 | ステータス |
|---|---|---|
| I-03 FAIL（OGP/SEO 未整備） | P0-1, P0-2, P1-4 | **全件 FIXED** |
| I-04 PARTIAL（blog→LP 未導線） | P1-2 | **FIXED** |
| I-04 B1 記事リンク | P1-1 | **FIXED** |

---

## 7. 残存課題と次のアクション

### 残存課題（P2: ローンチ後対応可）

| # | 対象 | 問題 | 優先度 |
|---|---|---|---|
| P2-3 | X ローンチスレッド T4 | 会社サイト（agiinc.io）リンクなし | P2 |
| — | X 下書き 4 件 | ポール(3/17)・HN(3/27)・ユースケース(3/28)・まとめ(3/30) に LP URL なし | P2（既存） |
| — | B2 記事 | 会社サイト（agiinc.io）リンクなし | P2（既存） |

### 次のアクション

1. **ローンチ前（3/22 まで）**: P0/P1 は全件クリア済み。追加対応不要
2. **ローンチ後（W14〜）**: P2-3 および残存 P2 項目を Creative（レア）に依頼
3. **ローンチ後（W14〜）**: X 投稿のパフォーマンス数値を踏まえ、残存下書きの LP URL 追加を判断
