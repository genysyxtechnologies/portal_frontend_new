<template>
  <Drawer v-model:visible="drawerVisible">
    <div
      class="sidebar bg-white h-[calc(100vh-32px)] fixed top-4 bottom-4 left-4 p-6 rounded-xl shadow-lg w-[280px] overflow-hidden transition-all duration-300">
      <!-- Profile Section -->
      <div class="profile-section animate-fade-in">
        <div class="flex flex-col items-center text-center mb-6">
          <div class="relative mb-4 group">
            <img :src="profile" alt="Profile"
              class="w-24 h-24 rounded-full object-cover border-4 border-[#0D47A1]/10 group-hover:border-[#0D47A1]/30 transition-all duration-300 ease-out" />
            <span
              class="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
          </div>
          <h1 class="font-bold text-xl text-gray-800 mb-1 transition-colors duration-200">
            {{ username }}
          </h1>
          <h3 class="text-gray-500 text-sm mb-2 transition-colors duration-200">
            {{ userID }}
          </h3>
          <h4 class="text-gray-400 text-xs flex items-center justify-center transition-colors duration-200">
            <span>{{ currentDate }}</span>
          </h4>
        </div>
      </div>

      <Divider class="my-4 opacity-30 transition-all duration-500" style="height: 2px; background-color: #0d47a1" />

      <!-- Navigation Menu -->
      <ul class="menu-list space-y-1 overflow-y-auto max-h-[60vh] flex flex-col gap-2 pr-2">
        <li v-for="(item, index) in items" :key="index" class="animate-slide-in" :style="`--delay: ${index * 0.05}s`">
          <span @click="handleRoute(item.path)">
            <div
              class="menu-item flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer hover:bg-[#0D47A1]/10 hover:text-[#0D47A1] hover:shadow-xs active:scale-[0.98]">
              <img :src="item.icon" class="w-5 h-5 transition-all duration-300 group-hover:scale-110" />
              <span class="font-medium text-sm transition-all duration-200">{{ item.title }}</span>
              <span class="flex-1"></span>
              <!--    <span v-if="isActive" class="w-2 h-2 bg-[#0D47A1] rounded-full animate-ping-slow"></span> -->
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
  console.log("THIS IS THE PATH: ", $router.currentRoute)

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

/* Menu Item Hover Effects */
.menu-item {
  will-change: transform;
  position: relative;
  overflow: hidden;
}

.menu-item::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background-color: #0d47a1;
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.3s ease-out;
}

.menu-item:hover::after {
  transform: scaleY(1);
}

.menu-item:hover {
  transform: translateX(4px);
}

/* Scrollbar Styling */
.menu-list::-webkit-scrollbar {
  width: 4px;
}

.menu-list::-webkit-scrollbar-track {
  background: rgba(13, 71, 161, 0.05);
  border-radius: 10px;
}

.menu-list::-webkit-scrollbar-thumb {
  background: rgba(13, 71, 161, 0.2);
  border-radius: 10px;
}

.menu-list::-webkit-scrollbar-thumb:hover {
  background: rgba(13, 71, 161, 0.4);
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
