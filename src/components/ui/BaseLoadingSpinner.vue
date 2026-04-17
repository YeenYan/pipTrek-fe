<script setup lang="ts">
/**
 * BaseLoadingSpinner — reusable loading indicator.
 * Supports overlay and inline modes with a polished gradient ring design.
 */
defineProps<{
  /** Show as a full-cover overlay (requires parent position:relative) */
  overlay?: boolean
  /** Optional descriptive label */
  text?: string
  /** Spinner size */
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <!-- Overlay mode -->
  <div
    v-if="overlay"
    class="absolute inset-0 z-10 flex items-center justify-center bg-surface/70 backdrop-blur-[2px] rounded-xl"
  >
    <div class="flex flex-col items-center gap-2.5">
      <div
        class="rounded-full border-2 border-border animate-spin"
        :class="{
          'h-5 w-5 border-t-primary': size === 'sm',
          'h-7 w-7 border-t-primary': !size || size === 'md',
          'h-10 w-10 border-t-primary': size === 'lg',
        }"
      />
      <span v-if="text" class="text-xs text-textSecondary">{{ text }}</span>
    </div>
  </div>

  <!-- Inline mode -->
  <div v-else class="flex items-center justify-center py-10">
    <div class="flex flex-col items-center gap-3">
      <div
        class="rounded-full border-2 border-border animate-spin"
        :class="{
          'h-5 w-5 border-t-primary': size === 'sm',
          'h-7 w-7 border-t-primary': !size || size === 'md',
          'h-10 w-10 border-t-primary': size === 'lg',
        }"
      />
      <span v-if="text" class="text-sm text-textSecondary">{{ text }}</span>
    </div>
  </div>
</template>
