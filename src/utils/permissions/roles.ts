import { reactive } from 'vue';

// Define permission types
export type Permission = 
  // Admin permissions
  | 'manage:users'
  | 'manage:roles'
  | 'manage:departments'
  | 'manage:programs'
  | 'manage:courses'
  | 'view:logs'
  | 'manage:settings'
  | 'manage:academic_calendar'
  
  // Staff permissions
  | 'view:students'
  | 'manage:attendance'
  | 'manage:grades'
  | 'manage:assignments'
  | 'create:announcements'
  | 'view:academic_records'
  | 'manage:advisees'
  
  // Student permissions
  | 'view:courses'
  | 'register:courses'
  | 'view:grades'
  | 'view:attendance'
  | 'submit:assignments'
  | 'view:fees'
  | 'make:payments'
  | 'apply:scholarships'
  
  // Shared permissions
  | 'manage:profile'
  | 'view:announcements'
  | 'use:messaging';

// Define user roles
export type Role = 'admin' | 'staff' | 'student' | 'guest';

// Define permission sets for each role
export const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    // Admin-specific permissions
    'manage:users',
    'manage:roles',
    'manage:departments',
    'manage:programs',
    'manage:courses',
    'view:logs',
    'manage:settings',
    'manage:academic_calendar',
    
    // Admin also has staff permissions
    'view:students',
    'manage:attendance',
    'manage:grades',
    'manage:assignments',
    'create:announcements',
    'view:academic_records',
    'manage:advisees',
    
    // Shared permissions
    'manage:profile',
    'view:announcements',
    'use:messaging'
  ],
  
  staff: [
    // Staff-specific permissions
    'view:students',
    'manage:attendance',
    'manage:grades',
    'manage:assignments',
    'create:announcements',
    'view:academic_records',
    'manage:advisees',
    
    // Shared permissions
    'manage:profile',
    'view:announcements',
    'use:messaging'
  ],
  
  student: [
    // Student-specific permissions
    'view:courses',
    'register:courses',
    'view:grades',
    'view:attendance',
    'submit:assignments',
    'view:fees',
    'make:payments',
    'apply:scholarships',
    
    // Shared permissions
    'manage:profile',
    'view:announcements',
    'use:messaging'
  ],
  
  guest: [
    // Minimal permissions for guests
    'view:announcements'
  ]
};

// Helper function to check if a role has a specific permission
export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) || false;
}

// Current user role (to be set from authentication)
export const userRole = reactive<{
  current: Role;
  permissions: Permission[];
}>({
  current: 'guest',
  permissions: [...rolePermissions.guest]
});

// Set the user role and update permissions
export function setUserRole(role: Role): void {
  userRole.current = role;
  userRole.permissions = [...rolePermissions[role]];
}

// Check if the current user has a specific permission
export function currentUserHasPermission(permission: Permission): boolean {
  return userRole.permissions.includes(permission);
}

// Check if the current user has any of the specified permissions
export function currentUserHasAnyPermission(permissions: Permission[]): boolean {
  return permissions.some(permission => userRole.permissions.includes(permission));
}

// Check if the current user has all of the specified permissions
export function currentUserHasAllPermissions(permissions: Permission[]): boolean {
  return permissions.every(permission => userRole.permissions.includes(permission));
}