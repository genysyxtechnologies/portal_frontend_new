<template>
  <div class="lock-indicator">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="lock-icon"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
    <span class="lock-tooltip">This field cannot be edited</span>
  </div>
</template>

<style scoped>
.lock-indicator {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: not-allowed;
  z-index: 5;
}

.lock-icon {
  width: 18px;
  height: 18px;
  color: #9ca3af;
  transition: all 0.3s ease;
}

.lock-indicator:hover .lock-icon {
  color: #6b7280;
}

.lock-tooltip {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #374151;
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.lock-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: #374151 transparent transparent transparent;
}

.lock-indicator:hover .lock-tooltip {
  opacity: 1;
  visibility: visible;
  top: -45px;
}
</style>
