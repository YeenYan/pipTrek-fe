/**
 * User Registration Service
 *
 * Handles public registration requests and admin-side listing.
 * All operations go through the centralized GraphQL client.
 */

import { mutation, query, type GraphQLResponse } from '@/utils/graphqlClient'

/* ------------------------------------------------------------------ */
/*  TypeScript interfaces                                              */
/* ------------------------------------------------------------------ */

export interface RegistrationRequestResult {
  requestUserRegistration: {
    success: boolean
    message: string
  }
}

export interface RegistrationRequest {
  id: string
  username: string
  email: string
  status: string
  user_id: string | null
  created_at: string
  updated_at: string
}

export interface RegistrationRequestsResponse {
  userRegistrationRequests: RegistrationRequest[]
}

/* ------------------------------------------------------------------ */
/*  Service functions                                                  */
/* ------------------------------------------------------------------ */

/**
 * Submit a public registration request.
 * Does NOT create a user — records a pending request for admin review.
 */
export function requestUserRegistration(
  username: string,
  email: string,
): Promise<GraphQLResponse<RegistrationRequestResult>> {
  return mutation<RegistrationRequestResult>(
    `mutation RequestUserRegistration($input: RequestUserRegistrationInput!) {
      requestUserRegistration(input: $input) {
        success
        message
      }
    }`,
    { input: { username, email } },
  )
}

/**
 * Fetch registration requests (admin-only).
 * Optionally filter by status: "pending" | "created".
 */
export function getUserRegistrationRequests(
  status?: string,
): Promise<GraphQLResponse<RegistrationRequestsResponse>> {
  return query<RegistrationRequestsResponse>(
    `query UserRegistrationRequests($status: String) {
      userRegistrationRequests(status: $status) {
        id username email status user_id created_at updated_at
      }
    }`,
    status ? { status } : undefined,
  )
}
