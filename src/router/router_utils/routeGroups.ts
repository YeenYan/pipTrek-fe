import type { RouteRecordRaw } from 'vue-router'
import authRoutes from '@/router/routes/authRoutes'
import dashboardRoutes from '@/router/routes/dashboardRoutes'

// Combine all route groups into a single array
const allRoutes: RouteRecordRaw[] = [...authRoutes, ...dashboardRoutes]

export default allRoutes
