<template>
  <div
    class="bg-[#fff] flex flex-col gap-6 w-full p-8 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
    <div class="flex items-center justify-between">
      <h1 class="head-title" style="font-size: 25px">Contact Information</h1>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">{{ editMode ? 'Edit Mode' : 'View Mode' }}</span>
        <InputSwitch v-model="editMode" class="transform hover:scale-105 transition-transform duration-200" />
      </div>
    </div>

    <!-- Input Section -->
    <div class="flex flex-col gap-4 transition-all duration-300" :class="{ 'opacity-95': !editMode }">
      <div class="flex flex-col gap-2 transition-all duration-300 transform"
        :class="{ 'translate-y-0': editMode, 'translate-y-1': !editMode }">
        <span class="labels">Phone Number</span>
        <InputText v-model="phoneValue" :readonly="!editMode" :placeholder="phone"
          :class="{ 'cursor-not-allowed bg-gray-50': !editMode, 'border-blue-400 shadow-sm': editMode }"
          class="transition-all duration-300" style="border: 1px solid #90caf9" />
      </div>
      <div class="flex flex-col gap-2 transition-all duration-300 transform"
        :class="{ 'translate-y-0': editMode, 'translate-y-1': !editMode }">
        <span class="labels">Email</span>
        <InputText v-model="emailValue" :readonly="!editMode" :placeholder="email"
          :class="{ 'cursor-not-allowed bg-gray-50': !editMode, 'border-blue-400 shadow-sm': editMode }"
          class="transition-all duration-300" style="border: 1px solid #90caf9" />
      </div>
    </div>
    <ReUsableButtons   :loading="isLoading" :label="'Save Changes'" class="w-1/2 float-end self-end transform transition-all duration-300"
      :class="{ 'opacity-100 hover:scale-[1.02]': editMode, 'opacity-50 cursor-not-allowed': !editMode }"
      :disabled="!editMode" @on-click="saveChanges"/>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ReUsableButtons from '@/views/buttons/ReUsableButtons.vue'

const props = defineProps({
  phone: {
    type: String,
    default: 'Not Provided',
  },
  email: {
    type: String,
    default: 'Not Provided',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update-contact'])

// Edit mode state - default is false (view mode)
const editMode = ref(false)

// Local state for form values
const phoneValue = ref(props.phone)
const emailValue = ref(props.email)

// Watch for prop changes to update local state
watch(() => props.phone, (newValue) => {
  phoneValue.value = newValue
})

watch(() => props.email, (newValue) => {
  emailValue.value = newValue
})

// Function to save changes
const saveChanges = () => {
  if (editMode.value) {
    emit('update-contact', {
      phone: phoneValue.value,
      email: emailValue.value
    })

    // Optional: Turn off edit mode after saving
    editMode.value = false
  }
}
</script>

<style scoped>
.labels {
  font-weight: 500;
  color: #333;
}

/* Smooth transition for all elements */
* {
  transition: all 0.3s ease;
}

/* Subtle pulse animation for save button when in edit mode */
@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.02);
  }

  100% {
    transform: scale(1);
  }
}

.edit-mode-active {
  animation: pulse 2s infinite;
}
</style>
