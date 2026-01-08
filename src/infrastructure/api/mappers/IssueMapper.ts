import { Issue } from '@/domain/entities/Issue';
import { RepositoryMapper, GraphQLRepository } from './RepositoryMapper';
import { UserMapper, GraphQLUser } from './UserMapper';

export interface GraphQLIssue {
  number: number;
  title: string;
  state: 'OPEN' | 'CLOSED';
  url: string;
  updatedAt: string;
  repository: GraphQLRepository;
  comments: {
    totalCount: number;
  };
  assignees?: {
    nodes: GraphQLUser[];
  };
  labels?: {
    nodes: Array<{
      name: string;
      color: string;
    }>;
  };
}

/**
 * Maps GraphQL issue response to Issue entity
 */
export class IssueMapper {
  static toDomain(graphql: GraphQLIssue): Issue {
    const repository = RepositoryMapper.toDomain(graphql.repository);
    const assignees =
      graphql.assignees?.nodes.map((a) => UserMapper.toDomain(a)) ?? [];
    const labels = graphql.labels?.nodes ?? [];

    return Issue.fromPlain({
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
      commentsCount: graphql.comments.totalCount,
      assignees: assignees.map((a) => ({
        login: a.login,
        name: a.name,
        avatarUrl: a.avatarUrl,
      })),
      labels: labels.map((l) => ({
        name: l.name,
        color: l.color,
      })),
    });
  }

  static toDomainArray(graphqlArray: GraphQLIssue[]): Issue[] {
    return graphqlArray.map((issue) => this.toDomain(issue));
  }
}


