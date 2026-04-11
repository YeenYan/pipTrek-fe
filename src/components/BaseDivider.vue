<script setup lang="ts">
// Divider with optional center text
defineProps<{
  text?: string
}>()
</script>

<template>
  <div class="flex items-center gap-4 my-6">
    <div class="flex-1 h-px bg-border"></div>
    <span v-if="text" class="text-textSecondary text-sm">{{ text }}</span>
    <div class="flex-1 h-px bg-border"></div>
  </div>
</template>
