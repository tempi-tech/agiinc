# デモGIF制作環境検証レポート

作成日: 2026-02-14
作成者: Creative Director
対象: Hima デモGIF（1-A LP 用 18s / 1-B X 用 28s）
参照: `docs/hima/demo-assets-spec.md`, `docs/hima/demo-capture-guide.md`, `docs/hima/demo-scene-script.md`

## 1. 環境チェック結果（ツール）

### 必須ツール
- `ffmpeg`: **OK**
  - バージョン: `ffmpeg version 7.1.1 Copyright (c) 2000-2025 the FFmpeg developers`
  - エンコーダ/フィルタ確認
    - `libvpx-vp9`: 利用可能（WebM 生成可）
    - `palettegen`, `paletteuse`: 利用可能（高品質 GIF 変換可）
    - `fps`, `scale`: 利用可能
- `Google Chrome`（Mac App）: **OK**
  - バイナリ実行可: `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome`
  - バージョン: `Google Chrome 144.0.7559.133`
  - AppleScript 制御: `tell application "Google Chrome" to name` が成功
- `Kap`: **NG（未インストール）**
  - `kap` コマンド: 無し
  - `/Applications/Kap.app`: 無し
- `OBS Studio`: **NG（未インストール）**
  - `obs` コマンド: 無し
  - `/Applications/OBS.app`: 無し
- `brew`: **OK**（必要時の再インストール運用用）

### 補足
- `ffmpeg` 変換フローは実行可能な構成。
- 収録ツールは現状 Kap / OBS 未導入のため、**実環境では収録手順が未確定（要インストール）**。

## 2. Chrome DevTools でのキャプチャ実行可能性

`demo-capture-guide.md` の手順は、次の観点で実施可能です。

- ウィンドウ起動: `--window-size=1440,900` や `--app=https://hima.agiinc.io` を CLI で起動可能
- UI 非表示: Chrome アプリモード起動でタブ/アドレスバー非表示化可能（想定動作）
- AppleScript によるサイズ調整手順の起点確認: `osascript` で Chrome へアクセス可能

**要注意**
- DevTools 自体の UI 非表示撮影自体は、記載どおり実施可能だが、実施時の画面権限（画面収録許可）・通知抑制設定は手動確認が必要。
- `--app` 起動時の見た目は、最終的な実画面撮影で確認してから確定する。

## 3. GIF変換パイプライン確認（解像度/FPS/容量）

`demo-assets-spec.md` と `demo-capture-guide.md` の照合結果:

- 1-A LP 用
  - ターゲット: `1200x750`, `15fps`, GIF 上限 5MB, WebM 上限 2MB
  - 指定変換コマンド: `fps=15,scale=1200:750` + `palettegen/paletteuse` で対応（仕様一致）
- 1-B X 用
  - ターゲット: `1200x675`, `12fps`, GIF 上限 15MB
  - 指定変換コマンド: `fps=12,scale=1200:675` + `palettegen/paletteuse` で対応（仕様一致）
- 1-C YouTube:
  - `1920x1080` 抽出指定、`libvpx-vp9` 利用前提は `ffmpeg` 側で確認済み

**問題点（現時点）**
- 生素材（raw-capture.webm）未作成のため、実ファイルでの品質/体積検証は未完了
- Kap/OBS が未導入のため、収録フォーマット（WebM / MP4）自体が未検証

## 4. デモ素材準備状況チェックリスト（W09向け）

### 完了（実制作前提）
- `demo-capture-guide.md`: 要件定義あり
- `demo-scene-script.md`: シーン定義あり（1-A / 1-B それぞれ時系列・入力内容・操作の仕様あり）
- `demo-data.csv`: 件数は `10件`（ヘッダ除外）で準備済み
- 仕様書 `demo-assets-spec.md`: サイズ/FPS/容量/表示ルールが確認済み

### 要対応（W09前）
- `Kap` または `OBS` のインストール・起動確認
  - 推奨: `brew install --cask kap`（ガイド追従）
  - 代替: OBS Studio 導入
- 録画時の出力形式を統一（`raw-capture.webm`）し、変換パイプラインでの体積検証を実行
- Chrome 収録環境（集中モード、Dock/メニューバー自動非表示、ダウンロード通知抑止）を本番端末で最終設定
- 収録前に 1 回、`S0~S4` を含む短尺テスト撮影 → ffmpeg 変換まで含めたドライラン実施

## 5. まとめ

- エンコード基盤（`ffmpeg`）とブラウザ（Chrome）は問題なく利用可能。
- 現在の制約は **収録ツールの未インストール** のみ。
- そのため W09 実制作は、**収録ツール導入後に実施**すれば開始可能。
- 本レポートを `demo-assets-spec.md` 準拠の前提チェックとして運用し、W09 で収録→変換→体積再チェックの順で進める。
