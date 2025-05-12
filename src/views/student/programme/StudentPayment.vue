<template>
  <div class="flex flex-col items-center justify-center gap-6">
    <div class="flex items-center justify-center">
      <img :src="image1" alt="logo" class="w-1/3 mx-auto">
    </div>
    <div class="flex items-center justify-center gap-2">
      <img :src="warning" alt="warning" class=" scale-65">
      <h3 class="head-title labels" style="font-size: 20px;">You are required to pay a sum of ₦10,000 to proceed</h3>
    </div>
    <div class="w-full flex items-center justify-center">
      <ReUsableButtons :label="'Make Payment'" class="w-1/2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import image1 from '../../../assets/images/student/programme/image1.png'
import warning from '../../../assets/images/student/accomodation/warning.png'
import ReUsableButtons from '@/views/buttons/ReUsableButtons.vue';

</script>
