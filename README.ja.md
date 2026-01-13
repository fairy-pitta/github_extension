# GitHub Dashboard

GitHub.comを開いた時にダッシュボードを表示するChrome拡張機能です。GitHubのアクティビティ（プルリクエスト、イシュー、最近更新されたリポジトリなど）を統合されたダッシュボードとして表示します。

![GitHub Dashboard - Light Theme](public/screenshots-store/screenshot_1_1280x800.jpg)

## リポジトリ

GitHub Repository: https://github.com/fairy-pitta/github_extension.git

## 機能

### 📊 統合されたアクティビティ概要

リポジトリや組織間を移動する必要はありません。GitHub Dashboardは、GitHub.comに直接表示される美しいダッシュボードに、すべてのGitHubアクティビティを統合します。

![GitHub Dashboard - Dark Theme](public/screenshots-store/screenshot_2_1280x800.jpg)

### 🔀 プルリクエスト管理

- **作成したPR**: 任意のリポジトリで作成したすべてのプルリクエストを追跡
- **レビュー依頼**: どのリポジトリにあるかに関わらず、レビューが必要なPRを見逃しません
- **レビュー済みPR**: レビュー済みのPRを明確な視覚的インジケーターで追跡
- **スマートフィルタリング**: レビュー状況でフィルタリング（承認済み、変更要求、コメント済みなど）
- **レビュー統計**: 一目でレビュー数とステータスを確認

### 🐛 イシュー追跡

すべてのリポジトリと組織にわたって関与しているすべてのイシューを表示します。複数のリポジトリページを切り替えてイシューを確認する必要はありません。すべてが1つの場所にあります。

![GitHub Dashboard - Light Blue Theme](public/screenshots-store/screenshot_3_1280x800.jpg)

### 📁 リポジトリ管理

- **すべてのリポジトリ**: すべてのソースから最近更新されたリポジトリを閲覧
- **組織リポジトリ**: 組織リポジトリ専用ビュー
- **個人リポジトリ**: 個人リポジトリへのクイックアクセス
- **お気に入りリポジトリ**: よく使うリポジトリをスターして即座にアクセス
- **自動更新**: タブを切り替えると自動的にリポジトリを読み込み

### 📈 アクティビティ統計

包括的な統計でGitHubアクティビティの洞察を得られます：
- **週次・月次比較**: 週間・月間のアクティビティを比較
- **コミット追跡**: すべてのリポジトリにわたるコミットアクティビティを監視
- **PR・レビューメトリクス**: 作成したプルリクエストと完了したレビューを追跡
- **イシューアクティビティ**: 関与しているイシューを監視
- **コメントアクティビティ**: コメントの貢献を確認

![GitHub Dashboard - Statistics](public/screenshots-store/screenshot_4_1280x800.jpg)

### 🎨 美しくカスタマイズ可能なインターフェース

- **複数のテーマ**: ライト、ダーク、カラフルなテーマから選択
- **レスポンシブデザイン**: すべての画面サイズで完璧に動作
- **クリーンなUI**: GitHubの体験を乱さないモダンで直感的なインターフェース
- **高速パフォーマンス**: スマートキャッシングによりAPI呼び出しを削減し、読み込み時間を改善

### 🔒 セキュアな認証

- **OAuthサポート**: GitHubのDevice Flowを使用したセキュアなOAuth認証（推奨）
- **手動トークンオプション**: 細かい制御を希望する場合はPersonal Access Tokenをサポート
- **読み取り専用アクセス**: 拡張機能は読み取り操作のみを実行し、データは変更されません

## インストール

