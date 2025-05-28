<template>
  <button 
    @click.stop="$emit('click')" 
    class="edit-toggle-btn"
    :class="{ 'is-editing': isEditing }"
  >
    <div class="toggle-icon-container">
      <svg
        v-if="!isEditing"
        xmlns="http://www.w3.org/2000/svg"
        class="edit-icon"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="check-icon"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  isEditing: boolean
}>()

defineEmits(['click'])
</script>

<style scoped>
.edit-toggle-btn {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid #e5e7eb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  z-index: 5;
}

.edit-toggle-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.edit-toggle-btn:active {
  transform: scale(0.95);
}

.edit-toggle-btn.is-editing {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-color: transparent;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

.toggle-icon-container {
  position: relative;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.edit-icon {
  width: 18px;
  height: 18px;
  color: #6b7280;
  transition: all 0.3s ease;
}

.check-icon {
  width: 18px;
  height: 18px;
  color: white;
  animation: checkmark 0.3s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

@keyframes checkmark {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
