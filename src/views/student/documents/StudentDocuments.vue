<template>
  <div class="min-h-screen p-6 animate-fadeIn">
    <!-- Header Section with Animation -->
    <div class="relative mb-8 overflow-hidden">
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-blue-500/20 rounded-xl blur-xl transform animate-pulse-slow">
      </div>
      <div class="relative backdrop-blur-sm p-6 rounded-xl shadow-lg border border-blue-100/20" :style="{
        background: `linear-gradient(to right, var(--primary-dark-color), var(--primary-light-color))`
      }">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="relative">

              <h1 style="color: white;" class="head-title text-[#fff] text-2xl font-bold relative group">
                Documents
                <div
                  class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left">
                </div>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Documents Section with Staggered Animation -->
    <div class="relative transform hover:scale-[1.01] transition-all duration-500">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-100/10 to-blue-300/10 rounded-xl blur-lg"></div>
      <DocumentComponent class="relative z-10 transform transition-all duration-500"
        @download-admission-letter="downloadStudentAdmissionLetter(user?.registrationNumber!)"
        @download-application-summary="downloadStudentApplicationSummary(user?.registrationNumber!)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import DocumentComponent from './DocumentComponent.vue'
import { useStudentDashboard } from '@/services/student/useStudentDashboard'
import { onMounted } from 'vue'
import { useStudentDocument } from '@/services/student/useStudentDocuments'

const { user, getStudentInformation } = useStudentDashboard()
const { downloadStudentAdmissionLetter, downloadStudentApplicationSummary, fetchStudentDocuments } = useStudentDocument()

onMounted(async () => {
  await getStudentInformation()
  if (user.value?.registrationNumber) {
    await fetchStudentDocuments(user.value.programme.programmeType.id)
  }
})
</script>

<style scoped>
/* Fade In Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.8s ease-out forwards;
}

/* Slow Pulse Animation */
@keyframes pulse-slow {

  0%,
  100% {
    opacity: 0.4;
  }

  50% {
    opacity: 0.7;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Slow Ping Animation */
@keyframes ping-slow {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }

  50% {
    transform: scale(1);
    opacity: 0.25;
  }

  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
}

.animate-ping-slow {
  animation: ping-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Hover Effects */
.head-title {
  position: relative;
  display: inline-block;
  transition: all 0.3s ease;
}

.head-title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, #3B82F6, #60A5FA);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.head-title:hover::after {
  transform: scaleX(1);
}

/* Card Hover Effects */
.document-card {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.document-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
