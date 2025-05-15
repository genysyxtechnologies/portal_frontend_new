<template>
  <But-ton :label="label" class="login-btn transform hover:scale-[1.02] transition-transform duration-300"
    @click="$emit('on-click')" :disabled="disabled" />
</template>

<script setup lang="ts">

defineProps({
  label: String,
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['on-click'])

</script>

<style scoped>
.login-btn {
  background-color: #0d47a1;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.login-btn:disabled {
  cursor: not-allowed;
}

.login-btn:hover {
  background-color: #1565C0;
  box-shadow: 0 4px 12px rgba(13, 71, 161, 0.3);
}
</style>
