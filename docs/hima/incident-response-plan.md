# Hima ローンチ当日 インシデントレスポンス計画

> CTO アレクセイ・ヴォルコフ | 2026-02-14 | 対象: 2026-03-25 ローンチ日
>
> ローンチチェックリスト I-05 対応

---

## 1. 障害分類

| 重大度 | 定義 | 例 | 対応開始 | 目標復旧 |
|---|---|---|---|---|
| **P0 — 致命的** | サービス全体が利用不能。ユーザーがプロダクトにアクセスできない、またはコア機能が完全に停止 | hima.agiinc.io が 5xx / DNS 解決不能、Worker が全リクエストでエラー、ビルド破損でブランクページ | 即時 | 30 分以内 |
| **P1 — 重大** | コア機能の一部が動作しない。プロダクトにはアクセスできるが、主要ユースケースが遂行不能 | 特定プロバイダの API 転送が失敗、バッチ実行が途中停止、CSV エクスポートが壊れる | 15 分以内 | 2 時間以内 |
| **P2 — 軽微** | 周辺機能の不具合、または UI の表示崩れ。主要ユースケースには影響しない | レシピ保存が失敗、OGP 画像が表示されない、ブログのリンク切れ | 1 時間以内 | 当日中 |

---

## 2. 監視対象と確認方法

### 2-1. hima.agiinc.io（Cloudflare Pages — プロダクト本体）

| 項目 | 確認方法 |
|---|---|
| サイト表示 | ブラウザで `https://hima.agiinc.io` にアクセス。トップ画面が描画されることを確認 |
| HTTPS 証明書 | `curl -vI https://hima.agiinc.io` で証明書エラーがないことを確認 |
| デプロイ状態 | Cloudflare Dashboard → Pages → `agiinc-hima` → Deployments で最新デプロイのステータスを確認 |
| ビルドログ | デプロイが失敗した場合、Cloudflare Dashboard のビルドログでエラーを特定 |
| JS エラー | DevTools Console でランタイムエラーがないことを確認 |

### 2-2. api-hima.agiinc.io（Cloudflare Worker — CORS プロキシ）

| 項目 | 確認方法 |
|---|---|
| Worker 応答 | `curl -I https://api-hima.agiinc.io` でステータスコードを確認（Worker が応答するか） |
| CORS ヘッダー | `curl -H "Origin: https://hima.agiinc.io" -I https://api-hima.agiinc.io` で `Access-Control-Allow-Origin` が返ることを確認 |
| API 転送（OpenAI） | hima.agiinc.io から OpenAI モデルでテスト実行 1 件。成功を確認 |
| API 転送（Anthropic） | 同上。Anthropic モデルで実行 |
| API 転送（Google） | 同上。Google モデルで実行 |
| Worker ログ | Cloudflare Dashboard → Workers → `agiinc-hima-worker` → Logs でエラーログを確認 |
| Worker メトリクス | Dashboard → Workers → Analytics でリクエスト数・エラー率・レイテンシを監視 |

### 2-3. agiinc.io（会社サイト）

| 項目 | 確認方法 |
|---|---|
| サイト表示 | ブラウザで `https://agiinc.io` にアクセス |
| プロダクトへの導線 | サイト内の Hima へのリンクが `https://hima.agiinc.io` に正しく遷移することを確認 |
| デプロイ状態 | Cloudflare Dashboard で確認 |

### 2-4. blog.agiinc.io（ブログ）

| 項目 | 確認方法 |
|---|---|
| サイト表示 | ブラウザで `https://blog.agiinc.io` にアクセス |
| B4 記事表示 | ローンチ記事（使い方ガイド）が正しく表示されることを確認 |
| OGP | `https://blog.agiinc.io/b4-article-slug` の OGP を Twitter Card Validator 等で確認 |
| プロダクトリンク | 記事内の hima.agiinc.io へのリンクが有効であることを確認 |

---

## 3. 障害発生時の一次対応手順

### 3-1. hima.agiinc.io が表示されない

```
1. curl -vI https://hima.agiinc.io で HTTP ステータスを確認
2. DNS を確認: dig hima.agiinc.io で Cloudflare の IP に解決されるか
3. Cloudflare Dashboard → Pages → Deployments で最新デプロイを確認
   - デプロイ失敗 → ビルドログを確認 → 直前のデプロイにロールバック（後述 §6）
   - デプロイ成功だが表示されない → Cloudflare Status (cloudflarestatus.com) で障害情報を確認
4. Cloudflare 側障害の場合 → ステータスページを監視。SNS で状況を告知
5. アプリ側バグの場合 → ロールバック実行（§6-1）
```

**重大度**: P0

### 3-2. api-hima.agiinc.io（Worker）がエラーを返す

