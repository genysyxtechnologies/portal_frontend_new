<template>
  <div class="password-container" :class="{ 'edit-mode': isEditMode }">
    <div class="header-section">
      <h1 class="head-title">Password</h1>
      <div class="toggle-container">
        <span class="mode-label">{{ isEditMode ? 'Editing' : 'Locked' }}</span>
        <label class="toggle-switch">
          <input type="checkbox" v-model="isEditMode">
          <span class="slider round"></span>
        </label>
      </div>
    </div>

    <!-- Password Form Section -->
    <Transition name="fade" mode="out-in">
      <div v-if="isEditMode" class="password-form">
        <div class="form-group" v-for="(field, index) in passwordFields" :key="index">
          <label class="field-label">{{ field.label }}</label>
          <div class="input-container">
            <InputText v-model="field.value" :type="field.visible ? 'text' : 'password'"
              :placeholder="field.placeholder"
              :class="{ 'input-error': field.error, 'input-valid': field.value && !field.error }"
              @focus="field.focused = true" @blur="field.focused = false" @input="validateFieldRealTime(field)" />
            <button class="visibility-toggle" @click="field.visible = !field.visible" type="button">
              <i :class="field.visible ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
            <span class="validation-icon" v-if="field.value">
              <i v-if="!field.error" class="pi pi-check-circle valid-icon"></i>
              <i v-else class="pi pi-exclamation-circle error-icon"></i>
            </span>
          </div>
          <Transition name="slide-down">
            <small class="error-message" v-if="field.error">{{ field.errorMessage }}</small>
          </Transition>
          <Transition name="slide-down">
            <small class="hint-message" v-if="field.focused && field.hint">{{ field.hint }}</small>
          </Transition>
        </div>

        <div class="action-section">
          <div class="buttons-container">
            <ReUsableButtons label="Cancel" class="cancel-button" @click="resetForm" :outlined="true" />
            <ReUsableButtons label="Save Changes" class="save-button" @click="saveChanges" :loading="isSaving"
              :disabled="!isFormValid || isSaving" />
          </div>
        </div>
      </div>
      <div v-else class="locked-message">
        <div class="lock-icon-container">
          <i class="pi pi-lock"></i>
        </div>
        <p>Your password is securely stored. Toggle the switch to edit your password.</p>
      </div>
    </Transition>

    <!-- Success Modal -->
    <Transition name="modal-fade">
      <div v-if="showSuccessModal" class="success-modal-overlay" @click="showSuccessModal = false">
        <div class="success-modal" @click.stop>
          <div class="success-icon">
            <i class="pi pi-check-circle"></i>
          </div>
          <h3>Password Updated Successfully!</h3>
          <p>Your password has been changed. You'll use your new password next time you log in.</p>
          <ReUsableButtons label="Close" @click="showSuccessModal = false" class="close-button" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import ReUsableButtons from '@/views/buttons/ReUsableButtons.vue'
import useStudentSettings from '@/services/student/useStudentSettings'

// Define field type for TypeScript
interface PasswordField {
  label: string
  value: string
  visible: boolean
  focused: boolean
  error: boolean
  errorMessage: string
  placeholder: string
  hint: string
}

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
})

// Get student settings service
const { updatePassword } = useStudentSettings()

// State management
const isEditMode = ref(false)
const isSaving = ref(false)
const showSuccessModal = ref(false)

// Password fields with validation state
const passwordFields = reactive<PasswordField[]>([
  {
    label: 'Current Password',
    value: '',
    visible: false,
    focused: false,
    error: false,
    errorMessage: '',
    placeholder: 'Enter your current password',
    hint: ''
  },
  {
    label: 'New Password',
    value: '',
    visible: false,
    focused: false,
    error: false,
    errorMessage: '',
    placeholder: 'Enter your new password',
    hint: 'Password must be at least 8 characters with letters, numbers, and special characters'
  },
  {
    label: 'Confirm New Password',
    value: '',
    visible: false,
    focused: false,
    error: false,
    errorMessage: '',
    placeholder: 'Confirm your new password',
    hint: ''
  }
])

// Computed property to check if form is valid
const isFormValid = computed(() => {
  return passwordFields.every(field => field.value.trim() !== '' && !field.error) &&
    passwordFields[1].value === passwordFields[2].value
})

