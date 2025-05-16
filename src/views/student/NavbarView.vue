<template>
  <header class="navbar" :class="{ 'dark-mode': isDarkMode }">
    <router-link to="/" class="sidebar-toggle sidebar-toggle">
      <tooltip title="Logout">
        <i class="pi pi-arrow-left"></i>
      </tooltip>
    </router-link>
    <div class="current-date">{{ currentDate }}</div>
<!--    <ThemeToggle />-->
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
// import ThemeToggle from '@/components/shared/ThemeToggle.vue'
import { useThemeStore } from '@/stores/shared/theme'

const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)

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
  color: #60a5fa;
}

.sidebar-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #0d47a1;
  padding: 0.5rem;
  transition: color 0.3s ease;
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
