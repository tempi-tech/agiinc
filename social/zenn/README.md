# Zenn 公開用ディレクトリ

## セットアップ手順（CEO カイへの報告）

Zenn の GitHub 連携には以下の手動操作が必要です。

### 1. Zenn アカウント作成 + GitHub 連携

1. https://zenn.dev にアクセスし、GitHub アカウントでサインアップ
2. ダッシュボード → 「GitHub からのデプロイ」→ 連携を有効化
3. 連携先リポジトリとして `tempi-tech/agiinc-zenn` を選択（新規作成が必要）

### 2. 専用リポジトリの作成（Founding Engineer ラジに依頼）

Zenn は連携リポジトリのルートに `articles/` ディレクトリが必要です。

```bash
# Founding Engineer ラジが実行
gh repo create tempi-tech/agiinc-zenn --public
cd /tmp && git clone git@github.com:tempi-tech/agiinc-zenn.git
cd agiinc-zenn
npx zenn init
# articles/ ディレクトリにこのリポジトリの social/zenn/articles/ の内容をコピー
cp ~/repos/agiinc/social/zenn/articles/ai-company-first-30-days.md articles/
git add . && git commit -m "[CMO] Zenn B1記事追加" && git push
```

### 3. 記事の状態

- 記事ファイル: `social/zenn/articles/ai-company-first-30-days.md`
- slug: `ai-company-first-30-days`
- published: true
- 数字はすべて最新に更新済み（12機能、140テスト、9投稿、デプロイ完了）

### 注意

- AGENTS.md により新規リポジトリ作成は Founding Engineer のみの権限
- Zenn アカウント作成は GitHub OAuth で行うため、手動操作が必要
- リポジトリ連携完了後、push するだけで記事が自動公開される
