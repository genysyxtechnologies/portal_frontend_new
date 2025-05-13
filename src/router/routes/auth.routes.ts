import type { RouteRecordRaw } from 'vue-router';
import AuthLayout from '@/components/layout/shared/AuthLayout.vue';

const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: AuthLayout,
    meta: {
      requiresAuth: false
    },
    children: [
      {
        path: '',
        redirect: '/'
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/shared/auth/LoginView.vue'),
        meta: {
          title: 'Login',
          icon: 'pi pi-sign-in'
        }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/shared/auth/RegisterView.vue'),
        meta: {
          title: 'Register',
          icon: 'pi pi-user-plus'
        }
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: () => import('@/views/shared/auth/ForgotPasswordView.vue'),
        meta: {
          title: 'Forgot Password',
          icon: 'pi pi-lock'
        }
      },
      {
        path: 'reset-password',
        name: 'ResetPassword',
        component: () => import('@/views/shared/auth/ResetPasswordView.vue'),
        meta: {
          title: 'Reset Password',
          icon: 'pi pi-lock'
        }
      },
      {
        path: 'verify-email',
        name: 'VerifyEmail',
        component: () => import('@/views/shared/auth/VerifyEmailView.vue'),
        meta: {
          title: 'Verify Email',
          icon: 'pi pi-envelope'
        }
      },
      {
        path: 'forbidden',
        name: 'Forbidden',
        component: () => import('@/views/shared/errors/ForbiddenView.vue'),
        meta: {
          title: 'Access Denied',
          icon: 'pi pi-ban'
        }
      }
    ]
  }
];

export default authRoutes;
