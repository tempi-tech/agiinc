# Hima（ヒマ）— 技術方針書

> CTO アレクセイ・ヴォルコフ | 2026-02-13 | ステータス: 承認済み（CEO カイ 2026-02-13）

## 設計原則

- **1人が6週間で出荷できること**。これが最優先の制約だ
- 過剰な抽象化は一切しない。必要になるまで作らない
- 依存ライブラリは最小限。各レイヤーで1つだけ選び、それを使い倒す
- 完全クライアントサイド。ユーザーのデータはブラウザの外に出さない

---

## 1. 技術スタック

| レイヤー | 選定 | バージョン |
|---|---|---|
| 言語 | TypeScript | 5.x |
| フレームワーク | React | 19.x |
| ビルドツール | Vite | 6.x |
| スタイリング | Tailwind CSS | 4.x |
| 状態管理 | Zustand | 5.x |
| テスト | Vitest + Testing Library | — |
| リンター | ESLint + Prettier | — |
| パッケージマネージャ | pnpm | 9.x |

### 選定理由

**React 19 + TypeScript**

採用理由は3つだ:

1. エコシステムが最大。問題にぶつかったとき、解決策が見つかる確率が最も高い
2. 型安全。API レスポンスの型定義、レシピの変数解析、バッチ処理のステート管理——型がないとバグる箇所が多い
3. ラジが最速で動ける。新しいフレームワークの学習コストは6週間の制約下では許容できない

Svelte や Vue は良いフレームワークだが、チームの実行速度を最大化するために React を選ぶ。

**Vite**

Create React App は死んだ。Vite 一択だ。HMR が速い。ビルドが速い。設定がシンプル。

**Tailwind CSS**

CSS 設計に時間を使う余裕はない。Tailwind ならクラス名を書くだけでスタイリングが完結する。デザインシステムの一貫性も utility class が担保する。CSS ファイルの管理は不要になる。

**Zustand**

Redux は過剰。Context API はパフォーマンスが悪い。Zustand は API が最小限で、ボイラープレートがほぼゼロ。ストア定義は関数1つだ。Hima の状態管理（APIキー、レシピ、バッチ状態）に必要十分。

**Vitest + Testing Library**

Vite ネイティブで設定ゼロ。Jest と API 互換。Testing Library でユーザー視点のテストを書く。

---

## 2. CORS プロキシ方針

### 決定: 案A — Cloudflare Worker を採用する

OpenAI・Anthropic・Google AI いずれも、ブラウザからの直接リクエストを CORS で拒否する。プロキシは必須だ。

**Cloudflare Worker を選ぶ理由:**

1. **Cloudflare Pages と同一基盤**。デプロイ・管理が一元化される
2. **無料枠で十分**。1日10万リクエスト。MVP のトラフィックなら余裕がある
3. **エッジで動く**。ユーザーに最も近いノードで処理するため、レイテンシが最小
4. **実装が極めてシンプル**。20行程度のコードで済む

案B（プロバイダ別の直接接続調査）は不採用。2026年2月時点で3プロバイダとも CORS を許可していない。プロバイダの対応待ちに賭けるのはリスクだ。

### Worker の設計

```
ブラウザ → Cloudflare Worker (api-hima.agiinc.io) → AI プロバイダ API
```

Worker の責務:

- リクエストをそのまま転送する（ヘッダー・ボディをパススルー）
- レスポンスに CORS ヘッダー (`Access-Control-Allow-Origin: https://hima.agiinc.io`) を付与する
- データの保存・ログ記録は一切しない

### セキュリティ

| リスク | 対策 |
|---|---|
| Worker の悪用（第三者が API プロキシとして使う） | `Origin` ヘッダーを検証。`https://hima.agiinc.io` 以外からのリクエストを拒否 |
| API キーの漏洩 | Worker はキーを保存しない。リクエストごとにブラウザから送信し、転送後に破棄 |
| リクエスト改ざん | Worker は中身を一切変更しない。パススルーのみ |
| レートリミット回避 | Worker 側で IP ベースのレートリミットを設定（100 req/min/IP） |
| 許可 API の制限 | 転送先ホストをホワイトリスト化: `api.openai.com`, `api.anthropic.com`, `generativelanguage.googleapis.com` のみ |

### Worker ドメイン

`api-hima.agiinc.io` — Cloudflare DNS で Worker にルーティングする。

---

## 3. プロジェクト構造

```
agiinc-hima/
├── src/
│   ├── main.tsx                  # エントリポイント
│   ├── App.tsx                   # ルートコンポーネント
│   ├── components/               # UI コンポーネント
│   │   ├── workspace/            # ワークスペース画面
│   │   │   ├── RecipeEditor.tsx  # レシピエディタ
│   │   │   ├── InputPanel.tsx    # 入力 & 実行パネル
│   │   │   └── ResultTable.tsx   # 結果テーブル
│   │   ├── settings/             # 設定モーダル
│   │   │   └── ApiKeyManager.tsx
│   │   ├── library/              # レシピライブラリモーダル
│   │   │   └── RecipeLibrary.tsx
│   │   └── ui/                   # 汎用 UI パーツ（Button, Modal, etc.）
│   ├── stores/                   # Zustand ストア
│   │   ├── apiKeyStore.ts        # API キー管理
│   │   ├── recipeStore.ts        # レシピ管理
│   │   └── batchStore.ts         # バッチ実行状態
│   ├── services/                 # 外部 API 連携
│   │   ├── providers/            # AI プロバイダ別の API クライアント
│   │   │   ├── openai.ts
│   │   │   ├── anthropic.ts
│   │   │   └── google.ts
│   │   └── batchEngine.ts        # バッチ処理エンジン
│   ├── lib/                      # ユーティリティ
│   │   ├── templateParser.ts     # {{変数}} の解析
│   │   ├── csvParser.ts          # CSV パース・エクスポート
│   │   └── storage.ts            # localStorage ラッパー
│   └── types/                    # 型定義
│       └── index.ts
├── worker/                       # Cloudflare Worker（CORS プロキシ）
│   ├── src/
│   │   └── index.ts
│   └── wrangler.toml
├── public/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── eslint.config.js
├── .prettierrc
├── .env.example                  # 環境変数テンプレート
└── package.json
```

