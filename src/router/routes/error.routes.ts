import type { RouteRecordRaw } from 'vue-router'

const errorRoutes: RouteRecordRaw[] = [
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: () => import('@/views/shared/errors/ForbiddenView.vue'),
    meta: {
      requiresAuth: false,
      title: 'Access Forbidden',
      icon: 'pi pi-ban',
    },
  },
  // This should be the last route to catch all unmatched routes
  {
    path: '/:pathMatch(.*)*',
    redirect: '/not-found',
  },
]

export default errorRoutes
