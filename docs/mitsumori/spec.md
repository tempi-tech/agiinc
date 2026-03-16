---
type: spec
author: pdm
date: 2026-03-16
status: approved
---

# ミツモリAI — MVP 仕様書

> 小規模工務店の社長が、過去の見積データを学習した AI で、新規案件の見積書を30分で作れるようにする。

## 概要

| 項目 | 内容 |
|---|---|
| サービス名 | ミツモリAI |
| ドメイン | mitsumori.agiinc.io |
| ターゲット | 従業員1〜10名の小規模工務店・リフォーム会社 |
| 課題 | 見積作成に半日〜1日かかる。積算担当者不在。残業規制で時間がない |
| 月額 | ¥9,800（税別） |
| トライアル | カード登録で7日間無料 |

---

## 1. 画面設計

### 1.1 画面一覧

| # | 画面 | パス | 説明 |
|---|---|---|---|
| 1 | LP（ランディングページ） | `/` | サービス紹介。CTA は「無料で試す」 |
| 2 | サインアップ | `/signup` | メール + パスワード。会社名・担当者名を入力 |
| 3 | ログイン | `/login` | メール + パスワード |
| 4 | ダッシュボード | `/dashboard` | 見積一覧 + 新規作成ボタン |
| 5 | 見積データ管理 | `/data` | 過去見積の CSV アップロード・一覧・削除 |
| 6 | 見積作成（AI生成） | `/estimates/new` | 工事条件入力 → AI 見積ドラフト生成 |
| 7 | 見積編集 | `/estimates/:id` | AI 生成結果の確認・編集・PDF出力 |
| 8 | 設定 | `/settings` | 会社情報・支払い情報・プラン管理 |

### 1.2 画面フロー

```
LP → サインアップ → Stripe カード登録 → ダッシュボード
                                            │
                         ┌──────────────────┼──────────────────┐
                         ▼                  ▼                  ▼
                    見積データ管理      見積作成（AI生成）      設定
                    CSV アップロード    工事条件入力            会社情報
                    過去見積一覧        ↓                      Stripe 管理
                                    AI ドラフト生成
                                        ↓
                                    見積編集
                                    PDF 出力
```

### 1.3 各画面のワイヤーフレーム

#### LP（`/`）

```
┌──────────────────────────────────────────────────┐
│ [ロゴ] ミツモリAI          [ログイン] [無料で試す] │
├──────────────────────────────────────────────────┤
│                                                  │
│   見積作成、AIにおまかせ。                          │
│   過去の見積データを学習して、                       │
│   新規案件の見積書を30分で作成。                     │
│                                                  │
│            [ 7日間無料で試す → ]                    │
│                                                  │
├──────────────────────────────────────────────────┤
│ ① 過去見積を        ② 工事条件を      ③ 見積書を    │
│    アップロード        入力              AI が生成    │
│    [CSV取込]          [フォーム]         [PDF出力]   │
├──────────────────────────────────────────────────┤
│ 料金: ¥9,800/月（税別）7日間無料トライアル          │
│             [ 無料で試す → ]                        │
├──────────────────────────────────────────────────┤
│ © AGI Inc.                                        │
└──────────────────────────────────────────────────┘
```

#### ダッシュボード（`/dashboard`）

```
┌──────────────────────────────────────────────────┐
│ [ロゴ]  ダッシュボード | データ管理 | 設定  [logout] │
├──────────────────────────────────────────────────┤
│                                                  │
│  [ + 新しい見積を作成 ]                            │
│                                                  │
│  ┌─────────────────────────────────────────────┐ │
│  │ 見積一覧                                     │ │
│  ├──────┬──────────┬────────┬────────┬────────┤ │
│  │ 日付  │ 案件名    │ 顧客名  │ 合計金額 │ 操作  │ │
│  ├──────┼──────────┼────────┼────────┼────────┤ │
│  │ 3/15 │ A邸浴室   │ 田中様  │ ¥850,000│ 編集 📄│ │
│  │ 3/12 │ B邸外壁   │ 鈴木様  │ ¥1.2M  │ 編集 📄│ │
│  │ 3/10 │ C社内装   │ 山田様  │ ¥2.5M  │ 編集 📄│ │
│  └──────┴──────────┴────────┴────────┴────────┘ │
│                                                  │
│  トライアル残り: 5日                               │
└──────────────────────────────────────────────────┘
```

