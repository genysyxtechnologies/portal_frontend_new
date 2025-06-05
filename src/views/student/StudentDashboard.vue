<template>
  <div class="dashboard-layout">
    <!-- fixedss Sidebar -->
    <SidebarView
      :basic-details="user as unknown as Record<any,any>"
      :initial-collapsed="sidebarCollapsed"
      @toggle="handleSidebarToggle"
    />

    <!-- main Content Area -->
    <div class="main-content" :class="{ 'main-content-collapsed': sidebarCollapsed }">
      <NavbarView
        :sidebar-collapsed="sidebarCollapsed"
        @toggle-sidebar="handleSidebarToggle"
      />
      <div class="page-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">


import { onMounted, ref } from 'vue'
import NavbarView from './NavbarView.vue'
import SidebarView from './SidebarView.vue'
import { useStudentDashboard } from '@/services/student/useStudentDashboard'
import { COLLAPSE_BREAKPOINT } from '@/utils/constants.ts'

const { user, getStudentInformation } = useStudentDashboard()
const sidebarCollapsed = ref(false)

const handleSidebarToggle = (collapsed?: boolean) => {
  if(window.innerWidth >= COLLAPSE_BREAKPOINT){
    if (typeof collapsed === 'boolean') {
      sidebarCollapsed.value = collapsed
    } else {
      sidebarCollapsed.value = !sidebarCollapsed.value
    }
  } else {
    sidebarCollapsed.value = true
  }
}

onMounted(async () => {
  await getStudentInformation()
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
  margin-left: 300px; /* Account for sidebar + margin */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  transition: margin-left 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.main-content-collapsed {
  margin-left: 104px; /* Collapsed sidebar width + margin */
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
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

/* responsive adjustments */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 260px;
  }

  .main-content-collapsed {
    margin-left: 94px;
  }
}

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

  .main-content-collapsed {
    margin-left: 0;
  }
}
</style>
