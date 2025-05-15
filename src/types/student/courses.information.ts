import type { Department, Level } from './dashboard_information'

interface Course {
  cbt: boolean
  level: Level
  department: Department
  compulsory: boolean
  courseCode: string
  courseSpan: number
  creationTime: number
  creditUnit: number
  currentApprovalInformation: null
  disabled: boolean
  id: number
  lecturers: null
  mainLecturer: {
    creationTime: number
    departments: null
    faculties: null
    id: number
    professionalTitle: string
    programmeType: null
    title: {
      id: number
      title: string
      value: string
    }
    updatedTime: number
    user: {
      accountNonExpired: boolean
      accountNonLocked: boolean
      authorities: { authority: string }[]
      cleared: boolean
      creationTime: number
      credentialsNonExpired: boolean
      detailsCorrect: boolean
      email: string
      enabled: boolean
      firstName: string
      gender: null | string
      id: number
      information: null
      institutionalEmail: null | string
      isAdmin: boolean
      lastLevelUpdateSession: null
      lastName: string
      level: null
      locked: boolean
      mfa: boolean
      middleName: string
      modeOfEntry: null
      name: string
      notificationCount: number
      onDeferment: boolean
      phone: string
      pin: null
      profilePicture: null | string
      programme: null
      registrationNumber: null | string
      roles: string[]
      screenLocked: boolean
      semesterOfAdmission: null
      studentStatus: null
      suspend: null
      updatedTime: number
      userId: string
      username: string
      yearOfAdmission: null
    }
  }
  prerequisitesCourses: null
  programme: null
  resultApprovalInformations: null
  title: string
  updatedTime: number
}

export interface CourseList {
  courseCode: string
  title: string
  creditUnit: number
  id: number
}

export interface CourseData {
  courseList: CourseList[]
  registeredCourses: Course[]
}

export interface RegisterStudentCourse {
  studentMatric: string
  course: number
  sessionId: number
  semesterId: number
}
