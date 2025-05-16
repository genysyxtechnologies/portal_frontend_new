<template>
  <div class="primary-bg flex items-center justify-between rounded-2xl p-6">
    <div class="flex flex-col gap-4">
      <span class="header-text">Hey Haruna, we couldnt find history of selected items</span>
      <ReUsableButtons
        @click="$emit('downloadInvoice')"
        :label="'Generate Invoice'"
        style="background-color: #90caf9; color: #0d47a1"
      />
    </div>
    <div>
      <img :src="image1" alt="" class="aspect-8/3 object-contain" />
    </div>
  </div>
</template>

<script setup lang="ts">
import image1 from '../../../assets/images/student/fee/image1.png'
import ReUsableButtons from '@/views/buttons/ReUsableButtons.vue'
</script>

<style scoped>
.header-text {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;

  color: #ffffff;
}
</style>
