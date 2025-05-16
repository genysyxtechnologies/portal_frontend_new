import type { Department, Level, Programme, User } from './dashboard_information'

export interface StudentResult {
  comment: null
  data: {
    current: {
      cgpa: string
      ctce: number
      ctcr: number
      ctgp: number
      gpa: string
      registered: boolean
      tce: number
      tcr: number
      tgp: number
    }
    previous: null
    remarks: {
      co: string
      probating: boolean
      reg: string
      regs: Array<{
        cbt: boolean
        compulsory: boolean
        courseCode: string
        courseSpan: number
        creationTime: number
        creditUnit: number
        currentApprovalInformation: null
        department: Department
        disabled: boolean
        id: number
        prerequisitesCourses: any[]
        programme: null
        programmeType: {
          creationTime: number
          updatedTime: number
          id: number
          name: string
          code: string
        }
        resultApprovalInformations: any[] // Replace 'any' with proper interface if needed
        title: string
        updatedTime: number
      }>
      rep: string
      withdrawing: boolean
    }
  }
  level: Level
  percentageDiff: number
  prediction: null
  progressed: boolean
  remark: null
  results: Array<{
    approved: boolean
    ca: number
    ca2: number | null
    cbtUploadedCa: boolean
    cbtUploadedExam: boolean
    course: {
      creationTime: number
      updatedTime: number
      id: number
      courseCode: string
      title: string
    }
    creationTime: number
    exam: number
    grade: string
    id: number
    moderated: number
    registeredCourse: {
      student: User
      carryingOver: boolean
      creationTime: number
      currentApprovalStage: null
      id: number
      passed: boolean
      programmeAndCourse: {
        creditUnit: number
        programme: Programme
      }
      status: null
    }
    resultStatus: number
    resultUploadDate: null
    resultValid: boolean
    total: number
    updatedTime: number
  }>
}
