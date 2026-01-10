import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IssueCard } from '../IssueCard';
import { Issue } from '@/domain/entities/Issue';

describe('IssueCard', () => {
  const mockIssue = Issue.fromPlain({
    number: 456,
    title: 'Test Issue',
    state: 'OPEN',
    url: 'https://github.com/test/repo/issues/456',
    updatedAt: new Date(),
    repository: {
      nameWithOwner: 'test/repo',
      url: 'https://github.com/test/repo',
      updatedAt: new Date(),
      isPrivate: false,
      owner: { login: 'test' },
    },
  });

  it('should render Issue card with correct information', () => {
    render(<IssueCard issue={mockIssue} />);

    expect(screen.getByText('Test Issue')).toBeInTheDocument();
    expect(screen.getByText('#456')).toBeInTheDocument();
    expect(screen.getByText('test/repo')).toBeInTheDocument();
  });

  it('should display labels when present', () => {
    const issueWithLabels = Issue.fromPlain({
      ...mockIssue,
      number: 456,
      title: 'Test Issue',
      state: 'OPEN',
      url: 'https://github.com/test/repo/issues/456',
      updatedAt: new Date(),
      repository: {
        nameWithOwner: 'test/repo',
        url: 'https://github.com/test/repo',
        updatedAt: new Date(),
        isPrivate: false,
        owner: { login: 'test' },
      },
      labels: [
        { name: 'bug', color: 'd73a4a' },
      ],
    });

    render(<IssueCard issue={issueWithLabels} />);

    expect(screen.getByText('bug')).toBeInTheDocument();
  });
});



