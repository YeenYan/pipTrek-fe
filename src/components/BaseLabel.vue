<script setup lang="ts">
// Reusable form label
defineProps<{
  text: string
}>()
</script>

<template>
  <label class="block text-sm text-textSecondary mb-1.5">{{ text }}</label>
</template>
