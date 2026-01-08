/**
 * Organization entity representing a GitHub organization
 */
export class Organization {
  constructor(
    public readonly login: string,
    public readonly name: string | null,
    public readonly avatarUrl: string | null
  ) {}

  static fromPlain(plain: {
    login: string;
    name?: string | null;
    avatarUrl?: string | null;
  }): Organization {
    return new Organization(
      plain.login,
      plain.name ?? null,
      plain.avatarUrl ?? null
    );
  }
}


