import { describe, it, expect } from 'vitest';
import { RepositoryMapper } from '../RepositoryMapper';
import { Repository } from '@/domain/entities/Repository';

describe('RepositoryMapper', () => {
  it('should map GraphQL response to Repository entity', () => {
    const graphql: RepositoryMapper.GraphQLRepository = {
      nameWithOwner: 'test/repo',
      url: 'https://github.com/test/repo',
      updatedAt: '2024-01-01T00:00:00Z',
      isPrivate: false,
      description: 'Test repository',
      owner: {
        login: 'test',
        name: 'Test User',
        avatarUrl: 'https://github.com/test.png',
        __typename: 'User',
      },
    };

    const repo = RepositoryMapper.toDomain(graphql);

    expect(repo).toBeInstanceOf(Repository);
    expect(repo.nameWithOwner).toBe('test/repo');
    expect(repo.url).toBe('https://github.com/test/repo');
    expect(repo.isPrivate).toBe(false);
    expect(repo.description).toBe('Test repository');
  });
});

