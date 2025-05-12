<template>
  <div class="w-full bg-[#fff] flex flex-col gap-6 p-8 rounded-xl">
    <div class="bg-[#F5F5F5] w-full p-6 rounded-xl">
      <div>
        <div class="flex flex-col">
          <div class="flex items-center">
            <img :src="warning" alt="warning" class=" scale-65">
            <span class="head-title" style="font-size: 20px;">Payment Support</span>
          </div>
          <span class="head-title labels" style="font-size: 20px;">Welcome to self-help center. Kindly provide your
            payment invoice, hit the Enter key to click the Check
            payment and wait. </span>
        </div>
      </div>
    </div>

    <!-- Section 2 -->
    <div class="flex flex-col gap-2">
      <span>Payment Invoice</span>
      <div class="flex-1 w-full flex gap-4">
        <InputText :placeholder="'Payment Invoice Number'" class="flex-1"/>
        <ReUsableButtons :label="'Make Payment'" class="w-1/3" />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">

import ReUsableButtons from '@/views/buttons/ReUsableButtons.vue';
import warning from '../../../assets/images/student/accomodation/warning.png'

</script>
