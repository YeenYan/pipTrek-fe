/**
 * useAuth Composable
 *
 * Manages authentication state (token, user) and exposes
 * login / logout / token helpers. Shared across the entire app
 * via a module-level reactive singleton.
 */

import { reactive, computed } from 'vue'
import * as authService from '@/services/authService'
import type { User } from '@/services/authService'
import { extractErrorMessage, extractValidationErrors } from '@/utils/graphqlClient'
import {
  getToken,
  setToken as storageSetToken,
  getOtpPending,
  setOtpPending,
  removeOtpPending,
  clearAllAuthKeys,
} from '@/utils/tokenStorage'

/* ------------------------------------------------------------------ */
/*  Singleton state — lives outside the composable so it's shared      */
/* ------------------------------------------------------------------ */

interface AuthState {
  user: User | null
  token: string | null
  isFirstLogin: boolean
  requiresOtp: boolean
  otpVerified: boolean
  otpEmail: string
  loading: boolean
}

const state = reactive<AuthState>({
  user: null,
  token: getToken(),
  isFirstLogin: false,
  requiresOtp: false,
  otpVerified: !getOtpPending(),
  otpEmail: '',
  loading: false,
})

/* ------------------------------------------------------------------ */
/*  Composable                                                         */
/* ------------------------------------------------------------------ */

export function useAuth() {
  /** Whether the user currently holds a valid token */
  const isAuthenticated = computed(() => !!state.token)

  /**
   * Persist the JWT token to localStorage and reactive state.
   */
  function setToken(token: string) {
    state.token = token
    storageSetToken(token)
  }

  /**
   * Remove all auth data from storage and reset reactive state.
   * Safe to call multiple times (idempotent).
   */
  function clearSession() {
    state.token = null
    state.user = null
    state.isFirstLogin = false
    state.requiresOtp = false
    state.otpVerified = true
    state.otpEmail = ''
    clearAllAuthKeys()
  }

  /**
   * Perform login, handle branching flows (first login, OTP).
   * Returns an object indicating the next step the UI should take.
   */
  async function login(email: string, password: string) {
    state.loading = true
    try {
      const res = await authService.login(email, password)

      if (res.errors) {
        return {
          success: false,
          message: extractErrorMessage(res),
          validation: extractValidationErrors(res),
        }
      }

      const data = res.data!.login

      state.user = data.user
      state.isFirstLogin = data.is_first_login
      state.requiresOtp = data.requires_otp

      // Determine next step for the caller
      if (data.requires_otp) {
        // Do NOT store the token yet — OTP must be verified first.
        // The backend may return a temporary token or null;
        // either way, withhold it so the user cannot access
        // protected routes before OTP verification.
        state.otpEmail = email
        state.otpVerified = false
        setOtpPending()
        return { success: true, next: 'otp' as const, message: data.message }
      }

      // First-login (no OTP): store the temporary token so
      // changePassword can use it, then redirect.
      if (data.token) {
        setToken(data.token)
      }

      if (data.is_first_login) {
        return { success: true, next: 'change-password' as const, message: data.message }
      }

      state.otpVerified = true
      removeOtpPending()
      return { success: true, next: 'dashboard' as const, message: data.message }
    } catch (err) {
      return { success: false, message: (err as Error).message }
    } finally {
      state.loading = false
    }
  }

  /**
   * Verify OTP and store the full token on success.
   */
  async function verifyOtp(email: string, otp: string) {
    state.loading = true
    try {
      const res = await authService.verifyOtp(email, otp)

      if (res.errors) {
        return { success: false, message: extractErrorMessage(res) }
      }

      const data = res.data!.verifyOtp
      state.user = data.user
      state.otpVerified = true
      removeOtpPending()
      setToken(data.token)

      // If first-login + OTP, they still need to change password
      if (state.isFirstLogin) {
        return { success: true, next: 'change-password' as const, message: data.message }
      }

      return { success: true, next: 'dashboard' as const, message: data.message }
    } catch (err) {
      return { success: false, message: (err as Error).message }
    } finally {
      state.loading = false
    }
  }

  /**
   * Resend OTP to the given email.
   */
  async function resendOtp(email: string) {
    state.loading = true
    try {
      const res = await authService.resendOtp(email)
      if (res.errors) {
        return { success: false, message: extractErrorMessage(res) }
      }
      return { success: true, message: res.data!.resendOtp.message }
    } catch (err) {
      return { success: false, message: (err as Error).message }
    } finally {
      state.loading = false
    }
  }

  /**
   * Change password on first login. Saves the full token returned.
   */
  async function changePassword(password: string, passwordConfirmation: string) {
    state.loading = true
    try {
      const res = await authService.changePassword(password, passwordConfirmation)
      if (res.errors) {
        return {
          success: false,
          message: extractErrorMessage(res),
          validation: extractValidationErrors(res),
        }
      }
      const data = res.data!.changePassword
      state.user = data.user
      state.isFirstLogin = false
      setToken(data.token)
      return { success: true, message: data.message }
    } catch (err) {
      return { success: false, message: (err as Error).message }
    } finally {
      state.loading = false
    }
  }

  /**
   * Send a forgot-password email.
   */
  async function forgotPassword(email: string) {
    state.loading = true
    try {
      const res = await authService.forgotPassword(email)
      if (res.errors) {
        return { success: false, message: extractErrorMessage(res) }
      }
      return { success: true, message: res.data!.forgotPassword.message }
    } catch (err) {
      return { success: false, message: (err as Error).message }
    } finally {
      state.loading = false
    }
  }

  /**
   * Reset password using the email token.
   */
  async function resetPassword(token: string, password: string, passwordConfirmation: string) {
    state.loading = true
    try {
      const res = await authService.resetPassword(token, password, passwordConfirmation)
      if (res.errors) {
        return {
          success: false,
          message: extractErrorMessage(res),
          validation: extractValidationErrors(res),
        }
      }
      return { success: true, message: res.data!.resetPassword.message }
    } catch (err) {
      return { success: false, message: (err as Error).message }
    } finally {
      state.loading = false
    }
  }

  /**
   * Log out — invalidate token on server then clear local state.
   */
  async function performLogout() {
    state.loading = true
    try {
      await authService.logout()
    } finally {
      clearSession()
      state.loading = false
    }
  }

  /**
   * Fetch the current user's profile.
   * Throws when the response contains errors so the router guard's
   * try/catch can intercept it and redirect to login.
   */
  async function fetchMe() {
    state.loading = true
    try {
      const res = await authService.me()
      if (res.errors) {
        throw new Error(extractErrorMessage(res))
      }
      if (res.data?.me) {
        state.user = res.data.me
      }
    } finally {
      state.loading = false
    }
  }

  /**
   * Refresh the JWT token before it expires.
   */
  async function refreshToken() {
    try {
      const res = await authService.refreshToken()
      if (res.data?.refreshToken?.token) {
        setToken(res.data.refreshToken.token)
        return true
      }
      return false
    } catch {
      return false
    }
  }

  return {
    state,
    isAuthenticated,
    login,
    verifyOtp,
    resendOtp,
    changePassword,
    forgotPassword,
    resetPassword,
    performLogout,
    fetchMe,
    refreshToken,
    clearSession,
  }
}
