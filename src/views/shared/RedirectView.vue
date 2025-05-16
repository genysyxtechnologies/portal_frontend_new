<template>
  <div class="redirect-view">
    <div v-if="loading" class="redirect-loader">
      <h2>Redirecting...</h2>
      <div class="spinner"></div>
    </div>
    <div v-else-if="error" class="redirect-error">
      <h2>Redirect Error</h2>
      <p>{{ error }}</p>
      <router-link to="/" class="btn-home">Return Home</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(() => {
  // Get the target path from query parameters
  const targetPath = route.query.to as string

  // Check if target path is provided
  if (!targetPath) {
    error.value = 'No redirect destination specified'
    loading.value = false
    return
  }

  try {
    // Perform the redirection
    router.push(targetPath)
  } catch (err) {
    error.value = `Failed to redirect: ${err instanceof Error ? err.message : String(err)}`
    loading.value = false
  }
})
</script>

<style scoped>
.redirect-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  text-align: center;
}

.redirect-loader,
.redirect-error {
  padding: 2rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 20px auto;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.btn-home {
  display: inline-block;
  margin-top: 20px;
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.btn-home:hover {
  background-color: #2980b9;
}
</style>
