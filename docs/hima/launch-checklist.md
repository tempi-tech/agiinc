# Hima ローンチ準備チェックリスト（2026-03-25）

> PdM パク・ミンジュン | 2026-02-14 更新 | ステータス: 実行管理版（ローンチ準備）

## 概要

ローンチ日 **2026-03-25（水）** に向けた、プロダクト・技術・コンテンツ横断の最終チェックリスト。
参照: `docs/hima/mvp-spec.md` / `docs/hima/tech-architecture.md` / `docs/hima/launch-content-strategy.md` / `docs/hima/marketing-strategy.md`

### 進捗サマリー（2026-02-14 時点）

| カテゴリ | 完了 | 残 | 備考 |
|---|---|---|---|
| プロダクト（P-01〜P-19） | 14/19 | 5 | MVP 12 機能中 11 機能テスト PASS。パフォーマンステスト 3 件 + P-01 疎通確認が残 |
| インフラ（I-01〜I-05） | 1/5 | 4 | I-05 完了。I-01〜I-04 は全サービスデプロイ済み、正式検証は 3/22 予定 |
| SEO（S-01〜S-04） | 4/4 | 0 | S-01 OGP 画像制作完了・メタタグ更新済み。S-02〜S-04 完了済み |
| コンテンツ（C-01〜C-04） | 0/4 | 4 | 全原稿完成・CMO レビュー済み。画像素材・投稿予約・公開予約が残 |
| YouTube（Y-01〜Y-03） | 2/3 | 1 | Y-01/Y-02 完了。映像制作・公開準備が残 |

---

## 1. プロダクト（MVP 機能・品質）

> エビデンス: `docs/hima/launch-test-report.md`（2026-02-14 実施、166 テスト全 PASS）

### 1-1. 全機能の動作確認（F1-F12）

| ID | チェック項目 | 完了条件 | 担当 | 期限 | 状態 |
|---|---|---|---|---|---|
| P-01 | F1 API キー管理（OpenAI / Anthropic / Google） | 3 プロバイダで登録・更新・削除・マスク表示・疎通確認が成功 | Engineer | 3/20 | [ ] |
| P-02 | F2 レシピエディタ（`{{変数}}` 解析） | 変数の自動検出と表示が仕様通り | Engineer | 3/20 | [x] |
| P-03 | F3 バッチ実行（CSV / テキスト） | CSV アップロードとテキスト貼り付けの両方で実行成功 | Engineer | 3/20 | [x] |
| P-04 | F4 リアルタイム進捗表示 | 件数・進捗率・バーが処理中に更新される | Engineer | 3/20 | [x] |
| P-05 | F5 結果テーブル表示 | 入力/出力/状態が行単位で正しく表示、展開表示可 | Engineer | 3/20 | [x] |
| P-06 | F6 CSV エクスポート | 入力列 + 出力列 + 状態を含む CSV を出力 | Engineer | 3/20 | [x] |
| P-07 | F7 モデル選択 | 対応モデルを選択し実行できる | Engineer | 3/20 | [x] |
| P-08 | F8 レシピ保存/再利用 | 保存・一覧・読み込み・複製・削除が動作 | Engineer | 3/20 | [x] |
| P-09 | F9 パラメータ設定 | temperature / max_tokens 変更が実行に反映 | Engineer | 3/20 | [x] |
| P-10 | F10 テスト実行（1件） | バッチ前の単体実行が成功、結果確認可 | Engineer | 3/20 | [x] |
| P-11 | F11 バッチキャンセル | 実行中キャンセルで未処理行が停止 | Engineer | 3/20 | [x] |
| P-12 | F12 エラーリトライ | 失敗行のみ再実行できる | Engineer | 3/20 | [x] |

**P-01 残アクション**: 登録・更新・削除・マスク表示は単体テスト PASS。疎通確認は `validateKey` を実 API 呼び出しに修正済みだが、3 プロバイダの実キーによる接続成功確認が未実施。ステージング環境または実キーでの E2E 確認が必要。

### 1-2. パフォーマンステスト

