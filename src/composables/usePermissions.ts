import { computed, ComputedRef } from 'vue';
import { useRouter } from 'vue-router';
import { 
  userRole, 
  Permission, 
  Role, 
  currentUserHasPermission, 
  currentUserHasAnyPermission, 
  currentUserHasAllPermissions 
} from '@/utils/permissions/roles';

export interface UsePermissionsReturn {
  role: ComputedRef<Role>;
  permissions: ComputedRef<Permission[]>;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  checkAccess: (requiredPermissions: Permission[]) => boolean;
  enforcePermission: (permission: Permission, redirectTo?: string) => boolean;
  isAdmin: ComputedRef<boolean>;
  isStaff: ComputedRef<boolean>;
  isStudent: ComputedRef<boolean>;
  isGuest: ComputedRef<boolean>;
}

export function usePermissions(): UsePermissionsReturn {
  const router = useRouter();

  const role = computed(() => userRole.current);
  const permissions = computed(() => userRole.permissions);

  const isAdmin = computed(() => role.value === 'admin');
  const isStaff = computed(() => role.value === 'staff');
  const isStudent = computed(() => role.value === 'student');
  const isGuest = computed(() => role.value === 'guest');

  /**
   * Check if the current user has access based on required permissions
   * @param requiredPermissions An array of required permissions
   * @returns boolean indicating whether access is granted
   */
  const checkAccess = (requiredPermissions: Permission[]): boolean => {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permissions required
    }
    return currentUserHasAnyPermission(requiredPermissions);
  };

  /**
   * Enforce a permission check and redirect if it fails
   * @param permission The permission to check
   * @param redirectTo Optional path to redirect to on failure (defaults to '/')
   * @returns boolean indicating whether permission check passed
   */
  const enforcePermission = (permission: Permission, redirectTo = '/'): boolean => {
    if (currentUserHasPermission(permission)) {
      return true;
    }
    
    router.push(redirectTo);
    return false;
  };

  return {
    role,
    permissions,
    hasPermission: currentUserHasPermission,
    hasAnyPermission: currentUserHasAnyPermission,
    hasAllPermissions: currentUserHasAllPermissions,
    checkAccess,
    enforcePermission,
    isAdmin,
    isStaff,
    isStudent,
    isGuest
  };
}