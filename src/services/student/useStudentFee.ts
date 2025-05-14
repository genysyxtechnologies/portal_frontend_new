import StudentFeeRepository from '@/repositories/student/student.fee.repository'
import constant from '@/stores/constant'
import { createSharedComposable } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import authService from '../api/authService'
import type { Level, UserResponse } from '@/types/student/dashboard_information'
import { type Session } from '@/types/student/sessions'
import type { FeeItem, FeePayment } from '@/types/student/fee.information'
const { studentInformation, session, schoolFees } = constant
import dayjs from 'dayjs'

export const useStudentFee = createSharedComposable(() => {
  const studentFeeRepository = new StudentFeeRepository()
  const user = ref<UserResponse['user'] | null>(null)
  const fee = ref<{
    student: UserResponse['user']
    feeItems: FeeItem[]
    level: Level
    feePayment: FeePayment
  } | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // fetch user information
  async function getStudentFee(student: string, session: number) {
    loading.value = true
    error.value = null
    try {
      const response = await studentFeeRepository.getInformation(
        schoolFees.getFeeFor + '?user=' + student + '&session=' + session,
      )
      fee.value = response.data as {
        student: UserResponse['user']
        feeItems: FeeItem[]
        level: Level
        feePayment: FeePayment
      }
    } catch (err) {
      console.error(err)
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  // this function is used to format the date
  const useFormattedDate = () => {
    const formattedDate = ref(dayjs().format('YYYY, D MMMM hh:mm A'))

    return {
      formattedDate,
    }
  }

  // function for downloading invoice
  async function downloadInvoice() {
    try {
      const response = await studentFeeRepository.downloadInvoice(
        fee.value?.feePayment.invoiceUrl || '',
      )
      return response
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    getStudentFee,
    fee,
    user,
    loading,
    error,
    useFormattedDate,
    downloadInvoice,
  }
})
