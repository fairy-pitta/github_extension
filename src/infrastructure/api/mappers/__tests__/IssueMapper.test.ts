import { describe, it, expect } from 'vitest';
import { IssueMapper } from '../IssueMapper';
import { Issue } from '@/domain/entities/Issue';

describe('IssueMapper', () => {
  it('should map GraphQL response to Issue entity', () => {
    const graphql: IssueMapper.GraphQLIssue = {
      number: 456,
      title: 'Test Issue',
      state: 'OPEN',
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
          __typename: 'User',
        },
      },
      comments: {
        totalCount: 10,
      },
      assignees: {
        nodes: [
          {
            login: 'assignee',
            name: 'Assignee',
            avatarUrl: 'https://github.com/assignee.png',
          },
        ],
      },
      labels: {
        nodes: [
          {
            name: 'bug',
            color: 'd73a4a',
          },
        ],
      },
    };

    const issue = IssueMapper.toDomain(graphql);

    expect(issue).toBeInstanceOf(Issue);
    expect(issue.number).toBe(456);
    expect(issue.title).toBe('Test Issue');
    expect(issue.state).toBe('OPEN');
    expect(issue.commentsCount).toBe(10);
    expect(issue.assignees).toHaveLength(1);
    expect(issue.labels).toHaveLength(1);
  });
});



