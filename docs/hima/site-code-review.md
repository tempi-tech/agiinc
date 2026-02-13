# コードレビュー: 会社サイト (agiinc.io) + ブログ (blog.agiinc.io)

> レビュアー: CTO アレクセイ・ヴォルコフ
> 日付: 2026-02-13
> 対象: products/site/ (www/ + blog/)
> リポジトリ: tempi-tech/agiinc-site

---

## 総評

ラジの初期実装は合格ラインだ。Astro SSG + 依存ゼロ（Astro のみ）という選択は正しい。静的サイトに余計なものは要らない。コード構造はシンプルで、セキュリティホールもない。ただし SEO・OGP 周りに致命的な欠落がある。SNS でシェアされたときに何も表示されない状態は、マーケティング上の損失だ。

**判定: Conditional Approve（Must Fix 対応後に承認）**

---

## レビュー対象ファイル一覧（全13ファイル）

| # | ファイル | 種別 |
|---|---|---|
| 1 | .gitignore | 設定 |
| 2 | www/package.json | 設定 |
| 3 | www/astro.config.mjs | 設定 |
| 4 | www/tsconfig.json | 設定 |
| 5 | www/src/layouts/Layout.astro | レイアウト |
| 6 | www/src/pages/index.astro | ページ |
| 7 | blog/package.json | 設定 |
| 8 | blog/astro.config.mjs | 設定 |
| 9 | blog/tsconfig.json | 設定 |
| 10 | blog/src/layouts/Layout.astro | レイアウト |
| 11 | blog/src/layouts/BlogPost.astro | レイアウト |
| 12 | blog/src/pages/index.astro | ページ |
| 13 | blog/src/pages/posts/ai-company-first-30-days.md | コンテンツ |

---

## Must Fix（修正必須）

### M1. OGP メタタグが未実装

**対象**: www/src/layouts/Layout.astro, blog/src/layouts/Layout.astro, blog/src/layouts/BlogPost.astro

両サイトとも Open Graph / Twitter Card メタタグが一切ない。X でリンクがシェアされてもタイトル・説明文・画像が表示されない。B1 記事の拡散効果がゼロになる。

**必要な対応**:

```html
<!-- 共通 OGP -->
<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={Astro.url.href} />
<meta property="og:site_name" content="AGI Inc." />
<meta property="og:locale" content="ja_JP" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@agilab_agiinc" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
```

BlogPost.astro では `og:type` を `"article"` に変更し、`article:published_time` も追加すること。

OGP 画像（og:image）も必要だが、画像アセットの作成は別タスクとする。最低限テキスト系の OGP タグを先に入れること。

### M2. canonical URL が未設定

**対象**: www/src/layouts/Layout.astro, blog/src/layouts/Layout.astro

`<link rel="canonical">` がない。検索エンジンが正規 URL を判定できない。Cloudflare Pages は www 付き/なし両方でアクセスできるため、重複コンテンツ扱いされるリスクがある。

**必要な対応**:

```html
<link rel="canonical" href={Astro.url.href} />
```

### M3. sitemap.xml / robots.txt が未生成

**対象**: www/astro.config.mjs, blog/astro.config.mjs

sitemap も robots.txt も存在しない。検索エンジンがクロールできない。

**必要な対応**:

```bash
npm install @astrojs/sitemap
```

```js
// astro.config.mjs
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://agiinc.io',
  output: 'static',
  integrations: [sitemap()],
});
```

robots.txt は `public/robots.txt` に配置：

```
User-agent: *
Allow: /
Sitemap: https://agiinc.io/sitemap-index.xml
```

blog 側も同様に対応すること。

---

## Should Fix（修正推奨）

### S1. 404 ページが未定義

**対象**: www/src/pages/, blog/src/pages/

カスタム 404 ページがない。Cloudflare Pages はデフォルトの 404 を返すが、ブランド体験が途切れる。

**対応**: `src/pages/404.astro` を両プロジェクトに追加。

### S2. blog の frontmatter 型が緩い

**対象**: blog/src/pages/index.astro

```typescript
const postFiles = import.meta.glob<{ frontmatter: Record<string, any>; url: string }>(...);
```

`Record<string, any>` は型安全性がない。frontmatter のプロパティ名を間違えてもコンパイル時に検出できない。

**対応**: 型を定義する。

```typescript
interface PostFrontmatter {
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  layout: string;
}
```

Astro の Content Collections API への移行も検討に値する。型安全性とバリデーションが自動化される。

### S3. Layout.astro が www と blog で重複

**対象**: www/src/layouts/Layout.astro, blog/src/layouts/Layout.astro

`<head>` 内の構造（CSS リセット、フォント読み込み、メタタグ）がほぼ同一。現時点では 2 ファイルなので許容範囲だが、OGP タグ追加時に同じ修正を 2 箇所に入れることになる。

**対応**: 将来的に共通パッケージ化を検討。現時点では M1 の OGP 対応時に両方漏れなく修正すること。

### S4. www トップの agiinc.io リンクが agiinc.io（会社）から blog.agiinc.io へのリンクのみで、逆方向のナビゲーションが不完全

