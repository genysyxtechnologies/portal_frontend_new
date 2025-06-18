import apiClient, { type ApiResponse } from '@/services/api/apiClient'
import constant from '@/stores/constant.ts'

const { admission, applicants, settings } = constant

// Type definitions for application-related entities
export interface Admission {
  id: number
  applicationType: {
    id: number
    name: string
    autoLoadUtme: boolean
    modeOfEntryEnabled: boolean
    modeOfEntries?: Array<{
      id: number
      title: string
    }>
  }
  session: {
    id: number
    name: string
    programmeType: {
      id: number
      name: string
    }
  }
}

export interface RegisterData {
  emailAddress: string
  password: string
  confirmPassword: string
  admissionId: number
  jambRegNumber?: string | null
  modeOfEntryId?: number | null
}

export interface ValidateUTMEData {
  registrationNumber: string | null
  admissionId: number
}

export interface ModeOfEntry {
  id: number
  title: string
}

export interface ApplicationType {
  id: number
  name: string
  autoLoadUtme: boolean
  modeOfEntryEnabled: boolean
  modeOfEntries?: ModeOfEntry[]
}

class ApplicationRepository {
  // Get all active admissions available for application
  public async getActiveAdmissions(): Promise<ApiResponse<Admission[]>> {
    try {
      return await apiClient.get<Admission[]>(admission.getActiveAdmissions)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Get all admissions (including inactive)
  public async getAllAdmissions(): Promise<ApiResponse<Admission[]>> {
    try {
      return await apiClient.get<Admission[]>(admission.getAdmissions)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Get application types
  public async getApplicationTypes(): Promise<ApiResponse<ApplicationType[]>> {
    try {
      return await apiClient.get<ApplicationType[]>(admission.getApplicationTypes)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Get application types for specific programme type
  public async getApplicationTypesFor(programmeTypeId: number): Promise<ApiResponse<ApplicationType[]>> {
    try {
      return await apiClient.get<ApplicationType[]>(`${admission.getApplicationTypesFor}/${programmeTypeId}`)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Get mode of entries for a programme type
  public async getModeOfEntries(programmeTypeId: number): Promise<ApiResponse<ModeOfEntry[]>> {
    try {
      return await apiClient.get<ModeOfEntry[]>(`${settings.modeOfEntries}/${programmeTypeId}`)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Validate UTME registration number
  public async validateUTME(data: ValidateUTMEData): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.post<{ message: string }>(applicants.validateUTME, data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Register new applicant
  public async register(data: RegisterData): Promise<ApiResponse<{ message: string; applicantId?: string }>> {
    try {
      return await apiClient.post<{ message: string; applicantId?: string }>(applicants.register, data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Get initial application data (countries, states, etc.)
  public async getInitialData(): Promise<ApiResponse<any>> {
    try {
      return await apiClient.get(applicants.getInitialData)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Update personal details
  public async updatePersonalDetails(data: any): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.post<{ message: string }>(applicants.personalDetailsUpdate, data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Update contact details
  public async updateContactDetails(data: any): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.post<{ message: string }>(applicants.contactDetailsUpdate, data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Update next of kin details
  public async updateNextOfKin(data: any): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.post<{ message: string }>(applicants.nextOfKinUpdate, data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Update UTME details
  public async updateUTMEDetails(data: any): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.post<{ message: string }>(applicants.utmeUpdate, data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Update SSCE details
  public async updateSSCEDetails(data: any): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.post<{ message: string }>(applicants.ssceUpdate, data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Update qualification details
  public async updateQualificationDetails(data: any): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.post<{ message: string }>(applicants.qualificationUpdate, data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Update programme selection
  public async updateProgrammeSelection(data: any): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.post<{ message: string }>(applicants.programmeUpdate, data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Initialize application fee payment
  public async initializeApplicationFeePayment(data: any): Promise<ApiResponse<{ paymentUrl: string; reference: string }>> {
    try {
      return await apiClient.post<{ paymentUrl: string; reference: string }>(applicants.initializeApplicationFeeTransaction, data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Verify application fee payment
  public async verifyApplicationFeePayment(reference: string): Promise<ApiResponse<{ status: string; message: string }>> {
    try {
      return await apiClient.post<{ status: string; message: string }>(applicants.verifyApplicationFeeTransaction, { reference })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Initialize screening fee payment
  public async initializeScreeningFeePayment(data: any): Promise<ApiResponse<{ paymentUrl: string; reference: string }>> {
    try {
      return await apiClient.post<{ paymentUrl: string; reference: string }>(applicants.initializeScreeningFeeTransaction, data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Verify screening fee payment
  public async verifyScreeningFeePayment(reference: string): Promise<ApiResponse<{ status: string; message: string }>> {
    try {
      return await apiClient.post<{ status: string; message: string }>(applicants.verifyScreeningFeeTransaction, { reference })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Initialize acceptance fee payment
  public async initializeAcceptanceFeePayment(data: any): Promise<ApiResponse<{ paymentUrl: string; reference: string }>> {
    try {
      return await apiClient.post<{ paymentUrl: string; reference: string }>(applicants.initializeAcceptanceFeeTransaction, data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Verify acceptance fee payment
  public async verifyAcceptanceFeePayment(reference: string): Promise<ApiResponse<{ status: string; message: string }>> {
    try {
      return await apiClient.post<{ status: string; message: string }>(applicants.verifyAcceptanceFeeTransaction, { reference })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Accept admission offer
  public async acceptAdmission(data: any): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.post<{ message: string }>(applicants.acceptAdmission, data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Reject admission offer
  public async rejectAdmission(data: any): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.post<{ message: string }>(applicants.rejectAdmission, data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Get application summary
  public async getApplicationSummary(): Promise<ApiResponse<any>> {
    try {
      return await apiClient.get(applicants.applicationSummary)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Download application invoice
  public async downloadApplicationInvoice(filename: string = 'application-invoice'): Promise<boolean> {
    try {
      return await apiClient.downloads(applicants.applicationInvoice, filename)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Download screening invoice
  public async downloadScreeningInvoice(filename: string = 'screening-invoice'): Promise<boolean> {
    try {
      return await apiClient.downloads(applicants.screeningInvoice, filename)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Download acceptance invoice
  public async downloadAcceptanceInvoice(filename: string = 'acceptance-invoice'): Promise<boolean> {
    try {
      return await apiClient.downloads(applicants.acceptanceInvoice, filename)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Download screening form
  public async downloadScreeningForm(filename: string = 'screening-form'): Promise<boolean> {
    try {
      return await apiClient.downloads(applicants.screeningForm, filename)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Find applicant by ID or registration number
  public async findApplicant(identifier: string): Promise<ApiResponse<any>> {
    try {
      return await apiClient.get(`${applicants.find}?q=${identifier}`)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Get admission letter
  public async getAdmissionLetter(): Promise<ApiResponse<any>> {
    try {
      return await apiClient.get(admission.getLetter)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Get admission notification
  public async getAdmissionNotification(): Promise<ApiResponse<any>> {
    try {
      return await apiClient.get(admission.getNotification)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Upload documents
  public async uploadDocument(endpoint: string, formData: FormData): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.upload<{ message: string }>(endpoint, formData)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Upload UTME documents
  public async uploadUTMEDocument(formData: FormData): Promise<ApiResponse<{ message: string }>> {
    try {
      return await this.uploadDocument(applicants.uploadUTME, formData)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Upload SSCE documents
  public async uploadSSCEDocument(formData: FormData): Promise<ApiResponse<{ message: string }>> {
    try {
      return await this.uploadDocument(applicants.uploadSSCE, formData)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Upload qualification documents
  public async uploadQualificationDocument(formData: FormData): Promise<ApiResponse<{ message: string }>> {
    try {
      return await this.uploadDocument(applicants.uploadQualifications, formData)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Get admission statistics
  public async getAdmissionStats(sessionId?: number): Promise<ApiResponse<any>> {
    try {
      const url = sessionId ? `${admission.stats}${sessionId}` : admission.stats
      return await apiClient.get(url)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default ApplicationRepository