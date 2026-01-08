import { User } from '@/domain/entities/User';
import { IAuthRepository } from '@/domain/repositories/IAuthRepository';
import { AuthenticationError } from '@/domain/errors/DomainError';
import { GitHubGraphQLClient } from '../api/GitHubGraphQLClient';
import { UserMapper } from '../api/mappers/UserMapper';

const USER_QUERY = `
  query GetCurrentUser {
    viewer {
      login
      name
      avatarUrl
    }
  }
`;

/**
 * AuthRepository implementation
 */
export class AuthRepository implements IAuthRepository {
  constructor(private readonly graphqlClient: GitHubGraphQLClient) {}

  async validateToken(token: string): Promise<User> {
    try {
      const client = new GitHubGraphQLClient(token);
      const response = await client.query<{ viewer: UserMapper.GraphQLUser }>(
        USER_QUERY
      );

      if (!response.viewer) {
        throw new AuthenticationError('Invalid token: no user data returned');
      }

      return UserMapper.toDomain(response.viewer);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new AuthenticationError('Failed to validate token');
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.graphqlClient.query<{
      viewer: UserMapper.GraphQLUser;
    }>(USER_QUERY);

    if (!response.viewer) {
      throw new AuthenticationError('No current user data');
    }

    return UserMapper.toDomain(response.viewer);
  }
}

