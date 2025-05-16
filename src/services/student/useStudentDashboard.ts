import StudentDashboardRepositories from '@/repositories/student/student.dashboard.repositories'
import constant from '@/stores/constant'
import { createSharedComposable } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import authService from '../api/authService'
import type { UserResponse } from '@/types/student/dashboard_information'
import { type Session } from '@/types/student/sessions'
const { session, user:  users } = constant

export const useStudentDashboard = createSharedComposable(() => {
  const user = ref<UserResponse['user'] | null>(null)
  const sessions = ref<Session[] | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // fetch user information
  async function getStudentInformation() {
    loading.value = true
    error.value = null
    try {
      const response = await authService.getCurrentUser()
      console.log('THIS IS THE MAIN RESPONSE: ', response)
      user.value = response.data.user
    } catch (err) {
      console.error(err)
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  // get  session
  async function getSessions() {
    loading.value = true
    error.value = null
    const dashboard = new StudentDashboardRepositories()
    try {
      const response = await dashboard.getInformation(
        session.getSessionsForPayment + '?user_id=' + user.value?.username,
      )
      sessions.value = response.data as Session[]
      return response.data as Session[]
    } catch (err) {
      console.error(err)
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  // get user dashboard
  async function getUserDashboard() {
    loading.value = true
    error.value = null
    const dashboard = new StudentDashboardRepositories()
    try {
      const response = await dashboard.getInformation(users.dashboard)
      console.log('THIS IS THE USER DASHBOARD: ', response)
      return response.data
    } catch (err) {
      console.error(err)
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  // get current session
  async function getCurrentSessison() {
    loading.value = true
    error.value = null
    const dashboard = new StudentDashboardRepositories()
    console.log(user.value?.programme.programmeType.id)
    try {
      const response = await dashboard.getInformation(
        session.current + '/' + parseInt(user.value?.programme.programmeType.id || '0'),
      )
      sessions.value = response.data as Session[]
    } catch (err) {
      console.error(err)
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  return {
    getStudentInformation,
    getSessions,
    getCurrentSessison,
    getUserDashboard,
    user,
    sessions,
    loading,
    error,
  }
})
