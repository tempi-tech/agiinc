# Remotion プロトタイプ コードレビュー

> CTO アレクセイ・ヴォルコフ | 2026-02-15 | 対象: `products/hima/demo-video/`

---

## 1. 総合判定: APPROVE（軽微指摘あり）

プロトタイプとして十分な品質。コンポーネント分割は適切、Remotion API の使い方も正しい。ドライランレポートで指摘されていたクロスフェード未実装・カスタムフォント未適用は両方とも修正済み。本制作に進んで問題ない。

以下の指摘は本制作時に対処すること。

---

## 2. 指摘事項

### 2-1. Brand 型の重複定義（優先度: 中）

`Brand` 型が 5 ファイルで個別に定義されている:

- `src/components/HimaWorkspace.tsx:4-12`
- `src/scenes/SceneRecipe.tsx:4-12`
- `src/scenes/SceneCsvImport.tsx:10-18`
- `src/scenes/SceneBatchExec.tsx:4-12`
- `src/scenes/SceneExport.tsx:4-12`

**対処**: `src/types.ts` に一箇所で定義し、全ファイルから import する。

### 2-2. PRODUCTS / GENERATED_TEXTS の重複（優先度: 中）

`SceneBatchExec.tsx` と `SceneExport.tsx` が同一の商品名配列・生成テキスト配列を個別に持っている。SceneExport は 10 件全文、SceneBatchExec は 5 件。

**対処**: `src/data.ts` に統合する。SceneBatchExec は先頭 5 件を参照すればよい。

### 2-3. AbsoluteFill の不統一（優先度: 低）

`SceneCsvImport` のみ `AbsoluteFill` でラップしている（CSV アイコンオーバーレイのため）。他 3 シーンはラップなし。動作に問題はないが、全シーンを統一すると保守性が上がる。

### 2-4. package.json の不備（優先度: 中）

```json
"main": "index.js"       // Remotion では不要。削除可
"description": ""         // 空文字
"author": ""              // 空文字
"scripts": { "test": ... } // Remotion CLI スクリプトがない
```

**対処**: 以下を追加する:
```json
"scripts": {
  "dev": "remotion studio",
  "render": "remotion render demo-lp --output output/demo-lp.webm",
  "render:dryrun": "remotion render demo-lp-dryrun --output output/dryrun.webm"
}
```

### 2-5. マジックナンバー（優先度: 低）

`DemoGifLP.tsx` のシーン尺（66, 82, 98, 48）は計算コメントで説明されており可読性は確保されている。本制作でシーン数や尺を変更する際に定数化を検討すること。

### 2-6. Array index を key に使用（優先度: 低）

`HimaWorkspace.tsx:400` の `results.map((r, i) => <React.Fragment key={i}>` は append-only のリストなので実害はない。ただし `HighlightedPrompt` の `parts.map((part, i) => ... key={i})` も同様。安定した key があればそちらを使うべき。

---

## 3. 良い点

- **TypeScript strict モード有効**。tsconfig.json で `"strict": true`
- **コンポーネント分割が適切**。Root → DemoGifLP → Scene*4 → HimaWorkspace の階層が明快
- **`@remotion/google-fonts`** で Inter / Noto Sans JP / JetBrains Mono を正しくロード済み（`src/fonts.ts`）
- **`@remotion/transitions` の `TransitionSeries` + `fade()`** でクロスフェードを実装済み。ドライランレポートの高優先指摘 2 件（クロスフェード・フォント）が解消されている
- **`BRAND` オブジェクトに `as const`** を適用し、色値の不変性を保証
- **`interpolate` + `Easing`** の使い方が Remotion のベストプラクティスに準拠。`extrapolateRight: "clamp"` を全箇所で適用
- **SVG カーソル** が軽量かつ鮮明。`filter: drop-shadow` で背景との分離も良好
- **Composition 定義**（Root.tsx）が `demo-lp` / `demo-lp-dryrun` の 2 構成で明確

## 4. パフォーマンス

- 不要な再レンダリング: 検出されず。各シーンは `useCurrentFrame()` + `useVideoConfig()` のみに依存し、フレーム単位で確定的な出力を返す
- メモリリーク: なし。`useEffect` / `useRef` を使っていないため副作用がない
- レンダリングサイズ: ドライランレポートで GIF 668KB / WebM 557KB と報告。仕様上限の 15% 以下で問題なし

## 5. セキュリティ

- シークレットなし。API キーやトークンは含まれていない
- 外部リソースへのアクセスなし（フォントは `@remotion/google-fonts` がビルド時にバンドル）

---

## 6. 結論

本制作移行を **承認** する。2-1（Brand 型統合）と 2-2（データ統合）は本制作の初期段階で対処すること。2-4（package.json スクリプト追加）は即座に対処可能。
