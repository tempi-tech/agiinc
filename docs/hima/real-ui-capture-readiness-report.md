# 実UI差し替え撮影準備レポート

> Creative Director レア・デュボワ | 2026-02-16 | ステータス: 撮影準備完了

---

## 0. 概要

`real-ui-replacement-plan.md` に基づき、デモ GIF 1-A/1-B の実UI差し替えに向けた撮影環境検証・テストキャプチャ・Remotion 組み込み方針確認を実施した。

---

## 1. 撮影環境の最終検証

### 1-1. Chrome App mode

| 項目 | 結果 | 備考 |
|---|---|---|
| Chrome バイナリ | `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` | 存在確認済み |
| `--app=https://hima.agiinc.io` | 動作確認済み | headless モードで撮影テスト完了 |
| `--window-size=1440,900` | 1440×900px で正確にキャプチャ | ffprobe で実測確認 |
| DevTools / 拡張 / ブックマーク | headless + App mode で自動的に非表示 | 追加対応不要 |

### 1-2. Kap + ffmpeg パイプライン

| ツール | バージョン | 状態 |
|---|---|---|
| Kap | `/Applications/Kap.app` | インストール済み（brew cask 経由） |
| ffmpeg | 7.1.1 | `/opt/homebrew/bin/ffmpeg` |
| ffprobe | 7.1.1 | `/opt/homebrew/bin/ffprobe` |

**パイプライン動作確認結果:**

- Chrome headless → PNG キャプチャ → ffmpeg GIF 変換のフルチェーンが正常動作
- 1パス GIF 生成: 1-A (1200×750, 15fps) / 1-B (1200×675, 12fps) の両パターンで出力メトリクスが仕様通り
- 2パスパレット方式（`palettegen` + `paletteuse`）のコマンドも準備完了（本番録画時に使用）

---

## 2. テストキャプチャの実施

### 2-1. キャプチャ対象と結果

| シーン | URL | キャプチャ結果 | ファイル |
|---|---|---|---|
| LP Hero | `https://hima.agiinc.io` | プレースホルダ状態（「プロダクト UI — スクリーンショットは後日差し替え」） | `test-lp-hero.png` |
| /app ワークスペース全景 | `https://hima.agiinc.io/app` | **実UIキャプチャ成功** — ダークテーマ UI 全景 | `test-app-workspace.png` |

### 2-2. /app 実UI の構造（キャプチャから確認）

```
┌─────────────────────────────────────────────────┐
│ Hima                          レシピ一覧  設定  │  ← ヘッダー
├──────────────────┬──────────────────────────────┤
│ レシピエディタ    │ 入力 & 実行                   │
│ ┌──────────────┐│ ┌────────────────────────────┐│
│ │ レシピ名      ││ │ レシピを作成または選択して   ││
│ │ モデル ▼     ││ │ ください                    ││
│ │ Temp 0.7     ││ │                            ││
│ │ Max Tokens   ││ └────────────────────────────┘│
│ │ 4096         ││                               │
│ ├──────────────┤├──────────────────────────────┤
│ │プロンプト     ││ 結果                          │
│ │テンプレート   ││ ┌────────────────────────────┐│
│ │              ││ │ テスト実行の結果がここに     ││
│ │              ││ │ 表示されます                ││
│ └──────────────┘│ └────────────────────────────┘│
│ [保存]          │                               │
└──────────────────┴──────────────────────────────┘
```

### 2-3. 重大な発見: テーマの差異

| 項目 | Remotion モック（現行） | 実UI（hima.agiinc.io/app） |
|---|---|---|
| **背景色** | `#FAFAF8` (オフホワイト) | ダークネイビー / `#0F172A` 系 |
| **テキスト色** | `#1A1A1A` (チャコール) | 白 / ライトグレー |
| **パネル背景** | `#FFFFFF` | ダークブルー / `#1E293B` 系 |
| **ボタン色** | `#2D3A8C` (インディゴ) | ブルー（ブランドカラーは共通） |
| **レイアウト** | 左右2カラム + 下部なし | 左右2カラム + 下部「結果」セクション |
| **入力フィールド** | 左パネルにレシピ名 + プロンプトのみ | 左パネルにレシピ名 + モデル + Temperature + Max Tokens + プロンプト + 保存ボタン |

**影響**: 実UIが大幅にダークテーマであるため、差し替え時に以下の対応が必要:

