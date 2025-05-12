<template>
  <div class="bg-[#fff] flex flex-col gap-6 w-full p-8 rounded-xl">
    <div class="flex items-center justify-between">
      <h1 class="head-title" style="font-size: 25px;">Password</h1>
      <span class="font-bold text-xl text-[#0D47A1]">Edit</span>
    </div>

    <!-- Input Section -->

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <span class="labels">Old Password</span>
        <InputText :placeholder="'09068842993'" style="border: 1px solid #90CAF9;" />
      </div>
      <div class="flex flex-col gap-2">
        <span class="labels">New Password</span>
        <InputText :placeholder="'najumuddeenwakil@gmail.com'" style="border: 1px solid #90CAF9;" />
      </div>
      <div class="flex flex-col gap-2">
        <span class="labels">Confirm Password</span>
        <InputText :placeholder="'najumuddeenwakil@gmail.com'" style="border: 1px solid #90CAF9;" />
      </div>
    </div>
    <div class="flex items-center justify-between w-full">
      <span class="text-[#0D47A1] font-semibold" style="font-weight: 700;">Forget password?</span>
      <ReUsableButtons :label="'Save Changes'" class="w-1/3" />
    </div>

  </div>
</template>

<script setup lang="ts">
import ReUsableButtons from '@/views/buttons/ReUsableButtons.vue';



</script>
