<script setup lang="ts">
/**
 * MainLayout — authenticated dashboard shell.
 * Contains the sidebar + top bar + router-view content area.
 * Used as the layout wrapper for all protected pages.
 */

import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import SideNav from '@/components/sidebar/SideNav.vue'

const { state, performLogout } = useAuth()
const router = useRouter()

/** Log out and redirect to the login page */
async function handleLogout() {
  await performLogout()
  router.push('/login')
}
</script>

<template>
  <div class="flex h-screen bg-bg overflow-hidden">
    <!-- Sidebar -->
    <SideNav>
      <template #footer>
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-textSecondary hover:bg-surfaceHover hover:text-danger transition-colors cursor-pointer"
          title="Logout"
        >
          <svg
            class="w-5 h-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
          <span class="whitespace-nowrap overflow-hidden">Logout</span>
        </button>
      </template>
    </SideNav>

    <!-- Main content area -->
    <main class="flex-1 overflow-y-auto">
      <!-- Top bar -->
      <header
        class="sticky top-0 z-10 bg-bg/80 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between"
      >
        <h1 class="text-lg font-semibold text-textPrimary">
          <router-view name="title" v-slot="{ Component }">
            <component :is="Component" v-if="Component" />
            <span v-else>Dashboard</span>
          </router-view>
        </h1>

        <!-- User info -->
        <div v-if="state.user" class="flex items-center gap-3">
          <div
            class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold"
          >
            {{ state.user.name?.charAt(0)?.toUpperCase() ?? '?' }}
          </div>
          <span class="text-sm text-textPrimary hidden sm:inline">{{ state.user.name }}</span>
        </div>
      </header>

      <!-- Page content -->
      <div class="p-6">
        <router-view />
      </div>
    </main>
  </div>
</template>
