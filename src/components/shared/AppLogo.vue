<template>
  <div class="app-logo-container">
    <img v-if="logoUrl" :src="logoUrl" :alt="alt" :class="['app-logo-image', sizeClass]" />
    <div v-else-if="loading" class="app-logo-placeholder">
      <i class="pi pi-spin pi-spinner"></i>
    </div>
    <div v-else class="app-logo-placeholder">
      <i class="pi pi-image"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { logoService, LogoType } from '@/services/logoService'

defineOptions({
  name: 'AppLogo',
})

const props = defineProps({
  alt: {
    type: String,
    default: 'School Portal Logo',
  },
  size: {
    type: String,
    default: 'medium', // small, medium, large
    validator: (value: string) => ['small', 'medium', 'large'].includes(value),
  },
  type: {
    type: String,
    default: LogoType.FULL,
    validator: (value: string) => Object.values(LogoType).includes(value as LogoType),
  },
  fallback: {
    type: String,
    default: '',
  },
})

const logoUrl = ref<string>('')
const loading = ref<boolean>(true)
const error = ref<boolean>(false)

const sizeClass = computed(() => `app-logo-${props.size}`)

const fetchLogo = async () => {
  loading.value = true
  error.value = false

  try {
    logoUrl.value = await logoService.fetchLogo(props.type as LogoType)
  } catch (err) {
    console.error('Failed to fetch logo:', err)
    error.value = true

    // Use fallback if provided, otherwise use the default fallback
    logoUrl.value = props.fallback || logoService.getFallbackUrl(props.type as LogoType)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLogo()
})

// No need to clean up as logoService handles cache management
onUnmounted(() => {
  // We don't revoke URLs here as they're managed by the logoService cache
})
</script>

<style scoped>
.app-logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.app-logo-image {
  display: block;
  max-width: 100%;
  height: auto;
}

.app-logo-small {
  max-width: 100px;
  max-height: 40px;
}

.app-logo-medium {
  max-width: 200px;
  max-height: 60px;
}

.app-logo-large {
  max-width: 300px;
  max-height: 80px;
}

.app-logo-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f5f9;
  border-radius: 4px;
}

.app-logo-placeholder i {
  font-size: 1.5rem;
  color: #94a3b8;
}

.app-logo-small.app-logo-placeholder {
  width: 100px;
  height: 40px;
}

.app-logo-medium.app-logo-placeholder {
  width: 200px;
  height: 60px;
}

.app-logo-large.app-logo-placeholder {
  width: 300px;
  height: 80px;
}
</style>
