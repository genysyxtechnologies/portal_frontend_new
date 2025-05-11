import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { userRole } from '@/utils/permissions/roles';

/**
 * Authentication route guard
 *
 * Checks if user is authenticated and redirects to login page if not
 */
export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  // TODO: Replace with actual authentication check from auth service
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated && to.meta.requiresAuth) {
    // Redirect to login page and store the intended destination
    return next({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    });
  }

  next();
};

/**
 * Role-based route guard
 *
 * Checks if user has the required role to access a route
 */
export const roleGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  // If the route doesn't specify roles, allow access
  if (!to.meta.roles) {
    return next();
  }

  // Ensure user is authenticated first
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated && to.meta.requiresAuth) {
    return next({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    });
  }

  // Check if user's role is allowed
  const allowedRoles = to.meta.roles as string[];
  if (!allowedRoles.includes(userRole.current)) {
    // Redirect to forbidden page or dashboard based on current role
    switch (userRole.current) {
      case 'admin':
        return next({ path: '/admin/dashboard' });
      case 'staff':
        return next({ path: '/staff/dashboard' });
      case 'student':
        return next({ path: '/student/dashboard' });
      default:
        return next({ path: '/auth/forbidden' });
    }
  }

  next();
};
