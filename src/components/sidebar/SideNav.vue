<script setup lang="ts">
/**
 * SideNav — collapsible sidebar navigation.
 * Matches the dark admin dashboard design from the reference image.
 * Supports expanded (icon + label) and collapsed (icon only) states,
 * active route highlighting, and nested "Spaces" section.
 */

import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

/** Whether the sidebar is expanded (true) or icon-only (false) */
const expanded = ref(true)

/** Whether the Spaces sub-menu is open */
const spacesOpen = ref(true)

/** Toggle sidebar collapsed state */
function toggleSidebar() {
  expanded.value = !expanded.value
}

/** Navigation items for the main menu */
const mainItems = [
  { label: 'Home', icon: 'home', to: '/dashboard' },
  { label: 'Contracts', icon: 'contracts', to: '/contracts' },
  { label: 'Notifications', icon: 'notifications', to: '/notifications' },
]

/** Space sub-items */
const spaceItems = [
  { label: 'Employee', icon: 'employee', color: 'bg-orange-500', to: '/spaces/employee' },
  { label: 'Real estate', icon: 'realestate', color: 'bg-blue-600', to: '/spaces/realestate' },
  { label: 'Vehicles', icon: 'vehicles', color: 'bg-cyan-500', to: '/spaces/vehicles' },
]

/** Check if a route path is currently active */
function isActive(path: string): boolean {
  return route.path.startsWith(path)
}

/** Navigate to a route */
function navigateTo(path: string) {
  router.push(path)
}

/** Current width class based on expanded state */
const widthClass = computed(() => (expanded.value ? 'w-64' : 'w-[72px]'))
</script>

<template>
  <aside
    class="h-screen flex flex-col bg-surface border-r border-border transition-all duration-300 shrink-0"
    :class="widthClass"
  >
    <!-- Logo + collapse toggle -->
    <div class="flex items-center justify-between px-4 h-16 border-b border-border">
      <div class="flex items-center gap-2 overflow-hidden">
        <!-- Logo icon -->
        <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <svg
            class="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        </div>
        <span v-if="expanded" class="text-lg font-bold text-primary whitespace-nowrap">
          Capita
        </span>
      </div>

      <!-- Collapse / expand button -->
      <button
        @click="toggleSidebar"
        class="p-1.5 rounded-md hover:bg-surfaceHover text-textSecondary transition-colors cursor-pointer shrink-0"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path
            v-if="expanded"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>

    <!-- Main nav items -->
    <nav class="flex-1 overflow-y-auto py-3 px-2 space-y-1">
      <button
        v-for="item in mainItems"
        :key="item.label"
        @click="navigateTo(item.to)"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        :class="
          isActive(item.to)
            ? 'bg-primary/10 text-primary border border-primary/30'
            : 'text-textSecondary hover:bg-surfaceHover hover:text-textPrimary'
        "
        :title="item.label"
      >
        <!-- Home icon -->
        <svg
          v-if="item.icon === 'home'"
          class="w-5 h-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
        <!-- Contracts icon -->
        <svg
          v-else-if="item.icon === 'contracts'"
          class="w-5 h-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
        <!-- Notifications icon -->
        <svg
          v-else-if="item.icon === 'notifications'"
          class="w-5 h-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>

        <span v-if="expanded" class="whitespace-nowrap overflow-hidden">{{ item.label }}</span>
      </button>

      <!-- Divider -->
      <div class="h-px bg-border my-3"></div>

      <!-- Spaces section header -->
      <button
        @click="spacesOpen = !spacesOpen"
        class="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors cursor-pointer"
        :title="expanded ? undefined : 'Spaces'"
      >
        <!-- Plus icon -->
        <svg
          class="w-5 h-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <template v-if="expanded">
          <span class="flex-1 text-left whitespace-nowrap">Spaces</span>
          <svg
            class="w-4 h-4 transition-transform"
            :class="{ 'rotate-180': spacesOpen }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </template>
      </button>

      <!-- Space sub-items -->
      <Transition name="slide">
        <div v-if="spacesOpen" class="space-y-1" :class="expanded ? 'pl-4' : ''">
          <button
            v-for="space in spaceItems"
            :key="space.label"
            @click="navigateTo(space.to)"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer"
            :class="
              isActive(space.to)
                ? 'text-textPrimary bg-surfaceHover'
                : 'text-textSecondary hover:bg-surfaceHover hover:text-textPrimary'
            "
            :title="space.label"
          >
            <span
              class="w-5 h-5 rounded shrink-0 flex items-center justify-center text-white text-xs font-bold"
              :class="space.color"
            >
              {{ space.label.charAt(0) }}
            </span>
            <span v-if="expanded" class="whitespace-nowrap overflow-hidden">{{ space.label }}</span>
          </button>

          <!-- Add new -->
          <button
            v-if="expanded"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-textSecondary hover:bg-surfaceHover hover:text-textPrimary transition-colors cursor-pointer"
          >
            <span
              class="w-5 h-5 rounded border border-dashed border-textSecondary flex items-center justify-center shrink-0"
            >
              <svg
                class="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </span>
            <span class="whitespace-nowrap">Add new</span>
          </button>
        </div>
      </Transition>
    </nav>

    <!-- Bottom section — user / logout -->
    <div class="border-t border-border p-3">
      <slot name="footer" />
    </div>
  </aside>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}
.slide-enter-to,
.slide-leave-from {
  max-height: 300px;
}
</style>
