import StudentDashboard from '@/views/student/StudentDashboard.vue'
import type { RouteRecordRaw } from 'vue-router'

const studentRoutes: RouteRecordRaw[] = [
  {
    path: '/student',
    component: StudentDashboard,
    meta: {
      requiresAuth: true,
      roles: ['student'],
    },
    children: [
      {
        path: '',
        name: 'DashboardContent',
        component: () => import('@/views/student/dashboard/DashboardContent.vue'),
        meta: {
          title: 'Student Dashboard',
          icon: 'pi pi-home',
        },
      },
      {
        path: 'fees',
        name: 'StudentFee',
        component: () => import('@/views/student/fees/StudentFee.vue'),
        meta: {
          title: 'Student Fees',
          icon: 'pi pi-money-bill',
        },
      },
      {
        path: 'bio-data',
        name: 'StudentBioData',
        component: () => import('@/views/student/biodata/StudentBioData.vue'),
        meta: {
          title: 'Student Bio Data',
          icon: 'pi pi-user',
        },
      },
    ],
  },
]

export default studentRoutes
