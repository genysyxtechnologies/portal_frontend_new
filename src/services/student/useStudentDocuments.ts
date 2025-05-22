import { createSharedComposable } from '@vueuse/core'
import StudentDocumentRepository from '@/repositories/student/student.document.repository'
import constant from '@/stores/constant'

const { portalDocument, admission, applicants } = constant

export const useStudentDocument = createSharedComposable(() => {
  const studentDocumentRepository = new StudentDocumentRepository()

  // fetch student document
  const fetchStudentDocuments = async (programmeType: number) => {
    const page = 0
    const size = 10
    try {
      const response = await studentDocumentRepository.getInformation(
        portalDocument.all + '?page=' + page + '&size=' + size,
      )
      return response.data
    } catch (error) {
      return error
    }
  }

  // download student admission letter
  const downloadStudentAdmissionLetter = async (registrationNumber: string) => {
    try {
      const response = await studentDocumentRepository.downloadstudentDocument(
        admission.getLetter + '?q=' + registrationNumber,
        'admission-letter',
      )
      return response
    } catch (error) {
      return error
    }
  }

  // download student application summary
  const downloadStudentApplicationSummary = async (registrationNumber: string) => {
    try {
      const response = await studentDocumentRepository.downloadstudentDocument(
        applicants.applicationSummary + '?applicant=' + registrationNumber,
        'application-summary',
      )
      return response
    } catch (error) {
      return error
    }
  }
  // download student application fee invoice
  const downloadStudentFeeInvoice = async (registrationNumber: string) => {
    try {
      const response = await studentDocumentRepository.downloadstudentDocument(
        applicants.screeningInvoice + '?applicant=' + registrationNumber,
        'screening-fee-invoice',
      )
      return response
    } catch (error) {
      return error
    }
  }

  return {
    fetchStudentDocuments,
    downloadStudentAdmissionLetter,
    downloadStudentApplicationSummary,
  }
})
