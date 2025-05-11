<template>
  <div class="container mx-auto p-8 bg-white rounded-lg shadow-md">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="country" class="block text-sm font-medium text-gray-700 mb-1 labels">Country</label>
        <ReUsableSelect />
      </div>

      <div>
        <label for="state" class="block text-sm font-medium text-gray-700 mb-1 labels">State</label>
        <ReUsableSelect />
      </div>

      <div>
        <label for="lgaCity" class="block text-sm font-medium text-gray-700 mb-1 labels">LGA/City</label>
        <InputText id="lgaCity" v-model="formData.lgaCity" type="text" class="w-full" />
      </div>

      <div>
        <label for="contactAddress" class="block text-sm font-medium text-gray-700 mb-1 labels">Contact Address</label>
        <InputText id="contactAddress" v-model="formData.contactAddress" type="text" class="w-full" />
      </div>

      <div>
        <label for="hometown" class="block text-sm font-medium text-gray-700 mb-1 labels">Hometown</label>
        <InputText id="hometown" v-model="formData.hometown" type="text" class="w-full" />
      </div>

      <div>
        <label for="homeAddress" class="block text-sm font-medium text-gray-700 mb-1 labels">Home Address</label>
        <InputText id="homeAddress" v-model="formData.homeAddress" type="text" class="w-full" />
      </div>

      <div>
        <label for="placeOfBirth" class="block text-sm font-medium text-gray-700 mb-1 labels">Place of Birth</label>
        <InputText id="placeOfBirth" v-model="formData.placeOfBirth" type="text" class="w-full" />
      </div>

      <div>
        <label for="dateOfBirth" class="block text-sm font-medium text-gray-700 mb-1 labels">Date of Birth</label>
        <Cal-endar id="dateOfBirth" v-model="formData.dateOfBirth" dateFormat="dd-mm-yy" class="w-full"
          :showIcon="true" />
      </div>

      <div>
        <label for="gender" class="block text-sm font-medium text-gray-700 mb-1 labels">Gender</label>
        <ReUsableSelect />
      </div>

      <div>
        <label for="tribe" class="block text-sm font-medium text-gray-700 mb-1 labels">Tribe</label>
        <InputText id="tribe" v-model="formData.tribe" type="text" class="w-full" />
      </div>

      <div>
        <label for="religion" class="block text-sm font-medium text-gray-700 mb-1 labels">Religion</label>
        <ReUsableSelect />
      </div>

      <div>
        <label for="maritalStatus" class="block text-sm font-medium text-gray-700 mb-1 labels">Marital Status</label>
        <ReUsableSelect />
      </div>

      <div class="md:col-span-1">
        <label for="jambRegNumber" class="block text-sm font-medium text-gray-700 mb-1 labels">Jamb Registration Number</label>
        <InputText id="jambRegNumber" v-model="formData.jambRegNumber" type="text" class="w-full" />
      </div>
    </div>

    <div class="flex justify-end mt-8">
      <Button label="Next" @click="handleNext" class="p-button-primary" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ReUsableSelect from '@/views/select/ReUsableSelect.vue';
import { ref } from 'vue';

// Define form data structure with TypeScript
interface FormData {
  country: { name: string; code: string } | null;
  state: { name: string; code: string } | null;
  lgaCity: string;
  contactAddress: string;
  hometown: string;
  homeAddress: string;
  placeOfBirth: string;
  dateOfBirth: Date | null;
  gender: { name: string; code: string } | null;
  tribe: string;
  religion: { name: string; code: string } | null;
  maritalStatus: { name: string; code: string } | null;
  jambRegNumber: string;
}

// Reactive form data
const formData = ref<FormData>({
  country: null,
  state: null,
  lgaCity: '',
  contactAddress: '',
  hometown: '',
  homeAddress: '',
  placeOfBirth: '',
  dateOfBirth: null,
  gender: null,
  tribe: '',
  religion: null,
  maritalStatus: null,
  jambRegNumber: '',
});

// Example options for dropdowns (replace with your actual data fetching logic)
const countryOptions = ref([
  { name: 'Nigeria', code: 'NG' },
  // Add more countries
]);

const stateOptions = ref([
  { name: 'Taraba', code: 'TB' },
  // Add more states
]);

const genderOptions = ref([
  { name: 'Male', code: 'M' },
  { name: 'Female', code: 'F' },
  { name: 'Other', code: 'O' },
]);

const religionOptions = ref([
  { name: 'Islam', code: 'IS' },
  { name: 'Christianity', code: 'CH' },
  // Add more religions
]);

const maritalStatusOptions = ref([
  { name: 'Single', code: 'S' },
  { name: 'Married', code: 'M' },
  { name: 'Divorced', code: 'D' },
  { name: 'Widowed', code: 'W' },
]);


// Handle the "Next" button click
const handleNext = () => {
  console.log('Form Data:', formData.value);
  // Implement your logic here, e.g., validation, API call, navigation
};
</script>

<style scoped>
/* Add any custom styles here if needed, though Tailwind and PrimeVue should cover most. */
/* For example, you might want to adjust PrimeVue component styles */
</style>