| ID | チェック項目 | 完了条件 | 担当 | 期限 | 状態 |
|---|---|---|---|---|---|
| P-13 | 100 件バッチ実行の基準計測 | 主要モデルで処理時間を測定し、ボトルネックを記録 | Engineer | 3/21 | [ ] |
| P-14 | UI 応答性 | 実行中も UI 操作（スクロール・展開・キャンセル）が破綻しない | Engineer | 3/21 | [ ] |
| P-15 | メモリ使用確認 | 大量行（100〜300 件）でブラウザクラッシュなし | Engineer | 3/21 | [ ] |

**残アクション**: P-13〜P-15 は実 API キー + 実ブラウザ環境が必要。ヘッドレステストでは再現不可のため、デプロイ済み環境（hima.agiinc.io）での手動検証を 3/21 までに実施すること。

### 1-3. エラーハンドリング

| ID | チェック項目 | 完了条件 | 担当 | 期限 | 状態 |
|---|---|---|---|---|---|
| P-16 | API キー未設定時ガード | 実行前に明確なエラーメッセージ表示 | Engineer | 3/21 | [x] |
| P-17 | API レート制限/タイムアウト対応 | 対象行に失敗理由を記録し全体処理が継続 | Engineer | 3/21 | [x] |
| P-18 | CSV 不正フォーマット対応 | パース失敗時に修正可能な案内を表示 | Engineer | 3/21 | [x] |
| P-19 | Worker/ネットワーク障害時 | 再試行導線 + 障害メッセージを表示 | Engineer | 3/21 | [x] |

**備考**: P-18 は動作確認テスト中に不足を検出し、未閉引用符検出 + エラーメッセージ表示を追加修正済み（`csvParser.ts` / `InputPanel.tsx`）。

---

## 2. インフラ（ドメイン・配信・API）

> 全 4 サービス（hima / api-hima / agiinc.io / blog）はデプロイ済み。正式な稼働確認は 3/22 に実施予定。

| ID | チェック項目 | 完了条件 | 担当 | 期限 | 状態 |
|---|---|---|---|---|---|
| I-01 | `hima.agiinc.io` 稼働確認 | HTTPS 正常、トップ表示、主要導線動作 | CTO / Engineer | 3/22 | [ ] |
| I-02 | `api-hima.agiinc.io` 稼働確認 | Worker 応答 OK、許可 Origin 制御 OK、3 プロバイダ転送 OK | CTO / Engineer | 3/22 | [ ] |
| I-03 | `agiinc.io` 稼働確認 | 会社サイト表示、導線リンク有効 | CTO / CMO | 3/22 | [ ] |
| I-04 | `blog.agiinc.io` 稼働確認 | B1/B4 記事表示、OGP 生成、リンク有効 | CTO / CMO | 3/22 | [ ] |
| I-05 | 監視と緊急時手順 | ローンチ当日の障害一次対応フローを文書化 | CTO | 3/23 | [x] |

**I-01〜I-04 残アクション**: デプロイは完了済み。CTO サイトレビュー Must Fix 3 件（M1: OGP メタタグ、M2: canonical URL、M3: sitemap/robots.txt）は修正完了。HSTS/CSP セキュリティヘッダの実装完了後、正式な稼働確認を 3/22 に実施すること。

**I-05 完了根拠**: `docs/hima/incident-response-plan.md` にて障害分類（P0/P1/P2）、4 サービスの監視方法、一次対応手順、エスカレーション体制、ロールバック手順、当日障害対応チェックリストを文書化済み。CTO 作成（2026-02-14）。

<!-- セキュリティ進捗: HSTS/CSP セキュリティヘッダ仕様書完成、実装中 -->
**セキュリティ進捗**: HSTS/CSP セキュリティヘッダ仕様書（`docs/hima/security-headers-spec.md`）が完成。全 4 サービス（hima / agiinc / blog / api-hima）に対する `Strict-Transport-Security` および `Content-Security-Policy` の実装方針を定義。CTO 作成、Engineer が実装中。

---

## 3. SEO（公開前最終）

