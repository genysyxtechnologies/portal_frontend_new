export interface Semester {
  creationTime: number
  endDate: number
  firstSemester: boolean
  id: number
  lastSemester: boolean
  open: boolean
  optionalSemester: boolean
  semesterOrder: number
  startDate: number
  title: string
  updatedTime: number
  value: number
}

// Enhanced payment part interface for part payments
export interface PaymentPart {
  id: string
  invoice: string
  paymentDate: string
  amountPaid: number
  success: boolean
  paymentLink?: string
  feePayment?: {
    id: string
    transactionId: string
  }
}

// Enhanced fee payment interface
export interface FeePayment {
  amountPaid: number
  cleared: boolean
  clearMode?: 'PAYMENT' | 'WAIVER'
  paymentDate: number
  invoiceAmount: number
  id: number
  invoiceUrl: string
  transactionId: string
  partPayments: PaymentPart[]
}

export interface FeeItem {
  amount: number
  department: null | string
  exemptFaculties: string[]
  faculty: null | { id: string; name: string }
  fee: 'SCHOOL_FEE' | 'LIBRARY_FEE' | 'OTHER_FEE'
  feeDegree: number
  hiddenItem: boolean
  id: number
  itemTitle: {
    creationTime: number
    id: number
    standalone: boolean
    title: string
    updatedTime: number
  }
  latePaymentItem: boolean
  level: null | string
  programme: null | string
  semester: null | number
  stateType: null | string
  studentCategory: 'APPLICANT' | 'REGULAR' | 'TRANSFER'
  title: null | string
}

// Message types for UI feedback
export type MessageType = 'success' | 'error' | 'info' | 'warning'

// Payment mode types
export type PaymentMode = 'SESSION' | 'SEMESTER'

// Session interface with payment mode
export interface SessionWithPaymentMode {
  id: number
  name: string
  paymentMode: PaymentMode
  isOpen?: boolean
  creationTime?: number
  updatedTime?: number
  programmeType?: {
    id: number
    name: string,
    partPayment:boolean
  }
  semesters?: Semester[]
  currentSemesters?: Semester[]
}

// Payment configuration interface
export interface PaymentConfig {
  name: string
  publicKey: string
  paymentLink: string
  inline: boolean
}

// Payment gateway data interface
export interface PaymentData {
  email: string
  amount: number
  currency: string
  invoice: string
  paymentId: string
}

// Payment info interface
export interface PaymentInfo {
  feePayment?: FeePayment
  feeItems?: FeeItem[]
  level?: string
  programme?: string
}

// Complete fee information interface
export interface FeeInformation {
  feePayment: FeePayment | null
  feeItems: FeeItem[]
  level?: string
  programme?: string
}
