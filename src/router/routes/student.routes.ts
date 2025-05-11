import type { RouteRecordRaw } from 'vue-router'
import StudentLayout from '@/components/layout/student/StudentLayout.vue'

const studentRoutes: RouteRecordRaw[] = [
  {
    path: '/student',
    component: StudentLayout,
    meta: {
      requiresAuth: true,
      roles: ['student'],
    },
    children: [
      {
        path: '',
        redirect: '/student/dashboard',
      },
      {
        path: 'dashboard',
        name: 'StudentDashboard',
        component: () => import('@/views/student/StudentDashboard.vue'),
        meta: {
          title: 'Student Dashboard',
          icon: 'pi pi-home',
        },
      },

      {
        path: 'fees',
        name: 'StudentFee',
        component: () => import('@/views/student/StudentDashboard.vue'),
        meta: {
          title: 'Student Dashboard',
          icon: 'pi pi-home',
        },
      },
      /*  {
        path: 'calendar',
        name: 'StudentCalendar',
        component: () => import('@/views/student/dashboard/CalendarView.vue'),
        meta: {
          title: 'Calendar',
          icon: 'pi pi-calendar',
        },
      }, */
    ],
  },
]

export default studentRoutes
