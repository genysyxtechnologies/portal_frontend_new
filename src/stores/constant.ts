export default {
  adviser: {
    makeLevel: '/staff/make-level-adviser',
  },

  application: {
    statistics: "/applications/get-application-statistics",
  },

  session: {
    create: "/session/create",
    update: "/session/update/",
    delete: "/session/delete",
    all: "/session/all-sessions",
    allForProgrammeType: "/session/all-sessions",
    /**
     * @deprecated
     */
    allForProg: "/session/all/", // to be removed
    byName: "/session/",
    byId: "/session/",
    current: "/session/current/",
    activate: "/session/activate/",
    deactivate: "/session/deactivate/",
    first: "/session/first/",
    second: "/session/second/",
    getRegisteredSessionsForStudent: "/session/get-registered-sessions",
    getFullPaidSessionsForStudent: "/session/get-full-paid-sessions",
    getSessionsForPayment: "/session/get-sessions-for-payments",
  },

  programmeTypes: {
    create: "/programme-type/create",
    update: "/programme-type/update",
    all: "/programme-type/get-all",
    updatePaymentDetails: "/programme-type/update-payment-details",
    forCurrenUser: "/programme-type/all-for-current-role",
  },

  programmes: {
    create: "/programme/create",
    update: "/programme/update",
    all: "/programme/all",
    allAvailable: "/programme/all-available",
    allFor: "/programme/all/department/",
    allForProgrammeType: "/programme/all/",
    allForProgrammeTypeAndDepartment: "/programme/all/programme-type/",
    allForDepartment: "/programme/all/department/",
    online: "/programme/all-online"
  },

  faculties: {
    create: "/faculty/create",
    update: "/faculty/update",
    find: "/faculty/id/",
    all: "/faculty/all",
    allWithDeans: "/faculty/all-with-deans",
    forCurrentUser: "/faculty/for-current-user",
  },

  department: {
    create: "/department/create",
    update: "/department/update",
    delete: "/department/delete",
    all: "/department/all",
    allForFaculty: "/department/all/",
    allForCurrentUser: "/department/for-current-user",
    allForCurrentUserAndFaculty: "/department/for-current-user-faculty",
    allWithHods: "/department/all-with-hods",
    allHods: "/department/get-hods",
    getHod: "/department/get-hod/",
    openAccess: "/department/open-result-access/",
    closeAccess: "/department/close-result-access/",
    graduationService: "/department/graduation-service/",
    getSemesterSettings: "/department/semester-settings",
    toggleResultUpload: "/department/semester-settings/toggle-result-upload",
    toggleSemesterResultUploadByDate: "/department/semester-settings/schedule-result-upload-closing",
    toggleResultChecking:
      "/department/semester-settings/toggle-result-checking",
    getAddedSubjects: "/department/get-all-subjects",
    addSubject: "/department/add-to-subjects",
    addAllSubject: "/department/add-all-to-subjects",
    removeSubject: "/department/remove-from-subjects",
    toggleCompulsory: "/department/subjects/toggle-compulsory",
    updateSubjectsGrades: "/department/subjects/update-grades",
    getAllSubjectsForApplication:
      "/department/get-all-subjects-for-application",
  },

  lecturers: {
    create: "/staff/create",
    makeFacOfficer: "/staff/make-faculty-officer/",
    makeDepOfficer: "/staff/make-department-officer/",
    makeFacDean: "/staff/make-faculty-dean/",
    makeHod: "/staff/make-hod/",
    unmakeHod: "/staff/unmake-hod/",
    updateFromAdmin: "/staff/update-from-admin",
    update: "/staff/update",
    all: "/staff/all",
    allPaginated: "/staff/all-paginated",
    allFaculty: "/staff/lecturers/faculty/",
    allDepartment: "/staff/lecturers/department/",
    getCourses: "/staff/get-assigned-courses/",
    getCoursesWithApprovalStatus: "/staff/get-assigned-courses-with-approvals/",
    allSenates: "/staff/senates/",
    makeSenate: "/staff/make-senate/",
    unmakeSenate: "/staff/unmake-senate/",
    makeVc: "/staff/make-vc/",
    makeDVCAcademics: "/staff/make-dvc-academics/",
    makeDVCAdministration: "/staff/make-dvc-administration/",
    makeBursar: "/staff/make-bursar/",
    makeRegisterer: "/staff/make-registerer/",
    makeAcademicSecretary: "/staff/make-academic-secretary/",
    makeAdmissionOfficer: "/staff/make-admission-officer",
    makeHostelOfficer: "/staff/make-hostel-officer",
    makeStudentAffairOfficer: "/staff/make-student-affair-officer",
    makeBiometricOfficer: "/staff/make-biometric-officer",
    removeBiometricOfficer: "/staff/remove-biometric-officer",
    search: "/staff/search",
    getLevelAdvisers: '/staff/get-level-advisers'
  },

  facOfficers: {
    create: "/lecturer/create",
    update: "/lecturer/update",
    all: "/lecturer/all",
  },

  settings: {
    all: "/system/settings/all",
    updateMerchantConfig: "/system/settings/update-merchant-config",
    getMerchantConfig: "/system/settings/get-merchant-config",
    getRoles: "/system/settings/get-roles",
    getStatuses: "/system/settings/get-statuses",
    getPaymentTypes: "/system/settings/get-payment-types",
    newSetting: "/system/settings/new-setting",
    createLevel: "/system/settings/levels/create",
    updateLevel: "/system/settings/levels/update",
    updateSettings: "/system/settings/update",
    createGrade: "/system/settings/grades/create",
    updateGrade: "/system/settings/grades/update",
    updateClassOfDegree: "/system/settings/update-class-of-degree",
    modeOfEntries: "/system/settings/mode-of-entries/all",
    createModeOfEntry: "/system/settings/mode-of-entries/create",
    updateModeOfEntry: "/system/settings/mode-of-entries/update",
    getLevels: "/system/settings/get-levels",
    updateIndigenousState: "/system/settings/update-indigenous/",
  },

  temporalStudents: {
    create: "/students/create_tmp/",
    update: "/students/update_tmp/",
    upload: "/students/temporal/upload/",
    migrateSingle: "/students/migrate/",
    migrateAllDep: "/students/migrate-all/",
    offerAdmission: "/students/offer-admission",
  },

  permanentStudents: {
    create: "/students/create",
    all: "/students/all-department/",
    allStudents: "/students/all-students",
    allStudentsAt: "/students/all-students-at",
    search: "/students/search",
    find: "/students/find",
    generateMatric: "/students/regenerate-matric",
    updateProgramme: "/students/update-programme",
    downloadReport: "/students/download-report",
    suspend: "/students/suspend/",
    extend: "/students/extend",
    cancelSuspension: "/students/suspend/cancel/",
    cancelDeferment: "/students/defer/cancel",
    allDeferredStudent: "/students/all-deferment",
    searchDeferStudent: "/students/search-extension",
    upload: "/students/upload/",
    registerCourse: "/students/register-course",
    unRegisterCourse: "/students/unregister-course",
    getRegisterCourses: "/students/get-registered-course",
    suspendedAndExtended: "/students/suspensions-and-extensions/",
    fetchByProgrammeAndLevel: "/students/fetch-programme-level/",
    upgradeLevel: "/students/upgrade-level",
    statsForProgramme: "/students/stats-for-programme",
    searchWithBiometricStatus: "/students/search-with-biometric-status",
    downgradeLevel: "/students/downgrade-student-level",
    updateModeOfEntry: "/students/update-mode-of-entry",
    stats: "/students/get-stats",
    addressRegistration: "/students/address-registration",
    uploadStatuses: "/students/update-statuses",
    updateMatric: "/students/update-matric"
  },

  course: {
    all: "/course/all",
    allCourses: "/course/all-courses",
    allForResultsManagement: "/course/all-for-results",
    allForStudent: "/course/get-for-student",
    allDepartmentForApproval: "/course/all/department-for-approval/",
    allDepartment: "/course/all/department",
    allDepartmentForApprovalAtFaculty:
      "/course/all/department-for-approval-faculty/",
    allProgramme: "/course/all/programme/",
    allProgrammeForApproval: "/course/all/programme-for-approval/",
    getLecturers: "/course/get-lecturers/",
    getRegisteredStudents: "/course/registered-students/",
    getRegisteredStudentsDownload: "/course/registered-students-download/",
    assignLecturers: "/course/assign-lecturers/",
    unAssignLecturers: "/course/un-assign-lecturer/",
    setMainLecturer: "/course/set-main-lecturer/",
    create: "/course/create/",
    update: "/course/update/",
    delete: "/course/delete/",
    deregisterAll: "/course/deregister-all",
    search: "/course/search",
    allPrerequisites: "/course/prerequisites/all/",
    addPrerequisite: "/course/prerequisites/add/",
    removePrerequisite: "/course/prerequisites/remove/",
    uploadCourses: "/course/upload",
    bulkRegistration: "/course/bulk-registration",
    getRegisteredAdmin: "/course/get-for-student-administrative",
    deregisterAdmin: "/course/unregister-administrative",
  },

  results: {
    create: "/results/create",
    getAllForCourseForSemester: "/results/fetch/course",
    downloadAllForCourseForSemester: "/results/download/course",
    downloadReport: "/results/download-report",
    downloadGraduationReport: "/results/download-graduation-report",
    downloadGraduationReportCsv: "/results/download-graduation-report-csv",
    uploadResult: "/results/upload/course/",
    submitCourse: "/results/submit-course/",
    updateSingleResult: "/results/update-single/",
    deleteResult: "/results/delete-result",
    deleteAllResult: "/results/delete-all",
    getReportFor: "/results/report/course/",
    getReportForProgrammeLevelDep:
      "/results/report-for-programme-level-department",
    getReportForProgrammeLevelFac:
      "/results/report-for-programme-level-faculty",
    getReportForProgrammeLevelSub:
      "/results/report-for-programme-level-sub-committee",
    getReportForProgrammeLevelSen: "/results/report-for-programme-level-senate",
    getReportForDepartmentLevel: "/results/report-for-dep-level/",
    getReportForFaculty: "/results/report-for-faculty/",
    getReportForDepartment: "/results/report-for-department/",
    moderate: "/results/moderate/course/",

    approvalCourseAtDept: "/results/approve/course/",
    disApprovalCourseAtDept: "/results/disapprove/course/",

    approvalResultsFaculty: "/results/approve-for-programme-level-faculty",
    disApprovalResultsFaculty:
      "/results/disapprove-for-programme-level-faculty",

    approvalResultsSubCommittee: "/results/approve-sub-committee",
    disapprovalResultsSubCommittee: "/results/disapprove-sub-committee",

    approvalResultsSenate: "/results/approve-senate",
    disApprovalResultsSenate: "/results/disapprove-senate",

    forStudent: "/results/student/",
    uploadSheetAdmin: "/results/upload/result-scores",
    approveAllResults: "/results/approve-all-results",
    searchResult: "/results/search",
    studentsAdmin: "/results/student-administrative",
    deleteStudentSemesterResults: "/results/delete-semester-result",
  },

  auth: {
    login: "/authenticate",
    bioAuth: "/bio-auth",
    unlock: "/unlock",
    updateLock: "/update-lock",
    logout: "/logout",
    updatePassword: "/update-password",
    enableMfa: "/enable-mfa",
    disableMfa: "/disable-mfa",
    requestCode: "/request-code",
    verifyMfa: "/verify-mfa",
    getMFAQr: "/get-mfa-qr",
    verifyRecovery: "/verify-recovery",
    confirmEnableMFA: "confirm-enable-mfa",
    sendOtp: "/send-otp",
    verifyOtp: "/verify-otp",
    updatePasswordForgot: "/update-password-forgot",
    switchUser: "/switch-user",
    revertSwitchUser: "/revert-switch-user",
  },

  user: {
    update: "/user/update/",
    dashboard: "/user/dashboard",
    lockAccount: "/user/lock-account",
    unlockAccount: "/user/unlock-account",
  },

  schoolFees: {
    createTitle: "/school-fee/titles/create",
    updateTitle: "/school-fee/titles/update",
    fetchTitles: "/school-fee/titles/all",
    createItem: "/school-fee/items/create-fee-item",
    updateItem: "/school-fee/items/update",
    deleteItem: "/school-fee/items/delete/",
    fetchItems: "/school-fee/items/fetch",
    toggleHidden: "/school-fee/items/toggle-hidden",
    toggleLatePayment: "/school-fee/items/toggle-late-payment",
    /**
     * @deprecated
     */
    allProgrammeType: "/school-fee/all/programme-type/",
    /**
     * @deprecated
     */
    allFaculty: "/school-fee/all/faculty/",
    // payment
    getFeeFor: "/school-fee/fees",
    initializePayment: "/school-fee/fees/initialize",
    refreshTransaction: "/school-fee/fee/transaction/refresh/",
    verifyTransaction: "/school-fee/fee/transaction/verify/",
    copyItems: "/school-fee/fee/copy-previous-items/",
    reportForFaculty: "/school-fee/report-for-faculty",
    invoice: "/school-fee/invoice",
    report: "/school-fee/report",
    downloadReport: "/school-fee/download-report",
    clearBatch: "/school-fee/clear-batch",
    standAloneTitles: "/school-fee/titles/all-standalone",
    createStandalone: "/standalone-payment/create",
    updateStandalone: "/standalone-payment/update",
    deleteStandalone: "/standalone-payment/delete",
    fetchStandeloneItems: "/standalone-payment/fetch",
    standaloneForStudent: "/standalone-payment/for-user",
    excludeFaculties: "/school-fee/exclude-faculties",
  },

  nationality: {
    countries: "/nationality/countries",
    states: "/nationality/",
    getCountries: "/nationality/get-countries",
    getStates: "/nationality/get-states/",
    getLgas: "/nationality/get-lgas/",
    getTribes: "/nationality/get-tribes",
    createCountry: "/nationality/create-country",
    createState: "/nationality/create-state",
    createLga: "/nationality/create-lga",
    createTribe: "/nationality/create-tribe",
    updateCountry: "/nationality/update-country",
    updateState: "/nationality/update-state",
    updateLga: "/nationality/update-lga",
    updateTribe: "/nationality/update-tribe",
    deleteCountry: "/nationality/delete-country",
    deleteState: "/nationality/delete-state",
    deleteLga: "/nationality/delete-lga",
  },


  // GET STUDENT INFORMATION
  studentInformation: {
    getInformation: "student-information/get/",
    updateInformation: "student-information/update/",
    getIDCardDetails: "student-information/get-id-card-details/",
    download: "student-information/download",
    downloadMigrationReport: "student-information/migration-report",
    cards: "student-information/cards",
    cardSingle: "student-information/cards-single",
    uploadInformation: "student-information/upload-information",
  },

  biometric: {
    enrollFingerPrint: "biometric/fingerprint/enroll",
    enrollFingerPrintBulk: "biometric/fingerprint/enroll-bulk",
    checkEnrollment: "biometric/fingerprint/check/",
    verify: "biometric/fingerprint/verify",
  },

  profilePicture: {
    store: "profile-picture/store",
    retrieve: "profile-picture/retrieve",
  },

  admission: {
    stats: "admission/stats/",
    enable: "admission/enable/",
    disable: "admission/disable/",
    getApplicationTypes: "admission/get-application-types",
    getApplicationTypesFor: "admission/get-application-types-for",
    createApplicationType: "admission/application-types/create",
    updateApplicationType: "admission/application-types/update/",
    getAdmissions: "admission/get-admissions",
    createAdmission: "admission/create",
    updateAdmission: "admission/update",
    getActiveAdmissions: "admission/get-active-admissions",
    getLetter: "/admission/letter",
    getNotification: "/admission/notification-of-admission",
  },

  courseSettings: {
    fetchForProgrammeLevel: "programme-settings/fetch",
    syncOptionalSemester: "programme-settings/sync-optional-semester",
    fetchUnregisteredForProgrammeLevel:
      "programme-settings/fetch-unregistered-course",
    addCoursesToProgramme:
      "programme-settings/add-courses-to-programme/programme/",
    deleteCourseFromProgramme:
      "programme-settings/delete-course-from-programme/",
    updateProgrammeSemesterSetting:
      "programme-settings/programme-settings/update/",
    updateCourse: "programme-settings/programme-settings/update-course",
    reEnableCourse: "programme-settings/re-enable-course-for-programme",
    downloadCourseReport: "programme-settings/download-course-report",
  },

  transcript: {
    getSetting: "transcript-config/get-transcript-setting",
    getmodeDelivery: "transcript-config/get-mode-of-deliveries",
    deliveryStatus: "transcript-config/get-transcript-delivery-statuses",
    updateFee: "transcript-config/update-transcript-fee",
    getModeofDeliveryPayment: "transcript-config/get-modeofdelivery-payment",
    updateModePayment: "transcript-config/update-mode-and-payment",
    updateCountryAndPayment: "transcript-config/update-country-and-payment",
    getStateAndPayment: "transcript-config/get-state-and-payment",
    updateStateAndPayment: "transcript-config/update-state-and-payment",
    waveSession: "transcript-config/waive_session",
    countryAndPayment: "transcript-config/get-country-and-payment",
    updateAccount: "transcript/update-account",
    makeRequest: "transcript/make-request",
    editAddress: "transcript/edit-address/delivery",
    initializeTransaction: "transcript/initialize-payment",
    getTranscript: "transcript/get-by-id",
    allTranscript: "transcript/all-for",
    getInvoice: "transcript/get-invoice",
    viewByDate: "transcript/view-by-date",
    toggleProcessed: "transcript/delivery/toggle-processed",
    generateTranscript: "/transcript/delivery/generate-transcript",
    updateStatus: "transcript/delivery/update-status",
    verify: "transcript/verify",
    getVerified: "transcript/get-transcript",
    allAddresses: "transcript/get-addresses"
  },

  signature: {
    setSignature: "/signature/update",
    getSignature: "/signature/fetch/",
    getVCSignature: "/signature/fetch/pre/get-vc-signature",
    registererSignature: "/signature/fetch/pre/get-registerer-signature",
    academicSecretarySignature:
      "/signature/fetch/pre/get-academic-secretary-signature",
  },

  global: {
    fetch: "/global/fetch",
    logo: "/global/logo",
    update: "/global/update",
    updateLogo: "/global/update-logo",
    updateOptions: "/global/update-options",
    updateEmailConfig: "/global/update-email",
    enableNotification: "/global/disable",
  },

  semester: {
    update: "/semester/update/",
    activate: "/semester/activate/",
    makeOptional: "/semester/make-optional",
    getOptional: "/semester/get-optional",
    cancelOptional: "/semester/cancel-optional",
    updateOptional: "/semester/update-optional",
    deactivate: "/semester/deactivate/",
    getPaidSemesters: "/semester/get-paid",
    getPaidAndPending: "/semester/get-paid-and-pending"
  },

  basicInformation: {
    getAll: "/basic-information/get-all",
    updateGenders: "/basic-information/update-genders",
    updateTitles: "/basic-information/update-titles",
    updateReligions: "/basic-information/update-religions",
    updateRelationships: "/basic-information/update-relationships",
    updateBloodGroups: "/basic-information/update-blood-groups",
    updateGenotypes: "/basic-information/update-genotypes",
    updateMaritalStatuses: "/basic-information/update-marital-statuses",
  },

  downloads: {
    courseForm: "/downloads/course-form",
    examCard: "/downloads/exam-card",
    offeredCourseAttendance: "/downloads/offered-course-attendance",
    resultReportSheet: "/downloads/result-report-sheet",
  },

  requirements: {
    getSsceRequirements: "/requirements/get-ssce-requirements",
    updateSSCEGrades: "/requirements/update-ssce-grades",
    updateSSCEExamTypes: "/requirements/update-ssce-exam-types",
    updateSSCEOrganization: "/requirements/update-ssce-organizations",
    getQualificationDetails: "/requirements/get-qualification-details",
    updateQualificationGrade: "/requirements/update-qualification-grades",
    updateApplicantQualification:
      "/requirements/update-applicants-qualifications",
    getInstitutionTypes: "/requirements/get-institution-types",
    updateInstitutionTypes: "/requirements/update-institution-types",
    getSubjects: "/requirements/get-subjects",
    updateSubject: "/requirements/update-subject",
    updateUserUTMEDetails: "/requirements/update-user-utme-details",
    updateUserSSCEDetails: "/requirements/update-user-ssce-details",
  },

  hostel: {
    getSettings: "/hostel/get-settings",
    updateConfig: "/hostel/update-config",
    createBlock: "/hostel/blocks/create",
    updateBlock: "/hostel/blocks/update",
    allBlocks: "/hostel/blocks/all",
    allBlocksPaginate: "/hostel/blocks/all-paginate",
    createRoom: "/hostel/rooms/create",
    updateRoom: "/hostel/rooms/update",
    allRooms: "/hostel/rooms/all",
    allRoomsForSelection: "/hostel/rooms/get-available-for-selection",
    allRoomsPaginated: "/hostel/rooms/all-paginated",
    createRoomSpace: "/hostel/room-spaces/create",
    updateRoomSpace: "/hostel/room-spaces/update",
    allRoomSpacesPaginated: "/hostel/room-spaces/all-paginated",
    allRoomSpaces: "/hostel/room-spaces/all",
    reserveRoomSpace: "/hostel/room-spaces/reserve",
    cancelReservationRoomSpace: "/hostel/room-spaces/cancel-reservation",
    revokeAllocations: "/hostel/room-spaces/revoke-all-allocations",
    allocateSpace: "/hostel/room-spaces/allocate",
    // takes path parameter (student) which is student's ID (matric number)
    getAvailableSpaces: "/hostel/room-spaces/get-available",
    // initializes payment transaction for hostel
    initializeTransaction: "/hostel/initialize-transaction",
    // verifies hostel payment
    verifyPayment: "/hostel/verify-transaction",
    // routes for students to select room space after payment
    selectSpace: "/hostel/room-spaces/select",
    // returns hostel information for student for a session
    getStudentInformation: "/hostel/get-student-information",
    // add level to privileged levels
    addLevel: "/hostel/add-level",
    // remove level from privileged levels
    removeLevel: "/hostel/remove-level",
    // invoice
    invoice: "/hostel/invoice",

    // hostel reservation
    reservations: "/hostel/reservations",
    uploadReservations: "/hostel/upload-reservations",

    downloadReport: "/hostel/download-report",
    downloadReportCsv: "/hostel/download-report-csv",
    downloadReservationReport: "/hostel/download-reservation-report",
    downloadPendingAlocationReport: "/hostel/download-pending-report",

    getReport: "/hostel/get-report",

    blockCriteria: "/hostel/blocks/criteria",
    addBlockCriteria: "/hostel/blocks/update-criteria",
    addFloorCriteria: "/hostel/floors/update-criteria",
    floorCriteria: "/hostel/floors/criteria",
    addRoomCriteria: "/hostel/rooms/update-criteria",
    roomCriteria: "/hostel/rooms/criteria",
    blockPayment: "/hostel/blocks/config",
    privilegesTypes: "/hostel/get-privileges-type",
    privileges: "/hostel/privileges",
    studentPrivileges: "/hostel/student-privileges",
    uploadStudentPrivileges: "/hostel/student-privileges/upload",
    positions: "/hostel/positions",
    allowedStudent: "/hostel/allowed-students",
    floors: "/hostel/floors",
    initializeInterestFee: "/hostel/initialize-interest-transaction",
    initializeMaintenanceFee: "/hostel/initialize-maintenance-transaction",
    initializeHostelFee: "/hostel/initialize-hostel-transaction",
    studentllocationReport: "/hostel/download-allocation-report",
    allocations: "/hostel/allocations",
    interests: "/hostel/interests",
    confirmllocations: "/hostel/allocations/confirm",
    confirmAllAllocations: "/hostel/allocations/confirm-all",
    processAllAllocations: "/hostel/allocations/allocate-all",
    rejectAllocations: "/hostel/allocations/reject",
    ejectAllocations: "/hostel/allocations/eject",
    pendingAllocations: "/hostel/allocations/pending",
    reportsData: "/hostel/reports-data",
    getRoles: "/hostel/get-roles",
    approvals: "/hostel/approvals",
    users: "/hostel/users",
    hostelUsers: "/hostel/get-hostel-users",
    checkIn: "/hostel/allocations/check-in",
    checkOut: "/hostel/allocations/check-out",
    userPrivilege: "/hostel/get-user-privilege",
    getInterestFees: '/hostel/get-interests-amount',
    updateInterestBudget: '/hostel/interests/update-budget',
    searchDisabledStudent: "/hostel/disabled-students/search",
    updateDisabledStudent: "/hostel/disabled-students/update",
    createDisabledStudent: "/hostel/disabled-students/create",
    deleteDisabledStudent: "/hostel/disabled-students/delete",
    allDisabledStudents: "/hostel/disabled-students/all",
  },

  schools: {
    all: "/schools/all",
    create: "/schools/create",
    update: "/schools/update",
    getDominant: "/schools/get-dominant",
  },

  payments: {
    processInlinePayment: "/payments/process-inline",
    initializeStandalone: "/payments/initialize-standalone-payment",
    downloadStandaloneInvoice: "/payments/get-standalone-invoice",
    waiveInvoice: "/payments/waive-standalone-invoice",
    searchInvoice: "/payments/search-invoice",
    searchInvoiceStudent: "/payments/search-invoice-student",
    invoiceForStudent: "/payments/fetch-invoices",
    deleteInvoice: "/payments/delete-invoice",
    moveStandaloneInvoice: "/payments/move-standalone-payment",
    downloadProjection: "/payments/get-projection-report"
  },

  applicants: {
    all: "/applications/all",
    validateUTME: "/applications/validate-utme",
    getInitialData: "/applications/get-initial-data",
    register: "/applications/register",
    personalDetailsUpdate: "/applications/personal-details-update",
    contactDetailsUpdate: "/applications/contact-address-update",
    nextOfKinUpdate: "/applications/next-of-kin-update",
    utmeUpdate: "/applications/utme-update",
    ssceUpdate: "/applications/ssce-update",
    ssceScreeningUpdate: "/applications/screening-update",
    nyscUpdate: "/applications/nysc-update",
    qualificationUpdate: "/applications/qualification-update",
    programmeUpdate: "/applications/programme-update",
    getUTMEDetails: "/applications/get-utme-details",
    getSSCEDetails: "/applications/get-ssce-details",
    getNYCEDetails: "/applications/get-nyce-details",
    getQualificationDetails: "/applications/get-qualification-details",
    initializeApplicationFeeTransaction:
      "/applications/initialize-application-transaction",
    verifyApplicationFeeTransaction:
      "/applications/verify-application-transaction",
    initializeScreeningFeeTransaction:
      "/applications/initialize-screening-transaction",
    initializeAcceptanceFeeTransaction:
      "/applications/initialize-acceptance-transaction",
    verifyScreeningFeeTransaction: "/applications/verify-screening-transaction",
    verifyAcceptanceFeeTransaction:
      "/applications/verify-acceptance-transaction",
    uploadUTME: "/applications/upload/utme",
    uploadSSCE: "/applications/upload/ssce",
    uploadInformation: "/applications/upload/information",
    uploadStatus: "/applications/upload/status",
    uploadQualifications: "/applications/upload/qualifications",
    uploadQualificationsDocuments:
      "/applications/qualification-documents-update",
    qualificationDocument:
      "/applications/report/download-qualification-documents",
    recordSheet: "/applications/report/record-sheet",
    ssceScreeningReportSheet:
      "/applications/report/ssce-screening-report-sheet",
    qualificationReportSheet: "/applications/report/qualification-report-sheet",
    rejectAdmission: "/applications/reject-admission",
    acceptAdmission: "/applications/accept-admission",
    updateStatus: "/applications/update-status",
    updatePrompted: "/applications/update-prompted",
    updateStartDetails: "/applications/update-start-details",
    // next application actions
    nextToContactDetails: "/applications/next-to-contact-address",
    nextToNextOfKinDetails: "/applications/next-to-next-of-kin",
    nextToProgrammeUpdate: "/applications/next-to-programme-update",
    nextToApplicationFee: "/applications/next-to-application-fee",
    nextToScreeningFee: "/applications/next-to-screening-fee",
    nextToUTMEUpdate: "/applications/next-to-utme-update",
    nextToSSCEUpdate: "/applications/next-to-ssce-update",
    nextToNYSCUpdate: "/applications/next-to-nysc-update",
    nextToQualificationUpdate: "/applications/next-to-qualifications-update",
    toggleClear: "/applications/clear-applicant",
    revokeClearance: "/applications/revoke-clearance",
    applicationInvoice: "/applications/application-invoice",
    screeningInvoice: "/applications/screening-invoice",
    acceptanceInvoice: "/applications/acceptance-invoice",
    applicationSummary: "/applications/application-summary",
    screeningForm: "/applications/screening-form",
    transcriptForm: "/applications/transcript-form",
    updatePhone: "/applications/update-phone",
    find: "/applications/find",
    stepApplicant: "/applications/step-applicant",
    updateApplicant: "/applications/update-applicant",
    screenApplicant: "/applications/screen-applicant",
    runCombinationCheck: "/applications/run-combination-check",
    resetApplication: "/applications/reset-application",
    upgradeToStudent: "/applications/migrate-applicant",
    generateId: "/applications/generate-id",
    updateJambReg: "/applications/update-jamb-reg",
    fixDataUpload: "/applications/fix-data-upload",
    toggleApplication: "/applications/toggle-allow-application",
    screeningChecklist: "/applications/screening-checklist"
  },

  programmeChange: {
    getConfig: "/programme-change/get-config",
    updateConfig: "/programme-change/update-config",
    applyApplicant: "/programme-change/programme-change-applicant",
    getPendingForApplicant: "/programme-change/get-pending-for-applicant",
    getAllForApplicant: "/programme-change/get-all-for-applicant",
    approveApplicant: "/programme-change/approve-applicant",
    disapproveApplicant: "/programme-change/disapprove-applicant",
    getCurrentPayment: "/programme-change/get-current-payment",
    getAll: "/programme-change/get-all",
    initializeApplicantChangeOfProgramme:
      "/programme-change/initialize-applicant-transaction",
    // students section
    initializeStudentChangeOfProgramme:
      "/programme-change/initialize-student-transaction",
    getPendingForStudent: "/programme-change/get-pending-for-student",
    applyStudent: "/programme-change/change-programme-student",
    getAllStudents: "/programme-change/get-all-students",
    getAllForStudent: "/programme-change/get-all-for-student",
    approveStudent: "/programme-change/approve-student",
    disapproveStudent: "/programme-change/disapprove-student",
    // downloads
    invoice: "/programme-change/invoice",
    form: "/programme-change/form",
  },

  paymentPlatforms: {
    all: "/payment-platforms/all",
    update: "/payment-platforms/update",
    toggleActive: "/payment-platforms/toggle-active",
    getActive: "/payment-platforms/get-active",
    find: "/payment-platforms/find",
  },

  splitAccounts: {
    all: "/split-accounts/all",
    create: "/split-accounts/create",
    update: "/split-accounts/update",
    delete: "/split-accounts/delete",
  },

  auditTrail: {
    all: "/audit-trail/get-all",
  },

  hospital: {
    create: "hospitals/create",
    update: "hospitals/update",
    delete: "hospitals/delete",
    all: "hospitals/get-all",
  },

  honours: {
    create: "honours/create",
    update: "honours/update",
    fetch: "honours/fetch",
  },

  defaultDocuments: {
    update: "default-document/update",
    getDocument: "default-document/get-document",
  },

  awards: {
    create: "/awards/create",
    update: "/awards/update",
    delete: "/awards/delete",
    all: "/awards/all",
    allPaginated: "/awards/all-paginated",
  },

  illness: {
    create: "/illness/create",
    update: "/illness/update",
    delete: "/illness/delete",
    all: "/illness/all",
  },

  programmeLevel: {
    find: "/programme-levels/find",
    update: "/programme-levels/update",
  },

  dataCorrections: {
    apply: "/data-correction/apply",
    toggleClear: "/data-correction/toggle-clear",
    markSolved: "/data-correction/mark-solved",
    fetchAll: "/data-correction/fetch-all",
    fetchCleared: "/data-correction/fetch-all-cleared",
    fetchPending: "/data-correction/fetch-pending",
    fetchHistory: "/data-correction/history",
  },

  scratchCards: {
    upload: "scratch-card/upload",
    getConfig: "scratch-card/get-config",
    updateConfig: "scratch-card/update-config",
    initializeTransaction: "scratch-card/transaction/initialize",
    verifyTransaction: "scratch-card/transaction/verify",
    fetch: "scratch-card/fetch",
    updateNew: "scratch-card/update-new",
  },

  reason: {
    create: "/screening-reason/create",
    update: "/screening-reason/update",
    delete: "/screening-reason/delete",
    fetchAll: "/screening-reason/fetch-all",
  },

  utmeCombination: {
    create: "utme-combination/create",
    update: "utme-combination/update",
    delete: "utme-combination/delete",
    fetch: "utme-combination/fetch",
  },

  ssceCombination: {
    create: "ssce-combination/create",
    update: "ssce-combination/update",
    delete: "ssce-combination/delete",
    fetch: "ssce-combination/fetch",
  },

  external: {
    create: "external_client/create",
    update: "external_client/update",
    delete: "external_client/delete",
    all: "external_client/all",
  },

  studentProgress: {
    fetch: 'student-progress/find',
    create: 'student-progress/create',
    update: 'student-progress/update',
    delete: 'student-progress/delete',
  },

  studentProgressStatus: {
    create:"/student-progress-status/create",
    update: "/student-progress-status/update",
    delete: "/student-progress-status/delete",
    all: "/student-progress-status/get-all",
    allStudents:"/student-progress-status/get-students",
    initializepayment: "/student-progress-status/initialize-payment",
    pendingpayments: "/student-progress-status/get-pending-payment",
    getnextforstudent: "/student-progress-status/get-next-for-student",
    getcurrentforstudent: "/student-progress-status/get-current-for-student",
    updatestatus: "/student-progress-status/update-status",
    invoice: "/student-progress-status/invoice"
  },

  annoucement: {
    create: "/announcement/create",
    update: "/announcement/update",
    delete: "/announcement/delete",
    allActive: "/announcement/active-auth",
    allPublic: "/announcement/all-active",
    allPaginate: "/announcement/all-paginated",
  },

  portalDocument: {
    create: "/portal-document/create",
    update: "/portal-document/update",
    all: "/portal-document/get-all",
    delete: "/portal-document/delete",
  },

  support: {
    create: "/launched-script/create",
    all: "/launched-script/all",
    update:"/launched-script/update",
    get: "/launched-script/get",
    delete: "/launched-script/delete",
  },

  question: {
    create: "/question/create",
    fetchOption: "/question/fetch-options",
    update: "/question/update",
    upload: "/question/upload",
    delete: "/question/delete",
    compulsory: "/question/compulsory",
    all: "/question/all-question",
  },

  faker: {
    verifyPayment: "/faker/payment/process"
  },

  departmentUtme: {
    create: "/department-utme",
    get: "/department-utme",
  },

  registrationApproval: {
    create: "/registration-approval-stages",
  },

  waiveReason: {
    create: "/waive-reason/create",
    update: "/waive-reason/update",
    delete: "/waive-reason/delete",
    all: "/waive-reason/all",
  },
};
