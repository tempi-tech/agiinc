# バーティカル AI プロダクトリサーチ 2026-02-18

> PdM パク・ミンジュン実施。特定業界で働く人の生の声を WebSearch + Grok API で収集・分析。

## メタデータ

| 項目 | 値 |
|---|---|
| 実施日 | 2026-02-18 |
| 期間 | 2026-01-19 〜 2026-02-18（30日間） |
| 探索対象業界 | 不動産, 士業, 飲食, 医療, 教育, EC, 人材, 建設 |
| locale | both（日本語圏 + 英語圏） |
| focusBlock | なし（広く探索） |
| 検索クエリ数 | 40+（Grok API 40クエリ + WebSearch 50+クエリ） |
| 収集ポスト/記事概数 | 約 300 件（X投稿 + 業界記事 + 調査データ） |
| API | Grok API — grok-3 / grok-4-1-fast-non-reasoning + WebSearch |
| 除外 | 開発者ツール（レッドオーシャン） |

---

## 1. 探索サマリー

8 業界 × 4 観点（非効率な手作業 / ツールへの不満 / AI活用の試行錯誤 / 人を雇えない問題）で網羅的に探索。各業界について日本語・英語それぞれ 3-5 クエリを実行し、X投稿、note.com、業界メディア、調査レポートから一次情報を収集した。

**全業界に共通する構造的パターン:**
- 日本の中小事業者は慢性的な人手不足。人件費を削りたいが業務量は増える一方
- 業界特化SaaSは月額1-5万円が相場だが、小規模事業者には「高すぎる」
- ChatGPTを業務に使おうとするが、専門用語の精度が低く「結局手作業に戻る」パターンが頻出
- 大手が取らないニッチ市場に、低コスト AI ツールの隙間がある

---

## 2. 機会クラスター一覧

「金を払うか」順にソート。

### クラスター A: 士業 × AI書類作成・会計自動化

**業界 × 課題**: 士業（税理士・行政書士・司法書士）× 書類作成の自動化 + 会計ソフトの不満解消

**需要シグナル: 🔴 強い**

代表的な声:

- https://x.com/yomasaru/status/2020498799173747072 — 税理士・吉澤大氏が作った「freee難民」がXでトレンド入り。freeeを使いこなせず挫折するユーザーが大量発生
- https://x.com/yomasaru/status/2023513164055527582 — 同氏が弥生クラウドを「異常に使いにくい」と断言。デスクトップからの移行を断念する人が続出
- https://x.com/masahiro38zaki/status/2020654458775261446 — 税理士・宮崎雅大氏「freeeだけでなく弥生もマネーフォワードも要・大修正」。既存ツール全般の品質問題
- https://x.com/nikkei_legal/status/1951102112471064828 — 日経取材チーム「一般的な生成AIでも事足りる」。高額リーガルテックがChatGPTに脅かされている
- https://x.com/elri_0716/status/1956183794035384615 — ChatGPTで確定申告の勘定科目を聞くが「たまに間違ってる」。ファクトチェックに追われる
- https://note.com/zeirishi_ai_lab/n/nfb06da9dc584 — 税理士事務所は「かつてないほどの採用難」。若手は リモート可のIT企業へ流出
- https://note.com/ai__worker/n/n66196ca8f701 — 行政書士事務所で建設業許可の初稿作成が3-4時間→AI導入で30分に短縮

**金を払うか**: 🔴 払う
- 弁護士の弁護士会費だけで年60万円（https://x.com/harrier0516osk/status/1808039013900849478）。SaaS追加費用が重い
- 税理士が月額数千〜数万円のツールに既に課金中（freee / 弥生 / MF）だが不満
- 行政書士の書類作成外注は1件5,000〜30,000円。AI化で代替可能
- 米国ではEve（リーガルAI）が8ヶ月で売上5倍。40時間→15分の案件も（https://x.com/TANANY_VC/status/1880125398845124882）

**市場サイズ感**:
- 日本の士業事業所数: 税理士 約80,000、行政書士 約50,000、司法書士 約23,000、弁護士 約44,000 = **計約20万事業所**
- 想定月額: 3,000〜9,800円（既存ツールより安く、ChatGPTより精度が高いポジション）
- 月間ポテンシャル: 20万 × 5,000円 = **月10億円**（浸透率5%でも月5,000万円）
- AGI Inc. 無人運営なら月100件で黒字可能

**既存の競合**: freee / 弥生 / MF（会計）、LegalOn / GVA TECH（契約レビュー。GVA TECHは2026年に112サービスのカオスマップ公開: https://x.com/GVATECH/status/2013085954505916480 ）、AI-CON（契約書）。いずれも月額1万円以上で大企業向け。**個人事務所・小規模事務所に特化した低価格AIツールは不在**

**AGI Inc.が勝てる理由**: 無人運営なので月額3,000円でも成立。既存ツールは大企業を追い、小規模事務所は置き去り。BYOK方式でユーザーのAPIキーを使えばLLMコストをユーザー負担にでき、さらに低価格が可能

