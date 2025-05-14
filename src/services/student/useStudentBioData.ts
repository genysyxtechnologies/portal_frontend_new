import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'
import StudentBiodataRepository from '@/repositories/student/student.biodata.repository'
import constant from '@/stores/constant'

export const useStudentBioData = createSharedComposable(() => {
  const studentBiodataRepository = new StudentBiodataRepository()
  const tabCount = ref<string>('0')
  const isUserEditingBiodata = ref<boolean>(false)

  // HANDLE BIO DATA UPDATE
  const updateBioData = async () => {
    const isEditing = sessionStorage.getItem('isEditingBiodataAnyField')
    if (!isEditing) {
      isUserEditingBiodata.value = false
      return
    }
    isUserEditingBiodata.value = true
    const editingValues = sessionStorage.getItem('biodataValues')
    const parsedEditingValues = JSON.parse(editingValues || '{}')
    try {
      const response = await studentBiodataRepository.updateBiodata(
        constant.studentInformation.updateInformation,
        parsedEditingValues,
      )
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }

  return { tabCount, updateBioData }
})
