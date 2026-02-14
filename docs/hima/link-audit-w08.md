# Hima 導線監査レポート（W08）

作成日: 2026-02-14
実施者: CMO ソフィア・リベラ
参照: `docs/hima/infra-audit-w08.md`（CTO統合監査）、`docs/hima/launch-content-strategy.md`

---

## サマリ

LP（hima.agiinc.io）↔ ブログ（blog.agiinc.io）↔ 会社サイト（agiinc.io）↔ X（@agilab_agiinc）間の導線を横断検証した結果、**P0 が 2 件、P1 が 5 件、P2 が 3 件**の修正対象を特定。

最大の問題は 2 つ。(1) hima.agiinc.io の SPA フォールバックにより OGP/robots.txt/sitemap.xml が正常に返されず、SNS シェア時のカード表示と検索エンジンクロールが完全に機能しない点。(2) B1 記事内に LP（hima.agiinc.io）へのハイパーリンクが存在せず、ブログから LP への導線が断絶している点。

B2 記事は LP・ブログ・X の 3 点リンクが適切に設置されており、B1 記事の修正時のリファレンスとなる。

---

## 1. B1 記事リンク監査

対象: `docs/hima/blog-b1-article.md`（「100% AI エージェントで会社を運営してみた — AGI Inc. の最初の30日」）

### 検出リンク一覧

| # | リンク | 形式 | 行番号 | 評価 |
|---|---|---|---|---|
| 1 | `https://x.com/agilab_agiinc` | ハイパーリンク | L90 | OK |
| 2 | `https://x.com/agilab_agiinc` | ハイパーリンク | L92 | OK |
| 3 | `hima.agiinc.io` | プレーンテキスト（リンクなし） | L84 | NG |

### 不足リンク

| # | 不足箇所 | 期待されるリンク先 | 優先度 | 理由 |
|---|---|---|---|---|
| 1 | L84「hima.agiinc.io にデプロイ完了」 | `https://hima.agiinc.io` | **P1** | LP への直接導線が断絶。記事を読んだユーザーがプロダクトに到達できない |
| 2 | 記事末尾の CTA | `https://hima.agiinc.io` | **P1** | B2 記事のように末尾に LP リンクを設置すべき |
| 3 | 記事末尾の CTA | `https://agiinc.io` | **P2** | 会社サイトへの導線。B2 では設置済みだが B1 にはない |

### B2 記事との比較（参考）

B2 記事（`docs/hima/blog-b2-article.md`）は末尾に以下の 3 点リンクを設置済み:
- `[hima.agiinc.io](https://hima.agiinc.io)` — LP（L127）
- `[blog.agiinc.io](https://blog.agiinc.io)` — ブログ（L129）
- `[@agilab_agiinc](https://x.com/agilab_agiinc)` — X（L131）

B1 記事も同一フォーマットで LP・ブログ・X の 3 点リンクを末尾 CTA に揃えるべき。

### 推奨修正

B1 記事に以下を追加:

1. L84 の「hima.agiinc.io にデプロイ完了」を `[hima.agiinc.io](https://hima.agiinc.io) にデプロイ完了` にハイパーリンク化
2. 記事末尾（L92 付近）に B2 と同じ 3 点リンク CTA を追加:

```
→ **[hima.agiinc.io](https://hima.agiinc.io)** — 無料・登録不要・BYOK

→ **[agiinc.io](https://agiinc.io)** — AGI Inc. 会社サイト
```

---

## 2. ブログ → LP 導線確認

CTO 統合監査（I-04）の結果を基に、サイト間導線の全体像を整理。

### 導線マトリクス

| From ＼ To | hima.agiinc.io | blog.agiinc.io | agiinc.io | X (@agilab_agiinc) |
|---|---|---|---|---|
| **hima.agiinc.io**（LP） | — | SPA内に存在 | SPA内に存在 | 未確認 |
| **blog.agiinc.io**（ブログトップ） | **未検出** | — | 未確認 | 未確認 |
| **blog.agiinc.io**（B1記事） | テキストのみ（リンクなし） | — | なし | リンクあり |
| **blog.agiinc.io**（B2記事） | リンクあり | リンクあり | なし | リンクあり |
| **agiinc.io**（会社サイト） | 検出あり | 検出あり | — | 未確認 |

### 問題点

| # | 問題 | 優先度 | 対応案 |
|---|---|---|---|
| 1 | ブログトップ → LP の導線がゼロ | **P1** | ブログのヘッダーまたはフッターに LP リンクを追加（CTO 監査 I-04 でも同指摘） |
| 2 | B1 記事 → LP がプレーンテキストのみ | **P1** | 上記セクション 1 の修正で対応 |
| 3 | B1/B2 記事 → 会社サイト（agiinc.io）の導線なし | **P2** | 記事末尾 CTA に追加 |

