import apiClient from '@/services/api/apiClient'
import StudentDashboardRepositories from './student.dashboard.repositories'
import type { RegisterStudentCourse } from '@/types/student/courses.information'

class StudentCourseRepository extends StudentDashboardRepositories {
  // register student course
  async registerNewCourse(endpoint: string, data: RegisterStudentCourse) {
    return apiClient.post(endpoint, data)
  }

  // remove student course
  async unRegisterNewCourse(endpoint: string, data: Omit<RegisterStudentCourse, 'sessionId'>) {
    return apiClient.post(endpoint, data)
  }

  // download student course for registration
  async downloadSstudentDocument(endpoint: string, fileName: string) {
    return apiClient.downloads(endpoint, fileName)
  }
}

export default StudentCourseRepository
