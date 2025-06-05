import StudentDashboardRepositories from '@/repositories/student/student.dashboard.repositories'
import constant from '@/stores/constant'
import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'
import authService from '../api/authService'
import type { UserResponse } from '@/types/student/dashboard_information'
import { type Session } from '@/types/student/sessions'
import urlUtil from '@/utils/urlUtil.ts'
const { session, user: users } = constant

export const useStudentDashboard = createSharedComposable(() => {
  const user = ref<UserResponse['user'] | null>(null)
  const sessions = ref<Session[] | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const profile = ref<string | null>(null)
  const profilePicture = ref<string>('')

  // fetch user information
  async function getStudentInformation() {
    loading.value = true
    error.value = null
    try {
      const response = await authService.getCurrentUser()
      user.value = response.data.user
      profilePicture.value = urlUtil.getBaseUrl() + '/api/profile-picture/fetch?user=' + user.value?.userId
      // update user store

    } catch (err) {
      return err
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
      return err
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
      return response.data
    } catch (err) {
      return err
    } finally {
      loading.value = false
    }
  }


  // get student profile
  const getStudentProfile = async () => {
    loading.value = true
    error.value = null
    const dashboard = new StudentDashboardRepositories()
    try {
      const response = await dashboard.getInformation(users.profile + user.value?.username)
      profile.value = response.data as string
      return response.data
    } catch (err) {
      return err
    } finally {
      loading.value = false
    }
  }

  return {
    getStudentInformation,
    getSessions,
    getUserDashboard,
    getStudentProfile,
    user,
    sessions,
    loading,
    error,
    profile,
    profilePicture
  }
})
