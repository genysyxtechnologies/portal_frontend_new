<template>
  <div class="bioinfo-container relative h-full">
    <!-- <SpinningAnimation :loading="loading" /> -->

    <transition name="fade-scale">
      <div v-if="!loading" class="bioinfo-grid">
        <!-- Country Field -->
        <div class="field-container" data-aos="fade-up" data-aos-delay="100">
          <label for="country" class="field-label">Country</label>
          <div class="input-container">
            <Sel-ect
              :size="'large'"
              v-model="selectedCountry"
              :options="[user?.information.country]"
              optionLabel="name"
              placeholder="Select Session"
              class="card w-full"
              :disabled="!editableFields.country"
            />
            <EditToggle
              :is-editing="editableFields.country"
              @click="toggleEdit('country')"
              class="absolute right-3 top-3"
            />
          </div>
        </div>

        <!-- State Field -->
        <div class="field-container" data-aos="fade-up" data-aos-delay="150">
          <label for="state" class="field-label">State</label>
          <div class="input-container">
            <Sel-ect
              :size="'large'"
              v-model="selectedState"
              :options="[user?.information.state]"
              optionLabel="name"
              placeholder="Select Session"
              class="card w-full"
              :disabled="!editableFields.state"
            />
            <EditToggle
              :is-editing="editableFields.state"
              @click="toggleEdit('state')"
              class="absolute right-3 top-3"
            />
          </div>
        </div>

        <!-- LGA/City Field -->
        <div class="field-container" data-aos="fade-up" data-aos-delay="200">
          <label for="lgaCity" class="field-label">LGA/City</label>
          <div class="input-container">
            <InputText
              id="lgaCity"
              v-model="formData.lgaCity"
              type="text"
              class="custom-input"
              :placeholder="user?.information.lga?.name || 'Enter LGA/City'"
              :readonly="!editableFields.lgaCity"
              :class="{
                'input-readonly': !editableFields.lgaCity,
                'input-active': editableFields.lgaCity,
              }"
            />
            <EditToggle
              :is-editing="editableFields.lgaCity"
              @click="toggleEdit('lgaCity')"
              class="absolute right-3 top-3"
            />
          </div>
        </div>

        <!-- Contact Address Field -->
        <div class="field-container" data-aos="fade-up" data-aos-delay="250">
          <label for="contactAddress" class="field-label">Contact Address</label>
          <div class="input-container">
            <InputText
              id="contactAddress"
              v-model="formData.contactAddress"
              type="text"
              class="custom-input"
              :placeholder="user?.information.contactAddress || 'Enter Contact Address'"
              :readonly="!editableFields.contactAddress"
              :class="{
                'input-readonly': !editableFields.contactAddress,
                'input-active': editableFields.contactAddress,
              }"
            />
            <EditToggle
              :is-editing="editableFields.contactAddress"
              @click="toggleEdit('contactAddress')"
              class="absolute right-3 top-3"
            />
          </div>
        </div>

        <!-- Hometown -->
        <div class="field-container" data-aos="fade-up" data-aos-delay="300">
          <label for="hometown" class="field-label">Hometown</label>
          <div class="input-container">
            <InputText
              id="hometown"
              v-model="formData.hometown"
              type="text"
              class="custom-input"
              :placeholder="user?.information.homeTown || 'Enter Hometown'"
              :readonly="!editableFields.hometown"
              :class="{
                'input-readonly': !editableFields.hometown,
                'input-active': editableFields.hometown,
              }"
            />
            <EditToggle
              :is-editing="editableFields.hometown"
              @click="toggleEdit('hometown')"
              class="absolute right-3 top-3"
            />
          </div>
        </div>

        <!-- Home Address -->
        <div class="field-container" data-aos="fade-up" data-aos-delay="350">
          <label for="homeAddress" class="field-label">Home Address</label>
          <div class="input-container">
            <InputText
              id="homeAddress"
              v-model="formData.homeAddress"
              type="text"
              class="custom-input"
              :placeholder="user?.information.homeAddress || 'Enter Home Address'"
              :readonly="!editableFields.homeAddress"
              :class="{
                'input-readonly': !editableFields.homeAddress,
                'input-active': editableFields.homeAddress,
              }"
            />
            <EditToggle
              :is-editing="editableFields.homeAddress"
              @click="toggleEdit('homeAddress')"
              class="absolute right-3 top-3"
            />
          </div>
        </div>

        <!-- Place of Birth -->
        <div class="field-container" data-aos="fade-up" data-aos-delay="400">
          <label for="placeOfBirth" class="field-label">Place of Birth</label>
          <div class="input-container">
            <InputText
              id="placeOfBirth"
              v-model="formData.placeOfBirth"
              type="text"
              class="custom-input"
              :placeholder="user?.information.placeOfBirth || 'Enter Place of Birth'"
              :readonly="!editableFields.placeOfBirth"
              :class="{
                'input-readonly': !editableFields.placeOfBirth,
                'input-active': editableFields.placeOfBirth,
              }"
            />
            <EditToggle
              :is-editing="editableFields.placeOfBirth"
              @click="toggleEdit('placeOfBirth')"
              class="absolute right-3 top-3"
            />
          </div>
        </div>

        <!-- Date of Birth -->
        <div class="field-container" data-aos="fade-up" data-aos-delay="450">
          <label for="dateOfBirth" class="field-label">Date of Birth</label>
          <div class="input-container">
            <InputText
              id="dateOfBirth"
              class="custom-input input-readonly"
              :value="formData.dateOfBirth || formatDateOfBirth(user?.information?.dob)"
              readonly
            />
            <LockIndicator class="absolute right-3 top-3" />
          </div>
        </div>

        <!-- Tribe -->
        <div class="field-container" data-aos="fade-up" data-aos-delay="500">
          <label for="tribe" class="field-label">Tribe</label>
          <div class="input-container">
            <InputText
              id="tribe"
              v-model="formData.tribe"
              type="text"
              class="custom-input"
              :placeholder="user?.information?.tribe?.name || 'Not Specified'"
              :readonly="!editableFields.tribe"
              :class="{
                'input-readonly': !editableFields.tribe,
                'input-active': editableFields.tribe,
              }"
            />
            <EditToggle
              :is-editing="editableFields.tribe"
              @click="toggleEdit('tribe')"
              class="absolute right-3 top-3"
            />
          </div>
        </div>

        <!-- Gender -->
        <div>
          <label for="gender" class="block text-sm font-medium text-gray-700 mb-1 labels"
            >Gender</label
          >
          <div class="input-container">
            <InputText
              id="gender"
              v-model="formData.gender"
              type="text"
              class="w-full pr-10"
              :readonly="!editableFields.gender"
              :class="{ 'bg-gray-50': !editableFields.gender }"
            />
            <EditToggle
              :is-editing="editableFields.gender"
              @click="toggleEdit('gender')"
              class="absolute right-3 top-3"
            />
          </div>
        </div>

        <!-- Religion -->
        <div>
          <label for="religion" class="block text-sm font-medium text-gray-700 mb-1 labels"
            >Religion</label
          >
          <div class="input-container">
            <Sel-ect
              :size="'large'"
              v-model="selectedReligion"
              :options="[user?.information.religion]"
              optionLabel="title"
              placeholder="Select Religion"
              class="card w-full"
              :disabled="!editableFields.religion"
            />
            <EditToggle
              :is-editing="editableFields.religion"
              @click="toggleEdit('religion')"
              class="absolute right-3 top-3"
            />
          </div>
        </div>

        <!-- marital status -->

        <div>
          <label for="maritalStatus" class="block text-sm font-medium text-gray-700 mb-1 labels"
            >Marital Status</label
          >
          <div class="input-container">
            <Sel-ect
              :size="'large'"
              v-model="selectedMaritalStatus"
              :options="[user?.information.maritalStatus]"
              optionLabel="title"
              placeholder="Select Marital Status"
              class="card w-full"
              :disabled="!editableFields.maritalStatus"
            />
            <EditToggle
              :is-editing="editableFields.maritalStatus"
              @click="toggleEdit('maritalStatus')"
              class="absolute right-3 top-3"
            />
          </div>
        </div>

        <div class="flex justify-end mt-8">
          <Button
            label="Save Changes"
            @click="handleSave"
            class="p-button-primary"
            :disabled="!hasChanges || loading"
            v-if="isEditingAnyField"
          />
          <Button
            label="Next"
            @click="handleNext"
            class="p-button-primary"
            :disabled="loading"
            v-else
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { formatDateOfBirth } from '@/utils/dateFormater'
import type { UserResponse } from '@/types/student/dashboard_information'
import EditToggle from '@/views/student/biodata/EditToogle.vue'
import LockIndicator from './LockIndicator.vue'

