<script setup lang="ts">
/**
 * BaseProgressBar — reusable progress bar component.
 */
defineProps<{
  /** Progress percentage (0–100) */
  value: number
  /** Optional label */
  label?: string
  /** Color variant */
  variant?: 'primary' | 'success' | 'warning' | 'danger'
}>()
</script>

<template>
  <div>
    <div v-if="label" class="flex items-center justify-between mb-1">
      <span class="text-[11px] text-textSecondary">{{ label }}</span>
      <span class="text-[11px] font-medium text-textSecondary">{{ Math.round(value) }}%</span>
    </div>
    <div class="w-full h-1.5 bg-border rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-500 ease-out"
        :class="{
          'bg-primary': !variant || variant === 'primary',
          'bg-success': variant === 'success',
          'bg-warning': variant === 'warning',
          'bg-danger': variant === 'danger',
        }"
        :style="{ width: `${Math.min(Math.max(value, 0), 100)}%` }"
      />
    </div>
  </div>
</template>