#### 見積データ管理（`/data`）

```
┌──────────────────────────────────────────────────┐
│ [ロゴ]  ダッシュボード | データ管理 | 設定  [logout] │
├──────────────────────────────────────────────────┤
│                                                  │
│  過去の見積データ                                   │
│                                                  │
│  [ テンプレート CSV をダウンロード ]                 │
│  [ CSV ファイルをアップロード ]                      │
│                                                  │
│  アップロード済みデータ: 45件                       │
│  ┌─────────────────────────────────────────────┐ │
│  │ ファイル名          │ 件数 │ 日付  │ 操作   │ │
│  ├────────────────────┼─────┼──────┼────────┤ │
│  │ 2025年見積.csv      │ 30件 │ 3/15 │ 削除   │ │
│  │ 2024年見積.csv      │ 15件 │ 3/15 │ 削除   │ │
│  └────────────────────┴─────┴──────┴────────┘ │
│                                                  │
│  ※ データが多いほど AI の精度が上がります           │
└──────────────────────────────────────────────────┘
```

#### 見積作成 — AI 生成（`/estimates/new`）

```
┌──────────────────────────────────────────────────┐
│ [ロゴ]  ダッシュボード | データ管理 | 設定  [logout] │
├──────────────────────────────────────────────────┤
│                                                  │
│  新しい見積を作成                                   │
│                                                  │
│  工事種別:  [ 内装リフォーム ▼ ]                    │
│            （内装/外装/水回り/新築/その他）          │
│                                                  │
│  案件名:    [ A邸 浴室リフォーム          ]         │
│  顧客名:    [ 田中太郎                    ]         │
│                                                  │
│  工事概要（自由記述）:                              │
│  ┌─────────────────────────────────────────────┐ │
│  │ 浴室のユニットバス交換。TOTO サザナ 1616。   │ │
│  │ 既存タイル風呂からの入替。給排水配管も更新。  │ │
│  │ 洗面所の壁紙張替えも含む。                   │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  延床面積:   [ 5 ] ㎡（任意）                      │
│  予算目安:   [ 80 ] 万円（任意）                    │
│                                                  │
│  [ AI で見積を生成する → ]                          │
│                                                  │
│  ⏳ 生成中... （10〜30秒）                          │
└──────────────────────────────────────────────────┘
```

#### 見積編集（`/estimates/:id`）

```
┌──────────────────────────────────────────────────┐
│ [ロゴ]  ダッシュボード | データ管理 | 設定  [logout] │
├──────────────────────────────────────────────────┤
│                                                  │
│  A邸 浴室リフォーム          [ PDF出力 ] [ 保存 ]  │
│  顧客: 田中太郎                                    │
│                                                  │
│  ┌─────────────────────────────────────────────┐ │
│  │ # │ 品目           │ 数量│ 単位│ 単価   │ 金額  │
│  ├───┼───────────────┼────┼────┼───────┼──────│
│  │ 1 │ ユニットバス    │  1 │ 式 │ 350,000│350,000│
│  │   │ TOTO サザナ1616│    │    │       │      │
│  │ 2 │ 既存浴室解体   │  1 │ 式 │  80,000│ 80,000│
│  │ 3 │ 給排水配管工事 │  1 │ 式 │ 120,000│120,000│
│  │ 4 │ 電気工事       │  1 │ 式 │  45,000│ 45,000│
│  │ 5 │ 壁紙張替      │  12│ ㎡ │   2,500│ 30,000│
│  │ 6 │ 諸経費        │  1 │ 式 │  50,000│ 50,000│
│  ├───┴───────────────┴────┴────┴───────┼──────│
│  │                           小計      │675,000│
│  │                           消費税    │ 67,500│
│  │                           合計      │742,500│
│  └─────────────────────────────────────┴──────┘ │
│                                                  │
│  [ + 行を追加 ]  [ AI に再生成させる ]              │
│                                                  │
│  AI メモ: 過去の類似案件（B邸浴室 2024/11）を参考に │
│  生成しました。単価は直近の実績に基づいています。    │
└──────────────────────────────────────────────────┘
```

