<template>
  <div class="container mx-auto p-8 bg-white rounded-lg shadow-md relative h-full">
 <!--    <SpinningAnimation :loading="loading" /> -->

    <transition name="fade">
      <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Country Field -->
        <div>
          <label for="country" class="block text-sm font-medium text-gray-700 mb-1 labels"
            >Country</label
          >
          <div class="relative">
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
        <div>
          <label for="state" class="block text-sm font-medium text-gray-700 mb-1 labels"
            >State</label
          >
          <div class="relative">
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
        <div>
          <label for="lgaCity" class="block text-sm font-medium text-gray-700 mb-1 labels"
            >LGA/City</label
          >
          <div class="relative">
            <InputText
              id="lgaCity"
              v-model="formData.lgaCity"
              type="text"
              class="w-full pr-10"
              :placeholder="user?.information.lga?.name || 'Enter LGA/City'"
              :readonly="!editableFields.lgaCity"
              :class="{ 'bg-gray-50': !editableFields.lgaCity }"
            />
            <EditToggle
              :is-editing="editableFields.lgaCity"
              @click="toggleEdit('lgaCity')"
              class="absolute right-3 top-3"
            />
          </div>
        </div>

        <!-- Contact Address Field -->
        <div>
          <label for="contactAddress" class="block text-sm font-medium text-gray-700 mb-1 labels"
            >Contact Address</label
          >
          <div class="relative">
            <InputText
              id="contactAddress"
              v-model="formData.contactAddress"
              type="text"
              class="w-full pr-10"
              :placeholder="user?.information.contactAddress || 'Enter Contact Address'"
              :readonly="!editableFields.contactAddress"
              :class="{ 'bg-gray-50': !editableFields.contactAddress }"
            />
            <EditToggle
              :is-editing="editableFields.contactAddress"
              @click="toggleEdit('contactAddress')"
              class="absolute right-3 top-3"
            />
          </div>
        </div>

        <!-- Hometown -->
        <div>
          <label for="hometown" class="block text-sm font-medium text-gray-700 mb-1 labels"
            >Hometown</label
          >
          <div class="relative">
            <InputText
              id="hometown"
              v-model="formData.hometown"
              type="text"
              class="w-full pr-10"
              :placeholder="user?.information.homeTown || 'Enter Hometown'"
              :readonly="!editableFields.hometown"
              :class="{ 'bg-gray-50': !editableFields.hometown }"
            />
            <EditToggle
              :is-editing="editableFields.hometown"
              @click="toggleEdit('hometown')"
              class="absolute right-3 top-3"
            />
          </div>
        </div>

        <!-- Home Address -->
        <div>
          <label for="homeAddress" class="block text-sm font-medium text-gray-700 mb-1 labels"
            >Home Address</label
          >
          <div class="relative">
            <InputText
              id="homeAddress"
              v-model="formData.homeAddress"
              type="text"
              class="w-full pr-10"
              :placeholder="user?.information.homeAddress || 'Enter Home Address'"
              :readonly="!editableFields.homeAddress"
              :class="{ 'bg-gray-50': !editableFields.homeAddress }"
            />
            <EditToggle
              :is-editing="editableFields.homeAddress"
              @click="toggleEdit('homeAddress')"
              class="absolute right-3 top-3"
            />
          </div>
        </div>

        <!-- Place of Birth -->
        <div>
          <label for="placeOfBirth" class="block text-sm font-medium text-gray-700 mb-1 labels"
            >Place of Birth</label
          >
          <div class="relative">
            <InputText
              id="placeOfBirth"
              v-model="formData.placeOfBirth"
              type="text"
              class="w-full pr-10"
              :placeholder="user?.information.placeOfBirth || 'Enter Place of Birth'"
              :readonly="!editableFields.placeOfBirth"
              :class="{ 'bg-gray-50': !editableFields.placeOfBirth }"
            />
            <EditToggle
              :is-editing="editableFields.placeOfBirth"
              @click="toggleEdit('placeOfBirth')"
              class="absolute right-3 top-3"
            />
          </div>
        </div>

        <!-- Date of Birth -->
        <div>
          <label for="dateOfBirth" class="block text-sm font-medium text-gray-700 mb-1 labels"
            >Date of Birth</label
          >
          <div class="relative">
            <InputText
              id="dateOfBirth"
              class="w-full pr-10"
              :value="formData.dateOfBirth || formatDateOfBirth(user?.information?.dob)"
              readonly
              :class="{ 'bg-gray-50': true }"
            />
            <LockIndicator class="absolute right-3 top-3" />
          </div>
        </div>

        <!-- Tribe -->
        <div>
          <label for="tribe" class="block text-sm font-medium text-gray-700 mb-1 labels"
            >Tribe</label
          >
          <div class="relative">
            <InputText
              id="tribe"
              v-model="formData.tribe"
              type="text"
              class="w-full pr-10"
              :placeholder="user?.information?.tribe?.name || 'Not Specified'"
              :readonly="!editableFields.tribe"
              :class="{ 'bg-gray-50': !editableFields.tribe }"
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
          <div class="relative">
            <InputText
              id="gender"
              class="w-full pr-10"
              :value="formData.gender || 'Not Specified'"
              readonly
              :class="{ 'bg-gray-50': true }"
            />
            <LockIndicator class="absolute right-3 top-3" />
          </div>
        </div>

        <!-- Religion -->
        <div>
          <label for="religion" class="block text-sm font-medium text-gray-700 mb-1 labels"
            >Religion</label
          >
          <div class="relative">
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
          <div class="relative">
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
import { ref, computed, watch } from 'vue'
import { formatDateOfBirth } from '@/utils/dateFormater'
import type { UserResponse } from '@/types/student/dashboard_information'
import SpinningAnimation from '@/views/spinner/SpinningAnimation.vue'
import EditToggle from '@/views/student/biodata/EditToogle.vue'
import LockIndicator from './LockIndicator.vue'

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
  // Add other fields here as needed
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
  sessionStorage.setItem('biodataValues', JSON.stringify(formData.value))

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
  ;(Object.keys(editableFields.value) as Array<keyof EditableFields>).forEach((key) => {
    editableFields.value[key] = false
  })
}

const handleNext = () => {
  return
}
</script>

<style scoped>
/* Transition effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Input field styling */
input:read-only {
  cursor: not-allowed;
  color: #4b5563;
}

input:not(:read-only) {
  background-color: white;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

/* Ensure selects look disabled when readonly */
.card[disabled] {
  background-color: #f9fafb;
  cursor: not-allowed;
}
</style>
