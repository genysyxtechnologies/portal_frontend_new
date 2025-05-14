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

export interface FeePayment {
  amountPayed: number
  cleared: boolean
  paymentDate: number
  invoiceAmount: number
  id: number
  invoiceUrl: string
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
