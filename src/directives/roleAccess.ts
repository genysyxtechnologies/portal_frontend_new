import type { Directive, DirectiveBinding } from 'vue'
import type { Permission } from '@/utils/permissions/roles'
import {
  currentUserHasPermission,
  currentUserHasAnyPermission,
  currentUserHasAllPermissions,
} from '@/utils/permissions/roles'

export type AccessMode = 'any' | 'all'

export interface RoleAccessOptions {
  permissions: Permission[]
  mode?: AccessMode
  onDenied?: () => void
}

/**
 * Directive for role-based access control in templates
 *
 * Usage:
 * - v-role-access="'manage:users'" (Single permission)
 * - v-role-access="['manage:users', 'view:users']" (Any permission)
 * - v-role-access="{ permissions: ['manage:users', 'view:users'], mode: 'all' }" (All permissions)
 * - v-role-access="{ permissions: ['manage:users'], onDenied: () => ... }" (With callback)
 */
export const roleAccess: Directive = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    applyAccess(el, binding)
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    applyAccess(el, binding)
  },
}

function applyAccess(el: HTMLElement, binding: DirectiveBinding) {
  const value = binding.value

  let hasAccess = false
  let onDenied: (() => void) | undefined

  if (typeof value === 'string') {
    // Single permission: v-role-access="'manage:users'"
    hasAccess = currentUserHasPermission(value as Permission)
  } else if (Array.isArray(value)) {
    // Array of permissions (any mode): v-role-access="['manage:users', 'view:users']"
    hasAccess = currentUserHasAnyPermission(value as Permission[])
  } else if (typeof value === 'object' && value !== null) {
    // Object configuration: v-role-access="{ permissions: [...], mode: 'all', onDenied: () => ... }"
    const options = value as RoleAccessOptions
    const mode = options.mode || 'any'

    if (mode === 'all') {
      hasAccess = currentUserHasAllPermissions(options.permissions)
    } else {
      hasAccess = currentUserHasAnyPermission(options.permissions)
    }

    onDenied = options.onDenied
  }

  if (!hasAccess) {
    if (binding.modifiers.hide) {
      el.style.display = 'none'
    } else if (binding.modifiers.disable) {
      el.setAttribute('disabled', 'disabled')
      // Add visual indication for disabled state
      el.classList.add('p-disabled')
    } else {
      // Default: remove element from DOM
      el.parentNode?.removeChild(el)
    }

    // Call onDenied callback if provided
    if (onDenied && typeof onDenied === 'function') {
      onDenied()
    }
  }
}

export default roleAccess
