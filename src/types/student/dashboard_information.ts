// Base Authority interface
interface Authority {
  authority: string
}

// Country interface
interface Country {
  code: string
  disabled: boolean
  id: number
  name: string
}

// LGA (Local Government Area) interface
interface LGA {
  code: string
  creationTime: number | null
  disabled: boolean
  id: number
  name: string
  state: {
    code: string
    country: Country
    creationTime: number | null
    disabled: boolean
    id: number
    name: string
    updatedTime: number
  }
  updatedTime: number | null
}

// State interface
interface State {
  code: string
  country: Country
  creationTime: number | null
  disabled: boolean
  id: number
  name: string
  updatedTime: number
}

// Tribe interface
interface Tribe {
  disabled: boolean
  id: number
  name: string
  value: string
}

// Religion interface
interface Religion {
  id: number
  title: string
  value: string
}

interface MaritalStatus {
  id: number
  title: string
  value: string
}
type DateArray = [number, number, number] // [year, month, day]

// Genotype interface
interface Genotype {
  id: number
  name: string
  value: string
}

// User Information interface
interface UserInformation {
  admissionDate: null
  bloodGroup: Genotype
  contactAddress: string
  country: Country
  creationTime: number
  currentAcademicStatus: null
  disability: string
  dob: DateArray
  genotype: Genotype
  graduationDate: DateArray
  homeAddress: string
  homeTown: null
  id: number
  isDiabled: null
  isIndigenous: null
  jambRegistrationNumber: string
  lga: LGA
  maritalStatus: MaritalStatus
  nextOfKinAddress: string
  nextOfKinName: string
  nextOfKinPhone: string
  nextOfKinRelationship: Genotype
  otherSponsorName: string
  payerId: string
  placeOfBirth: string
  religion: Religion
  sessionGroup: string
  sponsorName: string
  sport: string
  state: State
  tribe: Tribe
  updatedTime: number
}

// Award interface
interface Award {
  code: string
  creationTime: number
  id: number
  name: string
  updatedTime: number
  value: string
}

// School interface
interface School {
  creationTime: number
  crossProgrammeTypeChange: boolean
  dominant: boolean
  id: number
  name: string
  preSenateCommitteeLabel: null
  shortName: string
  updatedTime: number
}

// Department interface
export interface Department {
  code: string
  creationTime: number
  faculty: {
    code: string
    creationTime: number
    id: number
    name: string
    numberOfQuestions: number
    science: boolean
    updatedTime: number
  }
  id: number
  name: string
  openedForAccess: boolean
  updatedTime: number
}

// Programme Type interface
interface ProgrammeType {
  admissionRole: string
  admissionType: string
  code: string
  creationTime: number
  currentSession: null
  enableProgressStatus: boolean
  firstPaymentPercentage: number
  id: number
  maintainFeesForRepeating: boolean
  modeOfEntryEnabled: boolean
  modeOfStudy: string
  modeOfStudyEnabled: boolean
  name: string
  onlineResult: boolean
  partPayment: boolean
  partPaymentForNewStudent: boolean
  paymentMode: string
  school: School
  serviceCode: string
  statementCode: string
  studentDashboardAccessStatus: string
  updatedTime: number
}

// Semester interface
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

// Academic Session interface
interface AcademicSession {
  creationTime: number
  currentSemesters: any[]
  dateOnAdmission: null
  enableRegistrationApproval: boolean
  id: number
  isOpen: boolean
  latePaymentDate: number
  latePaymentEnabled: boolean
  name: string
  openForPayment: boolean
  paymentMode: string
  programmeType: ProgrammeType
  registrationBegins: number
  registrationEnds: number
  semester: number
  semesters: Semester[]
  semestersCount: number
  sessionGroupingEnabled: boolean
  updatedTime: number
}

// Level interface
export interface Level {
  creationTime: number
  id: number
  levelOrder: number
  programmeType: ProgrammeType
  title: string
  updatedTime: number
}

// Mode of Entry interface
interface ModeOfEntry {
  creationTime: number
  id: number
  level: Level
  numberOfSemesters: number
  programmeType: ProgrammeType
  requireScreeningDocuments: boolean
  requireUtmeScores: boolean
  title: string
  updatedTime: number
  useOnMatriculation: boolean
  value: string
}

// Programme interface
export interface Programme {
  availableOnline: boolean
  award: Award
  awardName: string
  code: string
  department: Department
  id: number
  maximumCapacity: null
  maximumSemesters: number
  minimumSemesters: number
  name: string
  programmeDuration: number
  programmeType: ProgrammeType
  revenueCode: null
  startingLevel: null
}

// Main User interface
export interface User {
  accountNonExpired: boolean
  accountNonLocked: boolean
  authorities: Authority[]
  cleared: boolean
  creationTime: number
  credentialsNonExpired: boolean
  detailsCorrect: boolean
  email: string
  enabled: boolean
  firstName: string
  gender: null
  id: number
  information: UserInformation
  institutionalEmail: null
  isAdmin: boolean
  lastLevelUpdateSession: AcademicSession
  lastName: string
  level: Level
  locked: boolean
  mfa: boolean
  middleName: null
  modeOfEntry: ModeOfEntry
  name: string
  notificationCount: number
  onDeferment: boolean
  phone: string
  pin: null
  profilePicture: null
  programme: Programme
  registrationNumber: string
  roles: string[]
  screenLocked: boolean
  semesterOfAdmission: null
  studentStatus: string
  suspend: null
  updatedTime: number
  userId: string
  username: string
  yearOfAdmission: AcademicSession
}

// Root response interface
export interface UserResponse {
  user: User
  superOption: boolean
}
