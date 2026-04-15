<script setup lang="ts">
/**
 * HomePage — the main dashboard landing page.
 * Shows a welcome message with the user's name.
 */

import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { state, fetchMe } = useAuth()

/** Load the current user profile on mount if not already loaded */
onMounted(async () => {
  if (!state.user) {
    await fetchMe()
  }
})
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-textPrimary mb-2">
      Welcome{{ state.user?.name ? `, ${state.user.name}` : '' }}
    </h2>
    <p class="text-textSecondary mb-8">
      This is your dashboard overview. Use the sidebar to navigate.
    </p>

    <!-- Quick stats placeholders -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="bg-surface border border-border rounded-xl p-5">
        <p class="text-sm text-textSecondary mb-1">Total Contracts</p>
        <p class="text-2xl font-bold text-textPrimary">—</p>
      </div>
      <div class="bg-surface border border-border rounded-xl p-5">
        <p class="text-sm text-textSecondary mb-1">Pending Requests</p>
        <p class="text-2xl font-bold text-textPrimary">—</p>
      </div>
      <div class="bg-surface border border-border rounded-xl p-5">
        <p class="text-sm text-textSecondary mb-1">Notifications</p>
        <p class="text-2xl font-bold text-textPrimary">—</p>
      </div>
    </div>
  </div>
</template>
