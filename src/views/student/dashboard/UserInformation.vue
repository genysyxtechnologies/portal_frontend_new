<template>
  <div class="user-information-card">
    <!-- image section with animation -->
    <div class="profile-image-container">
      <div class="profile-image-wrapper">
        <div class="profile-image-overlay"></div>
        <img
          :src="profile"
          alt="profile"
          class="profile-image"
        />
        <div class="profile-image-glow"></div>
      </div>
    </div>

    <!-- information section with staggered animations -->
    <div class="information-container">
      <!-- email field -->
      <div class="input-field email-field">
        <label class="input-label">{{ firstLabel }}</label>
        <div class="input-wrapper">
          <i class="pi pi-envelope input-icon"></i>
          <InputText
            class="custom-input"
            :placeholder="firstInput || 'your.email@example.com'"
          />
          <span class="input-focus-line"></span>
        </div>
      </div>

      <!-- matric number field -->
      <div class="input-field matric-field">
        <label class="input-label">{{ secondLabel }}</label>
        <div class="input-wrapper">
          <i class="pi pi-id-card input-icon"></i>
          <InputText
            class="custom-input"
            :placeholder="secondInput || 'NSUK/2023/001'"
          />
          <span class="input-focus-line"></span>
        </div>
      </div>

      <!-- department field -->
      <div class="input-field department-field">
        <label class="input-label">{{ thirdLabel }}</label>
        <div class="input-wrapper">
          <i class="pi pi-building input-icon"></i>
          <InputText
            class="custom-input"
            :placeholder="thirdInput || 'Computer Science'"
          />
          <span class="input-focus-line"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import InputText from "primevue/inputtext";

defineProps({
  firstInput: String,
  secondInput: String,
  thirdInput: String,
  firstLabel: String,
  secondLabel: String,
  thirdLabel: String,
});

const profile = ref(
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&w=1000&q=80"
);
</script>

<style scoped>
/* Main Card Styles */
.user-information-card {
  background: #fff;
  width: 100%;
  padding: 3rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  height: 100%;
  position: relative;
  overflow: hidden;
  animation: cardAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  transform: translateY(20px);
  opacity: 0;
}

/* Profile Image Styles */
.profile-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2.5rem;
  animation: float 6s ease-in-out infinite;
}

.profile-image-wrapper {
  position: relative;
  width: 8.5rem;
  height: 8.5rem;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.5s ease;
}

.profile-image-wrapper:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease;
}

.profile-image-wrapper:hover .profile-image {
  transform: scale(1.1);
}

.profile-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(13, 71, 161, 0.3), rgba(33, 150, 243, 0));
  z-index: 1;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.profile-image-wrapper:hover .profile-image-overlay {
  opacity: 1;
}

.profile-image-glow {
  position: absolute;
  top: -20%;
  left: -20%;
  width: 140%;
  height: 140%;
  background: radial-gradient(circle, rgba(144, 202, 249, 0.5) 0%, rgba(144, 202, 249, 0) 70%);
  z-index: 0;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.8s ease;
}

.profile-image-wrapper:hover .profile-image-glow {
  opacity: 0.8;
  transform: scale(1);
  animation: pulse 2s infinite alternate;
}

/* Information Container Styles */
.information-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  opacity: 0;
  transform: translateY(15px);
}

.email-field {
  animation: fadeInUp 0.5s ease-out 0.2s forwards;
}

.matric-field {
  animation: fadeInUp 0.5s ease-out 0.4s forwards;
}

.department-field {
  animation: fadeInUp 0.5s ease-out 0.6s forwards;
}

.input-label {
  color: #90CAF9;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: color 0.3s ease;
  margin-left: 0.25rem;
}

.input-wrapper {
  position: relative;
  overflow: hidden;
}

.input-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #90CAF9;
  transition: all 0.3s ease;
  z-index: 2;
}

.custom-input {
  width: 100%;
  padding: 0.9rem 2.5rem 0.9rem 1rem;
  border: none;
  border-radius: 0.75rem;
  background-color: #f5f9ff;
  transition: all 0.3s ease;
  font-size: 1rem;
  color: #333;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.custom-input:focus {
  outline: none;
  background-color: #e8f4ff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.input-focus-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #1976d2, #90CAF9);
  transition: width 0.3s ease;
}

.custom-input:focus ~ .input-focus-line {
  width: 100%;
}

.input-wrapper:hover .input-icon {
  color: #1976d2;
  transform: translateY(-50%) scale(1.1);
}

/* Animations */
@keyframes cardAppear {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    opacity: 0.5;
    transform: scale(0.95);
  }
  100% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

/* Responsive Styles */
@media (max-width: 768px) {
  .user-information-card {
    padding: 2rem 1.5rem;
  }
  
  .profile-image-wrapper {
    width: 7rem;
    height: 7rem;
  }
  
  .custom-input {
    padding: 0.75rem 2.5rem 0.75rem 1rem;
  }
}
</style>

<style>
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-0.5rem);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(0.625rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
