<template>
  <aside
    class="h-screen flex flex-col bg-surface/80 backdrop-blur-sm border-r border-border transition-all duration-300 shrink-0"
    :class="widthClass"
  >
    <!-- Logo + collapse toggle -->
    <div class="flex items-center justify-between px-4 h-14 border-b border-border">
      <div class="flex items-center gap-2 overflow-hidden">
        <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <ArrowTopRightOnSquareIcon class="w-5 h-5 text-white" />
        </div>
        <span v-if="expanded" class="text-base font-bold text-primary whitespace-nowrap">
          PipTrek
        </span>
      </div>

      <button
        @click="toggleSidebar"
        class="p-1.5 rounded-md hover:bg-surfaceHover text-textSecondary transition-colors duration-150 cursor-pointer shrink-0"
      >
        <ChevronDoubleLeftIcon v-if="expanded" class="w-4 h-4" />
        <ChevronDoubleRightIcon v-else class="w-4 h-4" />
      </button>
    </div>

    <!-- Main nav items -->
    <nav class="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
      <button
        v-for="item in mainItems"
        :key="item.label"
        @click="navigateTo(item.to)"
        class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150 cursor-pointer"
        :class="
          isActive(item.to)
            ? 'bg-primary/10 text-primary'
            : 'text-textSecondary hover:bg-surfaceHover hover:text-textPrimary'
        "
        :title="item.label"
      >
        <component :is="item.icon" class="w-[18px] h-[18px] shrink-0" />
        <span v-if="expanded" class="whitespace-nowrap overflow-hidden">{{ item.label }}</span>
      </button>

      <!-- Admin section -->
      <template v-if="isAdmin">
        <div class="h-px bg-border my-2"></div>
        <p
          v-if="expanded"
          class="px-3 py-1 text-[10px] font-semibold text-textSecondary uppercase tracking-wider"
        >
          Admin
        </p>
        <button
          v-for="item in adminItems"
          :key="item.label"
          @click="navigateTo(item.to)"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150 cursor-pointer"
          :class="
            isActive(item.to)
              ? 'bg-primary/10 text-primary'
              : 'text-textSecondary hover:bg-surfaceHover hover:text-textPrimary'
          "
          :title="item.label"
        >
          <component :is="item.icon" class="w-[18px] h-[18px] shrink-0" />
          <span v-if="expanded" class="whitespace-nowrap overflow-hidden">{{ item.label }}</span>
        </button>
      </template>
    </nav>

    <!-- Bottom section -->
    <div class="border-t border-border p-2 space-y-0.5">
      <button
        v-for="item in bottomItems"
        :key="item.label"
        @click="navigateTo(item.to)"
        class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150 cursor-pointer"
        :class="
          isActive(item.to)
            ? 'bg-primary/10 text-primary'
            : 'text-textSecondary hover:bg-surfaceHover hover:text-textPrimary'
        "
        :title="item.label"
      >
        <component :is="item.icon" class="w-[18px] h-[18px] shrink-0" />
        <span v-if="expanded" class="whitespace-nowrap overflow-hidden">{{ item.label }}</span>
      </button>

      <!-- Logout -->
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-textSecondary hover:bg-surfaceHover hover:text-danger transition-colors duration-150 cursor-pointer"
        title="Logout"
      >
        <ArrowLeftStartOnRectangleIcon class="w-[18px] h-[18px] shrink-0" />
        <span v-if="expanded" class="whitespace-nowrap overflow-hidden">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useRbac } from '@/composables/useRbac'
import {
  HomeIcon,
  BookOpenIcon,
  ChartBarIcon,
  SparklesIcon,
  UsersIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowLeftStartOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const { performLogout } = useAuth()
const { isAdmin } = useRbac()

const expanded = ref(true)

function toggleSidebar() {
  expanded.value = !expanded.value
}

const mainItems = [
  { label: 'Dashboard', icon: HomeIcon, to: '/dashboard' },
  { label: 'Journal', icon: BookOpenIcon, to: '/journal' },
  { label: 'Personal Analytics', icon: ChartBarIcon, to: '/personal-analytics' },
  { label: 'AI Analytics', icon: SparklesIcon, to: '/ai-analytics' },
]

const adminItems = [{ label: 'Manage Users', icon: UsersIcon, to: '/admin/manage-users' }]

const bottomItems = [
  { label: 'Settings', icon: Cog6ToothIcon, to: '/settings' },
  { label: 'Account', icon: UserCircleIcon, to: '/account' },
]

function isActive(path: string): boolean {
  return route.path === path || route.path.startsWith(path + '/')
}

function navigateTo(path: string) {
  router.push(path)
}

async function handleLogout() {
  await performLogout()
  router.push('/login')
}

const widthClass = computed(() => (expanded.value ? 'w-56' : 'w-[56px]'))
</script>
