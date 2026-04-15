// Auth routes — lazy-loaded pages for guest (unauthenticated) users
const authRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/auth/LoginPage.vue'),
    meta: { guest: true },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/pages/auth/ForgotPassword.vue'),
    meta: { guest: true },
  },
  {
    path: '/otp',
    name: 'OtpVerification',
    component: () => import('@/pages/auth/OtpVerification.vue'),
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/pages/auth/ResetPassword.vue'),
    meta: { guest: true },
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    component: () => import('@/pages/auth/ChangePassword.vue'),
  },
  {
    path: '/request-registration',
    name: 'RequestRegistration',
    component: () => import('@/pages/users/UserRegistrationRequestPage.vue'),
    meta: { guest: true },
  },
]

export default authRoutes