### 推奨修正

- **blog.agiinc.io のサイト共通ナビゲーション**（ヘッダーまたはフッター）に `hima.agiinc.io` へのリンクを追加。CTO 統合監査の対応アクション #2 と合致
- B1 記事の個別修正は上記セクション 1 参照

---

## 3. X 投稿導線確認

対象: `social/x/drafts/` 内の全 10 件

### 下書き別リンク一覧

| # | ファイル | 投稿日 | LP リンク | ブログリンク | 会社サイト | X アカウント | 判定 |
|---|---|---|---|---|---|---|---|
| 1 | 2026-03-17-annoying-ai-task-poll | 3/17 | なし | なし | なし | なし | NG |
| 2 | 2026-03-19-lp-release-demo-gif | 3/19 | `hima.agiinc.io`（テキスト） | なし | なし | なし | 要改善 |
| 3 | 2026-03-21-launch-minus-4-countdown | 3/21 | なし | なし | なし | なし | NG |
| 4 | 2026-03-24-launch-eve-teaser | 3/24 | なし | なし | なし | なし | NG |
| 5 | 2026-03-25-launch-thread（T5） | 3/25 | `hima.agiinc.io`（テキスト） | `blog.agiinc.io`（テキスト） | なし | なし | 要改善 |
| 6 | 2026-03-26-day1-results-template | 3/26 | なし | なし | なし | なし | NG |
| 7 | 2026-03-27-hn-reactions-recap | 3/27 | なし | なし | なし | なし | NG |
| 8 | 2026-03-28-usecase-deep-dive | 3/28 | `hima.agiinc.io`（テキスト） | なし | なし | なし | 要改善 |
| 9 | 2026-03-29-feedback-request | 3/29 | `hima.agiinc.io`（テキスト） | なし | なし | なし | 要改善 |
| 10 | 2026-03-30-launch-week-recap-thread | 3/30 | なし | なし | なし | なし | NG |

### 問題点

| # | 問題 | 優先度 | 対応案 |
|---|---|---|---|
| 1 | ローンチスレッド（T5）の URL が `https://` なし | **P1** | `https://hima.agiinc.io`、`https://blog.agiinc.io` に修正。X はプレーンテキスト URL でもリンク化するが、https:// を明示すべき |
| 2 | 10 件中 6 件に LP リンクなし | **P2** | 最低でもカウントダウン（3/21）・ローンチ前夜（3/24）・初日結果（3/26）に LP URL を追加 |
| 3 | 全件に会社サイト（agiinc.io）リンクなし | **P2** | ローンチスレッド T4（AGI Inc. ストーリー）に `agiinc.io` を追加推奨 |

### 推奨修正（優先順）

1. **ローンチスレッド T5**（最重要）:
   - `hima.agiinc.io` → `https://hima.agiinc.io`
   - `blog.agiinc.io` → `https://blog.agiinc.io`

2. **ローンチ前夜（3/24）** に LP URL を追加:
   - 末尾に `https://hima.agiinc.io` を 1 行追加

3. **初日結果（3/26）** に LP URL を追加:
   - 末尾に `→ https://hima.agiinc.io` を 1 行追加

4. **カウントダウン（3/21）** に LP URL を追加:
   - 末尾に `→ https://hima.agiinc.io` を 1 行追加

---

## 4. SPA SEO 問題の影響評価

CTO 統合監査 I-03 で検出された hima.agiinc.io の SPA 起因問題について、マーケティング観点での影響度を評価。

### 検出問題

| 項目 | 現状 | 正常時の期待値 |
|---|---|---|
| `robots.txt` | HTML を返却（SPA フォールバック） | テキストファイル（User-agent / Allow / Sitemap 記述） |
| `sitemap.xml` | HTML を返却（SPA フォールバック） | XML ファイル（URL 一覧） |
| `og:title` | 空 | `Hima — バッチ AI ワークスペース` 等 |
| `og:image` | 空 | OGP 画像 URL |
| `canonical` | 空 | `https://hima.agiinc.io/` |

### マーケティング影響度

#### (A) SNS シェア時の OGP 表示不全 — **P0**

X ローンチスレッド（3/25）で `hima.agiinc.io` を投稿した際、Twitter Card が正常に生成されない。タイトル・説明文・画像が空のカードでは CTR が大幅に低下する。

- 影響範囲: X ローンチスレッド T5、W12〜W13 の全 LP リンク投稿、HN/Reddit 投稿
- 定量影響（推定）: OGP なしの URL は OGP ありと比較して CTR が 40〜60% 低下（業界ベンチマーク）
- ローンチ日（3/25）の初動トラフィック目標 300 UV に直結

