import React, { useMemo, useCallback } from 'react';
import { Issue } from '@/domain/entities/Issue';
import { formatRelativeDate } from '../utils/dateUtils';
import './styles/cards.css';

interface IssueCardProps {
  issue: Issue;
  onClick?: () => void;
}

export const IssueCard: React.FC<IssueCardProps> = React.memo(({ issue, onClick }) => {
  const formattedDate = useMemo(() => formatRelativeDate(issue.updatedAt), [issue.updatedAt]);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    } else {
      window.open(issue.url, '_blank');
    }
  }, [onClick, issue.url]);

  return (
    <div className="card issue-card" onClick={handleClick}>
      <div className="card-header">
        <span className={`badge ${issue.state === 'OPEN' ? 'badge-open' : 'badge-closed'}`}>
          {issue.state}
        </span>
        <span className="card-repo">{issue.repository.nameWithOwner}</span>
      </div>
      <h3 className="card-title">{issue.title}</h3>
      {issue.labels.length > 0 && (
        <div className="card-labels">
          {issue.labels.map((label) => (
            <span
              key={label.name}
              className="label"
              style={{ backgroundColor: `#${label.color}` }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}
      <div className="card-meta">
        <span className="card-number">#{issue.number}</span>
        <span className="card-separator">•</span>
        <span className="card-updated">Updated {formattedDate}</span>
        {issue.commentsCount > 0 && (
          <>
            <span className="card-separator">•</span>
            <span className="card-comments">{issue.commentsCount} comments</span>
          </>
        )}
        {issue.assignees.length > 0 && (
          <>
            <span className="card-separator">•</span>
            <span className="card-assignees">
              {issue.assignees.length} assignee{issue.assignees.length > 1 ? 's' : ''}
            </span>
          </>
        )}
      </div>
    </div>
  );
});

