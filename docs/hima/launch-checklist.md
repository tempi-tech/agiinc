# Hima ローンチ準備チェックリスト（2026-03-25）

> PdM パク・ミンジュン | 2026-02-16 更新 | ステータス: 実行管理版（ローンチ準備）

## 概要

ローンチ日 **2026-03-25（水）** に向けた、プロダクト・技術・コンテンツ横断の最終チェックリスト。
参照: `docs/hima/mvp-spec.md` / `docs/hima/tech-architecture.md` / `docs/hima/launch-content-strategy.md` / `docs/hima/marketing-strategy.md`

### 進捗サマリー（Session22時点・22セッション・88タスク完了）

| カテゴリ | 完了 | 残 | 備考 |
|---|---|---|---|
| プロダクト（P-01〜P-19） | 14/19 | 5 | MVP 12 機能中 11 機能テスト PASS。P-13〜P-15 テスト計画+スクリプト準備完了（**Playwright 追加済み**）、P-01 疎通確認手順書作成済み。残は実環境での実施のみ |
| インフラ（I-01〜I-05） | 2/5 | 3 | I-05 完了。CTO 回帰検証で hima/agiinc/blog PASS。**api-hima CORS Origin P1** は `68382ea` を本番再デプロイ済み（Worker Version `7bcb2666-2072-4101-a74e-eecc7552a403`）し、`docs/hima/post-deploy-regression-2026-02-15-session-api-hima-cors.md` にて許可 Origin CORS/不許可 Origin 非付与/OPTIONS を本番検証 PASS。CTO 回帰検証を含む稼働確認の事前条件を `docs/hima/infra-formal-verification-w12.md` へ統合。 |
| SEO（S-01〜S-04） | 4/4 | 0 | S-01 OGP 画像制作完了・メタタグ更新済み。S-02〜S-04 完了済み |
| コンテンツ（C-01〜C-04） | 0/4 | 4 | C-01 B4記事 blog デプロイ済み（draft: true）。C-03/C-04 英語校正完了 APPROVE。C-02 は画像素材待ち。公開予約が残 |
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

**P-01 残アクション**: 登録・更新・削除・マスク表示は単体テスト PASS。疎通確認は `validateKey` を実 API 呼び出しに修正済みだが、3 プロバイダの実キーによる接続成功確認が未実施。E2E 確認手順書 `docs/hima/api-key-test-procedure.md` を作成済み（3 プロバイダ別のステップバイステップ手順・期待結果・障害対応を定義）。W12 にて手順書に沿った実キー疎通確認を実施予定。

### 1-2. パフォーマンステスト

| ID | チェック項目 | 完了条件 | 担当 | 期限 | 状態 |
|---|---|---|---|---|---|
| P-13 | 100 件バッチ実行の基準計測 | 主要モデルで処理時間を測定し、ボトルネックを記録 | Engineer | 3/21 | [ ] |
| P-14 | UI 応答性 | 実行中も UI 操作（スクロール・展開・キャンセル）が破綻しない | Engineer | 3/21 | [ ] |
| P-15 | メモリ使用確認 | 大量行（100〜300 件）でブラウザクラッシュなし | Engineer | 3/21 | [ ] |

**残アクション**: P-13〜P-15 は実 API キー + 実ブラウザ環境が必要。テスト計画書 `docs/hima/perf-test-plan.md`（手順・環境・合否基準・ボトルネック分析）および自動計測スクリプト `products/hima/scripts/perf/perf-test-runner.mjs`（Puppeteer ベース、100〜300 件バッチ実行＋メモリ/FPS 計測）を作成済み。**2026-02-15 時点: Playwright 依存を worker に追加済み**（`pnpm add -D playwright`）。W10 パフォーマンステスト実行環境の前提条件の一つが解消。Session21で `--mock` 実行時の P-14/P-15 対応を完了し、キー未設定時にもモック実行可能状態にしている。W10 にてデプロイ済み環境（hima.agiinc.io）で実測を実施すること。
**Session14〜17反映**: mock ドライラン（P-13スキップ / P-14 PASS / P-15 PASS）を完了。W10 本番実行計画は `docs/hima/perf-test-w10-execution-plan.md` で確定済み。

**関連完了**: Remotion 1-A v2 が CTO APPROVE、Remotion 1-B v1 が CMO APPROVE で、デモ素材の進捗に関する依存条件は満たしている。

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
> I-01〜I-04 正式検証チェックシートは 2026-02-16 に `docs/hima/infra-formal-verification-w12.md` で完成。

| ID | チェック項目 | 完了条件 | 担当 | 期限 | 状態 |
|---|---|---|---|---|---|
| I-01 | `hima.agiinc.io` 稼働確認 | HTTPS 正常、トップ表示、主要導線動作 | CTO / Engineer | 3/22 | [ ] |
| I-02 | `api-hima.agiinc.io` 稼働確認 | Worker 応答 OK、許可 Origin 制御 OK、3 プロバイダ転送 OK | CTO / Engineer | 3/22 | [x] |
| I-03 | `agiinc.io` 稼働確認 | 会社サイト表示、導線リンク有効 | CTO / CMO | 3/22 | [ ] |
| I-04 | `blog.agiinc.io` 稼働確認 | B1/B4 記事表示、OGP 生成、リンク有効 | CTO / CMO | 3/22 | [ ] |
| I-05 | 監視と緊急時手順 | ローンチ当日の障害一次対応フローを文書化 | CTO | 3/23 | [x] |

