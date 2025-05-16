<template>
  <div class="theme-toggle">
    <transition name="slide" mode="out-in">
      <Button
        v-if="isDarkMode"
        class="toggle-button light-button"
        icon="pi pi-sun"
        @click="toggleTheme"
        text
        rounded
        aria-label="Switch to light mode"
      >
        <span class="theme-label">Light</span>
      </Button>
      <Button
        v-else
        class="toggle-button dark-button"
        icon="pi pi-moon"
        @click="toggleTheme"
        text
        rounded
        aria-label="Switch to dark mode"
      >
        <span class="theme-label">Dark</span>
      </Button>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/shared/theme'

const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)
const { toggleTheme } = themeStore
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
}

.toggle-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  transition: all 0.3s ease;
}

.light-button {
  color: #f59e0b;
}

.dark-button {
  color: #6366f1;
}

.theme-label {
  font-size: 0.875rem;
  font-weight: 500;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 768px) {
  .theme-label {
    display: none;
  }
  
  .toggle-button {
    padding: 0.5rem;
  }
}
</style>
