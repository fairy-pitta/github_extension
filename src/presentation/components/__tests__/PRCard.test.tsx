import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PRCard } from '../PRCard';
import { PullRequest } from '@/domain/entities/PullRequest';

describe('PRCard', () => {
  const mockPR = PullRequest.fromPlain({
    number: 123,
    title: 'Test PR',
    state: 'OPEN',
    url: 'https://github.com/test/repo/pull/123',
    updatedAt: new Date(),
    repository: {
      nameWithOwner: 'test/repo',
      url: 'https://github.com/test/repo',
      updatedAt: new Date(),
      isPrivate: false,
      owner: { login: 'test' },
    },
    author: { login: 'author' },
  });

  it('should render PR card with correct information', () => {
    render(<PRCard pr={mockPR} />);

    expect(screen.getByText('Test PR')).toBeInTheDocument();
    expect(screen.getByText('#123')).toBeInTheDocument();
    expect(screen.getByText('test/repo')).toBeInTheDocument();
  });

  it('should call onClick when provided', () => {
    const onClick = vi.fn();
    render(<PRCard pr={mockPR} onClick={onClick} />);

    const card = screen.getByText('Test PR').closest('.card');
    card?.click();

    expect(onClick).toHaveBeenCalled();
  });

  it('should open GitHub URL when clicked without onClick handler', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<PRCard pr={mockPR} />);

    const card = screen.getByText('Test PR').closest('.card');
    card?.click();

    expect(openSpy).toHaveBeenCalledWith('https://github.com/test/repo/pull/123', '_blank');
    openSpy.mockRestore();
  });
});


