import apiClient from '@/services/api/apiClient'
import StudentDashboardRepositories from './student.dashboard.repositories'

class StudentSettingsRepository extends StudentDashboardRepositories {
  async updateProfile(endpoint: string, data: { phone: string; email: string, userId: string }) {
    return await apiClient.put(endpoint, data)
  }

  async updatePassword(endpoint: string, data: { oldPassword: string; newPassword: string, confirmPassword: string, userId: string }) {
    return await apiClient.put(endpoint, data)
  }
}

export default StudentSettingsRepository
