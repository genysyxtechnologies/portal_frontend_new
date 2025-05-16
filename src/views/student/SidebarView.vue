<template>
  <Drawer v-model:visible="drawerVisible">
    <div
      class="sidebar bg-white h-[calc(100vh-32px)] fixed top-4 bottom-4 left-4 p-6 rounded-xl shadow-lg w-[280px] overflow-hidden transition-all duration-300">
      <!-- Profile Section -->
      <div class="profile-section animate-fade-in">
        <div class="flex flex-col items-center text-center mb-6">
          <div class="relative mb-4 group profile-image-container">
            <div class="profile-image-glow"></div>
            <img :src="profile" alt="Profile"
              class="w-24 h-24 rounded-full object-cover border-4 border-[#0D47A1]/10 group-hover:border-[#0D47A1]/30 transition-all duration-300 ease-out z-10 relative" />
            <span
              class="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse z-20"></span>
          </div>
          <h1
            class="font-bold text-xl text-gray-800 mb-1 transition-colors duration-200 hover:text-[#0D47A1] cursor-default">
            {{ username }}
          </h1>
          <h3 class="text-gray-500 text-sm mb-2 transition-colors duration-200 hover:text-[#0D47A1]/70 cursor-default">
            {{ userID }}
          </h3>
          <h4 class="text-gray-400 text-xs flex items-center justify-center transition-colors duration-200 date-badge">
            <span>{{ currentDate }}</span>
          </h4>
        </div>
      </div>

      <Divider class="my-4 opacity-30 transition-all duration-500" style="height: 2px; background-color: #0d47a1" />

      <!-- Navigation Menu -->
      <ul class="menu-list space-y-1 overflow-y-auto max-h-[60vh] flex flex-col gap-2 pr-2">
        <li v-for="(item, index) in items" :key="index" class="animate-slide-in menu-item-container"
          :style="`--delay: ${index * 0.05}s`">
          <span @click="handleRoute(item.path)">
            <div
              class="menu-item flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer hover:bg-gradient-to-r hover:from-[#0D47A1]/5 hover:to-[#0D47A1]/15 hover:text-[#0D47A1] hover:shadow-md active:scale-[0.98]">
              <div class="menu-icon-wrapper">
                <img :src="item.icon" class="menu-icon w-5 h-5 transition-all duration-300" />
              </div>
              <span class="font-medium text-sm transition-all duration-200 menu-text">{{ item.title }}</span>
              <span class="flex-1"></span>
              <div class="menu-indicator"></div>
            </div>
          </span>
        </li>
      </ul>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import profile from '../../assets/images/student/profile.png'
import { useStudentSideBar } from '@/services/student/useSidebar'
import Divider from 'primevue/divider'
import { useRouter } from 'vue-router'

const $router = useRouter()

const handleRoute = (path: string) => {
  $router.push(path)
  console.log('THIS IS THE PATH: ', $router.currentRoute)
}

const props = defineProps({
  open: {
    default: true,
    type: Boolean,
  },
  username: {
    type: String,
  },
  userID: {
    type: String,
  },
})

const { items } = useStudentSideBar()

const currentDate = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
})

const drawerVisible = computed(() => {
  return props.open
})
</script>

<style scoped>
/* Animation Keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes glowPulse {
  0% {
    opacity: 0.4;
    transform: scale(0.95);
  }

  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }

  100% {
    opacity: 0.4;
    transform: scale(0.95);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

@keyframes ping-slow {

  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
}

/* Animation Classes */
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.animate-slide-in {
  animation: slideIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) var(--delay) forwards;
  opacity: 0;
}

.animate-ping-slow {
  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Profile Section Styles */
.profile-image-container {
  position: relative;
  display: inline-block;
  transition: all 0.5s ease;
}

.profile-image-container:hover {
  transform: scale(1.05);
}

.profile-image-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(13, 71, 161, 0.3) 0%, rgba(13, 71, 161, 0) 70%);
  filter: blur(10px);
  z-index: 1;
  animation: glowPulse 3s ease-in-out infinite;
}

.date-badge {
  background: linear-gradient(90deg, rgba(13, 71, 161, 0.1), rgba(13, 71, 161, 0.2), rgba(13, 71, 161, 0.1));
  background-size: 200% 100%;
  animation: shimmer 3s infinite linear;
  padding: 4px 8px;
  border-radius: 12px;
  margin-top: 4px;
  transition: all 0.3s ease;
}

.date-badge:hover {
  background-color: rgba(13, 71, 161, 0.15);
  transform: translateY(-2px);
}

/* Menu Item Hover Effects */
.menu-item {
  will-change: transform;
  position: relative;
  overflow: hidden;
  border-left: 3px solid transparent;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, rgba(13, 71, 161, 0.05) 0%, rgba(13, 71, 161, 0) 100%);
  transform: translateX(-100%);
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: -1;
}

.menu-item:hover {
  border-left: 3px solid #0d47a1;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(13, 71, 161, 0.1);
}

.menu-item:hover::before {
  transform: translateX(0);
}

.menu-icon-wrapper {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.3s ease;
  background-color: transparent;
}

.menu-item:hover .menu-icon-wrapper {
  background-color: rgba(13, 71, 161, 0.1);
  transform: rotate(5deg) scale(1.1);
}

.menu-text {
  position: relative;
  transition: all 0.3s ease;
}

.menu-text::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: #0d47a1;
  transition: width 0.3s ease;
}

.menu-item:hover .menu-text::after {
  width: 100%;
}

.menu-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: transparent;
  transition: all 0.3s ease;
  margin-right: 4px;
}

.menu-item:hover .menu-indicator {
  background-color: #0d47a1;
  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Scrollbar Styling */
.menu-list::-webkit-scrollbar {
  width: 4px;
  transition: width 0.3s ease;
}

.menu-list:hover::-webkit-scrollbar {
  width: 6px;
}

.menu-list::-webkit-scrollbar-track {
  background: rgba(13, 71, 161, 0.05);
  border-radius: 10px;
  box-shadow: inset 0 0 4px rgba(13, 71, 161, 0.05);
}

.menu-list::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgba(13, 71, 161, 0.2), rgba(13, 71, 161, 0.3));
  border-radius: 10px;
  transition: all 0.3s ease;
}

.menu-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgba(13, 71, 161, 0.3), rgba(13, 71, 161, 0.5));
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .sidebar {
    width: 240px;
    padding: 1.5rem;
    transform: translateX(-100%);
    z-index: 100;
  }

  .sidebar.active {
    transform: translateX(0);
  }
}

.sidebar * {
  transition-property: color, background-color, border-color, transform, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>
