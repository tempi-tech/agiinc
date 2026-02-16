# CTO レビュー（Session20）

日付: 2026-02-16  
対象: `docs/hima/perf-test-w10-quickstart.md`, `docs/hima/perf-test-w10-execution-plan.md`, `docs/hima/dark-theme-implementation-report.md`

## 1. クイックスタートガイドレビュー

判定: **修正事項なし、LGTM**

確認結果:
- 手順は `W10` 本番実行（P-13/P-14/P-15）に必要な前提、APIキー準備、実行コマンド、失敗時の再試行方針を網羅している。
- APIキーは `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GOOGLE_API_KEY` を順番通りに明記しており、3プロバイダの接続手順（疎通確認）との整合が取れている。
- 主要実行コマンド（P-13/P-14/P-15）は `perf-test-runner.mjs` の実行仕様と一致している。
- 実行中/失敗時の運用注意（429時の待機、再実行の切分け）は現実的で実務で使える粒度。

## 2. 実行計画レビュー

判定: **修正あり**

### 2-1. 修正箇所（P-14 / P-15 の `--mock` 実行可否）
- 該当: `docs/hima/perf-test-w10-execution-plan.md:6.3-6.4`
- 問題: 6.2 で「`--mock` 時は P-14/P-15 を実施可」としている一方、実行コマンド側（`products/hima/scripts/perf/perf-test-runner.mjs`）では `runP14` / `runP15` が API キー未設定時に `--mock` 有無を問わず即時スキップする。
- 対応:
  - 文書を「P-14/P-15 は APIキー必須」に訂正する、または
  - `perf-test-runner.mjs` 側でキー未設定かつ `--mock` 時はモック実行パスに移行するよう実装する。

### 2-2. レートリミット対策の具体性不足
- 該当: `docs/hima/perf-test-w10-execution-plan.md:6.4`
- 問題: 本書の対策は「クールダウン中心」だが、`MAX_CONCURRENCY=5` は未調整。`api-hima` が `100 req/min/IP` という前提では、P-13/P-15 を速いレスポンス環境で連続実行した場合に再現性ある 429 回避ルールが不足。
- 対応: 429 が出た時の分割実行（`rows` の更なる細分化）と同時に、`MAX_CONCURRENCY` 低減手順を実行手順として明文化する。

## 3. ダークテーマ実装コードレビュー

判定: **修正事項なし、LGTM**

確認結果:
- `products/hima/demo-video/src/types.ts` の型追加（`HimaBrand` 追加キー、`disableCursorOverlay?: boolean`）は既存呼び出しと整合しており、既存の `BRAND` 型利用に破綻がない。
- `disableCursorOverlay` は既定 `false` でガードされているため後方互換性を維持できる。
- `DemoGifLP.tsx` / `DemoGifX.tsx` のトランジション背景を `offWhite` から `darkNavy` へ変更しており、トランジション中の白フラッシュ低減に寄与し、他シーンへ既存のレイアウト崩れを与える記載は確認できない。
