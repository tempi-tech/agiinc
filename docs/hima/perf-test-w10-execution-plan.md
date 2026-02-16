# Hima パフォーマンステスト W10 本番実行計画

作成日: 2026-02-16
作成者: ラジ・パテル（Founding Engineer）
対象期間: W10（2026-03-03〜03-09）
対象環境: `https://hima.agiinc.io`

## 1. 概要

W10 で P-13〜P-15 パフォーマンステストを本番環境（hima.agiinc.io）で実施する。mockドライラン（2026-02-15）で Bug-1〜3 を修正済みのスクリプトを使用し、実 API キーによる計測を行う。

参照:
- `docs/hima/perf-test-plan.md`（テスト計画書）
- `docs/hima/perf-test-mock-dryrun-report.md`（mockドライラン結果）
- `docs/hima/perf-test-dryrun-w10-precheck-2026-02-15.md`（事前確認結果）

## 2. テスト環境・前提条件

### 2.1 環境

| 項目 | 値 |
|---|---|
| テスト URL | `https://hima.agiinc.io` |
| API プロキシ | `https://api-hima.agiinc.io` |
| スクリプト | `products/hima/scripts/perf/perf-test-runner.mjs` |
| Playwright | Chromium（`products/hima` に導入済み） |
| 実行マシン | macOS（ローカル開発環境） |

### 2.2 実行前チェックリスト

- [ ] `hima.agiinc.io` にブラウザでアクセスし、正常表示を確認
- [ ] `api-hima.agiinc.io` への HTTPS 接続が正常であることを確認
- [ ] 3プロバイダの API キーが有効であることを各社コンソールで確認
- [ ] API キーの課金状態・レートリミットを確認（特に OpenAI の TPM/RPM）
- [ ] Playwright Chromium がインストール済みであることを確認（`npx playwright install chromium`）
- [ ] `node --check scripts/perf/perf-test-runner.mjs` で構文エラーなしを確認
- [ ] テスト実行中に他ユーザーが本番環境を使用していないことを確認

## 3. API キー要件

### 3.1 必要な環境変数

| プロバイダ | 環境変数（優先順） | キー形式 |
|---|---|---|
| OpenAI | `OPENAI_API_KEY` > `OPENAI_KEY` | `sk-...` |
| Anthropic | `ANTHROPIC_API_KEY` > `ANTHROPIC_KEY` | `sk-ant-...` |
| Google AI | `GOOGLE_API_KEY` > `GOOGLEAI_KEY` > `GOOGLE_AI_KEY` | `AIza...` |

### 3.2 設定手順

```bash
# .env ファイルに記載（products/hima/.env）
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxx
```

実行時の読み込み:

```bash
cd products/hima
export $(cat .env | xargs)
node scripts/perf/perf-test-runner.mjs --scenario=p13 --url=https://hima.agiinc.io
```

またはインラインで渡す:

```bash
cd products/hima
OPENAI_API_KEY=sk-... ANTHROPIC_API_KEY=sk-ant-... GOOGLE_API_KEY=AIza... \
  node scripts/perf/perf-test-runner.mjs --scenario=p13 --url=https://hima.agiinc.io
```

### 3.3 キー検証

テスト実行前に、各キーが有効であることを hima.agiinc.io の設定画面で疎通確認する（`docs/hima/api-key-test-procedure.md` 参照）。

## 4. テストシナリオ実行手順

### 4.1 P-13: 100件バッチ基準計測

**目的**: 実 API で 100件バッチを実行し、モデル別の処理時間・エラー率を計測する。

```bash
cd products/hima
node scripts/perf/perf-test-runner.mjs \
  --scenario=p13 \
  --url=https://hima.agiinc.io \
  --providers=openai,anthropic,google \
  --rows=100 \
  --timeout-ms=1200000
```

**実行順序**: openai → anthropic → google（順次実行）

**注意点**:
- タイムアウトは 20分（デフォルト）。実 API のレスポンス遅延を考慮し、必要に応じて `--timeout-ms=1800000`（30分）に延長
- 1プロバイダで失敗しても次プロバイダの実行は継続される
- 並列度は `MAX_CONCURRENCY = 5` 固定

### 4.2 P-14: UI応答性テスト

**目的**: バッチ処理中の scroll / 展開 / キャンセル操作が正常に機能することを確認する。

