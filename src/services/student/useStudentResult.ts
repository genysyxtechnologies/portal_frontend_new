import StudentResultRepository from '@/repositories/student/student.result.repository'
import constant from '@/stores/constant'
import { type StudentResult } from '@/types/student/result.information'
import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'
const { results } = constant

export const useStudentResult = createSharedComposable(() => {
  const studentResultRepository = new StudentResultRepository()
  const studentResult = ref<StudentResult | null>(null)
  const loading = ref<boolean>(false)

  // fetch student results
  const fetchStudentResult = async (
    student: number | string,
    session: number,
    semester: number,
  ) => {
    loading.value = true
    try {
      const response = await studentResultRepository.getInformation(
        results.forStudent +
          '?student=' +
          student +
          '&session=' +
          session +
          '&semester=' +
          semester,
      )
      studentResult.value = response.data as StudentResult
    } catch (error) {
      return error
    } finally {
      loading.value = false
    }
  }

  return { fetchStudentResult, studentResult, loading }
})
