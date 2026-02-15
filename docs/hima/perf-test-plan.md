# Hima パフォーマンステスト計画書（P-13〜P-15）

作成日: 2026-02-14  
対象: `hima.agiinc.io`  
対応期限: 2026-03-21

参照:

- `docs/hima/launch-checklist.md`
- `docs/hima/tech-architecture.md`
- `products/hima/src/services/batchEngine.ts`
- `products/hima/src/components/workspace/InputPanel.tsx`
- `products/hima/src/components/workspace/ResultTable.tsx`
- `products/hima/src/stores/batchStore.ts`

## 1. 前提

### 1.1 実環境

- ベース URL: `https://hima.agiinc.io`（`/app`）
- Cloudflare Worker 経由 (`https://api-hima.agiinc.io`) で実 API を叩く
- テスト実行時は実運用と同等の Chrome（デスクトップ）
- 主要モデル:  
  - OpenAI: `gpt-4o-mini`
  - Anthropic: `claude-haiku-4-5-20251001`
  - Google: `gemini-2.0-flash`

### 1.2 予測されるボトルネック（現行コード）

`products/hima/src/services/batchEngine.ts` と UI 更新箇所の確認で、次の点を性能検証の注視ポイントとして扱う。

- バッチ並列上限 `MAX_CONCURRENCY = 5` の影響
- `runBatch`/`retryItems` の `while` + `await processItem` によるワーカー動作
- `batchStore.updateItem` が `items` 全件を毎回 `map` して再計算する実装
- `ProgressBar` の `done/error` を `items` 全件集計する実装
- `ResultTable` が `items` 全件を常時レンダリング（100〜300 件時の DOM 再描画負荷）
- `AbortController` / キャンセル時の未完了タスク停止挙動

## 2. P-13: 100件バッチ実行の基準計測

### 2.1 目的

100件バッチを主要モデルで実行し、モデル別の基礎処理時間・スループット・エラー率を測定し、ボトルネックを記録する。

### 2.2 テストデータ

- 入力はテキスト貼付けモードを使用
- `input` カラム 100 行を作成
- レシピ例:
  - プロンプト: `{{input}} を 20 文字以内で要約してください。`
  - 変数: `input` のみ
  - `max_tokens`: 256、`temperature`: 0.2
- 生成データ例:
  - `これは性能測定用のテスト入力です。001`
  - `これは性能測定用のテスト入力です。002`
  - ...

### 2.3 手順

1. `products/hima/scripts/perf-test-runner.mjs` を使用して事前に鍵を設定
   - `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY` を環境変数で与える
2. スクリプトで `--scenario p13` を実行し、主要モデルを順次実行
   - 実行 URL: `https://hima.agiinc.io`
   - `rows=100`
   - タイムアウト: 20 分以上（必要に応じ延長）
3. スクリプトログに含まれる以下を収集
   - 実行開始〜完了時間
   - 100件完了までの経過
   - 完了数・エラー数
   - DOM で観測された長時間タスク（LongTask）数
4. 同時並列度（既定 5）を崩さず、モデル毎に単発で実施
   - OpenAI だけで完了しない場合は該当モデルを除外し、次モデルへ進行
5. 各モデルの結果を比較して、最も重い工程（ネットワーク待機 / UI 更新待ち / エラー再試行）を記録

### 2.4 計測項目

- 総実行時間（ms）
- 1件あたり平均処理時間（総実行時間 ÷ 完了件数）
- 100件完了時刻（`done + error = 100` 達成時間）
- エラー件数 / リトライ回数
- LongTask 件数と最大継続時間

### 2.5 合否基準

- 合格:
  - 100件処理終了（`done + error = 100`）
  - 20分以内に終了（主要モデル）
  - 画面がフリーズ・クラッシュせず、進捗バー・行状態が更新され続ける
- 要注意:
  - エラー率 20% 以上、または LongTask 最大 500ms 超過が顕著
- 不合格:
  - 100件到達前のタイムアウト
  - UI が操作不能（ボタン無反応、行の更新停止）

## 3. P-14: UI応答性テスト

### 3.1 目的

バッチ処理実行中に `scroll / 展開 / キャンセル` が機能し、UI が破綻しないことを確認する。

### 3.2 操作シナリオ

