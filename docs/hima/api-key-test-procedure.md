# Hima APIキー疎通確認手順書（P-01: E2E接続確認）

最終更新: 2026-02-14  
対象: `hima.agiinc.io`（本番デプロイ済み環境）

## 1. テスト前提条件

## 1-1. 必要な準備

- 実 API キー（3プロバイダすべて、検証ロールでの実キー）
  - OpenAI: `sk-...`
  - Anthropic: `sk-ant-...`
  - Google AI: `AIza...`
- 3キーはそれぞれ `API キー` 画面に **実際に入力** する（実装上、マスキング表示で扱われる）
- キーの有効性（課金有効化 / レートリミット / 利用上限）を各社コンソールで事前確認済み
- テスト実施端末で `hima.agiinc.io` と `api-hima.agiinc.io` への HTTPS 接続が可能
- ブラウザ: Edge/Chrome/Safari 等（キャッシュを避けるため、可能ならシークレット/プライベート窓）
- （本番環境前提）`hima.agiinc.io` で `VITE_PROXY_URL` が `https://api-hima.agiinc.io` に設定されていること

## 1-2. テスト環境

- テスト URL: `https://hima.agiinc.io`
- API プロキシ経由先（疎通確認時の実接続先）: `https://api-hima.agiinc.io`
- 参照: `docs/hima/launch-checklist.md` P-01 / `docs/hima/mvp-spec.md`（F1）

## 2. 各プロバイダの疎通確認手順（E2E）

### 2-1. 共通前提（3プロバイダ共通）

1. `https://hima.agiinc.io` にアクセスし、トップが表示されることを確認
2. 右上の「`設定`」をクリック
3. モーダル「設定」が開くことを確認
4. `API キー` セクションで対象プロバイダ行が表示されていることを確認
5. 既存キーがある場合は、必要に応じて「`更新`」→キー再入力 →「`保存`」を実施（未登録なら入力欄をそのまま利用）
6. `疎通確認` をクリックし、結果ラベルを観測

**共通成功期待**
- 画面内に `形式OK` と表示されること
- 既存キーはマスクされ、先頭6文字 + 末尾4文字で表示されること
- ブラウザリフレッシュ後もキー登録状態が復元されること

### 2-2. OpenAI

1. OpenAI 行の入力欄（または更新）に有効な OpenAI API キーを入力
2. `保存` を押下
3. `疎通確認` を押下
4. 結果表示を確認

**OpenAI 期待結果**
- 形式OK が表示される
- 開発者ツール Network を確認する場合: `https://api-hima.agiinc.io/https://api.openai.com/v1/models` のリクエストが 200 系（成功）で返る

### 2-3. Anthropic

1. Anthropic 行の入力欄（または更新）に有効な Anthropic API キーを入力
2. `保存` を押下
3. `疎通確認` を押下
4. 結果表示を確認

**Anthropic 期待結果**
- 形式OK が表示される
- 開発者ツール Network を確認する場合: `https://api-hima.agiinc.io/https://api.anthropic.com/v1/messages` のリクエストが 200 系（成功）で返る

### 2-4. Google AI

1. Google AI 行の入力欄（または更新）に有効な Google AI キーを入力
2. `保存` を押下
3. `疎通確認` を押下
4. 結果表示を確認

**Google AI 期待結果**
- 形式OK が表示される
- 開発者ツール Network を確認する場合: `https://api-hima.agiinc.io/https://generativelanguage.googleapis.com/v1beta/models?...` のリクエストが 200 系（成功）で返る

## 3. 合否判定基準

### 3-1. 成功（PASS）

- OpenAI / Anthropic / Google の各 3 行すべてで `疎通確認` の結果が `形式OK` になる
- 3行の登録キーが `保存` 後にマスク表示され、`設定` を再オープンしても同等に保持されている
- 各 `削除` / `更新` がエラーなく完了し、他プロバイダ設定に影響しない

### 3-2. 失敗（FAIL）

- いずれか1行が `形式エラー` で止まる
- `疎通確認` が `確認中...` のまま戻らない、または無限リトライになる
- 連続3回の確認で同一エラーが再発する
- 3行のうち1行でも設定保存・削除・再表示が反映されない

## 4. トラブルシューティング

### 4-1. `形式エラー` が出る

- 原因
  - キー形式不一致（prefix、空白、改行、トリム不足）
  - 対象キーの権限不足／無効キー
  - 利用限度超過・課金停止
- 対処
  - キーを再入力して再保存（先頭/末尾の空白を除去）
  - 各社コンソールでキーの状態を確認
  - ローテーションされたキーで再試行

### 4-2. `確認中...` のまま戻らない

- 原因
  - `hima.agiinc.io` 側 Worker への到達不良
  - ネットワーク遮断や CORS/Proxy 設定不備
  - 一時的な `api-hima.agiinc.io` 遅延
- 対処
  - `https://api-hima.agiinc.io` への HTTPS 到達、ブラウザ開発者ツールの Network でエラー確認
  - 1〜2分待機して再試行
  - キャッシュをクリア/ハードリロードして再試行

### 4-3. OpenAI/Anthropic/Google で片系のみ失敗

- 原因
  - 該当キーの権限不足、レート制限、モデル/API 利用権限差異
- 対処
  - 失敗系プロバイダのみキーを新規再登録（削除→保存）
  - アカウント側で該当製品/課金ステータス・利用制限を確認
  - 可能であれば別テストキーで再試験