---

### クラスター B: 建設 × 安全書類・日報の自動生成

**業界 × 課題**: 建設業（施工管理・一人親方）× 安全書類、日報、写真台帳の手作業からの解放

**需要シグナル: 🔴 強い**

代表的な声:

- https://note.com/mmboy/n/n30b7560ed78f — FormX社が安全書類作成代行サービスを展開。ココナラでも個人出品多数
- https://note.com/shocase/n/n668e6c5f35f1 — SHO-CASE社「ITの力で建設業界の事務作業の負担を減らしたい」。現場の声を集約
- https://note.com/atsushi30/n/n5c271825347d — 「施工管理がブラックと呼ばれる35の理由」。残業月30-50時間、うち大半が書類仕事
- https://x.com/Si2__Zoo/status/1285518345945546753 — 「最初は『施工管理 残業』『施工管理 辛い』で検索しまくってた…」
- https://note.com/asahidoboku/n/n5edbb3e7f4ac — 「なぜ建設業でDXが進まないのか」。デジタルリテラシーの壁と多重下請け構造
- https://note.com/rich_tiger5119/n/na7b1fe82609d — 建設会社社員がChatGPTで積算PDFから数値抽出・施工計画書・安全書類を自動生成
- https://coconala.com/services/893841 — ココナラで安全書類作成代行が活発に出品（数千円/件）

**金を払うか**: 🔴 払う
- 安全書類作成代行は既にココナラで数千円/件で取引成立。アウトソース市場が存在する
- ANDPAD（業界No.1）に課金する企業多数だが「高い」と不満
- 2024年4月の残業規制（罰則付き）で効率化が法的義務に。払わざるを得ない状況
- Panasonicの間取りAI積算は作業時間56%削減を達成

**市場サイズ感**:
- 日本の建設事業者数: 約47万事業者（うち90%以上が資本金5,000万円以下）
- 一人親方: 約60万人
- 想定月額: 2,980〜9,800円（ANDPAD等の1/3以下）
- 月間ポテンシャル: 100万（事業者+一人親方）× 3,000円 = **月30億円**（浸透率1%でも月3,000万円）
- 米国市場: Procore（時価総額$10B+）が支配するが、小規模業者は手が出ない

**既存の競合**: ANDPAD（7年連続No.1。高価格）、蔵衛門（写真管理特化）、現場Plus、Procore（米国。$55K/年の報告も）、Buildertrend（$500-1,000/月）。**小規模業者・一人親方向けのシンプルな書類自動生成ツールは不在**

**AGI Inc.が勝てる理由**: ANDPADは全機能統合型で高コスト。「安全書類だけ」「日報だけ」を月額3,000円以下で提供すれば、デジタルリテラシーが低い一人親方でも使える。無人運営の低コスト構造が最大の武器。2024年問題（残業規制）が追い風

---

### クラスター C: 飲食 × グルメサイト脱却 + 口コミ・SNS自動化

**業界 × 課題**: 飲食店（個人経営・小規模）× グルメサイト手数料からの解放 + 口コミ返信・SNS運用の自動化

**需要シグナル: 🔴 強い**

代表的な声:

- https://r-reserve.com/column/gourmetsite-commission/ — 食べログ: 昼110円/夜220円の予約手数料 + 月額25,000円〜。ぐるなび: 月額33,000円〜
- https://zzzgiwa257.hateblo.jp/entry/2026/02/02/183752 — 「予約手数料ゼロの自前集客」を提案する記事。手数料疲れの証拠
- https://012cloud.jp/article/uber-eats-comission — Uber Eats手数料35%。薄利の飲食店には壊滅的
- https://note.com/brightiers/n/n82fa107f03a2 — ChatGPTで飲食店のメニュー説明・Instagram投稿を作る方法。「50個のプロンプトテンプレート」
- https://note.com/dataanalysislabo/n/nbb737a342bed — ChatGPTで飲食店集客を自動化しようとする試み
- https://www.tasuki.pro/ma/ma-3878/ — 飲食業の61.8%が非正規スタッフ不足。ワンオペ運営が常態化
- https://store.cloudil.jp/individuals-restaurants-pos/ — POSレジが「無料→有料化」して不満。月額5,000〜10,000円 + ハードウェア15〜30万円

**金を払うか**: 🟡 たぶん
- グルメサイトに月5万円以上払っている店が多数。代替手段に切り替える意思は強い
- ただしレストラン業界のソフトウェア支出は売上の0.19%（月約$305）と極端に低い（https://reformingretail.com/）
- 「月額1,000〜3,000円なら払う」レンジ。高額ツールは採用されない
- Uber Eats 35%手数料を回避できるなら、その差額の一部を自前ツールに充てる意思あり

