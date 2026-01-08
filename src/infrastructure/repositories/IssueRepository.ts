import { Issue } from '@/domain/entities/Issue';
import { IIssueRepository } from '@/domain/repositories/IIssueRepository';
import { GitHubGraphQLClient } from '../api/GitHubGraphQLClient';
import { IssueMapper } from '../api/mappers/IssueMapper';

const ISSUES_QUERY = `
  query GetInvolvedIssues($limit: Int!) {
    involvedIssues: search(
      query: "is:issue involves:@me archived:false sort:updated-desc"
      type: ISSUE
      first: $limit
    ) {
      nodes {
        ... on Issue {
          number
          title
          state
          url
          updatedAt
          repository {
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
          comments {
            totalCount
          }
          assignees(first: 10) {
            nodes {
              login
              name
              avatarUrl
            }
          }
          labels(first: 10) {
            nodes {
              name
              color
            }
          }
        }
      }
    }
  }
`;

/**
 * IssueRepository implementation
 */
export class IssueRepository implements IIssueRepository {
  constructor(private readonly graphqlClient: GitHubGraphQLClient) {}

  async getInvolved(limit: number): Promise<Issue[]> {
    const response = await this.graphqlClient.query<{
      involvedIssues: {
        nodes: IssueMapper.GraphQLIssue[];
      };
    }>(ISSUES_QUERY, { limit });

    const issues = response.involvedIssues?.nodes ?? [];
    return IssueMapper.toDomainArray(issues);
  }
}