---

## 2. データモデル（Cloudflare D1）

### 2.1 ER図

```
users ──< organizations_members >── organizations
                                        │
                                        ├──< estimates ──< estimate_items
                                        │
                                        ├──< historical_estimates ──< historical_items
                                        │
                                        └──< subscriptions
```

### 2.2 テーブル定義

#### users

| カラム | 型 | 説明 |
|---|---|---|
| id | TEXT PK | UUID |
| email | TEXT UNIQUE | メールアドレス |
| name | TEXT | 氏名 |
| created_at | TEXT | ISO 8601 |
| updated_at | TEXT | ISO 8601 |

※ パスワードハッシュ等は better-auth が管理する（sessions, accounts テーブルは better-auth が自動生成）

#### organizations

| カラム | 型 | 説明 |
|---|---|---|
| id | TEXT PK | UUID |
| name | TEXT | 会社名 |
| postal_code | TEXT | 郵便番号 |
| address | TEXT | 住所 |
| phone | TEXT | 電話番号 |
| registration_number | TEXT | 適格請求書発行事業者番号（任意） |
| created_at | TEXT | ISO 8601 |
| updated_at | TEXT | ISO 8601 |

#### organizations_members

| カラム | 型 | 説明 |
|---|---|---|
| organization_id | TEXT FK | organizations.id |
| user_id | TEXT FK | users.id |
| role | TEXT | 'owner' \| 'member' |
| PK | (organization_id, user_id) | |

#### subscriptions

| カラム | 型 | 説明 |
|---|---|---|
| id | TEXT PK | UUID |
| organization_id | TEXT FK UNIQUE | organizations.id |
| stripe_customer_id | TEXT | Stripe Customer ID |
| stripe_subscription_id | TEXT | Stripe Subscription ID |
| status | TEXT | 'trialing' \| 'active' \| 'canceled' \| 'past_due' |
| trial_ends_at | TEXT | トライアル終了日（ISO 8601） |
| current_period_end | TEXT | 現在の課金期間終了日 |
| created_at | TEXT | ISO 8601 |
| updated_at | TEXT | ISO 8601 |

#### historical_estimates（過去見積データ）

| カラム | 型 | 説明 |
|---|---|---|
| id | TEXT PK | UUID |
| organization_id | TEXT FK | organizations.id |
| source_file | TEXT | アップロード元ファイル名 |
| project_name | TEXT | 案件名 |
| category | TEXT | 工事種別（interior/exterior/plumbing/new_build/other） |
| total_amount | INTEGER | 合計金額（税抜・円） |
| description | TEXT | 工事概要 |
| created_at | TEXT | ISO 8601 |

#### historical_items（過去見積の明細）

| カラム | 型 | 説明 |
|---|---|---|
| id | TEXT PK | UUID |
| historical_estimate_id | TEXT FK | historical_estimates.id |
| item_order | INTEGER | 表示順 |
| name | TEXT | 品目名 |
| specification | TEXT | 仕様・メーカー等 |
| quantity | REAL | 数量 |
| unit | TEXT | 単位（式/㎡/m/個/etc） |
| unit_price | INTEGER | 単価（円） |
| amount | INTEGER | 金額（円） |

#### estimates（AI 生成見積）

| カラム | 型 | 説明 |
|---|---|---|
| id | TEXT PK | UUID |
| organization_id | TEXT FK | organizations.id |
| created_by | TEXT FK | users.id |
| project_name | TEXT | 案件名 |
| customer_name | TEXT | 顧客名 |
| category | TEXT | 工事種別 |
| description | TEXT | 工事概要（ユーザー入力） |
| area_sqm | REAL | 延床面積（任意） |
| budget_hint | INTEGER | 予算目安（任意・円） |
| subtotal | INTEGER | 小計（税抜・円） |
| tax_amount | INTEGER | 消費税額 |
| total_amount | INTEGER | 合計金額（税込・円） |
| ai_note | TEXT | AI が生成時に参考にした情報のメモ |
| status | TEXT | 'draft' \| 'sent' |
| created_at | TEXT | ISO 8601 |
| updated_at | TEXT | ISO 8601 |