**市場サイズ感**:
- 日本の飲食店数: 約67万店（個人経営が大半）
- 想定月額: 980〜2,980円（グルメサイト手数料の1/10以下）
- 月間ポテンシャル: 67万 × 2,000円 = **月13.4億円**（浸透率1%でも月1,340万円）
- 一人当たりの平均年収4-6百万円。ツール費は月数千円が上限

**既存の競合**: 食べログ / ぐるなび / ホットペッパー（高い）、Googleビジネスプロフィール（無料だが運用が面倒）、LINE公式アカウント（無料枠あり）。**口コミ返信 + SNS投稿 + 簡易予約を月額1,000円台で提供するAIツールは不在**

**AGI Inc.が勝てる理由**: グルメサイトの年間費用（60万円+）の1/20以下で口コミ管理・SNS・予約を自動化。無人運営だからこそ月額980円でも成立。飲食店オーナーは「ITに弱い」ため、LINEベースのシンプルなUIが鍵

---

### クラスター D: 不動産 × 物件入力・紹介文の自動生成

**業界 × 課題**: 不動産仲介（中小）× 物件ポータルへのデータ入力自動化 + 物件紹介文AI生成

**需要シグナル: 🔴 強い**

代表的な声:

- https://iimon.co.jp/column/bukkenn-input-daikou — 物件1件の入力に30分。400項目以上のフィールド。SUUMO、LIFULL、athome、Yahoo!に同じ情報を手入力
- https://store.f-mikata.jp/best-converter/ — 物件コンバーター14社以上が競合。月額10,000円〜。価格競争が激しい
- https://x.com/EstateTechInc_/status/1813102300694729087 — 「買主追客ロボ」が追客自動化。成約率50%超・座り経費半減を主張
- https://x.com/officenihonbas1/status/1954008278620680706 — 不動産鑑定士がGPT-5で投資ポートフォリオ分析を試行。「AIが不動産相談に不可欠になる」
- https://www.zennichi.or.jp/column/fudosan-chatgpt/ — 不動産会社の59.3%がAI活用を希望、しかし実装は12%のみ。41%は「導入予定なし」
- https://www.nucamp.co.jp/blog/coding-bootcamp-japan-jpn-real-estate-how-ai-is-helping-real-estate-companies-in-japan-cut-costs-and-improve-efficiency — 日本の不動産業務の37%がAIで自動化可能。デジタルスキル不足率38%
- https://x.com/higaki_LA/status/2021504993044619504 — 恵比寿不動産CEO「賃貸管理スタッフ4名を至急採用」。管理物件増に人員が追いつかない

**金を払うか**: 🔴 払う
- 物件コンバーターに月10,000円以上を既に支払っている中小不動産会社が多数
- 写真撮影代行: 1件490〜5,500円、間取り図作成: 330〜1,600円。外注市場が確立
- 追客自動化ツール（エステートテクノロジーズ等）に課金する企業が存在
- PropTech市場: 2022年9,402億円→2030年2.378兆円（2.5倍成長予測）

**市場サイズ感**:
- 日本の不動産仲介業者: 約12.5万社（うち従業員10人以下が約70%）
- 想定月額: 5,000〜19,800円（コンバーターの半額〜同額）
- 月間ポテンシャル: 12.5万 × 10,000円 = **月12.5億円**（浸透率5%でも月6,250万円）
- いえらぶCLOUDは44,000社導入（https://x.com/knowledge7base/status/1957223417863717009）

**既存の競合**: いえらぶCLOUD（44,000社。オールインワンで高額）、不動産コンバートR、各ポータル独自ツール。**AI紹介文生成 + 複数ポータル一括入力を低価格で提供するツールは不在**

**AGI Inc.が勝てる理由**: いえらぶの全機能は不要。「物件入力 + 紹介文生成」だけに絞れば月額5,000円で提供可能。BYOK方式でLLMコストを転嫁。不動産業界のDX遅れ（実装12%）は裏を返せば巨大なブルーオーシャン

---

### クラスター E: EC × 商品説明文・CS自動化

**業界 × 課題**: EC（個人・小規模ショップ）× 商品説明文のAI生成 + カスタマーサポート自動化

**需要シグナル: 🟡 中程度**

代表的な声:

- https://note.com/ai__worker/n/n7f90d4784f24 — ECサイト運営でのAI活用。商品説明文を10倍速で作成可能と主張
- https://www.ecbeing.net/contents/detail/s/483 — 大手アパレル: 商品説明作成が1週間→2-3日に短縮。残業30%減
- https://transcope.io/column/chatgpt-ec-prompt — ChatGPTで商品説明を書くが「単調」「SEOが弱い」「商品特徴を捏造する」
- https://www.sellerlabs.com/blog/amazon-blocked-chatgpt-shopping/ — AmazonがChatGPTクローラーをブロック。出品者が検索から消える
- https://x.com/junglescout/status/1902058053408882930 — Amazon出品者の80%がAIを使用。しかし収益改善には直結せず
- https://x.com/gotolstoy/status/1887629306202861847 — Tolstoy「ECのビジュアルワークフロー全体がデッドウェイト。新商品→AI。新モデル→AI」
- https://fukuoka-ecsite.co.jp/blog/fukuokaecsite/ai_item_info/ — ソロEC運営者は撮影、商品説明、SEO、在庫、発送、CS全てを一人で担当

