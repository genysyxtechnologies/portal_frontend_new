import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'
import StudentBiodataRepository from '@/repositories/student/student.biodata.repository'
import constant from '@/stores/constant'
import {
  type CountryResponse,
  type StudentBasicInformation,
  type Tribe,
} from '@/types/student/dashboard_information'

export const useStudentBioData = createSharedComposable(() => {
  const studentBiodataRepository = new StudentBiodataRepository()
  const tabCount = ref<string>('0')
  const headTitle = ref<string>('Loading your information...')
  const subTitle = ref<string>('Please wait while we prepare your form')
  const loading = ref<boolean>(false)
  const countries = ref<CountryResponse[] | null>(null)
  const tribes = ref<Tribe[] | null>(null)
  const studentBasicInformation = ref<StudentBasicInformation | null>(null)
  /*   const bloodGroups = ref<Genotype[] | null>(null)
  const genders = ref<Genotype[] | null>(null)
  const relationships = ref<MaritalStatus[] | null> (null)
 const genotype = ref<Genotype[] | null>(null)
  const religions = ref<Religion[] | null>(null)
  const maritalStatus = ref <MaritalStatus[] | null>(null) */

  // HANDLE BIO DATA UPDATE
  const updateBioData = async (student: string) => {
    loading.value = true
    headTitle.value = 'Updating your information...'
    subTitle.value = 'Please wait while we save your data'

    try {
      // Collect data from all tabs
      const bioInfoData = sessionStorage.getItem('bioInfoValues')
      const healthInfoData = sessionStorage.getItem('healthInfoValues')
      const nextOfKinData = sessionStorage.getItem('nextOfKinValues')
      const sponsorshipData = sessionStorage.getItem('sponsorshipValues')

      // Parse all data
      const parsedBioInfoData = JSON.parse(bioInfoData || '{}')
      const parsedHealthInfoData = JSON.parse(healthInfoData || '{}')
      const parsedNextOfKinData = JSON.parse(nextOfKinData || '{}')
      const parsedSponsorshipData = JSON.parse(sponsorshipData || '{}')

      // Combine all data
      const allFormData = {
        ...parsedBioInfoData,
        ...parsedHealthInfoData,
        ...parsedNextOfKinData,
        ...parsedSponsorshipData,
      }

      // Ensure required fields have values
      const requiredFields = [
        'countryId',
        'bloodGroupId',
        'nextOfKinRelationshipId',
        'maritalStatusId',
        'genotypeId',
        'religionId',
        'lgaId',
        'stateId',
        'dob',
        'genderId',
        'homeTown',
        'tribeId',
      ]

      const userDataStr = sessionStorage.getItem('userData')
      const userData = userDataStr ? JSON.parse(userDataStr) : {}
      requiredFields.forEach((field) => {
        if (!allFormData[field] || allFormData[field] === '') {
          if (field === 'genderId' && userData.gender) {
            allFormData.genderId = userData.gender === 'Male' ? 1 : 2
          } else if (userData.information && userData.information[field] !== undefined) {
            if (
              typeof userData.information[field] === 'object' &&
              userData.information[field]?.name
            ) {
              allFormData[field] = userData.information[field].name
            } else if (
              typeof userData.information[field] === 'object' &&
              userData.information[field]?.title
            ) {
              allFormData[field] = userData.information[field].title
            } else {
              allFormData[field] = userData.information[field] || 'Not Specified'
            }
          } else {
            allFormData[field] = 'Not Specified'
          }
        }
      })

      if (allFormData.hometown && !allFormData.homeTown) {
        allFormData.homeTown = allFormData.hometown
      }

      const response = await studentBiodataRepository.updateBiodata(
        constant.studentInformation.updateInformation + '?id=' + student,
        allFormData,
      )

      return response
    } catch (error) {
      return error
    } finally {
      loading.value = false
      headTitle.value = 'Loading your information...'
      subTitle.value = 'Please wait while we prepare your form'
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

  // fetch countries
  const fetchCountries = async () => {
    try {
      loading.value = true
      const response = await studentBiodataRepository.getInformation(
        constant.nationality.getCountries,
      )
      countries.value = response.data as CountryResponse[]
      return response.data as CountryResponse[]
    } catch (error) {
      return error
    } finally {
      loading.value = false
    }
  }

  // fetch states
  const fetchStates = async (countryId: number) => {
    try {
      loading.value = true
      const response = await studentBiodataRepository.getInformation(
        constant.nationality.getStates + countryId,
      )
      return response.data
    } catch (error) {
      return error
    } finally {
      loading.value = false
    }
  }

  // fetch local government
  const fetchLocalGovernment = async (stateId: number) => {
    try {
      loading.value = true
      const response = await studentBiodataRepository.getInformation(
        constant.nationality.getLgas + stateId,
      )
      return response.data
    } catch (error) {
      return error
    } finally {
      loading.value = false
    }
  }

  // fetch tribes
  const fetchTribes = async () => {
    try {
      loading.value = true
      const response = await studentBiodataRepository.getInformation(constant.nationality.getTribes)
      tribes.value = response.data as Tribe[]
      return response.data
    } catch (error) {
      return error
    } finally {
      loading.value = false
    }
  }

  // fetch basic informations
  const fetchBasicInformation = async () => {
    try {
      const response = await studentBiodataRepository.getInformation(
        constant.basicInformation.getAll,
      )
      if (response.data as StudentBasicInformation) {
        studentBasicInformation.value = response.data as StudentBasicInformation
      }
    } catch (error) {
      return error
    }
  }

  return {
    tabCount,
    updateBioData,
    fetchTribes,
    downloadStudentBiodata,
    fetchCountries,
    fetchStates,
    fetchLocalGovernment,
    fetchBasicInformation,
    studentBasicInformation,
    countries,
    tribes,
    loading,
    headTitle,
    subTitle,
  }
})