### モジュール分割方針

- **components/**: 画面単位でディレクトリを切る。画面が3つ（ワークスペース、設定、ライブラリ）なので3ディレクトリ + 共通 UI
- **stores/**: 機能ドメイン単位で1ファイル1ストア。ストア間の依存は最小限にする
- **services/**: AI API との通信ロジック。プロバイダごとに統一インターフェースを実装する
- **lib/**: ステートレスなユーティリティ関数。テストしやすくするため副作用を持たせない
- **worker/**: CORS プロキシは独立してデプロイする。メインアプリとは別の wrangler.toml で管理

ルーティングライブラリは不要。SPA だが画面遷移はモーダルの開閉だけだ。React Router は入れない。

---

## 4. CI/CD パイプライン

### ワークフロー設計

```
[push to main] → Lint → Type Check → Test → Build → Deploy to Production
[push to feature/*] → Lint → Type Check → Test → Build (検証のみ、デプロイなし)
[pull request] → Lint → Type Check → Test → Build → Deploy to Preview
```

### GitHub Actions

**メインワークフロー: `.github/workflows/ci.yml`**

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test -- --run
      - run: pnpm build
```

**Cloudflare Pages へのデプロイ:**

Cloudflare Pages の GitHub 連携を使う。GitHub Actions 側でデプロイコマンドを叩く方式は取らない。理由:

1. Cloudflare Pages が `main` ブランチへの push を自動検知してデプロイする
2. PR ごとにプレビュー URL が自動生成される
3. 設定・管理が最小限で済む

Cloudflare Pages の設定:

| 項目 | 値 |
|---|---|
| ビルドコマンド | `pnpm build` |
| 出力ディレクトリ | `dist` |
| Node.js バージョン | 22 |
| ルートディレクトリ | `/` |

**Worker のデプロイ: `.github/workflows/deploy-worker.yml`**

```yaml
name: Deploy Worker
on:
  push:
    branches: [main]
    paths: [worker/**]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: npx wrangler deploy
        working-directory: worker
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

### package.json のスクリプト

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:run": "vitest --run"
  }
}
```

---

## 5. 開発環境セットアップ

### 必要なツール

| ツール | バージョン | 用途 |
|---|---|---|
| Node.js | 22.x LTS | ランタイム |
| pnpm | 9.x | パッケージ管理 |
| Wrangler | 最新 | Cloudflare Worker ローカル開発 |
| Git | 最新 | バージョン管理 |

### セットアップ手順

```bash
# 1. リポジトリを clone
git clone git@github.com:tempi-tech/agiinc-hima.git
cd agiinc-hima

# 2. 依存インストール
pnpm install

# 3. 環境変数を設定
cp .env.example .env

# 4. 開発サーバー起動
pnpm dev
# → http://localhost:5173

# 5. Worker のローカル開発（別ターミナル）
cd worker
npx wrangler dev
# → http://localhost:8787
```

### 環境変数

`.env.example`:

```
# CORS プロキシの URL
VITE_PROXY_URL=http://localhost:8787
```

本番環境では `VITE_PROXY_URL=https://api-hima.agiinc.io` をビルド時に注入する。

管理方針:

- API キーはユーザーがブラウザで入力する。`.env` に AI API キーは置かない
- `VITE_` プレフィックスのみクライアントに露出する（Vite の仕様）
- `.env` は `.gitignore` 対象。`.env.example` のみリポジトリに含める
- Cloudflare Worker のシークレットは `wrangler secret put` で管理する

---

## 6. 実装上の技術指針

### AI プロバイダの統一インターフェース

```typescript
interface AIProvider {
  id: string;
  name: string;
  models: Model[];
  complete(params: CompletionParams): Promise<CompletionResult>;
  validateKey(key: string): Promise<boolean>;
}
```

各プロバイダ（OpenAI, Anthropic, Google）がこのインターフェースを実装する。バッチエンジンはプロバイダの違いを意識しない。

### バッチ処理エンジン

- `Promise.allSettled` + セマフォで同時実行数を制御（最大5並列）
- `AbortController` でキャンセルを実装
- 各行の処理結果は即座にストアに反映し、UI をリアルタイム更新
- 429/5xx エラー時は指数バックオフ（1s → 2s → 4s、最大3回）

### テンプレートエンジン

- 正規表現 `/\{\{(\w+)\}\}/g` で変数を抽出
- 変数名の重複は自動排除
- CSV カラムとのマッピングは UI で手動選択

### データ永続化

- `localStorage` をラップした薄いモジュール（`lib/storage.ts`）を通してアクセス
- JSON シリアライズのみ。スキーマバージョンを `_version` キーで管理し、将来の移行に備える
- バッチ結果はメモリのみ。永続化しない

---

## 7. 制約・留意事項

- **モバイル対応は MVP スコープ外**。デスクトップ幅（1024px 以上）を前提とする
- **i18n は不要**。日本語 UI のみ
- **SEO は不要**。SPA で問題ない。ランディングページは別途作成する
- **アクセシビリティ**: 最低限のセマンティック HTML と ARIA ラベルは付ける。スクリーンリーダー完全対応は MVP 後
- **localStorage の容量制限**: 5-10MB。レシピ数百件程度なら問題ない。上限に達した場合のエラーハンドリングは入れる
