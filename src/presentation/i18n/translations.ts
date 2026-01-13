export type Language = 'en' | 'ja';

export interface Translations {
  // Header
  dashboardTitle: string;
  dashboardTitleTemplate: string;
  refresh: string;
  refreshing: string;
  settings: string;
  revertToGitHub: string;
  
  // Filter
  all: string;
  openOnly: string;
  filterByReviewStatus: string;
  allReviews: string;
  approvedOnly: string;
  commentedOnly: string;
  changesRequestedOnly: string;
  reviewRequiredOnly: string;
  dismissedOnly: string;
  pendingOnly: string;
  // Review status
  reviewApproved: string;
  reviewCommented: string;
  reviewChangesRequested: string;
  reviewDismissed: string;
  reviewPending: string;
  
  // Sections
  repositories: string;
  recentlyUpdatedRepositories: string;
  allRepositories: string;
  organizationRepositories: string;
  myRepositories: string;
  favoriteRepositories: string;
  pullRequestsCreated: string;
  pullRequestsReviewRequested: string;
  pullRequestsReviewed: string;
  issuesInvolved: string;
  
  // Common
  loading: string;
  loadMore: string;
  noData: string;
  noPullRequests: string;
  noPullRequestsReview: string;
  noPullRequestsReviewed: string;
  noIssues: string;
  noRepositories: string;
  
  // Auth
  githubExtension: string;
  configureToken: string;
  openSettings: string;
  createPATInstructions: string;
  createPATLink: string;
  requiredPermissions: string;
  signInWithGitHub: string;
  oauthAuthenticating: string;
  oauthError: string;
  oauthSuccess: string;
  oauthCanceled: string;
  oauthInstructions: string;
  oauthDeviceFlowTitle: string;
  oauthDeviceFlowCodeLabel: string;
  oauthDeviceFlowCopy: string;
  oauthDeviceFlowCopied: string;
  oauthDeviceFlowCopyFailed: string;
  oauthDeviceFlowOpenLabel: string;
  oauthDeviceFlowWaiting: string;
  manualTokenInput: string;
  authInfoTitle: string;
  authInfoWritePermissions: string;
  authInfoOAuthVsPAT: string;
  
  // Options
  settingsTitle: string;
  settingsDescription: string;
  tokenLabel: string;
  tokenPlaceholder: string;
  createToken: string;
  tokenPermissions: string;
  save: string;
  showOnGitHub: string;
  showOnGitHubDescription: string;
  theme: string;
  themeDescription: string;
  light: string;
  dark: string;
  lightBlue: string;
  lightPurple: string;
  lightGreen: string;
  lightPink: string;
  lightWhite: string;
  
  // Error messages
  errorTitle: string;
  networkError: string;
  authError: string;
  rateLimitError: string;
  permissionError: string;
  retry: string;
  
  // Status messages
  tokenSaved: string;
  themeChanged: string;
  dashboardEnabled: string;
  dashboardDisabled: string;
  tokenEmpty: string;
  tokenSaveFailed: string;
  
  // Profile
  contributionsLastYear: string;
  followers: string;
  following: string;
  repositoriesCount: string;
  stars: string;
  organizations: string;
  location: string;
  website: string;
  company: string;
  bio: string;
  
  // Settings
  copyTokenInstruction: string;
  languageLabel: string;
  english: string;
  japanese: string;
  
  // Streak
  streakTitle: string;
  streakDays: string;
  streakLongest: string;
  streakReminder: string;
  
  // Achievements
  achievementsTitle: string;
  achievementNextTitle: string;
  achievementRemaining: string;
  achievementNext: string;
  achievementInfoTitle: string;
  achievementInfoDescription: string;
  achievementWeeklyPR: string;
  achievementMonthlyPR: string;
  achievementMonthlyCommits: string;
  achievementWeeklyReviews: string;
  achievementStreak: string;
  achievementLevel: string;
  
  // Stats
  statsButton: string;
  statsTitle: string;
  statsThisWeek: string;
  statsThisMonth: string;
  statsCommits: string;
  statsPullRequests: string;
  statsReviews: string;
  statsIssues: string;
  statsComments: string;
  statsPrevious: string;
  close: string;
  