```bash
cd products/hima
node scripts/perf/perf-test-runner.mjs \
  --scenario=p14 \
  --url=https://hima.agiinc.io \
  --providers=openai \
  --timeout-ms=1200000
```

**注意点**:
- mockドライランでは全件が約30秒で完了したためキャンセル動作が未検証。実 API では遅延が大きいためキャンセルテストが有効に動作する見込み
- プロバイダは openai（gpt-4o-mini）で実施。他プロバイダでの追加確認は任意

### 4.3 P-15: メモリ使用確認テスト

**目的**: 100/200/300件でメモリ推移を計測し、クラッシュしないことを確認する。

```bash
cd products/hima
node scripts/perf/perf-test-runner.mjs \
  --scenario=p15 \
  --url=https://hima.agiinc.io \
  --providers=openai \
  --sizes=100,200,300 \
  --timeout-ms=3600000
```

**注意点**:
- 300件は処理時間が長いため、タイムアウトを 60分に設定
- `performance.measureUserAgentSpecificMemory` による精密測定を推奨。headless モードでは概算値になるため `--headless=false` での実行を検討
- mockドライランではメモリ 10MB 一定だったが、実 API では DOM 更新コストにより増加が見込まれる

### 4.4 推奨実行順序

| 順番 | シナリオ | 推定所要時間 | 理由 |
|------|----------|-------------|------|
| 1 | P-13 | 60〜90分 | 3プロバイダ × 100件。基礎データを最初に取得 |
| 2 | P-14 | 20〜30分 | P-13の結果を踏まえ、最も安定したプロバイダで実施 |
| 3 | P-15 | 90〜120分 | 100/200/300件の段階実行。最も時間がかかる |

合計推定: 3〜4時間（余裕を見て半日確保）

## 5. 合否基準

### 5.1 P-13: 100件バッチ基準計測

| 判定 | 条件 |
|------|------|
| **PASS** | 100件処理終了（`done + error = 100`）かつ 20分以内完了。画面フリーズ・クラッシュなし |
| **要注意** | エラー率 20% 以上、または LongTask 最大 500ms 超過 |
| **FAIL** | 100件到達前のタイムアウト、または UI 操作不能 |

### 5.2 P-14: UI応答性テスト

| 判定 | 条件 |
|------|------|
| **PASS** | 実行中にスクロール・展開・キャンセルが 1.0秒未満で応答。キャンセル後に「キャンセル済み」表示 |
| **FAIL** | 操作が 2秒以上無反応、キャンセルが効かない、UI 破綻 |

### 5.3 P-15: メモリ使用確認

| 判定 | 条件 |
|------|------|
| **PASS** | 100/200/300件すべて完了。クラッシュ・タブリロードなし |
| **要注意** | メモリが単調増加し、300件時に初期値の 5倍以上 |
| **FAIL** | 途中でブラウザクラッシュまたはタブリロード。300件で実行不能 |

## 6. mockドライラン結果からの学び

### 6.1 修正済みバグ（3件）

| # | 内容 | 影響 | 確認方法 |
|---|------|------|---------|
| Bug-1 | `.first` → `.first()` Playwright メソッド修正（2箇所: L288, L531） | セレクタ操作の全シナリオに影響 | `grep -n '\.first()' perf-test-runner.mjs` で2箇所確認 |
| Bug-2 | `querySelectorAll('div')` → `querySelectorAll('span')` 件数表示セレクタ（L302） | バッチ入力の件数確認に影響 | `grep -n "querySelectorAll('span')" perf-test-runner.mjs` で確認 |
| Bug-3 | `readRowsExpected` の冗長な呼び出し削除（3箇所） | バッチ実行前のタイムアウト防止 | 関数定義は残存（L372）、`runP13`/`runP14`/`runP15` 内に呼び出しがないことを確認 |

3件修正済み。02-16 回帰テストで修正維持を確認済み（P-14 PASS / P-15 PASS）。

### 6.2 実行環境の前提条件チェック手順

本番実行前に以下のコマンドで環境を検証する:

```bash
# 1. スクリプト構文チェック
cd products/hima
node --check scripts/perf/perf-test-runner.mjs

# 2. Playwright Chromium 確認
npx playwright --version
# 期待値: 1.58.2 以上

# 3. hima.agiinc.io 疎通確認
curl -s -o /dev/null -w "%{http_code}" https://hima.agiinc.io
# 期待値: 200

# 4. api-hima.agiinc.io 疎通確認
curl -s -o /dev/null -w "%{http_code}" https://api-hima.agiinc.io
# 期待値: 403（認証なしリクエストの正常応答）

# 5. API キー設定確認
echo "OPENAI: ${OPENAI_API_KEY:0:8}..."
echo "ANTHROPIC: ${ANTHROPIC_API_KEY:0:10}..."
echo "GOOGLE: ${GOOGLE_API_KEY:0:8}..."
# 各キーのプレフィックスが表示されること
```

### 6.3 本番実行時の注意点

1. **実 API の遅延**: mockモードでは 100-500ms だったが、実 API では数秒かかるケースがある。タイムアウト値を十分に確保すること
2. **キャンセルテスト**: mockではキャンセル前に完了したが、本番では `cancelAfterMs=12000ms` でキャンセルが発動する可能性が高い
3. **メモリ精度**: headless Chromium の `performance.memory` は概算値。可能なら `--headless=false` で実行し `measureUserAgentSpecificMemory` を使用
4. **レートリミット**: `api-hima.agiinc.io` のレートリミット（100 req/min/IP）に注意。並列度 5 × 100件 = 500リクエストが短時間に集中する場合、429 エラーが発生する可能性あり
5. **エラー率**: 実 API ではネットワーク不安定やプロバイダ側の一時障害でエラー率が mockより高くなる

### 6.4 レートリミット対策（api-hima 100 req/min/IP）

api-hima.agiinc.io のレートリミットは **100 req/min/IP**。`MAX_CONCURRENCY=5` はスクリプトのデフォルト値であり、429 発生状況に応じて段階的に低減する必要がある。

#### 事前対策

- P-13 の3プロバイダ順次実行は、各プロバイダ間で **5分のクールダウン** を設ける
  ```bash
  # プロバイダを個別に実行する場合
  node scripts/perf/perf-test-runner.mjs --scenario=p13 --providers=openai --timeout-ms=1200000
  sleep 300  # 5分待機
  node scripts/perf/perf-test-runner.mjs --scenario=p13 --providers=anthropic --timeout-ms=1200000
  sleep 300
  node scripts/perf/perf-test-runner.mjs --scenario=p13 --providers=google --timeout-ms=1200000
  ```

#### MAX_CONCURRENCY 調整ガイドライン

`MAX_CONCURRENCY` はアプリケーション側（`hima.agiinc.io`）のバッチ処理並列度を制御する定数である。429 の発生状況に応じて以下のように段階的に低減する:

| レベル | MAX_CONCURRENCY | rows 上限 | 適用条件 |
|--------|----------------|-----------|----------|
| 通常 | 5（デフォルト） | 100 | 429 未発生 |
| 注意 | 3 | 100 | 429 が 1回発生 |
| 制限 | 2 | 50 | 429 が 2回以上発生 |
| 最小 | 1 | 30 | 429 が頻発し改善しない場合 |

`MAX_CONCURRENCY` の変更はアプリケーション側のソース修正が必要。スクリプト側で直接変更するオプションは現状ないため、`hima` アプリのバッチ処理設定を確認すること。

#### 429 エラー発生時の対処手順

**ステップ1: 即時中断と待機**
1. テストを即時中断（スクリプトは 429 をエラーとしてカウントする）
2. **5分待機** し、レートリミットウィンドウ（1分）のリセットを待つ

**ステップ2: MAX_CONCURRENCY 低減**
1. アプリケーション側の `MAX_CONCURRENCY` を **5 → 3** に変更
2. 該当プロバイダのみで再実行
3. 再度 429 が発生した場合は **3 → 2** に低減

**ステップ3: rows 分割実行**
429 が MAX_CONCURRENCY 低減後も続く場合、`--rows` を細分化して実行する:

```bash
# P-13: 100件を 50件 × 2回に分割
node scripts/perf/perf-test-runner.mjs --scenario=p13 --providers=openai --rows=50 --timeout-ms=1200000
sleep 120  # 2分待機
node scripts/perf/perf-test-runner.mjs --scenario=p13 --providers=openai --rows=50 --timeout-ms=1200000

# P-15: sizes を個別に実行し、各回の間に3分の待機を入れる
node scripts/perf/perf-test-runner.mjs --scenario=p15 --providers=openai --sizes=100 --timeout-ms=1200000
sleep 180  # 3分待機
node scripts/perf/perf-test-runner.mjs --scenario=p15 --providers=openai --sizes=200 --timeout-ms=1200000
sleep 180
node scripts/perf/perf-test-runner.mjs --scenario=p15 --providers=openai --sizes=300 --timeout-ms=3600000
```

