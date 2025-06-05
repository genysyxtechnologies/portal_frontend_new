<template>
  <div class="tabs-container">
    <div class="tab-header">
      <div class="tab-list">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab-item"
          :class="{
            'tab-active': activeTab === index,
            'tab-inactive': activeTab !== index,
          }"
          :disabled="disabled"
          @click="handleTabClick(index)"
        >
          <span class="tab-icon" :class="tab.icon"></span>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: `${((activeTab + 1) / tabs.length) * 100}%` }"
        ></div>
      </div>
    </div>

    <div class="tab-panels">
      <keep-alive>
        <component 
          v-if="activeTab !== null && tabs[activeTab]"
          :key="`tab-${activeTab}`"
          :is="tabs[activeTab].component" 
          v-bind="tabs[activeTab].props || {}" 
        />
      </keep-alive>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type Component } from 'vue'

export interface TabItem {
  label: string
  icon: string
  component: Component
  props?: Record<string, unknown>
}

interface Props {
  tabs: TabItem[]
  modelValue?: number
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: number): void
  (e: 'tab-change', index: number, tab: TabItem): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  disabled: false,
})

const emit = defineEmits<Emits>()

const activeTab = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newValue) => {
    activeTab.value = newValue
  }
)

watch(activeTab, (newValue) => {
  emit('update:modelValue', newValue)
  if (props.tabs[newValue]) {
    emit('tab-change', newValue, props.tabs[newValue])
  }
})

const handleTabClick = (index: number) => {
  if (!props.disabled && props.tabs[index]) {
    activeTab.value = index
  }
}
</script>

<style scoped>
/* Container */
.tabs-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 1rem;
  overflow: hidden;
}

/* Tab Header */
.tab-header {
  background: #f8fafc;
  padding: 1rem 1rem 0;
  border-bottom: 1px solid #e2e8f0;
}

/* Tab List */
.tab-list {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 0.75rem;
}

.tab-list::-webkit-scrollbar {
  display: none;
}

/* Tab Item */
.tab-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.tab-item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Tab States */
.tab-active {
  background: #ffffff;
  color: var(--primary-color, #3b82f6);
  border-color: var(--primary-color, #3b82f6);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.tab-inactive:not(:disabled):hover {
  background: #f1f5f9;
  color: #475569;
  border-color: #e2e8f0;
}

/* Tab Icons */
.tab-icon {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.tab-active .tab-icon {
  color: var(--primary-color, #3b82f6);
  transform: scale(1.1);
}

/* Tab Label */
.tab-label {
  font-weight: 500;
  letter-spacing: -0.01em;
}

/* Progress Bar */
.progress-bar {
  height: 0.25rem;
  background: #e2e8f0;
  border-radius: 0.125rem;
  overflow: hidden;
  margin-top: -0.125rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color, #3b82f6), var(--primary-light-color, #60a5fa));
  border-radius: 0.125rem;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Tab Panels */
.tab-panels {
  flex: 1;
  overflow: auto;
  padding: 2rem;
  background: #ffffff;
  min-height: 400px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .tab-header {
    padding: 0.75rem 0.75rem 0;
  }

  .tab-list {
    gap: 0.375rem;
  }

  .tab-item {
    padding: 0.625rem 1rem;
    font-size: 0.8125rem;
  }

  .tab-icon {
    font-size: 0.875rem;
  }

  .tab-panels {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .tab-header {
    padding: 0.5rem 0.5rem 0;
  }

  .tab-item {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }

  .tab-panels {
    padding: 1rem;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .tabs-container {
    background: #1e293b;
  }

  .tab-header {
    background: #0f172a;
    border-bottom-color: #334155;
  }

  .tab-item {
    color: #94a3b8;
  }

  .tab-active {
    background: #1e293b;
    color: #60a5fa;
    border-color: #60a5fa;
  }

  .tab-inactive:not(:disabled):hover {
    background: #1e293b;
    color: #cbd5e1;
    border-color: #334155;
  }

  .progress-bar {
    background: #334155;
  }

  .tab-panels {
    background: #1e293b;
  }
}</style>
