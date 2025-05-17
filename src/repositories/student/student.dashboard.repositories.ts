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

  // download student information
  async downloadstudentDocument(endpoint: string, fileName: string) {
    return apiClient.downloads(endpoint, fileName)
  }
}

export default StudentDashboardRepositories
