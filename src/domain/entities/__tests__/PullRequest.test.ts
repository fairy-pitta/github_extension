import { describe, it, expect } from 'vitest';
import { PullRequest } from '../PullRequest';
import { Repository } from '../Repository';
import { User } from '../User';

describe('PullRequest', () => {
  const mockRepository: Repository = Repository.fromPlain({
    nameWithOwner: 'test/repo',
    url: 'https://github.com/test/repo',
    updatedAt: new Date('2024-01-01'),
    isPrivate: false,
    description: 'Test repo',
    owner: {
      login: 'test',
      name: 'Test User',
      avatarUrl: 'https://github.com/test.png',
    },
  });

  const mockAuthor: User = User.fromPlain({
    login: 'author',
    name: 'Author',
    avatarUrl: 'https://github.com/author.png',
  });

  it('should create a PullRequest from plain object', () => {
    const plain = {
      number: 123,
      title: 'Test PR',
      state: 'OPEN' as const,
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
        },
      },
      reviewDecision: 'APPROVED' as const,
      commentsCount: 5,
      author: {
        login: 'author',
        name: 'Author',
        avatarUrl: 'https://github.com/author.png',
      },
      reviewers: [
        {
          login: 'reviewer1',
          name: 'Reviewer 1',
          avatarUrl: 'https://github.com/reviewer1.png',
        },
      ],
    };

    const pr = PullRequest.fromPlain(plain);

    expect(pr.number).toBe(123);
    expect(pr.title).toBe('Test PR');
    expect(pr.state).toBe('OPEN');
    expect(pr.reviewDecision).toBe('APPROVED');
    expect(pr.commentsCount).toBe(5);
    expect(pr.reviewers).toHaveLength(1);
    expect(pr.reviewers[0].login).toBe('reviewer1');
    expect(pr.updatedAt).toBeInstanceOf(Date);
  });

  it('should handle null reviewDecision', () => {
    const plain = {
      number: 123,
      title: 'Test PR',
      state: 'OPEN' as const,
      url: 'https://github.com/test/repo/pull/123',
      updatedAt: new Date(),
      repository: {
        nameWithOwner: 'test/repo',
        url: 'https://github.com/test/repo',
        updatedAt: new Date(),
        isPrivate: false,
        owner: {
          login: 'test',
        },
      },
      author: {
        login: 'author',
      },
    };

    const pr = PullRequest.fromPlain(plain);

    expect(pr.reviewDecision).toBeNull();
    expect(pr.commentsCount).toBe(0);
    expect(pr.reviewers).toHaveLength(0);
  });
});


