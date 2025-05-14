<template>
  <div
    class="mx-auto w-full rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col gap-4"
  >
    <!-- Header Section with Animation -->
    <div
      class="bg-[#0D47A1] text-white rounded-xl p-4"
      v-motion="{
        initial: { opacity: 0, y: -20 },
        enter: { opacity: 1, y: 0, transition: { duration: 500 } },
      }"
    >
      <div class="flex justify-between px-6">
        <div class="flex flex-col gap-4">
          <div class="space-y-1">
            <p>Current Session:</p>
            <p class="font-bold text-lg animate-[pulse_2s_ease-in-out_infinite]">2025/2026</p>
          </div>
          <div class="mt-2">
            <p>Current Semester:</p>
            <p class="font-bold text-lg">Second</p>
          </div>
        </div>
        <Div-ider layout="vertical" />

        <div class="flex flex-col justify-between">
          <p>Payment Status</p>
          <p class="text-green-300">✓ Paid: 2024/2025</p>
          <p class="text-green-300">✓ Paid: 2025/2026</p>
        </div>
      </div>
    </div>

    <!-- Student Information Section -->
    <div class="p-4 bg-[#fff] h-full rounded-xl shadow-lg">
      <h2
        class="text-xl font-bold mb-4 sub-title"
        v-motion="{
          initial: { opacity: 0, x: -20 },
          enter: { opacity: 1, x: 0, transition: { duration: 500, delay: 100 } },
        }"
      >
        Student Information
      </h2>

      <div class="grid grid-cols-2 gap-4">
        <!-- State -->
        <div
          v-motion="{
            initial: { opacity: 0, y: 20 },
            enter: { opacity: 1, y: 0, transition: { duration: 500, delay: 200 } },
          }"
        >
          <label class="block text-[#BFBFBF] mb-1 text-sm">State</label>
          <InputText
            size="large"
            style="border: 1px solid #90caf9"
            :value="state"
            class="w-full"
            readonly
            :pt="{
              root: {
                class:
                  'border-[#90CAF9] hover:border-[#0D47A1] focus:border-[#0D47A1] focus:ring-2 focus:ring-[#90CAF9]/50 transition-all duration-300',
              },
            }"
          />
        </div>

        <!-- Local Government -->
        <div
          v-motion="{
            initial: { opacity: 0, y: 20 },
            enter: { opacity: 1, y: 0, transition: { duration: 500, delay: 250 } },
          }"
        >
          <label class="block text-[#BFBFBF] mb-1 text-sm">Local Government</label>
          <InputText
            size="large"
            style="border: 1px solid #90caf9"
            :value="localGovernment"
            class="w-full"
            readonly
            :pt="{
              root: {
                class:
                  'border-[#90CAF9] hover:border-[#0D47A1] focus:border-[#0D47A1] focus:ring-2 focus:ring-[#90CAF9]/50 transition-all duration-300',
              },
            }"
          />
        </div>

        <!-- Email -->
        <div
          v-motion="{
            initial: { opacity: 0, y: 20 },
            enter: { opacity: 1, y: 0, transition: { duration: 500, delay: 300 } },
          }"
        >
          <label class="block text-[#BFBFBF] mb-1 text-sm">Email</label>
          <InputText
            size="large"
            style="border: 1px solid #90caf9"
            :value="email"
            class="w-full"
            readonly
            :pt="{
              root: {
                class:
                  'border-[#90CAF9] hover:border-[#0D47A1] focus:border-[#0D47A1] focus:ring-2 focus:ring-[#90CAF9]/50 transition-all duration-300',
              },
            }"
          />
        </div>

        <!-- Phone -->
        <div
          v-motion="{
            initial: { opacity: 0, y: 20 },
            enter: { opacity: 1, y: 0, transition: { duration: 500, delay: 350 } },
          }"
        >
          <label class="block text-[#BFBFBF] mb-1 text-sm">Phone</label>
          <InputText
            size="large"
            style="border: 1px solid #90caf9"
            :value="phone"
            class="w-full"
            readonly
            :pt="{
              root: {
                class:
                  'border-[#90CAF9] hover:border-[#0D47A1] focus:border-[#0D47A1] focus:ring-2 focus:ring-[#90CAF9]/50 transition-all duration-300',
              },
            }"
          />
        </div>

        <!-- Level -->
        <div
          v-motion="{
            initial: { opacity: 0, y: 20 },
            enter: { opacity: 1, y: 0, transition: { duration: 500, delay: 400 } },
          }"
        >
          <label class="block text-[#BFBFBF] mb-1 text-sm">Level</label>
          <InputText
            size="large"
            style="border: 1px solid #90caf9"
            :value="level"
            class="w-full"
            readonly
            :pt="{
              root: {
                class:
                  'border-[#90CAF9] hover:border-[#0D47A1] focus:border-[#0D47A1] focus:ring-2 focus:ring-[#90CAF9]/50 transition-all duration-300',
              },
            }"
          />
        </div>

        <!-- Year of Admission -->
        <div
          v-motion="{
            initial: { opacity: 0, y: 20 },
            enter: { opacity: 1, y: 0, transition: { duration: 500, delay: 450 } },
          }"
        >
          <label class="block text-[#BFBFBF] mb-1 text-sm">Year of Admission</label>
          <InputText
            size="large"
            style="border: 1px solid #90caf9"
            :value="yearOfAdmission"
            class="w-full"
            readonly
            :pt="{
              root: {
                class:
                  'border-[#90CAF9] hover:border-[#0D47A1] focus:border-[#0D47A1] focus:ring-2 focus:ring-[#90CAF9]/50 transition-all duration-300',
              },
            }"
          />
        </div>

        <!-- Programme Type -->
        <div
          v-motion="{
            initial: { opacity: 0, y: 20 },
            enter: { opacity: 1, y: 0, transition: { duration: 500, delay: 500 } },
          }"
        >
          <label class="block text-[#BFBFBF] mb-1 text-sm">Programme Type</label>
          <InputText
            size="large"
            style="border: 1px solid #90caf9"
            :value="programmeType"
            class="w-full"
            readonly
            :pt="{
              root: {
                class:
                  'border-[#90CAF9] hover:border-[#0D47A1] focus:border-[#0D47A1] focus:ring-2 focus:ring-[#90CAF9]/50 transition-all duration-300',
              },
            }"
          />
        </div>

        <!-- Faculty -->
        <div
          v-motion="{
            initial: { opacity: 0, y: 20 },
            enter: { opacity: 1, y: 0, transition: { duration: 500, delay: 550 } },
          }"
        >
          <label class="block text-[#BFBFBF] mb-1 text-sm">Faculty</label>
          <InputText
            size="large"
            style="border: 1px solid #90caf9"
            :value="faculty"
            class="w-full"
            readonly
            :pt="{
              root: {
                class:
                  'border-[#90CAF9] hover:border-[#0D47A1] focus:border-[#0D47A1] focus:ring-2 focus:ring-[#90CAF9]/50 transition-all duration-300',
              },
            }"
          />
        </div>

        <!-- Department -->
        <div
          v-motion="{
            initial: { opacity: 0, y: 20 },
            enter: { opacity: 1, y: 0, transition: { duration: 500, delay: 600 } },
          }"
        >
          <label class="block text-[#BFBFBF] mb-1 text-sm">Department</label>
          <InputText
            size="large"
            style="border: 1px solid #90caf9"
            :value="department"
            class="w-full"
            readonly
            :pt="{
              root: {
                class:
                  'border-[#90CAF9] hover:border-[#0D47A1] focus:border-[#0D47A1] focus:ring-2 focus:ring-[#90CAF9]/50 transition-all duration-300',
              },
            }"
          />
        </div>

        <!-- Programme -->
        <div
          v-motion="{
            initial: { opacity: 0, y: 20 },
            enter: { opacity: 1, y: 0, transition: { duration: 500, delay: 650 } },
          }"
        >
          <label class="block text-[#BFBFBF] mb-1 text-sm">Programme</label>
          <InputText
            size="large"
            style="border: 1px solid #90caf9"
            :value="programme"
            class="w-full"
            readonly
            :pt="{
              root: {
                class:
                  'border-[#90CAF9] hover:border-[#0D47A1] focus:border-[#0D47A1] focus:ring-2 focus:ring-[#90CAF9]/50 transition-all duration-300',
              },
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'

/* interface StudentInformation {
  state: string
  localGovernment: string
  email: string
  phone: string
  level: string
  yearOfAdmission: string
  programmeType: string
  faculty: string
  department: string
  programme: string
} */

defineProps({
  state: String,
  localGovernment: String,
  email: String,
  phone: String,
  level: String,
  yearOfAdmission: String,
  programmeType: String,
  faculty: String,
  department: String,
  programme: String,
})
</script>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.sub-title {
  color: #0d47a1;
  border-bottom: 2px solid #90caf9;
  padding-bottom: 8px;
}
</style>
