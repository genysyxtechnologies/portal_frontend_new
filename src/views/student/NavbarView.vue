<template>
  <div class="navbar rounded-2xl shadow-lg bg-white  flex items-center justify-between">
    <button class="sidebar-toggle">
      <i class="pi pi-arrow-left"></i>
    </button>
    <div>{{ currentDate }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';


const currentDate = computed(() => {
  const date = new Date();
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
});
</script>

<style scoped>
.navbar {
  padding: 1rem;
  margin-left: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sidebar-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #0D47A1;
}
</style>
