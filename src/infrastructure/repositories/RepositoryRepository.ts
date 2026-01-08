import { Repository } from '@/domain/entities/Repository';
import { IRepositoryRepository } from '@/domain/repositories/IRepositoryRepository';
import { GitHubGraphQLClient } from '../api/GitHubGraphQLClient';
import { RepositoryMapper } from '../api/mappers/RepositoryMapper';

const REPOSITORIES_QUERY = `
  query GetRepositories($limit: Int!, $cursor: String) {
    viewer {
      repositories(
        first: $limit
        after: $cursor
        orderBy: { field: UPDATED_AT, direction: DESC }
        affiliations: [OWNER, COLLABORATOR]
      ) {
        nodes {
          nameWithOwner
          url
          updatedAt
          isPrivate
          description
          owner {
            login
            ... on User {
              name
              avatarUrl
            }
            ... on Organization {
              name
              avatarUrl
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
      organizations(first: 10) {
        nodes {
          login
          name
          avatarUrl
          repositories(
            first: $limit
            orderBy: { field: UPDATED_AT, direction: DESC }
          ) {
            nodes {
              nameWithOwner
              url
              updatedAt
              isPrivate
              description
              owner {
                login
                ... on User {
                  name
                  avatarUrl
                }
                ... on Organization {
                  name
                  avatarUrl
                }
              }
            }
          }
        }
      }
    }
  }
`;

interface RepositoriesResponse {
  viewer: {
    repositories: {
      nodes: RepositoryMapper.GraphQLRepository[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    };
    organizations: {
      nodes: Array<{
        login: string;
        repositories: {
          nodes: RepositoryMapper.GraphQLRepository[];
        };
      }>;
    };
  };
}

/**
 * RepositoryRepository implementation
 */
export class RepositoryRepository implements IRepositoryRepository {
  constructor(private readonly graphqlClient: GitHubGraphQLClient) {}

  async getRecentlyUpdated(
    limit: number,
    cursor?: string
  ): Promise<{ repositories: Repository[]; nextCursor?: string }> {
    const response = await this.graphqlClient.query<RepositoriesResponse>(
      REPOSITORIES_QUERY,
      { limit, cursor: cursor ?? null }
    );

    const userRepos = response.viewer.repositories.nodes;
    const orgRepos = response.viewer.organizations.nodes.flatMap(
      (org) => org.repositories.nodes
    );

    // Merge and sort by updatedAt
    const allRepos = [...userRepos, ...orgRepos];
    allRepos.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return dateB - dateA; // Descending order (newest first)
    });

    // Take top N repositories
    const topRepos = allRepos.slice(0, limit);
    const repositories = RepositoryMapper.toDomainArray(topRepos);

    const nextCursor = response.viewer.repositories.pageInfo.hasNextPage
      ? response.viewer.repositories.pageInfo.endCursor ?? undefined
      : undefined;

    return { repositories, nextCursor };
  }

  async getByOrganizations(
    orgLogins: string[],
    limit: number
  ): Promise<Repository[]> {
    const response = await this.graphqlClient.query<RepositoriesResponse>(
      REPOSITORIES_QUERY,
      { limit }
    );

    const orgRepos = response.viewer.organizations.nodes
      .filter((org) => orgLogins.includes(org.login))
      .flatMap((org) => org.repositories.nodes);

    // Sort by updatedAt
    orgRepos.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return dateB - dateA;
    });

    return RepositoryMapper.toDomainArray(orgRepos.slice(0, limit));
  }
}
