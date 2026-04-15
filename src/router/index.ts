import { createRouter, createWebHistory } from 'vue-router'
import allRoutes from '@/router/router_utils/routeGroups'
import { setupGuards } from '@/router/guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Redirect root to dashboard (guard will send to login if unauthenticated)
    { path: '/', redirect: '/dashboard' },
    ...allRoutes,
  ],
})

// Install auth navigation guards
setupGuards(router)

export default router
