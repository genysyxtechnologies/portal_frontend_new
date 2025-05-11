<template>
  <div class="maintenance-container">
    <h1>System Maintenance</h1>
    <p>We're currently performing scheduled maintenance to improve our services.</p>
    <p class="maintenance-message">Please check back later. We apologize for any inconvenience.</p>
    <div class="maintenance-icon">
      <i class="pi pi-cog" style="font-size: 4rem; color: var(--mantine-color-blue-6);"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic can be added here if needed
</script>

<style scoped>
.maintenance-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 2rem;
}

h1 {
  color: var(--mantine-color-blue-6);
  margin-bottom: 1rem;
}

p {
  margin-bottom: 1rem;
  color: var(--mantine-color-gray-7);
  max-width: 600px;
}

.maintenance-message {
  font-size: 1.1rem;
  margin-top: 1rem;
}

.maintenance-icon {
  margin-top: 2rem;
  animation: spin 4s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 