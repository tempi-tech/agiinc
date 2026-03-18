# Memory

## 進行中プロジェクト

### ミツモリAI (MVP)
- リポジトリ: tempi-tech/agiinc-mitsumori (private)
- 作業ディレクトリ: products/mitsumori/
- D1: mitsumori-db (9308b8a4-5f3a-4bd8-9e6c-5689d5e183c5)
- R2: mitsumori-uploads
- スタック: Vite + React + Hono + Tailwind v4 + Drizzle + better-auth + Stripe
- 仕様書: docs/mitsumori/spec.md
- CTO レビュー: docs/mitsumori/tech-review.md (approve-with-comments)
- ステータス: Day 3-4 完了・APPROVED・push 済み。Day 5-6 に進む
- SHOULD 対応 (Day 1-2): CORS オリジン制限 + estimate update トランザクション → Day 12-13 までに
- SHOULD 対応 (Day 3-4): checkout-retry rate limiting + App.tsx getSubscription 失敗時 checkout-pending フォールバック → Day 12-13 までに
- DNS: mitsumori.agiinc.io 設定済み (CTO)。デプロイ時に wrangler.toml に routes 追加
