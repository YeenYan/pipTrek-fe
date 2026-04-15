<script setup lang="ts">
// Reusable button with variant support and loading state
defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  fullWidth?: boolean
  type?: 'button' | 'submit'
  loading?: boolean
  disabled?: boolean
}>()
</script>

<template>
  <button
    :type="type ?? 'button'"
    :disabled="loading || disabled"
    class="px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="{
      'bg-primary hover:bg-primaryHover text-white': !variant || variant === 'primary',
      'bg-surface hover:bg-surfaceHover text-textPrimary border border-border':
        variant === 'secondary',
      'border border-border text-textPrimary hover:bg-surfaceHover': variant === 'outline',
      'bg-danger hover:bg-danger/80 text-white': variant === 'danger',
      'w-full': fullWidth,
    }"
  >
    <span v-if="loading" class="inline-flex items-center gap-2">
      <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      Loading…
    </span>
    <slot v-else />
  </button>
</template>
