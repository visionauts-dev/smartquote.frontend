/**
 * JWT Token Utility Functions
 * Extract user information from JWT token claims
 */

export interface TokenClaims {
  email?: string;
  emailAddress?: string;
  nameIdentifier?: string;
  role?: string;
  organizationId?: string;
  exp?: number;
  iss?: string;
  aud?: string;
  [key: string]: any;
}

/**
 * Decode JWT token and extract claims
 */
export const decodeToken = (token: string): TokenClaims | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const decoded = atob(parts[1]);
    return JSON.parse(decoded) as TokenClaims;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Extract email from JWT claims
 */
export const getEmailFromToken = (token: string): string | null => {
  const claims = decodeToken(token);
  if (!claims) return null;

  // Check common email claim names
  return (
    claims.emailAddress ||
    claims.email ||
    claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
    null
  );
};

/**
 * Extract role from JWT claims
 */
export const getRoleFromToken = (token: string): string | null => {
  const claims = decodeToken(token);
  if (!claims) return null;

  return (
    claims.role ||
    claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
    null
  );
};

/**
 * Extract user ID from JWT claims
 */
export const getUserIdFromToken = (token: string): string | null => {
  const claims = decodeToken(token);
  if (!claims) return null;

  return (
    claims.sub ||
    claims.userId ||
    claims.nameIdentifier ||
    claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
    null
  );
};

/**
 * Extract organization ID from JWT claims
 */
export const getOrganizationIdFromToken = (token: string): string | null => {
  const claims = decodeToken(token);
  if (!claims) return null;

  return claims.organizationId || claims.OrganizationId || null;
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const claims = decodeToken(token);
  if (!claims || !claims.exp) return false;

  const currentTime = Math.floor(Date.now() / 1000);
  return claims.exp < currentTime;
};

/**
 * Extract all user data from token claims
 */
export const extractUserFromToken = (token: string) => {
  return {
    id: getUserIdFromToken(token) || '',
    email: getEmailFromToken(token) || '',
    role: getRoleFromToken(token) || '',
    organizationId: getOrganizationIdFromToken(token) || '',
  };
};
