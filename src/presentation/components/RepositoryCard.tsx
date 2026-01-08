import React, { useMemo, useCallback } from 'react';
import { Repository } from '@/domain/entities/Repository';
import { formatRelativeDate } from '../utils/dateUtils';
import './styles/cards.css';

interface RepositoryCardProps {
  repository: Repository;
  onClick?: () => void;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = React.memo(({
  repository,
  onClick,
}) => {
  const formattedDate = useMemo(
    () => formatRelativeDate(repository.updatedAt),
    [repository.updatedAt]
  );

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    } else {
      window.open(repository.url, '_blank');
    }
  }, [onClick, repository.url]);

  return (
    <div className="card repository-card" onClick={handleClick}>
      <div className="card-header">
        <span className={`badge ${repository.isPrivate ? 'badge-private' : 'badge-public'}`}>
          {repository.isPrivate ? 'Private' : 'Public'}
        </span>
        <span className="card-repo">{repository.nameWithOwner}</span>
      </div>
      {repository.description && (
        <p className="card-description">{repository.description}</p>
      )}
      <div className="card-meta">
        <span className="card-updated">Updated {formattedDate}</span>
      </div>
    </div>
  );
});

