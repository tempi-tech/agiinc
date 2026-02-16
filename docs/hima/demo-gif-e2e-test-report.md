# デモGIF E2Eテストレポート（hima）

## 実施日時
- 2026-03-12 本番キャプチャ準備を想定した事前確認（実施日: 2026-02-16T06:09:37.911Z）

## 1) スクリーンショット取得
- 対象URL: https://hima.agiinc.io/app
- 使用解像度: `1440x900`
- 取得手段: Playwright (headless Chromium) 1枚
- 取得先:
  - `products/hima/demo-video/src/assets/real-ui/real-ui-1b-s01-overview.png`
  - `products/hima/demo-video/src/assets/real-ui/test-app-workspace.png`（既存モック差し替え用に同名置換）
- 取得結果:
  - ファイルサイズ: 42,587 bytes（PNG）
  - 画像サイズ: `1440x900`
  - 視覚色: 画面中心付近が `rgb(16,24,40)`、周辺が `rgb(3,7,18)`。
    - 目標の暗色背景 `#0F172A (rgb 15,23,42)` と近接、完全一致確認ではないが実用レンジ内
- ダークテーマ確認:
  - `document.documentElement` / `body` の `backgroundColor` は `rgba(0,0,0,0)`（透過）
  - ただし最終キャプチャ画像では暗色基調が保持

## 2) Remotion差し替えの技術検証（画像パス・解像度・アスペクト）
- 変更ファイル:
  - `products/hima/demo-video/src/types.ts`（`HimaWorkspaceProps` に `realUiImage?: string` を追加）
  - `products/hima/demo-video/src/components/HimaWorkspace.tsx`（`realUiImage` 指定時の背景画像表示分岐を追加）
  - `products/hima/demo-video/src/scenes/SceneOverviewX.tsx`（`test-app-workspace` 相当シーンを実UI画像へ置換）
- 画像パス互換性:
  - 画像インポートはVite/Remotionで解決可能。
  - `SceneOverviewX` で `workspaceScreenshot` を `realUiImage` として渡し、`HimaWorkspace` が `img` として描画。
- 解像度・アスペクト:
  - 取得画像は `1440x900`（16:10）
  - 対象レンダリング `demo-x` は `1200x675`（16:9）
  - Remotion側は `objectFit: cover` で表示されるため、1-B用途では一部トリミングが発生する可能性あり（`4:10`→`16:9`）

## 3) レンダリング結果（ドライラン）
- 実施コマンド:
  - `npx remotion render demo-x output/e2e-demo-x-overview.webm`
  - `npx remotion still demo-x output/e2e-demo-x-overview-still.png --frame=0`
- 結果:
  - `output/e2e-demo-x-overview.webm`
    - 1200x675, VP8, 28.01s
    - サイズ: `606225 bytes`
    - 出力成功（フレーム落ち/異常終了なし）
  - `output/e2e-demo-x-overview-still.png`
    - 1200x675, 51KB
    - 出力成功
- 品質確認:
  - 背景色: 抽出画像が暗色トーンを維持（`#0F172A` 近傍）
  - テキスト可読性: S0は静止画シーンのため、ワークスペース構造の文字レベルは画素上で有効レンダリングを確認できたが、S1以降のモック差し替え評価は未実施（本タスク範囲外）

## 4) 3/12本番キャプチャに向けた所見・課題
- 1枚取得は完了（要件の「1シーン以上」は満たす）。
- 実UI差し替えの技術要件（画像インポート、パス解決、Remotion組み込み、レンダリング）は成立。
- 優先改善点:
  - 1-B の16:9仕様に対して、実取得は16:10。今後は収録時点で16:9用にトリミング/安全余白を入れるか、画像読み込み時のレンダリング挙動を検証すること。
  - `/app` はログイン状態/利用済みデータによりUI差異が出るため、APIキー未設定時代替フローを含めた再現条件を固定。
  - 次段階は1-A/1-B全シーンを対象に、実UI素材とモック演出の境界（カーソル・モーション・文字変化）を確認する自動差し替えテストを実施。
