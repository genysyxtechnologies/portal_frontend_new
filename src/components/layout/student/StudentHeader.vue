<template>
  <header class="student-header" :class="{ 'dark-mode': isDarkMode }">
    <div class="header-left">
      <button class="menu-toggle" @click="$emit('toggle-sidebar')">
        <i class="pi pi-bars"></i>
      </button>
      <h1 class="header-title">Student Portal</h1>
    </div>
    
    <div class="header-right">
      <div class="theme-toggle-container">
        <i class="pi pi-sun light-icon"></i>
        <label class="theme-switch">
          <input type="checkbox" v-model="isDarkMode" @change="toggleTheme">
          <span class="slider round"></span>
        </label>
        <i class="pi pi-moon dark-icon"></i>
      </div>
      
      <button class="user-menu-button">
        <span class="user-name">{{ userName }}</span>
        <Ava-tar 
          :image="userAvatar" 
          shape="circle" 
          size="normal" 
          :pt="{ 
            image: { class: 'border-2 border-white' } 
          }" 
        />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/shared/auth'

defineEmits(['toggle-sidebar'])

const authStore = useAuthStore()
const userName = ref(authStore.user?.name || 'Student')
const userAvatar = ref(authStore.user?.avatar || '')

// Theme toggle functionality
const isDarkMode = ref(false)

// Initialize theme based on user preference if available
onMounted(() => {
  const savedTheme = localStorage.getItem('theme-mode')
  if (savedTheme === 'dark') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark-theme')
  }
})

const toggleTheme = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark-theme')
    localStorage.setItem('theme-mode', 'dark')
  } else {
    document.documentElement.classList.remove('dark-theme')
    localStorage.setItem('theme-mode', 'light')
  }
}

// Watch for theme changes
watch(isDarkMode, toggleTheme)
</script>

<style scoped>
.student-header {
  height: 60px;
  background-color: white;
  border-bottom: 1px solid var(--surface-d);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  position: fixed;
  top: 0;
  right: 0;
  left: 250px;
  z-index: 100;
  transition: all 0.3s ease;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--primary-color);
  margin: 0;
}

.menu-toggle {
  background: none;
  border: none;
  color: var(--primary-color);
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
  gap: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color);
}

/* Theme Toggle Switch Styles */
.theme-toggle-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.light-icon, .dark-icon {
  font-size: 1rem;
  color: var(--text-color);
}

.light-icon {
  color: #f59e0b;
}

.dark-icon {
  color: #6366f1;
}

.theme-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.theme-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e2e8f0;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

input:checked + .slider {
  background-color: var(--primary-color);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--primary-color);
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

/* Dark Mode Styles */
.dark-mode {
  background-color: #1e293b;
  border-bottom-color: #334155;
}

.dark-mode .header-title {
  color: white;
}

.dark-mode .menu-toggle,
.dark-mode .user-name {
  color: white;
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