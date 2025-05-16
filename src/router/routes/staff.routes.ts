import type { RouteRecordRaw } from 'vue-router'
import StaffLayout from '@/components/layout/staff/StaffLayout.vue'

const staffRoutes: RouteRecordRaw[] = [
  {
    path: '/staff',
    component: StaffLayout,
    meta: {
      requiresAuth: true,
      roles: ['staff', 'admin'],
    },
    children: [
      {
        path: '',
        redirect: '/staff/dashboard',
      },
    ],
  },
]

export default staffRoutes
