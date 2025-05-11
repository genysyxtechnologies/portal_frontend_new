<template>
  <div class="card flex justify-center">
    <Sel-ect :size="'large'" v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Select Session"
      class="w-full" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const selectedCity = ref();
const cities = ref([
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' }
]);
</script>
