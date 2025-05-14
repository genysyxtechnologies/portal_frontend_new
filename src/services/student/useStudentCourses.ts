import { createSharedComposable } from '@vueuse/core'
import StudentCourseRepository from '@/repositories/student/student.courses.repository'
import constant from '@/stores/constant'

export const useStudentCourses = createSharedComposable(() => {
  const studentCourseRepository = new StudentCourseRepository()

  // function to fetch all the courses for student
  const fetchAllCoursesForStudent = async (student: string, session: string, semester: string) => {
    try {
      const response = await studentCourseRepository.getInformation(
        constant.course.allForStudent +
          '?student=' +
          'NSU/NAS/CMP/0696/17/18' +
          '&session=' +
          17 +
          '&semester=' +
          20,
      )
      console.log('THIS ARE ALL THE COURSES TO BE REGISTERED: ', response)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    fetchAllCoursesForStudent,
  }
})
