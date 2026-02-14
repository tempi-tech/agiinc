# デモ GIF キャプチャ環境手順書

> Creative Director レア・デュボワ | 2026-02-14 | ステータス: ドラフト

---

## 概要

デモ GIF（1-A LP 用、1-B X 投稿用）および YouTube V2 用画面キャプチャ素材（1-C）のキャプチャ環境設定を定義する。

---

## 1. Chrome ウィンドウ設定

### ウィンドウサイズ

キャプチャ時のブラウザウィンドウ内部サイズ（viewport）:

| 用途 | viewport 幅 | viewport 高さ | 備考 |
|---|---|---|---|
| デモ GIF 撮影 | 1440px | 900px | リサイズ後に各出力サイズへ変換 |
| YouTube V2 撮影 | 1920px | 1080px | そのまま使用（1080p） |

### ウィンドウサイズの設定方法

Chrome DevTools を使用して正確なサイズを設定する:

```bash
# 方法 1: Chrome を起動オプション付きで開く
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --window-size=1440,900 \
  --app=https://hima.agiinc.io
```

```bash
# 方法 2: AppleScript でリサイズ（既に開いている Chrome に適用）
osascript -e 'tell application "Google Chrome"
  set bounds of front window to {0, 0, 1440, 900}
end tell'
```

```
# 方法 3: DevTools > Device Toolbar（Cmd+Shift+M）
# Responsive > カスタムサイズ 1440 × 900 を入力
# ※ Device Toolbar 使用時はツールバー自体が映り込まないよう注意
```

---

## 2. ブラウザ UI 非表示

キャプチャにはブラウザのタブバー・アドレスバー・ブックマークバーを含めない。以下のいずれかの方法で非表示にする。

### 方法 A: Chrome アプリモード（推奨）

ブラウザ UI が一切表示されないモード:

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --app=https://hima.agiinc.io \
  --window-size=1440,900
```

**利点**: タブバー・アドレスバーが完全に非表示。最もクリーン。

### 方法 B: フルスクリーン + クロップ

1. `Cmd + Shift + F` で Chrome をフルスクリーンに
2. キャプチャ後に上部のブラウザ UI 部分をクロップ

### 方法 C: Chrome キオスクモード

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --kiosk \
  --app=https://hima.agiinc.io
```

**注意**: キオスクモードは `Cmd + Q` で終了。他の操作が制限されるため、撮影のみに使用。

---

## 3. キャプチャ前の環境チェック

撮影前に以下を確認・設定すること:

### ブラウザ設定

- [ ] ブックマークバーを非表示に（`Cmd + Shift + B`）
- [ ] 拡張機能アイコンを非表示に（拡張機能ツールバーを固定解除）
- [ ] 通知をすべてオフに（macOS「集中モード」を有効化）
- [ ] Chrome のダウンロードバーが出ないようにする（`chrome://settings/downloads` → 「ダウンロード前にファイルの保存場所を確認する」をオフ）

### macOS 設定

- [ ] 「集中モード」を有効化（通知バナーを防止）
- [ ] Dock を自動的に非表示（`システム設定 > デスクトップと Dock > Dock を自動的に表示/非表示`）
- [ ] メニューバーを自動非表示（`システム設定 > デスクトップと Dock > メニューバーを自動的に表示/非表示`）
- [ ] 壁紙は無関係（アプリモードではブラウザ内のみキャプチャするため）

### Hima アプリ設定

- [ ] API キーを事前登録済み（OpenAI の `gpt-4o` が使える状態）
- [ ] レシピライブラリを空にしておく（既存レシピが映り込まないように）
- [ ] 結果テーブルをクリアしておく
- [ ] `demo-data.csv` をデスクトップに配置（ドラッグ＆ドロップしやすい位置）

---

## 4. キャプチャツール設定

### Kap（推奨・macOS 用）

無料・オープンソースの画面録画ツール。GIF / WebM / MP4 に対応。

**インストール**:
```bash
brew install --cask kap
```

