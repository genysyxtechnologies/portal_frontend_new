import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { anyContains, userRole } from '@/utils/permissions/roles'

/**
 * Authentication route guard
 *
 * Checks if user is authenticated and redirects to login page if not
 */
export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  // TODO: Replace with actual authentication check from auth service
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  if (!isAuthenticated && to.meta.requiresAuth) {
    // Redirect to login page and store the intended destination
    return next({
      path: '/',
      query: { redirect: to.fullPath },
    })
  }

  next()
}

/**
 * Role-based route guard
 *
 * Checks if user has the required role to access a route
 */
export const roleGuard = (

  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {

  // If the route doesn't specify roles, allow access
  if (!to.meta.roles) {    
    return next()
  }

  // Ensure user is authenticated first
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  if (!isAuthenticated && to.meta.requiresAuth) {
    console.log("test here iii")
    return next({
      path: '/',
      query: { redirect: to.fullPath },
    })
  }

  // Check if user's role is allowed
  const allowedRoles = to.meta.roles as string[]
  if (!anyContains(userRole.current, allowedRoles)) {
    console.log("test here iv", userRole.current)
    // Redirect to forbidden page or dashboard based on current role
    if(anyContains(['admin'], userRole.current)) {
      return next({ path: '/admin/dashboard' })
    } else if(anyContains(['lecturer'], userRole.current)) {
      return next({ path: '/staff/dashboard' })
    } else if(anyContains(['student'], userRole.current)) {
      return next({ path: '/student/dashboard' })
    }
    return next({ path: '/forbidden' })
  }

  console.log("test here v")

  next()
}
