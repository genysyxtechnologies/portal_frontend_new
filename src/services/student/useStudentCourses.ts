import { createSharedComposable } from '@vueuse/core'
import StudentCourseRepository from '@/repositories/student/student.courses.repository'
import constant from '@/stores/constant'
import type { CourseData } from '@/types/student/courses.information'
import { ref } from 'vue'

export const useStudentCourses = createSharedComposable(() => {
  const studentCourseRepository = new StudentCourseRepository()
  const courses = ref<CourseData | null>(null)
  const loading = ref<boolean>(false)
  const selectedSession = ref()
  const selectedSemester = ref()

  // function to fetch all the courses for student
  const fetchAllCoursesForStudent = async (student: string, session: string, semester: string) => {
    try {
      loading.value = true
      const response = await studentCourseRepository.getInformation(
        constant.course.allForStudent +
          '?student=' +
          student +
          '&session=' +
          session +
          '&semester=' +
          semester,
      )
      console.log('THIS IS THE MAIN RESPONSE OF', student, session, semester, response)
      courses.value = response.data as CourseData
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // register student courses
  const registerStudentCourse = async (
    student: string,
    course: number,
    sessionId: number,
    semesterId: number,
  ) => {
    try {
      loading.value = true
      const response = await studentCourseRepository.registerNewCourse(
        constant.permanentStudents.registerCourse,
        { studentMatric: student, course, sessionId, semesterId },
      )
      console.log('THIS IS THE RESPONSE FOR THE NEW COURSE: ', response)
      return response
    } catch (error) {
      return error
    } finally {
      await fetchAllCoursesForStudent(student, sessionId.toString(), semesterId.toString())
      loading.value = false
    }
  }

  // remove student course
  const removeStudentCourse = async (
    student: string,
    course: number,
    sessionId: number,
    semesterId: number,
  ) => {
    try {
      loading.value = true
      const response = await studentCourseRepository.unRegisterNewCourse(
        constant.permanentStudents.unRegisterCourse,
        { studentMatric: student, course, semesterId },
      )
      console.log('THIS IS THE RESPONSE FOR THE REMOVED COURSE: ', response)
      return response
    } catch (error) {
      return error
    } finally {
      await fetchAllCoursesForStudent(student, sessionId.toString(), semesterId.toString())
      loading.value = false
    }
  }

  return {
    fetchAllCoursesForStudent,
    registerStudentCourse,
    removeStudentCourse,
    loading,
    courses,
    selectedSession,
    selectedSemester,
  }
})