**設定**:
- 出力形式: WebM（後で ffmpeg で GIF に変換）
- フレームレート: 30fps（後で ffmpeg でダウンサンプル）
- 録画範囲: カスタム → Chrome ウィンドウの内側を選択
- カーソル表示: オン
- クリックハイライト: オン（Kap のネイティブ機能で対応。色を `rgba(45,58,140,0.15)` に変更できない場合は後処理で対応）
- オーディオ: オフ

**録画手順**:
1. Kap を起動
2. 録画範囲を Chrome ウィンドウに合わせる
3. 録画開始（`Cmd + Shift + 5` ではなく Kap の録画ボタンを使用）
4. シーンスクリプトに従って操作を実行
5. 録画停止
6. WebM 形式で書き出し

### OBS Studio（代替）

より高機能だが設定が複雑。Kap で問題がある場合のみ使用。

**設定**:
- 出力解像度: 1440 × 900（デモ GIF 撮影）/ 1920 × 1080（YouTube）
- FPS: 30
- 出力形式: MKV（MP4 は録画中断時に破損するため MKV を推奨、後で ffmpeg で変換）
- ソース: 「ウィンドウキャプチャ」→ Chrome ウィンドウを選択
- クロップ: ウィンドウ上部のタイトルバーをクロップ

---

## 5. ffmpeg 変換コマンド

### 5-1. WebM → GIF 変換（1-A LP 用）

```bash
# Step 1: パレット生成（高品質 GIF のため 2 パスエンコード）
ffmpeg -i raw-capture.webm \
  -vf "fps=15,scale=1200:750:flags=lanczos,palettegen=max_colors=256:stats_mode=diff" \
  -y palette-lp.png

# Step 2: GIF 生成
ffmpeg -i raw-capture.webm -i palette-lp.png \
  -lavfi "fps=15,scale=1200:750:flags=lanczos [x]; [x][1:v] paletteuse=dither=floyd_steinberg" \
  -loop 0 \
  -y demo-lp.gif
```

| パラメータ | 値 | 理由 |
|---|---|---|
| fps | 15 | 仕様: 15fps |
| scale | 1200:750 | 仕様: 1200 × 750px |
| max_colors | 256 | GIF の最大色数。品質優先 |
| dither | floyd_steinberg | バンディング軽減。UI のグラデーションに有効 |
| loop | 0 | 無限ループ |

**ファイルサイズ確認**:
```bash
# 5MB 以下であることを確認
ls -lh demo-lp.gif
# 超過する場合 → max_colors=128 に下げるか、fps=12 にダウン
```

### 5-2. WebM → GIF 変換（1-B X 投稿用）

```bash
# Step 1: パレット生成
ffmpeg -i raw-capture.webm \
  -vf "fps=12,scale=1200:675:flags=lanczos,palettegen=max_colors=256:stats_mode=diff" \
  -y palette-x.png

# Step 2: GIF 生成
ffmpeg -i raw-capture.webm -i palette-x.png \
  -lavfi "fps=12,scale=1200:675:flags=lanczos [x]; [x][1:v] paletteuse=dither=floyd_steinberg" \
  -loop 0 \
  -y demo-x.gif
```

| パラメータ | 値 | 理由 |
|---|---|---|
| fps | 12 | 仕様: 12fps（ファイルサイズ制約） |
| scale | 1200:675 | 仕様: 1200 × 675px（16:9、X 推奨比率） |
| loop | 0 | 無限ループ |

**ファイルサイズ確認**:
```bash
# 15MB 以下であることを確認（X 上限）
ls -lh demo-x.gif
# 超過する場合 → max_colors=128、さらに fps=10 に段階的にダウン
```

### 5-3. GIF → WebM 変換（1-A LP 用メイン表示フォーマット）

LP では WebM をメイン表示、GIF をフォールバックとして使う:

```bash
ffmpeg -i raw-capture.webm \
  -vf "fps=15,scale=1200:750:flags=lanczos" \
  -c:v libvpx-vp9 \
  -b:v 500k \
  -an \
  -loop 0 \
  -y demo-lp.webm
```

