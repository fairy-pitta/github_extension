import React, { useMemo, useCallback } from 'react';
import { Repository } from '@/domain/entities/Repository';
import { formatRelativeDate } from '../utils/dateUtils';
import { useLanguage } from '../i18n/useLanguage';
import { useFavoriteRepositories } from '../dashboard/hooks/useFavoriteRepositories';
import './styles/cards.css';

interface RepositoryCardProps {
  repository: Repository;
  onClick?: () => void;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = React.memo(({
  repository,
  onClick,
}) => {
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavoriteRepositories();
  const isFav = isFavorite(repository.nameWithOwner);
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

  const handleCreatePR = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const [owner, repo] = repository.nameWithOwner.split('/');
    window.open(`https://github.com/${owner}/${repo}/compare`, '_blank');
  }, [repository.nameWithOwner]);

  const handleCreateIssue = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const [owner, repo] = repository.nameWithOwner.split('/');
    window.open(`https://github.com/${owner}/${repo}/issues/new`, '_blank');
  }, [repository.nameWithOwner]);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(repository.nameWithOwner);
  }, [repository.nameWithOwner, toggleFavorite]);

  return (
    <div className="card repository-card" onClick={handleClick}>
      <div className="card-header">
        <div className="card-header-left">
          <span className={`badge ${repository.isPrivate ? 'badge-private' : 'badge-public'}`}>
            {repository.isPrivate ? 'Private' : 'Public'}
          </span>
          <span className="card-repo">{repository.nameWithOwner}</span>
          <button
            className={`card-favorite-button ${isFav ? 'active' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={isFav ? t.removeFromFavorites : t.addToFavorites}
            title={isFav ? t.removeFromFavorites : t.addToFavorites}
          >
            <i className={`fas fa-star ${isFav ? 'active' : ''}`}></i>
          </button>
        </div>
        <div className="card-header-actions">
          <button
            className="card-action-button card-action-button-pr"
            onClick={handleCreatePR}
            aria-label={t.createPR}
            title={t.createPR}
          >
            <i className="fas fa-code-pull-request"></i>
            <span className="card-action-text">{t.createPR}</span>
          </button>
          <button
            className="card-action-button card-action-button-issue"
            onClick={handleCreateIssue}
            aria-label={t.createIssue}
            title={t.createIssue}
          >
            <i className="fas fa-exclamation-circle"></i>
            <span className="card-action-text">{t.createIssue}</span>
          </button>
        </div>
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

