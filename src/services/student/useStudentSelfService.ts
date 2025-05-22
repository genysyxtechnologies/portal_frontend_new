import StudentSelfServiceRepository from '@/repositories/student/student.self.service.repository'
import constant from '@/stores/constant'
import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'
const { payments} = constant

export const useStudentSelfService = createSharedComposable(() => {
  const studentSelfServiceRepository = new StudentSelfServiceRepository()
  const invoice = ref<string>('')
  const isLoading = ref<boolean>(false)
  const service = ref<{ cleared: boolean; found: boolean; invoice: string } | null>(null)
  const searchStudentInvoice = async (invoiceNumber: string = '1002757062') => {
    isLoading.value = true
    try {
      const response = await studentSelfServiceRepository.getInformation(
        `${payments.searchInvoiceStudent}?invoice=${invoiceNumber}`,
      )
      if (response.data as { cleared: boolean; found: boolean; invoice: string }) {
        service.value = response.data as { cleared: boolean; found: boolean; invoice: string }
      }
      return response.data
    } catch (error) {
      return error
    } finally {
      isLoading.value = false
    }
  }



  return {
    invoice,
    isLoading,
    searchStudentInvoice,
    service,
  }
})
