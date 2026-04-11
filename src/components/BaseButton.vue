<script setup lang="ts">
// Reusable button with variant support
defineProps<{
  variant?: 'primary' | 'secondary' | 'outline'
  fullWidth?: boolean
  type?: 'button' | 'submit'
}>()
</script>

<template>
  <button
    :type="type ?? 'button'"
    class="px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
    :class="{
      'bg-primary hover:bg-primaryHover text-white': !variant || variant === 'primary',
      'bg-surface hover:bg-surfaceHover text-textPrimary border border-border':
        variant === 'secondary',
      'border border-border text-textPrimary hover:bg-surfaceHover': variant === 'outline',
      'w-full': fullWidth,
    }"
  >
    <slot />
  </button>
</template>