// Import AOS for scroll animations if not already imported globally
try {
  // @ts-expect-error - AOS might not be available globally
  const aos = window.AOS
  if (aos) {
    onMounted(() => {
      aos.refresh()
    })
  }
} catch (error) {
  console.error('AOS not available, animations might not work', error)
}

const props = defineProps<{
  user: UserResponse['user']
  loading: boolean
}>()

// Define a type for our editable fields
type EditableFields = {
  country: boolean
  state: boolean
  religion: boolean
  maritalStatus: boolean
  lgaCity: boolean
  contactAddress: boolean
  hometown: boolean
  homeAddress: boolean
  placeOfBirth: boolean
  gender: boolean
  tribe: boolean
}

// Define a type for our form data
type FormData = {
  lgaCity: string
  contactAddress: string
  hometown: string
  homeAddress: string
  placeOfBirth: string
  dateOfBirth: string
  gender: string
  tribe: string
}

// Editable state for each field with proper typing
const editableFields = ref<EditableFields>({
  country: false,
  state: false,
  religion: false,
  maritalStatus: false,
  lgaCity: false,
  contactAddress: false,
  hometown: false,
  homeAddress: false,
  placeOfBirth: false,
  gender: false,
  tribe: false,
})

// Form data with proper typing and initial values from props
const formData = ref<FormData>({
  lgaCity: props.user?.information.lga?.name || 'Not Specified',
  contactAddress: props.user?.information.contactAddress || 'Not Specified',
  hometown: props.user?.information.homeTown || 'Not Specified',
  homeAddress: props.user?.information.homeAddress || 'Not Specified',
  placeOfBirth: props.user?.information.placeOfBirth || 'Not Specified',
  dateOfBirth: formatDateOfBirth(props.user?.information?.dob) || '',
  gender: props.user?.gender || 'Not Specified',
  tribe: props.user?.information?.tribe?.name || 'Not Specified',
})