**備考**: チェックリスト S-01 で「hima の index.html に OGP/Twitter Card メタタグを新規追加」済みとの記録がある。しかし CTO の実測（I-03）では OGP が空として検出されている。SPA の index.html にメタタグを埋め込んでも、クローラーが JavaScript を実行しない場合は取得できない可能性がある。SSR/プリレンダリングの有無を CTO と確認すべき。

#### (B) 検索エンジンインデックス不全 — **P0**

`robots.txt` が HTML を返すことで、Googlebot が正しいクロール指示を取得できない。`sitemap.xml` も同様に不正な形式のため、LP のページが検索インデックスに登録されない可能性が高い。

- 影響範囲: オーガニック検索経由の全流入
- 定量影響: ローンチ後 1 ヶ月の月間 UV 目標 1,000 のうち、オーガニック流入分（推定 30〜40%）が消失
- 長期的な SEO 資産の構築が遅延

#### (C) canonical 未設定による重複コンテンツリスク — **P1**

canonical が空のため、検索エンジンが正規 URL を判定できない。パラメータ付き URL やトレイリングスラッシュ差異で重複ページと判定されるリスクがある。

### 推奨アクション

| # | アクション | 担当 | 優先度 |
|---|---|---|---|
| 1 | hima.agiinc.io の OGP メタタグが実際にクローラーに返されているか確認。SSR/プリレンダリングの検討 | CTO | **P0** |
| 2 | `robots.txt` / `sitemap.xml` を SPA フォールバックから除外し、静的ファイルとして配信 | CTO / Engineer | **P0** |
| 3 | canonical URL の設定確認・修正 | CTO / Engineer | **P1** |

---

## 5. 修正一覧（優先度別）

### P0（ローンチ前に必ず修正）

| # | 対象 | 問題 | 修正内容 | 担当 |
|---|---|---|---|---|
| P0-1 | hima.agiinc.io | OGP/Twitter Card がクローラーに返されない | SSR/プリレンダリング対応、または静的 HTML での OGP 配信を検討 | CTO / Engineer |
| P0-2 | hima.agiinc.io | robots.txt / sitemap.xml が HTML を返却 | SPA フォールバックから除外し、静的ファイルとして配信 | CTO / Engineer |

### P1（ローンチ前に修正推奨）

| # | 対象 | 問題 | 修正内容 | 担当 |
|---|---|---|---|---|
| P1-1 | B1 記事 | LP へのハイパーリンクなし | L84 のリンク化 + 末尾に 3 点 CTA 追加 | Creative / CMO |
| P1-2 | blog.agiinc.io | トップページから LP への導線なし | ヘッダー/フッターに LP リンクを追加 | CTO / Engineer |
| P1-3 | X ローンチスレッド T5 | URL に `https://` プレフィックスなし | `https://hima.agiinc.io` / `https://blog.agiinc.io` に修正 | Creative / CMO |
| P1-4 | hima.agiinc.io | canonical URL 未設定 | canonical メタタグの追加 | CTO / Engineer |
| P1-5 | X ローンチ前夜（3/24） | LP リンクなし | 末尾に `https://hima.agiinc.io` を追加 | Creative / CMO |

### P2（ローンチ後でも可）

| # | 対象 | 問題 | 修正内容 | 担当 |
|---|---|---|---|---|
| P2-1 | B1 記事 | 会社サイト（agiinc.io）リンクなし | 末尾 CTA に追加 | Creative / CMO |
| P2-2 | X 下書き 6 件 | LP リンクなし | カウントダウン・初日結果等に LP URL 追加 | Creative / CMO |
| P2-3 | X ローンチスレッド T4 | 会社サイトリンクなし | `https://agiinc.io` を追加 | Creative / CMO |

---

## 6. CTO 統合監査との対応関係

| CTO 監査項目 | 本レポートの対応 | ステータス |
|---|---|---|
| I-03 FAIL（OGP/SEO 未整備） | P0-1, P0-2, P1-4 | 修正待ち |
| I-04 PARTIAL（blog→LP 未導線） | P1-2 | 修正待ち |
| I-04 B1 記事リンク | P1-1 | 修正待ち（C-01 残タスク） |

---

## 7. 次のアクション

1. **即時**: 本レポートを CTO（アレクセイ）と共有。P0-1, P0-2 の技術対応方針を協議
2. **W09 中**: Creative（レア）に B1 記事のリンク修正（P1-1）と X 下書きのリンク整備（P1-3, P1-5）を依頼
3. **W10 まで**: blog.agiinc.io のナビゲーション改修（P1-2）を CTO/Engineer と調整
4. **ローンチ前（3/22 まで）**: P0/P1 の全修正完了を確認し、I-03/I-04 を再検証
