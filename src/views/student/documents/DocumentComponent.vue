<template>
  <ul class="w-full bg-white p-8 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
    <transition-group name="document-list" tag="div">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="flex items-center justify-between py-4 px-6 rounded-lg transition-all duration-300 ease-out"
        :class="{
          'border-b border-gray-100': index !== items.length - 1,
          'hover:bg-gray-50 hover:scale-[1.01]': true
        }"
        :style="{ transitionDelay: `${index * 50}ms` }"
      >
        <div class="flex items-center gap-4">
          <div class="relative">
            <img
              :src="item.icon"
              alt="icon"
              class="w-10 h-10 object-contain transition-all duration-300 group-hover:scale-110"
            >
            <div class="absolute inset-0 bg-primary-500 opacity-0 rounded-full scale-50 transition-all duration-300 group-hover:opacity-10 group-hover:scale-100"></div>
          </div>
          <span class="text-gray-700 font-medium group-hover:text-primary-600 transition-colors duration-300">
            {{ item.label }}
          </span>
        </div>

        <button
          class="p-2 rounded-full transition-all duration-300 hover:bg-primary-100 hover:shadow-sm relative overflow-hidden download-btn cursor-pointer"

        >
          <img
            :src="item.downloadIcon"
            alt="download"
            class="w-6 h-6 transition-transform duration-300 hover:scale-110"
          >
          <span class="absolute inset-0 bg-primary-500 opacity-0 rounded-full transition-all duration-300 download-ripple"></span>
        </button>
      </li>
    </transition-group>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import image1 from '../../../assets/images/student/documents/image1.png';
import image2 from '../../../assets/images/student/documents/image2.png';



const items = ref([
  {
    label: "Admission Letter",
    icon: image1,
    downloadIcon: image2,
  },
  {
    label: "Screening Fee Invoice",
    icon: image1,
    downloadIcon: image2,
  },
  {
    label: "Screening Fee Receipt",
    icon: image1,
    downloadIcon: image2,
  },
  {
    label: "Third Semester Registration Guideline",
    icon: image1,
    downloadIcon: image2,
  },
]);


</script>

<style scoped>
/* List item animations */
.document-list-move,
.document-list-enter-active,
.document-list-leave-active {
  transition: all 0.5s ease;
}

.document-list-enter-from,
.document-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.document-list-leave-active {
  position: absolute;
}

/* Ripple effect */
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.download-btn:hover .download-ripple {
  animation: ripple 600ms linear;
}

/* Hover effects */
li {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Custom scrollbar for the list */
ul {
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
}

ul::-webkit-scrollbar {
  width: 6px;
}

ul::-webkit-scrollbar-track {
  background: transparent;
}

ul::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 20px;
}

/* Glow effect on hover */
li:hover {
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
}
</style>
