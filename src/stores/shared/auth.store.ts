import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const userId = ref(localStorage.getItem('userId') || null)
  const role = ref(localStorage.getItem('role') || null)

  // Getters
  const isAuthenticated = computed(() => !!userId.value)
  const userRole = computed(() => role.value || ['guest'])

  // Actions
  function login(userData: { userId: string; role: string[] }) {
    // Persist to localStorage
    localStorage.setItem('userId', userData.userId)
    localStorage.setItem('role', JSON.stringify(userData.role))
  }

  function logout() {
    userId.value = null
    role.value = null

    // Clear localStorage
    localStorage.removeItem('userId')
    localStorage.removeItem('role')
  }

  return {
    userId,
    role,
    isAuthenticated,
    userRole,
    login,
    logout,
  }
})
