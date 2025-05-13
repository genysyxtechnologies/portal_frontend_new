import StudentDashboardRepositories from '@/repositories/student/student.dashboard.repositories'
import constant from '@/stores/constant'
import { createSharedComposable } from '@vueuse/core'
const { studentInformation } = constant

export const useStudentDashboard = createSharedComposable(() => {
  const getStudentInformation = async () => {
    const studentDashboardRepositories = new StudentDashboardRepositories()

    try {
      const response = await studentDashboardRepositories.getInformation(
        studentInformation.getInformation + 'FT22BCMP0677',
      )
      console.log('this is the information: ', response)
      return response
    } catch (error) {
      return error
    }
  }

  return {
    getStudentInformation,
  }
})
