import apiClient from '@/services/api/apiClient'
import StudentDashboardRepositories from './student.dashboard.repositories'

class StudentFeeRepository extends StudentDashboardRepositories {
  // download payment invoice
  async downloadInvoice(invoiceUrl: string) {
    try {
      const response = await apiClient.download(invoiceUrl, invoiceUrl.split('/').pop() || '')
      console.log('THIS IS THE RESPONSE: ', response)
      return response
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export default StudentFeeRepository
