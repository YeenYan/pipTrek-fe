import { ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * useLoadingStore — centralized page-level loading state.
 *
 * Usage:
 *   const { startPageLoading, stopPageLoading } = useLoadingStore()
 *   startPageLoading()
 *   await fetchData()
 *   stopPageLoading()
 *
 * The MainLoading component in MainLayout reacts to `isPageLoading`
 * automatically — no need to render spinners in individual pages.
 */
export const useLoadingStore = defineStore('loading', () => {
  const isPageLoading = ref(false)

  function startPageLoading() {
    isPageLoading.value = true
  }

  function stopPageLoading() {
    isPageLoading.value = false
  }

  return { isPageLoading, startPageLoading, stopPageLoading }
})
