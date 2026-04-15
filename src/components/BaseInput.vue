<script setup lang="ts">
// Reusable input with optional icon slot and inline error display
defineProps<{
  modelValue?: string
  type?: string
  placeholder?: string
  error?: string
  disabled?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div>
    <div
      class="flex items-center gap-3 bg-input border rounded-lg px-4 py-3 transition-colors"
      :class="error ? 'border-danger' : 'border-border'"
    >
      <!-- Optional leading icon -->
      <slot name="icon" />
      <input
        :type="type ?? 'text'"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="bg-transparent w-full text-textPrimary placeholder-textSecondary outline-none text-sm disabled:opacity-50"
      />
    </div>
    <!-- Inline validation error -->
    <p v-if="error" class="mt-1 text-xs text-danger">{{ error }}</p>
  </div>
</template>
