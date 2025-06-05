import StudentFeeRepository from '@/repositories/student/student.fee.repository'
import constant from '@/stores/constant'
import { createSharedComposable } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import type { Level, UserResponse } from '@/types/student/dashboard_information'
import { type Session } from '@/types/student/sessions'
import type { FeeItem, FeePayment } from '@/types/student/fee.information'
const { studentInformation, session, schoolFees } = constant
import dayjs from 'dayjs'
import type { ApiResponse } from '@/services/api/apiClient.ts'

export interface Semester {
  creationTime: number
  updatedTime: number
  id: number
  value: number
  semesterOrder: number
  title: string
  startDate: number
  endDate: number
  open: boolean
  optionalSemester: boolean
  firstSemester: boolean
  lastSemester: boolean
  session?: Session
}

export interface PaymentPlatform {
  creationTime: number
  updatedTime: number
  name: string
  active: boolean
  publicKey: string
  verificationLink: string
  invoiceUrl: string
  paymentLink: string
  serviceType: null
  splitUrl: string
  enableSplit: boolean
  payerIdUrl: string
  inline: boolean
}

export interface Department {
  creationTime: number
  updatedTime: number
  id: number
  name: string
  code: string
  openedForAccess: boolean
}

export interface Faculty {
  creationTime: number
  updatedTime: number
  id: number
  name: string
  numberOfQuestions: number
  science: boolean
  departments: Department[]
  code: string
}

export interface FeeItemTitle {
  creationTime: number
  updatedTime: number
  id: number
  title: string
  standalone: boolean
}

export interface StandaloneFee {
  creationTime: number
  updatedTime: number
  id: number
  serviceId: string
  paymentPlatform: PaymentPlatform
  amount: number
  faculty: Faculty | null
  department: null
  programme: null
  student: null
  session: Session
  semester: Semester | null
  studentCategory: string | null
  feeItemTitle: FeeItemTitle
  level: Level | null
  feeDegree: number
  stateType: null
  beforeSchoolFee: boolean
  beforeRegistration: boolean
  generic: boolean
}

export interface StandaloneItem {
  fee: StandaloneFee
  payment: null
}


export const useStudentFee = createSharedComposable(() => {
  const studentFeeRepository = new StudentFeeRepository()
  const user = ref<UserResponse['user'] | null>(null)
  const fee = ref<{
    student: UserResponse['user']
    feeItems: FeeItem[]
    level: Level
    feePayment: FeePayment
  } | null>(null)
  const standalones = ref<StandaloneItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // fetch user information
  async function getStudentFee(student: string, session: number, semester?: number) {
    loading.value = true
    error.value = null
    try {
      let url = schoolFees.getFeeFor + '?user=' + student + '&session=' + session
      if (semester) {
        url += '&semester=' + semester
      }
      const response = await studentFeeRepository.getInformation(url)
      fee.value = response.data as {
        student: UserResponse['user']
        feeItems: FeeItem[]
        level: Level
        feePayment: FeePayment
      }
    } catch (err) {
      return err
    } finally {
      loading.value = false
    }
  }

  async function getStandaloneFees(studentId: string, session: number){
    loading.value = true
    error.value = null
    try {
      const response = await studentFeeRepository.getStandaloneFees(session, studentId)
      const data = response.data as StandaloneItem[]
      if (response.success) {
        standalones.value = response.data
      }
      return data
    } catch (err){
      error.value = err instanceof Error ? err.message : 'Failed to fetch standalone fees'
      return err
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
      return await studentFeeRepository.downloadInvoice(
        schoolFees.invoice + '?invoice=' + fee.value?.feePayment.transactionId,
        fee.value?.feePayment.transactionId!,
      )
    } catch (error) {
      return error
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
    getStandaloneFees,
    standalones
  }
})
