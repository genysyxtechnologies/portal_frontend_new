<template>
  <div class="unauthorized-container">
    <h1>Unauthorized Access</h1>
    <p>You don't have permission to access this resource.</p>
    <router-link to="/" class="home-link">Return to Home</router-link>
  </div>
</template>

<script setup lang="ts">
// Component logic can be added here if needed
</script>

<style scoped>
.unauthorized-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 2rem;
}

h1 {
  color: var(--mantine-color-red-6);
  margin-bottom: 1rem;
}

p {
  margin-bottom: 2rem;
  color: var(--mantine-color-gray-7);
}

.home-link {
  color: var(--mantine-color-blue-6);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border: 1px solid var(--mantine-color-blue-6);
  border-radius: 4px;
  transition: all 0.2s ease;
}

.home-link:hover {
  background-color: var(--mantine-color-blue-6);
  color: white;
}
</style>
