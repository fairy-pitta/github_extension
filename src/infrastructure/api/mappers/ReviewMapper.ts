import { Review } from '@/domain/entities/Review';
import { UserMapper, GraphQLUser } from './UserMapper';

export interface GraphQLReview {
  state: 'APPROVED' | 'COMMENTED' | 'CHANGES_REQUESTED' | 'DISMISSED' | 'PENDING';
  createdAt: string;
  body: string | null;
  author: GraphQLUser;
}

/**
 * Maps GraphQL review response to Review entity
 */
export class ReviewMapper {
  static toDomain(graphql: GraphQLReview): Review {
    const author = UserMapper.toDomain(graphql.author);

    return Review.fromPlain({
      state: graphql.state,
      author: {
        login: graphql.author.login,
        name: graphql.author.name ?? null,
        avatarUrl: graphql.author.avatarUrl ?? null,
      },
      createdAt: graphql.createdAt,
      body: graphql.body ?? null,
    });
  }

  static toDomainArray(graphqlArray: GraphQLReview[]): Review[] {
    return graphqlArray.map((review) => this.toDomain(review));
  }
}

