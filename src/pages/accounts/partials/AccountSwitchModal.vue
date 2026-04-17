<script setup lang="ts">
/**
 * AccountSwitchModal — shown when the user wants to switch the active account.
 * Forces selection of which account to activate.
 * The "Activate Selected" button is enabled only when a valid account is chosen.
 */
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import type { Account } from '@/services/accountService'
import { ref, watch } from 'vue'

const props = defineProps<{
  open: boolean
  accounts: Account[]
  currentAccount: Account | null
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: [newActiveId: string]
  close: []
}>()

const selectedId = ref<string>('')

// Reset selection whenever the modal opens
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) selectedId.value = ''
  },
)

function handleConfirm() {
  if (!selectedId.value) return
  emit('confirm', selectedId.value)
  selectedId.value = ''
}

function handleClose() {
  emit('update:open', false)
  emit('close')
  selectedId.value = ''
}
</script>

<template>
  <BaseModal :open="open" title="Switch Active Account" @update:open="handleClose">
    <p class="text-sm text-textSecondary mb-4">
      There must always be one active account. Select which account to activate:
    </p>

    <div class="space-y-2 max-h-60 overflow-y-auto mb-4">
      <label
        v-for="acc in accounts"
        :key="acc.id"
        class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors select-none"
        :class="
          selectedId === acc.id
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/30'
        "
      >
        <input v-model="selectedId" type="radio" :value="acc.id" class="accent-primary" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-textPrimary truncate">{{ acc.name }}</p>
          <p class="text-xs text-textSecondary">{{ acc.broker }} · {{ acc.platform }}</p>
        </div>
      </label>
    </div>

    <div v-if="accounts.length === 0" class="text-sm text-textSecondary text-center py-4">
      No other accounts available.
    </div>

    <div class="flex gap-3 pt-2">
      <BaseButton
        variant="primary"
        :disabled="!selectedId || loading"
        :loading="loading"
        @click="handleConfirm"
      >
        Activate Selected
      </BaseButton>
      <BaseButton variant="outline" :disabled="loading" @click="handleClose"> Cancel </BaseButton>
    </div>
  </BaseModal>
</template>
