// Auth routes — lazy-loaded pages
const authRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/modules/auth/Login.vue'),
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/modules/auth/ForgotPassword.vue'),
  },
  {
    path: '/otp',
    name: 'OtpVerification',
    component: () => import('@/modules/auth/OtpVerification.vue'),
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/modules/auth/ResetPassword.vue'),
  },
]

export default authRoutes
