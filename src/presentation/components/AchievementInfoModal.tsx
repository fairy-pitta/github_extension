import React from 'react';
import { useLanguage } from '../i18n/useLanguage';
import './styles/achievement-info-modal.css';

interface AchievementInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AchievementLevel {
  target: number;
  name: string;
  description: string;
}

interface AchievementDefinition {
  id: string;
  icon: string;
  titleKey: string;
  levels: AchievementLevel[];
}

export const AchievementInfoModal: React.FC<AchievementInfoModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();

  if (!isOpen) return null;

  const achievements: AchievementDefinition[] = [
    {
      id: 'weekly_pr',
      icon: 'fa-code-branch',
      titleKey: 'achievementWeeklyPR',
      levels: [
        { target: 5, name: 'PR Rookie', description: language === 'ja' ? '今週5個のPRを作成' : 'Create 5 PRs this week' },
        { target: 10, name: 'PR Master', description: language === 'ja' ? '今週10個のPRを作成' : 'Create 10 PRs this week' },
        { target: 20, name: 'PR Elite', description: language === 'ja' ? '今週20個のPRを作成' : 'Create 20 PRs this week' },
        { target: 40, name: 'PR Legend', description: language === 'ja' ? '今週40個のPRを作成' : 'Create 40 PRs this week' },
      ],
    },
    {
      id: 'monthly_pr',
      icon: 'fa-trophy',
      titleKey: 'achievementMonthlyPR',
      levels: [
        { target: 10, name: 'PR Builder', description: language === 'ja' ? '今月10個のPRを作成' : 'Create 10 PRs this month' },
        { target: 25, name: 'PR Champion', description: language === 'ja' ? '今月25個のPRを作成' : 'Create 25 PRs this month' },
        { target: 50, name: 'PR Titan', description: language === 'ja' ? '今月50個のPRを作成' : 'Create 50 PRs this month' },
        { target: 100, name: 'PR Emperor', description: language === 'ja' ? '今月100個のPRを作成' : 'Create 100 PRs this month' },
      ],
    },
    {
      id: 'monthly_commits',
      icon: 'fa-fire',
      titleKey: 'achievementMonthlyCommits',
      levels: [
        { target: 50, name: 'Commit Squire', description: language === 'ja' ? '今月50回のコミット' : '50 commits this month' },
        { target: 100, name: 'Commit King', description: language === 'ja' ? '今月100回のコミット' : '100 commits this month' },
        { target: 250, name: 'Commit Emperor', description: language === 'ja' ? '今月250回のコミット' : '250 commits this month' },
        { target: 500, name: 'Commit Titan', description: language === 'ja' ? '今月500回のコミット' : '500 commits this month' },
        { target: 1000, name: 'Commit Legend', description: language === 'ja' ? '今月1000回のコミット' : '1000 commits this month' },
      ],
    },
    {
      id: 'weekly_reviews',
      icon: 'fa-eye',
      titleKey: 'achievementWeeklyReviews',
      levels: [
        { target: 3, name: 'Reviewer', description: language === 'ja' ? '今週3回のレビュー' : '3 reviews this week' },
        { target: 5, name: 'Review Helper', description: language === 'ja' ? '今週5回のレビュー' : '5 reviews this week' },
        { target: 10, name: 'Review Master', description: language === 'ja' ? '今週10回のレビュー' : '10 reviews this week' },
        { target: 20, name: 'Review Legend', description: language === 'ja' ? '今週20回のレビュー' : '20 reviews this week' },
      ],
    },
    {
      id: 'streak',
      icon: 'fa-calendar-week',
      titleKey: 'achievementStreak',
      levels: [
        { target: 3, name: 'Starter', description: language === 'ja' ? '連続3日コントリビュート' : '3 days contribution streak' },
        { target: 7, name: 'Week Warrior', description: language === 'ja' ? '連続7日コントリビュート' : '7 days contribution streak' },
        { target: 14, name: 'Fortnight Fighter', description: language === 'ja' ? '連続14日コントリビュート' : '14 days contribution streak' },
        { target: 30, name: 'Month Master', description: language === 'ja' ? '連続30日コントリビュート' : '30 days contribution streak' },
        { target: 60, name: 'Streak Veteran', description: language === 'ja' ? '連続60日コントリビュート' : '60 days contribution streak' },
        { target: 100, name: 'Streak Legend', description: language === 'ja' ? '連続100日コントリビュート' : '100 days contribution streak' },
      ],
    },
  ];

  return (
    <div className="achievement-info-modal-overlay" onClick={onClose}>
      <div className="achievement-info-modal" onClick={(e) => e.stopPropagation()}>
        <div className="achievement-info-modal-header">
          <h2 className="achievement-info-modal-title">{t.achievementInfoTitle}</h2>
          <button className="achievement-info-modal-close" onClick={onClose} aria-label={t.close}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="achievement-info-modal-content">
          <p className="achievement-info-modal-description">{t.achievementInfoDescription}</p>
          <div className="achievement-info-list">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="achievement-info-item">
                <div className="achievement-info-item-header">
                  <i className={`fas ${achievement.icon} achievement-info-icon`}></i>
                  <h3 className="achievement-info-item-title">
                    {t[achievement.titleKey as keyof typeof t] as string}
                  </h3>
                </div>
                <div className="achievement-info-levels">
                  {achievement.levels.map((level, index) => (
                    <div key={index} className="achievement-info-level">
                      <span className="achievement-info-level-badge">
                        {t.achievementLevel} {index + 1}
                      </span>
                      <span className="achievement-info-level-name">{level.name}</span>
                      <span className="achievement-info-level-target">
                        {level.target} {achievement.id === 'streak' ? (language === 'ja' ? '日' : 'days') : ''}
                      </span>
                      <span className="achievement-info-level-description">{level.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

