<template>
  <div class="bg-white flex items-center justify-center h-[60vh] rounded-xl p-6 overflow-hidden shadow-md" v-motion="{
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    enter: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 500,
        type: 'spring',
        damping: 15,
      },
    },
    leave: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 250,
      },
    },
  }">
    <div class="flex flex-col gap-4 items-center text-center">
      <div class="relative">
        <!-- Animated document icon with modern design -->
        <div class="bg-[#E9F5FF] p-6 rounded-full relative overflow-hidden">
          <svg class="w-16 h-16 text-[#0D47A1] relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" v-motion="{
              initial: { opacity: 0, scale: 0.8 },
              enter: {
                opacity: 1,
                scale: 1,
                transition: { delay: 200, duration: 600, type: 'spring' },
              },
            }">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>

          <!-- Pulsing animation circle -->
          <div class="absolute inset-0 bg-[#90CAF9]/30 -z-0" v-motion="{
            initial: { scale: 0.8, opacity: 0.5 },
            enter: {
              scale: 1.2,
              opacity: 0.3,
              transition: {
                duration: 2000,
                repeat: Infinity,
                repeatType: 'reverse',
              },
            },
          }"></div>
        </div>
      </div>

      <h1 class="text-2xl font-semibold text-gray-700" v-motion="{
        initial: { opacity: 0, y: 10 },
        enter: {
          opacity: 1,
          y: 0,
          transition: { delay: 300, duration: 400 },
        },
      }">
        No Session Selected
      </h1>

      <p class="text-lg text-gray-500 max-w-md" v-motion="{
        initial: { opacity: 0, y: 10 },
        enter: {
          opacity: 1,
          y: 0,
          transition: { delay: 400, duration: 400 },
        },
      }">
        Please select an academic session to view your complete fee details
      </p>

      <!-- Animated arrow pointing to select -->
      <div class="mt-6 text-[#0D47A1] flex items-center gap-2 bg-[#E9F5FF] px-4 py-2 rounded-full shadow-sm" v-motion="{
        initial: { opacity: 0, x: -20 },
        enter: {
          opacity: 1,
          x: 0,
          transition: { delay: 500, duration: 500, type: 'spring' },
        },
      }">
        <span class="font-medium">Choose from the dropdown above</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 animate-bounce-vertical" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </div>
    </div>
  </div>

</template>


<style scoped>
/* Custom animations */
.animate-bounce-horizontal {
  animation: bounce-horizontal 1.5s infinite;
}

@keyframes bounce-horizontal {

  0%,
  100% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(5px);
  }
}

.animate-bounce-vertical {
  animation: bounce-vertical 1.5s infinite;
}

@keyframes bounce-vertical {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

/* Transition effects */
.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: all 0.3s ease;
}

.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Glass effect for certain components */
.glass-effect {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .head-title {
    font-size: 1.5rem;
  }
}

/* Box shadow utilities */
.hover-shadow-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}
</style>
