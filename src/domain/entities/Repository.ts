import { Organization } from './Organization';
import { User } from './User';

/**
 * Repository entity representing a GitHub repository
 */
export class Repository {
  constructor(
    public readonly nameWithOwner: string,
    public readonly url: string,
    public readonly updatedAt: Date,
    public readonly isPrivate: boolean,
    public readonly description: string | null,
    public readonly owner: User | Organization
  ) {}

  static fromPlain(plain: {
    nameWithOwner: string;
    url: string;
    updatedAt: string | Date;
    isPrivate: boolean;
    description?: string | null;
    owner: {
      login: string;
      name?: string | null;
      avatarUrl?: string | null;
      __typename?: string;
    };
  }): Repository {
    const updatedAt =
      plain.updatedAt instanceof Date
        ? plain.updatedAt
        : new Date(plain.updatedAt);

    const owner =
      plain.owner.__typename === 'Organization'
        ? Organization.fromPlain({
            login: plain.owner.login,
            name: plain.owner.name,
            avatarUrl: plain.owner.avatarUrl,
          })
        : User.fromPlain({
            login: plain.owner.login,
            name: plain.owner.name,
            avatarUrl: plain.owner.avatarUrl,
          });

    return new Repository(
      plain.nameWithOwner,
      plain.url,
      updatedAt,
      plain.isPrivate,
      plain.description ?? null,
      owner
    );
  }
}


