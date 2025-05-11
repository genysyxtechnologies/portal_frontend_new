<template>
  <footer class="p-footer">
    <div class="p-footer-content">
      <div class="p-footer-left">
        <p class="p-copyright">&copy; {{ currentYear }} {{ schoolName }}. All rights reserved.</p>
      </div>
      <div class="p-footer-right">
        <p class="p-version">Version 1.0.0</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
const schoolName = computed(() => {
  const school = import.meta.env.VITE_SCHOOL || 'default';
  
  const schools = {
    fpn: 'Federal Polytechnic Nasarawa',
    lafia: 'Federal University of Lafia',
    default: 'School Portal'
  };
  
  return schools[school as keyof typeof schools] || schools.default;
});
</script>

<style scoped>
.p-footer {
  background-color: var(--surface-a);
  border-top: 1px solid var(--surface-d);
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary-color);
}

.p-footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.p-copyright, .p-version {
  margin: 0;
}

@media (max-width: 768px) {
  .p-footer-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>