<template>
  <div class="tabs-container">
    <div class="tab-list">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab-item"
        :class="{
          'tab-active': activeTab === index,
          'tab-inactive': activeTab !== index,
        }"
        :style="{ pointerEvents: disabled ? 'none' : 'auto' }"
        @click="handleTabClick(index)"
      >
        <div class="tab-content">
          <span class="tab-icon" :class="tab.icon"></span>
          <span class="tab-label">{{ tab.label }}</span>
          <span class="tab-chevron">
            <i class="fas fa-chevron-right"></i>
          </span>
        </div>
        <span v-if="activeTab === index" class="tab-indicator"></span>
      </div>
    </div>

    <div class="tab-panels">
      <transition-group name="panel-transition" mode="out-in">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          v-show="activeTab === index"
          class="tab-panel"
        >
          <component :is="tab.component" v-bind="tab.props" />
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

export interface TabItem {
  label: string
  icon: string
  component: any
  props?: Record<string, any>
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
  emit('tab-change', newValue, props.tabs[newValue])
})

const handleTabClick = (index: number) => {
  if (!props.disabled) {
    activeTab.value = index
  }
}
</script>

<style scoped>
/* Tabs styling */
.tabs-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tab-list {
  display: flex;
  border-bottom: 2px solid #e5e7eb;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  position: relative;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  padding: 0.3rem 0.3rem 0;
}

.tab-list::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

.tab-item {
  padding: 0.6rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  height: 2.8rem;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  flex-shrink: 0;
  border-radius: 0.5rem 0.5rem 0 0;
  margin-right: 0.2rem;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%);
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  cursor: pointer;
}

.tab-active {
  color: #4f46e5;
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  box-shadow: 
    0 3px 8px rgba(79, 70, 229, 0.15),
    0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(79, 70, 229, 0.2);
  transform: translateY(-1px);
}

.tab-inactive {
  color: #6b7280;
}

.tab-inactive:hover {
  color: #4f46e5;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  transform: translateY(-0.5px);
  box-shadow: 0 2px 6px rgba(79, 70, 229, 0.1);
}

.tab-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: space-between;
  width: 100%;
}

.tab-chevron {
  font-size: 0.7rem;
  opacity: 0.6;
  transition: all 0.3s ease;
  transform: translateX(-6px);
}

.tab-active .tab-chevron {
  opacity: 1;
  color: #4f46e5;
  transform: translateX(0);
}

.tab-inactive:hover .tab-chevron {
  opacity: 0.8;
  transform: translateX(-2px);
}

.tab-icon {
  font-size: 0.9rem;
  transition: transform 0.3s ease;
}

.tab-active .tab-icon {
  transform: scale(1.1);
  color: #4f46e5;
}

.tab-label {
  position: relative;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #4f46e5, #8b5cf6);
  animation: indicatorGrow 0.4s cubic-bezier(0.65, 0, 0.35, 1);
}

@keyframes indicatorGrow {
  from {
    transform: scaleX(0);
    transform-origin: left;
  }
  to {
    transform: scaleX(1);
  }
}

.tab-panels {
  flex: 1;
  overflow: auto;
  padding: 1.5rem;
  position: relative;
}

.tab-panel {
  height: 100%;
}

/* Panel transition animations */
.panel-transition-enter-active,
.panel-transition-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  padding: 1.5rem;
}

.panel-transition-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.panel-transition-leave-to {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}
</style>