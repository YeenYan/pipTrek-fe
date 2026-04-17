<script setup lang="ts">
/**
 * AccountCard — displays a single trading account with actions.
 */
import type { Account } from '@/services/accountService'
import BaseToggle from '@/components/ui/BaseToggle.vue'
import BaseProgressBar from '@/components/ui/BaseProgressBar.vue'
import BaseLoadingSpinner from '@/components/ui/BaseLoadingSpinner.vue'
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const props = defineProps<{
  account: Account
  /** Disable the toggle when only 1 account exists */
  toggleDisabled?: boolean
  /** Show a loading overlay while an action is in progress */
  loading?: boolean
}>()

const emit = defineEmits<{
  edit: [account: Account]
  delete: [account: Account]
  toggleActive: [account: Account]
}>()

/** Mock progress: starting_balance → target_amount */
const progress = computed(() => {
  if (!props.account.target_amount || props.account.target_amount <= 0) return 0
  const pct = (props.account.starting_balance / props.account.target_amount) * 100
  return Math.min(pct, 100)
})

const progressVariant = computed(() => {
  if (progress.value >= 75) return 'success'
  if (progress.value >= 40) return 'primary'
  if (progress.value >= 20) return 'warning'
  return 'danger'
})

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
</script>

<template>
  <div
    class="relative bg-surface border rounded-xl p-4 transition-all duration-200 hover:border-primary/30 group"
    :class="account.is_active ? 'border-primary/50 shadow-lg shadow-primary/5' : 'border-border'"
  >
    <!-- Per-card loading overlay -->
    <BaseLoadingSpinner v-if="loading" overlay size="sm" />
    <!-- Active indicator bar -->
    <div
      v-if="account.is_active"
      class="absolute top-0 left-0 right-0 h-0.5 bg-primary rounded-t-xl"
    />

    <!-- Header: name + toggle -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-semibold text-textPrimary truncate">{{ account.name }}</h3>
          <span
            v-if="account.is_active"
            class="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary shrink-0"
          >
            Active
          </span>
        </div>
        <p class="text-xs text-textSecondary mt-0.5">{{ account.broker }}</p>
      </div>

      <BaseToggle
        :model-value="account.is_active"
        :disabled="toggleDisabled || loading"
        @update:model-value="emit('toggleActive', account)"
      />
    </div>

    <!-- Info grid -->
    <div class="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
      <div>
        <span class="text-[10px] uppercase tracking-wider text-textSecondary">Platform</span>
        <p class="text-xs font-medium text-textPrimary">{{ account.platform }}</p>
      </div>
      <div>
        <span class="text-[10px] uppercase tracking-wider text-textSecondary">Leverage</span>
        <p class="text-xs font-medium text-textPrimary">1:{{ account.leverage }}</p>
      </div>
      <div>
        <span class="text-[10px] uppercase tracking-wider text-textSecondary">Mode</span>
        <p class="text-xs font-medium text-textPrimary capitalize">{{ account.account_mode }}</p>
      </div>
      <div>
        <span class="text-[10px] uppercase tracking-wider text-textSecondary">Type</span>
        <p class="text-xs font-medium text-textPrimary capitalize">{{ account.account_type }}</p>
      </div>
    </div>

    <!-- Balance info -->
    <div class="flex items-center justify-between mb-2">
      <div>
        <span class="text-[10px] uppercase tracking-wider text-textSecondary">Balance</span>
        <p class="text-sm font-semibold text-textPrimary">
          {{ formatCurrency(account.starting_balance) }}
        </p>
      </div>
      <div class="text-right">
        <span class="text-[10px] uppercase tracking-wider text-textSecondary">Target</span>
        <p class="text-sm font-semibold text-primary">
          {{ formatCurrency(account.target_amount) }}
        </p>
      </div>
    </div>

    <!-- Progress bar -->
    <BaseProgressBar :value="progress" label="Progress" :variant="progressVariant" />

    <!-- Actions -->
    <div class="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-border">
      <button
        @click="emit('edit', account)"
        :disabled="loading"
        class="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-textSecondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <PencilSquareIcon class="w-3.5 h-3.5" />
        Edit
      </button>
      <button
        @click="emit('delete', account)"
        :disabled="loading"
        class="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-textSecondary hover:text-danger hover:bg-danger/5 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <TrashIcon class="w-3.5 h-3.5" />
        Delete
      </button>
    </div>
  </div>
</template>
