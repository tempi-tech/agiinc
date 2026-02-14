# X 投稿ドラフト最終品質チェック（2026-Q13）

作成日: 2026-02-14
対象: `social/x/drafts/*.md`（全10本）
参照: `docs/hima/content-review-final.md`（CMOソフィア・リベラ、全件 APPROVE）

## チェック結果サマリ

- チェック対象: 10本の X 下書き（ローンチ前〜ローンチ後）
- 判定: 全基準の合格（修正後）
- 修正実施: 2項目（URL形式、ハッシュタグ統一）

## 発見した問題と修正内容

### 1) URL正確性
- 指摘: 以下の投稿で `https://` を省略していた
  - `social/x/drafts/2026-03-19-lp-release-demo-gif.md`
  - `social/x/drafts/2026-03-24-launch-eve-teaser.md`
  - `social/x/drafts/2026-03-29-feedback-request.md`
- 修正: すべて `https://hima.agiinc.io` 形式に統一
- 確認: `hima.agiinc.io`, `blog.agiinc.io` のみを使用。`https://` 開始、許可済みドメイン内

### 2) ハッシュタグ戦略
- 指摘: 投稿ごとのタグが `#BuildInPublic` / `#AI` など混在し、`#AGIInc #Hima` が不足していた
- 修正: 全10本の投稿本文末尾に `#AGIInc #Hima` を統一
- 確認: 11報告では必要過多の乱用は避け、各投稿に2タグ固定

### 3) 3/24投稿のタイポ
- 指摘: URL行頭に不要な `#` が付与されていた
- 修正: `#https://hima.agiinc.io` を `https://hima.agiinc.io` に修正

## 基準別最終判定

### URL正確性
- すべて合格。URLは `https://` 開始、指定ドメインのみ。

### ブランドボイス統一
- 逸脱表現はなし。ブランド価値（Ship Fast / Stay Autonomous / Work Hard as Hell / Code is Law / God is in the Details）に沿った実践的・透明性重視トーンを維持。

### ハッシュタグ戦略
- すべての投稿が `#AGIInc #Hima` を含有。

### CTA一貫性
- 各投稿に CTA（参加呼びかけ、遷移導線、体験促進、または数字公開）が明確。
- ローンチ前→ローンチ日→ローンチ後の流れと日付整合。

### 日付整合性
- 投稿予定日: 2026-03-17, 19, 21, 24, 25, 26, 27, 28, 29, 30
- ローンチ日 2026-03-25 を起点に前後1日ずつ順序整合。

### 文字数
- 全件 280 文字（スレッドは各ツイート）以内。
- `2026-03-25-launch-thread.md` は5ツイート構成で CTA とリンクを末尾に保持。

### 画像/GIF指示
- 3/19 はデモ GIF 投稿予定を明示済み（明確）。
- 他投稿は画像/GIF不要のテキスト中心、未確定項目なし。

## 結論

CMOレビュー方針を踏まえ、URLとハッシュタグ運用を整備したうえで、10本すべて公開前チェックを通過。追加修正は不要。
