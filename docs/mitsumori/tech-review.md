---
type: tech-review
reviewer: cto
date: 2026-03-16
target: docs/mitsumori/spec.md
verdict: approve-with-comments
---

# ミツモリAI MVP 仕様書 — CTO 技術レビュー

## 総評

設計はシンプルで良い。Cloudflare エコシステムに統一されており、運用負荷が低い。
以下の指摘を対応すれば実装に入れる。**ブロッカーは1件のみ（PDF 生成）。残りは実装時に対応で可。**

---

## 1. 技術スタック

**判定: 概ね問題なし。1件ブロッカーあり。**

### [BLOCKER] @react-pdf/renderer は Workers 環境で動かない

`@react-pdf/renderer` は Node.js の Stream API、Buffer、canvas 等に依存する。Cloudflare Workers のランタイムではこれらが使えない。

**対応案:**
- **推奨**: クライアントサイドで PDF 生成する。`@react-pdf/renderer` をブラウザ側で実行し、生成した PDF を R2 にアップロードする
- **代替**: jspdf + jspdf-autotable をクライアントサイドで使う。見積テーブルの描画に向いている

### その他

- React + Hono SSR on Cloudflare Pages: 問題なし。実績あるパターン
- Drizzle + D1: 問題なし。D1 のマイグレーション戦略（`wrangler d1 migrations`）をセットアップ時に忘れずに
- R2: CSV 保存と PDF 一時保存に適切

---

## 2. データモデル

**判定: 良い設計。軽微な改善点あり。**

### organizations_members に user_id 単体のインデックスを追加

ログイン後「このユーザーが所属する organization を取得」するクエリが頻出する。複合 PK だけだと user_id 単体での検索が遅い。

```sql
CREATE INDEX idx_org_members_user ON organizations_members(user_id);
```

### subscriptions.stripe_subscription_id に UNIQUE 制約を追加

Stripe Subscription ID は一意であるべき。Webhook の冪等性チェックにも使える。

```sql
stripe_subscription_id TEXT UNIQUE
```

### estimates に created_at DESC のインデックス

ダッシュボードの見積一覧は organization_id + created_at DESC でソートする。複合インデックスにしておく。

```sql
CREATE INDEX idx_estimates_org_created ON estimates(organization_id, created_at DESC);
```

既存の `idx_estimates_org` は上記で代替できるため不要。

---

## 3. AI 戦略

**判定: MVP として妥当。2点注意。**

### Claude API の Structured Output（tool_use）を使うべき

プロンプトで JSON フォーマットを指示するだけだと、不正な JSON が返るリスクがある。Claude API の tool_use 機能を使えば、スキーマに沿った JSON レスポンスが保証される。

```typescript
// tool_use で見積明細のスキーマを定義し、強制的に呼ばせる
tools: [{
  name: "generate_estimate",
  description: "見積明細を生成する",
  input_schema: {
    type: "object",
    properties: {
      items: { type: "array", items: { ... } },
      ai_note: { type: "string" }
    },
    required: ["items", "ai_note"]
  }
}],
tool_choice: { type: "tool", name: "generate_estimate" }
```

### 類似見積検索がカテゴリ完全一致のみ

データが少ない初期段階で、同一カテゴリの過去見積が0件の場合がある。フォールバックとして「カテゴリなしで直近N件」も取得するロジックを入れるべき。仕様書に「デフォルトテンプレートをフォールバック」とあるが、ユーザー自身のデータ（別カテゴリ）の方が単価の参考になる。

```
1. 同カテゴリで検索 → ヒットすればそれを使う
2. 0件なら全カテゴリから直近10件を取得
3. それも0件ならデフォルトテンプレート
```

---

## 4. セキュリティ

**判定: 要補強。実装時に必ず対応すること。**

### Stripe Webhook の署名検証

仕様書に明記されていない。`stripe.webhooks.constructEvent()` で署名検証を必ず行うこと。署名検証なしだと偽の Webhook で課金ステータスを改ざんされる。

### マルチテナントのデータスコープ

全ての API エンドポイントで `organization_id` によるスコープを徹底すること。ミドルウェアで現在のユーザーの organization_id をセッションから取得し、クエリに必ず含める。estimate_id や historical_estimate_id だけで直接アクセスさせない。

```typescript
// NG: estimate_id だけで取得
const estimate = await db.select().from(estimates).where(eq(estimates.id, id));

// OK: organization_id でスコープ
const estimate = await db.select().from(estimates)
  .where(and(eq(estimates.id, id), eq(estimates.organizationId, orgId)));
```

### CSV アップロードのバリデーション

- ファイルサイズ上限を設ける（例: 5MB）
- 行数上限を設ける（例: 10,000行）
- 品目名・仕様等の文字列はサニタイズする（PDF 出力時の XSS 防止）

### AI 生成エンドポイントの Rate Limiting

Claude API 呼び出しはコストが発生する。1ユーザーあたりの生成回数を制限すること（例: 1時間に10回）。

---

## 5. デプロイ・CI/CD

**判定: 問題なし。以下を追加で考慮。**

### D1 マイグレーション

`drizzle-kit generate` → `wrangler d1 migrations apply` のフローを CI に組み込むこと。本番 D1 への直接 SQL 実行は禁止。

### 環境変数の管理

以下のシークレットを `wrangler secret put` で設定する（.env にリスト化しておくこと）:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `ANTHROPIC_API_KEY`
- `BETTER_AUTH_SECRET`

### Preview デプロイ

Cloudflare Pages の Preview 環境では D1/R2 のバインディングが本番と分離されることを確認すること。Preview 用の D1 データベースを別途作成する。

---

## まとめ

| 観点 | 判定 | ブロッカー |
|---|---|---|
| 技術スタック | OK（1件修正） | PDF 生成をクライアントサイドに変更 |
| データモデル | OK（軽微修正） | - |
| AI 戦略 | OK（2件改善） | - |
| セキュリティ | 要補強（4件） | - |
| デプロイ・CI/CD | OK（補足のみ） | - |

**verdict: approve-with-comments** — ブロッカー1件（PDF 生成）を解消し、セキュリティ4件を実装時に対応すれば問題ない。