// Selected values for select inputs
const selectedCountry = ref(props.user?.information.country)
const selectedState = ref(props.user?.information.state)
const selectedReligion = ref(props.user?.information.religion)
const selectedMaritalStatus = ref(props.user?.information.maritalStatus)

// Watch for user prop changes to update form data
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      formData.value = {
        lgaCity: newUser.information.lga?.name || '',
        contactAddress: newUser.information.contactAddress || '',
        hometown: newUser.information.homeTown || '',
        homeAddress: newUser.information.homeAddress || '',
        placeOfBirth: newUser.information.placeOfBirth || '',
        dateOfBirth: formatDateOfBirth(newUser.information?.dob) || '',
        gender: newUser.gender || '',
        tribe: newUser.information?.tribe?.name || 'Not Specified',
      }
      selectedCountry.value = newUser.information.country
      selectedState.value = newUser.information.state
      selectedReligion.value = newUser.information.religion
      selectedMaritalStatus.value = newUser.information.maritalStatus
    }
  },
  { immediate: true, deep: true },
)

// Computed properties
const isEditingAnyField = computed(() => {
  sessionStorage.setItem(
    'isEditingBiodataAnyField',
    JSON.stringify(Object.values(editableFields.value).some((val) => val)),
  )

  // Store bio info data in sessionStorage with specific key
  const bioInfoData = {
    lgaCity: formData.value.lgaCity,
    contactAddress: formData.value.contactAddress,
    homeTown: formData.value.hometown, // Note: API expects homeTown (camelCase)
    homeAddress: formData.value.homeAddress,
    placeOfBirth: formData.value.placeOfBirth,
    dateOfBirth: formData.value.dateOfBirth,
    gender: formData.value.gender,
    tribe: formData.value.tribe,
    country: typeof selectedCountry.value === 'object' ? selectedCountry.value?.name || '' : selectedCountry.value || '',
    state: typeof selectedState.value === 'object' ? selectedState.value?.name || '' : selectedState.value || '',
    religion: typeof selectedReligion.value === 'object' ? selectedReligion.value?.title   || '' : selectedReligion.value || '',
    maritalStatus: typeof selectedMaritalStatus.value === 'object' ? selectedMaritalStatus.value?.title || '' : selectedMaritalStatus.value || '',
  }

  sessionStorage.setItem('bioInfoValues', JSON.stringify(bioInfoData))

  return Object.values(editableFields.value).some((val) => val)
})

