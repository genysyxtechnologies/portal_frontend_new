<template>
  <Drawer v-model:visible="drawerVisible">
    <div
      class="sidebar bg-white h-[calc(100vh-32px)] fixed top-4 bottom-4 left-4 p-6 rounded-xl shadow-xl w-[280px] overflow-hidden transition-all duration-500 border border-gray-100/50">
      <!-- Profile Section -->
      <div class="profile-section">
        <div class="flex flex-col items-center text-center mb-6">
          <div class="relative mb-4 group profile-image-container">
            <div class="profile-image-glow"></div>
            <div class="profile-image-ring"></div>
            <img :src="profile" alt="Profile"
              class="w-24 h-24 rounded-full object-cover border-4 border-[#0D47A1]/10 group-hover:border-[#0D47A1]/30 transition-all duration-300 ease-out z-10 relative" />
            <span
              class="status-indicator"></span>
          </div>
          <h1 class="username">
            {{ username }}
          </h1>
          <h3 class="user-id">
            {{ userID }}
          </h3>
          <h4 class="date-badge">
            <span>{{ currentDate }}</span>
          </h4>
        </div>
      </div>

      <div class="divider">
        <span class="divider-text">Menu</span>
      </div>

      <!-- Navigation Menu -->
      <ul class="menu-list">
        <li v-for="(item, index) in items" :key="index" class="menu-item-container"
          :style="`--delay: ${index * 0.05}s`">
          <span @click="item.hasChildren ? toggleDropdown(index) : handleRoute(item.path)">
            <div
              :class="['menu-item', $router.currentRoute.value.path === item.path ? 'active' : '']">
              <div class="menu-icon-wrapper">
                <img :src="item.icon" class="menu-icon" />
              </div>
              <span class="menu-text">{{ item.title }}</span>
              <span class="flex-1"></span>
              <div v-if="item.hasChildren" class="dropdown-icon" :class="{'dropdown-open': openDropdowns[index]}">
                <i :class="['pi', openDropdowns[index] ? 'pi-chevron-down' : 'pi-chevron-right']"></i>
              </div>
              <div class="menu-indicator"></div>
            </div>
          </span>
          <!-- Dropdown submenu -->
          <transition name="submenu-transition">
            <div v-if="item.hasChildren && openDropdowns[index]" class="submenu">
              <div v-for="(child, childIndex) in item.children" :key="childIndex"
                @click="handleRoute(child.path)"
                class="submenu-item"
                :class="{ 'submenu-active': $router.currentRoute.value.path === child.path }"
                :style="`--index: ${childIndex}`">
                <div class="submenu-dot"></div>
                <span class="submenu-text">{{ child.title }}</span>
              </div>
            </div>
          </transition>
        </li>
      </ul>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import profile from '../../assets/images/student/profile.png'
import { useStudentSideBar } from '@/services/student/useSidebar'
import { useRouter } from 'vue-router'

const $router = useRouter()

const handleRoute = (path: string) => {
  $router.push(path)
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

// Track which dropdowns are open
const openDropdowns = ref<Record<number, boolean>>({})

// Toggle dropdown state with enhanced animation control
const toggleDropdown = (index: number) => {
  // Close all other dropdowns when opening a new one
  if (!openDropdowns.value[index]) {
    Object.keys(openDropdowns.value).forEach(key => {
      if (Number(key) !== index) {
        openDropdowns.value[Number(key)] = false;
      }
    });
  }
  
  // Toggle the current dropdown
  openDropdowns.value[index] = !openDropdowns.value[index];
}

// Initialize animations when component mounts
onMounted(() => {
  // Add staggered animation to menu items
  const menuItems = document.querySelectorAll('.menu-item-container');
  menuItems.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('animate-slide-in-active');
    }, 100 + (index * 50));
  });
  
  // Add fade-in animation to profile section
  const profileSection = document.querySelector('.profile-section');
  if (profileSection) {
    setTimeout(() => {
      profileSection.classList.add('profile-fade-in');
    }, 100);
  }
})

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

@keyframes rotateIn {
  from {
    opacity: 0;
    transform: rotateY(-90deg);
  }
  to {
    opacity: 1;
    transform: rotateY(0);
  }
}

