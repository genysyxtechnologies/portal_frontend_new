import apiClient from '@/services/api/apiClient'
import StudentDashboardRepositories from './student.dashboard.repositories'
import constant from '@/stores/constant.ts'

const { payments, paymentPlatforms } = constant
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

  // initialize standalone payment
  async initializeStandalone(userId: string, feeId: number) {
    try {
      const response = await apiClient.post(payments.initializeStandalone, {
        standalonePayment: feeId,
        userId: userId
      })
      return response
    } catch (error) {
      throw error
    }
  }

  // download standalone invoice
  async downloadStandaloneInvoice(paymentId: number) {
    try {
      const response = await apiClient.downloads(`/api/payment/download-standalone-invoice/${paymentId}`, 'invoice.pdf')
      return response
    } catch (error) {
      throw error
    }
  }

  // get payment platform
  async getPaymentPlatform(platformName: string) {
    try {
      const response = await apiClient.get(`${paymentPlatforms.find}?name=${platformName}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // process inline payment
  async processInlinePayment(invoice: string) {
    try {
      const response = await apiClient.post('/api/payment/process-inline', { invoice })
      return response
    } catch (error) {
      throw error
    }
  }
}

export default StudentFeeRepository
