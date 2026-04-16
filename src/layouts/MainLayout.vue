<template>
  <div class="relative flex h-screen bg-bg overflow-hidden">
    <!-- Persistent background pattern -->
    <div class="absolute inset-0 tile-grid pointer-events-none"></div>
    <div
      class="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#0d9488]/20 blur-[160px] pointer-events-none"
    ></div>
    <div
      class="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-[#10b981]/15 blur-[140px] pointer-events-none"
    ></div>
    <div
      class="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full bg-[#0d9488]/8 blur-[120px] pointer-events-none"
    ></div>

    <!-- Sidebar -->
    <SideNav class="relative z-10" />

    <!-- Main content area -->
    <main class="relative z-10 flex-1 overflow-y-auto">
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

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import SideNav from '@/components/sidebar/SideNav.vue'

const { state, fetchMe } = useAuth()

onMounted(() => {
  if (state.token && !state.user) {
    fetchMe()
  }
})
</script>

<style scoped>
.tile-grid {
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(135deg, rgba(255, 255, 255, 0.008) 25%, transparent 25%),
    linear-gradient(225deg, rgba(255, 255, 255, 0.008) 25%, transparent 25%);
  background-size:
    160px 120px,
    160px 120px,
    80px 60px,
    80px 60px,
    160px 120px,
    160px 120px;
}
</style>
