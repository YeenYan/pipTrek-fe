/**
 * Route Guards
 *
 * Protects authenticated routes and redirects guest users to login.
 * Also prevents authenticated users from visiting guest-only pages.
 *
 * Session expiry:
 * Registers a global unauthenticated handler with the GraphQL client so
 * any API call that returns 401/403 or a GraphQL "unauthenticated" error
 * immediately clears the session and redirects to /login.
 */

import type { Router } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useRbac } from '@/composables/useRbac'
import { useToast } from '@/composables/useToast'
import { registerUnauthHandler } from '@/utils/graphqlClient'
import { getToken, getOtpPending } from '@/utils/tokenStorage'

export function setupGuards(router: Router) {
  /* ------------------------------------------------------------------ */
  /*  Global session-expiry handler                                     */
  /* ------------------------------------------------------------------ */

  const { clearSession } = useAuth()
  const toast = useToast()

  /**
   * Called by the GraphQL client whenever a 401 / 403 or an
   * "unauthenticated" GraphQL error is detected mid-session.
   * Clears all auth data, shows a friendly message, and redirects.
   */
  registerUnauthHandler(() => {
    clearSession()
    toast.warning('Session expired. Please log in again.')
    router.push('/login')
  })

  /* ------------------------------------------------------------------ */
  /*  Per-navigation guard                                              */
  /* ------------------------------------------------------------------ */

  router.beforeEach(async (to) => {
    const token = getToken()
    const otpPending = getOtpPending()

    const { fetchMe } = useAuth()

    // No token → redirect protected routes to login
    if (to.meta.requiresAuth && !token) {
      clearSession()
      return { path: '/login', query: { redirect: to.fullPath } }
    }

    // Token present → verify it by fetching the current user.
    // fetchMe() now throws when the server returns auth errors,
    // so any invalid / expired token is caught here.
    if (token) {
      try {
        await fetchMe()
      } catch {
        // Token is invalid or expired — the graphqlClient interceptor
        // may already be handling the redirect, but we make sure here too.
        clearSession()
        return { path: '/login' }
      }
    }

    // Authenticated but OTP not verified → force OTP page
    if (to.meta.requiresAuth && otpPending) {
      if (to.path !== '/otp') {
        return { path: '/otp' }
      }
    }

    // OTP page requires that OTP is actually pending
    if (to.path === '/otp') {
      if (!otpPending) {
        return token ? { path: '/dashboard' } : { path: '/login' }
      }
    }

    // Guest-only route but user is fully authenticated → dashboard
    if (to.meta.guest && token && !otpPending) {
      return { path: '/dashboard' }
    }

    // Role-based access control
    if (to.meta.roles && to.meta.roles.length > 0) {
      const { hasAnyRole } = useRbac()
      const { state } = useAuth()

      if (token && state.user && !hasAnyRole(to.meta.roles)) {
        return { path: '/dashboard' }
      }
    }
  })
}
