# Chrome拡張機能のセットアップ手順

実際にChrome拡張機能を動作させるための手順です。

## 1. 依存関係のインストール

ターミナルでプロジェクトディレクトリに移動して、以下を実行してください：

```bash
cd /Users/shuna/github-expansion
npm install
```

## 2. ビルド

拡張機能をビルドします：

```bash
npm run build
```

ビルドが成功すると、`dist` ディレクトリに拡張機能のファイルが生成されます。

## 3. Chromeに拡張機能を読み込む

1. **Chromeを開く**
2. **拡張機能ページを開く**
   - アドレスバーに `chrome://extensions/` と入力してEnter
   - または、メニュー → その他のツール → 拡張機能
3. **デベロッパーモードを有効化**
   - ページ右上の「デベロッパーモード」トグルをONにする
4. **拡張機能を読み込む**
   - 「パッケージ化されていない拡張機能を読み込む」ボタンをクリック
   - `dist` ディレクトリを選択
   - `/Users/shuna/github-expansion/dist` を選択

## 4. 拡張機能の設定

1. **新しいタブを開く**
   - 新しいタブを開くと、GitHub Dashboardが表示されます
   - 最初は認証が必要なので、設定画面が表示されます
2. **Personal Access Tokenを設定**
   - 拡張機能のアイコンをクリック → 「オプション」を選択
   - または、`chrome://extensions/` で拡張機能の「詳細」→「拡張機能のオプション」
   - GitHub Personal Access Tokenを入力して保存

### GitHub Personal Access Tokenの取得方法

1. GitHubにログイン
2. Settings → Developer settings → Personal access tokens → Tokens (classic)
3. 「Generate new token (classic)」をクリック
4. 必要な権限を選択：
   - `repo` (プライベートリポジトリへのアクセス)
   - `read:org` (組織リポジトリへのアクセス)
   - `read:user` (ユーザー情報の読み取り)
5. トークンを生成してコピー
6. 拡張機能のオプションページに貼り付けて保存

## 5. 動作確認

- 新しいタブを開くと、GitHub Dashboardが表示されます
- 以下の情報が表示されます：
  - **Pull Requests (Created by Me)**: 自分が作成したPR
  - **Pull Requests (Review Requested)**: レビュー依頼されたPR
  - **Issues (Involved)**: 関与しているIssue
  - **Recently Updated Repositories**: 最近更新されたリポジトリ

## 開発モード（ホットリロード）

コードを変更しながら開発する場合：

```bash
npm run dev
```

このコマンドはファイルの変更を監視し、自動的に再ビルドします。
Chrome拡張機能のページで「再読み込み」ボタンをクリックすると、変更が反映されます。

## トラブルシューティング

### ビルドエラーが発生する場合

```bash
# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 拡張機能が読み込めない場合

- `dist` ディレクトリが正しく生成されているか確認
- `dist/manifest.json` が存在するか確認
- Chromeのコンソール（F12）でエラーを確認

### データが表示されない場合

- Personal Access Tokenが正しく設定されているか確認
- トークンに必要な権限（`repo`, `read:org`, `read:user`）があるか確認
- ブラウザのコンソール（F12）でエラーメッセージを確認

## 便利な機能

- **リフレッシュ**: ヘッダーのリフレッシュボタンをクリック、または `r` キーを押す
- **フィルター**: 「All」と「Open Only」を切り替え可能
- **設定**: ヘッダーの⚙️ボタンから設定ページにアクセス


