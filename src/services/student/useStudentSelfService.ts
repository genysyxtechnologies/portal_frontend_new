import StudentSelfServiceRepository from '@/repositories/student/student.self.service.repository'
import constant from '@/stores/constant'
import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'
import type { ApiResponse } from '@/services/api/apiClient.ts'
const { payments} = constant

export type StudentInvoiceSearch = {
  cleared: boolean
  found: boolean
  invoice: string
}

export const useStudentSelfService = createSharedComposable(() => {
  const studentSelfServiceRepository = new StudentSelfServiceRepository()
  const invoice = ref<string>('')
  const isLoading = ref<boolean>(false)
  const service = ref<{ cleared: boolean; found: boolean; invoice: string } | null>(null)
  const searchStudentInvoice = async (invoiceNumber: string = '1002757062'): Promise<StudentInvoiceSearch> =>  {
    isLoading.value = true
    try {
      const response = await studentSelfServiceRepository.getInformation(
        `${payments.searchInvoiceStudent}?invoice=${invoiceNumber}`,
      )
      if (response.data) {
        service.value = response.data
      }
      return response.data
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const verifyInvoice = async (invoiceNumber: string): Promise<unknown> => {
    try {
      const response = await studentSelfServiceRepository.verifyInvoice(invoiceNumber)
      return response.data
    } catch (error) {
      throw error
    }
  }



  return {
    invoice,
    isLoading,
    searchStudentInvoice,
    service,
    verifyInvoice,
  }
})
