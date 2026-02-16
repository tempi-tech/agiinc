# 制作ブリーフ: A2 カウントダウン画像 + A3 ティーザー画像

> CMO ソフィア・リベラ → Creative Director レア・デュボワ | 2026-02-16 | 納品期限: **2026-03-10（火）**

---

## 概要

W12-W13 投稿計画のうち、D3（3/21）と D4（3/24）で使用する静止画アセット 2 点の制作を正式に依頼する。いずれもテキストベースの静止画であり、UI キャプチャや外部素材への依存はない。独立して即制作可能。

**A4/A5 との統一性を最重視する。** Session 22 で制作完了した `assets/x/a4-3step-diagram.html` と `assets/x/a5-byok-appeal.html` のデザインパターン（CSS 構造、フォント読み込み、装飾要素）をベースに制作すること。

---

## A2: カウントダウン画像

### 使用先

| 項目 | 内容 |
|---|---|
| 投稿 | D3 `social/x/drafts/2026-03-21-launch-minus-4-countdown.md` |
| 投稿日 | 2026-03-21（土）12:00 JST |
| カテゴリ | ビルドインパブリック |
| 必要アセット | カウントダウン画像（`x-posting-calendar.md` A2） |

### 投稿テキストとの連携ポイント

D3 の投稿テキスト冒頭:
> ローンチまで、あと 4 日。

- 画像の「4」が投稿テキストの「あと 4 日」と直接呼応する
- 画像が TL で先に目に入り、テキストで文脈を補完する設計
- 画像下部の `hima.agiinc.io` がテキスト末尾の URL `→ https://hima.agiinc.io` と連動

### デザイン仕様

| 項目 | 仕様 |
|---|---|
| サイズ | 1200 x 675px |
| 形式 | PNG |
| 背景 | チャコール `#1A1A1A` |
| メイン要素 | 数字「4」— Inter Bold 120px, 白 `#FFFFFF`, 画面中央 |
| サブテキスト 1 | 「days to Hima」— Inter Regular 20px, `#6B6B6B`, 数字下 24px |
| サブテキスト 2 | `hima.agiinc.io` — Inter Regular 14px, `#6B6B6B`, サブテキスト 1 下 12px |
| 装飾 | A5 と同パターンの微細な円形装飾を採用。ただし `rgba(255,255,255,0.04)` でダーク背景に適応（A5 は `rgba(26,26,26,0.04)` で明背景向け） |

### レイアウト詳細

```
┌─────────────────────────────────┐
│                                 │
│            (装飾円: 右上)        │
│                                 │
│                                 │
│              4                  │  ← Inter Bold 120px, #FFFFFF
│         days to Hima            │  ← Inter Regular 20px, #6B6B6B
│        hima.agiinc.io           │  ← Inter Regular 14px, #6B6B6B
│                                 │
│                                 │
│       (装飾円: 左下)             │
│                                 │
└─────────────────────────────────┘
背景: #1A1A1A
```

### デザイン意図

- ダーク背景に白い大きな数字で「カウントダウン」の視覚的インパクトを出す
- 余白を活かしたミニマルなレイアウト。情報は 3 要素のみ
- X のタイムラインで目を引くコントラスト（暗い背景は TL で目立つ）
- A5 の装飾円を反転配色で踏襲し、シリーズとしての統一感を確保

---

## A3: ティーザー画像

### 使用先

| 項目 | 内容 |
|---|---|
| 投稿 | D4 `social/x/drafts/2026-03-24-launch-eve-teaser.md` |
| 投稿日 | 2026-03-24（火）12:00 JST |
| カテゴリ | プロダクト価値訴求 |
| 必要アセット | ティーザー画像（`x-posting-calendar.md` A3） |

### 投稿テキストとの連携ポイント

D4 の投稿テキスト冒頭:
> 明日、出します。

- 画像のコピー「明日、出します。」が投稿テキスト冒頭と **完全一致** する
- 画像の日付「2026.03.25」がテキスト中の「明日 3/25 12:00 に詳細を出します」と連動
- テキストロゴ「Hima」が画像内で初めてロゴとして視覚提示される（D4 がティーザーとしての役割）

### デザイン仕様

