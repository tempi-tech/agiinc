# Hima パフォーマンステスト mockモード ドライランレポート

実施日: 2026-02-15
実施者: ラジ・パテル（Founding Engineer）
対象: `products/hima/scripts/perf/perf-test-runner.mjs`
目的: W10（3/3-9）本番テスト実行に向けた `--mock` モードでの事前検証

## 1. 実行環境

- スクリプト: `products/hima/scripts/perf/perf-test-runner.mjs`
- Playwright: Chromium（headless）
- 対象URL: `https://hima.agiinc.io`
- モード: `--mock`（100-500ms ランダム遅延モック応答）
- APIキー: 未使用（モックキー自動挿入）

## 2. 発見・修正したバグ（3件）

### Bug-1: Playwright `.first` プロパティ呼び出し

- 箇所: `setRecipe` (L288), `makeActionRunner` (L531)
- 原因: `page.locator('select').first` は Playwright では `first()` メソッド呼び出しが必要
- 修正: `.first` → `.first()` （2箇所）

### Bug-2: `prepareBatchInput` の要素セレクタ不一致

- 箇所: `prepareBatchInput` (L301)
- 原因: `querySelectorAll('div')` で件数表示を探していたが、実UIでは `<span>` に `{count} 件` が表示される
- 修正: `querySelectorAll('div')` → `querySelectorAll('span')`

### Bug-3: `readRowsExpected` の呼び出しタイミング

- 箇所: `runP13` (L486), `runP14` (L606), `runP15` (L670)
- 原因: バッチ実行前に ResultTable の行数を確認しようとするが、テーブル行はバッチ開始後にしか生成されない → 常にタイムアウト
- 修正: バッチ実行前の `readRowsExpected` 呼び出しを削除（3箇所）。`prepareBatchInput` 内で件数確認済みのため冗長

## 3. P-13: 100件バッチ基準計測（mockモード）

- ステータス: **スキップ（想定通り）**
- 理由: P-13 は実APIキー必須。mockモードでは設計通りスキップ
- レポート出力: `scripts/perf/results/hima-perf-p13-1771157224122.{json,md}`
- 判定: スキップハンドリング正常動作

## 4. P-14: UI応答性テスト（mockモード）

- ステータス: **PASS**
- プロバイダ: openai（gpt-4o-mini / mock）
- 行数: 100件
- 総実行時間: 30,510ms
- 最終状態: done=100, error=0
- LongTask: 0件
- メモリサンプル: 2件（開始・終了時 10MB 安定）
- UI操作:
  - scroll: 55回実行、平均 12ms（最大 36ms）
  - expand: 55回実行、平均 30ms（最大 90ms）
  - cancel: 未発動（全件完了が先）
  - エラー: 0件
- 判定: UI応答性に問題なし。mockモードでの100件完了フロー正常
- レポート出力: `scripts/perf/results/hima-perf-p14-1771160570592.{json,md}`

## 5. P-15: メモリ使用確認テスト（mockモード）

- ステータス: **PASS**
- プロバイダ: openai（gpt-4o-mini / mock）

| 件数 | 実行時間 | 平均/件 | 完了 | エラー | 最大メモリ | 最終メモリ |
|------|----------|---------|------|--------|-----------|-----------|
| 100  | 6,650ms  | 67ms    | 100  | 0      | 10MB      | 10MB      |
| 200  | 12,752ms | 64ms    | 200  | 0      | 10MB      | 10MB      |
| 300  | 18,344ms | 61ms    | 300  | 0      | 10MB      | 10MB      |

- LongTask: 0件
- メモリ推移: 全サイズで 10MB 一定（mockモードのため DOM 更新コスト中心）
- クラッシュ・タブリロード: なし
- 判定: 100/200/300件すべて正常完了。メモリリークの兆候なし
- レポート出力: `scripts/perf/results/hima-perf-p15-1771160622780.{json,md}`
- 注意: `performance.memory` は headless Chromium では概算値。本番テスト（W10）では `performance.measureUserAgentSpecificMemory` による精密測定を推奨

## 6. レポート出力確認

| シナリオ | JSON | MD | ステータス |
|----------|------|----|-----------|
| P-13     | OK   | OK | スキップ（想定通り） |
| P-14     | OK   | OK | 正常完了 |
| P-15     | OK   | OK | 正常完了 |

## 7. W10 本番テストに向けた所見

1. **スクリプトは動作する** — Bug-1〜3 の修正により、mockモードで P-14/P-15 のフルフロー（レシピ作成→データ入力→バッチ実行→完了待ち→レポート出力）が正常に動作することを確認
2. **P-13 は実APIキーが必要** — W10 までに `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GOOGLE_API_KEY` を環境変数で準備すること
3. **メモリ測定の精度** — headless モードでは `performance.memory` のフォールバック値が概算。本番では `--headless=false` または cross-origin-isolated ヘッダを付与して `measureUserAgentSpecificMemory` を有効化することを推奨
4. **キャンセル動作** — P-14 の mock 実行では全件が約30秒で完了したため、cancelAfterMs=12000ms のトリガーはキャンセルボタン表示前に完了。本番テスト（実API遅延あり）ではキャンセル動作を確認可能

## 8. 変更ファイル一覧

- `products/hima/scripts/perf/perf-test-runner.mjs` — Bug-1〜3 修正
- `docs/hima/perf-test-mock-dryrun-report.md` — 本レポート（新規）