**ステップ4: 最終手段**
上記で改善しない場合:
1. `MAX_CONCURRENCY=1` + `--rows=30` で最小構成で実行
2. テスト時間帯を変更（深夜帯は他ユーザーの利用が少なく 429 リスクが低い）
3. レートリミット設定自体の見直しを検討

#### 計算目安

| シナリオ | リクエスト数 | 並列度5での理論最短 | 429リスク |
|----------|------------|-------------------|----------|
| P-13（1プロバイダ100件） | 100 | 〜1分（100req/5並列=20バッチ） | **中**: 全100件が1分以内に発火するとリミット到達 |
| P-14（100件） | 100 | 〜1分 | **中**: P-13と同条件 |
| P-15（100+200+300件） | 600 | 〜6分（分散） | **高**: 特に300件は3分で300リクエスト発生の可能性あり |

**注意**: 実 API のレスポンス遅延（数秒/件）が自然なスロットルとして機能するため、実環境では上記の理論最短より大幅に長くなる。ただしレスポンスが速い環境（例: gpt-4o-mini の短文応答）では 429 に到達する可能性がある。

P-15 の 300件実行時は特に注意が必要。sizes を個別に分割実行し、各回の間に **3分以上** の待機を入れることを推奨。

## 7. 障害時の対処方針

### 7.1 テスト中のサービス影響

| 事象 | 対処 |
|------|------|
| hima.agiinc.io が応答しない | テスト中断。Cloudflare ステータスと Worker ログを確認 |
| api-hima.agiinc.io で 429 エラー多発 | テスト中断。5分待機後、`--providers` を1つに絞って再実行 |
| 特定プロバイダの API エラー | 該当プロバイダを除外し、残りで継続。後日再テスト |
| ブラウザクラッシュ | Playwright ログを保存。`--headless=false` で再現確認 |
| スクリプトの予期しないエラー | エラーログを保存。修正後に該当シナリオのみ再実行 |

### 7.2 テスト中止判断基準

- hima.agiinc.io 自体が 5分以上応答しない場合
- 3プロバイダすべてで API エラーが継続する場合
- ブラウザクラッシュが 3回以上再現する場合

中止した場合は、障害内容と再実行予定日を `docs/hima/` にレポートとして残す。

## 8. レポート形式と共有方法

### 8.1 出力ファイル

スクリプトは以下のペアを自動出力する:

```
products/hima/scripts/perf/results/
├── hima-perf-p13-<timestamp>.json    # P-13 実行結果（JSON）
├── hima-perf-p13-<timestamp>.md      # P-13 可読サマリ（MD）
├── hima-perf-p14-<timestamp>.json    # P-14 実行結果（JSON）
├── hima-perf-p14-<timestamp>.md      # P-14 可読サマリ（MD）
├── hima-perf-p15-<timestamp>.json    # P-15 実行結果（JSON）
└── hima-perf-p15-<timestamp>.md      # P-15 可読サマリ（MD）
```

### 8.2 最終レポート

テスト完了後、以下をまとめた最終レポートを作成する:

- ファイル: `docs/hima/perf-test-w10-report.md`
- 内容: 3シナリオの合否判定、ボトルネック観測、改善提案
- JSON は `products/hima/` 内に保持（.gitignore 対象のため本リポジトリには含まない）
- MD レポートを `docs/hima/` にコピーして本リポジトリに commit

### 8.3 launch-checklist.md 更新

テスト結果に基づき、`docs/hima/launch-checklist.md` の P-13〜P-15 ステータスを更新する。

## 9. スケジュール（W10 内）

| 日付 | 作業 |
|------|------|
| 03-03（月） | API キー準備・疎通確認。実行環境の最終チェック |
| 03-04（火） | P-13 実行（3プロバイダ × 100件） |
| 03-05（水） | P-14 実行 + P-15 100/200件実行 |
| 03-06（木） | P-15 300件実行。予備日 |
| 03-07（金） | 最終レポート作成。launch-checklist 更新 |
| 03-08〜09 | バッファ（再実行が必要な場合） |
