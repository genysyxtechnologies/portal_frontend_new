<template>
  <div class="container mx-auto p-8 bg-white rounded-lg shadow-md relative h-full">
    <SpinningAnimation :loading="loading" />

    <transition name="fade">
      <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Next of KIN name -->
        <div>
          <label for="nextOfKinName" class="block text-sm font-medium text-gray-700 mb-1 labels"
            >Next of KIN Name</label
          >
          <div class="relative">
            <InputText
              id="nextOfKinName"
              v-model="formData.nextOfKinName"
              type="text"
              class="w-full pr-10"
              :readonly="!editableFields.nextOfKinName"
              :class="{ 'bg-gray-50': !editableFields.nextOfKinName }"
            />
            <EditToggle
              :is-editing="editableFields.nextOfKinName"
              @click="toggleEdit('nextOfKinName')"
              class="absolute right-3 top-3"
            />
          </div>
        </div>

        <!-- Next of KIN Contact Address -->
        <div>
          <label for="nextOfKinPhone" class="block text-sm font-medium text-gray-700 mb-1 labels"
            >Next of KIN Phone</label
          >
          <div class="relative">
            <InputText
              id="nextOfKinPhone"
              v-model="formData.nextOfKinPhone"
              type="text"
              class="w-full pr-10"
              :placeholder="user?.information.nextOfKinPhone || 'Enter Next of KIN Phone'"
              :readonly="!editableFields.nextOfKinPhone"
              :class="{ 'bg-gray-50': !editableFields.nextOfKinPhone }"
            />
            <EditToggle
              :is-editing="editableFields.nextOfKinPhone"
              @click="toggleEdit('nextOfKinPhone')"
              class="absolute right-3 top-3"
            />
          </div>
        </div>

        <!-- Next of KIN Home Address -->
        <div>
          <label for="nextOfKinAddress" class="block text-sm font-medium text-gray-700 mb-1 labels"
            >Next of KIN Address</label
          >
          <div class="relative">
            <InputText
              id="nextOfKinAddress"
              v-model="formData.nextOfKinAddress"
              type="text"
              class="w-full pr-10"
              :placeholder="user?.information.nextOfKinAddress || 'Enter Next of KIN Address'"
              :readonly="!editableFields.nextOfKinAddress"
              :class="{ 'bg-gray-50': !editableFields.nextOfKinAddress }"
            />
            <EditToggle
              :is-editing="editableFields.nextOfKinAddress"
              @click="toggleEdit('nextOfKinAddress')"
              class="absolute right-3 top-3"
            />
          </div>
        </div>

        <!-- Relationship with Next of KIN -->
        <div>
          <label
            for="nextOfKinRelationship"
            class="block text-sm font-medium text-gray-700 mb-1 labels"
            >Relationship with Next of KIN</label
          >
          <div class="relative">
            <Sel-ect
              :size="'large'"
              v-model="selectedNextOfKinRelationship"
              :options="[user?.information.nextOfKinRelationship]"
              optionLabel="title"
              placeholder="Select Relationship with Next of KIN"
              class="card w-full"
              :disabled="!editableFields.nextOfKinRelationship"
            />
            <EditToggle
              :is-editing="editableFields.nextOfKinRelationship"
              @click="toggleEdit('nextOfKinRelationship')"
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
  nextOfKinName: boolean
  nextOfKinPhone: boolean
  nextOfKinAddress: boolean
}

// Define a type for our form data
type FormData = {
  nextOfKinName: string
  nextOfKinPhone: string
  nextOfKinAddress: string
}

// Editable state for each field with proper typing
const editableFields = ref<EditableFields>({
  nextOfKinRelationship: false,
  nextOfKinName: false,
  nextOfKinPhone: false,
  nextOfKinAddress: false,
})

// Form data with proper typing and initial values from props
const formData = ref<FormData>({
  nextOfKinName: props.user?.information?.nextOfKinName || 'Not Specified',
  nextOfKinPhone: props.user?.information?.nextOfKinPhone || 'Not Specified',
  nextOfKinAddress: props.user?.information?.nextOfKinAddress || 'Not Specified',
})

// Selected values for select inputs
const selectedNextOfKinRelationship = ref(props.user?.information.nextOfKinRelationship)

// Watch for user prop changes to update form data
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      formData.value = {
        nextOfKinName: newUser?.information?.nextOfKinName || '',
        nextOfKinPhone: newUser?.information?.nextOfKinPhone || '',
        nextOfKinAddress: newUser?.information?.nextOfKinAddress || '',
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

  // Store next of kin data in sessionStorage with specific key
  const nextOfKinData = {
    nextOfKinName: formData.value.nextOfKinName,
    nextOfKinPhone: formData.value.nextOfKinPhone,
    nextOfKinAddress: formData.value.nextOfKinAddress,
    // Handle different possible property names for relationship
    nextOfKinRelationship: typeof selectedNextOfKinRelationship.value === 'object' ?
      (selectedNextOfKinRelationship.value?.name || selectedNextOfKinRelationship.value?.name || '') :
      selectedNextOfKinRelationship.value || ''
  }

  console.log('Next of kin data being saved:', nextOfKinData)

  sessionStorage.setItem('nextOfKinValues', JSON.stringify(nextOfKinData))

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