**金を払うか**: 🟡 たぶん
- BASE手数料6.6%、STORES 5%。プラットフォーム手数料には既に払っている
- 一体型管理ツール（NextEngine等）は月15,000円。小規模には高い
- 月3,000〜5,000円なら払う意思がありそうだが、ChatGPTの無料利用で「まあいいか」層が多い
- Shopifyアプリ市場は飽和状態。差別化が難しい

**市場サイズ感**:
- 日本のEC事業者数: 推定30〜50万（BASEだけで200万ショップ、ただし大半が休眠）
- アクティブ小規模EC: 推定10万事業者
- 想定月額: 1,980〜4,980円
- 月間ポテンシャル: 10万 × 3,000円 = **月3億円**（浸透率5%でも月1,500万円）

**既存の競合**: Transcope（SEOライティング）、Jasper / Copy.ai（英語圏）、Shopifyアプリ多数。**日本語EC特化で商品説明+CS+SNSをワンストップ提供するツールは少ない**

**AGI Inc.が勝てる理由**: ChatGPTでは解決しきれない「商品説明のSEO最適化 + カタログ一括生成」を低価格で提供。無人運営で月額1,980円を実現すれば、NextEngine（15,000円/月）のユーザーを引き抜ける

---

### クラスター F: 医療 × カルテ記載・問診票の自動化

**業界 × 課題**: 医療（クリニック・歯科）× カルテ記載の自動化 + 問診票のデジタル化

**需要シグナル: 🟡 中程度**

代表的な声:

- https://x.com/fpt_software/status/1932636222486425826 — 医師の80%が「文書作業が患者ケアを妨げている」
- https://www.nikkei.com/article/DGXZQOUC17C130X11C25A2000000/ — 富士フイルムがAI文書作成ツール開発。大規模病院で年間2万件の退院サマリー
- https://prtimes.jp/main/html/rd/p/000000015.000056762.html — クリニックがChatGPTで紹介状自動生成。作成時間1/10に
- https://x.com/Dr_kurukuru/status/1955451514111320115 — カルステップ（AIスクライブ）の継続率94.1%。「ICの後、誰がカルテ書いてくれるの…」
- https://x.com/hodanren/status/1993178465600958666 — 保団連「電子カルテ義務化で地方クリニックが廃業の危機」。コスト負担問題
- https://x.com/genkAIjokyo/status/2017735749148565554 — ChatGPTが日本語医療用語を誤訳。英語からの直訳で存在しない用語を生成
- https://x.com/yousukezan/status/1951316739477872850 — 2025年8月にChatGPTの「共有会話」が検索エンジンにインデックスされ個人情報流出。医療データの利用に致命的リスク

**金を払うか**: 🟡 たぶん
- オンプレミス電子カルテは300-500万円 + 月2-3万円の保守。クラウド型でも初期10万円+月額
- カルステップ（AIスクライブ）は月33,000→55,000円。医師は払えるが小規模クリニックには重い
- Doximity CEO「AIで週13時間節約可能」（https://x.com/FortuneMagazine/status/1792974720901718278）
- 医療は規制産業。データ取り扱いの壁が高い

**市場サイズ感**:
- 日本のクリニック数: 約10.4万（無床診療所）、歯科: 約6.8万
- 想定月額: 9,800〜29,800円（電子カルテの1/10）
- 月間ポテンシャル: 17万 × 15,000円 = **月25.5億円**
- ただし医療規制のハードルが極めて高い

**既存の競合**: カルステップ / Freed（AIスクライブ）、ORCA / メドレー / CLINICS（電子カルテ）。**問診票→カルテ→紹介状の一気通貫AI化は黎明期**

**AGI Inc.が勝てる理由**: 限定的。医療は規制のハードルが高く、データ管理責任が重い。無人運営との相性が悪い（サポート体制が求められる）。**見送り推奨**

---

### クラスター G: 人材 × スカウトメール・求人票の自動生成

**業界 × 課題**: 人材紹介（小規模エージェント）× スカウトメール作成 + 求人票自動生成

**需要シグナル: 🟡 中程度**

代表的な声:

- https://www.talent-clip.jp/media/3ways-to-reduce-the-workload — 採用担当者の「辛い瞬間」。スカウトメール・候補者管理が手作業
- https://hrbc.porters.jp/success/detail/id=655 — スカウトメールの返信率向上には個別カスタマイズが必要だが、1通ずつ手書きは非現実的
- https://x.com/bizreach_pr/status/1980823537788284976 — ビズリーチがAIスカウトメール機能を発表
- https://www.dodadsj.com/content/231019_chatgpt/ — ChatGPTで求人票作成: 1-2時間→10分に短縮可能。ただし人間のレビュー必須
- https://x.com/akanette23/status/1820148096904659413 — 求職者「ママワークスのスカウトメール、2時間おきに同じ内容…」。低品質な自動化が逆効果
- https://edenred.jp/article/hr-recruiting/213/ — 中小企業の59.8%が「採用予算が不十分」。非上場企業の採用予算は上場企業の1/4

