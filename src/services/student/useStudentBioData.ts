import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'
import StudentBiodataRepository from '@/repositories/student/student.biodata.repository'
import constant from '@/stores/constant'

export const useStudentBioData = createSharedComposable(() => {
  const studentBiodataRepository = new StudentBiodataRepository()
  const tabCount = ref<string>('0')
  const isUserEditingBiodata = ref<boolean>(false)
  const headTitle = ref<string>('Loading your information...')
  const subTitle = ref<string>('Please wait while we prepare your form')
  const loading = ref<boolean>(false)

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
      await studentBiodataRepository.updateBiodata(
        constant.studentInformation.updateInformation,
        parsedEditingValues,
      )
    } catch (error) {
      return error
    }
  }

  // download student biodata
  const downloadStudentBiodata = async (student: string) => {

    headTitle.value = 'Downloading your information...'
    subTitle.value = 'Please wait while we prepare your form'
    try {
      loading.value = true
      await studentBiodataRepository.downloadstudentDocument(
        constant.studentInformation.download + '?student=' + student,
        'student-information.pdf',
      )
    } catch (error) {
      return error
    } finally {
      loading.value = false
      headTitle.value = 'Loading your information...'
      subTitle.value = 'Please wait while we prepare your form'
    }
  }
  return { tabCount, updateBioData, downloadStudentBiodata, loading, headTitle, subTitle }
})
