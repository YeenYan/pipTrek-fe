<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
/**
 * BaseModal — reusable modal dialog.
 * Controlled via v-model:open or the "open" prop.
 * Emits "close" when the backdrop or close button is clicked.
 */

defineProps<{
  open: boolean
  title?: string
  /** Max width class — defaults to max-w-md */
  size?: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  close: []
}>()

/** Close handler shared by backdrop and button */
function handleClose() {
  emit('update:open', false)
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="handleClose" />

        <!-- Panel -->
        <div
          class="relative bg-surface border border-border rounded-2xl shadow-2xl w-full p-6"
          :class="size ?? 'max-w-md'"
        >
          <!-- Header -->
          <div v-if="title" class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-textPrimary">{{ title }}</h2>
            <button
              @click="handleClose"
              class="text-textSecondary hover:text-textPrimary transition-colors cursor-pointer"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>

          <!-- Content slot -->
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
