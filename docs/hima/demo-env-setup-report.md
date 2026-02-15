# デモGIF制作環境セットアップレポート

作成日: 2026-02-15
作成者: Creative Director (レア・デュボワ)
対象: Hima デモGIF制作パイプライン検証
前提: `docs/hima/demo-env-verification.md`（2026-02-14）の未解決事項を対応

---

## 1. 実施内容

前回の環境検証レポートで Kap / OBS が未インストールと判明していたため、収録ツールの導入と ffmpeg 変換パイプラインの実動作検証を行った。

---

## 2. Kap インストール結果

```
brew install --cask kap
```

- **結果**: OK
- **バージョン**: Kap 3.6.0 (arm64)
- **インストール先**: `/Applications/Kap.app`
- **備考**: OBS Studio は Kap で問題が出た場合の代替として保留。現時点ではインストール不要

---

## 3. ffmpeg 変換パイプライン検証

### テスト素材

ffmpeg の `testsrc2` ジェネレーターで 3 秒のテスト動画を生成:

```
ffmpeg -f lavfi -i "testsrc2=duration=3:size=1440x900:rate=30" \
  -c:v libvpx-vp9 -b:v 1M -an -y test-capture.webm
```

- 出力: `test-capture.webm` (327KB, 1440x900, 30fps, 90 frames)

### 変換結果

#### 1-A LP 用 GIF (demo-lp.gif)

| 項目 | 仕様値 | 実測値 | 判定 |
|---|---|---|---|
| 解像度 | 1200x750 | 1200x750 | OK |
| FPS | 15 | 15 | OK |
| ファイルサイズ | < 5MB | 3.2MB | OK |
| ループ | 無限 | 無限 (loop=0) | OK |
| フレーム数 | - | 45 (3s x 15fps) | OK |

#### 1-A LP 用 WebM (demo-lp.webm)

| 項目 | 仕様値 | 実測値 | 判定 |
|---|---|---|---|
| 解像度 | 1200x750 | 1200x750 | OK |
| FPS | 15 | 15 | OK |
| ファイルサイズ | < 2MB | 152KB | OK |
| コーデック | VP9 | libvpx-vp9 | OK |

#### 1-B X 投稿用 GIF (demo-x.gif)

| 項目 | 仕様値 | 実測値 | 判定 |
|---|---|---|---|
| 解像度 | 1200x675 | 1200x675 | OK |
| FPS | 12 | 12 | OK |
| ファイルサイズ | < 15MB | 2.3MB | OK |
| ループ | 無限 | 無限 (loop=0) | OK |
| フレーム数 | - | 36 (3s x 12fps) | OK |

### パイプライン全 5 ステップの実行結果

| Step | 内容 | 結果 |
|---|---|---|
| 1 | LP パレット生成 (`palettegen`) | OK |
| 2 | LP GIF 生成 (`paletteuse + floyd_steinberg`) | OK |
| 3 | LP WebM 生成 (`libvpx-vp9, 500kbps`) | OK |
| 4 | X パレット生成 (`palettegen`) | OK |
| 5 | X GIF 生成 (`paletteuse + floyd_steinberg`) | OK |

---

## 4. 環境ステータス一覧（更新版）

| ツール | ステータス | バージョン |
|---|---|---|
| ffmpeg | OK | 7.1.1 |
| Google Chrome | OK | 144.0.7559.133 |
| Kap | **OK (新規)** | 3.6.0 |
| OBS Studio | 未インストール (代替) | - |
| brew | OK | - |

---

## 5. W09 実制作への残タスク

前回レポートの「要対応」リストの進捗:

- [x] Kap のインストール・起動確認
- [x] ffmpeg 変換パイプラインの動作検証（全 5 ステップ通過）
- [ ] Kap 録画時の出力形式を WebM に設定し、実際の画面録画テストを実施
- [ ] Chrome 収録環境の最終設定（集中モード、Dock/メニューバー非表示、通知抑止）
- [ ] `S0~S4` を含む短尺テスト撮影 → ffmpeg 変換のドライラン
- [ ] 本番素材（`raw-capture.webm`）での品質・容量検証

---

## 6. まとめ

- Kap 3.6.0 をインストールし、収録ツールの制約を解消
- ffmpeg の 2 パスエンコード（palettegen → paletteuse）パイプラインが全形式で正常動作することを確認
- 解像度・FPS・ファイルサイズすべてが仕様値以内
- W09 の実制作開始に向けて、環境面のブロッカーは解消された
