import { Repository } from '@/domain/entities/Repository';

export interface GraphQLRepository {
  nameWithOwner: string;
  url: string;
  updatedAt: string;
  isPrivate: boolean;
  description?: string | null;
  owner: {
    login: string;
    name?: string | null;
    avatarUrl?: string | null;
    __typename?: string;
  };
}

/**
 * Maps GraphQL repository response to Repository entity
 */
export class RepositoryMapper {
  static toDomain(graphql: GraphQLRepository): Repository {
    return Repository.fromPlain({
      nameWithOwner: graphql.nameWithOwner,
      url: graphql.url,
      updatedAt: graphql.updatedAt,
      isPrivate: graphql.isPrivate,
      description: graphql.description ?? null,
      owner: {
        login: graphql.owner.login,
        name: graphql.owner.name ?? null,
        avatarUrl: graphql.owner.avatarUrl ?? null,
        __typename: graphql.owner.__typename,
      },
    });
  }

  static toDomainArray(graphqlArray: GraphQLRepository[]): Repository[] {
    return graphqlArray.map((repo) => this.toDomain(repo));
  }
}

