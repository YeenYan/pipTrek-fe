import type { RouteRecordRaw } from 'vue-router'
import authRoutes from '@/router/routes/authRoutes'

// Combine all route groups into a single array
const allRoutes: RouteRecordRaw[] = [...authRoutes]

export default allRoutes
