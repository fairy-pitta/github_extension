# GitHub Pages セットアップ手順

このドキュメントでは、GitHub Pagesでプライバシーポリシーを公開する手順を説明します。

## 前提条件

- GitHubリポジトリへのアクセス権限
- リポジトリの管理者権限

## セットアップ手順

### 1. ファイルの準備

以下のファイルが`docs`フォルダに配置されています：

- `docs/privacy-policy.md` - 英語版プライバシーポリシー
- `docs/privacy-policy-ja.md` - 日本語版プライバシーポリシー
- `docs/_config.yml` - Jekyll設定ファイル
- `docs/index.md` - トップページ

### 2. GitHubリポジトリの設定

1. GitHubリポジトリのページに移動
2. **Settings**タブをクリック
3. 左サイドバーから**Pages**を選択
4. **Source**セクションで：
   - **Deploy from a branch**を選択
   - **Branch**で`main`（または`master`）を選択
   - **Folder**で`/docs`を選択
5. **Save**をクリック

### 3. 公開URLの確認

設定後、数分でGitHub Pagesが公開されます。URLは以下の形式になります：

```
https://[ユーザー名].github.io/[リポジトリ名]/
```

例：
- `https://fairy-pitta.github.io/github_extension/`
- プライバシーポリシー: `https://fairy-pitta.github.io/github_extension/privacy-policy.html`
- 日本語版: `https://fairy-pitta.github.io/github_extension/privacy-policy-ja.html`

### 4. Chrome Web Storeでの使用

Chrome Web Storeの提出フォームで、プライバシーポリシーのURLとして以下を入力：

```
https://[ユーザー名].github.io/[リポジトリ名]/privacy-policy.html
```

## カスタムドメイン（オプション）

カスタムドメインを使用する場合：

1. `docs/CNAME`ファイルを作成
2. ドメイン名を記入（例: `privacy.yourdomain.com`）
3. DNS設定でCNAMEレコードを設定

## トラブルシューティング

### ページが表示されない

- 設定後、数分待ってから再度アクセス
- GitHub Actionsのタブでビルドエラーがないか確認
- `_config.yml`の設定が正しいか確認

### Jekyllテーマが適用されない

- `_config.yml`でテーマが正しく指定されているか確認
- GitHub PagesがJekyllテーマをサポートしているか確認

### 404エラー

- ファイル名が正しいか確認（`privacy-policy.md` → `privacy-policy.html`）
- ファイルが`docs`フォルダに正しく配置されているか確認

## 更新方法

プライバシーポリシーを更新する場合：

1. `docs/privacy-policy.md`または`docs/privacy-policy-ja.md`を編集
2. 変更をコミット・プッシュ
3. 数分後にGitHub Pagesが自動的に更新されます

## 参考リンク

- [GitHub Pages公式ドキュメント](https://docs.github.com/en/pages)
- [Jekyll公式ドキュメント](https://jekyllrb.com/docs/)
