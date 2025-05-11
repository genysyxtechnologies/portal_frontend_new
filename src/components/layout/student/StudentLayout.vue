<template>
  <div class="student-layout">
    <!-- <StudentSidebar :collapsed="sidebarCollapsed" />
    <div class="p-main" :class="{ 'p-main-expanded': sidebarCollapsed }">
      <StudentHeader @toggle-sidebar="toggleSidebar" />
      <main class="p-content">
        <div class="p-container">
          <slot />
        </div>
      </main>
      <StudentFooter />
    </div> -->
  </div>
</template>

<script setup lang="ts">
// import { ref } from 'vue';
// import StudentSidebar from './StudentSidebar.vue';
// import StudentHeader from './StudentHeader.vue';
// import StudentFooter from './StudentFooter.vue';

// const sidebarCollapsed = ref(false)

// const toggleSidebar = () => {
//   sidebarCollapsed.value = !sidebarCollapsed.value
// }
</script>

<style scoped>
.student-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--surface-b);
}

.p-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  margin-left: 250px;
}

.p-main-expanded {
  margin-left: 65px;
}

.p-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.p-container {
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .p-main {
    margin-left: 0;
  }

  .p-main-expanded {
    margin-left: 0;
  }
}
</style>