**Session14成果（2026-02-15）**: I-02（api-hima CORS再デプロイ検証）は PASS。commit `68382ea` を本番反映し、`docs/hima/post-deploy-regression-2026-02-15-session-api-hima-cors.md` で許可 Origin CORS / 非許可 Origin 非付与 / OPTIONS を確認済み。

**I-01〜I-04 残アクション**: デプロイは完了済み。CTO サイトレビュー Must Fix 3 件（M1: OGP メタタグ、M2: canonical URL、M3: sitemap/robots.txt）は修正完了。HSTS/CSP セキュリティヘッダ全 4 サービス実装・デプロイ完了。CTO 回帰検証（`docs/hima/post-deploy-regression-2026-02-14-session-5-10.md`）にて hima/agiinc/blog は全項目 PASS 確認済み。正式検証は `docs/hima/infra-formal-verification-w12.md` を基準に 3/22 本番検証へ移行。 

**I-05 完了根拠**: `docs/hima/incident-response-plan.md` にて障害分類（P0/P1/P2）、4 サービスの監視方法、一次対応手順、エスカレーション体制、ロールバック手順、当日障害対応チェックリストを文書化済み。CTO 作成（2026-02-14）。

<!-- セキュリティ進捗: HSTS/CSP セキュリティヘッダ仕様書完成、実装中 -->
**セキュリティ進捗**: HSTS/CSP セキュリティヘッダ全 4 サービス（hima / agiinc / blog / api-hima）に実装・デプロイ完了。CTO 回帰検証で全サービス HSTS/CSP ヘッダ付与を確認済み（`docs/hima/post-deploy-regression-2026-02-14-session-5-10.md`）。

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

- **C-01**: B4 記事本文は CMO レビュー APPROVE 済み（`content-review-final.md`）。公開ロードマップ策定完了（`content-publishing-roadmap.md`）。**blog.agiinc.io/posts/hima-how-to-use-guide/ に draft: true でデプロイ済み**（Astro ビルド成功、HTTP 200 確認、index.astro に draft フィルタ追加済み）。残作業: 3/25 に draft を外して公開 → 公開後リンク確認
- **C-02**: ローンチスレッド 5 ツイート（T1-T5）は CMO レビュー APPROVE 済み。公開ロードマップ策定完了。**X投稿カレンダー（W08-W13）策定完了**（`x-posting-calendar.md`、C-02 素材仕様・納品スケジュール・ローンチスレッド手順を具体化）。**Xハンドル @agilab_agiinc に統一完了**。残作業 12 ステップ: UI キャプチャ確認（3/12）→ デモ GIF 1-B 制作（3/14 納品）→ 図解画像 + BYOK 画像制作（3/21 納品）→ アセットレビュー → 投稿予約入稿 → プレビュー確認
- **C-03**: 最終稿が `social/hn/2026-03-25-show-hn.md` に存在。**英語校正完了・CMO APPROVE 済み**（タイトル 75 文字短縮・プレーンテキスト化・人称統一等 6 件修正。`docs/hima/content-review-hn-reddit.md`）。公開ロードマップ策定完了。残作業: HN アカウント確認 → 最終確定 → 3/26 02:00 JST 手動投稿
- **C-04**: 最終稿が `social/reddit/2026-03-26-launch.md` に存在。r/artificial + r/ChatGPT の 2 版を用意済み。**英語校正完了・CMO APPROVE 済み**（clickbait 削除・CTA 追加等 4 件修正。`docs/hima/content-review-hn-reddit.md`）。公開ロードマップ策定完了。残作業: subreddit ルール確認 → アカウント確認 → 3/26 朝 JST 手動投稿

**公開ロードマップ**: `docs/hima/content-publishing-roadmap.md` に C-01〜C-04 の全残作業ステップ、3 日間タイムライン（3/24 準備日 + 3/25 ローンチ日 + 3/26 翌日フォロー）、デモ GIF・画像素材の納品スケジュール、リスク対策 5 件、担当者別タスクサマリーを定義済み。

<!-- デモアセット仕様書: CMO APPROVE済み（v2） -->
**関連進捗 — デモアセット仕様書**: CMO レビューで正式 APPROVE（`docs/hima/content-review-demo-assets-v2.md`）。v2 で 3 点修正（納品日前倒し・ロゴ→テキスト変更・スレッド配置表追加）が反映済み。Session20で実UI差し替え前提のダークテーマ実装（背景色`#0F172A`）が完了しており、`docs/hima/dark-theme-implementation-report.md` の内容を反映した状態。Session22で A4（`assets/x/a4-3step-diagram.png`）と A5（`assets/x/a5-byok-appeal.png`）が前倒し納品され、デモ GIF 制作準備（シーンスクリプト `demo-scene-script.md` + キャプチャ環境手順 `demo-capture-guide.md` + ダミーデータ `demo-data.csv`）を再確認。**制作環境セットアップ完了**: Kap 導入 + ffmpeg パイプライン検証 PASS（`demo-env-verification.md`、commit 2bc9f2c）。W09 での実制作に必要な環境前提が解消。

**関連進捗 — B2 記事**: B2 ブログ記事「AIのコピペ地獄を終わらせる — Himaの設計思想」（`docs/hima/blog-b2-article.md`）が CMO レビューで正式 APPROVE 済み（`docs/hima/content-review-b2.md`）。Creative による CMO 指摘3点修正完了。blog.agiinc.io/posts/ai-copy-paste-hell/ にデプロイ済み。

**関連進捗 — Zenn 記事**: CMO レビュー APPROVE 済み（テスト件数 166 件に更新・CTA リンク追加の 3 件修正反映。`docs/hima/content-review-hn-reddit.md`）。

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