> M1-M3 修正完了（OGP メタタグ・canonical URL・sitemap/robots.txt）。S-01〜S-04 全完了。OGP 画像 3 点制作・メタタグ更新済み（2026-02-14）。

| ID | チェック項目 | 完了条件 | 担当 | 期限 | 状態 |
|---|---|---|---|---|---|
| S-01 | OGP 設定 | `hima.agiinc.io` / `agiinc.io` / `blog.agiinc.io` で title, description, image が正しい | CMO / Creative | 3/23 | [x] |
| S-02 | Twitter Card 設定 | `summary_large_image` で意図したカード表示 | CMO / Creative | 3/23 | [x] |
| S-03 | `sitemap.xml` | サイトマップが生成・公開されている | CTO | 3/23 | [x] |
| S-04 | `robots.txt` | クロール方針が明示され、意図せぬ遮断なし | CTO | 3/23 | [x] |

<!-- S-02: M1-M3 修正で twitter:card summary_large_image メタタグ実装済み -->
<!-- S-03: M3 修正で @astrojs/sitemap 導入済み -->
<!-- S-04: M3 修正で public/robots.txt 配置済み -->

**S-01 完了根拠**: OGP 画像 3 点（4-A hima / 4-B agiinc / 4-C blog）を `demo-assets-spec.md` セクション 4 の仕様に基づき制作完了。形式 PNG、1200x630px、各 300KB 以内。メタタグは www/blog の Layout.astro で `/og-image.png` を参照、hima の index.html に OGP/Twitter Card メタタグを新規追加。Creative レア・デュボワ制作（2026-02-14）。

**S-02 完了根拠**: M1 修正で `twitter:card` `summary_large_image` メタタグ実装済み。OGP 画像は S-01 と共通アセットのため、画像なしでもカード表示の技術実装は完了。

---

## 4. コンテンツ準備

> エビデンス: `docs/hima/content-review-final.md`（CMO 最終レビュー、全 11 件 APPROVE）

| ID | チェック項目 | 完了条件 | 担当 | 期限 | 状態 |
|---|---|---|---|---|---|
| C-01 | ブログ B4 記事 | 本文確定、最終レビュー済み、公開予約（3/25 11:00 JST） | Creative / CMO | 3/24 | [ ] |
| C-02 | X ローンチスレッド | 5 ツイート最終稿 + 画像素材 + 投稿予約（3/25 12:00 JST） | CMO | 3/24 | [ ] |
| C-03 | HN 投稿文 | `social/hn/2026-03-25-show-hn.md` 最終稿、英語校正済み | PdM / CMO | 3/24 | [ ] |
| C-04 | Reddit 投稿文 | `social/reddit/2026-03-26-launch.md` 最終稿、各 subreddit 向け調整済み | CMO | 3/24 | [ ] |

**進捗詳細**:

- **C-01**: B4 記事本文は CMO レビュー APPROVE 済み（`content-review-final.md`）。残: B1 記事リンクのスラッグ付き URL 差し替え、blog.agiinc.io フロントマター動作確認、公開予約設定
- **C-02**: ローンチスレッド 5 ツイート（T1-T5）は CMO レビュー APPROVE 済み。残: デモ GIF アセット制作（Creative）、画像素材準備、投稿予約設定
- **C-03**: 最終稿が `social/hn/2026-03-25-show-hn.md` に存在。英語テキスト完成。残: CMO との最終確認
- **C-04**: 最終稿が `social/reddit/2026-03-26-launch.md` に存在。r/artificial + r/ChatGPT の 2 版を用意済み。残: CMO との最終確認

<!-- デモアセット仕様書: CMO CONDITIONAL APPROVE → v2 3点修正完了、正式APPROVE待ち -->
**関連進捗 — デモアセット仕様書**: CMO レビューで CONDITIONAL APPROVE（`docs/hima/content-review-demo-assets.md` 相当）を受け、Creative が 3 点修正を実施し v2 を完成（`docs/hima/demo-assets-spec.md`）。修正内容: 納品日前倒し・ロゴ→テキスト変更・スレッド配置表追加。正式 APPROVE 待ち。C-02 のデモ GIF 制作に直結するため、早期 APPROVE が必要。

