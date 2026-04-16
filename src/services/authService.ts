/**
 * Authentication Service
 *
 * Encapsulates every auth-related GraphQL operation.
 * Components never call the GraphQL client directly — they go through this service.
 */

import { mutation, query, type GraphQLResponse } from '@/utils/graphqlClient'

/* ------------------------------------------------------------------ */
/*  TypeScript interfaces matching the backend response shapes        */
/* ------------------------------------------------------------------ */

export interface Role {
  id: string
  name: string
}

export interface User {
  id: string
  name: string
  email: string
  roles?: Role[]
  two_factor_enabled?: boolean
  is_first_login?: boolean
  created_at?: string
  updated_at?: string
}

export interface LoginResponse {
  login: {
    user: User
    token: string | null
    requires_otp: boolean
    is_first_login: boolean
    message: string
  }
}

export interface RegisterResponse {
  register: {
    user: User
    message: string
  }
}

export interface ChangePasswordResponse {
  changePassword: {
    user: User
    token: string
    message: string
  }
}

export interface VerifyOtpResponse {
  verifyOtp: {
    user: User
    token: string
    message: string
  }
}

export interface ResendOtpResponse {
  resendOtp: {
    message: string
  }
}

export interface ForgotPasswordResponse {
  forgotPassword: {
    message: string
  }
}

export interface ResetPasswordResponse {
  resetPassword: {
    message: string
  }
}

export interface RefreshTokenResponse {
  refreshToken: {
    token: string
    message: string
  }
}

export interface LogoutResponse {
  logout: {
    message: string
  }
}

export interface MeResponse {
  me: User
}

/* ------------------------------------------------------------------ */
/*  Service functions                                                  */
/* ------------------------------------------------------------------ */

/**
 * Authenticate a user with email and password.
 * May return flags for OTP or first-login password change.
 */
export function login(email: string, password: string): Promise<GraphQLResponse<LoginResponse>> {
  return mutation<LoginResponse>(
    `mutation Login($input: LoginInput!) {
      login(input: $input)
    }`,
    { input: { email, password } },
  )
}

/**
 * Register a new user (admin-only).
 * A temporary password is emailed to the new user.
 */
export function register(
  name: string,
  email: string,
  twoFactorEnabled = false,
): Promise<GraphQLResponse<RegisterResponse>> {
  return mutation<RegisterResponse>(
    `mutation Register($input: RegisterInput!) {
      register(input: $input) {
        user { id name email two_factor_enabled is_first_login }
        message
      }
    }`,
    { input: { name, email, two_factor_enabled: twoFactorEnabled } },
  )
}

/**
 * Change password on first login.
 * Uses the temporary token from login; returns a full-access token.
 */
export function changePassword(
  password: string,
  passwordConfirmation: string,
): Promise<GraphQLResponse<ChangePasswordResponse>> {
  return mutation<ChangePasswordResponse>(
    `mutation ChangePassword($input: ChangePasswordInput!) {
      changePassword(input: $input) {
        user { id name email is_first_login }
        token
        message
      }
    }`,
    { input: { password, password_confirmation: passwordConfirmation } },
  )
}

/**
 * Verify a 6-digit OTP code sent via email.
 * Returns a full token on success.
 */
export function verifyOtp(email: string, otp: string): Promise<GraphQLResponse<VerifyOtpResponse>> {
  return mutation<VerifyOtpResponse>(
    `mutation VerifyOtp($input: VerifyOtpInput!) {
      verifyOtp(input: $input) {
        user { id name email }
        token
        message
      }
    }`,
    { input: { email, otp } },
  )
}

/**
 * Request a new OTP code to be sent to the given email address.
 */
export function resendOtp(email: string): Promise<GraphQLResponse<ResendOtpResponse>> {
  return mutation<ResendOtpResponse>(
    `mutation ResendOtp($input: ResendOtpInput!) {
      resendOtp(input: $input)
    }`,
    { input: { email } },
  )
}

/**
 * Trigger a password-reset email for the given address.
 * Response is always the same (prevents email enumeration).
 */
export function forgotPassword(email: string): Promise<GraphQLResponse<ForgotPasswordResponse>> {
  return mutation<ForgotPasswordResponse>(
    `mutation ForgotPassword($input: ForgotPasswordInput!) {
      forgotPassword(input: $input)
    }`,
    { input: { email } },
  )
}

/**
 * Set a new password using the token received via email.
 */
export function resetPassword(
  token: string,
  password: string,
  passwordConfirmation: string,
): Promise<GraphQLResponse<ResetPasswordResponse>> {
  return mutation<ResetPasswordResponse>(
    `mutation ResetPassword($input: ResetPasswordInput!) {
      resetPassword(input: $input)
    }`,
    { input: { token, password, password_confirmation: passwordConfirmation } },
  )
}

/**
 * Exchange the current (still valid) JWT for a fresh one.
 * The old token is invalidated.
 */
export function refreshToken(): Promise<GraphQLResponse<RefreshTokenResponse>> {
  return mutation<RefreshTokenResponse>(
    `mutation RefreshToken {
      refreshToken
    }`,
  )
}

/**
 * Invalidate the current session token.
 */
export function logout(): Promise<GraphQLResponse<LogoutResponse>> {
  return mutation<LogoutResponse>(
    `mutation Logout {
      logout
    }`,
  )
}

/**
 * Fetch the currently authenticated user's profile.
 */
export function me(): Promise<GraphQLResponse<MeResponse>> {
  return query<MeResponse>(
    `query Me {
      me {
        id
        name
        email
        two_factor_enabled
        is_first_login
        created_at
        updated_at
        roles {
          id
          name
        }
      }
    }`,
  )
}
