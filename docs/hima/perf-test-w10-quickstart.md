# W10 パフォーマンステスト クイックスタート（P-13 / P-14 / P-15）

作成日: 2026-02-16  
対象: `hima.agiinc.io` 本番環境  
目的: W10 初日（03-03）に APIキー設定から本番テスト実行まで迷わず進めること

## 0. 実行前提条件の消化状況（未完了のみ）

W10実行計画（`docs/hima/perf-test-w10-execution-plan.md`）の前提条件で、未消化だった項目は以下。

| チェック項目 | ステータス | 参照 |
|---|---|---|
| 3プロバイダ API キー有効性確認 | 未消化 | P-01手順書 / 各社コンソール |
| API キー課金状態・レートリミット確認（特にOpenAI TPM/RPM） | 未消化 | 各社請求・レート制限設定 |
| テスト実行中の同一本番環境利用者不在確認 | 未消化 | W10初日実行前 |

上記3点が完了すれば、W10実行は実施可能状態。

## 1. 事前準備（W10初日開始前）

1. ターミナルを開き、作業ディレクトリへ移動  
   ```bash
   cd /Users/yoishika/repos/agiinc/products/hima
   ```

2. Node / Playwright / Script 構文確認（1回のみでOK）  
   ```bash
   npx playwright --version
   node --check scripts/perf/perf-test-runner.mjs
   ```

3. 本番疎通を確認  
   ```bash
   curl -s -o /dev/null -w "%{http_code}" https://hima.agiinc.io
   curl -s -o /dev/null -w "%{http_code}" https://api-hima.agiinc.io
   ```
   期待: `200` / `403`

## 2. APIキー設定（最優先）

### 2.1 .env 作成

`products/hima/.env` を作成し、優先変数名で保存。

```bash
cat > .env <<'EOF'
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
EOF
```

**重要**: `.env` はシークレット。コミットしない。

### 2.2 W10実行時の読み込み

```bash
export $(cat .env | xargs)
echo "OPENAI: ${OPENAI_API_KEY:0:8}..."
echo "ANTHROPIC: ${ANTHROPIC_API_KEY:0:10}..."
echo "GOOGLE: ${GOOGLE_API_KEY:0:8}..."
```

### 2.3 P-01の実キー疎通確認（必須）

`docs/hima/api-key-test-procedure.md` の手順で実施（ブラウザで以下）:

1. `https://hima.agiinc.io` にアクセス
2. `設定` を開き、OpenAI / Anthropic / Google AI を順に登録
3. 各プロバイダで「`保存`」→「`疎通確認`」→`形式OK`確認
4. ブラウザを再表示してもキー保存状態が復元されることを確認

いずれか失敗時は、キー再入力→保存→再試行、または各社コンソールで課金/権限/制限を再確認。

## 3. 本番実行（W10 Day 1）

### 3.1 共通実行コマンド

```bash
cd /Users/yoishika/repos/agiinc/products/hima
export $(cat .env | xargs)
node scripts/perf/perf-test-runner.mjs \
  --url=https://hima.agiinc.io \
  --timeout-ms=1200000
```

### 3.2 P-13（100件 / 3プロバイダ）

```bash
node scripts/perf/perf-test-runner.mjs \
  --scenario=p13 \
  --url=https://hima.agiinc.io \
  --providers=openai,anthropic,google \
  --rows=100 \
  --timeout-ms=1200000
```

### 3.3 P-14（UI応答性）

```bash
node scripts/perf/perf-test-runner.mjs \
  --scenario=p14 \
  --url=https://hima.agiinc.io \
  --providers=openai \
  --timeout-ms=1200000
```

### 3.4 P-15（100/200/300件）

```bash
node scripts/perf/perf-test-runner.mjs \
  --scenario=p15 \
  --url=https://hima.agiinc.io \
  --providers=openai \
  --sizes=100,200,300 \
  --timeout-ms=3600000 \
  --headless=false
```

## 4. 運用上のチェック（実行中）

- 他ユーザー影響最小化（社内利用者へ事前連絡）
- 429 多発時: 5分待機 → 対象プロバイダのみ再実行
- `results/` 配下に `.json/.md` が毎シナリオ生成されることを確認
- 失敗時は `docs/hima/perf-test-w10-execution-plan.md` の障害対応を参照し、再試験対象を切り分け

## 5. 完了後

- `docs/hima/perf-test-w10-report.md`（最終レポート）を作成
- `docs/hima/launch-checklist.md` の P-13〜P-15 を更新
- P-01疎通結果と今回実行ログを残し、W10最終報告へ反映
