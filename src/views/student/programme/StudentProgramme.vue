<template>
  <div class="programme-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="title-section">
        <h1 class="page-title">Academic Programme</h1>
        <p class="page-subtitle">Manage your current programme and explore transfer options</p>
      </div>
    </div>

    <div class="content-grid">
      <!-- Current Programme Information -->
      <div class="programme-info-card">
        <div class="card-header">
          <div class="header-icon">
            <i class="pi pi-graduation-cap"></i>
          </div>
          <div class="header-content">
            <h2 class="card-title">Current Programme</h2>
            <p class="card-subtitle">Your active academic programme details</p>
          </div>
        </div>

        <div class="programme-details">
          <div class="detail-item">
            <div class="detail-label">
              <i class="pi pi-bookmark detail-icon"></i>
              Programme Title
            </div>
            <div class="detail-value">{{ user?.programme?.name }}</div>
          </div>

          <div class="detail-item">
            <div class="detail-label">
              <i class="pi pi-building detail-icon"></i>
              Faculty/School
            </div>
            <div class="detail-value">{{ user?.programme?.department?.faculty?.name }}</div>
          </div>

          <div class="detail-item">
            <div class="detail-label">
              <i class="pi pi-users detail-icon"></i>
              Department
            </div>
            <div class="detail-value">{{ user?.programme?.department?.name }}</div>
          </div>

          <div class="detail-item">
            <div class="detail-label">
              <i class="pi pi-calendar detail-icon"></i>
              Current Level
            </div>
            <div class="detail-value">{{ user?.level?.title }}</div>
          </div>

          <div class="detail-item">
            <div class="detail-label">
              <i class="pi pi-clock detail-icon"></i>
              Duration
            </div>
            <div class="detail-value">{{ user?.programme?.programmeDuration }} Years</div>
          </div>

          <div class="detail-item">
            <div class="detail-label">
              <i class="pi pi-calendar-plus detail-icon"></i>
              Admission Year
            </div>
            <div class="detail-value">{{ user?.yearOfAdmission?.name }}</div>
          </div>
        </div>

        <div class="status-section">
          <div class="status-badge active">
            <i class="pi pi-check-circle"></i>
            Active Programme
          </div>
        </div>
      </div>

      <!-- Instructions & Actions Card -->
      <div class="instructions-card">
        <div class="card-header">
          <div class="header-icon info">
            <i class="pi pi-info-circle"></i>
          </div>
          <div class="header-content">
            <h2 class="card-title">Programme Transfer</h2>
            <p class="card-subtitle">Guidelines for changing your academic programme</p>
          </div>
        </div>

        <div class="instructions-content">
          <div class="instruction-section">
            <h3 class="instruction-title">
              <i class="pi pi-list-check"></i>
              Requirements
            </h3>
            <ul class="instruction-list">
              <li class="instruction-item">
                <i class="pi pi-angle-right"></i>
                No outstanding academic debts
              </li>
              <li class="instruction-item">
                <i class="pi pi-angle-right"></i>
                Complete current session requirements
              </li>
              <li class="instruction-item">
                <i class="pi pi-angle-right"></i>
                Available slots in target programme
              </li>
            </ul>
          </div>

          <div class="instruction-section">
            <h3 class="instruction-title">
              <i class="pi pi-exclamation-triangle"></i>
              Important Notes
            </h3>
            <div class="note-box">
              <p>
                Programme transfer is subject to approval by the academic board. Processing may take
                1 day to 2 weeks.
              </p>
            </div>
          </div>

          <div class="action-section">
            <div class="payment-notice">
              <div class="notice-content">
                <img :src="warning" alt="warning" class="warning-icon" />
                <div class="notice-text">
                  <p class="notice-title">Transfer Fee Required</p>
                  <p class="notice-amount">₦15,000 processing fee applies</p>
                </div>
              </div>
            </div>

            <div class="action-buttons">
              <ReUsableButtons :label="'Request Programme Transfer'" class="primary-button" />
              <button class="secondary-button">
                <i class="pi pi-download"></i>
                Download Guidelines
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
// import ReUsableSelect from '@/views/select/ReUsableSelect.vue'
import ReUsableButtons from '@/views/buttons/ReUsableButtons.vue'
import warning from '../../../assets/images/student/accomodation/warning.png'
import { useStudentDashboard } from '@/services/student/useStudentDashboard.ts'
const { user, getStudentInformation } = useStudentDashboard()