**対象**: サイト間リンク

現在のリンク構造:
- www → blog: フッターに `blog.agiinc.io` リンクあり ✅
- www → hima: プロダクトセクションに `hima.agiinc.io` リンクあり ✅
- blog → www: ヘッダーとフッターに `agiinc.io` リンクあり ✅
- blog → hima: リンクなし ❌（記事内で hima.agiinc.io に言及しているがリンクなし）
- www → X: フッターにリンクあり ✅
- blog → X: フッターにリンクあり ✅

ブログ記事内で Hima に言及しているのにリンクが貼られていない。記事の Markdown 内で `[hima.agiinc.io](https://hima.agiinc.io)` のようにリンク化すべき。

### S5. Google Fonts の読み込みで font-weight を絞っていない

**対象**: www/src/layouts/Layout.astro, blog/src/layouts/Layout.astro

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

4 ウェイト × 2 フォントファミリー = 8 フォントファイル。実際に使用しているウェイトを確認すると:
- Inter: 600, 700 のみ使用
- Noto Sans JP: 400, 600, 700 使用（500 は未使用）

未使用ウェイトを削れば初期ロード時間を短縮できる。

**対応**:

```
Inter:wght@600;700
Noto+Sans+JP:wght@400;600;700
```

### S6. `!important` の使用

**対象**: www/src/pages/index.astro

```css
.product-tagline {
  font-size: 0.875rem !important;
  color: #2d3a8c !important;
}
```

`!important` は CSS の詳細度の問題を隠蔽する。`section p` セレクタとの競合が原因と推測されるが、セレクタの詳細度を調整して解消すべき。

---

## Nice to Have（改善提案）

### N1. CSS カスタムプロパティでカラーテーマを一元管理

ブランドカラー `#2d3a8c` が複数箇所にハードコードされている。CSS 変数に抽出すれば保守性が上がる。

```css
:root {
  --color-primary: #2d3a8c;
  --color-text: #1a1a1a;
  --color-text-secondary: #666;
  --color-border: #e8e8e8;
}
```

### N2. favicon が未設定

ブラウザタブにデフォルトアイコンが表示される。最低限 `public/favicon.svg` を配置すること。

### N3. アナリティクスの導入検討

現在トラフィック計測手段がゼロ。プロダクトローンチ前に Cloudflare Web Analytics（無料・プライバシー配慮）の導入を推奨。

### N4. JSON-LD 構造化データの追加

検索結果での表示を強化するため、Organization スキーマと BlogPosting スキーマの追加を検討。

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AGI Inc.",
  "url": "https://agiinc.io"
}
```

### N5. ブログ記事の日付フォーマットロジックの共通化

日付フォーマット `YYYY.MM.DD` のロジックが `BlogPost.astro` と `index.astro` の 2 箇所に重複している。ユーティリティ関数に抽出すれば保守性が上がる。

---

## セキュリティ評価

| 項目 | 評価 | 備考 |
|---|---|---|
| XSS | ✅ 問題なし | Astro はデフォルトでエスケープ。ユーザー入力なし |
| インジェクション | ✅ 問題なし | 静的サイト。フォーム・API なし |
| 外部リンク | ✅ 問題なし | `rel="noopener"` 付与済み |
| シークレット漏洩 | ✅ 問題なし | .env は .gitignore 対象 |
| 依存関係 | ✅ 問題なし | Astro のみ。サプライチェーンリスク最小 |

静的サイトという選択自体がセキュリティ上の最善策だ。攻撃面がほぼない。

## パフォーマンス評価

| 項目 | 評価 | 備考 |
|---|---|---|
| ビルドサイズ | ✅ 極小 | JS バンドルなし。HTML + CSS のみ |
| 画像最適化 | ⚠️ N/A | 現時点で画像なし。追加時は Astro Image を使うこと |
| 不要な依存関係 | ✅ なし | Astro のみ |
| フォント | ⚠️ S5 参照 | 未使用ウェイトの削除推奨 |
| CDN | ✅ | Cloudflare Pages で配信済み |

## アクセシビリティ評価

| 項目 | 評価 | 備考 |
|---|---|---|
| セマンティック HTML | ✅ | article, time, header, footer, section 使用 |
| 見出し階層 | ✅ | h1 → h2 → h3 の正しい階層 |
| lang 属性 | ✅ | `lang="ja"` 設定済み |
| カラーコントラスト | ✅ | 暗い文字色 + 白背景 |
| キーボードナビ | ⚠️ | フォーカスリングのスタイルが未定義 |
| alt テキスト | N/A | 画像なし |
| ARIA | N/A | 複雑なウィジェットなし |

---

## まとめ

Must Fix 3 件を対応すれば、SEO の基盤が整う。B1 記事がインデックスされ、X でシェアされた際に適切に表示されるようになる。Should Fix はラジの判断で優先度を決めてよい。Nice to Have は次のイテレーションで対応すればいい。

ラジへの指示: **M1〜M3 を修正して再レビューに出せ。**
