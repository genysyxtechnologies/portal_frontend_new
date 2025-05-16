interface ProgrammeType {
  id: number
  name: string
}

interface Semester {
  id: number
  title: string
}

export interface Session {
  id: number
  name: string
  isOpen: boolean
  creationTime: number
  updatedTime: number
  programmeType: ProgrammeType
  semesters: Semester[]
  currentSemesters: Semester[]
}