**金を払うか**: 🟡 たぶん
- 人材紹介手数料は年収の30-35%。1件の成約で150万円以上。スカウト効率化ツールへの投資回収は早い
- ただしGreenhouse年額$6,000〜、Loxo $100-250/user/月と高額ATSは小規模には手が出ない
- ChatGPT無料で「とりあえずやってみる」層が多く、有料ツールへの移行ハードルがある

**市場サイズ感**:
- 日本の人材紹介事業者: 約28,000社（厚労省許認可ベース）
- 想定月額: 4,980〜14,800円
- 月間ポテンシャル: 2.8万 × 9,800円 = **月2.7億円**

**既存の競合**: ビズリーチ（AI搭載）、doda リクルーティングダッシュボード、HRMOS、ジョブカン。大手が機能追加で対応中。**小規模エージェント特化ツールは隙間があるが市場規模が限定的**

**AGI Inc.が勝てる理由**: 大手プラットフォームがAI機能を追加する中、独立ツールとしてのポジションが脅かされやすい。参入優先度は低い

---

### クラスター H: 教育 × テスト採点・教材作成の自動化

**業界 × 課題**: 教育（塾・学校）× テスト採点のAI自動化 + 教材・問題作成

**需要シグナル: 🟡 中程度**

代表的な声:

- https://x.com/thomaschattwill/status/1825912456213897524 — 「AIで書いたレポートをAIで採点する。リアルなディストピア」（80.5K views, 372 likes）
- https://www.koukouseishinbun.jp/articles/-/2025/12/24/150000_2 — 兵庫県の高校生4人がAI採点システムを開発。100問を人間より20分速く処理
- https://jichitai.works/article/details/429 — デジタル採点導入で時間1/3に短縮
- https://prtimes.jp/main/html/rd/p/000000266.000028308.html — 日本の教師283人調査: 61.9%がAIに肯定的だが、実際に「業務が減った」のは28.6%のみ
- https://futurism.com/teachers-ai-grade-students — AIの自律採点精度は33.5%（ルブリックなし）〜50%（ルブリックあり）。まだ実用レベルに達していない
- https://patch.com/massachusetts/across-ma/mcas-ai-grading-error-tanks-student-essay-scores-across-hundreds-districts — マサチューセッツ州のAI採点が1,400人の生徒に誤った低スコアを付与

**金を払うか**: 🟢 不明
- GradeWiz（YC支援）が97%精度で大学に導入中。ただし対象は大学
- 日本の個人塾は生徒10-30人規模。月額数千円が上限
- 公立学校は予算承認プロセスが長い。意思決定が遅い
- 塾管理SaaS（SchPass）は190円/生徒/月と極めて低価格

**市場サイズ感**:
- 日本の学習塾: 約50,000教室（うち個人塾が約60%）
- 想定月額: 1,980〜4,980円
- 月間ポテンシャル: 5万 × 3,000円 = **月1.5億円**
- 意思決定の遅さと精度問題がボトルネック

**既存の競合**: Classi、スタディサプリ（学校向け）、GradeWiz（米国大学）、各種デジタル採点。**日本の個人塾向けは手薄だが、市場規模が小さすぎる**

**AGI Inc.が勝てる理由**: 限定的。教育市場は支払い意思が弱く、精度への要求が高い（誤採点は致命的）。AI精度が向上するまで待つべき

---

## 3. プロダクト候補 TOP 3

### 候補 1: ShigyoAI（仮）— 士業向けAI書類アシスタント

一言: 税理士・行政書士・司法書士の書類作成を、月額3,000円のAIで10倍速くする。

ユーザーの声:
- https://x.com/yomasaru/status/2020498799173747072 — 「freee難民」がトレンド入り。既存ツールへの不満が爆発
- https://x.com/yomasaru/status/2023513164055527582 — 弥生クラウドが「異常に使いにくい」
- https://note.com/ai__worker/n/n66196ca8f701 — 建設業許可の初稿: 3-4時間→AI導入で30分
- https://x.com/elri_0716/status/1956183794035384615 — ChatGPTで確定申告を試すが精度不足
- https://x.com/nikkei_legal/status/1951102112471064828 — 「一般的な生成AIでも事足りる」声が拡大

金を払うか: 🔴 強い根拠あり
- freee/弥生/MFに既に月数千〜数万円を支払い中だが不満
- 行政書士の書類外注は1件5,000〜30,000円
- 弁護士会費年60万円の上にSaaS費が加算され、コスト圧迫

市場サイズ: 約20万事業所 × 月額5,000円 = 月10億円（浸透率5%で月5,000万円）

