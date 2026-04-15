// Dashboard routes — protected pages wrapped in MainLayout
import MainLayout from '@/layouts/MainLayout.vue'

const dashboardRoutes = [
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/dashboard/HomePage.vue'),
      },
      {
        path: 'admin/registration-requests',
        name: 'AdminUserRequests',
        component: () => import('@/pages/users/AdminUserRequestsPage.vue'),
      },
      // Placeholder routes for sidebar nav items
      {
        path: 'contracts',
        name: 'Contracts',
        component: () => import('@/pages/dashboard/HomePage.vue'),
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: () => import('@/pages/dashboard/HomePage.vue'),
      },
      {
        path: 'spaces/employee',
        name: 'SpacesEmployee',
        component: () => import('@/pages/dashboard/HomePage.vue'),
      },
      {
        path: 'spaces/realestate',
        name: 'SpacesRealEstate',
        component: () => import('@/pages/dashboard/HomePage.vue'),
      },
      {
        path: 'spaces/vehicles',
        name: 'SpacesVehicles',
        component: () => import('@/pages/dashboard/HomePage.vue'),
      },
    ],
  },
]

export default dashboardRoutes
