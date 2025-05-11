<template>
  <div class="bg-[#fff] w-full p-[3rem] rounded-2xl shadow-lg h-full">
    <!-- image section with animation -->
    <div class="flex items-center justify-center animate-[float_4s_ease-in-out_infinite]">
      <div class="relative group">
        <img :src="profile" alt="profile"
          class="w-[8rem] h-[8rem] rounded-full object-cover border-4 border-[#90CAF9]/30 transition-all duration-500 group-hover:border-[#90CAF9]/60 mx-auto">
      </div>
    </div>

    <!-- information section with staggered animations -->
    <div class="flex flex-col gap-6">
      <!-- email field -->
      <div class="flex flex-col space-y-[0.5rem] animate-[fadeIn_0.5s_ease-out_0.1s_forwards] opacity-0">
        <small class="text-[#BFBFBF] font-medium">{{ firstLabel }}</small>
        <div class="relative">
          <i class="pi pi-envelope absolute right-[0.75rem] top-1/2 transform -translate-y-1/2 text-[#90CAF9]"></i>
          <InputText style="border: 1px solid #90CAF9;"
            class="w-full py-[0.75rem] px-[2.5rem]  rounded-lg transition-all duration-300 focus:border-[#0D47A1] focus:ring-2 focus:ring-[#90CAF9]/50 focus:outline-none"
            :placeholder="firstInput || 'your.email@example.com'" />
        </div>
      </div>

      <!-- matric number field -->
      <div class="flex flex-col space-y-[0.5rem] animate-[fadeIn_0.5s_ease-out_0.2s_forwards] opacity-0">
        <small class="text-[#BFBFBF] font-medium">{{ secondLabel }}</small>
        <div class="relative">
          <i class="pi pi-id-card absolute right-[0.75rem] top-1/2 transform -translate-y-1/2 text-[#90CAF9]"></i>
          <InputText style="border: 1px solid #90CAF9;"
            class="w-full  py-[0.75rem] px-[2.5rem] border border-[#90CAF9] rounded-lg transition-all duration-300 focus:border-[#0D47A1] focus:ring-2 focus:ring-[#90CAF9]/50 focus:outline-none"
            :placeholder="secondInput || '2025/AR/ARA/0002'" />
        </div>
      </div>

      <!-- level field -->
      <div class="flex flex-col space-y-[0.5rem] animate-[fadeIn_0.5s_ease-out_0.3s_forwards] opacity-0">
        <small class="text-[#BFBFBF] font-medium">{{ thirdLabel }}</small>
        <div class="relative">
          <i
            class="pi pi-sort-numeric-up absolute right-[0.75rem] top-1/2 transform -translate-y-1/2 text-[#90CAF9]"></i>
          <InputText style="border: 1px solid #90CAF9;"
            class="w-full py-[0.75rem] px-[2.5rem] border border-[#90CAF9] rounded-lg transition-all duration-300 focus:border-[#0D47A1] focus:ring-2 focus:ring-[#90CAF9]/50 focus:outline-none"
            :placeholder="thirdInput || '100 Level'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps({
  firstInput: String,
  secondInput: String,
  thirdInput: String,
  firstLabel: String,
  secondLabel: String,
  thirdLabel: String
})

import profile from '../../../assets/images/student/profile.png';
</script>

<style>
@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-0.5rem);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(0.625rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