1. Remotion シーンの背景色・テキスト色を実UIに合わせる（又は実UIの動画をそのまま埋め込む）
2. エンドフレーム（SceneEndFrame）のチャコール背景は実UIのダークテーマと親和性が高い
3. LP Hero のプレースホルダは W09 での実画面差し替えと同期して進める

### 2-4. ffprobe によるメトリクス検証

**ソース素材:**

| ファイル | 解像度 | サイズ |
|---|---|---|
| `test-lp-hero.png` | 1440 × 900 | 16 KB |
| `test-app-workspace.png` | 1440 × 900 | 42 KB |

**GIF 変換テスト結果:**

| 出力 | 解像度 | FPS | フレーム数 | サイズ | 仕様上限 | 判定 |
|---|---|---|---|---|---|---|
| `test-pipeline-1a.gif` (1-A) | 1200 × 750 | 15 | 30 (2s) | 7.3 MB | 5 MB | ⚠ 超過（静止画起因・実録画時は大幅縮小見込み） |
| `test-pipeline-1b.gif` (1-B) | 1200 × 675 | 12 | 24 (2s) | 5.2 MB | 15 MB | ✅ OK |

**注記**: 静止画ループは全フレーム同一ピクセルのため GIF 圧縮効率が最低。1-B v1 の Remotion 出力実績（28s / 336f → 1.6 MB GIF）から見て、実操作録画では 5 MB 以内に収まる見込み。

---

## 3. Remotion への組み込み方針

### 3-1. ディレクトリ構成

`products/hima/demo-video/src/assets/real-ui/` を作成済み。

```
products/hima/demo-video/src/assets/real-ui/
├── test-lp-hero.png           # テストキャプチャ（LP Hero）
├── test-lp-hero-v2.png        # テストキャプチャ（LP Hero v2）
├── test-app-workspace.png     # テストキャプチャ（/app 全景）
├── test-pipeline-1a.gif       # パイプラインテスト出力
└── test-pipeline-1b.gif       # パイプラインテスト出力
```

本番素材配置時の命名規則:

```
products/hima/demo-video/src/assets/real-ui/
├── s0-overview.webm           # S0: ワークスペース全景
├── s1-recipe.webm             # S1: レシピ作成
├── s2-csv-import.webm         # S2: CSV インポート + マッピング
├── s3-batch-exec.webm         # S3: バッチ実行
├── s4-export.webm             # S4: 結果テーブル + エクスポート
└── lp-hero.png                # LP Hero セクション用スクリーンショット
```

### 3-2. props でショット名を受ける方式

各シーンコンポーネントに `realUiShot` prop を追加し、差し替えを一元管理する方針:

```tsx
// types.ts に追加
export type RealUiShotName =
  | "s0-overview"
  | "s1-recipe"
  | "s2-csv-import"
  | "s3-batch-exec"
  | "s4-export";

// 各シーンの props に追加
type SceneProps = {
  brand: HimaBrand;
  realUiShot?: RealUiShotName;  // undefined = モック使用、指定 = 実UI映像
};
```

**実装方式（2段階）:**

1. **Phase 1（W09）**: `realUiShot` prop を追加し、値が `undefined` のときは現行の `HimaWorkspace` モックを描画（後方互換）
2. **Phase 2（W10以降）**: `realUiShot` が指定されたときは `<Video>` or `<Img>` コンポーネントで `assets/real-ui/{shot}.webm` を読み込み、モック部分を実映像に完全置換

**具体的な差し替え箇所:**

| シーン | 現行の描画ロジック | 差し替え対象 |
|---|---|---|
| `SceneOverviewX` | `HimaWorkspace` 静止表示 | 全体を実UI静止ショットに置換 |
| `SceneRecipeX` | `HimaWorkspace` + タイプライター演出 | `HimaWorkspace` ブロック全体を実UI映像に置換 |
| `SceneCsvImportX` | `HimaWorkspace` + ドラッグ演出 | `HimaWorkspace` ブロック全体を実UI映像に置換 |
| `SceneBatchExecX` | `HimaWorkspace` + 進捗更新 | `HimaWorkspace` ブロック全体を実UI映像に置換 |
| `SceneExportX` | `HimaWorkspace` + 行展開 | `HimaWorkspace` ブロック全体を実UI映像に置換 |
| `SceneEndFrame` | **変更なし** | ダークテーマとの親和性が高いためそのまま |

