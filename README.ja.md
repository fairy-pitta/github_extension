# GitHub Dashboard

GitHub.comを開いた時にダッシュボードを表示するChrome拡張機能です。GitHubのアクティビティ（プルリクエスト、イシュー、最近更新されたリポジトリなど）を表示します。

## リポジトリ

GitHub Repository: https://github.com/fairy-pitta/github_extension.git

## 機能

- **プルリクエスト**: 自分が作成したPRとレビューが必要なPRを表示
- **イシュー**: 関与しているイシューを表示
- **リポジトリ**: 最近更新されたリポジトリ（組織リポジトリを含む）を閲覧
- **クリーンアーキテクチャ**: 保守性の高いクリーンアーキテクチャの原則に基づいて構築
- **キャッシング**: API呼び出しを減らし、パフォーマンスを向上させるスマートキャッシング

## アーキテクチャ

このプロジェクトは、以下のレイヤーでクリーンアーキテクチャの原則に従っています：

- **ドメインレイヤー**: ビジネスロジック、エンティティ、ユースケース
- **アプリケーションレイヤー**: サービスとアプリケーション固有のロジック
- **インフラストラクチャレイヤー**: 外部依存関係（GitHub API、Chrome Storage、キャッシュ）
- **プレゼンテーションレイヤー**: UIコンポーネント（新規タブページ、オプションページ）

## 開発フェーズ

プロジェクトは5つのフェーズに分かれています：

- **Phase 0**: プロジェクト初期化とアーキテクチャセットアップ
- **Phase 1**: ドメインレイヤーとエンティティ定義
- **Phase 2**: インフラストラクチャレイヤーの実装
- **Phase 3**: アプリケーションレイヤーとオプションページ
- **Phase 4**: ダッシュボードUIの実装
- **Phase 5**: 最適化、テスト、最終調整

詳細な実装計画については、個別の `phase*-plan.md` ファイルを参照してください。

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

1. 拡張機能のオプションページを開く
2. GitHub Personal Access Token (PAT) を入力
3. トークンは検証され、安全に保存されます

### 必要なPAT権限

- `repo` (プライベートリポジトリ用)
- `read:org` (組織リポジトリ用)
- `read:user` (ユーザー情報用)

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


