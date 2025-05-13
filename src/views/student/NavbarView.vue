<template>
  <header class="navbar">
    <button class="sidebar-toggle">
      <i class="pi pi-arrow-left"></i>
    </button>
    <div class="current-date">{{ currentDate }}</div>
  </header>
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
  position: sticky;
  top: 0;
  z-index: 50;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.5rem;
  margin: 0.5rem;
  margin-left: 38px;
}

.sidebar-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #0D47A1;
  padding: 0.5rem;
}

.current-date {
  font-weight: 500;
  color: #333;
}

@media (max-width: 768px) {
  .navbar {
    margin: 0;
    border-radius: 0;
  }
}
</style>