<!-- B2記事: CMO CONDITIONAL APPROVE、Creative修正待ち -->
**関連進捗 — B2 記事**: B2 ブログ記事「AIのコピペ地獄を終わらせる — Himaの設計思想」（`docs/hima/blog-b2-article.md`）が CMO レビューで CONDITIONAL APPROVE（`docs/hima/content-review-b2.md`）。Creative による修正待ち。B2 はローンチ前公開予定の設計思想記事で、B4（使い方ガイド）との棲み分けが確認済み。

---

## 5. YouTube 準備

> エビデンス: `docs/hima/content-review-youtube-v2.md`（CMO レビュー、台本+字幕 APPROVE）

| ID | チェック項目 | 完了条件 | 担当 | 期限 | 状態 |
|---|---|---|---|---|---|
| Y-01 | V1 会社紹介動画 | 台本完成済み、制作進捗と公開状態を確認（V1 は会社ストーリー） | Creative / CMO | 3/23 | [x] |
| Y-02 | V2 デモ動画（本命） | 企画書確定（`docs/hima/youtube-v2-plan.md`）、制作着手 | Creative / PdM | 3/23 | [x] |
| Y-03 | V2 公開準備 | タイトル・説明文・サムネ・字幕・予約公開（3/25 12:30 JST） | Creative / CMO | 3/24 | [ ] |

**Y-01 完了根拠**: 台本（`docs/hima/youtube-v1-script.md`）、英語字幕（`docs/hima/youtube-v1-subtitles.srt`）が完成・コミット済み。

**Y-02 完了根拠**: 企画書（`docs/hima/youtube-v2-plan.md`）確定済み。台本（`docs/hima/youtube-v2-script.md`）、英語字幕（`docs/hima/youtube-v2-subtitles.srt`）が完成し、CMO レビュー APPROVE 済み（`content-review-youtube-v2.md`）。完了条件「企画書確定、制作着手」を満たす。

**Y-03 残アクション**: 画面キャプチャ取得（S-01〜S-09）、映像編集、サムネイル制作、タイトル/説明文/タグ設定、予約公開設定（3/25 12:30 JST）。`youtube-v2-plan.md` セクション 10 の制作チェックリスト参照。

---

## 6. ローンチ当日タイムライン（JST）

| 時刻 | アクション | 担当 | チェック |
|---|---|---|---|
| 11:00 | ブログ B4 公開（使い方ガイド） | Creative / CMO | [ ] |
| 11:30 | 全リンク最終確認（ブログ→プロダクト、ブログ→X、ブログ→YouTube） | PdM | [ ] |
| 12:00 | X ローンチスレッド投稿 | CMO | [ ] |
| 12:10 | 初動返信・引用投稿対応開始 | CMO | [ ] |
| 12:30 | YouTube V2 デモ動画公開 | Creative / CMO | [ ] |
| 12:40 | X で動画リンク追投稿 | CMO | [ ] |
| 13:00 | プロダクト稼働ヘルスチェック（UI/API/主要導線） | CTO / Engineer | [ ] |
| 18:00 | 当日中間メトリクス確認（PV/UV/再生/反応） | PdM / CMO | [ ] |
| 翌 02:00 | Show HN 投稿（3/26 02:00 JST） | PdM / CMO | [ ] |
| 翌朝 | Reddit 投稿（r/artificial, r/ChatGPT） | CMO | [ ] |

---

## 7. Go / No-Go 判定（3/24 18:00 JST）

| 判定項目 | 合格条件 | 状態 |
|---|---|---|
| プロダクト品質 | P-01〜P-19 の P0/P1 相当が完了 | [ ] |
| インフラ | I-01〜I-04 完了 | [ ] |
| SEO | S-01〜S-04 完了 | [ ] |
| コンテンツ | C-01〜C-04 完了 | [ ] |
| YouTube | Y-02〜Y-03 完了 | [ ] |

**最終判定**: [ ] Go / [ ] No-Go
