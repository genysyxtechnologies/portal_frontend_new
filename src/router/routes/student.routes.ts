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
          title: 'School Fees',
          icon: 'pi pi-money-bill',
        },
      },
      {
        path: 'stand-alone-fee',
        name: 'StandAloneFess',
        component: () => import('@/views/student/fees/StandAloneFee.vue'),
        meta: {
          title: 'School Fees',
          icon: 'pi pi-money-bill',
        },
      },
      {
        path: 'fees/stand-alone',
        name: 'StandAloneFee',
        component: () => import('@/views/student/fees/StandAloneFee.vue'),
        meta: {
          title: 'Stand Alone Fees',
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
      {
        path: 'course-registration',
        name: 'StudentCourseRegistration',
        component: () =>
          import('@/views/student/course_registration/StudentCourseRegistration.vue'),
        meta: {
          title: 'Student Course Registration',
          icon: 'pi pi-book',
        },
      },
      {
        path: 'my-results',
        name: 'StudentResult',
        component: () => import('@/views/student/result/StudentResult.vue'),
        meta: {
          title: 'Student Results',
          icon: 'pi pi-book',
        },
      },
      {
        path: 'my-accomodation',
        name: 'StudentAccomodation',
        component: () => import('@/views/student/accomodation/StudentAccomodation.vue'),
        meta: {
          title: 'Student Accomodation',
          icon: 'pi pi-book',
        },
      },
      {
        path: 'change-programme',
        name: 'StudentChangeProgramme',
        component: () => import('@/views/student/programme/StudentProgramme.vue'),
        meta: {
          title: 'Student Change Programme',
          icon: 'pi pi-book',
        },
      },
      {
        path: 'my-documents',
        name: 'StudentDocuments',
        component: () => import('@/views/student/documents/StudentDocuments.vue'),
        meta: {
          title: 'Student Documents',
          icon: 'pi pi-book',
        },
      },
      {
        path: 'self-service',
        name: 'StudentSelfService',
        component: () => import('@/views/student/self_service/StudentSelfService.vue'),
        meta: {
          title: 'Student Self Service',
          icon: 'pi pi-book',
        },
      },
      {
        path: 'student-settings',
        name: 'StudentSettings',
        component: () => import('@/views/student/settings/StudentSettings.vue'),
        meta: {
          title: 'Student Settings',
          icon: 'pi pi-cog',
        },
      },
    ],
  },
]

export default studentRoutes
