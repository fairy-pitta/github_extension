import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RepositoryCard } from '../RepositoryCard';
import { Repository } from '@/domain/entities/Repository';
import { LanguageContext } from '@/presentation/i18n/useLanguage';
import { translations } from '@/presentation/i18n/translations';

function renderWithLanguage(ui: React.ReactElement) {
  return render(
    <LanguageContext.Provider
      value={{
        language: 'en',
        t: translations.en,
        setLanguage: async () => {},
      }}
    >
      {ui}
    </LanguageContext.Provider>
  );
}

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
    renderWithLanguage(<RepositoryCard repository={mockRepo} />);

    expect(screen.getByText('test/repo')).toBeInTheDocument();
    expect(screen.getByText('Test repository')).toBeInTheDocument();
  });

  it('should display private badge for private repositories', () => {
    const privateRepo = Repository.fromPlain({
      ...mockRepo,
      isPrivate: true,
    });

    renderWithLanguage(<RepositoryCard repository={privateRepo} />);

    expect(screen.getByText('Private')).toBeInTheDocument();
  });
});


