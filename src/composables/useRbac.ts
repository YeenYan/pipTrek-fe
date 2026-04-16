/**
 * useRbac Composable
 * Provides role-based access control helpers that read from the auth state.
 */

import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

export function useRbac() {
  const { state } = useAuth()

  const roles = computed(() => state.user?.roles?.map((r) => r.name) ?? [])

  function hasRole(role: string): boolean {
    return roles.value.includes(role)
  }

  function hasAnyRole(check: string[]): boolean {
    return check.some((r) => roles.value.includes(r))
  }

  const isAdmin = computed(() => hasRole('admin'))

  return { roles, hasRole, hasAnyRole, isAdmin }
}
