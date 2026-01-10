import { PullRequest } from '@/domain/entities/PullRequest';
import { IPullRequestRepository } from '@/domain/repositories/IPullRequestRepository';
import { GitHubGraphQLClient } from '../api/GitHubGraphQLClient';
import { PullRequestMapper } from '../api/mappers/PullRequestMapper';

const CREATED_PRS_QUERY = `
  query GetCreatedPRs($limit: Int!, $cursor: String) {
    createdPRs: search(
      query: "is:pr author:@me archived:false sort:updated-desc"
      type: ISSUE
      first: $limit
      after: $cursor
    ) {
      nodes {
        ... on PullRequest {
          number
          title
          state
          url
          createdAt
          updatedAt
          repository {
            nameWithOwner
            url
            updatedAt
            isPrivate
            description
            owner {
              __typename
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
          mergeable
          comments {
            totalCount
          }
          reviewThreads {
            totalCount
          }
          author {
            login
            ... on User {
              name
            }
            ... on Organization {
              name
            }
            avatarUrl
          }
          reviews(first: 10) {
            nodes {
              state
              createdAt
              body
              author {
                login
                ... on User {
                  name
                }
                ... on Organization {
                  name
                }
                avatarUrl
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const REVIEW_REQUESTED_PRS_QUERY = `
  query GetReviewRequestedPRs($limit: Int!, $cursor: String) {
    reviewRequestedPRs: search(
      query: "is:pr review-requested:@me archived:false sort:updated-desc"
      type: ISSUE
      first: $limit
      after: $cursor
    ) {
      nodes {
        ... on PullRequest {
          number
          title
          state
          url
          createdAt
          updatedAt
          repository {
            nameWithOwner
            url
            updatedAt
            isPrivate
            description
            owner {
              __typename
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
          mergeable
          comments {
            totalCount
          }
          reviewThreads {
            totalCount
          }
          author {
            login
            ... on User {
              name
            }
            ... on Organization {
              name
            }
            avatarUrl
          }
          reviews(first: 10) {
            nodes {
              state
              createdAt
              body
              author {
                login
                ... on User {
                  name
                }
                ... on Organization {
                  name
                }
                avatarUrl
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

interface CreatedPRsResponse {
  createdPRs: {
    nodes: PullRequestMapper.GraphQLPullRequest[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

interface ReviewRequestedPRsResponse {
  reviewRequestedPRs: {
    nodes: PullRequestMapper.GraphQLPullRequest[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

const REVIEWED_BY_ME_PRS_QUERY = `
  query GetReviewedByMePRs($limit: Int!, $cursor: String) {
    reviewedByMePRs: search(
      query: "is:pr reviewed-by:@me archived:false sort:updated-desc"
      type: ISSUE
      first: $limit
      after: $cursor
    ) {
      nodes {
        ... on PullRequest {
          number
          title
          state
          url
          createdAt
          updatedAt
          repository {
            nameWithOwner
            url
            updatedAt
            isPrivate
            description
            owner {
              __typename
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
          mergeable
          comments {
            totalCount
          }
          reviewThreads {
            totalCount
          }
          author {
            login
            ... on User {
              name
            }
            ... on Organization {
              name
            }
            avatarUrl
          }
          reviews(first: 10) {
            nodes {
              state
              createdAt
              body
              author {
                login
                ... on User {
                  name
                }
                ... on Organization {
                  name
                }
                avatarUrl
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

interface ReviewedByMePRsResponse {
  reviewedByMePRs: {
    nodes: PullRequestMapper.GraphQLPullRequest[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

const COMMENTED_BY_ME_PRS_QUERY = `
  query GetCommentedByMePRs($limit: Int!, $cursor: String) {
    commentedByMePRs: search(
      query: "is:pr commenter:@me archived:false sort:updated-desc"
      type: ISSUE
      first: $limit
      after: $cursor
    ) {
      nodes {
        ... on PullRequest {
          number
          title
          state
          url
          createdAt
          updatedAt
          repository {
            nameWithOwner
            url
            updatedAt
            isPrivate
            description
            owner {
              __typename
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
          mergeable
          comments {
            totalCount
          }
          reviewThreads {
            totalCount
          }
          author {
            login
            ... on User {
              name
            }
            ... on Organization {
              name
            }
            avatarUrl
          }
          reviews(first: 10) {
            nodes {
              state
              createdAt
              body
              author {
                login
                ... on User {
                  name
                }
                ... on Organization {
                  name
                }
                avatarUrl
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

interface CommentedByMePRsResponse {
  commentedByMePRs: {
    nodes: PullRequestMapper.GraphQLPullRequest[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

/**
 * PullRequestRepository implementation
 */
export class PullRequestRepository implements IPullRequestRepository {
  constructor(private readonly graphqlClient: GitHubGraphQLClient) {}

  async getCreatedByMe(limit: number, cursor?: string): Promise<{ prs: PullRequest[]; nextCursor?: string }> {
    const response = await this.graphqlClient.query<CreatedPRsResponse>(
      CREATED_PRS_QUERY,
      { limit, cursor: cursor ?? null }
    );

    const prs = response.createdPRs?.nodes ?? [];
    const pageInfo = response.createdPRs?.pageInfo;
    const nextCursor = pageInfo?.hasNextPage && pageInfo?.endCursor
      ? pageInfo.endCursor
      : undefined;

    return {
      prs: PullRequestMapper.toDomainArray(prs),
      nextCursor,
    };
  }

  async getReviewRequested(limit: number, cursor?: string): Promise<{ prs: PullRequest[]; nextCursor?: string }> {
    const response = await this.graphqlClient.query<ReviewRequestedPRsResponse>(
      REVIEW_REQUESTED_PRS_QUERY,
      { limit, cursor: cursor ?? null }
    );

    const prs = response.reviewRequestedPRs?.nodes ?? [];
    const pageInfo = response.reviewRequestedPRs?.pageInfo;
    const nextCursor = pageInfo?.hasNextPage && pageInfo?.endCursor
      ? pageInfo.endCursor
      : undefined;

    return {
      prs: PullRequestMapper.toDomainArray(prs),
      nextCursor,
    };
  }

  async getReviewedByMe(limit: number, cursor?: string): Promise<{ prs: PullRequest[]; nextCursor?: string }> {
    const response = await this.graphqlClient.query<ReviewedByMePRsResponse>(
      REVIEWED_BY_ME_PRS_QUERY,
      { limit, cursor: cursor ?? null }
    );

    const prs = response.reviewedByMePRs?.nodes ?? [];
    const pageInfo = response.reviewedByMePRs?.pageInfo;
    const nextCursor = pageInfo?.hasNextPage && pageInfo?.endCursor
      ? pageInfo.endCursor
      : undefined;

    return {
      prs: PullRequestMapper.toDomainArray(prs),
      nextCursor,
    };
  }

  async getCommentedByMe(limit: number, cursor?: string): Promise<{ prs: PullRequest[]; nextCursor?: string }> {
    const response = await this.graphqlClient.query<CommentedByMePRsResponse>(
      COMMENTED_BY_ME_PRS_QUERY,
      { limit, cursor: cursor ?? null }
    );

    const prs = response.commentedByMePRs?.nodes ?? [];
    const pageInfo = response.commentedByMePRs?.pageInfo;
    const nextCursor = pageInfo?.hasNextPage && pageInfo?.endCursor
      ? pageInfo.endCursor
      : undefined;

    return {
      prs: PullRequestMapper.toDomainArray(prs),
      nextCursor,
    };
  }
}
