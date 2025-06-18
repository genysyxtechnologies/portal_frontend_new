import { ref } from 'vue'
import ApplicationRepository from '@/repositories/application/application.repository'
import authService from '@/services/api/authService'
import type { Admission, RegisterData, ValidateUTMEData } from '@/repositories/application/application.repository'

export function useApplicant() {
  const applicationRepo = new ApplicationRepository()
  
  // Reactive state
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Get active admissions
  const getActiveAdmissions = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await applicationRepo.getActiveAdmissions()
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch admissions'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get mode of entries
  const getModeOfEntries = async (programmeTypeId: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await applicationRepo.getModeOfEntries(programmeTypeId)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch mode of entries'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Validate UTME
  const validateUTME = async (data: ValidateUTMEData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await applicationRepo.validateUTME(data)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'UTME validation failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Register applicant
  const register = async (data: RegisterData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await applicationRepo.register(data)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Login (using auth service)
  const login = async (credentials: { email: string; password: string }) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await authService.login(credentials)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update personal details
  const updatePersonalDetails = async (data: any) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await applicationRepo.updatePersonalDetails(data)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update personal details'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update contact details
  const updateContactDetails = async (data: any) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await applicationRepo.updateContactDetails(data)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update contact details'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update UTME details
  const updateUTMEDetails = async (data: any) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await applicationRepo.updateUTMEDetails(data)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update UTME details'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Initialize application fee payment
  const initializeApplicationFeePayment = async (data: any) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await applicationRepo.initializeApplicationFeePayment(data)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to initialize payment'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Verify payment
  const verifyApplicationFeePayment = async (reference: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await applicationRepo.verifyApplicationFeePayment(reference)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to verify payment'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get application summary
  const getApplicationSummary = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await applicationRepo.getApplicationSummary()
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch application summary'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Accept admission
  const acceptAdmission = async (data: any) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await applicationRepo.acceptAdmission(data)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to accept admission'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Download documents
  const downloadApplicationInvoice = async (filename?: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await applicationRepo.downloadApplicationInvoice(filename)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to download invoice'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    loading,
    error,
    
    // Methods
    getActiveAdmissions,
    getModeOfEntries,
    validateUTME,
    register,
    login,
    updatePersonalDetails,
    updateContactDetails,
    updateUTMEDetails,
    initializeApplicationFeePayment,
    verifyApplicationFeePayment,
    getApplicationSummary,
    acceptAdmission,
    downloadApplicationInvoice
  }
}

// Export types for convenience
export type { Admission, RegisterData, ValidateUTMEData }