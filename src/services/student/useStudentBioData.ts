import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'

export const useStudentBioData = createSharedComposable(() => {
  const tabCount = ref<string>('0')

  return { tabCount }
})
