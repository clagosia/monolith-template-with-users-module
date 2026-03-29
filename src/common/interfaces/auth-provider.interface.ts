/**
 * Interface for authentication providers.
 * Implement this interface to add new authentication strategies
 * (e.g., Active Directory, LDAP, OAuth, SAML).
 */
export interface AuthProvider {
  /**
   * Validate user credentials against the provider.
   * @param username - The username or identifier
   * @param password - The password or secret
   * @returns The authenticated user payload or null if invalid
   */
  validateCredentials(
    username: string,
    password: string,
  ): Promise<AuthProviderResult | null>;

  /**
   * Get provider type identifier.
   */
  getProviderType(): string;
}

export interface AuthProviderResult {
  userId: string;
  username: string;
  email?: string;
  providerType: string;
  providerMetadata?: Record<string, unknown>;
}
