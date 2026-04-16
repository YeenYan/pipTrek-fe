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
        path: 'journal',
        name: 'Journal',
        component: () => import('@/pages/dashboard/HomePage.vue'),
      },
      {
        path: 'personal-analytics',
        name: 'PersonalAnalytics',
        component: () => import('@/pages/dashboard/HomePage.vue'),
      },
      {
        path: 'ai-analytics',
        name: 'AIAnalytics',
        component: () => import('@/pages/dashboard/HomePage.vue'),
      },
      {
        path: 'admin/manage-users',
        name: 'ManageUsers',
        component: () => import('@/pages/users/ManageUsersPage.vue'),
        meta: { roles: ['admin'] },
      },
      {
        path: 'admin/registration-requests',
        name: 'AdminUserRequests',
        component: () => import('@/pages/users/AdminUserRequestsPage.vue'),
        meta: { roles: ['admin'] },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/pages/dashboard/HomePage.vue'),
      },
      {
        path: 'account',
        name: 'Account',
        component: () => import('@/pages/dashboard/HomePage.vue'),
      },
    ],
  },
]

export default dashboardRoutes
