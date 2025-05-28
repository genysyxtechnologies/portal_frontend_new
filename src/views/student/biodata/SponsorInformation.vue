<template>
  <div class="container mx-auto p-8 bg-white rounded-lg shadow-md relative min-h-[500px]">
    <SpinningAnimation :loading="loading" />

    <transition name="fade">
      <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Next of KIN name -->
        <div>
          <label for="sponsorName" class="block text-sm font-medium text-gray-700 mb-1 labels"
            >Sponsor Name</label
          >
          <div class="relative">
            <InputText
              id="sponsorName"
              v-model="formData.sponsorName"
              type="text"
              class="w-full pr-10"
              :readonly="!editableFields.sponsorName"
              :class="{ 'bg-gray-50': !editableFields.sponsorName }"
            />
            <EditToggle
              :is-editing="editableFields.sponsorName"
              @click="toggleEdit('sponsorName')"
              class="absolute right-3 top-3"
            />
          </div>
        </div>

        <!-- Other Sponsor Name -->
        <div>
          <label for="otherSponsorName" class="block text-sm font-medium text-gray-700 mb-1 labels"
            >Other Sponsor Name</label
          >
          <div class="relative">
            <InputText
              id="otherSponsorName"
              v-model="formData.otherSponsorName"
              type="text"
              class="w-full pr-10"
              :placeholder="user?.information.otherSponsorName || 'Enter Other Sponsor Name'"
              :readonly="!editableFields.otherSponsorName"
              :class="{ 'bg-gray-50': !editableFields.otherSponsorName }"
            />
            <EditToggle
              :is-editing="editableFields.otherSponsorName"
              @click="toggleEdit('otherSponsorName')"
              class="absolute right-3 top-3"
            />
          </div>
        </div>

        <!-- Next of KIN Home Address -->
        <div>
          <label for="sport" class="block text-sm font-medium text-gray-700 mb-1 labels"
            >Sport</label
          >
          <div class="relative">
            <InputText
              id="sport"
              v-model="formData.sport"
              type="text"
              class="w-full pr-10"
              :placeholder="user?.information.sport || 'Enter Sport'"
              :readonly="!editableFields.sport"
              :class="{ 'bg-gray-50': !editableFields.sport }"
            />
            <EditToggle
              :is-editing="editableFields.sport"
              @click="toggleEdit('sport')"
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
import type { UserResponse } from '@/types/student/dashboard_information'
import SpinningAnimation from '@/views/spinner/SpinningAnimation.vue'
import EditToggle from '@/views/student/biodata/EditToogle.vue'

const props = defineProps<{
  user: UserResponse['user']
  loading: boolean
}>()

// Define a type for our editable fields
type EditableFields = {
  nextOfKinRelationship: boolean
  sponsorName: boolean
  otherSponsorName: boolean
  sport: boolean
}

// Define a type for our form data
type FormData = {
  sponsorName: string
  otherSponsorName: string
  sport: string
}

// Editable state for each field with proper typing
const editableFields = ref<EditableFields>({
  nextOfKinRelationship: false,
  sponsorName: false,
  otherSponsorName: false,
  sport: false,
})

// Form data with proper typing and initial values from props
const formData = ref<FormData>({
  sponsorName: props.user?.information?.sponsorName || 'Not Specified',
  otherSponsorName: props.user?.information?.otherSponsorName || 'Not Specified',
  sport: props.user?.information?.sport || 'Not Specified',
})

// Selected values for select inputs
const selectedNextOfKinRelationship = ref(props.user?.information.nextOfKinRelationship)

// Watch for user prop changes to update form data
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      formData.value = {
        sponsorName: newUser?.information?.sponsorName || '',
        otherSponsorName: newUser?.information?.otherSponsorName || '',
        sport: newUser?.information?.sport || '',
      }
      selectedNextOfKinRelationship.value = newUser?.information?.nextOfKinRelationship
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
  
  // Store sponsorship data in sessionStorage with specific key
  const sponsorshipData = {
    sponsorName: formData.value.sponsorName,
    otherSponsorName: formData.value.otherSponsorName,
    sport: formData.value.sport
  }
  
  console.log('Sponsorship data being saved:', sponsorshipData)
  sessionStorage.setItem('sponsorshipValues', JSON.stringify(sponsorshipData))

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
  ;(Object.keys(editableFields.value) as Array<keyof EditableFields>).forEach((key) => {
    editableFields.value[key] = false
  })
}

const handleNext = () => {
  console.log('Proceeding to next step')
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

.card[disabled] {
  background-color: #f9fafb;
  cursor: not-allowed;
}
</style>
