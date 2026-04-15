<script setup lang="ts">
/**
 * BaseTable — reusable data table component.
 * Accepts column definitions and row data via props.
 * Emits "row-click" when a row is clicked.
 */

export interface TableColumn {
  key: string
  label: string
  /** Optional formatter for cell values */
  format?: (value: unknown, row: Record<string, unknown>) => string
}

defineProps<{
  columns: TableColumn[]
  rows: Record<string, unknown>[]
  loading?: boolean
  emptyMessage?: string
}>()

defineEmits<{
  'row-click': [row: Record<string, unknown>]
}>()
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-border">
    <table class="w-full text-sm text-left">
      <!-- Table header -->
      <thead class="bg-surface text-textSecondary uppercase text-xs tracking-wider">
        <tr>
          <th v-for="col in columns" :key="col.key" class="px-4 py-3 font-medium">
            {{ col.label }}
          </th>
        </tr>
      </thead>

      <tbody class="divide-y divide-border">
        <!-- Loading state -->
        <tr v-if="loading">
          <td :colspan="columns.length" class="px-4 py-8 text-center text-textSecondary">
            <svg
              class="animate-spin h-5 w-5 mx-auto mb-2 text-primary"
              viewBox="0 0 24 24"
              fill="none"
            >
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
          </td>
        </tr>

        <!-- Empty state -->
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
          @click="$emit('row-click', row)"
        >
          <td v-for="col in columns" :key="col.key" class="px-4 py-3 text-textPrimary">
            {{ col.format ? col.format(row[col.key], row) : row[col.key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
