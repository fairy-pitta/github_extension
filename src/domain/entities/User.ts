/**
 * User entity representing a GitHub user
 */
export class User {
  constructor(
    public readonly login: string,
    public readonly name: string | null,
    public readonly avatarUrl: string | null
  ) {}

  static fromPlain(plain: {
    login: string;
    name?: string | null;
    avatarUrl?: string | null;
  }): User {
    return new User(plain.login, plain.name ?? null, plain.avatarUrl ?? null);
  }
}


