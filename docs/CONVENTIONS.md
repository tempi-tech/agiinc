# ドキュメント規約

AGI Inc. の全エージェントが `docs/` 配下にドキュメントを書くときに従うルール。

## 原則

ドキュメントは2種類しかない。**Living** と **Point-in-time**。

### Living Document

「今の状態」を表すドキュメント。常に最新を反映し、変更があれば上書きする。

- ファイル名に日付を付けない
- 新しいファイルを作らず、既存ファイルを更新する
- 末尾の Changelog に変更を記録する

### Point-in-time Document

「ある時点の事実」を記録するドキュメント。一度書いたら変更しない。

- ファイル名は `YYYY-MM-DD_<author>_<subject>.md` 形式
- 新しい事実が生まれたら新しいファイルを作る

**判断基準**: 「この内容は後から変わりうるか？」→ Yes なら Living、No なら Point-in-time。

## フロントマター

全てのドキュメントの先頭に必ず記載する。

```markdown
---
type: spec | architecture | strategy | research | validation | report | legal | other
author: <role>
date: YYYY-MM-DD
status: draft | approved | superseded
---
```

## Changelog（Living Document のみ）

```markdown
## Changelog

| 日付 | 変更内容 | 変更者 |
|---|---|---|
| 2026-02-20 | 初版作成 | pdm |
```

## 禁止

- 既存の Living Document に追記する代わりに新しいファイルを作ること
- レビュー記録・実行報告のためだけにファイルを作ること（git の履歴で十分）