```
1. curl -I https://api-hima.agiinc.io でレスポンスを確認
2. Cloudflare Dashboard → Workers → Logs でエラー内容を特定
   - Origin 検証エラー → 許可リストに hima.agiinc.io が含まれているか確認
   - ランタイムエラー → Worker コードのバグ。ロールバック実行（§6-2）
   - 429 Too Many Requests → レートリミット到達。Worker Analytics で確認
3. 特定プロバイダのみ失敗する場合:
   - 転送先ホワイトリスト（api.openai.com, api.anthropic.com, generativelanguage.googleapis.com）を確認
   - プロバイダ側の障害ステータスを確認:
     - OpenAI: status.openai.com
     - Anthropic: status.anthropic.com
     - Google: status.cloud.google.com
   - プロバイダ障害の場合 → ユーザー向けに告知。他プロバイダでの代替利用を案内
4. Worker 全面障害の場合 → ロールバック実行（§6-2）
```

**重大度**: 全プロバイダ失敗 → P0、特定プロバイダのみ → P1

### 3-3. agiinc.io が表示されない

```
1. curl -vI https://agiinc.io で HTTP ステータスを確認
2. Cloudflare Dashboard でデプロイ状態を確認
3. DNS を確認: dig agiinc.io
4. デプロイ失敗 → ロールバック
5. プロダクト（hima.agiinc.io）への直接アクセスは可能なため、SNS での導線でカバー
```

**重大度**: P1（プロダクト自体は独立稼働のため）

### 3-4. blog.agiinc.io が表示されない / 記事が見えない

```
1. curl -vI https://blog.agiinc.io で HTTP ステータスを確認
2. ブログプラットフォームの管理画面で記事の公開状態を確認
3. DNS を確認: dig blog.agiinc.io
4. 記事は表示されるがリンク切れ → リンク先 URL を修正して再デプロイ
5. ブログ全体が落ちている場合 → プラットフォームのステータスを確認。SNS 投稿で直接プロダクトリンクを共有して回避
```

**重大度**: P1（ローンチ導線に影響）/ P2（OGP 等の軽微な問題）

### 3-5. UI のバグ・表示崩れ

```
1. DevTools Console でエラーを確認
2. 再現手順を特定
3. コア機能に影響するか判断:
   - バッチ実行不能 → P1。修正して緊急デプロイ、または問題コミットのロールバック
   - 表示崩れのみ → P2。記録して当日中に修正
```

### 3-6. パフォーマンス劣化

```
1. DevTools Network タブで API レスポンスタイムを確認
2. Worker Analytics でレイテンシを確認
3. Worker のレートリミット到達を確認（100 req/min/IP）
4. プロバイダ側のレート制限に到達している場合 → 同時実行数を下げるアップデートを検討
```

**重大度**: ユーザーに影響あり → P1 / 軽微 → P2

---

## 4. エスカレーション体制

### 4-1. ロール別の責任範囲

| ロール | 担当者 | 責任範囲 |
|---|---|---|
| **CTO** | アレクセイ・ヴォルコフ | 障害判定・技術対応の意思決定・ロールバック判断・Worker / Pages の操作 |
| **Engineer** | ラジ・パテル | 一次切り分け・ログ調査・コード修正・緊急デプロイ実行 |
| **PdM** | パク・ミンジュン | 障害の影響範囲評価・Go/No-Go の再判定・プロダクト面の意思決定 |
| **CMO** | ソフィア・リベラ | ユーザー向け告知（X / SNS）・コンテンツ投稿のリスケ判断 |
| **Creative** | レア・デュボワ | コンテンツ修正（ブログ・動画の差し替え）・告知画像の作成 |
| **CEO** | 中村カイ | 最終判断（ローンチ中止 / 続行）・全体方針の決定 |

### 4-2. エスカレーションフロー

```
障害検知
  │
  ▼
Engineer（ラジ）が一次切り分け（5 分以内）
  │
  ├── 原因特定 + 自力復旧可能 → 修正実行 → CTO に報告
  │
  └── 原因不明 or 復旧困難 → CTO（アレクセイ）にエスカレーション
        │
        ├── P2 → CTO 判断で対応方針決定。当日中に修正
        │
        ├── P1 → CTO + PdM で影響範囲を評価
        │     ├── 修正可能 → Engineer が緊急デプロイ
        │     └── 修正困難 → ロールバック実行
        │
        └── P0 → CTO が即座にロールバック実行
              │
              └── 30 分以内に復旧しない場合 → CEO に報告
                    └── ローンチ中止 / 延期の判断
```

### 4-3. コミュニケーション手段

| 状況 | 手段 |
|---|---|
| 通常の障害連絡 | Git commit メッセージ + リポジトリ内の記録 |
| 緊急時のロール間連携 | 各ロールの起動時タスクとして障害確認を含める |
| ユーザー向け告知 | X（@agiinc）で状況を投稿。CMO が担当 |

---

## 5. ローンチ当日タイムライン（障害対応連動）

> launch-checklist.md セクション 6 と連動