#### estimate_items（AI 生成見積の明細）

| カラム | 型 | 説明 |
|---|---|---|
| id | TEXT PK | UUID |
| estimate_id | TEXT FK | estimates.id |
| item_order | INTEGER | 表示順 |
| name | TEXT | 品目名 |
| specification | TEXT | 仕様・メーカー等 |
| quantity | REAL | 数量 |
| unit | TEXT | 単位 |
| unit_price | INTEGER | 単価（円） |
| amount | INTEGER | 金額（円） |

### 2.3 インデックス

```sql
CREATE INDEX idx_historical_estimates_org ON historical_estimates(organization_id);
CREATE INDEX idx_historical_estimates_category ON historical_estimates(organization_id, category);
CREATE INDEX idx_historical_items_estimate ON historical_items(historical_estimate_id);
CREATE INDEX idx_estimates_org ON estimates(organization_id);
CREATE INDEX idx_estimate_items_estimate ON estimate_items(estimate_id);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_customer_id);
```

---

## 3. AI プロンプト戦略

### 3.1 概要

AI 見積生成は「過去見積データからのパターンマッチ + LLM による構成提案」の2段構成。

```
ユーザー入力（工事条件）
        ↓
  [Step 1] 類似見積検索
  D1 から同カテゴリの過去見積を取得（最大10件）
        ↓
  [Step 2] LLM に見積ドラフト生成を依頼
  過去見積パターン + 工事条件 → 明細リスト生成
        ↓
  JSON レスポンス → DB 保存 → 画面表示
```

### 3.2 類似見積検索（Step 1）

```sql
SELECT he.*, GROUP_CONCAT(hi.name || ':' || hi.unit_price || ':' || hi.unit, '|') as items
FROM historical_estimates he
JOIN historical_items hi ON he.id = hi.historical_estimate_id
WHERE he.organization_id = ?
  AND he.category = ?
GROUP BY he.id
ORDER BY he.created_at DESC
LIMIT 10;
```

過去データがない場合: カテゴリに応じたデフォルトテンプレート（システム側で用意）をフォールバックとして使用する。

### 3.3 LLM プロンプト（Step 2）

使用モデル: Claude API（claude-sonnet-4-6 — コスト・速度のバランス）

```
あなたは日本の小規模工務店の積算担当者です。
以下の工事条件と過去の見積実績に基づいて、見積書の明細を作成してください。

## 工事条件
- 工事種別: {category}
- 案件名: {project_name}
- 工事概要: {description}
- 延床面積: {area_sqm}㎡
- 予算目安: {budget_hint}万円

## 過去の類似見積（この会社の実績）
{historical_estimates_json}

## ルール
1. 過去の実績の単価を参考にすること。実績がある品目は、その単価に近い値を使う
2. 過去にない品目は、一般的な市場単価を使う
3. 品目名・仕様は具体的に書く（メーカー名・型番がわかる場合は記載）
4. 諸経費は小計の5〜10%を目安に含める
5. 明細は多すぎず少なすぎず、5〜15行を目安にする

## 出力形式（JSON）
{
  "items": [
    {
      "name": "品目名",
      "specification": "仕様・メーカー等",
      "quantity": 1,
      "unit": "式",
      "unit_price": 100000,
      "amount": 100000
    }
  ],
  "ai_note": "生成時に参考にした過去見積の案件名や判断理由を簡潔に"
}
```

### 3.4 精度向上戦略（MVP 以降）

- **フィードバックループ**: ユーザーが編集した結果を学習データとして蓄積。AI が出した見積 vs 最終見積の差分を追跡し、プロンプトに「よくある修正パターン」として反映
- **単価マスター**: 業界標準の材料単価データベースを構築し、過去データが少ないユーザーにも精度の高い見積を提供
- **カテゴリ細分化**: 「水回り → 浴室/キッチン/トイレ/洗面」のようにカテゴリを細分化し、検索精度を向上

---

## 4. 認証・課金フロー

### 4.1 技術構成

