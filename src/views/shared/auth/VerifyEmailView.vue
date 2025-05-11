<template>
  <div class="verify-email-container">
    <div class="card">
      <div v-if="loading" class="loading-state">
        <i class="pi pi-spin pi-spinner"></i>
        <h2>Verifying your email...</h2>
        <p>Please wait while we verify your email address.</p>
      </div>

      <div v-else-if="verified" class="success-state">
        <i class="pi pi-check-circle"></i>
        <h1>Email Verified!</h1>
        <p class="subtitle">Your email has been successfully verified. You can now access all features of the portal.</p>
        <router-link to="/auth/login" class="btn-primary">
          Sign In
        </router-link>
      </div>

      <div v-else-if="verificationError" class="error-state">
        <i class="pi pi-exclamation-circle"></i>
        <h1>Verification Failed</h1>
        <p class="subtitle">{{ verificationError }}</p>

        <div class="action-buttons">
          <router-link to="/auth/register" class="btn-secondary">
            Register Again
          </router-link>
          <button @click="resendVerification" class="btn-primary" :disabled="resendLoading">
            <span v-if="!resendLoading">Resend Verification</span>
            <i v-else class="pi pi-spin pi-spinner"></i>
          </button>
        </div>

        <div v-if="resendSuccess" class="resend-success">
          <i class="pi pi-check"></i>
          <span>Verification email sent! Please check your inbox.</span>
        </div>

        <div v-if="resendError" class="resend-error">
          <i class="pi pi-times"></i>
          <span>{{ resendError }}</span>
        </div>
      </div>

      <div v-else class="awaiting-verification">
        <i class="pi pi-envelope"></i>
        <h1>Verify Your Email</h1>
        <p class="subtitle">We've sent a verification link to your email address. Please click the link in the email to verify your account.</p>
        
        <div class="email-info">
          <p class="prompt">Don't see the email? Check your spam folder or request a new verification email.</p>
          <button @click="resendVerification" class="btn-primary" :disabled="resendLoading">
            <span v-if="!resendLoading">Resend Verification Email</span>
            <i v-else class="pi pi-spin pi-spinner"></i>
          </button>
        </div>

        <div v-if="resendSuccess" class="resend-success">
          <i class="pi pi-check"></i>
          <span>Verification email sent! Please check your inbox.</span>
        </div>

        <div v-if="resendError" class="resend-error">
          <i class="pi pi-times"></i>
          <span>{{ resendError }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const token = ref(route.query.token as string);

const loading = ref(true);
const verified = ref(false);
const verificationError = ref('');
const resendLoading = ref(false);
const resendSuccess = ref(false);
const resendError = ref('');

onMounted(() => {
  if (token.value) {
    verifyEmail();
  } else {
    // If no token is provided, we are in the awaiting verification state
    loading.value = false;
  }
});

const verifyEmail = async () => {
  loading.value = true;
  
  try {
    // This would be an API call to verify the email token
    // const response = await authService.verifyEmail(token.value);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, simulate success
    verified.value = true;
  } catch (error) {
    // Handle verification error
    let errorMessage = 'Verification failed. The link may have expired or is invalid.';
    if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    }
    verificationError.value = errorMessage;
  } finally {
    loading.value = false;
  }
};

const resendVerification = async () => {
  resendLoading.value = true;
  resendSuccess.value = false;
  resendError.value = '';
  
  try {
    // This would be an API call to resend verification email
    // const response = await authService.resendVerificationEmail(userEmail);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, simulate success
    resendSuccess.value = true;
    
    // Clear success message after a few seconds
    setTimeout(() => {
      resendSuccess.value = false;
    }, 5000);
  } catch (error) {
    // Handle resend error
    let errorMessage = 'Failed to resend verification email. Please try again.';
    if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    }
    resendError.value = errorMessage;
    
    // Clear error message after a few seconds
    setTimeout(() => {
      resendError.value = '';
    }, 5000);
  } finally {
    resendLoading.value = false;
  }
};
</script>

<style scoped>
.verify-email-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 150px);
  padding: 2rem;
}

.card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.loading-state,
.success-state,
.error-state,
.awaiting-verification {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-state i,
.success-state i,
.error-state i,
.awaiting-verification i {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.loading-state i {
  color: #4c9aff;
}

.success-state i {
  color: #38a169;
}

.error-state i {
  color: #e53e3e;
}

.awaiting-verification i {
  color: #4c9aff;
}

h1 {
  color: #333;
  margin: 0 0 0.75rem 0;
}

h2 {
  color: #333;
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  color: #666;
  margin-bottom: 2rem;
}

.btn-primary {
  background-color: #4c9aff;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary:hover {
  background-color: #3a85ff;
}

.btn-primary:disabled {
  background-color: #a6c8ff;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
}

.btn-secondary:hover {
  background-color: #edf2f7;
}

.email-info {
  background-color: #f8f9fa;
  padding: 1.25rem;
  border-radius: 8px;
  margin: 1rem 0 2rem;
  text-align: left;
}

.prompt {
  margin: 0 0 1rem 0;
  color: #4a5568;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin: 1rem 0 2rem;
}

.resend-success,
.resend-error {
  margin-top: 1.5rem;
  padding: 0.75rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.resend-success {
  background-color: #f0fff4;
  color: #38a169;
}

.resend-error {
  background-color: #fff5f5;
  color: #e53e3e;
}

@media (max-width: 640px) {
  .card {
    padding: 1.5rem;
  }
  
  .btn-primary,
  .btn-secondary {
    padding: 0.65rem 1.25rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .loading-state i,
  .success-state i,
  .error-state i,
  .awaiting-verification i {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
}
</style>