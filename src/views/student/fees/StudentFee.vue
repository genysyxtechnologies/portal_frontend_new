<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="head-title">Fees</h1>
      <div class="flex items-center gap-4">
        <ReUsableSelect />
        <ReUsableSelect />
      </div>
    </div>
    <!-- page content -->
    <StudentFeeContent />


  </div>
</template>

<script setup lang="ts">

import ReUsableSelect from '@/views/select/ReUsableSelect.vue';
import StudentFeeContent from './StudentFeeContent.vue';



</script>


<style scoped></style>
