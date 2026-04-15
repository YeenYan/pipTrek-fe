<template>
  <!-- Root wrapper — pages render via router -->
  <RouterView />
  <!-- Global toast notifications -->
  <ToastNotification />
</template>

<script setup lang="ts">
import ToastNotification from '@/components/ui/ToastNotification.vue'
</script>
