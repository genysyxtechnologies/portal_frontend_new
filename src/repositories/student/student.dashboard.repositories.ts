import apiClient from '@/services/api/apiClient'

class StudentDashboardRepositories {
  public async getInformation(endPoint: string) {
    try {
      const response = await apiClient.get(endPoint)
      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default StudentDashboardRepositories