onMounted(async () => {
  if (!user) await getStudentInformation()
})
</script>

<style scoped>
.programme-container {
  padding: 2rem;
  min-height: calc(100vh - 120px);
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.title-section {
  flex: 1;
}

/* Page title and subtitle styles are now in base.css */

.filters-section {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-select {
  min-width: 200px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  height: calc(100vh - 280px);
}

/* Programme Info Card */
.programme-info-card {
  background: white;
  border-radius: 1.5rem;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.programme-info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.header-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
}

.header-icon.info {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  box-shadow: 0 10px 15px -3px rgba(6, 182, 212, 0.3);
}

.header-content {
  flex: 1;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.card-subtitle {
  color: #64748b;
  font-size: 0.9rem;
}

.programme-details {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  overflow-y: auto;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  border-left: 4px solid #e2e8f0;
}

.detail-item:hover {
  background: #f1f5f9;
  border-left-color: #3b82f6;
  transform: translateX(5px);
}

.detail-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #475569;
  font-weight: 500;
  font-size: 0.95rem;
}

.detail-icon {
  color: #3b82f6;
  font-size: 1rem;
}

.detail-value {
  color: #1e293b;
  font-weight: 600;
  font-size: 1rem;
}

.status-section {
  padding: 1.5rem 2rem 2rem 2rem;
  display: flex;
  justify-content: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
}

.status-badge.active {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
}

/* Instructions Card */
.instructions-card {
  background: white;
  border-radius: 1.5rem;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.instructions-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.instructions-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: calc(100% - 120px);
  overflow-y: auto;
}

.instruction-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.instruction-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.instruction-title i {
  color: #3b82f6;
}

.instruction-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.instruction-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  color: #475569;
  transition: all 0.3s ease;
}

.instruction-item:hover {
  background: #f1f5f9;
  transform: translateX(5px);
}

.instruction-item i {
  color: #3b82f6;
  font-size: 0.8rem;
}

.note-box {
  padding: 1rem;
  background: linear-gradient(135deg, #fef3cd, #fde68a);
  border: 1px solid #f59e0b;
  border-radius: 0.75rem;
  color: #92400e;
  font-weight: 500;
}

.action-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: auto;
}

.payment-notice {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  border: 1px solid #f87171;
  border-radius: 0.75rem;
  padding: 1rem;
}

.notice-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.warning-icon {
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
}

.notice-text {
  flex: 1;
}

.notice-title {
  font-weight: 600;
  color: #991b1b;
  margin-bottom: 0.25rem;
}

.notice-amount {
  color: #7f1d1d;
  font-size: 1.1rem;
  font-weight: 700;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.primary-button {
  flex: 1;
}

.secondary-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  color: #475569;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.secondary-button:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #334155;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .header-section {
    flex-direction: column;
    gap: 1rem;
  }

  .filters-section {
    align-self: stretch;
  }
}

@media (max-width: 768px) {
  .programme-container {
    padding: 1rem;
  }

  /* Page title responsive styles are now in base.css */

  .card-header {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }

  .programme-details,
  .instructions-content {
    padding: 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .filter-select {
    min-width: unset;
    flex: 1;
  }
}

/* Animation Classes */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.programme-info-card,
.instructions-card {
  animation: slideInUp 0.6s ease-out;
}

.instructions-card {
  animation-delay: 0.2s;
}
</style>
