<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'toast',
            `toast-${toast.type}`,
            { 'toast-with-action': toast.action }
          ]"
          @click="toast.action && toast.action()"
        >
          <!-- Icon -->
          <div class="toast-icon" v-html="getIconSvg(toast.type)"></div>

          <!-- Content -->
          <div class="toast-content">
            <div v-if="toast.title" class="toast-title">{{ toast.title }}</div>
            <div class="toast-message">{{ toast.message }}</div>
          </div>

          <!-- Action Button -->
          <button
            v-if="toast.action"
            class="toast-action-btn"
            @click.stop="toast.action()"
          >
            {{ toast.actionText || 'Action' }}
          </button>

          <!-- Close Button -->
          <button
            v-if="toast.dismissible !== false"
            class="toast-close"
            @click.stop="removeToast(toast.id)"
            v-html="getCloseIconSvg()"
          ></button>

          <!-- Progress Bar -->
          <div
            v-if="toast.duration && toast.duration > 0"
            class="toast-progress"
            :style="{ animationDuration: `${toast.duration}ms` }"
          ></div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { toastService, type ToastItem } from '@/services/toastService'

const toasts = ref<ToastItem[]>([])

const getIconSvg = (type: string) => {
  const icons = {
    success: `<svg viewBox="0 0 20 20" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>`,
    error: `<svg viewBox="0 0 20 20" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>`,
    warning: `<svg viewBox="0 0 20 20" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>`,
    info: `<svg viewBox="0 0 20 20" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>`
  }
  return icons[type as keyof typeof icons] || icons.info
}

const getCloseIconSvg = () => {
  return `<svg viewBox="0 0 20 20" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>`
}

const removeToast = (id: string) => {
  toastService.remove(id)
}

let unsubscribe: (() => void) | null = null

onMounted(() => {
  unsubscribe = toastService.subscribe((newToasts) => {
    toasts.value = newToasts
  })
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 10000;
  pointer-events: none;
  max-width: 420px;
  width: 100%;
}

.toast {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  margin-bottom: 0.75rem;
  background: white;
  border-radius: 12px;
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.05);
  border-left: 4px solid transparent;
  pointer-events: auto;
  cursor: default;
  overflow: hidden;
  backdrop-filter: blur(8px);
  max-width: 100%;
}

.toast-with-action {
  cursor: pointer;
}

.toast-success {
  border-left-color: #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.02) 0%, white 100%);
}

.toast-error {
  border-left-color: #ef4444;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.02) 0%, white 100%);
}

.toast-warning {
  border-left-color: #f59e0b;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.02) 0%, white 100%);
}

.toast-info {
  border-left-color: #3b82f6;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, white 100%);
}

.toast-icon {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.125rem;
}

.toast-success .toast-icon {
  color: #10b981;
}

.toast-error .toast-icon {
  color: #ef4444;
}

.toast-warning .toast-icon {
  color: #f59e0b;
}

.toast-info .toast-icon {
  color: #3b82f6;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: #111827;
  margin-bottom: 0.25rem;
  line-height: 1.25;
}

.toast-message {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
  word-break: break-word;
}

.toast-action-btn {
  flex-shrink: 0;
  padding: 0.375rem 0.75rem;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 0.5rem;
}

.toast-action-btn:hover {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-1px);
}

.toast-close {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  margin-left: 0.5rem;
}

.toast-close:hover {
  background: rgba(156, 163, 175, 0.1);
  color: #6b7280;
  transform: scale(1.1);
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: currentColor;
  opacity: 0.3;
  animation: toast-progress linear forwards;
  transform-origin: left;
}

@keyframes toast-progress {
  0% {
    transform: scaleX(1);
  }
  100% {
    transform: scaleX(0);
  }
}

/* Transitions */
.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.toast-enter-from {
  transform: translateX(100%) scale(0.95);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%) scale(0.95);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Dark mode support */
.dark .toast {
  background: #1f2937;
  color: #f9fafb;
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.25),
    0 4px 12px rgba(0, 0, 0, 0.15);
}

.dark .toast-title {
  color: #f9fafb;
}

.dark .toast-message {
  color: #d1d5db;
}

.dark .toast-close {
  color: #6b7280;
}

.dark .toast-close:hover {
  background: rgba(107, 114, 128, 0.1);
  color: #9ca3af;
}

.dark .toast-success {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, #1f2937 100%);
}

.dark .toast-error {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, #1f2937 100%);
}

.dark .toast-warning {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, #1f2937 100%);
}

.dark .toast-info {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, #1f2937 100%);
}

/* Mobile responsive */
@media (max-width: 640px) {
  .toast-container {
    top: 0.5rem;
    right: 0.5rem;
    left: 0.5rem;
    max-width: none;
  }

  .toast {
    padding: 0.875rem 1rem;
    border-radius: 8px;
    margin-bottom: 0.5rem;
  }

  .toast-title {
    font-size: 0.8125rem;
  }

  .toast-message {
    font-size: 0.8125rem;
  }

  .toast-action-btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .toast {
    flex-direction: column;
    gap: 0.5rem;
  }

  .toast-icon {
    align-self: flex-start;
  }

  .toast-action-btn {
    align-self: flex-start;
    margin-left: 0;
  }

  .toast-close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    margin-left: 0;
  }
}
</style>
