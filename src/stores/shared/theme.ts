import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // Check for saved theme preference or use system default
  const storedTheme = localStorage.getItem('theme')
  const isDarkMode = ref(storedTheme ? storedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches)

  // Function to toggle theme
  function toggleTheme() {
    isDarkMode.value = !isDarkMode.value
  }

  // Update localStorage and apply theme when isDarkMode changes
  watch(isDarkMode, (newValue) => {
    // Save preference to localStorage
    localStorage.setItem('theme', newValue ? 'dark' : 'light')
    
    // Apply theme to document
    if (newValue) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, { immediate: true })

  return {
    isDarkMode,
    toggleTheme
  }
})
