import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RepositoryCard } from '../RepositoryCard';
import { Repository } from '@/domain/entities/Repository';

describe('RepositoryCard', () => {
  const mockRepo = Repository.fromPlain({
    nameWithOwner: 'test/repo',
    url: 'https://github.com/test/repo',
    updatedAt: new Date(),
    isPrivate: false,
    description: 'Test repository',
    owner: { login: 'test' },
  });

  it('should render Repository card with correct information', () => {
    render(<RepositoryCard repository={mockRepo} />);

    expect(screen.getByText('test/repo')).toBeInTheDocument();
    expect(screen.getByText('Test repository')).toBeInTheDocument();
  });

  it('should display private badge for private repositories', () => {
    const privateRepo = Repository.fromPlain({
      ...mockRepo,
      isPrivate: true,
    });

    render(<RepositoryCard repository={privateRepo} />);

    expect(screen.getByText('Private')).toBeInTheDocument();
  });
});


