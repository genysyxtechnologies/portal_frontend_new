<template>
  <header class="navbar" :class="{ 'dark-mode': isDarkMode }">
    <button @click="toggleSidebar" class="sidebar-toggle">
      <i :class="sidebarCollapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'" class="toggle-icon"></i>
    </button>
    <div class="current-date">{{ currentDate }}</div>
    <router-link to="/" class="logout-btn">
      <tooltip title="Logout">
        <i class="pi pi-arrow-right-arrow-left"></i>
      </tooltip>
    </router-link>
<!--    <ThemeToggle />-->
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
// import ThemeToggle from '@/components/shared/ThemeToggle.vue'
import { useThemeStore } from '@/stores/shared/theme'

defineProps({
  sidebarCollapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-sidebar'])

const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)

const toggleSidebar = () => {
  emit('toggle-sidebar')
}

const currentDate = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
})
</script>
<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.5rem;
  margin: 1rem 0.5rem 0.5rem 38px;
  transition: all 0.3s ease;
}

.dark-mode {
  background: #1e293b;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.dark-mode .current-date {
  color: #e2e8f0;
}

.dark-mode .sidebar-toggle {
  background: #374151;
  border-color: #4b5563;
}

.dark-mode .sidebar-toggle:hover {
  background: #4b5563;
}

.dark-mode .toggle-icon {
  color: #9ca3af;
}

.dark-mode .sidebar-toggle:hover .toggle-icon {
  color: #60a5fa;
}

.dark-mode .logout-btn {
  color: #60a5fa;
}

.sidebar-toggle {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  padding: 0.75rem;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.sidebar-toggle:hover {
  background-color: #f8fafc;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.toggle-icon {
  font-size: 1rem;
  color: #6b7280;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.sidebar-toggle:hover .toggle-icon {
  color: #0d47a1;
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #0d47a1;
  padding: 0.5rem;
  transition: color 0.3s ease;
  text-decoration: none;
}

.current-date {
  font-weight: 500;
  color: #333;
  transition: color 0.3s ease;
}

@media (max-width: 768px) {
  .navbar {
    margin: 0;
    border-radius: 0;
  }
}
</style>
