<script setup lang="ts">
/**
 * ToastNotification — renders the global list of toast messages.
 * Uses the useToast composable to read and dismiss toasts.
 * Placed once in App.vue (or a root layout).
 */

import { useToast } from '@/composables/useToast'

const { toasts, dismiss } = useToast()

/** Map toast type to styling classes */
function typeClasses(type: string): string {
  switch (type) {
    case 'success':
      return 'bg-success/10 border-success text-success'
    case 'error':
      return 'bg-danger/10 border-danger text-danger'
    case 'warning':
      return 'bg-warning/10 border-warning text-warning'
    default:
      return 'bg-primary/10 border-primary text-primary'
  }
}
</script>

<template>
  <!-- Fixed container in the top-right corner -->
  <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm text-sm"
        :class="typeClasses(toast.type)"
      >
        <span class="flex-1">{{ toast.message }}</span>
        <button
          @click="dismiss(toast.id)"
          class="shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease;
}
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
