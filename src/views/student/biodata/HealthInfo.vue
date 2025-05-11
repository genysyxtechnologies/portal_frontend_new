

<template>
  <div class="container mx-auto p-8 bg-white h-full rounded-xl shadow-md">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="Blood Group" class="block text-sm font-medium text-gray-700 mb-1 labels">Blood Group</label>
        <ReUsableSelect />
      </div>

      <div>
        <label for="Genotype" class="block text-sm font-medium text-gray-700 mb-1 labels">Genotype</label>
        <ReUsableSelect />
      </div>

      <div>
        <label for="Disability" class="block text-sm font-medium text-gray-700 mb-1 labels">Disability</label>
        <InputText id="lgaCity" type="text" class="w-full" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ReUsableSelect from '@/views/select/ReUsableSelect.vue';

</script>