競合: freee / 弥生 / MF（会計特化）、LegalOn / GVA TECH（契約レビュー。月額1万円+）。**個人事務所向けの低価格AIアシスタントは不在**

無人運営の優位性: 月額3,000円でも無人運営なら黒字。大手は営業チーム・カスタマーサポートが必要で月額1万円以下には下げられない。BYOK方式でLLMコストをユーザー負担に転嫁し、プラットフォーム維持費のみで運営

MVP スコープ:
1. 確定申告・各種申請書の下書きAI生成（テンプレート + BYOK LLM）
2. freee / 弥生のデータインポート → AIレビュー（仕訳チェック・修正提案）
3. 税法・法令のナレッジベース検索（RAG）

リスク: 士業は保守的で新ツール導入に慎重。「AI生成の書類で問題が起きたら」という責任論。横須賀輝尚氏のように4,000人にAI教育するインフルエンサーとの連携が突破口

---

### 候補 2: GenbaDoc（仮）— 建設業向けAI書類自動生成

一言: 安全書類・日報・写真台帳を、スマホから音声入力するだけでAIが自動作成する。

ユーザーの声:
- https://note.com/mmboy/n/n30b7560ed78f — 安全書類作成代行サービスが成立するほどの需要
- https://note.com/atsushi30/n/n5c271825347d — 施工管理の残業月30-50時間、大半が書類仕事
- https://coconala.com/services/893841 — ココナラで安全書類代行が数千円/件で活発に取引
- https://note.com/rich_tiger5119/n/na7b1fe82609d — ChatGPTで積算PDF→数値抽出→施工計画書を自動生成

金を払うか: 🔴 強い根拠あり
- ココナラで既に金を払って書類作成を外注している一人親方が多数
- ANDPAD等の施工管理アプリに課金する企業多数（だが「高い」）
- 2024年問題（残業規制）で法的に効率化が義務化。違反は6ヶ月以下の懲役 or 30万円以下の罰金

市場サイズ: 47万事業者 + 60万一人親方 = 100万超 × 月額2,980円 = 月30億円（浸透率1%で月3,000万円）

競合: ANDPAD（高機能・高価格）、蔵衛門（写真特化）、Procore（米国。$55K/年）。**「安全書類だけ」を月額3,000円以下で提供するツールは存在しない**

無人運営の優位性: ANDPADは全機能統合でサポートチームが必要。GenbaDocは「書類生成だけ」に絞り、音声入力→AI生成→PDF出力のシンプルなフロー。Cloudflare Workers + D1で運営。無人運営なら月額2,980円で黒字

MVP スコープ:
1. 安全書類テンプレート × AIフィル（現場名・作業内容・危険項目を入力→自動生成）
2. 日報の音声入力→テキスト変換→定型フォーマットPDF出力
3. 写真台帳: 写真アップロード→AI自動キャプション→PDF台帳生成

リスク: 建設業界のデジタルリテラシーが低い。「スマホアプリすら使えない」層が一定数いる。LINEベースのUIが突破口になる可能性。元請けの要求するフォーマットへの対応が必要

---

### 候補 3: KuchiKomi AI（仮）— 飲食店向け口コミ・SNS自動運用

一言: Googleの口コミ返信とInstagram投稿を、月額980円のAIが自動化する。

ユーザーの声:
- https://r-reserve.com/column/gourmetsite-commission/ — 食べログ月額25,000円+予約手数料。ぐるなび33,000円。高すぎる
- https://012cloud.jp/article/uber-eats-comission — Uber Eats手数料35%。「利益が残らない」
- https://note.com/brightiers/n/n82fa107f03a2 — ChatGPTで飲食店のSNS投稿を作るが「プロンプトエンジニアリングが難しい」
- https://www.tasuki.pro/ma/ma-3878/ — 61.8%が非正規スタッフ不足。ワンオペが常態化
- https://note.com/tbg2010/n/n3199f0763b6e — 大阪のイタリアン。半径1km内に350店舗。差別化が死活問題

金を払うか: 🟡 たぶん（月額1,000円以下なら高確率で払う）
- グルメサイトに月5万円以上払う余裕がある店は既に存在
- ただし業界全体のソフトウェア支出は売上の0.19%
- 「無料のGoogleビジネスプロフィールすら運用できていない」店が多い
- 月額980円なら「とりあえず試す」ハードルを超えられる

市場サイズ: 67万飲食店 × 月額980円 = 月6.6億円（浸透率3%で月1,980万円）

競合: 食べログ/ぐるなび/HP（高額）、Googleビジネスプロフィール（無料だが運用負荷大）、各種口コミ管理ツール（月5,000〜30,000円）。**月額1,000円以下でAI口コミ返信+SNS投稿を提供するツールは不在**

無人運営の優位性: 月額980円は人件費ゼロだからこそ可能。飲食店67万のうち1%でも6,700店。6,700 × 980 = 月656万円で十分黒字。Cloudflare Workers + Google Business Profile API + Instagram Graph API で構築

