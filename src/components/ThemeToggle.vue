<script setup lang="ts">
// Toggle dark class on <html> and persist to localStorage
function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark')
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
}
</script>

<template>
  <button
    @click="toggleDarkMode"
    class="fixed top-4 right-4 px-4 py-2 rounded-lg bg-surface hover:bg-surfaceHover text-textPrimary border border-border transition-colors"
  >
    🌓 Toggle Theme
  </button>
</template>
