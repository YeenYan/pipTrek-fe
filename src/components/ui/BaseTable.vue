<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed } from 'vue'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/vue/24/outline'

export interface TableColumn<R = Record<string, unknown>> {
  key: string
  label: string
  format?: (value: unknown, row: R) => string
}

export interface PaginationConfig {
  currentPage: number
  totalPages: number
  totalRows: number
  perPage: number
}

const props = defineProps<{
  columns: TableColumn<T>[]
  rows: T[]
  loading?: boolean
  emptyMessage?: string
  pagination?: PaginationConfig
}>()

const emit = defineEmits<{
  'row-click': [row: T]
  'page-change': [page: number]
}>()

const showPagination = computed(() => props.pagination && props.pagination.totalPages > 1)

function goToPage(page: number) {
  if (!props.pagination) return
  if (page < 1 || page > props.pagination.totalPages) return
  emit('page-change', page)
}

const visiblePages = computed(() => {
  if (!props.pagination) return []
  const { currentPage, totalPages } = props.pagination
  const pages: number[] = []
  const start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, currentPage + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})
</script>

<template>
  <div>
    <div class="overflow-x-auto rounded-lg border border-border">
      <table class="w-full text-sm text-left">
        <thead class="bg-surface text-textSecondary uppercase text-xs tracking-wider">
          <tr>
            <th v-for="col in columns" :key="col.key" class="px-4 py-3 font-medium">
              {{ col.label }}
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-border">
          <!-- Loading -->
          <tr v-if="loading">
            <td :colspan="columns.length" class="px-4 py-8 text-center text-textSecondary">
              <div class="flex flex-col items-center gap-2">
                <svg class="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Loading…
              </div>
            </td>
          </tr>

          <!-- Empty -->
          <tr v-else-if="rows.length === 0">
            <td :colspan="columns.length" class="px-4 py-8 text-center text-textSecondary">
              {{ emptyMessage ?? 'No data available.' }}
            </td>
          </tr>

          <!-- Data rows -->
          <tr
            v-else
            v-for="(row, idx) in rows"
            :key="idx"
            class="hover:bg-surfaceHover transition-colors cursor-pointer"
            @click="emit('row-click', row)"
          >
            <td v-for="col in columns" :key="col.key" class="px-4 py-3 text-textPrimary">
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                {{ col.format ? col.format(row[col.key], row) : row[col.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="showPagination && pagination"
      class="flex items-center justify-between mt-3 text-xs text-textSecondary"
    >
      <span>
        Page {{ pagination.currentPage }} of {{ pagination.totalPages }} ({{
          pagination.totalRows
        }}
        total)
      </span>
      <div class="flex items-center gap-1">
        <button
          :disabled="pagination.currentPage <= 1"
          @click="goToPage(1)"
          class="p-1.5 rounded hover:bg-surfaceHover disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronDoubleLeftIcon class="w-3.5 h-3.5" />
        </button>
        <button
          :disabled="pagination.currentPage <= 1"
          @click="goToPage(pagination.currentPage - 1)"
          class="p-1.5 rounded hover:bg-surfaceHover disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeftIcon class="w-3.5 h-3.5" />
        </button>

        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          class="px-2.5 py-1 rounded transition-colors cursor-pointer"
          :class="
            page === pagination.currentPage ? 'bg-primary text-white' : 'hover:bg-surfaceHover'
          "
        >
          {{ page }}
        </button>

        <button
          :disabled="pagination.currentPage >= pagination.totalPages"
          @click="goToPage(pagination.currentPage + 1)"
          class="p-1.5 rounded hover:bg-surfaceHover disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronRightIcon class="w-3.5 h-3.5" />
        </button>
        <button
          :disabled="pagination.currentPage >= pagination.totalPages"
          @click="goToPage(pagination.totalPages)"
          class="p-1.5 rounded hover:bg-surfaceHover disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronDoubleRightIcon class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>
