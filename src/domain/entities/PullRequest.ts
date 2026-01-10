import { Repository } from './Repository';
import { User } from './User';
import { Review } from './Review';

export type PullRequestState = 'OPEN' | 'CLOSED' | 'MERGED';
export type ReviewDecision = 'APPROVED' | 'CHANGES_REQUESTED' | 'REVIEW_REQUIRED' | null;
export type MergeableState = 'MERGEABLE' | 'CONFLICTING' | 'UNKNOWN';

/**
 * PullRequest entity representing a GitHub pull request
 */
export class PullRequest {
  constructor(
    public readonly number: number,
    public readonly title: string,
    public readonly state: PullRequestState,
    public readonly url: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly repository: Repository,
    public readonly reviewDecision: ReviewDecision,
    public readonly commentsCount: number,
    public readonly author: User,
    public readonly reviewers: User[],
    public readonly reviews: Review[],
    public readonly mergeable: MergeableState = 'UNKNOWN'
  ) {}

  static fromPlain(plain: {
    number: number;
    title: string;
    state: PullRequestState;
    url: string;
    createdAt?: string | Date;
    updatedAt: string | Date;
    repository: {
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
    };
    reviewDecision?: ReviewDecision;
    commentsCount?: number;
    author: {
      login: string;
      name?: string | null;
      avatarUrl?: string | null;
    };
    reviewers?: Array<{
      login: string;
      name?: string | null;
      avatarUrl?: string | null;
    }>;
    reviews?: Array<{
      state: 'APPROVED' | 'COMMENTED' | 'CHANGES_REQUESTED' | 'DISMISSED' | 'PENDING';
      author: {
        login: string;
        name?: string | null;
        avatarUrl?: string | null;
      };
      createdAt: string | Date;
      body?: string | null;
    }>;
    mergeable?: MergeableState;
  }): PullRequest {
    const createdAt =
      plain.createdAt === undefined
        ? (plain.updatedAt instanceof Date ? plain.updatedAt : new Date(plain.updatedAt))
        : plain.createdAt instanceof Date
          ? plain.createdAt
          : new Date(plain.createdAt);
    const updatedAt =
      plain.updatedAt instanceof Date
        ? plain.updatedAt
        : new Date(plain.updatedAt);

    const repository = Repository.fromPlain(plain.repository);
    const author = User.fromPlain(plain.author);
    const reviewers = (plain.reviewers ?? []).map((r) => User.fromPlain(r));
    const reviews = (plain.reviews ?? []).map((r) => Review.fromPlain(r));

    return new PullRequest(
      plain.number,
      plain.title,
      plain.state,
      plain.url,
      createdAt,
      updatedAt,
      repository,
      plain.reviewDecision ?? null,
      plain.commentsCount ?? 0,
      author,
      reviewers,
      reviews,
      plain.mergeable ?? 'UNKNOWN'
    );
  }
}


