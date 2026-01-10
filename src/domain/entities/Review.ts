import { User } from './User';

export type ReviewState = 'APPROVED' | 'COMMENTED' | 'CHANGES_REQUESTED' | 'DISMISSED' | 'PENDING';

/**
 * Review entity representing a GitHub pull request review
 */
export class Review {
  constructor(
    public readonly state: ReviewState,
    public readonly author: User,
    public readonly createdAt: Date,
    public readonly body: string | null
  ) {}

  static fromPlain(plain: {
    state: ReviewState;
    author: {
      login: string;
      name?: string | null;
      avatarUrl?: string | null;
    };
    createdAt: string | Date;
    body?: string | null;
  }): Review {
    const createdAt =
      plain.createdAt instanceof Date
        ? plain.createdAt
        : new Date(plain.createdAt);

    const author = User.fromPlain(plain.author);

    return new Review(
      plain.state,
      author,
      createdAt,
      plain.body ?? null
    );
  }
}

