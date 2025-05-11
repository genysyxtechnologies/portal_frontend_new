<template>
  <div>

  </div>
</template>

<script setup lang="ts">
defineEmits(['toggle-sidebar']);
</script>

<style scoped>
.student-header {
  height: 60px;
  background-color: white;
  border-bottom: 1px solid var(--mantine-color-gray-3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  position: fixed;
  top: 0;
  right: 0;
  left: 250px;
  z-index: 100;
}

.menu-toggle {
  background: none;
  border: none;
  color: var(--mantine-color-gray-7);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-menu-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--mantine-color-gray-7);
  cursor: pointer;
  padding: 0.5rem;
}

.user-name {
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .student-header {
    left: 0;
  }

  .user-name {
    display: none;
  }
}
</style>
