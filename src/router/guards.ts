/**
 * Route Guards
 *
 * Protects authenticated routes and redirects guest users to login.
 * Also prevents authenticated users from visiting guest-only pages.
 */

import type { Router } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useRbac } from '@/composables/useRbac'

export function setupGuards(router: Router) {
  router.beforeEach((to) => {
    const token = localStorage.getItem('auth_token')
    const otpPending = localStorage.getItem('otp_pending')

    // Protected route but no token → redirect to login
    if (to.meta.requiresAuth && !token) {
      return { path: '/login', query: { redirect: to.fullPath } }
    }

    // Authenticated but OTP not verified → force OTP page
    if (to.meta.requiresAuth && otpPending) {
      if (to.path !== '/otp') {
        return { path: '/otp' }
      }
    }

    // OTP page requires that OTP is actually pending.
    if (to.path === '/otp') {
      if (!otpPending) {
        return token ? { path: '/dashboard' } : { path: '/login' }
      }
    }

    // Guest-only route but user is fully logged in → dashboard
    if (to.meta.guest && token && !otpPending) {
      return { path: '/dashboard' }
    }

    // Role-based access control
    if (to.meta.roles && to.meta.roles.length > 0) {
      const { hasAnyRole } = useRbac()
      const { state } = useAuth()

      // Only enforce when user data is loaded
      if (token && state.user && !hasAnyRole(to.meta.roles)) {
        return { path: '/dashboard' }
      }
    }
  })
}
