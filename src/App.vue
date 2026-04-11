<script setup lang="ts">
import ThemeToggle from './components/ThemeToggle.vue'
</script>

<template>
  <div class="min-h-screen bg-bg text-textPrimary transition-colors">
    <!-- Dark mode toggle -->
    <ThemeToggle />

    <!-- Main content -->
    <main class="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 class="text-4xl font-bold text-primary">You did it!</h1>
      <p class="text-textSecondary">
        Visit
        <a
          href="https://vuejs.org/"
          target="_blank"
          rel="noopener"
          class="text-accent hover:underline"
        >vuejs.org</a>
        to read the documentation
      </p>
      <RouterView />
    </main>
  </div>
</template>
