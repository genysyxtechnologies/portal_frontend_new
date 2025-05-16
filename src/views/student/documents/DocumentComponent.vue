<template>
  <ul
    class="w-full bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-sm transition-all duration-500 hover:shadow-xl hover:scale-[1.01] border border-gray-100/20">
    <transition-group name="document-list" tag="div" class="space-y-2">
      <li v-for="(item, index) in items" :key="index"
        class="group flex items-center justify-between py-4 px-6 rounded-lg transition-all duration-500 ease-out bg-white/50 backdrop-blur-sm"
        :class="{
          'border-b border-gray-100/50': index !== items.length - 1,
          'hover:bg-gray-50/90 hover:scale-[1.02] hover:shadow-md': true,
        }" :style="{
          transitionDelay: `${index * 50}ms`,
          transform: 'translateZ(0)'
        }">
        <div class="flex items-center gap-4 relative overflow-hidden">
          <div class="relative group-hover:animate-pulse">
            <div
              class="absolute inset-0 bg-primary-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500">
            </div>
            <img :src="item.icon" alt="icon"
              class="w-10 h-10 object-contain transition-all duration-500 relative z-10 group-hover:scale-110 group-hover:rotate-3" />
          </div>
          <div class="flex flex-col">
            <span
              class="text-gray-700 font-medium group-hover:text-primary-600 transition-colors duration-300 relative">
              {{ item.label }}
              <div
                class="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left">
              </div>
            </span>
          </div>
        </div>

        <button @click="$emit(item.emit)"
          class="p-3 rounded-full transition-all duration-300 hover:bg-primary-100 active:scale-95 relative overflow-hidden group/btn">
          <img :src="item.downloadIcon" alt="download"
            class="w-6 h-6 transition-all duration-500 group-hover/btn:scale-110 group-hover/btn:rotate-6" />
          <span
            class="absolute inset-0 bg-primary-500 opacity-0 rounded-full transition-all duration-300 download-ripple"></span>
          <span
            class="absolute inset-0 bg-primary-200/50 scale-0 rounded-full group-hover/btn:scale-100 transition-transform duration-500"></span>
        </button>
      </li>
    </transition-group>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import image1 from '../../../assets/images/student/documents/image1.png'
import image2 from '../../../assets/images/student/documents/image2.png'


const items = ref([
  {
    label: 'Admission Letter',
    icon: image1,
    downloadIcon: image2,
    emit: 'download-admission-letter',
  },
  {
    label: 'Application Summary',
    icon: image1,
    downloadIcon: image2,
    emit: 'download-application-summary',
  },
])
</script>

<style scoped>
/* List item animations */
.document-list-move,
.document-list-enter-active,
.document-list-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.document-list-enter-from,
.document-list-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

.document-list-leave-active {
  position: absolute;
}

/* Ripple effect */
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.5;
  }

  100% {
    transform: scale(4);
    opacity: 0;
  }
}

.download-btn:hover .download-ripple {
  animation: ripple 800ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Shimmer effect */
@keyframes shimmer {
  0% {
    background-position: -200% center;
  }

  100% {
    background-position: 200% center;
  }
}

li {
  position: relative;
  isolation: isolate;
}

li::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent);
  background-size: 200% 100%;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s;
}

li:hover::before {
  opacity: 1;
  animation: shimmer 2s infinite;
}

/* Custom scrollbar */
ul {
  scrollbar-width: thin;
  scrollbar-color: rgba(79, 70, 229, 0.2) transparent;
}

ul::-webkit-scrollbar {
  width: 6px;
}

ul::-webkit-scrollbar-track {
  background: transparent;
}

ul::-webkit-scrollbar-thumb {
  background-color: rgba(79, 70, 229, 0.2);
  border-radius: 20px;
  transition: background-color 0.3s;
}

ul::-webkit-scrollbar-thumb:hover {
  background-color: rgba(79, 70, 229, 0.4);
}
</style>
