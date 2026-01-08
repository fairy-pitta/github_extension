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
  
  // Sections
  repositories: string;
  recentlyUpdatedRepositories: string;
  pullRequestsCreated: string;
  pullRequestsReviewRequested: string;
  issuesInvolved: string;
  
  // Common
  loading: string;
  loadMore: string;
  noData: string;
  noPullRequests: string;
  noPullRequestsReview: string;
  noIssues: string;
  noRepositories: string;
  
  // Auth
  githubExtension: string;
  configureToken: string;
  openSettings: string;
  createPATInstructions: string;
  createPATLink: string;
  requiredPermissions: string;
  
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
  
  // Stats
  statsButton: string;
  statsTitle: string;
  statsThisWeek: string;
  statsThisMonth: string;
  statsCommits: string;
  statsPullRequests: string;
  statsReviews: string;
  statsIssues: string;
  close: string;
  
  // Repository actions
  createPR: string;
  createIssue: string;
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
    repositories: 'Repositories',
    recentlyUpdatedRepositories: 'Recently Updated Repositories',
    pullRequestsCreated: 'Pull Requests (Created by Me)',
    pullRequestsReviewRequested: 'Pull Requests (Review Requested)',
    issuesInvolved: 'Issues (Involved)',
    loading: 'Loading...',
    loadMore: 'Load More',
    noData: 'No data found',
    noPullRequests: 'No pull requests found',
    noPullRequestsReview: 'No pull requests need your review',
    noIssues: 'No issues found',
    noRepositories: 'No repositories found',
    githubExtension: 'GitHub Extension',
    configureToken: 'Please configure your GitHub Personal Access Token to use this extension.',
    openSettings: 'Open Settings',
    createPATInstructions: 'To create a Personal Access Token:',
    createPATLink: 'Create a Personal Access Token',
    requiredPermissions: 'Required permissions: repo, read:org, read:user',
    settingsTitle: 'GitHub Extension Settings',
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
    statsButton: 'Stats',
    statsTitle: 'Statistics',
    statsThisWeek: 'This Week',
    statsThisMonth: 'This Month',
    statsCommits: 'Commits',
    statsPullRequests: 'Pull Requests',
    statsReviews: 'Reviews',
    statsIssues: 'Issues',
    close: 'Close',
    createPR: 'Create PR',
    createIssue: 'Create Issue',
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
    repositories: 'リポジトリ',
    recentlyUpdatedRepositories: '最近更新されたリポジトリ',
    pullRequestsCreated: 'プルリクエスト (作成したもの)',
    pullRequestsReviewRequested: 'プルリクエスト (レビュー依頼)',
    issuesInvolved: 'イシュー (関連)',
    loading: '読み込み中...',
    loadMore: 'さらに読み込む',
    noData: 'データが見つかりません',
    noPullRequests: 'プルリクエストが見つかりません',
    noPullRequestsReview: 'レビューが必要なプルリクエストはありません',
    noIssues: 'イシューが見つかりません',
    noRepositories: 'リポジトリが見つかりません',
    githubExtension: 'GitHub 拡張機能',
    configureToken: 'この拡張機能を使用するには、GitHub Personal Access Token を設定してください。',
    openSettings: '設定を開く',
    createPATInstructions: 'Personal Access Token を作成するには:',
    createPATLink: 'Personal Access Token を作成',
    requiredPermissions: '必要な権限: repo, read:org, read:user',
    settingsTitle: 'GitHub 拡張機能の設定',
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
    statsButton: '統計',
    statsTitle: '統計情報',
    statsThisWeek: '今週',
    statsThisMonth: '今月',
    statsCommits: 'コミット',
    statsPullRequests: 'プルリクエスト',
    statsReviews: 'レビュー',
    statsIssues: 'イシュー',
    close: '閉じる',
    createPR: 'PRを作成',
    createIssue: 'Issueを作成',
  },
};