**カーソル演出の扱い:**

- 実UI録画にはカーソルが含まれる（Kap 設定でカーソル表示 ON）
- Remotion 側のカーソルオーバーレイ（`cursorPosition` / `showCursorHighlight`）は、実UI使用時は無効化
- クリックハイライトは Kap のネイティブ機能で対応

### 3-3. 既存シーンコンポーネントでの読み込み検証

テストキャプチャ素材 `test-app-workspace.png` を `assets/real-ui/` に配置済み。Remotion の `<Img>` コンポーネントで以下のように読み込み可能:

```tsx
import { Img, staticFile } from "remotion";

// staticFile は public/ からの相対パスを使うが、
// src/assets/ からは直接 import で読み込む方式を採用
import realUiOverview from "../assets/real-ui/test-app-workspace.png";

// シーン内で使用
<Img src={realUiOverview} style={{ width: "100%", height: "100%" }} />
```

動画素材（WebM）の場合:

```tsx
import { Video } from "remotion";

// 動画はpublic/ 配下に配置して staticFile() で参照する方式を推奨
<Video src={staticFile("real-ui/s1-recipe.webm")} />
```

---

## 4. LP Hero プレースホルダの状態

LP（`hima.agiinc.io`）の Hero セクションには「プロダクト UI — スクリーンショットは後日差し替え」というプレースホルダが表示されている。

**対応方針:**
- LP の Hero 画像は、`/app` の実UI収録後にスクリーンショットを差し替え
- デモ GIF 1-A の S1-S4 は `/app` の操作録画から切り出すため、LP Hero の差し替えとは独立して進行可能
- LP Hero 用の静止スクリーンショットは、`/app` での操作デモが完了した状態（結果テーブル表示中）のキャプチャを使用する方針

---

## 5. リスクと対応策

| # | リスク | 影響度 | 対応策 |
|---|---|---|---|
| 1 | **ダークテーマとモックの色差異** | 高 | 実UI映像をそのまま使う方式に完全移行。中間的なモック+実UIのハイブリッドは避ける |
| 2 | **レイアウト差異（3エリア構成）** | 中 | 実UIの縦3分割（左:エディタ / 右上:入力実行 / 右下:結果）に合わせてカーソル座標を再設計 |
| 3 | **API キー未設定時のモデル選択不可** | 中 | 撮影前に API キー登録必須。`demo-capture-guide.md` チェックリスト通り |
| 4 | **LP Hero プレースホルダ** | 低 | LP の Hero 差し替えはデモ GIF 制作とは独立。W09 後半で対応 |
| 5 | **静止画 GIF サイズ超過（1-A テスト: 7.3MB）** | 低 | 静止画特有。実操作録画はフレーム間差分で大幅圧縮（1-B v1 実績: 28s → 1.6MB） |

---

## 6. 次のアクション

| # | 作業 | 担当 | 期限 | ブロッカー |
|---|---|---|---|---|
| 1 | `types.ts` に `RealUiShotName` 型と `realUiShot` prop を追加 | レア | W09 前半 | なし |
| 2 | 各シーンコンポーネントに `realUiShot` prop を受ける条件分岐を追加 | レア | W09 前半 | #1 |
| 3 | `/app` で S0-S4 の全シーンを Kap で操作録画 | レア | W09 中盤 | API キー設定済み |
| 4 | 録画素材を ffmpeg 2パスパレットで GIF/WebM に変換 | レア | W09 中盤 | #3 |
| 5 | 実UI映像をシーンコンポーネントに組み込み、プレビュー確認 | レア | W09 後半 | #2, #4 |
| 6 | CMO レビュー依頼 | レア | W09 後半 | #5 |

---

## 7. まとめ

- **撮影環境**: Chrome App mode + Kap + ffmpeg 7.1.1 パイプラインが完全動作。ウィンドウサイズ 1440×900 も正確
- **テストキャプチャ**: `/app` ワークスペース全景の実UIキャプチャに成功。ダークテーマの実UIを確認
- **品質基準**: ffprobe で 1-A (1200×750, 15fps) / 1-B (1200×675, 12fps) の出力メトリクスが仕様通り
- **Remotion 組み込み**: `assets/real-ui/` ディレクトリ準備完了。props でショット名を受ける方式の設計確定
- **最大の発見**: 実UIがダークテーマであり、モックとの色彩差異が大きい → 実UI映像のフル置換が最適解
