<template>
  <div class="admin-layout">
    <AdminSidebar :collapsed="sidebarCollapsed" />
    <div class="p-main" :class="{ 'p-main-expanded': sidebarCollapsed }">
      <AdminHeader @toggle-sidebar="toggleSidebar" />
      <main class="p-content">
        <div class="p-container">
          <slot />
        </div>
      </main>
      <AdminFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AdminSidebar from './AdminSidebar.vue';
import AdminHeader from './AdminHeader.vue';
import AdminFooter from './AdminFooter.vue';

const sidebarCollapsed = ref(false);

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};
</script>

<style scoped>
.admin-layout {
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