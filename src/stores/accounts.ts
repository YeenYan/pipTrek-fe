/**
 * Accounts Store
 *
 * Pinia store for trading accounts state management.
 * Provides actions for CRUD operations and toggle active.
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as accountService from '@/services/accountService'
import type { Account, AccountInput } from '@/services/accountService'
import { extractErrorMessage, extractValidationErrors } from '@/utils/graphqlClient'

export const useAccountsStore = defineStore('accounts', () => {
  /* ------------------------------------------------------------------ */
  /*  State                                                              */
  /* ------------------------------------------------------------------ */

  const accounts = ref<Account[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /* ------------------------------------------------------------------ */
  /*  Getters                                                            */
  /* ------------------------------------------------------------------ */

  const activeAccount = computed(() => accounts.value.find((a) => a.is_active) ?? null)

  const sortedAccounts = computed(() =>
    [...accounts.value].sort((a, b) => {
      if (a.is_active && !b.is_active) return -1
      if (!a.is_active && b.is_active) return 1

      return (a.name || '').localeCompare(b.name || '')
    }),
  )

  /* ------------------------------------------------------------------ */
  /*  Actions                                                            */
  /* ------------------------------------------------------------------ */

  async function fetchAccounts() {
    loading.value = true
    error.value = null
    try {
      const res = await accountService.myAccounts()
      if (res.errors) {
        error.value = extractErrorMessage(res)
        return { success: false, message: error.value }
      }
      accounts.value = res.data!.myAccounts
      return { success: true }
    } catch (err) {
      error.value = (err as Error).message
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function create(input: AccountInput) {
    try {
      const res = await accountService.createAccount(input)
      if (res.errors) {
        return {
          success: false,
          message: extractErrorMessage(res),
          validation: extractValidationErrors(res),
        }
      }
      const newAccount = res.data!.createAccount
      // If the new account is active, deactivate others locally
      if (newAccount.is_active) {
        accounts.value = accounts.value.map((a) => ({ ...a, is_active: false }))
      }
      accounts.value.push(newAccount)
      return { success: true, account: newAccount }
    } catch (err) {
      return { success: false, message: (err as Error).message }
    }
  }

  async function update(id: string, input: AccountInput) {
    try {
      const res = await accountService.updateAccount(id, input)
      if (res.errors) {
        return {
          success: false,
          message: extractErrorMessage(res),
          validation: extractValidationErrors(res),
        }
      }
      const updated = res.data!.updateAccount
      const idx = accounts.value.findIndex((a) => a.id === id)
      if (idx !== -1) {
        // If updated account is now active, deactivate others locally
        if (updated.is_active) {
          accounts.value = accounts.value.map((a) => ({ ...a, is_active: a.id === id }))
        }
        accounts.value[idx] = updated
      }
      return { success: true, account: updated }
    } catch (err) {
      return { success: false, message: (err as Error).message }
    }
  }

  async function remove(id: string) {
    try {
      const res = await accountService.deleteAccount(id)
      if (res.errors) {
        return { success: false, message: extractErrorMessage(res) }
      }
      accounts.value = accounts.value.filter((a) => a.id !== id)
      return { success: true, message: res.data!.deleteAccount.message }
    } catch (err) {
      return { success: false, message: (err as Error).message }
    }
  }

  async function toggleActive(id: string) {
    try {
      const res = await accountService.toggleAccountActive(id)
      if (res.errors) {
        return { success: false, message: extractErrorMessage(res) }
      }
      // Re-fetch to get authoritative state from backend
      await fetchAccounts()
      return { success: true }
    } catch (err) {
      return { success: false, message: (err as Error).message }
    }
  }

  /**
   * Set a specific account as the ONLY active account.
   * Deactivates any currently active account first, then activates the target.
   * Ensures single-active constraint even when backend doesn't enforce it.
   */
  async function setActiveAccount(newId: string) {
    try {
      const currentActive = accounts.value.find((a) => a.is_active && a.id !== newId)

      // Optimistic: mark only the target as active immediately
      accounts.value = accounts.value.map((a) => ({ ...a, is_active: a.id === newId }))

      // If there's a currently active account, deactivate it first
      if (currentActive) {
        const deactivateRes = await accountService.toggleAccountActive(currentActive.id)
        if (deactivateRes.errors) {
          // Rollback optimistic update and return error
          await fetchAccounts()
          return { success: false, message: extractErrorMessage(deactivateRes) }
        }
      }

      // Now activate the target account
      const activateRes = await accountService.toggleAccountActive(newId)
      if (activateRes.errors) {
        await fetchAccounts()
        return { success: false, message: extractErrorMessage(activateRes) }
      }

      // Re-fetch for authoritative state
      await fetchAccounts()
      return { success: true }
    } catch (err) {
      await fetchAccounts()
      return { success: false, message: (err as Error).message }
    }
  }

  return {
    // State
    accounts,
    loading,
    error,
    // Getters
    activeAccount,
    sortedAccounts,
    // Actions
    fetchAccounts,
    create,
    update,
    remove,
    toggleActive,
    setActiveAccount,
  }
})