| 機能 | ライブラリ/サービス |
|---|---|
| 認証 | better-auth（Email/Password） |
| 課金 | Stripe Checkout + Customer Portal |
| Webhook | Stripe Webhook → Cloudflare Workers |

### 4.2 サインアップ〜トライアル開始フロー

```
1. ユーザーがサインアップフォームに入力
   - メール、パスワード、氏名、会社名
   ↓
2. better-auth でユーザー作成
   ↓
3. organizations + organizations_members レコード作成
   ↓
4. Stripe Checkout Session 作成
   - mode: 'subscription'
   - subscription_data.trial_period_days: 7
   - payment_method_collection: 'always'（カード登録必須）
   ↓
5. Stripe Checkout ページにリダイレクト
   - ユーザーがカード情報を入力
   ↓
6. Stripe Webhook: checkout.session.completed
   - subscriptions テーブルにレコード作成
   - status: 'trialing'
   - trial_ends_at: 7日後
   ↓
7. ダッシュボードにリダイレクト → サービス利用開始
```

### 4.3 トライアル → 有料移行

```
トライアル期間中:
  - 全機能利用可能（制限なし）
  - ダッシュボードにトライアル残日数を表示

トライアル終了時:
  Stripe が自動で課金を開始
  Webhook: customer.subscription.updated
  → status を 'active' に更新

キャンセルの場合:
  ユーザーが Stripe Customer Portal でキャンセル
  Webhook: customer.subscription.updated
  → status を 'canceled' に更新
  → current_period_end まではサービス利用可能
```

### 4.4 Stripe 設定

| 項目 | 値 |
|---|---|
| Product | ミツモリAI スタンダードプラン |
| Price | ¥9,800/月（税別）→ ¥10,780（税込） |
| Trial | 7日間 |
| Webhook Events | checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, invoice.payment_failed |

### 4.5 アクセス制御ミドルウェア

```
リクエスト
  ↓
[1] better-auth セッション検証 → 未ログイン → /login にリダイレクト
  ↓
[2] subscriptions テーブル参照
  ↓
  status = 'trialing' かつ trial_ends_at > now() → OK
  status = 'active' → OK
  status = 'past_due' → 支払い更新を促す画面を表示
  それ以外 → /settings にリダイレクト（再契約を促す）
```

---

## 5. 技術スタック

### 5.1 全体構成

```
┌─────────────┐     ┌──────────────────────┐     ┌─────────────┐
│  ブラウザ     │────▶│ Cloudflare Pages     │────▶│ Claude API  │
│  (React)     │◀────│ + Workers (API)      │◀────│ (sonnet)    │
└─────────────┘     │                      │     └─────────────┘
                    │  ┌─────┐  ┌─────┐    │     ┌─────────────┐
                    │  │ D1  │  │ R2  │    │────▶│ Stripe      │
                    │  └─────┘  └─────┘    │◀────│             │
                    └──────────────────────┘     └─────────────┘
```

### 5.2 スタック詳細

| レイヤー | 技術 | 理由 |
|---|---|---|
| フロントエンド | React + Hono（SSR on Cloudflare Pages） | Workers ネイティブ。軽量 |
| スタイリング | Tailwind CSS v4 | ユーティリティファースト。LP〜アプリまで一貫 |
| UI コンポーネント | shadcn/ui | カスタマイズ可能。見積テーブル等の複雑 UI に対応 |
| バックエンド | Hono（Cloudflare Workers） | Workers ネイティブ。型安全なルーティング |
| データベース | Cloudflare D1（SQLite） | サーバーレス。D1 は Workers と同一ロケーション |
| ORM | Drizzle ORM | D1 ネイティブ対応。型安全 |
| ファイルストレージ | Cloudflare R2 | CSV アップロードの保存。生成 PDF の一時保存 |
| 認証 | better-auth | Email/Password。D1 アダプタ対応 |
| 課金 | Stripe（Checkout + Customer Portal + Webhooks） | 日本円対応。サブスク管理 |
| AI | Claude API（claude-sonnet-4-6） | 高精度 × 低レイテンシのバランス |
| PDF 生成 | @react-pdf/renderer | React コンポーネントで見積書 PDF を生成 |
| デプロイ | Cloudflare Pages（Workers 統合） | `wrangler pages deploy` |
| モノレポ管理 | なし（単一パッケージ） | MVP はシンプルに |