| 時刻 (JST) | アクション | 担当 | 障害対応 |
|---|---|---|---|
| **10:00** | **全サービス最終ヘルスチェック** | CTO / Engineer | 4 サービス全ての §2 チェックを実行。異常があれば Go/No-Go を再判定 |
| **10:30** | Worker テスト実行（3 プロバイダ） | Engineer | OpenAI / Anthropic / Google 各 1 件のテスト実行を確認 |
| **10:45** | ヘルスチェック結果を記録 | CTO | 結果を記録。全 OK なら Go 確定 |
| **11:00** | ブログ B4 公開（使い方ガイド） | Creative / CMO | 公開後に記事 URL・OGP・プロダクトリンクを確認 |
| **11:30** | 全リンク最終確認 | PdM | ブログ→プロダクト、ブログ→X、ブログ→YouTube の導線確認 |
| **12:00** | X ローンチスレッド投稿 | CMO | 投稿後にリンク先が全て有効か確認 |
| **12:10** | 初動返信・引用投稿対応開始 | CMO | — |
| **12:30** | YouTube V2 デモ動画公開 | Creative / CMO | 動画内のリンクが有効か確認 |
| **12:40** | X で動画リンク追投稿 | CMO | — |
| **13:00** | **プロダクト稼働ヘルスチェック（ローンチ後）** | CTO / Engineer | §2 の全チェックを再実行。Worker Analytics でエラー率を確認 |
| **14:00** | 定期チェック | Engineer | Worker エラー率・レスポンスタイムを確認 |
| **16:00** | 定期チェック | Engineer | 同上 |
| **18:00** | 当日中間メトリクス確認 | PdM / CMO | PV/UV/再生/反応。障害の兆候がないか確認 |
| **20:00** | 定期チェック | CTO / Engineer | Worker Analytics の日次サマリを確認 |
| **翌 02:00** | Show HN 投稿 | PdM / CMO | 投稿前にサービス稼働を再確認 |
| **翌朝** | Reddit 投稿 + 翌日サマリ | CMO / CTO | サービス稼働確認後に投稿。前日の障害有無をまとめる |

---

## 6. ロールバック手順

### 6-1. Cloudflare Pages（hima.agiinc.io）のロールバック

```
手順:
1. Cloudflare Dashboard にログイン
2. Workers & Pages → agiinc-hima を選択
3. Deployments タブを開く
4. 正常動作していたデプロイを特定（デプロイ時刻とコミットハッシュで判別）
5. 該当デプロイの「...」メニュー → 「Rollback to this deploy」を選択
6. 確認ダイアログで実行

所要時間: 1〜2 分（Cloudflare のエッジ伝播）

補足:
- ロールバックは即座にプロダクションに反映される
- ロールバック後も旧デプロイは Deployments 一覧に残るため、再度切り戻し可能
- main ブランチへの push で自動デプロイが走るため、
  ロールバック後にコード修正を push すると上書きされる。
  修正完了まで main への push を止めること
```

### 6-2. Cloudflare Worker（api-hima.agiinc.io）のロールバック

```
手順 A — Dashboard からロールバック:
1. Cloudflare Dashboard にログイン
2. Workers & Pages → agiinc-hima-worker を選択
3. Deployments タブを開く
4. 正常動作していたバージョンの「Rollback to this deploy」を選択
5. 確認ダイアログで実行

手順 B — CLI からロールバック:
1. products/hima/ の worker ディレクトリに移動
2. git log で正常なコミットを特定
3. git checkout <commit-hash> -- worker/
4. npx wrangler deploy （worker/ ディレクトリ内で実行）

所要時間: 1〜2 分

補足:
- Worker のロールバックは Pages と同様に即座に反映される
- worker/** パスの変更時のみ deploy-worker.yml が走るため、
  Pages のロールバックとは独立して操作できる
```

### 6-3. ロールバック判断基準

| 状況 | 判断 |
|---|---|
| P0 障害で原因がデプロイ起因と判明 | 即座にロールバック |
| P0 障害で原因不明 | ロールバックを先に実行し、調査は並行で行う |
| P1 障害でデプロイ起因 | 修正デプロイが 30 分以内に出せない場合はロールバック |
| P1 障害でプロバイダ起因 | ロールバック不要。プロバイダの復旧を待つ |
| P2 障害 | ロールバック不要。修正を当日中にデプロイ |

---

## 7. 障害対応チェックリスト（当日用）

### ローンチ前（10:00）

- [ ] hima.agiinc.io HTTPS アクセス OK
- [ ] hima.agiinc.io トップ画面描画 OK
- [ ] api-hima.agiinc.io Worker 応答 OK
- [ ] api-hima.agiinc.io CORS ヘッダー OK
- [ ] OpenAI テスト実行 OK
- [ ] Anthropic テスト実行 OK
- [ ] Google テスト実行 OK
- [ ] agiinc.io 表示 OK
- [ ] agiinc.io → hima.agiinc.io 導線 OK
- [ ] blog.agiinc.io 表示 OK
- [ ] blog.agiinc.io B4 記事表示 OK
- [ ] Cloudflare Dashboard アクセス可能（ロールバック準備）

### ローンチ後（13:00）

- [ ] hima.agiinc.io 正常稼働
- [ ] api-hima.agiinc.io 正常稼働
- [ ] Worker エラー率 < 1%
- [ ] Worker レイテンシ正常範囲内
- [ ] ユーザー報告の障害なし