const hasChanges = computed(() => {
  return isEditingAnyField.value
})

// Methods with proper typing
const toggleEdit = (field: keyof EditableFields) => {
  if (!editableFields.value[field]) {
    ;(Object.keys(editableFields.value) as Array<keyof EditableFields>).forEach((key) => {
      editableFields.value[key] = false
    })
  }
  editableFields.value[field] = !editableFields.value[field]
}

const handleSave = () => {
  // Implement save logic here
  const successMessage = document.createElement('div')
  successMessage.className = 'save-notification'
  successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Changes saved successfully!'
  document.body.appendChild(successMessage)

  // Remove the message after animation completes
  setTimeout(() => {
    successMessage.classList.add('fade-out')
    setTimeout(() => document.body.removeChild(successMessage), 500)
  }, 3000)
  ;(Object.keys(editableFields.value) as Array<keyof EditableFields>).forEach((key) => {
    editableFields.value[key] = false
  })
}

const handleNext = () => {
  return
}
</script>

<style scoped>
/* Container styling */
.bioinfo-container {
  padding: 2rem;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  overflow: hidden;
  height: 100%;
  position: relative;
}

.bioinfo-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  z-index: 1;
}

.bioinfo-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .bioinfo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Field container styling */
.field-container {
  margin-bottom: 1rem;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.field-container:hover {
  transform: translateY(-2px);
}

.field-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  letter-spacing: 0.025em;
  position: relative;
  padding-left: 0.75rem;
  transition: color 0.3s ease;
}

.field-label::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background: linear-gradient(180deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
}

/* Input container styling */
.input-container {
  position: relative;
  transition: all 0.3s ease;
}

.input-container:focus-within {
  transform: scale(1.01);
}

/* Custom input styling */
.custom-input {
  width: 100%;
  padding-right: 2.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.95rem;
  border: 1px solid #e5e7eb;
}

.input-readonly {
  background-color: #f9fafb;
  cursor: not-allowed;
  color: #4b5563;
}

.input-active {
  background-color: white;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
  50% {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
  }
}

/* Transition effects */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

/* Ensure selects look disabled when readonly */
.card[disabled] {
  background-color: #f9fafb;
  cursor: not-allowed;
  opacity: 0.8;
}

/* Add hover effect to edit toggle */
:deep(.p-inputtext:enabled:hover) {
  border-color: #6366f1;
}

:deep(.p-inputtext:enabled:focus) {
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

/* Add animation for edit toggle */
:deep(button) {
  transition:
    transform 0.2s ease,
    color 0.2s ease;
}

:deep(button:hover) {
  transform: scale(1.15);
}
</style>