## 5. テスト結果記録テンプレート

### 5-1. 事前情報

| 項目 | 記入例 |
|---|---|
| 実施日（JST） | 2026-03-22 10:30 |
| 実施者 | 例: F.E. |
| ブラウザ / OS | 例: Chrome 132 / macOS |
| 環境 | https://hima.agiinc.io |
| Proxy | https://api-hima.agiinc.io |

### 5-2. プロバイダ別結果

| 時刻 | プロバイダ | キー状態 | 期待結果 | 実測結果 | 結果 | 補足 |
|---|---|---|---|---|---|---|
|  | OpenAI | 登録済 | 形式OK |  | PASS / FAIL |  |
|  | Anthropic | 登録済 | 形式OK |  | PASS / FAIL |  |
|  | Google AI | 登録済 | 形式OK |  | PASS / FAIL |  |

### 5-3. 補足ログ

- 開発者ツール Network で失敗が発生した場合、対象URL / ステータス / エラーメッセージを記録
- 失敗時のみ、キー再発行日時と再試行回数を記録

## 6. W10 パフォーマンステスト用 環境変数設定

### 6.1 perf-test-runner.mjs が参照する環境変数

`products/hima/scripts/perf/perf-test-runner.mjs` は以下の環境変数を `process.env` から読み取る。各プロバイダで複数の変数名をフォールバック順に参照する。

| プロバイダ | 優先順位1 | 優先順位2 | 優先順位3 |
|---|---|---|---|
| OpenAI | `OPENAI_API_KEY` | `OPENAI_KEY` | — |
| Anthropic | `ANTHROPIC_API_KEY` | `ANTHROPIC_KEY` | — |
| Google AI | `GOOGLE_API_KEY` | `GOOGLEAI_KEY` | `GOOGLE_AI_KEY` |

推奨: 優先順位1の変数名（`OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GOOGLE_API_KEY`）を使用すること。

### 6.2 ローカル開発環境での設定方法

#### 方法A: .env ファイル（推奨）

`products/hima/.env` にキーを記載し、実行時に読み込む。`.env` は `.gitignore` 対象のためリポジトリには含まれない。

```bash
# products/hima/.env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxx
```

実行:

```bash
cd products/hima
export $(cat .env | xargs)
node scripts/perf/perf-test-runner.mjs --scenario=p13 --url=https://hima.agiinc.io
```

#### 方法B: インライン環境変数

```bash
cd products/hima
OPENAI_API_KEY=sk-... ANTHROPIC_API_KEY=sk-ant-... GOOGLE_API_KEY=AIza... \
  node scripts/perf/perf-test-runner.mjs --scenario=p13 --url=https://hima.agiinc.io
```

#### 方法C: シェルプロファイルに export

`~/.zshrc` 等に `export OPENAI_API_KEY=...` を記載する方法。永続的に設定される。テスト専用キーの場合は方法A/B を推奨。

### 6.3 Cloudflare Worker（api-hima.agiinc.io）の設定

hima の CORS プロキシ Worker（`products/hima/worker/`）はユーザーの API キーをブラウザ側のリクエストヘッダから透過的に転送する設計のため、Worker 自体に API キーの環境変数設定は不要。

- `wrangler.toml` の `[vars]` には `ALLOWED_ORIGIN` のみ設定
- API キーはフロントエンドの localStorage に保存され、リクエスト時に `Authorization` / `x-api-key` ヘッダで送信される
- Worker はヘッダをそのまま各プロバイダ API に転送する

参考: Worker が `.dev.vars` でシークレットを管理する必要がある場合は以下の手順となるが、現行アーキテクチャでは不要。

```bash
# products/hima/worker/.dev.vars（ローカル開発時のみ、現在は未使用）
# SOME_SECRET=value
```

```bash
# 本番 Worker にシークレットを設定する場合（現在は未使用）
# cd products/hima/worker
# wrangler secret put SOME_SECRET
```

### 6.4 ローカル開発環境 vs 本番環境の使い分け

| 項目 | ローカル開発 | 本番（hima.agiinc.io） |
|---|---|---|
| テスト URL | `http://localhost:5173` | `https://hima.agiinc.io` |
| API プロキシ | ローカル Worker or 直接 | `https://api-hima.agiinc.io` |
| API キー設定場所 | `.env` / インライン環境変数 | `.env` / インライン環境変数 |
| perf-test-runner の `--url` | `--url=http://localhost:5173` | `--url=https://hima.agiinc.io`（デフォルト） |
| mockモード | `--mock` フラグで API キー不要 | `--mock` フラグで API キー不要 |
| メモリ計測精度 | headless: 概算値 | `--headless=false` 推奨 |

W10 パフォーマンステストでは本番環境（`https://hima.agiinc.io`）を対象とする。ローカルでの事前確認には `--mock` フラグを使用可能。

## 7. 備考

- 本手順は P-01 の「登録・更新・削除・マスク表示」テストの実キー到達確認補助として使用し、実施後に `docs/hima/launch-checklist.md` の P-01 を `成功` に更新する。
- 実 API キーの値は本書に記載しない。マスキング済み文字列（例: `sk-abcd...xyz`）は許容する。
- W10 パフォーマンステストの詳細な実行計画は `docs/hima/perf-test-w10-execution-plan.md` を参照。