  // Repository actions
  createPR: string;
  createIssue: string;
  viewAllRepositories: string;
  viewOrganizationRepositories: string;
  viewMyRepositories: string;
  
  // PR Card labels
  reviewed: string;
  reviewedByYou: string;
  conflict: string;
  hasMergeConflicts: string;
  updated: string;
  comments: string;
  prMerged: string;
  prClosed: string;
  prOpen: string;
  assignee: string;
  assignees: string;
  reviewCommentedLabel: string;
  reviewChangesRequestedLabel: string;
  reviewApprovedLabel: string;
  
  // Motivation message settings
  showMotivationMessage: string;
  showMotivationMessageDescription: string;
  
  // Motivation messages
  motivationMessages: {
    pr: {
      morning: string[];
      afternoon: string[];
      evening: string[];
      default: string[];
    };
    review: {
      morning: string[];
      afternoon: string[];
      evening: string[];
      default: string[];
    };
    issue: {
      morning: string[];
      afternoon: string[];
      evening: string[];
      default: string[];
    };
    streak: {
      morning: string[];
      afternoon: string[];
      evening: string[];
      default: string[];
    };
    time: {
      morning: string[];
      afternoon: string[];
      evening: string[];
    };
    default: string[];
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    dashboardTitle: 'GitHub Dashboard',
    dashboardTitleTemplate: "{name}'s GitHub Page",
    refresh: 'Refresh',
    refreshing: 'Refreshing...',
    settings: 'Settings',
    revertToGitHub: 'Revert to GitHub',
    all: 'All',
    openOnly: 'Open Only',
    filterByReviewStatus: 'Filter by Review Status',
    allReviews: 'All Reviews',
    approvedOnly: 'Approved Only',
    commentedOnly: 'Commented Only',
    changesRequestedOnly: 'Changes Requested Only',
    reviewRequiredOnly: 'Review Required Only',
    dismissedOnly: 'Dismissed Only',
    pendingOnly: 'Pending Only',
    reviewApproved: 'Approved',
    reviewCommented: 'Commented',
    reviewChangesRequested: 'Changes Requested',
    reviewDismissed: 'Dismissed',
    reviewPending: 'Pending',
    repositories: 'Repositories',
    recentlyUpdatedRepositories: 'Recently Updated Repositories',
    pullRequestsCreated: 'Pull Requests (Created by Me)',
    pullRequestsReviewRequested: 'Pull Requests (Review Requested)',
    pullRequestsReviewed: 'Pull Requests (Reviewed by Me)',
    issuesInvolved: 'Issues (Involved)',
    loading: 'Loading...',
    loadMore: 'Load More',
    noData: 'No data found',
    noPullRequests: 'No pull requests found',
    noPullRequestsReview: 'No pull requests need your review',
    noPullRequestsReviewed: 'No pull requests reviewed by you',
    noIssues: 'No issues found',
    noRepositories: 'No repositories found',
    githubExtension: 'GitHub Dashboard',
    configureToken: 'Please configure your GitHub Personal Access Token to use this extension.',
    openSettings: 'Open Settings',
    createPATInstructions: 'To create a Personal Access Token:',
    createPATLink: 'Create a Personal Access Token',
    requiredPermissions: 'Required permissions: repo, read:org, read:user',
    signInWithGitHub: 'Sign in with GitHub',
    oauthAuthenticating: 'Authenticating...',
    oauthError: 'Authentication failed',
    oauthSuccess: 'Authentication successful',
    oauthCanceled: 'Authentication canceled',
    oauthInstructions: 'Click the button below to authenticate with GitHub using OAuth. This is the recommended method as it is more secure than manually entering a token.',
    oauthDeviceFlowTitle: 'Complete sign-in on GitHub',
    oauthDeviceFlowCodeLabel: 'Code:',
    oauthDeviceFlowCopy: 'Copy code',
    oauthDeviceFlowCopied: 'Code copied to clipboard',
    oauthDeviceFlowCopyFailed: 'Could not copy the code. Please copy it manually.',
    oauthDeviceFlowOpenLabel: 'Open:',
    oauthDeviceFlowWaiting: 'After you authorize on GitHub, this page will continue automatically.',
    manualTokenInput: 'Manual Token Input',
    authInfoTitle: 'About Authentication & Permissions',
    authInfoWritePermissions: 'This extension requests the "repo" scope, which includes write permissions. However, GitHub does not offer a read-only scope for private repositories. Rest assured that this extension only performs read-only operations (viewing PRs, issues, and repositories) and never modifies your data.',
    authInfoOAuthVsPAT: 'OAuth is more secure and convenient, as you don\'t need to manually create or manage tokens. However, if you prefer fine-grained control over permissions or want to limit access to specific repositories, using a Personal Access Token (PAT) with custom scopes may be better suited for your needs.',
    settingsTitle: 'GitHub Dashboard Settings',
    settingsDescription: 'Enter your GitHub Personal Access Token to enable the extension.',
    tokenLabel: 'GitHub Personal Access Token',
    tokenPlaceholder: 'ghp_xxxxxxxxxxxxxxxxxxxx',
    createToken: 'Create a Personal Access Token',
    tokenPermissions: 'Required permissions: repo, read:org, read:user',
    save: 'Save',
    showOnGitHub: 'Show dashboard on GitHub pages',
    showOnGitHubDescription: 'When enabled, the dashboard will replace GitHub pages. You can revert to the original GitHub page using the button in the top-right corner.',
    theme: 'Theme',
    themeDescription: 'Choose your preferred color theme. You can also toggle it from the dashboard header.',
    light: 'Light',
    dark: 'Dark',
    lightBlue: 'Light Blue',
    lightPurple: 'Light Purple',
    lightGreen: 'Light Green',
    lightPink: 'Light Pink',
    lightWhite: 'Light White',
    errorTitle: 'Error',
    networkError: 'Network Error',
    authError: 'Authentication Error',
    rateLimitError: 'Rate Limit Exceeded',
    permissionError: 'Permission Error',
    retry: 'Retry',
    tokenSaved: 'Token saved successfully! Please refresh the new tab page.',
    themeChanged: 'Theme changed to {theme}. Please refresh the dashboard to see the changes.',
    dashboardEnabled: 'Dashboard will now show on GitHub pages. Please refresh any open GitHub tabs.',
    dashboardDisabled: 'Dashboard disabled on GitHub pages.',
    tokenEmpty: 'Token cannot be empty',
    tokenSaveFailed: 'Failed to save token. Please check your token and try again.',
    contributionsLastYear: 'contributions in the last year',
    followers: 'Followers',
    following: 'Following',
    repositoriesCount: 'Repositories',
    stars: 'Stars',
    organizations: 'Organizations',
    location: 'Location',
    website: 'Website',
    company: 'Company',
    bio: 'Bio',
    copyTokenInstruction: 'Copy the token and paste it below',
    languageLabel: 'Language',
    english: 'English',
    japanese: 'Japanese',
    streakTitle: 'Contribution Streak',
    streakDays: 'days',
    streakLongest: 'Longest',
    streakReminder: "You haven't contributed today!",
    achievementsTitle: 'Achievements',
    achievementNextTitle: 'Next title',
    achievementRemaining: 'remaining',
    achievementNext: 'next',
    achievementInfoTitle: 'Achievement Levels',
    achievementInfoDescription: 'Earn badges by reaching different milestones. Each achievement has multiple levels:',
    achievementWeeklyPR: 'Weekly Pull Requests',
    achievementMonthlyPR: 'Monthly Pull Requests',
    achievementMonthlyCommits: 'Monthly Commits',
    achievementWeeklyReviews: 'Weekly Reviews',
    achievementStreak: 'Contribution Streak',
    achievementLevel: 'Level',
    statsButton: 'Stats',
    statsTitle: 'Statistics',
    statsThisWeek: 'This Week',
    statsThisMonth: 'This Month',
    statsCommits: 'Commits',
    statsPullRequests: 'Pull Requests',
    statsReviews: 'Reviews',
    statsIssues: 'Issues',
    statsComments: 'Comments',
    statsPrevious: 'Previous:',
    close: 'Close',
    createPR: 'Create PR',
    createIssue: 'Create Issue',
    viewAllRepositories: 'View all repositories',
    viewOrganizationRepositories: 'View organization repositories',
    viewMyRepositories: 'View my repositories',
    reviewed: 'Reviewed',
    reviewedByYou: 'Reviewed by you',
    conflict: 'Conflict',
    hasMergeConflicts: 'Has merge conflicts',
    updated: 'Updated',
    comments: 'comments',
    prMerged: 'Merged',
    prClosed: 'Closed',
    prOpen: 'Open',
    assignee: 'assignee',
    assignees: 'assignees',
    reviewCommentedLabel: 'Commented',
    reviewChangesRequestedLabel: 'Changes',
    reviewApprovedLabel: 'Approved',
    addToFavorites: 'Add to favorites',
    removeFromFavorites: 'Remove from favorites',
    showMotivationMessage: 'Show motivation messages',
    showMotivationMessageDescription: 'Display random motivation messages based on time of day and activity in the profile section.',
    motivationMessages: {
      pr: {
        morning: [
          'Good morning! Great PRs you\'ve created!',
          'Morning! Keep up the excellent PR work!',
          'Starting the day with amazing PRs!',
        ],
        afternoon: [
          'Afternoon! Your PRs are looking fantastic!',
          'Great PR work this afternoon!',
          'Excellent PRs! Keep it up!',
        ],
        evening: [
          'Evening! Wonderful PRs today!',
          'Ending the day with great PRs!',
          'Fantastic PR work today!',
        ],
        default: [
          'Amazing PRs! Keep up the great work!',
          'Your PRs are fantastic!',
          'Great job on those PRs!',
        ],
      },
      review: {
        morning: [
          'Good morning! Time to review some PRs!',
          'Morning! You have PRs waiting for review!',
          'Starting the day with PR reviews!',
        ],
        afternoon: [
          'Afternoon! Don\'t forget those PR reviews!',
          'Great reviews make great code!',
          'Keep those reviews coming!',
        ],
        evening: [
          'Evening! Perfect time for thoughtful reviews!',
          'Your reviews help the team!',
          'Great review work today!',
        ],
        default: [
          'PRs are waiting for your review!',
          'Your reviews are valuable!',
          'Keep up the great review work!',
        ],
      },
      issue: {
        morning: [
          'Good morning! Tackle those issues today!',
          'Morning! Issues are opportunities!',
          'Starting the day by solving issues!',
        ],
        afternoon: [
          'Afternoon! Great work on those issues!',
          'Keep solving those issues!',
          'Your issue work is appreciated!',
        ],
        evening: [
          'Evening! Issues resolved, great job!',
          'Ending the day with solved issues!',
          'Fantastic issue work today!',
        ],
        default: [
          'Great work on those issues!',
          'Keep solving issues!',
          'Your issue contributions matter!',
        ],
      },
      streak: {
        morning: [
          'Good morning! Amazing streak you have!',
          'Morning! Keep that streak going!',
          'Starting another day of contributions!',
        ],
        afternoon: [
          'Afternoon! Your streak is impressive!',
          'Keep that contribution streak alive!',
          'Great streak you\'re maintaining!',
        ],
        evening: [
          'Evening! Another day, another contribution!',
          'Ending the day maintaining your streak!',
          'Fantastic streak you\'ve built!',
        ],
        default: [
          'Amazing contribution streak!',
          'Keep that streak going!',
          'Your consistency is inspiring!',
        ],
      },
      time: {
        morning: [
          'Good morning! Let\'s have a productive day!',
          'Morning! Time to code!',
          'Starting fresh today!',
          'Good morning! Ready to contribute?',
        ],
        afternoon: [
          'Good afternoon! Keep up the great work!',
          'Afternoon! Stay productive!',
          'Keep coding this afternoon!',
          'Afternoon vibes! Let\'s code!',
        ],
        evening: [
          'Good evening! Great work today!',
          'Evening! Time to wind down with some code!',
          'Ending the day strong!',
          'Evening! Keep contributing!',
        ],
      },
      default: [
        'Let\'s code today!',
        'Today is a great day to contribute!',
        'Keep up the excellent work!',
        'You\'re doing great!',
      ],
    },
  },
  ja: {
    dashboardTitle: 'GitHub ダッシュボード',
    dashboardTitleTemplate: '{name} の GitHub ページ',
    refresh: '更新',
    refreshing: '更新中...',
    settings: '設定',
    revertToGitHub: 'GitHubに戻る',
    all: 'すべて',
    openOnly: 'オープンのみ',
    filterByReviewStatus: 'レビュー状態でフィルター',
    allReviews: 'すべてのレビュー',
    approvedOnly: '承認済みのみ',
    commentedOnly: 'コメントのみ',
    changesRequestedOnly: '変更要求ありのみ',
    reviewRequiredOnly: 'レビュー待ちのみ',
    dismissedOnly: '却下済みのみ',
    pendingOnly: '保留中のみ',
    reviewApproved: '承認済み',
    reviewCommented: 'コメント',
    reviewChangesRequested: '変更要求あり',
    reviewDismissed: '却下済み',
    reviewPending: '保留中',
    repositories: 'リポジトリ',
    recentlyUpdatedRepositories: '最近更新されたリポジトリ',
    allRepositories: '全てのリポジトリ',
    organizationRepositories: '組織のリポジトリ',
    myRepositories: '自分のリポジトリ',
    favoriteRepositories: 'お気に入りリポジトリ',
    pullRequestsCreated: 'プルリクエスト (作成したもの)',
    pullRequestsReviewRequested: 'プルリクエスト (レビュー依頼)',
    pullRequestsReviewed: 'プルリクエスト (レビュー済み)',
    issuesInvolved: 'イシュー (関連)',
    loading: '読み込み中...',
    loadMore: 'さらに読み込む',
    noData: 'データが見つかりません',
    noPullRequests: 'プルリクエストが見つかりません',
    noPullRequestsReview: 'レビューが必要なプルリクエストはありません',
    noPullRequestsReviewed: 'レビュー済みのプルリクエストはありません',
    noIssues: 'イシューが見つかりません',
    noRepositories: 'リポジトリが見つかりません',
    githubExtension: 'GitHub Dashboard',
    configureToken: 'この拡張機能を使用するには、GitHub Personal Access Token を設定してください。',
    openSettings: '設定を開く',
    createPATInstructions: 'Personal Access Token を作成するには:',
    createPATLink: 'Personal Access Token を作成',
    requiredPermissions: '必要な権限: repo, read:org, read:user',
    signInWithGitHub: 'GitHubでログイン',
    oauthAuthenticating: '認証中...',
    oauthError: '認証に失敗しました',
    oauthSuccess: '認証に成功しました',
    oauthCanceled: '認証がキャンセルされました',
    oauthInstructions: '下のボタンをクリックして、OAuthを使用してGitHubで認証します。これは、トークンを手動で入力するよりも安全な推奨方法です。',
    oauthDeviceFlowTitle: 'GitHubでログインを完了してください',
    oauthDeviceFlowCodeLabel: 'コード:',
    oauthDeviceFlowCopy: 'コードをコピー',
    oauthDeviceFlowCopied: 'コードをクリップボードにコピーしました',
    oauthDeviceFlowCopyFailed: 'コピーできませんでした。手動でコピーしてください。',
    oauthDeviceFlowOpenLabel: '開く:',
    oauthDeviceFlowWaiting: 'GitHubで承認が完了すると、この画面が自動で続行します。',
    manualTokenInput: '手動でトークンを入力',
    authInfoTitle: '認証と権限について',
    authInfoWritePermissions: 'この拡張機能は「repo」スコープを要求しますが、これは書き込み権限も含まれます。ただし、GitHubはプライベートリポジトリ用の読み取り専用スコープを提供していません。ご安心ください。この拡張機能は読み取り専用の操作（PR、Issue、リポジトリの閲覧）のみを行い、データを変更することは一切ありません。',
    authInfoOAuthVsPAT: 'OAuthはより安全で便利な方法です。手動でトークンを作成・管理する必要がありません。ただし、より細かい権限管理や特定のリポジトリへのアクセスを制限したい場合は、カスタムスコープを持つPersonal Access Token（PAT）を使用する方が適している場合があります。',
    settingsTitle: 'GitHub Dashboard の設定',
    settingsDescription: 'GitHub Personal Access Token を入力して拡張機能を有効にします。',
    tokenLabel: 'GitHub Personal Access Token',
    tokenPlaceholder: 'ghp_xxxxxxxxxxxxxxxxxxxx',
    createToken: 'Personal Access Token を作成',
    tokenPermissions: '必要な権限: repo, read:org, read:user',
    save: '保存',
    showOnGitHub: 'GitHub ページでダッシュボードを表示',
    showOnGitHubDescription: '有効にすると、ダッシュボードがGitHubページを置き換えます。右上のボタンで元のGitHubページに戻すことができます。',
    theme: 'テーマ',
    themeDescription: 'お好みのカラーテーマを選択してください。ダッシュボードのヘッダーからも切り替えできます。',
    light: 'ライト',
    dark: 'ダーク',
    lightBlue: 'ライトブルー',
    lightPurple: 'ライトパープル',
    lightGreen: 'ライトグリーン',
    lightPink: 'ライトピンク',
    lightWhite: 'ライトホワイト',
    errorTitle: 'エラー',
    networkError: 'ネットワークエラー',
    authError: '認証エラー',
    rateLimitError: 'レート制限超過',
    permissionError: '権限エラー',
    retry: '再試行',
    tokenSaved: 'トークンが正常に保存されました！新しいタブページを更新してください。',
    themeChanged: 'テーマを{theme}に変更しました。変更を確認するにはダッシュボードを更新してください。',
    dashboardEnabled: 'ダッシュボードがGitHubページで表示されるようになりました。開いているGitHubタブを更新してください。',
    dashboardDisabled: 'GitHubページでのダッシュボード表示を無効にしました。',
    tokenEmpty: 'トークンは空にできません',
    tokenSaveFailed: 'トークンの保存に失敗しました。トークンを確認して再度お試しください。',
    contributionsLastYear: '過去1年間のコントリビューション',
    followers: 'フォロワー',
    following: 'フォロー中',
    repositoriesCount: 'リポジトリ',
    stars: 'スター',
    organizations: '組織',
    location: '場所',
    website: 'ウェブサイト',
    company: '会社',
    bio: '自己紹介',
    copyTokenInstruction: 'トークンをコピーして、下に入力してください',
    languageLabel: '言語',
    english: 'English',
    japanese: '日本語',
    streakTitle: '連続コントリビューション',
    streakDays: '日連続',
    streakLongest: '最長記録',
    streakReminder: '今日まだコントリビュートしていません！',
    achievementsTitle: '実績バッジ',
    achievementNextTitle: '次の称号',
    achievementRemaining: 'まであと',
    achievementNext: '次',
    achievementInfoTitle: '実績レベル',
    achievementInfoDescription: '様々なマイルストーンに到達することでバッジを獲得できます。各実績には複数のレベルがあります：',
    achievementWeeklyPR: '週間プルリクエスト',
    achievementMonthlyPR: '月間プルリクエスト',
    achievementMonthlyCommits: '月間コミット',
    achievementWeeklyReviews: '週間レビュー',
    achievementStreak: '連続コントリビューション',
    achievementLevel: 'レベル',
    statsButton: '統計',
    statsTitle: '統計情報',
    statsThisWeek: '今週',
    statsThisMonth: '今月',
    statsCommits: 'コミット',
    statsPullRequests: 'プルリクエスト',
    statsReviews: 'レビュー',
    statsIssues: 'イシュー',
    statsComments: 'コメント',
    statsPrevious: '前:',
    close: '閉じる',
    createPR: 'PRを作成',
    createIssue: 'Issueを作成',
    viewAllRepositories: '全てのリポジトリを見る',
    viewOrganizationRepositories: '組織のリポジトリを見る',
    viewMyRepositories: '自分のリポジトリを見る',
    reviewed: 'レビュー済み',
    reviewedByYou: 'あなたがレビュー済み',
    conflict: 'コンフリクト',
    hasMergeConflicts: 'マージコンフリクトがあります',
    updated: '更新',
    comments: 'コメント',
    prMerged: 'マージ済み',
    prClosed: 'クローズ済み',
    prOpen: 'オープン',
    assignee: 'アサイン済み',
    assignees: 'アサイン済み',
    reviewCommentedLabel: 'コメント',
    reviewChangesRequestedLabel: '変更要求',
    reviewApprovedLabel: '承認',
    addToFavorites: 'お気に入りに追加',
    removeFromFavorites: 'お気に入りから削除',
    showMotivationMessage: 'モチベーションメッセージを表示',
    showMotivationMessageDescription: 'プロフィールセクションに時間帯やアクティビティに基づいたランダムなモチベーションメッセージを表示します。',
    motivationMessages: {
      pr: {
        morning: [
          'おはようございます！素晴らしいPRですね！',
          '朝からPR作成、素敵です！',
          '今日も良いPRで始まりました！',
        ],
        afternoon: [
          '午後のPR作成、素晴らしいですね！',
          '午後もPR頑張っていますね！',
          '素晴らしいPRですね！',
        ],
        evening: [
          '夜ですね！今日も良いPRでした！',
          '今日一日のPR作成お疲れ様です！',
          '素晴らしいPR作業でした！',
        ],
        default: [
          '素晴らしいPRですね！頑張りましょう！',
          'PR作成、素敵です！',
          'PR作業、頑張っていますね！',
        ],
      },
      review: {
        morning: [
          'おはようございます！PRレビューの時間です！',
          '朝からPRレビュー、素晴らしいですね！',
          '今日もレビューで始まりましょう！',
        ],
        afternoon: [
          '午後！PRレビューを忘れずに！',
          '良いレビューが良いコードを作ります！',
          'レビューを続けましょう！',
        ],
        evening: [
          '夜ですね！じっくりレビューする時間です！',
          'あなたのレビューがチームを助けます！',
          '今日も良いレビューでした！',
        ],
        default: [
          'レビュー待ちのPRがありますね！',
          'あなたのレビューは価値があります！',
          'レビュー作業、頑張りましょう！',
        ],
      },
      issue: {
        morning: [
          'おはようございます！今日もIssue解決しましょう！',
          '朝からIssue対応、素晴らしいですね！',
          '今日もIssue解決で始まりましょう！',
        ],
        afternoon: [
          '午後！Issue対応、素晴らしいですね！',
          'Issue解決を続けましょう！',
          'あなたのIssue対応に感謝です！',
        ],
        evening: [
          '夜ですね！Issue解決お疲れ様です！',
          '今日も良いIssue対応でした！',
          '素晴らしいIssue作業でした！',
        ],
        default: [
          'Issue対応、素晴らしいですね！',
          'Issue解決を続けましょう！',
          'あなたのIssue貢献は重要です！',
        ],
      },
      streak: {
        morning: [
          'おはようございます！素晴らしい連続記録ですね！',
          '朝！ストリークを維持しましょう！',
          '今日もコントリビューションで始まりましょう！',
        ],
        afternoon: [
          '午後！連続記録、素晴らしいですね！',
          'コントリビューションストリークを維持しましょう！',
          '素晴らしいストリークですね！',
        ],
        evening: [
          '夜ですね！今日もコントリビューション完了！',
          '今日もストリークを維持できました！',
          '素晴らしいストリークを築いていますね！',
        ],
        default: [
          '素晴らしい連続コントリビューション！',
          'ストリークを維持しましょう！',
          'あなたの継続性は素晴らしいです！',
        ],
      },
      time: {
        morning: [
          'おはようございます！今日も頑張りましょう！',
          '朝ですね！コーディングの時間です！',
          '今日も新鮮な気持ちで始めましょう！',
          'おはようございます！コントリビュートの準備はできていますか？',
        ],
        afternoon: [
          'こんにちは！今日も頑張りましょう！',
          '午後ですね！生産性を保ちましょう！',
          '午後もコーディングを続けましょう！',
          '午後の雰囲気でコーディングしましょう！',
        ],
        evening: [
          'こんばんは！今日も良い一日でした！',
          '夜ですね！コーディングでリラックスしましょう！',
          '今日一日、お疲れ様でした！',
          '夜もコントリビュートを続けましょう！',
        ],
      },
      default: [
        '今日もコーディングしましょう！',
        '今日はコントリビュートする良い日です！',
        '素晴らしい作業を続けましょう！',
        '頑張っていますね！',
      ],
    },
  },
};
