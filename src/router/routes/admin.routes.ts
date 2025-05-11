import type { RouteRecordRaw } from 'vue-router';
import AdminLayout from '@/components/layout/admin/AdminLayout.vue';

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: {
      requiresAuth: true,
      roles: ['admin']
    },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
    ]
  }
];

export default adminRoutes;
