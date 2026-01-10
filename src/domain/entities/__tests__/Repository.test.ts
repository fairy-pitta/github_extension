import { describe, it, expect } from 'vitest';
import { Repository } from '../Repository';
import { User } from '../User';
import { Organization } from '../Organization';

describe('Repository', () => {
  it('should create a Repository with User owner', () => {
    const plain = {
      nameWithOwner: 'user/repo',
      url: 'https://github.com/user/repo',
      updatedAt: '2024-01-01T00:00:00Z',
      isPrivate: false,
      description: 'Test repository',
      owner: {
        login: 'user',
        name: 'Test User',
        avatarUrl: 'https://github.com/user.png',
        __typename: 'User',
      },
    };

    const repo = Repository.fromPlain(plain);

    expect(repo.nameWithOwner).toBe('user/repo');
    expect(repo.url).toBe('https://github.com/user/repo');
    expect(repo.isPrivate).toBe(false);
    expect(repo.description).toBe('Test repository');
    expect(repo.owner).toBeInstanceOf(User);
    expect(repo.owner.login).toBe('user');
    expect(repo.updatedAt).toBeInstanceOf(Date);
  });

  it('should create a Repository with Organization owner', () => {
    const plain = {
      nameWithOwner: 'org/repo',
      url: 'https://github.com/org/repo',
      updatedAt: '2024-01-01T00:00:00Z',
      isPrivate: true,
      description: null,
      owner: {
        login: 'org',
        name: 'Test Org',
        avatarUrl: 'https://github.com/org.png',
        __typename: 'Organization',
      },
    };

    const repo = Repository.fromPlain(plain);

    expect(repo.nameWithOwner).toBe('org/repo');
    expect(repo.isPrivate).toBe(true);
    expect(repo.description).toBeNull();
    expect(repo.owner).toBeInstanceOf(Organization);
    expect(repo.owner.login).toBe('org');
  });

  it('should handle Date object for updatedAt', () => {
    const date = new Date('2024-01-01');
    const plain = {
      nameWithOwner: 'test/repo',
      url: 'https://github.com/test/repo',
      updatedAt: date,
      isPrivate: false,
      owner: {
        login: 'test',
      },
    };

    const repo = Repository.fromPlain(plain);

    expect(repo.updatedAt).toBe(date);
  });
});



