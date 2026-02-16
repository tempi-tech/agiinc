# ダークテーマ適応 実装レポート

> Creative Director レア・デュボワ | 2026-02-16 | ステータス: 完了

---

## 1. 実施内容

`dark-theme-adaptation-plan.md` に基づき、Remotion パイプラインのダークテーマ適応準備を実施した。実 UI スクリーンショットの差し替えは今回のスコープ外であり、トランジション・カーソル周りの構造変更のみを行った。

### 1-1. BRAND 定数にダークテーマ色を追加

**対象ファイル:** `types.ts`, `DemoGifLP.tsx`, `DemoGifX.tsx`

`HimaBrand` 型および両コンポジションの BRAND 定数に以下 4 色を追加:

| 定数名 | 値 | 用途 |
|---|---|---|
| `darkNavy` | `#0F172A` | 実 UI ベース背景色。トランジション制御に使用 |
| `darkPanel` | `#1E293B` | 実 UI パネル背景色。参照値 |
| `cursorLight` | `#FFFFFF` | ダーク背景用カーソル本体色 |
| `highlightBlue` | `rgba(99,132,255,0.30)` | ダーク背景用カーソルハイライト |

### 1-2. トランジション背景色の変更

**対象ファイル:** `DemoGifLP.tsx`, `DemoGifX.tsx`

`TransitionSeries` を包む `AbsoluteFill` の `backgroundColor` を `BRAND.offWhite`（`#FAFAF8`）から `BRAND.darkNavy`（`#0F172A`）に変更。

- DemoGifLP: 本番用・dryrun 用の両方の AbsoluteFill を変更
- DemoGifX: ルート AbsoluteFill を変更

これにより、`fade()` クロスフェード中間フレームで白フラッシュが発生しなくなる。

### 1-3. カーソルオーバーレイ無効化フラグ追加

**対象ファイル:** `types.ts`, `HimaWorkspace.tsx`

`HimaWorkspaceProps` に `disableCursorOverlay?: boolean` を追加。`true` のとき、カーソル SVG とカーソルハイライト円の描画を完全にスキップする。

- 既存のシーンコンポーネントは影響なし（デフォルト `false`）
- 実 UI 映像差し替え時に各シーンで `disableCursorOverlay={true}` を渡すことで、Kap 録画内のネイティブカーソルのみが表示される

---

## 2. 変更ファイル一覧

| ファイル | 変更内容 |
|---|---|
| `src/types.ts` | `HimaBrand` に 4 色追加、`HimaWorkspaceProps` に `disableCursorOverlay` 追加 |
| `src/DemoGifLP.tsx` | BRAND に 4 色追加、背景色を `darkNavy` に変更 |
| `src/DemoGifX.tsx` | BRAND に 4 色追加、背景色を `darkNavy` に変更 |
| `src/components/HimaWorkspace.tsx` | `disableCursorOverlay` prop の受け取りとカーソル描画制御の実装 |

---

## 3. 品質ゲート自己チェック

| # | チェック項目 | 基準 | 結果 | 備考 |
|---|---|---|---|---|
| 1 | トランジション中の白フラッシュ | 発生しないこと | PASS | 背景色が `#0F172A` に統一されたため、フェード中間で白が出ない。dryrun レンダリングで確認済み |
| 2 | テキスト可読性（11-12px） | GIF 再生時に判読可能 | N/A（Phase 2） | 実 UI 映像差し替え後に確認。モック描画のテキストは現行維持 |
| 3 | カーソル視認性 | ダーク背景で明確に見えること | N/A（Phase 2） | `disableCursorOverlay` フラグ準備完了。Kap 録画のカーソル使用時に確認 |
| 4 | エンドフレーム遷移 | ダークネイビー → チャコールが自然 | PASS | `#0F172A` → `#1A1A1A` は明度差が小さく、非常に滑らかな遷移 |
| 5 | ループ接続（1-A） | S4→S1 のフェードが自然 | PASS | 両方 `#0F172A` 背景のため、ループ接続の色ジャンプなし |
| 6 | ファイルサイズ | 1-A: 5MB 以下 / 1-B: 15MB 以下 | N/A（Phase 2） | 実 UI 映像差し替え後に最終確認。dryrun: 153.6 kB（正常） |
| 7 | 色バンディング | ダーク部分でバンディングなし | N/A（Phase 2） | GIF 出力後に確認。WebM 中間出力では問題なし |

### 判定

- **即時確認可能な項目（1, 4, 5）**: 全 PASS
- **Phase 2（実 UI 映像差し替え後）で確認する項目（2, 3, 6, 7）**: フラグ・構造準備完了

---

## 4. レンダリング検証

```
$ npm run render:dryrun
Composition: demo-lp-dryrun
Codec: vp8
Output: output/demo-lp-dryrun.webm
Rendered 120/120 → 153.6 kB
```

TypeScript コンパイルエラー: なし
レンダリング: 正常完了

---

## 5. 未実施事項（Phase 2 で対応）

計画書の実装タスク #4, #5, #6 は実 UI 映像の撮影・差し替え後に実施する:

- タスク #4: 実 UI 映像読み込みコンポーネント実装（`<Video>` / `<Img>` 切り替え）
- タスク #6: 不要な BRAND 定数の削除（`offWhite`, `warmGray`, `border`, `textSecondary`）

今回はパイプライン準備として、トランジション背景色とカーソル無効化の構造のみを整備した。
