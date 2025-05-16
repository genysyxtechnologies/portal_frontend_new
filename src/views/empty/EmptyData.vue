<template>
  <div class="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center justify-center h-64">
    <i class="pi pi-book text-4xl text-gray-300 mb-3"></i>
    <h2 class="text-xl font-medium text-gray-500">{{ emptyMessage }}</h2>
    <p class="text-gray-400 mt-1 text-sm">Try changing your filters</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  emptyMessage: {
    type: String,
    default: 'No available courses',
  },
})
</script>
