/**
 * Token Storage Utility
 *
 * Single source of truth for all authentication-related localStorage keys.
 * Has zero Vue/Pinia dependencies so it can be safely imported by the
 * GraphQL client without creating circular-import cycles.
 */

const AUTH_TOKEN_KEY = 'auth_token'
const OTP_PENDING_KEY = 'otp_pending'

/* ------------------------------------------------------------------ */
/*  Access token                                                       */
/* ------------------------------------------------------------------ */

export function getToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function removeToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

/* ------------------------------------------------------------------ */
/*  OTP pending flag                                                   */
/* ------------------------------------------------------------------ */

export function getOtpPending(): string | null {
  return localStorage.getItem(OTP_PENDING_KEY)
}

export function setOtpPending(): void {
  localStorage.setItem(OTP_PENDING_KEY, '1')
}

export function removeOtpPending(): void {
  localStorage.removeItem(OTP_PENDING_KEY)
}

/* ------------------------------------------------------------------ */
/*  Bulk clear                                                         */
/* ------------------------------------------------------------------ */

/**
 * Remove every auth-related key at once.
 * Call this during logout or session expiry.
 */
export function clearAllAuthKeys(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(OTP_PENDING_KEY)
}
