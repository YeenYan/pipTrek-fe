/**
 * useAccounts Composable
 *
 * Provides account management logic for components.
 * Wraps the Pinia store with additional UI-level concerns
 * like search, filtering, form state, and toast notifications.
 */

import { ref, computed } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import { useToast } from '@/composables/useToast'
import { useFormErrors } from '@/composables/useFormErrors'
import type { Account, AccountInput } from '@/services/accountService'
import { storeToRefs } from 'pinia'

export function useAccounts() {
  const store = useAccountsStore()
  const toast = useToast()
  const formErrors = useFormErrors()
  const { accounts, loading, error, activeAccount, sortedAccounts } = storeToRefs(store)

  /* ------------------------------------------------------------------ */
  /*  Search & filter                                                    */
  /* ------------------------------------------------------------------ */

  const searchQuery = ref('')
  const filterMode = ref<string>('')
  const filterType = ref<string>('')

  const filteredAccounts = computed(() => {
    let result = sortedAccounts.value

    // Search by name or broker
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.broker.toLowerCase().includes(q) ||
          a.platform.toLowerCase().includes(q),
      )
    }

    // Filter by account_mode
    if (filterMode.value) {
      result = result.filter((a) => a.account_mode === filterMode.value)
    }

    // Filter by account_type
    if (filterType.value) {
      result = result.filter((a) => a.account_type === filterType.value)
    }

    return result
  })

  /* ------------------------------------------------------------------ */
  /*  Form state                                                         */
  /* ------------------------------------------------------------------ */

  const showForm = ref(false)
  const editingAccount = ref<Account | null>(null)
  const submitting = ref(false)

  const isEditing = computed(() => !!editingAccount.value)

  function emptyFormModel(): AccountInput {
    return {
      name: '',
      broker: '',
      platform: '',
      account_mode: '',
      account_type: '',
      leverage: 100,
      starting_balance: 0,
      target_amount: 0,
      is_active: false,
    }
  }

  const formModel = ref<AccountInput>(emptyFormModel())

  function openCreateForm() {
    editingAccount.value = null
    formModel.value = emptyFormModel()
    formErrors.clearAll()
    showForm.value = true
  }

  function openEditForm(account: Account) {
    editingAccount.value = account
    formModel.value = {
      name: account.name,
      broker: account.broker,
      platform: account.platform,
      account_mode: account.account_mode,
      account_type: account.account_type,
      leverage: account.leverage,
      starting_balance: account.starting_balance,
      target_amount: account.target_amount,
      is_active: account.is_active,
    }
    formErrors.clearAll()
    showForm.value = true
  }

  function closeForm() {
    showForm.value = false
    editingAccount.value = null
    formModel.value = emptyFormModel()
    formErrors.clearAll()
  }

  /* ------------------------------------------------------------------ */
  /*  CRUD operations                                                    */
  /* ------------------------------------------------------------------ */

  async function fetchAccounts() {
    const result = await store.fetchAccounts()
    if (!result.success) {
      toast.error(result.message ?? 'Failed to load accounts.')
    }
  }

  async function submitForm() {
    submitting.value = true
    formErrors.clearAll()

    try {
      if (isEditing.value) {
        const result = await store.update(editingAccount.value!.id, formModel.value)
        if (!result.success) {
          if (result.validation) formErrors.setErrors(result.validation)
          toast.error(result.message ?? 'Failed to update account.')
          return
        }
        toast.success('Account updated successfully.')
      } else {
        const result = await store.create(formModel.value)
        if (!result.success) {
          if (result.validation) formErrors.setErrors(result.validation)
          toast.error(result.message ?? 'Failed to create account.')
          return
        }
        toast.success('Account created successfully.')
      }
      closeForm()
    } finally {
      submitting.value = false
    }
  }

  async function deleteAccount(id: string) {
    const result = await store.remove(id)
    if (!result.success) {
      toast.error(result.message ?? 'Failed to delete account.')
      return false
    }
    toast.success(result.message ?? 'Account deleted.')
    // Close form if we were editing the deleted account
    if (editingAccount.value?.id === id) {
      closeForm()
    }
    return true
  }

  async function toggleActive(id: string) {
    const result = await store.toggleActive(id)
    if (!result.success) {
      toast.error(result.message ?? 'Failed to toggle account.')
      return false
    }
    toast.success('Account status updated.')
    return true
  }

  /**
   * Set a specific account as the only active account.
   * Handles deactivating the current active before activating the new one.
   */
  async function setActiveAccount(newId: string) {
    const result = await store.setActiveAccount(newId)
    if (!result.success) {
      toast.error(result.message ?? 'Failed to activate account.')
      return false
    }
    toast.success('Active account switched.')
    return true
  }

  /* ------------------------------------------------------------------ */
  /*  Helpers                                                            */
  /* ------------------------------------------------------------------ */

  const hasOnlyOneAccount = computed(() => accounts.value.length === 1)

  const inactiveAccounts = computed(() => accounts.value.filter((a) => !a.is_active))

  /** ID of the account currently being acted upon (toggle/delete) — for per-card loading */
  const actionLoadingId = ref<string | null>(null)

  return {
    // State
    accounts,
    loading,
    error,
    activeAccount,
    sortedAccounts,
    filteredAccounts,

    // Search & filter
    searchQuery,
    filterMode,
    filterType,

    // Form
    showForm,
    editingAccount,
    isEditing,
    formModel,
    submitting,
    formErrors,

    // Actions
    fetchAccounts,
    openCreateForm,
    openEditForm,
    closeForm,
    submitForm,
    deleteAccount,
    toggleActive,
    setActiveAccount,

    // Helpers
    hasOnlyOneAccount,
    inactiveAccounts,
    actionLoadingId,
  }
}
