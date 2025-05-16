<template>
  <div class="container mx-auto p-8 bg-white h-full rounded-xl shadow-md">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Bloog group -->
      <div>
        <label for="bloodGroup" class="block text-sm font-medium text-gray-700 mb-1 labels"
          >Blood Group</label
        >
        <div class="relative">
          <Sel-ect
            :size="'large'"
            v-model="selectedBloodGroup"
            :options="[user?.information.bloodGroup]"
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
            :options="[user?.information.genotype]"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserResponse } from '@/types/student/dashboard_information'
import { ref, watch } from 'vue'
const selectedBloodGroup = ref()
const selectedGenotype = ref()

const props = defineProps<{
  user: UserResponse['user']
  loading: boolean
}>()

type EditableFields = {
  bloodGroup: boolean
  genotype: boolean
}

// Editable state for each field with proper typing
const editableFields = ref<EditableFields>({
  bloodGroup: false,
  genotype: false,
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

// Watch for user prop changes to update form data
watch(
  () => props.user,
  (newUser) => {
    selectedBloodGroup.value = newUser?.information?.bloodGroup
    selectedGenotype.value = newUser?.information?.genotype
  },
  { immediate: true, deep: true },
)
</script>
