<template>
  <div>
    <transition name="fade">
      <div v-if="loading"
        class="absolute inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center rounded-lg">
        <div class="loading-content text-center">
          <div class="spinner"></div>
          <p class="mt-4 text-lg font-medium text-gray-700">Loading your information...</p>
          <p class="text-sm text-gray-500">Please wait while we prepare your form</p>
        </div>
      </div>
    </transition>

    <!-- Skeleton loader -->
    <transition name="fade">
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="i in 12" :key="'skeleton-' + i" class="space-y-3">
          <div class="h-5 bg-gray-200 rounded w-1/3 shimmer"></div>
          <div class="h-12 bg-gray-100 rounded-md shimmer"></div>
        </div>
      </div>
    </transition>
  </div>
</template>


<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})

</script>
<style scoped>
.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Shimmer effect for skeleton loader */
.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.6),
      transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

/* Transition effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Loading content styling */
.loading-content {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
