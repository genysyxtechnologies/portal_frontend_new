<template>
  <div class="container mx-auto p-8 bg-white rounded-lg shadow-md relative min-h-[500px]">
    <SpinningAnimation :loading="loading" />

    <transition name="fade">
      <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Country Field -->
        <div>
          <label for="country" class="block text-sm font-medium text-gray-700 mb-1 labels">Country</label>
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
          <label for="state" class="block text-sm font-medium text-gray-700 mb-1 labels">State</label>
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
          <label for="lgaCity" class="block text-sm font-medium text-gray-700 mb-1 labels">LGA/City</label>
          <div class="relative">
            <InputText 
              id="lgaCity" 
              v-model="formData.lgaCity" 
              type="text" 
              class="w-full pr-10"
              :placeholder="user?.information.lga.name"
              :readonly="!editableFields.lgaCity"
              :class="{'bg-gray-50': !editableFields.lgaCity}"
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
          <label for="contactAddress" class="block text-sm font-medium text-gray-700 mb-1 labels">Contact Address</label>
          <div class="relative">
            <InputText 
              id="contactAddress" 
              v-model="formData.contactAddress" 
              type="text" 
              class="w-full pr-10"
              :placeholder="user?.information.contactAddress!"
              :readonly="!editableFields.contactAddress"
              :class="{'bg-gray-50': !editableFields.contactAddress}"
            />
            <EditToggle 
              :is-editing="editableFields.contactAddress"
              @click="toggleEdit('contactAddress')"
              class="absolute right-3 top-3"
            />
          </div>
        </div>

        <!-- Continue this pattern for all other fields -->
        <!-- Hometown -->
        <div>
          <label for="hometown" class="block text-sm font-medium text-gray-700 mb-1 labels">Hometown</label>
          <div class="relative">
            <InputText 
              id="hometown" 
              v-model="formData.hometown" 
              type="text" 
              class="w-full pr-10"
              :placeholder="user?.information.homeTown!"
              :readonly="!editableFields.hometown"
              :class="{'bg-gray-50': !editableFields.hometown}"
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
          <label for="homeAddress" class="block text-sm font-medium text-gray-700 mb-1 labels">Home Address</label>
          <div class="relative">
            <InputText 
              id="homeAddress" 
              v-model="formData.homeAddress" 
              type="text" 
              class="w-full pr-10"
              :placeholder="user?.information.contactAddress!"
              :readonly="!editableFields.homeAddress"
              :class="{'bg-gray-50': !editableFields.homeAddress}"
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
          <label for="placeOfBirth" class="block text-sm font-medium text-gray-700 mb-1 labels">Place of Birth</label>
          <div class="relative">
            <InputText 
              id="placeOfBirth" 
              v-model="formData.placeOfBirth" 
              type="text" 
              class="w-full pr-10"
              :placeholder="user?.information.homeAddress"
              :readonly="!editableFields.placeOfBirth"
              :class="{'bg-gray-50': !editableFields.placeOfBirth}"
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
          <label for="dateOfBirth" class="block text-sm font-medium text-gray-700 mb-1 labels">Date of Birth</label>
          <div class="relative">
            <InputText 
              id="dateOfBirth" 
              class="w-full pr-10"
              :value="formatDateOfBirth(user?.information?.dob)"
              :readonly="true"
              :class="{'bg-gray-50': true}"
            />
            <LockIndicator class="absolute right-3 top-3" />
          </div>
        </div>

        <!-- Continue with other fields following the same pattern -->

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
import { ref, watch, computed } from 'vue';
import { formatDateOfBirth } from '@/utils/dateFormater';
import type { UserResponse } from '@/types/student/dashboard_information';
import SpinningAnimation from '@/views/spinner/SpinningAnimation.vue';
import EditToggle from '@/components/EditToggle.vue';
import LockIndicator from '@/components/LockIndicator.vue';

const props = defineProps<{
  user: UserResponse['user']
  loading: boolean
}>()

// Editable state for each field
const editableFields = ref({
  country: false,
  state: false,
  lgaCity: false,
  contactAddress: false,
  hometown: false,
  homeAddress: false,
  placeOfBirth: false,
  // Add other fields here
});

// Form data
const formData = ref({
  lgaCity: props.user?.information.lga.name || '',
  contactAddress: props.user?.information.contactAddress || '',
  hometown: props.user?.information.homeTown || '',
  homeAddress: props.user?.information.homeAddress || '',
  placeOfBirth: props.user?.information.placeOfBirth || '',
  // Initialize other fields here
});

// Computed properties
const isEditingAnyField = computed(() => {
  return Object.values(editableFields.value).some(val => val);
});

const hasChanges = computed(() => {
  // Implement logic to detect if any fields have been modified
  return true; // Placeholder
});

// Methods
const toggleEdit = (field: string) => {
  // Close all other editable fields when opening a new one
  if (!editableFields.value[field]) {
    Object.keys(editableFields.value).forEach(key => {
      editableFields.value[key] = false;
    });
  }
  editableFields.value[field] = !editableFields.value[field];
};

const handleSave = () => {
  // Implement save logic
  Object.keys(editableFields.value).forEach(key => {
    editableFields.value[key] = false;
  });
};

const handleNext = () => {
  // Your next button logic
};
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
</style>