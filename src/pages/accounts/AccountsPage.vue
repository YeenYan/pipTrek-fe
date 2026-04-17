<script setup lang="ts">
/**
 * AccountsPage — Trading Accounts management page.
 * Two-column layout: account list (left) and form panel (right).
 */
import { ref, onMounted } from 'vue'
import { useAccounts } from '@/composables/useAccounts'
import { useLoadingStore } from '@/stores/loading'
import AccountCard from '@/pages/accounts/partials/AccountCard.vue'
import AccountForm from '@/pages/accounts/partials/AccountForm.vue'
import AccountSwitchModal from '@/pages/accounts/partials/AccountSwitchModal.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import type { Account } from '@/services/accountService'
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, BanknotesIcon } from '@heroicons/vue/24/outline'

const {
  filteredAccounts,
  loading,
  error,
  activeAccount,

  // Search & filter
  searchQuery,
  filterMode,
  filterType,

  // Form
  showForm,
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
  setActiveAccount,

  // Helpers
  hasOnlyOneAccount,
  inactiveAccounts,
  accounts,
  actionLoadingId,
} = useAccounts()

const { startPageLoading, stopPageLoading } = useLoadingStore()

/* ------------------------------------------------------------------ */
/*  Delete confirmation                                                */
/* ------------------------------------------------------------------ */

const deleteModalOpen = ref(false)
const accountToDelete = ref<Account | null>(null)
const deleting = ref(false)

function confirmDelete(account: Account) {
  accountToDelete.value = account
  deleteModalOpen.value = true
}

async function handleDelete() {
  if (!accountToDelete.value) return
  deleting.value = true
  actionLoadingId.value = accountToDelete.value.id
  const success = await deleteAccount(accountToDelete.value.id)
  actionLoadingId.value = null
  deleting.value = false
  if (success) {
    deleteModalOpen.value = false
    accountToDelete.value = null
  }
}

/* ------------------------------------------------------------------ */
/*  Toggle active logic                                                */
/* ------------------------------------------------------------------ */

const switchModalOpen = ref(false)
const toggleConfirmOpen = ref(false)
const accountToToggle = ref<Account | null>(null)
const toggling = ref(false)

function handleToggle(account: Account) {
  // Rapid-click guard: ignore if something is already being processed
  if (toggling.value) return

  accountToToggle.value = account

  if (account.is_active) {
    // Deactivating the active account — must pick a replacement
    if (inactiveAccounts.value.length === 0) return
    switchModalOpen.value = true
  } else {
    // Activating an inactive account
    toggleConfirmOpen.value = true
  }
}

async function handleToggleConfirm() {
  if (!accountToToggle.value) return
  toggling.value = true
  actionLoadingId.value = accountToToggle.value.id
  // setActiveAccount deactivates current active then activates the new one
  const success = await setActiveAccount(accountToToggle.value.id)
  actionLoadingId.value = null
  toggling.value = false
  if (success) {
    toggleConfirmOpen.value = false
    accountToToggle.value = null
  }
}

async function handleSwitchConfirm(newActiveId: string) {
  toggling.value = true
  actionLoadingId.value = newActiveId
  const success = await setActiveAccount(newActiveId)
  actionLoadingId.value = null
  toggling.value = false
  if (success) {
    switchModalOpen.value = false
    accountToToggle.value = null
  }
}

/* ------------------------------------------------------------------ */
/*  Lifecycle                                                          */
/* ------------------------------------------------------------------ */

onMounted(async () => {
  startPageLoading()
  await fetchAccounts()
  stopPageLoading()
})
</script>