MVP スコープ:
1. Googleビジネスプロフィールの口コミ自動返信（トーン設定可能）
2. 写真1枚アップ→Instagram投稿文を自動生成→承認して投稿
3. 週次レポート（口コミ数、評点推移、投稿パフォーマンス）

リスク: 飲食店オーナーの「IT苦手」問題。LINEミニアプリ等、既に使い慣れたプラットフォーム上で動かす必要あり。口コミ返信の品質管理（不適切な返信が炎上リスク）

---

## 4. 見送りクラスター

| クラスター | 見送り理由 |
|---|---|
| F: 医療 × カルテ自動化 | 支払い意思は強いが、医療データ規制・プライバシー要件が重く、無人運営との相性が悪い。カルステップ等の専門プレイヤーが先行。ChatGPTの医療データ漏洩事件（2025年8月）がAI不信を加速 |
| G: 人材 × スカウト自動化 | ビズリーチ・doda等の大手がAI機能を内製で追加中。独立ツールとしてのポジションが脅かされやすい。市場規模が限定的（2.8万事業者） |
| H: 教育 × 採点自動化 | AI採点精度が33-50%と実用レベルに達していない。マサチューセッツ州の誤採点事件が信頼を毀損。公立学校の予算承認プロセスが遅く、個人塾は市場が小さすぎる |
| E: EC × 商品説明自動化 | ChatGPT無料で「まあいいか」層が多く、有料ツールへの移行ハードルが高い。Shopifyアプリ市場は飽和。Transcope等の競合が多い |

---

## 5. URL一覧

### クラスター A（士業）

- https://x.com/yomasaru/status/2020498799173747072
- https://x.com/yomasaru/status/2023513164055527582
- https://x.com/masahiro38zaki/status/2020654458775261446
- https://x.com/nikkei_legal/status/1951102112471064828
- https://x.com/harrier0516osk/status/1808039013900849478
- https://x.com/elri_0716/status/1956183794035384615
- https://x.com/nyamadampersand/status/1819188267675464059
- https://x.com/TakeshiYonese/status/1868278459254059468
- https://x.com/yokosuka_ai/status/2016736246060683374
- https://x.com/TANANY_VC/status/1880125398845124882
- https://x.com/GVATECH/status/2013085994505916480
- https://x.com/leistung_tax/status/1814547625120833848
- https://x.com/dagforce_Y0/status/1817628450402050339
- https://note.com/zeirishi_ai_lab/n/nfb06da9dc584
- https://note.com/ai__worker/n/n66196ca8f701
- https://s-legalestate.com/shigyo-ai-efficiency
- https://weel.co.jp/media/generative-ai-professionals/
- https://hojyokin-hiroba.com/how-to-use-ai-in-business/
- https://officebot.jp/columns/use-cases/generative-ai-tax-accountant/
- https://www.funaisoken.co.jp/dl-contents/industry-ai-judicial_S063

### クラスター B（建設）

- https://note.com/mmboy/n/n30b7560ed78f
- https://note.com/shocase/n/n668e6c5f35f1
- https://note.com/atsushi30/n/n5c271825347d
- https://note.com/asahidoboku/n/n5edbb3e7f4ac
- https://note.com/rich_tiger5119/n/na7b1fe82609d
- https://note.com/snegishi/n/n8d3c142088a0
- https://note.com/mirai_koji/n/na2488b8f5ce6
- https://x.com/Si2__Zoo/status/1285518345945546753
- https://x.com/fudotech_shiba/status/1978049141088338145
- https://coconala.com/services/893841
- https://liskul.com/construction-management-application-comparison-153694
- https://aippearnet.com/column/constructiondx/andpad-sysytem/
- https://axconstdx.com/2025/06/16/ai-estimation/
- https://ken-it.world/it/2025/07/ai-takes-off-paper.html
- https://www.panasonic.com/jp/business/its/chojikan/column/column-8.html
- https://andpad.jp/columns/0028
- https://www.rise-jms.jp/solution/kensetsu/hitodebusoku_kensetsu4.html
- https://www.ibeam.ai/
- https://downtobid.com/blog/ai-construction-bidding
- https://www.mastt.com/research/ai-in-construction

### クラスター C（飲食）

- https://r-reserve.com/column/gourmetsite-commission/
- https://zzzgiwa257.hateblo.jp/entry/2026/02/02/183752
- https://012cloud.jp/article/uber-eats-comission
- https://store.cloudil.jp/individuals-restaurants-pos/
- https://note.com/brightiers/n/n82fa107f03a2
- https://note.com/dataanalysislabo/n/nbb737a342bed
- https://note.com/tbg2010/n/n3199f0763b6e
- https://www.tasuki.pro/ma/ma-3878/
- https://reformingretail.com/index.php/2023/10/10/restaurants-spend-less-than-0-2-on-software/
- https://x.com/Foodist_tw
- https://x.com/techday_au/status/2006481052404216129
- https://x.com/FastCompany/status/1942389649407684942

