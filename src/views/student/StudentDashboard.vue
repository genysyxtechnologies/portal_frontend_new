<template>
  <div class="dashboard-layout">
    <!-- fixedss Sidebar -->
    <SidebarView />

    <!-- main Content Area -->
    <div class="main-content">
      <NavbarView />
      <div class="page-content">
        <DashboardContent />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardContent from './dashboard/DashboardContent.vue';
import StudentFee from './fees/StudentFee.vue';
import StudentBioData from './biodata/StudentBioData.vue';
import StudentCourseRegistration from './course_registration/StudentCourseRegistration.vue';
import StudentResult from './result/StudentResult.vue';
import StudentAccomodation from './accomodation/StudentAccomodation.vue';
import StudentProgramme from './programme/StudentProgramme.vue';
import StudentDocuments from './documents/StudentDocuments.vue';
import StudentSelfService from './self_service/StudentSelfService.vue';
import StudentSettings from './settings/StudentSettings.vue';



/* The Navbar and Sidebar */
import NavbarView from './NavbarView.vue';
import SidebarView from './SidebarView.vue';
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
  width: 100%;
  z-index: 50;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-content {
  margin-top: 1rem;
  flex: 1;
  padding: 0.8rem;
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