<template>
  <div>
    <!-- Page header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-textPrimary">Trading Accounts</h2>
        <p class="text-sm text-textSecondary mt-1">
          Manage your trading accounts, balances, and targets.
        </p>
      </div>
    </div>

    <!-- Two-column layout -->
    <div class="flex items-start">
      <!-- LEFT: Account list -->
      <div class="flex-1 min-w-0">
        <!-- Search, filters, and create button -->
        <div class="flex flex-wrap items-center gap-3 mb-4">
          <!-- Search -->
          <div class="flex-1 min-w-[200px]">
            <BaseInput v-model="searchQuery" placeholder="Search accounts...">
              <template #icon>
                <MagnifyingGlassIcon class="w-4 h-4 text-textSecondary shrink-0" />
              </template>
            </BaseInput>
          </div>

          <!-- Filter: Mode -->
          <select
            v-model="filterMode"
            class="bg-input border border-border text-textPrimary text-xs rounded-lg px-3 py-2.5 outline-none focus:border-primary"
          >
            <option value="">All Modes</option>
            <option value="demo">Demo</option>
            <option value="live">Live</option>
          </select>

          <!-- Filter: Type -->
          <select
            v-model="filterType"
            class="bg-input border border-border text-textPrimary text-xs rounded-lg px-3 py-2.5 outline-none focus:border-primary"
          >
            <option value="">All Types</option>
            <option value="standard">Standard</option>
            <option value="raw">Raw / ECN</option>
            <option value="cent">Cent</option>
          </select>

          <!-- Create button -->
          <BaseButton variant="primary" @click="openCreateForm">
            <span class="inline-flex items-center gap-1.5">
              <PlusIcon class="w-4 h-4" />
              Create Account
            </span>
          </BaseButton>
        </div>

        <!-- Error state -->
        <div
          v-if="error"
          class="rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm text-danger text-center"
        >
          {{ error }}
        </div>

        <!-- Empty state (guard with !loading to prevent flash during store re-fetches) -->
        <div
          v-else-if="!loading && accounts.length === 0"
          class="flex flex-col items-center justify-center py-16 text-center"
        >
          <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <BanknotesIcon class="w-7 h-7 text-primary" />
          </div>
          <h3 class="text-base font-semibold text-textPrimary mb-1">No trading accounts yet</h3>
          <p class="text-sm text-textSecondary mb-4">
            Create your first account to start tracking your performance.
          </p>
          <BaseButton variant="primary" @click="openCreateForm">
            <span class="inline-flex items-center gap-1.5">
              <PlusIcon class="w-4 h-4" />
              Create Account
            </span>
          </BaseButton>
        </div>

        <!-- No search results -->
        <div
          v-else-if="filteredAccounts.length === 0"
          class="flex flex-col items-center justify-center py-12 text-center"
        >
          <FunnelIcon class="w-8 h-8 text-textSecondary mb-2" />
          <p class="text-sm text-textSecondary">No accounts match your search or filters.</p>
        </div>

        <!-- Account cards grid -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AccountCard
            v-for="account in filteredAccounts"
            :key="account.id"
            :account="account"
            :toggle-disabled="hasOnlyOneAccount && account.is_active"
            :loading="actionLoadingId === account.id"
            @edit="openEditForm"
            @delete="confirmDelete"
            @toggle-active="handleToggle"
          />
        </div>
      </div>

      <!-- RIGHT: Animated panel (divider + form).
           Always in DOM — animates via width/opacity/marginLeft so there is no
           layout jump. overflow-hidden clips the fixed-width inner content
           during the animation. pointer-events:none prevents invisible clicks
           when collapsed. -->
      <div
        class="shrink-0 overflow-hidden transition-all duration-300 ease-in-out"
        :style="{
          width: showForm ? '444px' : '0px',
          opacity: showForm ? 1 : 0,
          marginLeft: showForm ? '24px' : '0px',
          pointerEvents: showForm ? 'auto' : 'none',
        }"
      >
        <!-- Fixed-width inner so the form never reflows during animation -->
        <div class="w-[444px] flex">
          <div class="w-px bg-border self-stretch shrink-0" />
          <div class="flex-1 pl-6 min-w-0">
            <AccountForm
              v-model="formModel"
              :is-editing="isEditing"
              :submitting="submitting"
              :first-error="formErrors.firstError"
              @submit="submitForm"
              @close="closeForm"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <BaseModal v-model:open="deleteModalOpen" title="Delete Account">
      <template v-if="accountToDelete">
        <p class="text-sm text-textSecondary mb-4">
          Are you sure you want to delete
          <strong class="text-textPrimary">{{ accountToDelete.name }}</strong
          >? This action cannot be undone.
        </p>
        <div class="flex gap-3 pt-2">
          <BaseButton variant="danger" :loading="deleting" @click="handleDelete">
            Delete
          </BaseButton>
          <BaseButton variant="outline" @click="deleteModalOpen = false">Cancel</BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- Toggle confirm modal (activating an inactive account) -->
    <BaseModal v-model:open="toggleConfirmOpen" title="Activate Account">
      <template v-if="accountToToggle">
        <p class="text-sm text-textSecondary mb-4">
          Activate <strong class="text-textPrimary">{{ accountToToggle.name }}</strong
          >?
          <template v-if="activeAccount && activeAccount.id !== accountToToggle.id">
            <br />This will deactivate
            <strong class="text-textPrimary">{{ activeAccount.name }}</strong
            >.
          </template>
        </p>
        <div class="flex gap-3 pt-2">
          <BaseButton variant="primary" :loading="toggling" @click="handleToggleConfirm">
            Activate
          </BaseButton>
          <BaseButton variant="outline" @click="toggleConfirmOpen = false">Cancel</BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- Switch active modal (deactivating the current active account) -->
    <AccountSwitchModal
      :open="switchModalOpen"
      :accounts="inactiveAccounts"
      :current-account="accountToToggle"
      :loading="toggling"
      @update:open="switchModalOpen = $event"
      @confirm="handleSwitchConfirm"
      @close="switchModalOpen = false"
    />
  </div>
</template>
