<template>
  <div class="forbidden-container">
    <div class="forbidden-content">
      <div class="icon-container">
        <i class="pi pi-ban"></i>
      </div>
      <h1>Access Denied</h1>
      <p class="message">
        You don't have permission to access this page. If you believe this is an error, please
        contact your administrator.
      </p>
      <div class="action-buttons">
        <router-link to="/" class="btn-home">
          <i class="pi pi-home"></i>
          Return to Home
        </router-link>
        <router-link to="/" class="btn-login">
          <i class="pi pi-sign-in"></i>
          Sign In as Different User
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  document.title = 'Access Denied | School Portal'
})
</script>

<style scoped>
.forbidden-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
  padding: 2rem;
  background-color: #f8f9fa;
}

.forbidden-content {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 600px;
  text-align: center;
}

.icon-container {
  margin-bottom: 1.5rem;
}

.icon-container i {
  font-size: 5rem;
  color: #e53e3e;
}

h1 {
  color: #1a202c;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.message {
  color: #4a5568;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-home,
.btn-login {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-home {
  background-color: #4c9aff;
  color: white;
}

.btn-home:hover {
  background-color: #3a85ff;
}

.btn-login {
  background-color: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.btn-login:hover {
  background-color: #edf2f7;
}

@media (max-width: 640px) {
  .forbidden-content {
    padding: 2rem;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.75rem;
  }

  .icon-container i {
    font-size: 4rem;
  }

  h1 {
    font-size: 1.75rem;
  }

  .message {
    font-size: 1rem;
  }
}
</style>
