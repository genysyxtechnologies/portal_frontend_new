<template>
  <div class="container mx-auto p-8 bg-white h-full rounded-xl shadow-md">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="NextOfKin" class="block text-sm font-medium text-gray-700 mb-1 labels">Next Of Kin Name</label>
        <InputText id="lgaCity" type="text" class="w-full" />
      </div>
      <div>
        <label for="NextOfKinPhoneNumber" class="block text-sm font-medium text-gray-700 mb-1 labels">Next Of Kin Phone
          Number</label>
        <InputText id="lgaCity" type="text" class="w-full" />
      </div>
      <div>
        <label for="NextOfKinAddress" class="block text-sm font-medium text-gray-700 mb-1 labels">Kext Of Kin
          Address</label>
        <InputText id="lgaCity" type="text" class="w-full" />
      </div>
      <div>
        <label for="Relationship" class="block text-sm font-medium text-gray-700 mb-1 labels">Relationship</label>
        <ReUsableSelect />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ReUsableSelect from '@/views/select/ReUsableSelect.vue';

</script>
