# Hima 正式検証チェックシート（W12 / 2026-03-22）

- 作成日: 2026-02-15
- 対象: I-01〜I-04 正式検証
- スコープ: `hima.agiinc.io` / `api-hima.agiinc.io` / `agiinc.io` / `blog.agiinc.io`
- 前提: 4サービスは全てデプロイ済み。CTO回帰検証 PASS（api-hima: CORS修正を含む）
- 参照: `plans/weekly/2026-W12.md`, `docs/hima/infra-verification-checklist.md`, `docs/hima/launch-checklist.md`

---

## 共通記録テンプレート（3/22実施時）

- 検証日: `2026-03-22`
- 実施開始: `____:____ JST`
- 実施終了: `____:____ JST`
- 担当: `____`
- 同席者: `____`
- 使用ブラウザ: `____`
- 実行端末: `____`
- ネットワーク環境: `____`
- 環境/リージョン: `____`
- 補足: DNS/Cloudflareキャッシュクリア実施有無 `____`

| 区分 | 担当 | 開始時刻 | 終了時刻 | ステータス | 証跡(スクショ/ログ/コマンド出力) |
|---|---|---|---|---|---|
| I-01 | `CTO / Engineer` |  |  | 未実施 |  |
| I-02 | `CTO / Engineer` |  |  | 未実施 |  |
| I-03 | `CTO / CMO` |  |  | 未実施 |  |
| I-04 | `CTO / CMO` |  |  | 未実施 |  |
| 総合判定 |  |  |  | 未実施 |  |

---

## I-01 `hima.agiinc.io` 稼働確認

### 1. HTTPS / HSTS / メイン導線（`/`, `/app`）

**手順**
1. `curl -I https://hima.agiinc.io/`
2. `curl -I -L https://hima.agiinc.io/`
3. `curl -I https://hima.agiinc.io/app`
4. `curl -sI -L https://hima.agiinc.io/app | rg -i "http/|location|strict-transport-security|content-security-policy|content-type"`
5. 主要導線リンク（ヘッダー/ボタン）を目視で確認し、`/` と `/app` の表示切替が機能することを確認

**期待結果**
- `200`（またはリダイレクト後 `200`）で到達
- `hsts`ヘッダ（または `strict-transport-security`）が付与
- `/` と `/app` のいずれも正常表示（空白ページ/500なし）

**合否基準**
- PASS: すべて成立
- FAIL: HTTPS 失敗、500、または HSTS 未付与、主要導線 404

### 2. APIキー未設定時ガード表示

**手順**
1. `hima.agiinc.io` を新規プライベート/シークレットウィンドウで開く
2. ローカル保存情報を消去: `localStorage` と `sessionStorage` のキー情報を削除
3. トップページと `/app` のガード表示を目視確認
   - APIキー未設定時に編集・実行がブロックされること
   - 警告文と導線（APIキー設定画面）を目視で確認
4. 可能なら UI のコンソールで `localStorage` 追加/削除を再試行し、状態遷移を確認

**期待結果**
- APIキー未設定状態で実行処理が起動しない
- ガード（警告/説明文）が表示され、APIキー入力導線が見える

**合否基準**
- PASS: 未設定時ガードが安定して表示
- FAIL: 未設定でも実行に進める、またはガード未表示

### 3. バッチ処理UIの起動・終了状態

**手順**
1. APIキー入力可能状態にし、簡易入力データでバッチ起動
2. 実行中に以下を観測
   - 開始状態: 実行中インジケータ/進捗表示の点灯
   - 中間状態: 件数/進捗バー/キャンセル可否の変化
   - 終了状態: 成功/失敗行の集計表示、再実行または新規実行準備状態
3. 画面上で `RUNNING`→`COMPLETED`（または明確なエラー）に移ることを確認
4. 再実行を一度実施し、終了状態から復帰可能を確認

**期待結果**
- バッチ起動の操作が即時反映
- 実行中から終了状態への遷移が UI に反映
- 終了後に新規実行が可能

**合否基準**
- PASS: 起動～終了状態まで遷移可視化される
- FAIL: 停滞状態、終了状態が表示されない、再実行不可

