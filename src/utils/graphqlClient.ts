/**
 * Centralized GraphQL Client
 *
 * Provides a single, reusable client for all GraphQL operations.
 * Handles authorization headers, error extraction, and type-safe wrappers.
 *
 * Authentication interceptor:
 * - Detects HTTP 401 / 403 responses.
 * - Detects GraphQL-level "unauthenticated" errors.
 * - Fires a registered callback (registered by the router guards) so the app
 *   can clear state and redirect without creating a circular import cycle.
 */

import { getToken } from '@/utils/tokenStorage'

/** Base URL for the GraphQL endpoint — configurable via environment variable */
const GRAPHQL_URL =
  (import.meta.env.VITE_GRAPHQL_URL as string | undefined) ?? 'http://localhost:8000/graphql'

/** Standard shape returned by the GraphQL server */
export interface GraphQLResponse<T = unknown> {
  data?: T
  errors?: GraphQLError[]
}

/** Individual error object from the GraphQL response */
export interface GraphQLError {
  message: string
  extensions?: {
    category?: string
    validation?: Record<string, string[]>
  }
}

/* ------------------------------------------------------------------ */
/*  Unauthenticated handler                                            */
/* ------------------------------------------------------------------ */

/** Registered callback — set via registerUnauthHandler() */
let unauthHandler: (() => void) | null = null

/**
 * Debounce flag: prevents the same session expiry from triggering the
 * handler multiple times when several in-flight requests all fail at once.
 * Automatically resets after 5 s to allow re-login within the same tab.
 */
let isHandlingExpiry = false

/**
 * Fire the unauthenticated handler at most once per expiry event.
 * Skips silently when:
 *   - there is no registered handler,
 *   - we are already handling an expiry,
 *   - there is no token to invalidate (user was never logged in).
 */
function triggerUnauthenticated(): void {
  if (isHandlingExpiry || !unauthHandler || !getToken()) return
  isHandlingExpiry = true
  unauthHandler()
  // Reset the flag after enough time for re-login to complete
  setTimeout(() => {
    isHandlingExpiry = false
  }, 5_000)
}

/**
 * Register the callback that should run when a request detects an
 * invalid / expired session. Call this once during app initialisation
 * (e.g. inside setupGuards).
 *
 * The callback is responsible for clearing auth state and redirecting
 * the user — the GraphQL client itself has no knowledge of Vue Router.
 */
export function registerUnauthHandler(handler: () => void): void {
  unauthHandler = handler
}

/* ------------------------------------------------------------------ */
/*  Request                                                            */
/* ------------------------------------------------------------------ */

/**
 * Core request function — sends a GraphQL operation to the backend.
 *
 * @param operationQuery  The GraphQL query or mutation string
 * @param variables       Optional variables object
 * @returns               The parsed JSON response (data + errors)
 *
 * Automatically attaches the Authorization header when a token exists.
 * Throws on network errors and extracts GraphQL-level errors for callers.
 */
export async function request<T = unknown>(
  operationQuery: string,
  variables?: Record<string, unknown>,
): Promise<GraphQLResponse<T>> {
  const token = getToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: operationQuery, variables }),
  })

  // HTTP 401 / 403 — session is invalid at the transport level
  if (res.status === 401 || res.status === 403) {
    triggerUnauthenticated()
  }

  // Handle other HTTP-level failures (network errors, 500s, etc.)
  if (!res.ok) {
    throw new Error(`Network error: ${res.status} ${res.statusText}`)
  }

  const json: GraphQLResponse<T> = await res.json()

  // GraphQL-level authentication errors (HTTP 200 but auth failed)
  const hasAuthError = json.errors?.some(
    (e) =>
      e.extensions?.category === 'authentication' ||
      e.message?.toLowerCase().includes('unauthenticated') ||
      e.message?.toLowerCase().includes('unauthorized'),
  )
  if (hasAuthError) {
    triggerUnauthenticated()
  }

  return json
}

/**
 * Convenience wrapper for GraphQL queries.
 * Identical to request() — exists for semantic clarity at call sites.
 */
export async function query<T = unknown>(
  queryString: string,
  variables?: Record<string, unknown>,
): Promise<GraphQLResponse<T>> {
  return request<T>(queryString, variables)
}

/**
 * Convenience wrapper for GraphQL mutations.
 * Identical to request() — exists for semantic clarity at call sites.
 */
export async function mutation<T = unknown>(
  mutationString: string,
  variables?: Record<string, unknown>,
): Promise<GraphQLResponse<T>> {
  return request<T>(mutationString, variables)
}

/**
 * Extract the first user-facing error message from a GraphQL response.
 * Falls back to a generic message when the structure is unexpected.
 */
export function extractErrorMessage(response: GraphQLResponse): string {
  return response.errors?.[0]?.message ?? 'An unexpected error occurred.'
}

/**
 * Extract field-level validation errors from the response.
 * Returns an empty object when no validation errors exist.
 */
export function extractValidationErrors(response: GraphQLResponse): Record<string, string[]> {
  return response.errors?.[0]?.extensions?.validation ?? {}
}
