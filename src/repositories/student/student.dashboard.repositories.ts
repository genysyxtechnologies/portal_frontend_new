import apiClient, { type ApiResponse } from '@/services/api/apiClient'
import constant from '@/stores/constant.ts'
import type { StandaloneFee, StandaloneItem } from '@/services/student/useStudentFee.ts'

const { schoolFees } = constant
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

  async getStandaloneFees(session: number, user: string):Promise<ApiResponse<StandaloneItem[]>> {
    const url = `${schoolFees.standaloneForStudent}?user=${user}&session=${session}`
    return apiClient.get(url)
  }
}

export default StudentDashboardRepositories