**ファイルサイズ確認**:
```bash
# 2MB 以下であることを確認
ls -lh demo-lp.webm
# 超過する場合 → -b:v 300k に下げる
```

### 5-4. YouTube V2 用素材抽出

素撮りの WebM から各ショットを時間指定で切り出す:

```bash
# S-01: ワークスペース全景（5s）
ffmpeg -i raw-youtube.webm -ss 00:00:00 -t 5 \
  -c:v libvpx-vp9 -b:v 2M -an \
  -y shots/S-01-workspace.webm

# S-02: プロンプト入力 + 変数自動検出（10s）
ffmpeg -i raw-youtube.webm -ss 00:00:05 -t 10 \
  -c:v libvpx-vp9 -b:v 2M -an \
  -y shots/S-02-prompt.webm

# 以下、ショットごとに -ss と -t を調整
# S-03 〜 S-08 も同じパターンで切り出す
```

**注意**: `-ss` の値は実際の撮影タイミングに合わせて調整すること。

### 5-5. エンドフレーム付加（1-B X 用）

エンドフレームは HTML → スクリーンショットで静止画を作成し、GIF の末尾に結合する:

```bash
# エンドフレーム画像を 2 秒分（12fps × 2s = 24 フレーム）のループ GIF に変換
ffmpeg -loop 1 -i endframe.png \
  -vf "fps=12,scale=1200:675" \
  -t 2 \
  -y endframe.gif

# メイン GIF とエンドフレームを結合
ffmpeg -i "concat:demo-x-main.gif|endframe.gif" \
  -y demo-x-final.gif
```

**注意**: GIF の concat は制約があるため、結合がうまくいかない場合は以下の代替手法を使用:

```bash
# 代替: 動画ベースで結合してから GIF に変換
ffmpeg -i raw-capture.webm -i endframe.png \
  -filter_complex "[0:v]fps=12,scale=1200:675[main]; \
    [1:v]loop=24:1:0,fps=12,scale=1200:675[end]; \
    [main][end]concat=n=2:v=1:a=0[out]" \
  -map "[out]" \
  -y demo-x-combined.webm

# 結合済み WebM → GIF 変換（5-2 と同じ手順）
```

---

## 6. ファイル出力・命名規則

| ファイル名 | 内容 | 形式 | サイズ上限 |
|---|---|---|---|
| `demo-lp.gif` | LP 用デモ GIF | GIF | 5MB |
| `demo-lp.webm` | LP 用デモ動画（メイン表示） | WebM | 2MB |
| `demo-x.gif` | X 投稿用デモ GIF | GIF | 15MB |
| `shots/S-01-workspace.webm` | YouTube S-01 素材 | WebM | — |
| `shots/S-02-prompt.webm` | YouTube S-02 素材 | WebM | — |
| `shots/S-03-model.webm` | YouTube S-03 素材 | WebM | — |
| `shots/S-04-csv-drop.webm` | YouTube S-04 素材 | WebM | — |
| `shots/S-05-mapping.webm` | YouTube S-05 素材 | WebM | — |
| `shots/S-06-batch.webm` | YouTube S-06 素材 | WebM | — |
| `shots/S-07-results.webm` | YouTube S-07 素材 | WebM | — |
| `shots/S-08-export.webm` | YouTube S-08 素材 | WebM | — |

出力先ディレクトリ: `products/hima/assets/demo/`（.gitignore 対象のため本リポジトリには含めない）

---

## 7. 品質チェック

変換後に以下を確認すること:

- [ ] ファイルサイズが上限以内
- [ ] フレームレートが仕様通り（`ffprobe -v error -select_streams v -show_entries stream=r_frame_rate <file>`）
- [ ] 解像度が仕様通り（`ffprobe -v error -select_streams v -show_entries stream=width,height <file>`）
- [ ] ループ再生が正しく動作する
- [ ] 色がバンディングしていないか目視確認
- [ ] テキストが潰れていないか目視確認（特に小さいフォントのキャプション）
- [ ] クリックハイライトが見えるか
- [ ] エンドフレーム（1-B）のテキストが読めるか
