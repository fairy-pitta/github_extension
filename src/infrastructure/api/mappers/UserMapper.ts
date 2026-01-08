import { User } from '@/domain/entities/User';

export interface GraphQLUser {
  login: string;
  name?: string | null;
  avatarUrl?: string | null;
}

/**
 * Maps GraphQL user response to User entity
 */
export class UserMapper {
  static toDomain(graphql: GraphQLUser): User {
    return User.fromPlain({
      login: graphql.login,
      name: graphql.name ?? null,
      avatarUrl: graphql.avatarUrl ?? null,
    });
  }
}


