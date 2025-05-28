<template>
  <div class="dashboard-layout">
    <!-- fixedss Sidebar -->
    <SidebarView :username="user?.name" :userID="user?.username" />

    <!-- main Content Area -->
    <div class="main-content">
      <NavbarView />
      <div class="page-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">


import { onMounted } from 'vue'
import NavbarView from './NavbarView.vue'
import SidebarView from './SidebarView.vue'
import { useStudentDashboard } from '@/services/student/useStudentDashboard'
const { user, getStudentInformation } = useStudentDashboard()

onMounted(async () => {
  await getStudentInformation()
  console.log(user.value)
})
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.sidebar {
  position: fixed;
  left: 4;
  top: 4;
  bottom: 0;
  width: 280px;
  z-index: 100;
}

.main-content {
  flex: 1;
  margin-left: 270px;

  /* sidebar width */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.navbar {
  /* Modified navbar styles */
  position: sticky;
  top: 0;
  z-index: 50;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-content {
  margin-top: 1rem;
  flex: 1;
  padding: 0.8rem;
  margin-left: 35px;
}

/* responsive adjustments */
@media (max-width: 768px) {
  .sidebar {
    width: 240px;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
  }
}
</style>
