import React from 'react';
import { PullRequest } from '@/domain/entities/PullRequest';
import { PRCard } from './PRCard';
import './styles/section.css';

interface PRSectionProps {
  title: string;
  prs: PullRequest[];
  loading?: boolean;
  emptyMessage?: string;
}

export const PRSection: React.FC<PRSectionProps> = React.memo(({
  title,
  prs,
  loading = false,
  emptyMessage = 'No pull requests found',
}) => {
  if (loading) {
    return (
      <section className="dashboard-section">
        <h2 className="section-title">{title}</h2>
        <div className="section-content">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  if (prs.length === 0) {
    return (
      <section className="dashboard-section">
        <h2 className="section-title">{title}</h2>
        <div className="section-content">
          <p className="empty-message">{emptyMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <h2 className="section-title">{title}</h2>
      <div className="section-content">
        {prs.map((pr) => (
          <PRCard key={`${pr.repository.nameWithOwner}-${pr.number}`} pr={pr} />
        ))}
      </div>
    </section>
  );
});

