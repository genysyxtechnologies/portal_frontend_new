<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="head-title">Self Service</h1>
      <div class="flex items-center gap-4">
        <ReUsableSelect class="flex-1" />
        <ReUsableSelect class="flex-1" />
      </div>
    </div>

    <!-- Section 2 -->
    <ServicePayment />
  </div>
</template>

<script setup lang="ts">
import ReUsableSelect from '@/views/select/ReUsableSelect.vue'
import ServicePayment from './ServicePayment.vue'
</script>
