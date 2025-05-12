<template>
  <div class=" flex flex-col gap-6">
    <div class=" flex items-center justify-between">
      <h1 class="head-title">Change Programme</h1>
      <div class="flex items-center gap-4">
        <ReUsableSelect class="flex-1" />
        <ReUsableSelect class="flex-1" />
      </div>
    </div>

    <div class="grid grid-cols-12 h-[calc(100vh-180px)] gap-4">

      <!-- information -->
      <div class="col-span-5 bg-[#fff] rounded-xl flex justify-center">
        <UserInformation :first-label="'Name'" :second-label="'Matric No'" :third-label="'Level'" />
      </div>
      <!-- Bio Data -->

      <div class="col-span-7 bg-[#fff] w-full  rounded-xl flex justify-center">
        <StudentPayment />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import ReUsableSelect from '@/views/select/ReUsableSelect.vue';
import UserInformation from '../dashboard/UserInformation.vue';
import BioData from '../dashboard/StudentInformation.vue';
import StudentPayment from './StudentPayment.vue';

</script>