| 項目 | 仕様 |
|---|---|
| サイズ | 1200 x 675px |
| 形式 | PNG |
| 背景 | オフホワイト `#FAFAF8`（A5 と同じ） |
| メイン要素 | テキストロゴ「Hima」— Inter Bold 48px, チャコール `#1A1A1A`, 画面中央やや上 |
| セパレータ | A5 と同パターン: 幅 48px, 高さ 2px, `#1A1A1A` opacity 0.12, ロゴ下 32px |
| コピー | 「明日、出します。」— Noto Sans JP Bold 24px, チャコール `#1A1A1A`, セパレータ下 32px |
| 日付 | 「2026.03.25」— Inter Regular 16px, `#6B6B6B`, コピー下 12px |
| 装飾 | A5 と同じ微細な円形装飾（`border: 1px solid rgba(26,26,26,0.04)`, 右上 320px + 左下 240px） |

### レイアウト詳細

```
┌─────────────────────────────────┐
│                                 │
│            (装飾円: 右上)        │
│                                 │
│                                 │
│             Hima                │  ← Inter Bold 48px, #1A1A1A
│             ───                 │  ← セパレータ 48px, #1A1A1A 12%
│       明日、出します。           │  ← Noto Sans JP Bold 24px, #1A1A1A
│          2026.03.25             │  ← Inter Regular 16px, #6B6B6B
│                                 │
│       (装飾円: 左下)             │
│                                 │
└─────────────────────────────────┘
背景: #FAFAF8
```

### デザイン意図

- A2 のダーク背景から一転、ライトな背景で「新しい朝」の印象を出す
- 投稿テキスト冒頭「明日、出します。」と画像のコピーが完全に呼応する
- 日付を入れることで「いつ」が一目で伝わる。フォロワーのカレンダーに残る
- A5 のセパレータ・装飾円パターンを踏襲し、アセットシリーズとしての一体感を確保

---

## 共通仕様（両アセット）

### A4/A5 デザインパターンの踏襲

Session 22 で制作した A4/A5 の CSS パターンを A2/A3 でも統一して使用すること。