---

## I-02 `api-hima.agiinc.io` 稼働確認

### 1. 健全性エンドポイント応答（`GET /`）

**手順**
1. `curl -i -s https://api-hima.agiinc.io/`
2. レスポンスヘッダとステータス確認
3. `curl -i -s https://api-hima.agiinc.io/health`（未提供の場合は404許容として確認）

**期待結果**
- `200/400/403/404`など稼働を示す応答が返る
- エッジレベルで接続拒否/タイムアウトがない

**合否基準**
- PASS: 到達し、意図した範囲ステータス
- FAIL: タイムアウト、接続拒否、DNS不成立

### 2. CORS（許可/非許可 Origin）

**許可Origin**

```
curl -i -s -X OPTIONS https://api-hima.agiinc.io/ \
  -H 'Origin: https://hima.agiinc.io' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: content-type,authorization,x-api-key'
```

**非許可Origin**

```
curl -i -s -X OPTIONS https://api-hima.agiinc.io/ \
  -H 'Origin: https://evil-example.invalid' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: content-type,authorization,x-api-key'
```

**期待結果**
- 許可Origin時: `access-control-allow-origin: https://hima.agiinc.io`（または同等）
- 非許可Origin時: CORS許可ヘッダなし、または拒否ステータス

**合否基準**
- PASS: Origin制御が意図どおり
- FAIL: 非許可Originにも許可ヘッダが付与

### 3. 3プロバイダ中継経路の疎通

**前提**: APIキー未設定でも、プロキシ経路到達は確認対象。認証エラー 401/400 は許容

#### OpenAI

```
curl -i -s -X POST https://api-hima.agiinc.io/https://api.openai.com/v1/chat/completions \
  -H 'Origin: https://hima.agiinc.io' \
  -H 'Content-Type: application/json' \
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"ping"}]}'
```

#### Anthropic

```
curl -i -s -X POST https://api-hima.agiinc.io/https://api.anthropic.com/v1/messages \
  -H 'Origin: https://hima.agiinc.io' \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: test' \
  -d '{"model":"claude-3-5-sonnet-20241022","max_tokens":16,"messages":[{"role":"user","content":"ping"}]}'
```

#### Google

```
curl -i -s -X POST https://api-hima.agiinc.io/https://generativelanguage.googleapis.com/v1beta/models \
  -H 'Origin: https://hima.agiinc.io' \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"ping"}]}]}'
```

**期待結果**
- 3経路ともレスポンス本文がJSON構造（またはJSONエラー）
- 到達性を示す `4xx/5xx` 内部応答は可。`503/0`連打、接続断不可

**合否基準**
- PASS: 3プロバイダで中継到達を示す応答あり
- FAIL: 1系統でも 5xx 連鎖/接続断/HTMLエラー

---

## I-03 `agiinc.io` 稼働確認

### 1. トップ表示と主要導線リンクの有効性

**手順**
1. `curl -I -L https://agiinc.io/`
2. `curl -s https://agiinc.io/ | sed -n '1,220p'` でトップ文言を確認
3. トップ主要導線（LP、ログイン、hima、blog）を目視 + リンク遷移確認

**期待結果**
- トップが表示され、主要リンクがリンク先へ遷移
- リンク未設定/404なし

**合否基準**
- PASS: 主要導線がすべて稼働
- FAIL: トップ不可、導線の 404、想定外遷移

### 2. `hima.agiinc.io` / `blog.agiinc.io` へのリンク遷移

**手順**
1. トップ画面から `hima.agiinc.io` へのリンクをクリック
2. トップ画面から `blog.agiinc.io` へのリンクをクリック
3. 戻りリンクでもトップへ遷移

**期待結果**
- いずれも 2 秒以内に遷移開始し、到達時に正常表示

**合否基準**
- PASS: クリック遷移成功
- FAIL: 遷移不能、無限リダイレクト

### 3. メタ情報の確認

**手順**
1. `curl -s https://agiinc.io/ | rg -n "<title|meta name=\"description\"|og:title|og:description|og:image|twitter:card|canonical|rel=\"canonical\""`

