import StudentFeeRepository from '@/repositories/student/student.fee.repository'
import constant from '@/stores/constant'
import { createSharedComposable } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import type { Level, UserResponse } from '@/types/student/dashboard_information'
import { type Session } from '@/types/student/sessions'
import type { FeeItem, FeePayment } from '@/types/student/fee.information'
const { studentInformation, payments, paymentPlatforms, schoolFees } = constant
import dayjs from 'dayjs'
import type { ApiResponse } from '@/services/api/apiClient.ts'
import { GateWays, PaymentGateway } from '@/utils/paymentGateway'

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

export interface Payment {
  id: number
  transactionId: string
  invoiceAmount: number
  paymentLink: string
  cleared: boolean
}

export interface StandaloneItem {
  fee: StandaloneFee
  payment: Payment | null
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
  const paymentGateway = ref<any>(null)
  const paymentConfig = ref<any>(null)
  const message = ref<string>('')
  const messageType = ref<'success' | 'error' | 'warning'>('success')
  const messageShow = ref(false)

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

  // Initialize transaction for standalone fee
  async function initializeTransaction(feeItem: StandaloneFee, payment: Payment | null, userId: string) {
    if (userId && feeItem) {
      if (payment == null) {
        loading.value = true
        try {
          const response = await studentFeeRepository.initializeStandalone(userId, feeItem.id)
          if (response.success) {
            message.value = 'Invoice generated'
            messageType.value = 'success'
            messageShow.value = true
            await downloadStandaloneInvoice(response.data)
            // Refresh the standalone fees list
            return response.data
          }
        } catch (err) {
          error.value = err instanceof Error ? err.message : 'Failed to initialize transaction'
          messageType.value = 'error'
          messageShow.value = true
        } finally {
          loading.value = false
        }
      } else {
        await downloadStandaloneInvoice(payment)
      }
    }
  }

  // Download standalone invoice
  async function downloadStandaloneInvoice(payment: Payment) {
    loading.value = true
    try {
      const response = await studentFeeRepository.downloadStandaloneInvoice(payment.id)
      const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const fileLink = document.createElement('a')

      fileLink.href = fileURL
      fileLink.setAttribute('download', 'invoice.pdf')
      document.body.appendChild(fileLink)

      fileLink.click()
      fileLink.remove()
      window.URL.revokeObjectURL(fileURL)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to download invoice'
      messageType.value = 'error'
      messageShow.value = true
    } finally {
      loading.value = false
    }
  }

  // Load payment gateway and make payment
  async function loadPaymentGateway(payment: Payment, standalone: StandaloneFee, userEmail: string) {
    loading.value = true
    try {
      // Initialize payment gateway (similar to original implementation)
      paymentGateway.value = new PaymentGateway(GateWays.REMITA, null, payments.processInlinePayment)

      const response = await studentFeeRepository.getPaymentPlatform(standalone.paymentPlatform.name)

      if (paymentGateway.value) {
        paymentConfig.value = response.data

        if ((response.data as any).inline) {
          setTimeout(() => {
            paymentGateway.value.initializeGateway(response.data, () => {
              makePayment(payment, userEmail)
              loading.value = false
            })
          }, 1000)
        } else {
          makePayment(payment, userEmail)
        }
      } else {
        message.value = 'No payment settings found'
        messageType.value = 'error'
        messageShow.value = true
        loading.value = false
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load payment gateway'
      messageType.value = 'error'
      messageShow.value = true
      loading.value = false
    }
  }

  // Make payment
  function makePayment(payment: Payment, userEmail: string) {
    if (payment) {
      if (paymentConfig.value?.inline) {
        paymentGateway.value.makePayment({
          email: userEmail,
          amount: payment.invoiceAmount,
          currency: 'NGN',
          invoice: payment.transactionId,
          paymentId: payment.id
        }, (data: any) => {
          window.location.reload()
        }, async (invoice: string) => {
          try {
            await studentFeeRepository.processInlinePayment(invoice)
            window.location.href = "/student/fees/standalone"
          } catch (err) {
            error.value = err instanceof Error ? err.message : 'Payment processing failed'
            messageType.value = 'error'
            messageShow.value = true
            loading.value = false
          }
        })
      } else {
        // Not inline payment - redirect to payment link
        loading.value = true
        window.location.href = payment.paymentLink
      }
    }
  }

  // Close message dialog
  function closeMessage() {
    messageShow.value = false
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
    standalones,
    // Payment functions
    initializeTransaction,
    downloadStandaloneInvoice,
    loadPaymentGateway,
    makePayment,
    // State for messages and payment
    message,
    messageType,
    messageShow,
    closeMessage,
    paymentGateway,
    paymentConfig
  }
})
