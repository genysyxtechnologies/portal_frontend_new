<template>
  <div class="container mx-auto p-8 bg-white h-full rounded-xl shadow-md">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Blood group -->
      <div>
        <label for="bloodGroup" class="block text-sm font-medium text-gray-700 mb-1 labels"
          >Blood Group</label
        >
        <div class="relative">
          <Sel-ect
            :size="'large'"
            v-model="selectedBloodGroup"
            :options="studentBasicInformation?.bloodGroups"
            optionLabel="name"
            placeholder="Select Blood Group"
            class="card w-full"
            :disabled="!editableFields.bloodGroup"
          />
          <EditToggle
            :is-editing="editableFields.bloodGroup"
            @click="toggleEdit('bloodGroup')"
            class="absolute right-3 top-3"
          />
        </div>
      </div>

      <!-- Genotype -->
      <div>
        <label for="genotype" class="block text-sm font-medium text-gray-700 mb-1 labels"
          >Genotype</label
        >
        <div class="relative">
          <Sel-ect
            :size="'large'"
            v-model="selectedGenotype"
            :options="studentBasicInformation?.genotypes"
            optionLabel="name"
            placeholder="Select Genotype"
            class="card w-full"
            :disabled="!editableFields.genotype"
          />
          <EditToggle
            :is-editing="editableFields.genotype"
            @click="toggleEdit('genotype')"
            class="absolute right-3 top-3"
          />
        </div>
      </div>

      <!-- Disability -->
      <div>
        <label for="disability" class="block text-sm font-medium text-gray-700 mb-1 labels"
          >Disability</label
        >
        <div class="relative">
          <InputText
            id="disability"
            v-model="formData.disability"
            type="text"
            class="w-full pr-10"
            :placeholder="user?.information.disability || 'Enter Disability (if any)'"
            :readonly="!editableFields.disability"
            :class="{ 'bg-gray-50': !editableFields.disability }"
          />
          <EditToggle
            :is-editing="editableFields.disability"
            @click="toggleEdit('disability')"
            class="absolute right-3 top-3"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StudentBasicInformation, UserResponse } from '@/types/student/dashboard_information'
import { ref, watch } from 'vue'
const selectedBloodGroup = ref()
const selectedGenotype = ref()

const props = defineProps<{
  user: UserResponse['user']
  loading: boolean
  studentBasicInformation: StudentBasicInformation
}>()

type EditableFields = {
  bloodGroup: boolean
  genotype: boolean
  disability: boolean
}

// Define a type for our form data
type FormData = {
  disability: string
}

// Editable state for each field with proper typing
const editableFields = ref<EditableFields>({
  bloodGroup: false,
  genotype: false,
  disability: false,
})

// Form data with proper typing and initial values from props
const formData = ref<FormData>({
  disability: props.user?.information?.disability || 'Not Specified',
})

// Methods with proper typing
const toggleEdit = (field: keyof EditableFields) => {
  if (!editableFields.value[field]) {
    (Object.keys(editableFields.value) as Array<keyof EditableFields>).forEach((key) => {
      editableFields.value[key] = false
    })
  }
  editableFields.value[field] = !editableFields.value[field]
}

// Function to update session storage with health info data
const updateSessionStorage = () => {
  const healthInfoData = {
    bloodGroupId: typeof selectedBloodGroup.value === 'object' ? selectedBloodGroup.value?.id || '' : selectedBloodGroup.value || '',
    genotypeId: typeof selectedGenotype.value === 'object' ? selectedGenotype.value?.id || '' : selectedGenotype.value || '',
    disability: formData.value.disability || ''
  }

  sessionStorage.setItem('healthInfoValues', JSON.stringify(healthInfoData))
}

// Watch for user prop changes to update form data
watch(
  () => props.user,
  (newUser) => {
    selectedBloodGroup.value = newUser?.information?.bloodGroup
    selectedGenotype.value = newUser?.information?.genotype

    // Update form data
    if (newUser) {
      formData.value = {
        disability: newUser.information?.disability || 'Not Specified'
      }
    }

    // Store health info data in sessionStorage
    updateSessionStorage()
  },
  { immediate: true, deep: true },
)



// Watch for changes in selected values and form data
watch([selectedBloodGroup, selectedGenotype, formData], () => {
  updateSessionStorage()
}, { deep: true })
</script>
