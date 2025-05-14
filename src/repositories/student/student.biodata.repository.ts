import apiClient from '@/services/api/apiClient'
import StudentDashboardRepositories from './student.dashboard.repositories'

class StudentBiodataRepository extends StudentDashboardRepositories {
  updateBiodata(endDate: string, data: Record<string, string | number | boolean>) {
    return apiClient.put(endDate, data)
  }
}

export default StudentBiodataRepository
