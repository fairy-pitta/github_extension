import { describe, it, expect } from 'vitest';
import { PullRequestMapper } from '../PullRequestMapper';
import { PullRequest } from '@/domain/entities/PullRequest';

describe('PullRequestMapper', () => {
  it('should map GraphQL response to PullRequest entity', () => {
    const graphql: PullRequestMapper.GraphQLPullRequest = {
      number: 123,
      title: 'Test PR',
      state: 'OPEN',
      url: 'https://github.com/test/repo/pull/123',
      updatedAt: '2024-01-01T00:00:00Z',
      repository: {
        nameWithOwner: 'test/repo',
        url: 'https://github.com/test/repo',
        updatedAt: '2024-01-01T00:00:00Z',
        isPrivate: false,
        description: 'Test repo',
        owner: {
          login: 'test',
          name: 'Test User',
          avatarUrl: 'https://github.com/test.png',
          __typename: 'User',
        },
      },
      reviewDecision: 'APPROVED',
      comments: {
        totalCount: 5,
      },
      author: {
        login: 'author',
        name: 'Author',
        avatarUrl: 'https://github.com/author.png',
      },
      reviews: {
        nodes: [
          {
            author: {
              login: 'reviewer',
              name: 'Reviewer',
              avatarUrl: 'https://github.com/reviewer.png',
            },
          },
        ],
      },
    };

    const pr = PullRequestMapper.toDomain(graphql);

    expect(pr).toBeInstanceOf(PullRequest);
    expect(pr.number).toBe(123);
    expect(pr.title).toBe('Test PR');
    expect(pr.state).toBe('OPEN');
    expect(pr.reviewDecision).toBe('APPROVED');
    expect(pr.commentsCount).toBe(5);
    expect(pr.reviewers).toHaveLength(1);
  });

  it('should map array of GraphQL responses', () => {
    const graphqlArray: PullRequestMapper.GraphQLPullRequest[] = [
      {
        number: 1,
        title: 'PR 1',
        state: 'OPEN',
        url: 'https://github.com/test/repo/pull/1',
        updatedAt: '2024-01-01T00:00:00Z',
        repository: {
          nameWithOwner: 'test/repo',
          url: 'https://github.com/test/repo',
          updatedAt: '2024-01-01T00:00:00Z',
          isPrivate: false,
          owner: {
            login: 'test',
            __typename: 'User',
          },
        },
        comments: { totalCount: 0 },
        author: {
          login: 'author',
        },
      },
    ];

    const prs = PullRequestMapper.toDomainArray(graphqlArray);

    expect(prs).toHaveLength(1);
    expect(prs[0]).toBeInstanceOf(PullRequest);
  });
});