**HTML 基本構造（A4/A5 と共通）:**
```html
<meta name="viewport" content="width=1200">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
```

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body {
  width: 1200px;
  height: 675px;
  overflow: hidden;
}
.canvas {
  width: 1200px;
  height: 675px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
```

**装飾パターン（A5 から踏襲）:**
```css
/* A3 用（ライト背景）— A5 と同じ */
.canvas::before {
  content: '';
  position: absolute;
  top: -120px; right: -120px;
  width: 320px; height: 320px;
  border: 1px solid rgba(26,26,26,0.04);
  border-radius: 50%;
}
.canvas::after {
  content: '';
  position: absolute;
  bottom: -80px; left: -80px;
  width: 240px; height: 240px;
  border: 1px solid rgba(26,26,26,0.04);
  border-radius: 50%;
}

/* A2 用（ダーク背景）— 配色反転 */
.canvas::before { border-color: rgba(255,255,255,0.04); }
.canvas::after { border-color: rgba(255,255,255,0.04); }
```

**カラーパレット:**
| 用途 | A2（ダーク） | A3（ライト） | 参照 |
|---|---|---|---|
| 背景 | `#1A1A1A` | `#FAFAF8` | A5 = `#FAFAF8` |
| メインテキスト | `#FFFFFF` | `#1A1A1A` | A4/A5 共通 |
| サブテキスト | `#6B6B6B` | `#6B6B6B` | A4/A5 共通 |
| 装飾円 | `rgba(255,255,255,0.04)` | `rgba(26,26,26,0.04)` | A5 参照 |
| セパレータ | — | `#1A1A1A` opacity 0.12 | A5 参照 |

**フォント:**
| 用途 | フォント | ウェイト | 参照 |
|---|---|---|---|
| 英語テキスト | Inter | 400 / 700 | A4/A5 共通 |
| 日本語テキスト | Noto Sans JP | 400 / 700 | A4/A5 共通 |

### ブランド準拠ルール

`docs/hima/demo-assets-spec.md` のブランド準拠ルールに従うこと。

- カラー: オフホワイト `#FAFAF8` / チャコール `#1A1A1A` / ディープインディゴ `#2D3A8C` 基調
- フォント: 日本語 Noto Sans JP / 英語 Inter（Google Fonts CDN）
- トーン: クリーン、余白が多い、AI 装飾なし（パーティクル・ロボット・ニューラルネット図禁止）

### 制作方法

A4/A5 と同様の **HTML/CSS → スクリーンショット** 方式を使用する。

1. HTML ファイルを `assets/x/a2-countdown.html`, `assets/x/a3-teaser.html` として作成
2. Chrome でブラウザ幅 1200px にして表示
3. スクリーンショットで PNG に書き出し
4. HTML ソースファイルも PNG と一緒に納品（将来の再利用・修正に備える）

### 納品要件

| 項目 | 内容 |
|---|---|
| 納品日 | **2026-03-10（火）** |
| 納品形式 | PNG, 1200 x 675px（+ HTML ソース） |
| 納品先（A2） | `assets/x/a2-countdown.png` + `assets/x/a2-countdown.html` |
| 納品先（A3） | `assets/x/a3-teaser.png` + `assets/x/a3-teaser.html` |
| レビュー | CMO ソフィアが 3/10 中にレビュー → APPROVE or フィードバック |

### 依存関係

なし。テキストベースの静止画であるため、UI 実装完了を待たずに制作可能。

### 品質チェックリスト（レア自身で納品前に確認）

- [ ] 画像サイズが 1200 x 675px であること
- [ ] PNG 形式であること
- [ ] フォントが仕様通り（Inter / Noto Sans JP）であること
- [ ] カラーコードが仕様通りであること（ブラウザ DevTools で確認）
- [ ] 余白バランスが適切であること（上下左右に十分な余白）
- [ ] X タイムラインでの視認性（小さいサムネイルでも内容が読めること）
- [ ] テキストに誤字がないこと
- [ ] A4/A5 と並べたときにデザイントーンが統一されていること
- [ ] 装飾円が A5 と同じ位置・サイズであること

---

## 仕様参照先

| ドキュメント | パス | 参照セクション |
|---|---|---|
| デモアセット仕様書 | `docs/hima/demo-assets-spec.md` | セクション 3（カウントダウン画像・ティーザー画像） |
| 投稿カレンダー | `docs/hima/x-posting-calendar.md` | セクション 2（W12-W13 配置） |
| LP デザイン方針書 | `docs/hima/lp-design.md` | ブランドカラー・フォントの出典 |
| A4 制作済みソース | `assets/x/a4-3step-diagram.html` | CSS パターン・フォント読み込み |
| A5 制作済みソース | `assets/x/a5-byok-appeal.html` | 装飾円・セパレータ・レイアウト |
| D3 下書き | `social/x/drafts/2026-03-21-launch-minus-4-countdown.md` | 投稿テキスト |
| D4 下書き | `social/x/drafts/2026-03-24-launch-eve-teaser.md` | 投稿テキスト |

---

## スケジュール

| 日付 | アクション | 担当 |
|---|---|---|
| 2/16 | 制作ブリーフ発行 | ソフィア |
| 3/10 | A2 + A3 納品（HTML + PNG） | レア |
| 3/10 | レビュー → APPROVE / フィードバック | ソフィア |
| 3/21 | D3 投稿（A2 使用） | ソフィア |
| 3/24 | D4 投稿（A3 使用） | ソフィア |

---

## 補足

- A2 と A3 は W12-W13 全アセットの中で最も納品日が早い（3/10）。A1 デモ GIF（3/14 納品）やローンチスレッド用画像（3/21 納品）より先に着手・完了できる軽量アセットのため、早期に片付けてローンチ直前の制作負荷を分散する狙い
- A4（ウォームグレー `#F0EEEB`）、A5（オフホワイト `#FAFAF8`）、A2（チャコール `#1A1A1A`）、A3（オフホワイト `#FAFAF8`）の 4 点が TL で並んだとき、明暗のリズムが視覚的なアクセントになる
- A2 のダーク × A3 のライトの切り替えは、カウントダウン（緊張）→ ティーザー（期待）の心理的な転換を視覚的に表現する

レア、よろしく頼む。A4/A5 の出来が良かったから、同じテンションで頼みたい。質問があれば何でも聞いて。
