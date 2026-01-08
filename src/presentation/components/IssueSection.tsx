import React from 'react';
import { Issue } from '@/domain/entities/Issue';
import { IssueCard } from './IssueCard';
import { SkeletonLoader } from './SkeletonLoader';
import './styles/section.css';

interface IssueSectionProps {
  issues: Issue[];
  loading?: boolean;
}

export const IssueSection: React.FC<IssueSectionProps> = React.memo(({
  issues,
  loading = false,
}) => {
  if (loading) {
    return (
      <section className="dashboard-section">
        <h2 className="section-title">Issues (Involved)</h2>
        <div className="section-content">
          <SkeletonLoader count={3} />
        </div>
      </section>
    );
  }

  if (issues.length === 0) {
    return (
      <section className="dashboard-section">
        <h2 className="section-title">Issues (Involved)</h2>
        <div className="section-content">
          <p className="empty-message">No issues found</p>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <h2 className="section-title">Issues (Involved)</h2>
      <div className="section-content">
        {issues.map((issue) => (
          <IssueCard
            key={`${issue.repository.nameWithOwner}-${issue.number}`}
            issue={issue}
          />
        ))}
      </div>
    </section>
  );
});

