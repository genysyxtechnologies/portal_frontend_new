<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="head-title">Settings</h1>
    </div>

    <div class="grid grid-cols-12 h-[calc(100vh-180px)] gap-4">
      <!-- information -->
      <div class="col-span-5 bg-[#fff] rounded-xl flex justify-center">
        <UserInformation
          :first-label="'Name'"
          :second-label="'Matric Number'"
          :third-label="'Phone Number'"
          :third-input="user?.phone"
          :first-input="user?.name"
          :second-input="user?.username"
          class="animate-fade-in-delay"
        />
      </div>
      <!-- Bio Data -->

      <div class="col-span-7 w-full rounded-xl justify-center flex flex-col gap-4">
        <StudentContactInformation
          :email="user?.email"
          :phone="user?.phone"
          @update-contact="updateContactInfo"
          :isLoading="isLoading"
        />
        <StudentPassword :userId="user?.userId!" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useStudentSettings from '@/services/student/useStudentSettings'
import UserInformation from '../dashboard/UserInformation.vue'
import StudentContactInformation from './StudentContactInformation.vue'
import StudentPassword from './StudentPassword.vue'
import { useStudentDashboard } from '@/services/student/useStudentDashboard'
import { onMounted } from 'vue'

const { user, getStudentInformation } = useStudentDashboard()
const { updateProfile, isLoading } = useStudentSettings()

// Function to handle contact information updates
const updateContactInfo = async (contactData: { phone: string; email: string}) => {
  // Update local user data
  if (user.value) {
    user.value.phone = contactData.phone
    user.value.email = contactData.email
  }

  await updateProfile({...contactData, userId: user.value?.userId!})
}

onMounted(async () => {
  await getStudentInformation()
})
</script>
