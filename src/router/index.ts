import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, roleGuard } from './guards/auth'

// Import route modules
import adminRoutes from './routes/admin.routes'
import staffRoutes from './routes/staff.routes'
import studentRoutes from './routes/student.routes'
import authRoutes from './routes/auth.routes'
import errorRoutes from './routes/error.routes'

// Base routes
const baseRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/shared/auth/LoginView.vue'),
    meta: {
      requiresAuth: false,
      title: 'Home',
    },
  },

  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('@/views/shared/auth/LoginView.vue'),
    meta: {
      requiresAuth: false,
      title: 'Login',
    },
  },

  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/shared/auth/AuthFlowContainer.vue'),
    meta: {
      title: 'Forgot Password',
      icon: 'pi pi-lock',
    },
  },

  {
    path: '/verify-otp',
    name: 'VerifyOTP',
    component: () => import('@/views/shared/auth/AuthFlowContainer.vue'),
    meta: {
      title: 'Verify OTP',
      icon: 'pi pi-lock',
    },
  },

  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/views/shared/auth/AuthFlowContainer.vue'),
    meta: {
      title: 'Reset Password',
      icon: 'pi pi-lock',
    },
  },

  {
    path: '/forbidden',
    name: 'Forbidden',
    component: () => import('@/views/shared/auth/LoginView.vue'),
    meta: {
      requiresAuth: false,
      title: 'Forbidden',
    },
  },

  {
    path: '/redirect',
    name: 'Redirect',
    component: () => import('@/views/shared/RedirectView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...baseRoutes,
    ...adminRoutes,
    ...staffRoutes,
    ...studentRoutes,
    ...authRoutes,
    ...errorRoutes,
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// Register global navigation guards
router.beforeEach(authGuard)
router.beforeEach(roleGuard)

// Handle page titles
router.afterEach((to) => {
  const baseTitle = import.meta.env.VITE_APP_TITLE || 'School Portal'
  const pageTitle = to.meta.title ? `${to.meta.title} | ${baseTitle}` : baseTitle
  document.title = pageTitle
})

export default router
