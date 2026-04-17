<script setup lang="ts">
/**
 * AccountForm — reusable form for creating and updating trading accounts.
 */
import BaseInput from '@/components/BaseInput.vue'
import BaseLabel from '@/components/BaseLabel.vue'
import BaseButton from '@/components/BaseButton.vue'
import type { AccountInput } from '@/services/accountService'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  modelValue: AccountInput
  isEditing: boolean
  submitting: boolean
  /** Per-field error getter */
  firstError: (field: string) => string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: AccountInput]
  submit: []
  close: []
}>()

function update(field: keyof AccountInput, value: string | number | boolean) {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}
</script>

<template>
  <div class="bg-surface border border-border rounded-xl p-5">
    <!-- Header -->
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-base font-semibold text-textPrimary">
        {{ isEditing ? 'Update Account' : 'Create Account' }}
      </h3>
      <button
        @click="emit('close')"
        class="p-1 text-textSecondary hover:text-textPrimary hover:bg-surfaceHover rounded-lg transition-colors cursor-pointer"
      >
        <XMarkIcon class="w-5 h-5" />
      </button>
    </div>

    <form @submit.prevent="emit('submit')" class="space-y-4">
      <!-- Name -->
      <div>
        <BaseLabel text="Account Name" />
        <BaseInput
          :model-value="modelValue.name"
          @update:model-value="update('name', $event)"
          placeholder="e.g. My Main Account"
          :error="firstError('input.name')"
        />
      </div>

      <!-- Broker & Platform -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <BaseLabel text="Broker" />
          <BaseInput
            :model-value="modelValue.broker"
            @update:model-value="update('broker', $event)"
            placeholder="e.g. IC Markets"
            :error="firstError('input.broker')"
          />
        </div>
        <div>
          <BaseLabel text="Platform" />
          <BaseInput
            :model-value="modelValue.platform"
            @update:model-value="update('platform', $event)"
            placeholder="e.g. MT5"
            :error="firstError('input.platform')"
          />
        </div>
      </div>

      <!-- Account Mode & Type -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <BaseLabel text="Account Mode" />
          <select
            :value="modelValue.account_mode"
            @change="update('account_mode', ($event.target as HTMLSelectElement).value)"
            class="w-full bg-input border rounded-lg px-4 py-3 text-sm text-textPrimary outline-none transition-colors"
            :class="firstError('input.account_mode') ? 'border-danger' : 'border-border'"
          >
            <option value="" disabled>Select mode</option>
            <option value="demo">Demo</option>
            <option value="real">Real</option>
          </select>
          <p v-if="firstError('input.account_mode')" class="mt-1 text-xs text-danger">
            {{ firstError('input.account_mode') }}
          </p>
        </div>
        <div>
          <BaseLabel text="Account Type" />
          <select
            :value="modelValue.account_type"
            @change="update('account_type', ($event.target as HTMLSelectElement).value)"
            class="w-full bg-input border rounded-lg px-4 py-3 text-sm text-textPrimary outline-none transition-colors"
            :class="firstError('input.account_type') ? 'border-danger' : 'border-border'"
          >
            <option value="" disabled>Select type</option>
            <option value="standard">Standard</option>
            <option value="raw">Raw / ECN</option>
            <option value="cent">Cent</option>
          </select>
          <p v-if="firstError('input.account_type')" class="mt-1 text-xs text-danger">
            {{ firstError('input.account_type') }}
          </p>
        </div>
      </div>

      <!-- Leverage -->
      <div>
        <BaseLabel text="Leverage" />
        <BaseInput
          :model-value="String(modelValue.leverage)"
          @update:model-value="update('leverage', Number($event) || 0)"
          type="number"
          placeholder="e.g. 100"
          :error="firstError('input.leverage')"
        />
      </div>

      <!-- Starting Balance & Target -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <BaseLabel text="Starting Balance ($)" />
          <BaseInput
            :model-value="String(modelValue.starting_balance)"
            @update:model-value="update('starting_balance', Number($event) || 0)"
            type="number"
            placeholder="e.g. 10000"
            :error="firstError('input.starting_balance')"
          />
        </div>
        <div>
          <BaseLabel text="Target Amount ($)" />
          <BaseInput
            :model-value="String(modelValue.target_amount)"
            @update:model-value="update('target_amount', Number($event) || 0)"
            type="number"
            placeholder="e.g. 50000"
            :error="firstError('input.target_amount')"
          />
        </div>
      </div>

      <!-- Is Active -->
      <label class="flex items-center gap-2 text-sm text-textSecondary cursor-pointer">
        <input
          type="checkbox"
          :checked="modelValue.is_active"
          @change="update('is_active', ($event.target as HTMLInputElement).checked)"
          class="accent-primary"
        />
        Set as active account
      </label>

      <!-- Actions -->
      <div class="flex gap-3 pt-2">
        <BaseButton type="submit" variant="primary" :loading="submitting">
          {{ isEditing ? 'Update Account' : 'Create Account' }}
        </BaseButton>
        <BaseButton variant="outline" @click="emit('close')"> Cancel </BaseButton>
      </div>
    </form>
  </div>
</template>