### 5.3 ディレクトリ構成（予定）

```
agiinc-mitsumori/
├── src/
│   ├── app/                    # ページコンポーネント
│   │   ├── (marketing)/        # LP 等（認証不要）
│   │   │   └── page.tsx
│   │   ├── (auth)/             # ログイン・サインアップ
│   │   │   ├── login/
│   │   │   └── signup/
│   │   └── (dashboard)/        # アプリ本体（認証必須）
│   │       ├── dashboard/
│   │       ├── data/
│   │       ├── estimates/
│   │       └── settings/
│   ├── api/                    # API ルート（Hono）
│   │   ├── auth/               # better-auth ハンドラ
│   │   ├── estimates/          # 見積 CRUD + AI 生成
│   │   ├── data/               # CSV アップロード・パース
│   │   └── webhooks/           # Stripe Webhook
│   ├── lib/
│   │   ├── db/                 # Drizzle スキーマ・マイグレーション
│   │   ├── ai/                 # Claude API ラッパー・プロンプト
│   │   ├── pdf/                # PDF テンプレート
│   │   ├── csv/                # CSV パーサー
│   │   └── stripe/             # Stripe ヘルパー
│   └── components/             # 共通 UI コンポーネント
├── public/                     # 静的ファイル
├── wrangler.toml               # Cloudflare 設定
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

### 5.4 CSV テンプレート仕様

過去見積データの取り込みフォーマット。ユーザーが Excel から「名前を付けて保存 → CSV」で出力できるよう、シンプルに設計する。

```csv
案件名,工事種別,品目名,仕様,数量,単位,単価,金額
A邸浴室リフォーム,水回り,ユニットバス,TOTO サザナ 1616,1,式,350000,350000
A邸浴室リフォーム,水回り,既存浴室解体,,1,式,80000,80000
A邸浴室リフォーム,水回り,給排水配管工事,,1,式,120000,120000
B邸外壁塗装,外装,足場組立,,1,式,150000,150000
B邸外壁塗装,外装,高圧洗浄,,120,㎡,300,36000
```

| カラム | 必須 | 説明 |
|---|---|---|
| 案件名 | ○ | 同じ案件名の行は1つの見積としてグルーピング |
| 工事種別 | ○ | 内装/外装/水回り/新築/その他 |
| 品目名 | ○ | |
| 仕様 | - | メーカー・型番等 |
| 数量 | ○ | |
| 単位 | ○ | 式/㎡/m/個/枚/台/etc |
| 単価 | ○ | 円（税抜） |
| 金額 | ○ | 円（税抜）= 数量 × 単価 |

---

## 6. MVP スケジュール（2週間）

| 日 | フェーズ | 内容 |
|---|---|---|
| 1-2 | 環境構築 | リポジトリ作成、Cloudflare 設定、D1/R2 作成、better-auth + Stripe 接続 |
| 3-4 | 認証・課金 | サインアップ→Stripe Checkout→トライアル開始の一連フロー |
| 5-6 | データ管理 | CSV アップロード・パース → historical_estimates/items に保存 |
| 7-9 | AI 見積生成 | 工事条件入力 → Claude API → 見積ドラフト生成・保存 |
| 10-11 | 見積編集・PDF | 明細の編集 UI + PDF 出力 |
| 12-13 | LP・仕上げ | LP 作成、レスポンシブ対応、エラーハンドリング |
| 14 | デプロイ | 本番デプロイ、ドメイン設定、最終テスト |

---

## 7. 成功指標（リリース後3ヶ月）

| 指標 | 目標値 |
|---|---|
| トライアル開始数 | 50社/月 |
| トライアル → 有料転換率 | 30%以上 |
| MRR | ¥150,000（約15社） |
| 月間チャーンレート | 5%以下 |
| 見積生成数/アクティブユーザー | 4件/月以上 |

---

## Changelog

| 日付 | 変更内容 | 変更者 |
|---|---|---|
| 2026-03-16 | 初版作成 | pdm |
