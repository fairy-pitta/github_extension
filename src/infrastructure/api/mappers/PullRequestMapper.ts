import { PullRequest } from '@/domain/entities/PullRequest';
import { RepositoryMapper, GraphQLRepository } from './RepositoryMapper';
import { UserMapper, GraphQLUser } from './UserMapper';
import { ReviewMapper, GraphQLReview } from './ReviewMapper';

export interface GraphQLPullRequest {
  number: number;
  title: string;
  state: 'OPEN' | 'CLOSED' | 'MERGED';
  url: string;
  createdAt?: string;
  updatedAt: string;
  repository: GraphQLRepository;
  reviewDecision?: 'APPROVED' | 'CHANGES_REQUESTED' | 'REVIEW_REQUIRED' | null;
  comments: {
    totalCount: number;
  };
  reviewThreads?: {
    totalCount: number;
  };
  author: GraphQLUser;
  reviews?: {
    nodes: GraphQLReview[];
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
    const reviews = graphql.reviews?.nodes
      ? ReviewMapper.toDomainArray(graphql.reviews.nodes)
      : [];

    // コメント数 = PRコメント + レビューコメント
    const commentsCount = graphql.comments.totalCount + (graphql.reviewThreads?.totalCount ?? 0);

    return PullRequest.fromPlain({
      number: graphql.number,
      title: graphql.title,
      state: graphql.state,
      url: graphql.url,
      createdAt: graphql.createdAt,
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
      commentsCount: commentsCount,
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
      reviews: reviews.map((review) => ({
        state: review.state,
        author: {
          login: review.author.login,
          name: review.author.name,
          avatarUrl: review.author.avatarUrl,
        },
        createdAt: review.createdAt,
        body: review.body,
      })),
    });
  }

  static toDomainArray(graphqlArray: GraphQLPullRequest[]): PullRequest[] {
    return graphqlArray.map((pr) => this.toDomain(pr));
  }
}


