import { PullRequest } from '@/domain/entities/PullRequest';
import { RepositoryMapper, GraphQLRepository } from './RepositoryMapper';
import { UserMapper, GraphQLUser } from './UserMapper';

export interface GraphQLPullRequest {
  number: number;
  title: string;
  state: 'OPEN' | 'CLOSED' | 'MERGED';
  url: string;
  updatedAt: string;
  repository: GraphQLRepository;
  reviewDecision?: 'APPROVED' | 'CHANGES_REQUESTED' | 'REVIEW_REQUIRED' | null;
  comments: {
    totalCount: number;
  };
  author: GraphQLUser;
  reviews?: {
    nodes: Array<{
      author: GraphQLUser;
    }>;
  };
}

/**
 * Maps GraphQL pull request response to PullRequest entity
 */
export class PullRequestMapper {
  static toDomain(graphql: GraphQLPullRequest): PullRequest {
    const repository = RepositoryMapper.toDomain(graphql.repository);
    const author = UserMapper.toDomain(graphql.author);
    const reviewers =
      graphql.reviews?.nodes.map((review) => UserMapper.toDomain(review.author)) ?? [];

    return PullRequest.fromPlain({
      number: graphql.number,
      title: graphql.title,
      state: graphql.state,
      url: graphql.url,
      updatedAt: graphql.updatedAt,
      repository: {
        nameWithOwner: graphql.repository.nameWithOwner,
        url: graphql.repository.url,
        updatedAt: graphql.repository.updatedAt,
        isPrivate: graphql.repository.isPrivate,
        description: graphql.repository.description ?? null,
        owner: {
          login: graphql.repository.owner.login,
          name: graphql.repository.owner.name ?? null,
          avatarUrl: graphql.repository.owner.avatarUrl ?? null,
          __typename: graphql.repository.owner.__typename,
        },
      },
      reviewDecision: graphql.reviewDecision ?? null,
      commentsCount: graphql.comments.totalCount,
      author: {
        login: graphql.author.login,
        name: graphql.author.name ?? null,
        avatarUrl: graphql.author.avatarUrl ?? null,
      },
      reviewers: reviewers.map((r) => ({
        login: r.login,
        name: r.name,
        avatarUrl: r.avatarUrl,
      })),
    });
  }

  static toDomainArray(graphqlArray: GraphQLPullRequest[]): PullRequest[] {
    return graphqlArray.map((pr) => this.toDomain(pr));
  }
}


