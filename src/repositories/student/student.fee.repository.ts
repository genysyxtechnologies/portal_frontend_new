import apiClient from '@/services/api/apiClient'
import StudentDashboardRepositories from './student.dashboard.repositories'

class StudentFeeRepository extends StudentDashboardRepositories {
  // download payment invoice
  async downloadInvoice(invoiceUrl: string, fileName: string) {
    try {
      const response = await apiClient.downloads(invoiceUrl, fileName)
      return response
    } catch (error) {
      return error
    }
  }
}

export default StudentFeeRepository