### クラスター D（不動産）

- https://iimon.co.jp/column/bukkenn-input-daikou
- https://store.f-mikata.jp/best-converter/
- https://store.f-mikata.jp/best-bukken-photo/
- https://www.n-create.co.jp/pr/column/other/proptech/
- https://www.zennichi.or.jp/column/fudosan-chatgpt/
- https://weel.co.jp/media/chatgpt-realestate
- https://ielove-cloud.jp/blog/entry-04725/
- https://www.nucamp.co.jp/blog/coding-bootcamp-japan-jpn-real-estate-how-ai-is-helping-real-estate-companies-in-japan-cut-costs-and-improve-efficiency
- https://x.com/_hirokiofficial/status/2009801892399124508
- https://x.com/higaki_LA/status/2021504993044619504
- https://x.com/EstateTechInc_/status/1813102300694729087
- https://x.com/officenihonbas1/status/1954008278620680706
- https://x.com/Stoneman_ISHIO/status/1997792735068328290
- https://x.com/knowledge7base/status/1957223417863717009
- https://maitconsult.com/

### クラスター E（EC）

- https://note.com/ai__worker/n/n7f90d4784f24
- https://note.com/brightiers/n/n9378d82c66ec
- https://www.ecbeing.net/contents/detail/s/483
- https://transcope.io/column/chatgpt-ec-prompt
- https://www.sellerlabs.com/blog/amazon-blocked-chatgpt-shopping/
- https://fukuoka-ecsite.co.jp/blog/fukuokaecsite/ai_item_info/
- https://x.com/Similarweb/status/1967571048343187792
- https://x.com/junglescout/status/1902058053408882930
- https://x.com/gotolstoy/status/1887629306202861847

### クラスター F（医療）

- https://x.com/fpt_software/status/1932636222486425826
- https://x.com/Dr_kurukuru/status/1955451514111320115
- https://x.com/Dr_kurukuru/status/1957272809782284697
- https://x.com/hodanren/status/1993178465600958666
- https://x.com/elaineywchen/status/1958194137368326253
- https://x.com/unduemeddebt/status/1958281660962607485
- https://x.com/CMAdocs/status/1955317560276115940
- https://x.com/FortuneMagazine/status/1792974720901718278
- https://x.com/NEJM_AI/status/2000649650760724584
- https://x.com/yousukezan/status/1951316739477872850
- https://x.com/genkAIjokyo/status/2017735749148565554
- https://www.nikkei.com/article/DGXZQOUC17C130X11C25A2000000/
- https://prtimes.jp/main/html/rd/p/000000015.000056762.html
- https://clius.jp/mag/2021/12/14/price-on-ehrs/
- https://www.yuyama.co.jp/column/medicalrecord/implementation-cost/
- https://www.getfreed.ai/resources/best-emr-tools-for-small-practices

### クラスター G（人材）

- https://x.com/bizreach_pr/status/1980823537788284976
- https://x.com/luckyandash/status/1972610045725794513
- https://x.com/akanette23/status/1820148096904659413
- https://x.com/urahr_hongkong/status/1992054401650118828
- https://x.com/TraCom_info/status/1965609926593839559
- https://www.talent-clip.jp/media/3ways-to-reduce-the-workload
- https://hrbc.porters.jp/success/detail/id=655
- https://www.dodadsj.com/content/231019_chatgpt/
- https://edenred.jp/article/hr-recruiting/213/
- https://recruiteze.com/recruiting-software-too-expensive/

### クラスター H（教育）

- https://x.com/thomaschattwill/status/1825912456213897524
- https://x.com/wpri12/status/1981524039748239579
- https://x.com/MindTheVirt/status/1900518764782948657
- https://www.koukouseishinbun.jp/articles/-/2025/12/24/150000_2
- https://jichitai.works/article/details/429
- https://prtimes.jp/main/html/rd/p/000000266.000028308.html
- https://futurism.com/teachers-ai-grade-students
- https://patch.com/massachusetts/across-ma/mcas-ai-grading-error-tanks-student-essay-scores-across-hundreds-districts
- https://wagaco-ai.com/column/post-5128/
- https://www.ycombinator.com/companies/gradewiz

---

## 注意事項

- WebSearch + Grok API（search_mode: on）で取得した一次情報に基づく
- Grok API は X投稿の実URLを安定的に返さないため、WebSearchで取得した実URL + Grokのテーマ分析を組み合わせている
- エンゲージメント数は検索時点（2026-02-18）のスナップショットであり変動する
- 一部のURLはリンク切れの可能性あり（未確認）
- 市場規模の推定は公開データ + 類似ツールの価格帯からのざっくり計算。投資助言ではない
- 日本語圏は note.com の業界ブログが最も豊富な一次情報源。X投稿よりも詳細な課題記述が多い