// Validate individual field with option to preserve focus state
const validateField = (field: PasswordField, preserveFocus = false): void => {
  // Keep focused state if preserveFocus is true
  if (!preserveFocus) {
    field.focused = false
  }

  if (field.value.trim() === '') {
    field.error = true
    field.errorMessage = `${field.label} is required`
    return
  }

  // Validate new password
  if (field.label === 'New Password') {
    const hasLetter = /[A-Za-z]/.test(field.value)
    const hasNumber = /\d/.test(field.value)
    const hasSpecial = /[@$!%*#?&]/.test(field.value)
    const hasMinLength = field.value.length >= 8

    if (!(hasLetter && hasNumber && hasSpecial && hasMinLength)) {
      field.error = true

      if (!hasMinLength) {
        field.errorMessage = 'Password must be at least 8 characters'
      } else if (!hasLetter) {
        field.errorMessage = 'Password must include at least one letter'
      } else if (!hasNumber) {
        field.errorMessage = 'Password must include at least one number'
      } else if (!hasSpecial) {
        field.errorMessage = 'Password must include at least one special character (@$!%*#?&)'
      } else {
        field.errorMessage = 'Password must meet all requirements'
      }
      return
    }
  }

  // Validate confirm password
  if (field.label === 'Confirm New Password') {
    if (field.value !== passwordFields[1].value) {
      field.error = true
      field.errorMessage = 'Passwords do not match'
      return
    }
  }

  field.error = false
  field.errorMessage = ''
}

// Reset form fields
const resetForm = () => {
  passwordFields.forEach(field => {
    field.value = ''
    field.error = false
    field.errorMessage = ''
    field.focused = false
    field.visible = false
  })

  isEditMode.value = false
}

// Real time validation as user types
const validateFieldRealTime = (field: PasswordField): void => {
  validateField(field, true)
}

// Save changes with animation
const saveChanges = async () => {
  // Validate all fields first
  passwordFields.forEach(field => validateField(field))

  if (!isFormValid.value) return

  try {
    isSaving.value = true

    const response = await updatePassword({
      oldPassword: passwordFields[0].value,
      newPassword: passwordFields[1].value,
      confirmPassword: passwordFields[2].value,
      userId: props.userId
    })

    // Show success modal
    showSuccessModal.value = (response as { success: boolean }).success || false


    // Reset form after successful save
    resetForm()
  } catch (error) {
    return error
    // Handle error scenario
  } finally {
    isSaving.value = false
  }
}

</script>

<style scoped>
.password-container {
  background-color: #fff;
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.password-container:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(13, 71, 161, 0.1);
}

.head-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0D47A1;
  margin: 0;
}

/* Toggle Switch Styling */
.toggle-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mode-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #0D47A1;
  transition: color 0.3s ease;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e0e0e0;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

input:checked+.slider {
  background-color: #0D47A1;
}

input:focus+.slider {
  box-shadow: 0 0 1px #0D47A1;
}

input:checked+.slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

/* Form Styling */
.password-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}

.field-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #424242;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-container :deep(input) {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #90caf9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.input-container :deep(input:focus) {
  border-color: #0D47A1;
  box-shadow: 0 0 0 2px rgba(13, 71, 161, 0.2);
  background-color: #fff;
}

.input-container :deep(.input-error) {
  border-color: #f44336 !important;
  background-color: rgba(244, 67, 54, 0.03);
}

.input-container :deep(.input-valid) {
  border-color: #4CAF50 !important;
  background-color: rgba(76, 175, 80, 0.03);
}

.visibility-toggle {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: #757575;
  cursor: pointer;
  transition: color 0.2s ease;
}

.visibility-toggle:hover {
  color: #0D47A1;
}

.validation-icon {
  position: absolute;
  right: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  animation: fadeIn 0.3s;
}

.valid-icon {
  color: #4CAF50;
}

.error-icon {
  color: #f44336;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.error-message {
  color: #f44336;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.hint-message {
  color: #757575;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

/* Action Section */
.action-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.forgot-password {
  color: #0D47A1;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: #1565C0;
  text-decoration: underline;
}

.buttons-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

:deep(.cancel-button) {
  background-color: transparent;
  color: #0D47A1;
  border: 1px solid #0D47A1;
}

:deep(.save-button) {
  background-color: #0D47A1;
  color: white;
}

:deep(.save-button:disabled) {
  background-color: #90caf9;
  cursor: not-allowed;
}

/* Locked Mode Styling */
.locked-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: #616161;
}

.lock-icon-container {
  font-size: 3rem;
  color: #0D47A1;
  margin-bottom: 1.5rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }

  50% {
    transform: scale(1.1);
    opacity: 1;
  }

  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}

/* Success Modal Styling */
.success-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.success-modal {
  background-color: white;
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.success-icon {
  font-size: 4rem;
  color: #4CAF50;
  margin-bottom: 1rem;
  animation: bounce 1s;
}

@keyframes bounce {

  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-20px);
  }

  60% {
    transform: translateY(-10px);
  }
}

.success-modal h3 {
  font-size: 1.5rem;
  color: #212121;
  margin-bottom: 0.5rem;
}

.success-modal p {
  color: #616161;
  margin-bottom: 1.5rem;
}

:deep(.close-button) {
  background-color: #4CAF50;
  color: white;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Edit Mode Animation */
.edit-mode {
  animation: highlight 1s ease;
}

@keyframes highlight {
  0% {
    box-shadow: 0 0 0 rgba(13, 71, 161, 0);
  }

  50% {
    box-shadow: 0 0 20px rgba(13, 71, 161, 0.3);
  }

  100% {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .password-container {
    padding: 1.5rem;
  }

  .action-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .buttons-container {
    width: 100%;
  }

  :deep(.save-button),
  :deep(.cancel-button) {
    width: 100%;
  }

  .forgot-password {
    margin-bottom: 0.5rem;
  }
}
</style>
