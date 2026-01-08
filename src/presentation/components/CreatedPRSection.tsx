import React from 'react';
import { PullRequest } from '@/domain/entities/PullRequest';
import { PRCard } from './PRCard';
import { SkeletonLoader } from './SkeletonLoader';
import './styles/section.css';

interface CreatedPRSectionProps {
  prs: PullRequest[];
  loading?: boolean;
}

export const CreatedPRSection: React.FC<CreatedPRSectionProps> = React.memo(({
  prs,
  loading = false,
}) => {
  if (loading) {
    return (
      <section className="dashboard-section">
        <h2 className="section-title">Pull Requests (Created by Me)</h2>
        <div className="section-content">
          <SkeletonLoader count={3} />
        </div>
      </section>
    );
  }

  if (prs.length === 0) {
    return (
      <section className="dashboard-section">
        <h2 className="section-title">Pull Requests (Created by Me)</h2>
        <div className="section-content">
          <p className="empty-message">No pull requests found</p>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <h2 className="section-title">Pull Requests (Created by Me)</h2>
      <div className="section-content">
        {prs.map((pr) => (
          <PRCard key={`${pr.repository.nameWithOwner}-${pr.number}`} pr={pr} />
        ))}
      </div>
    </section>
  );
});

