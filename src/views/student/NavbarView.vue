<template>
  <header class="navbar" :class="{ 'dark-mode': isDarkMode }">
    <button @click="toggleSidebar" class="sidebar-toggle">
      <i :class="sidebarCollapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'" class="toggle-icon"></i>
    </button>
    <div class="current-date">{{ currentDate }}</div>

    <div class="flex justify-end flex-nowrap">
      <!-- Online/Offline Status -->
      <div class="status-container" style="margin-right: 10px;">
        <div class="status-indicator-wrapper">
        <span
          class="status-indicator"
          :class="{ 'status-online': isOnline, 'status-offline': !isOnline }"
        ></span>
          <span class="status-text" :class="{ 'text-online': isOnline, 'text-offline': !isOnline }">
          {{ isOnline ? 'Online' : 'Offline' }}
        </span>
        </div>
      </div>

      <router-link to="/" class="logout-btn">
        <div class="logout-container">
          <div class="logout-icon-wrapper">
            <div class="logout-glow"></div>
            <div class="logout-ring"></div>
            <svg class="logout-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 17L15 12L10 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15 12H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="logout-pulse"></div>
          </div>
          <span class="logout-text">Logout</span>
        </div>
      </router-link>
    </div>

<!--    <ThemeToggle />-->
  </header>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
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

// Internet connectivity detection
const isOnline = ref(navigator.onLine)

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

// Handle connectivity change
const handleOnlineStatusChange = () => {
  isOnline.value = navigator.onLine
}

onMounted(() => {
  // Add connectivity listeners
  window.addEventListener('online', handleOnlineStatusChange)
  window.addEventListener('offline', handleOnlineStatusChange)
})

// Cleanup event listener on unmount
onUnmounted(() => {
  window.removeEventListener('online', handleOnlineStatusChange)
  window.removeEventListener('offline', handleOnlineStatusChange)
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

.dark-mode .logout-container {
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.05), rgba(96, 165, 250, 0.02));
  border-color: rgba(96, 165, 250, 0.1);
}

.dark-mode .logout-container:hover {
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(96, 165, 250, 0.05));
  border-color: rgba(96, 165, 250, 0.2);
  box-shadow: 0 8px 24px rgba(96, 165, 250, 0.15);
}

.dark-mode .logout-icon,
.dark-mode .logout-text {
  color: #60a5fa;
}

.dark-mode .logout-container:hover .logout-icon,
.dark-mode .logout-container:hover .logout-text {
  color: #93bbfc;
}

.dark-mode .logout-glow {
  background: radial-gradient(circle, rgba(96, 165, 250, 0.3), transparent);
}

.dark-mode .logout-ring {
  border-color: rgba(96, 165, 250, 0.2);
}

.dark-mode .logout-container:hover .logout-ring {
  border-color: rgba(96, 165, 250, 0.4);
}

.dark-mode .logout-pulse {
  background: #60a5fa;
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
  text-decoration: none;
  display: inline-block;
}

.logout-container {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(13, 71, 161, 0.05), rgba(13, 71, 161, 0.02));
  border: 1px solid rgba(13, 71, 161, 0.1);
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.logout-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(13, 71, 161, 0.1), transparent);
  transition: left 0.5s ease;
}

.logout-container:hover::before {
  left: 100%;
}

.logout-container:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, rgba(13, 71, 161, 0.1), rgba(13, 71, 161, 0.05));
  border-color: rgba(13, 71, 161, 0.2);
  box-shadow: 0 8px 24px rgba(13, 71, 161, 0.15);
}

.logout-icon-wrapper {
  position: relative;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(13, 71, 161, 0.3), transparent);
  filter: blur(6px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.logout-container:hover .logout-glow {
  opacity: 1;
  animation: glowPulse 2s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.logout-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(13, 71, 161, 0.2);
  opacity: 0;
  transition: all 0.3s ease;
}

.logout-container:hover .logout-ring {
  opacity: 1;
  transform: scale(1.2);
  border-color: rgba(13, 71, 161, 0.4);
}

.logout-icon {
  width: 18px;
  height: 18px;
  color: #0d47a1;
  z-index: 1;
  transition: all 0.3s ease;
}

.logout-container:hover .logout-icon {
  color: #1565c0;
  transform: translateX(2px);
}

.logout-pulse {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #0d47a1;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  z-index: 0;
}

.logout-container:hover .logout-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(3);
  }
}

.logout-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #0d47a1;
  letter-spacing: 0.02em;
  transition: all 0.3s ease;
}

.logout-container:hover .logout-text {
  color: #1565c0;
  letter-spacing: 0.04em;
}

.current-date {
  font-weight: 500;
  color: #333;
  transition: color 0.3s ease;
}

/* Status Container */
.status-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-indicator-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.status-indicator-wrapper:hover {
  background: rgba(0, 0, 0, 0.04);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
}

.status-indicator::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.status-online {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.4);
}

.status-online::before {
  background: rgba(34, 197, 94, 0.4);
}

.status-offline {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
}

.status-offline::before {
  background: rgba(239, 68, 68, 0.4);
}

.status-text {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.text-online {
  color: #22c55e;
}

.text-offline {
  color: #ef4444;
}

@keyframes ping-slow {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.8);
    opacity: 0;
  }
}

/* Dark mode styles for status */
.dark-mode .status-indicator-wrapper {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .status-indicator-wrapper:hover {
  background: rgba(255, 255, 255, 0.08);
}

@media (max-width: 768px) {
  .navbar {
    margin: 0;
    border-radius: 0;
  }
}
</style>
