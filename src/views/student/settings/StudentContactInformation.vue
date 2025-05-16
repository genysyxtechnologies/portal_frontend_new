<template>
  <div class="bg-[#fff] flex flex-col gap-6 w-full p-8 rounded-xl">
    <div class="flex items-center justify-between">
      <h1 class="head-title" style="font-size: 25px">Contact Information</h1>
      <span class="font-bold text-xl text-[#0D47A1]">Edit</span>
    </div>

    <!-- Input Section -->

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <span class="labels">Phone Number</span>
        <InputText :placeholder="'09068842993'" style="border: 1px solid #90caf9" />
      </div>
      <div class="flex flex-col gap-2">
        <span class="labels">Email</span>
        <InputText :placeholder="'najumuddeenwakil@gmail.com'" style="border: 1px solid #90caf9" />
      </div>
    </div>
    <ReUsableButtons :label="'Save Changes'" class="w-1/2 float-end self-end" />
  </div>
</template>

<script setup lang="ts">
import ReUsableButtons from '@/views/buttons/ReUsableButtons.vue'
</script>