- 100件入力でバッチ実行開始
- 実行中に以下を 20〜40 秒継続で 1〜2 秒間隔で反復
  - 結果テーブルをスクロール
  - 最初の行を開閉（展開）
  - 一定時間後、キャンセルボタン押下
  - キャンセル後もスクロール・展開が継続可能か確認

### 3.3 計測方法

- スクリプトで各操作の実行時間を採取（scroll/click/展開）
- Chrome の `longtask` 測定で 50ms 超過タスクを確認
- 操作前後でレンダリング崩れ（行が消える、状態が固定、ボタンが無反応）を検知

### 3.4 合否基準

- 合格:
  - 実行中、任意回数のスクロール・展開・キャンセルが成立
  - 操作の遅延が短時間（目安 1.0 秒未満）で、継続的に反応
  - キャンセル後に「キャンセル済み」が表示される
- 不合格:
  - 操作が時々 2 秒以上反応しない
  - キャンセルが効かず実行が停止しない
  - UI が破綻して再操作不能になる

## 4. P-15: メモリ使用確認テスト

### 4.1 目的

100件〜300件規模で、100〜300件の増加時にメモリ使用率を監視し、ブラウザクラッシュを回避する運用限界を確認する。

### 4.2 計測方法

- Chrome DevTools 経由で `performance.memory` を定期サンプリング（1秒間隔）
- 各件数実行前・実行中・完了後の `usedJSHeapSize` を取得
- メモリ急増が発生しても 300 件実行終了時にクラッシュしないことを確認

### 4.3 シナリオ

1. 100 件で実行（完了まで）
2. 200 件で実行（完了まで）
3. 300 件で実行（完了まで）
4. 各ステップ終了後に  
   - 完了件数  
   - エラー件数  
   - 最大メモリ使用量  
   - エンド時メモリ使用量  
   を記録

### 4.4 合否基準

- 合格:
  - 100/200/300 各件数で実行完了
  - `hima.agiinc.io` 側のクラッシュ、ブラウザ強制終了、リロード不要の異常が発生しない
  - メモリ推移が増加し続ける場合は上限に達する前に警告として記録
- 不合格:
  - 途中でブラウザクラッシュまたはタブリロード
  - 300件で実行不能

## 5. 実行スクリプト

`products/hima/scripts/perf-test-runner.mjs` を追加している。実行前提:

1. `products/hima` 直下で Playwright をインストール
   - `pnpm add -D playwright`
2. APIキーを環境変数で設定
3. 次のコマンド例を実行

```bash
cd products/hima
OPENAI_API_KEY=... ANTHROPIC_API_KEY=... GOOGLE_API_KEY=... \
node scripts/perf/perf-test-runner.mjs --scenario=p13 --url=https://hima.agiinc.io
node scripts/perf/perf-test-runner.mjs --scenario=p14 --url=https://hima.agiinc.io
node scripts/perf/perf-test-runner.mjs --scenario=p15 --url=https://hima.agiinc.io
```

### 5.1 モックモード運用（APIキー未設定時）

W10前の最終調整として、`--mock` フラグを付与してモック応答で P-14 / P-15 を実施できる。

```bash
cd products/hima
node scripts/perf/perf-test-runner.mjs --scenario=p14 --url=https://hima.agiinc.io --mock
node scripts/perf/perf-test-runner.mjs --scenario=p15 --url=https://hima.agiinc.io --mock
```

モックモード時の仕様:

- 各AI API 呼び出しに対し 100〜500ms のランダム遅延を挿入
- ダミーテキストを返却
- P-13 は実APIキーが必要なため、`--mock` 時は `skipped` 扱い
- レポートは `scripts/perf/results/hima-perf-<scenario>-<timestamp>.json` と `.md` のペアで出力
- Dryrun でキー未設定の場合も例外で停止せず、スキップ理由をレポートに明記

### 5.2 期待するレポート

- JSON: 実行結果本体（`skipped` / `statusSamples` / `memorySamples` を含む）
- Markdown: `json` と対応する可読サマリ
- メモリは `performance.measureUserAgentSpecificMemory` 優先、未対応時は `performance.memory`、最終フォールバックは Node の `process.memoryUsage` を採用

## 6. 成果物

- テスト実行記録（JSON）
- 判定結果（合否）
- ボトルネック観測メモ（モデル別）
- 必要に応じて、`launch-checklist.md` の P-13〜P-15 の状態更新