@keyframes pulseRing {
  0% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.5;
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

@keyframes dropdownExpand {
  from {
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    max-height: 500px;
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Animation Classes */
.animate-slide-in-active {
  animation: slideIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.profile-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

/* Sidebar Base Styles */
.sidebar {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1), 
              inset 0 -1px 0 rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.sidebar:hover {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15), 
              inset 0 -1px 0 rgba(255, 255, 255, 0.8);
}

/* Profile Section Styles */
.profile-section {
  opacity: 0;
  transform: translateY(-10px);
}

.profile-image-container {
  position: relative;
  display: inline-block;
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 1;
}

.profile-image-container:hover {
  transform: scale(1.05) rotate(3deg);
}

.profile-image-glow {
  position: absolute;
  width: 110%;
  height: 110%;
  top: -5%;
  left: -5%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(13, 71, 161, 0.3) 0%, rgba(13, 71, 161, 0) 70%);
  filter: blur(10px);
  z-index: 1;
  animation: glowPulse 3s ease-in-out infinite;
}

.profile-image-ring {
  position: absolute;
  width: 110%;
  height: 110%;
  top: -5%;
  left: -5%;
  border-radius: 50%;
  border: 2px solid rgba(13, 71, 161, 0.2);
  z-index: 5;
  animation: pulseRing 3s ease-in-out infinite;
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  border-radius: 50%;
  border: 2px solid white;
  z-index: 20;
  box-shadow: 0 0 0 rgba(34, 197, 94, 0.4);
  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.username {
  font-weight: 700;
  font-size: 1.25rem;
  color: #1f2937;
  margin-bottom: 0.25rem;
  transition: all 0.3s ease;
  cursor: default;
  position: relative;
  display: inline-block;
}

.username::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.username:hover {
  color: #0D47A1;
}

.username:hover::after {
  width: 80%;
}

.user-id {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  cursor: default;
}

.user-id:hover {
  color: #0D47A1;
  transform: translateY(-1px);
}

.date-badge {
  background: linear-gradient(90deg, rgba(13, 71, 161, 0.1), rgba(13, 71, 161, 0.2), rgba(13, 71, 161, 0.1));
  background-size: 200% 100%;
  animation: shimmer 3s infinite linear;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  margin-top: 0.5rem;
  transition: all 0.3s ease;
  color: #4b5563;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.date-badge:hover {
  background-color: rgba(13, 71, 161, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 71, 161, 0.1);
}

/* Divider styling */
.divider {
  position: relative;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(13, 71, 161, 0.2), transparent);
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.divider-text {
  position: absolute;
  background-color: white;
  padding: 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
}

/* Menu List Styles */
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  max-height: 60vh;
  padding-right: 0.5rem;
  margin-top: 0.5rem;
}

.menu-item-container {
  opacity: 0;
  transform: translateX(-20px);
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Menu Item Styles */
.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-left: 3px solid transparent;
  background-color: transparent;
  will-change: transform, box-shadow, background-color;
}

.menu-item:hover {
  background: linear-gradient(90deg, rgba(13, 71, 161, 0.05) 0%, rgba(13, 71, 161, 0.02) 100%);
  color: #0D47A1;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(13, 71, 161, 0.05);
  border-left: 3px solid #0D47A1;
}

.menu-item:active {
  transform: scale(0.98);
}

/* Dropdown Styles */
.submenu {
  padding-left: 2rem;
  margin-top: 0.25rem;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.submenu-transition-enter-active,
.submenu-transition-leave-active {
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  max-height: 500px;
  opacity: 1;
  transform: translateY(0);
}

.submenu-transition-enter-from,
.submenu-transition-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.submenu-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.25rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0;
  animation: fadeInSubmenu 0.4s ease forwards;
  animation-delay: calc(var(--index) * 0.05s);
}

.submenu-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #d1d5db;
  margin-right: 0.75rem;
  transition: all 0.3s ease;
}

.submenu-text {
  position: relative;
}

.submenu-text::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: #0D47A1;
  transition: width 0.3s ease;
}

.submenu-item:hover {
  background-color: rgba(13, 71, 161, 0.05);
  color: #0D47A1;
  transform: translateX(4px);
}

.submenu-item:hover .submenu-dot {
  background-color: #0D47A1;
  transform: scale(1.2);
}

.submenu-item:hover .submenu-text::after {
  width: 100%;
}

.submenu-active {
  background-color: rgba(13, 71, 161, 0.1);
  color: #0D47A1;
}

.submenu-active .submenu-dot {
  background-color: #0D47A1;
}

@keyframes fadeInSubmenu {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Menu Icon Styles */
.menu-icon-wrapper {
  position: relative;
  width: 28px;
  height: 28px;
  min-width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  background-color: transparent;
  overflow: hidden;
}

.menu-icon {
  width: 18px;
  height: 18px;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  filter: grayscale(0.3);
  opacity: 0.8;
}

.menu-item:hover .menu-icon-wrapper {
  background-color: rgba(13, 71, 161, 0.1);
  transform: rotate(5deg) scale(1.1);
}

.menu-item:hover .menu-icon {
  filter: grayscale(0);
  opacity: 1;
  transform: scale(1.1);
}

.menu-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  position: absolute;
  right: 10px;
  opacity: 0;
}

.menu-item:hover .menu-indicator {
  opacity: 1;
  background-color: #0d47a1;
  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Dropdown Icon */
.dropdown-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  margin-left: auto;
  width: 20px;
  height: 20px;
}

.dropdown-icon i {
  font-size: 0.7rem;
  color: #9ca3af;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.dropdown-open i {
  color: #0D47A1;
  transform: rotate(90deg);
}

.menu-item:hover .dropdown-icon i {
  color: #0D47A1;
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

/* Active Menu Item Styling */
.menu-item.active {
  border-left: 4px solid #0D47A1;
  background: linear-gradient(90deg, rgba(13,71,161,0.10) 0%, rgba(13,71,161,0.04) 100%);
  color: #0D47A1;
  transform: scale(1.02) translateX(2px);
  font-weight: 600;
  box-shadow: 0 0 0 2px rgba(13,71,161,0.08), 0 8px 24px rgba(13,71,161,0.10);
}

.menu-item.active .menu-icon-wrapper {
  background-color: rgba(13,71,161,0.10);
  transform: scale(1.12) rotate(-3deg);
}

.menu-item.active .menu-icon {
  filter: grayscale(0);
  opacity: 1;
}

.menu-item.active .menu-text {
  color: #0D47A1;
  font-weight: 600;
}

.menu-item.active .menu-indicator {
  opacity: 1;
  background-color: #0D47A1;
  box-shadow: 0 0 8px 2px rgba(13,71,161,0.15);
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
  
  .menu-icon-wrapper {
    width: 24px;
    height: 24px;
    min-width: 24px;
  }
  
  .menu-icon {
    width: 16px;
    height: 16px;
  }
}

/* Global transition properties */
.sidebar * {
  transition-property: color, background-color, border-color, transform, opacity, box-shadow;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  transition-duration: 300ms;
}

</style>
