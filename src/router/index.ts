import { createRouter, createWebHistory } from 'vue-router'
import allRoutes from '@/router/router_utils/routeGroups'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Redirect root to login
    { path: '/', redirect: '/login' },
    ...allRoutes,
  ],
})

export default router
