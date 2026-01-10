import { describe, it, expect } from 'vitest';
import { Issue } from '../Issue';

describe('Issue', () => {
  it('should create an Issue from plain object', () => {
    const plain = {
      number: 456,
      title: 'Test Issue',
      state: 'OPEN' as const,
      url: 'https://github.com/test/repo/issues/456',
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
      commentsCount: 10,
      assignees: [
        {
          login: 'assignee1',
          name: 'Assignee 1',
          avatarUrl: 'https://github.com/assignee1.png',
        },
      ],
      labels: [
        {
          name: 'bug',
          color: 'd73a4a',
        },
      ],
    };

    const issue = Issue.fromPlain(plain);

    expect(issue.number).toBe(456);
    expect(issue.title).toBe('Test Issue');
    expect(issue.state).toBe('OPEN');
    expect(issue.commentsCount).toBe(10);
    expect(issue.assignees).toHaveLength(1);
    expect(issue.assignees[0].login).toBe('assignee1');
    expect(issue.labels).toHaveLength(1);
    expect(issue.labels[0].name).toBe('bug');
    expect(issue.labels[0].color).toBe('d73a4a');
    expect(issue.updatedAt).toBeInstanceOf(Date);
  });

  it('should handle empty assignees and labels', () => {
    const plain = {
      number: 456,
      title: 'Test Issue',
      state: 'OPEN' as const,
      url: 'https://github.com/test/repo/issues/456',
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
    };

    const issue = Issue.fromPlain(plain);

    expect(issue.assignees).toHaveLength(0);
    expect(issue.labels).toHaveLength(0);
    expect(issue.commentsCount).toBe(0);
  });
});



