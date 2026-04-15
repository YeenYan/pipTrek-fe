/**
 * Route Guards
 *
 * Protects authenticated routes and redirects guest users to login.
 * Also prevents authenticated users from visiting guest-only pages.
 */

import type { Router } from 'vue-router'

/**
 * Install global navigation guards on the router.
 *
 * Route meta flags:
 *   - requiresAuth: true  → must be logged in
 *   - guest: true         → only accessible when NOT logged in
 */
export function setupGuards(router: Router) {
  router.beforeEach((to) => {
    const token = localStorage.getItem('auth_token')

    // Protected route but no token → redirect to login
    if (to.meta.requiresAuth && !token) {
      return { path: '/login', query: { redirect: to.fullPath } }
    }

    // Guest-only route but user is logged in → redirect to dashboard
    if (to.meta.guest && token) {
      return { path: '/dashboard' }
    }
  })
}
