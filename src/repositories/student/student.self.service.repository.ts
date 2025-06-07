
import StudentDashboardRepositories from './student.dashboard.repositories'
import apiClient from '@/services/api/apiClient'
import constant from '@/stores/constant'

const { payments } = constant

class StudentSelfServiceRepository extends StudentDashboardRepositories {
  async verifyInvoice(invoiceNumber: string) {
    try {
      const response = await apiClient.post(`${payments.processInlinePayment}`, {reference: invoiceNumber})
      return response
    } catch (error) {
      throw error
    }
  }
}

export default StudentSelfServiceRepository
