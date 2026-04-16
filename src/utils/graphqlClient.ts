/**
 * Centralized GraphQL Client
 *
 * Provides a single, reusable client for all GraphQL operations.
 * Handles authorization headers, error extraction, and type-safe wrappers.
 */

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

/**
 * Retrieve the stored JWT token from localStorage.
 * Returns null when the user is not authenticated.
 */
function getToken(): string | null {
  return localStorage.getItem('auth_token')
}

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

  // Handle HTTP-level failures (network errors, 500s, etc.)
  if (!res.ok) {
    throw new Error(`Network error: ${res.status} ${res.statusText}`)
  }

  const json: GraphQLResponse<T> = await res.json()
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