1. [Chrome Web Store](https://chrome.google.com/webstore)から拡張機能をインストール（近日公開予定）
2. または手動で読み込む：
   - このリポジトリをクローン
   - `npm install && npm run build` を実行
   - Chromeで `dist` ディレクトリをパッケージ化されていない拡張機能として読み込む

## セットアップ

### 前提条件

- Node.js 18+ と npm/yarn
- Chromeブラウザ（テスト用）

### インストール

1. リポジトリをクローン：
```bash
git clone https://github.com/fairy-pitta/github_extension.git
cd github_extension
```

2. 依存関係をインストール：
```bash
npm install
```

3. 拡張機能をビルド：
```bash
npm run build
```

4. Chromeに拡張機能を読み込む：
   - Chromeを開いて `chrome://extensions/` に移動
   - 「デベロッパーモード」を有効化
   - 「パッケージ化されていない拡張機能を読み込む」をクリック
   - `dist` ディレクトリを選択

### 開発

```bash
# ウォッチモードで開発
npm run dev

# テストを実行
npm test

# リンターを実行
npm run lint

# コードをフォーマット
npm run format
```

## 設定

### OAuth認証（推奨）

拡張機能はGitHub OAuth Device Flowを使用したOAuth認証をサポートしています。これは推奨される最も安全な方法です。

**OAuthを使用する場合：**
1. 拡張機能の設定ページを開く（ダッシュボードの設定アイコンをクリック）
2. 「Sign in with GitHub」ボタンをクリック
3. 提供されたコードを使用してGitHubで認証を完了
4. 拡張機能が自動的にアクセストークンを取得して保存します

**OAuthの利点：**
- 手動でトークンを入力するよりも安全
- Personal Access Tokenを手動で作成・管理する必要がない
- 標準的な認証フロー
- 自動トークン管理

### 手動トークン入力（代替方法）

Personal Access Token (PAT) を使用する場合：

1. 拡張機能の設定ページを開く
2. 「Manual Token Input」をクリックしてセクションを展開
3. [GitHub Settings](https://github.com/settings/tokens/new)でPersonal Access Tokenを作成
4. トークンを入力して保存

### 必要なPAT権限（読み取り専用）

- `repo` (プライベートリポジトリ用 - 読み取り専用、この拡張機能は書き込み操作を実行しません)
- `read:org` (組織リポジトリ用)
- `read:user` (ユーザー情報用)

**注意:** `repo`スコープは技術的には読み書きアクセスを許可しますが、この拡張機能は読み取り専用操作にのみ使用します。GitHub OAuth Appはプライベートリポジトリ用の読み取り専用スコープを提供していません。

## プロジェクト構造

```
src/
├── domain/              # ドメインレイヤー
│   ├── entities/       # エンティティ
│   ├── repositories/   # リポジトリインターフェース
│   └── usecases/       # ユースケース
├── application/        # アプリケーションレイヤー
│   ├── services/       # サービス
│   └── di/             # 依存性注入
├── infrastructure/     # インフラストラクチャレイヤー
│   ├── api/            # GitHub APIクライアント
│   ├── storage/        # Chrome Storage
│   └── cache/          # キャッシュ実装
└── presentation/       # プレゼンテーションレイヤー
    ├── dashboard/      # ダッシュボードページ
    ├── options/        # オプションページ
    └── components/     # 共有コンポーネント
```

## アーキテクチャ

このプロジェクトは、明確な関心の分離を持つクリーンアーキテクチャの原則に従っています：

- **ドメインレイヤー**: ビジネスロジック、エンティティ、ユースケース（依存関係なし）
- **アプリケーションレイヤー**: サービスとアプリケーション固有のロジック（ドメインのみに依存）
- **インフラストラクチャレイヤー**: 外部依存関係（GitHub API、Chrome Storage、キャッシュ）
- **プレゼンテーションレイヤー**: UIコンポーネント（Reactコンポーネント）

## テスト

```bash
# すべてのテストを実行
npm test

# ウォッチモードでテストを実行
npm test:watch

# カバレッジ付きでテストを実行
npm test:coverage
```

## ビルド

```bash
# 本番ビルド
npm run build

# ビルド出力は `dist` ディレクトリに生成されます
```

## 貢献

1. リポジトリをフォーク
2. 機能ブランチを作成
3. 変更を加える
4. 新機能のテストを追加
5. すべてのテストがパスすることを確認
6. プルリクエストを提出

## ライセンス

MIT License

## 謝辞

以下を使用して構築：
- TypeScript
- React
- Vite
- Vitest
- クリーンアーキテクチャの原則
