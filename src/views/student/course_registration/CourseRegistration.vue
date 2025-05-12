<template>
  <div class="flex flex-col gap-6">
    <div class="bg-[#fff] flex justify-between gap-4 p-12 rounded-xl">
      <ReUsableSelect class="flex-1" />
      <ReUsableSelect class="flex-1" />
      <div class="flex-1 relative">
        <InputText class="flex-1 w-full flex h-full" :placeholder="'Search Course'" />
        <span class="absolute top-4 right-4">
          <i class=" pi pi-search"></i>
        </span>
      </div>
    </div>

    <!--data section-->
    <div class="bg-[#fff] w-full h-[calc(100vh-180px)] rounded-xl flex items-center justify-center">
      <h1 class="text-center labels" style="font-size: 20px;">No course(s) registred</h1>
    </div>


  </div>
</template>


<script setup lang="ts">
import ReUsableSelect from '@/views/select/ReUsableSelect.vue';

</script>
