import { Repository } from './Repository';
import { User } from './User';

export type IssueState = 'OPEN' | 'CLOSED';

/**
 * Label entity for issues
 */
export class Label {
  constructor(
    public readonly name: string,
    public readonly color: string
  ) {}

  static fromPlain(plain: { name: string; color: string }): Label {
    return new Label(plain.name, plain.color);
  }
}

/**
 * Issue entity representing a GitHub issue
 */
export class Issue {
  constructor(
    public readonly number: number,
    public readonly title: string,
    public readonly state: IssueState,
    public readonly url: string,
    public readonly updatedAt: Date,
    public readonly repository: Repository,
    public readonly commentsCount: number,
    public readonly assignees: User[],
    public readonly labels: Label[]
  ) {}

  static fromPlain(plain: {
    number: number;
    title: string;
    state: IssueState;
    url: string;
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
    commentsCount?: number;
    assignees?: Array<{
      login: string;
      name?: string | null;
      avatarUrl?: string | null;
    }>;
    labels?: Array<{
      name: string;
      color: string;
    }>;
  }): Issue {
    const updatedAt =
      plain.updatedAt instanceof Date
        ? plain.updatedAt
        : new Date(plain.updatedAt);

    const repository = Repository.fromPlain(plain.repository);
    const assignees = (plain.assignees ?? []).map((a) => User.fromPlain(a));
    const labels = (plain.labels ?? []).map((l) => Label.fromPlain(l));

    return new Issue(
      plain.number,
      plain.title,
      plain.state,
      plain.url,
      updatedAt,
      repository,
      plain.commentsCount ?? 0,
      assignees,
      labels
    );
  }
}



