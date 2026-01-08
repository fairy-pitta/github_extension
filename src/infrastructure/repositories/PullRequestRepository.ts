import { PullRequest } from '@/domain/entities/PullRequest';
import { IPullRequestRepository } from '@/domain/repositories/IPullRequestRepository';
import { GitHubGraphQLClient } from '../api/GitHubGraphQLClient';
import { PullRequestMapper } from '../api/mappers/PullRequestMapper';

const DASHBOARD_QUERY = `
  query DashboardData($limit: Int!) {
    createdPRs: search(
      query: "is:pr author:@me archived:false sort:updated-desc"
      type: ISSUE
      first: $limit
    ) {
      nodes {
        ... on PullRequest {
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
          reviewDecision
          comments {
            totalCount
          }
          author {
            login
            name
            avatarUrl
          }
          reviews(first: 10) {
            nodes {
              author {
                login
                name
                avatarUrl
              }
            }
          }
        }
      }
    }
    reviewRequestedPRs: search(
      query: "is:pr review-requested:@me archived:false sort:updated-desc"
      type: ISSUE
      first: $limit
    ) {
      nodes {
        ... on PullRequest {
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
          reviewDecision
          comments {
            totalCount
          }
          author {
            login
            name
            avatarUrl
          }
          reviews(first: 10) {
            nodes {
              author {
                login
                name
                avatarUrl
              }
            }
          }
        }
      }
    }
  }
`;

interface DashboardResponse {
  createdPRs: {
    nodes: PullRequestMapper.GraphQLPullRequest[];
  };
  reviewRequestedPRs: {
    nodes: PullRequestMapper.GraphQLPullRequest[];
  };
}

/**
 * PullRequestRepository implementation
 */
export class PullRequestRepository implements IPullRequestRepository {
  constructor(private readonly graphqlClient: GitHubGraphQLClient) {}

  async getCreatedByMe(limit: number): Promise<PullRequest[]> {
    const response = await this.graphqlClient.query<DashboardResponse>(
      DASHBOARD_QUERY,
      { limit }
    );

    const prs = response.createdPRs?.nodes ?? [];
    return PullRequestMapper.toDomainArray(prs);
  }

  async getReviewRequested(limit: number): Promise<PullRequest[]> {
    const response = await this.graphqlClient.query<DashboardResponse>(
      DASHBOARD_QUERY,
      { limit }
    );

    const prs = response.reviewRequestedPRs?.nodes ?? [];
    return PullRequestMapper.toDomainArray(prs);
  }

  async getReviewedByMe(limit: number): Promise<PullRequest[]> {
    // This will be implemented in future phases
    // For now, return empty array
    return [];
  }
}
