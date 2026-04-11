<script setup lang="ts">
// Reusable input with optional icon slot
defineProps<{
  modelValue?: string
  type?: string
  placeholder?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex items-center gap-3 bg-input border border-border rounded-lg px-4 py-3">
    <!-- Optional leading icon -->
    <slot name="icon" />
    <input
      :type="type ?? 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="bg-transparent w-full text-textPrimary placeholder-textSecondary outline-none text-sm"
    />
  </div>
</template>
