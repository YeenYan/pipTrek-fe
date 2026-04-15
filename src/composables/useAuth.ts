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

/* ------------------------------------------------------------------ */
/*  Singleton state — lives outside the composable so it's shared      */
/* ------------------------------------------------------------------ */

interface AuthState {
  user: User | null
  token: string | null
  isFirstLogin: boolean
  requiresOtp: boolean
  otpEmail: string
  loading: boolean
}

const state = reactive<AuthState>({
  user: null,
  token: localStorage.getItem('auth_token'),
  isFirstLogin: false,
  requiresOtp: false,
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
    localStorage.setItem('auth_token', token)
  }

  /**
   * Remove token from storage and reset auth state.
   */
  function clearSession() {
    state.token = null
    state.user = null
    state.isFirstLogin = false
    state.requiresOtp = false
    state.otpEmail = ''
    localStorage.removeItem('auth_token')
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

      if (data.token) {
        setToken(data.token)
      }

      // Determine next step for the caller
      if (data.requires_otp) {
        state.otpEmail = email
        return { success: true, next: 'otp' as const, message: data.message }
      }
      if (data.is_first_login) {
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
   */
  async function fetchMe() {
    state.loading = true
    try {
      const res = await authService.me()
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
