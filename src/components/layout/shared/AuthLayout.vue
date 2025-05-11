<template>
  <div class="auth-layout">
    <StudentDashboard />
  </div>
</template>

<script setup lang="ts">
import StudentDashboard from '@/views/student/StudentDashboard.vue';

</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #E9F5FF;
  padding: 2rem;
}

.auth-container {
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-logo {
  margin-bottom: 2rem;
  text-align: center;
}

.auth-logo {
  margin-bottom: 2rem;
  text-align: center;
}

.auth-card {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.auth-card :deep(.p-card-content) {
  padding: 1.5rem;
}

.auth-card :deep(.p-card-title) {
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
}

.auth-card :deep(.p-card-footer) {
  border-top: 1px solid var(--surface-d);
  padding-top: 1rem;
  text-align: center;
}

@media (max-width: 576px) {
  .auth-layout {
    padding: 1rem;
  }
}
</style>