**期待結果**
- `title` / `description` / OGP が適切に設定
- canonical が正規URLを指す

**合否基準**
- PASS: 主要メタ3系統（title, description, OGP）が揃う
- FAIL: 欠損または誤値

---

## I-04 `blog.agiinc.io` 稼働確認

### 0. 前提URL

```bash
export B1_URL="https://blog.agiinc.io/posts/ai-copy-paste-hell/"
export B4_URL="https://blog.agiinc.io/posts/ai-company-first-30-days/"
# 当日公開slugが変わっていれば上記を置換して実施
```

### 1. B1/B4 記事本文表示

**手順**
1. `curl -I $B1_URL`
2. `curl -I $B4_URL`
3. `curl -s $B1_URL | rg -n "<article|<main|h1|本文|本文表示|hima\.agiinc\.io|agiinc\.io"`
4. `curl -s $B4_URL | rg -n "<article|<main|h1|本文|hima\.agiinc\.io|agiinc\.io|OGP"`
5. ブラウザで B1/B4 を開き、本文レンダリングが崩れていないことを目視確認

**期待結果**
- B1/B4 の双方が `200` または trailing slash 正規化を含む正常応答
- タイトル・本文・h1構造が正常表示

**合否基準**
- PASS: 2記事とも本文表示 OK
- FAIL: 404/5xx、本文欠落

### 2. OGP / 画像表示

**手順**
1. `curl -s $B1_URL | rg -n "og:title|og:description|og:image|twitter:card|rel=\"canonical\""`
2. `curl -s $B4_URL | rg -n "og:title|og:description|og:image|twitter:card|rel=\"canonical\""`
3. 取得した `og:image` URL を `curl -I` で取得確認
4. ブラウザで `og:image` が画像として取得されることを目視確認

**期待結果**
- OGP タグが本文と一致している
- OGP画像が 200 で取得可能

**合否基準**
- PASS: OGP情報・画像取得とも成立
- FAIL: `og:image`欠落、画像404

### 3. サイト内リンク有効性

**手順**
1. `curl -s $B1_URL | rg -o 'href="[^"]+"' | head -n 80`
2. `curl -s $B4_URL | rg -o 'href="[^"]+"' | head -n 80`
3. `hima.agiinc.io`, `agiinc.io`, 他記事、カテゴリへの代表リンクを手動遷移し 200 を確認

**期待結果**
- サイト内主要リンクが有効（404/500なし）
- LP/会社サイト導線が両記事内で確認できる

**合否基準**
- PASS: 主要リンクはOK、代表導線すべて成立
- FAIL: 404や意図しない空リンクが検出

---

## 3/22 実施順序とタイムライン（JST）

1. 09:30–09:45 共通事前確認（環境情報記録、ブラウザ起動、証跡保存先の確認）
2. 09:45–10:25 I-01（`hima.agiinc.io`）
3. 10:25–10:55 I-02（`api-hima.agiinc.io`）
4. 10:55–11:20 I-03（`agiinc.io`）
5. 11:20–11:50 I-04（`blog.agiinc.io`）
6. 11:50–12:10 目視結果の突合（証跡ファイル名を紐付け）
7. 12:10–12:30 Go/No-Go入力、翌日報告用素材化

---

## Go/No-Go 判定入力（Green / Yellow / Red）

- **Green**: 重要不具合ゼロ。即日GO可能。
- **Yellow**: 軽微不具合あり。影響が限定的で当日運用回避策がある場合。
- **Red**: 主要機能停止または対外提供不能。No-Go。

### 判定フォーマット

- `I-01: Green | Yellow | Red`（理由）
- `I-02: Green | Yellow | Red`（理由）
- `I-03: Green | Yellow | Red`（理由）
- `I-04: Green | Yellow | Red`（理由）
- `総合判定: Go / No-Go（要約）`

### 総合入力例

- `Green / 3件Green, 1件Yellow（I-03） / 公開許容` 
- `Red / I-02=Red（CORS/Provider 中継不成立） / No-Go`
