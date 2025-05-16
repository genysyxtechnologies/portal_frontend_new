<template>
  <div class="theme-debug">
    <div class="theme-debug-toggle" @click="toggleDebugPanel">
      <i class="pi pi-cog"></i>
    </div>
    <div v-if="isOpen" class="theme-debug-panel">
      <h3>Theme Debug Panel</h3>

      <div class="debug-section">
        <h4>Theme Info</h4>
        <div class="info-row">
          <span>School Theme:</span>
          <span>{{ schoolTheme }}</span>
        </div>
        <div class="info-row">
          <span>Dark Mode:</span>
          <span>{{ isDarkMode ? 'Enabled' : 'Disabled' }}</span>
        </div>
      </div>

      <div class="debug-section">
        <h4>Theme Controls</h4>
        <Button
          label="Toggle Dark Mode"
          icon="pi pi-moon"
          class="p-button-sm"
          @click="toggleTheme"
        />
      </div>

      <div class="debug-section">
        <h4>CSS Variables</h4>
        <div v-for="(value, variable) in cssVariables" :key="variable" class="css-variable">
          <span class="variable-name">{{ variable }}:</span>
          <span class="variable-value">{{ value }}</span>
          <div class="color-preview" v-if="isColor(value)" :style="{ backgroundColor: value }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/shared/theme'

// State
const isOpen = ref(false)
const cssVariables = ref<Record<string, string>>({})
const schoolTheme = computed(() => import.meta.env.VITE_SCHOOL || 'default')

// Theme store
const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)
const { toggleTheme } = themeStore

// Methods
const toggleDebugPanel = () => {
  isOpen.value = !isOpen.value
}

const isColor = (value: string): boolean => {
  // Check if the value is a color (hex, rgb, hsl, etc.)
  return /^(#|rgb|hsl|rgba|hsla)/.test(value)
}

// Get CSS variables on mount
onMounted(() => {
  const root = getComputedStyle(document.documentElement)
  const variables: Record<string, string> = {}

  // Get all CSS variables
  for (let i = 0; i < root.length; i++) {
    const prop = root[i]
    if (prop.startsWith('--')) {
      variables[prop] = root.getPropertyValue(prop).trim()
    }
  }

  cssVariables.value = variables
})
</script>

<style scoped>
.theme-debug {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

.theme-debug-toggle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #2563eb;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.theme-debug-toggle:hover {
  transform: rotate(30deg);
}

.theme-debug-panel {
  position: absolute;
  bottom: 50px;
  right: 0;
  width: 300px;
  max-height: 500px;
  overflow-y: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;
}

:deep(.dark-mode) .theme-debug-panel {
  background-color: #1e293b;
  color: #e2e8f0;
}

h3 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 8px;
}

.debug-section {
  margin-bottom: 16px;
}

h4 {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 12px;
}

.css-variable {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  font-size: 11px;
}

.variable-name {
  font-family: monospace;
  color: #6366f1;
}

:deep(.dark-mode) .variable-name {
  color: #818cf8;
}

.variable-value {
  margin-left: 8px;
  color: #64748b;
}

:deep(.dark-mode) .variable-value {
  color: #94a3b8;
}

.color-preview {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-left: 8px;
  border: 1px solid #e2e8f0;
}
</style>
