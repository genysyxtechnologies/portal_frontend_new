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
  const tabCount = ref<string>('0')
  const headTitle = ref('Loading your information...')
  const subTitle = ref('Please wait while we prepare your form')

  const documents = ref([
    {
      name: 'Course form',
      value: 1,
    },
    {
      name: 'Exam card',
      value: 2,
    },
  ])
  const selectedDocument = ref(documents.value[0])

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

  // download student course form
  const downloadStudentCourseForm = async (
    student: number,
    session: number,
    semester: number,
    document: number,
  ) => {
    headTitle.value = document === 1 ? 'Downloading Course Form' : 'Downloading Exam Card'
    subTitle.value = document === 1 ? 'Please wait while we download your course form' : 'Please wait while we download your exam card'
    /**
     * handle download courseform (.pdf)
     * @param {number} student student id
     * @param {number} session session id
     * @param {number} semester semester id
     */
    try {
      loading.value = true
      const response = await studentCourseRepository.downloadSstudentDocument(
        document === 1
          ? constant.downloads.courseForm
          : constant.downloads.examCard +
              '?session=' +
              session +
              '&semester=' +
              semester +
              '&student=' +
              student,
        document === 1 ? 'course_form' : 'exam_card',
      )
      console.log('THIS IS THE RESPONSE FOR THE DOWNLOADED COURSE FORM: ', response)
      return response
    } catch (error) {
      return error
    } finally {
      loading.value = false
      headTitle.value = 'Loading your information...'
      subTitle.value = 'Please wait while we prepare your form'
    }
  }

  return {
    fetchAllCoursesForStudent,
    registerStudentCourse,
    removeStudentCourse,
    loading,
    courses,
    documents,
    tabCount,
    selectedDocument,
    selectedSession,
    selectedSemester,
    headTitle,
    subTitle,
    downloadStudentCourseForm,
  }
})
