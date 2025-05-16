<template>
  <div class="w-full bg-[#fff] p-10 rounded-xl">
    <div class="flex items-center justify-between gap-8">
      <div>
        <img :src="profile" alt="profile" class="scale-80" />
      </div>
      <div class="grid grid-cols-3 flex-1 gap-8">
        <div class="flex flex-col">
          <span class="labels">Student ID</span>
          <InputText :placeholder="items.username" style="border: 1px solid #90caf9" />
        </div>
        <div class="flex flex-col">
          <span class="labels">Level</span>
          <InputText :placeholder="items.level.toString()" style="border: 1px solid #90caf9" />
        </div>
        <div class="flex flex-col">
          <span class="labels">Programme</span>
          <InputText :placeholder="items.programmee" style="border: 1px solid #90caf9" />
        </div>
        <div class="flex flex-col">
          <span class="labels">Department</span>
          <InputText :placeholder="items.department" style="border: 1px solid #90caf9" />
        </div>
        <div class="flex flex-col">
          <span class="labels">Faculty</span>
          <InputText :placeholder="items.faculty" style="border: 1px solid #90caf9" />
        </div>
        <div class="flex flex-col">
          <span class="labels">Session</span>
          <InputText :placeholder="items.session" style="border: 1px solid #90caf9" />
        </div>
      </div>
    </div>
    <!-- section 2 -->
    <div class="flex flex-col gap-12">
      <div class="ring-2 ring-[#0D47A1] p-4 rounded-xl flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 primary-cl">
            <h2 class="text-lg font-bold">Hostel Application</h2>
            <span>(Dec 10, 2024 - Jan 31, 2025)</span>
          </div>
          <ReUsableButtons :label="'Open'" class="h-9 w-28" />
        </div>
        <ProgressBar :value="progress" class="mt-4"></ProgressBar>

        <div class="flex justify-between mt-4">
          <div v-for="step in applicationSteps" :key="step.name">
            <span :class="step.status === 'current' ? 'primary-cl font-bold' : 'labels'">
              {{ step.name }}
            </span>
          </div>
        </div>
      </div>
      <div>
        <ReUsableButtons :label="'Start Application'" class="float-end" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import profile from '../../../assets/images/student/profile.png'
import ReUsableButtons from '@/views/buttons/ReUsableButtons.vue'

const items = ref({
  username: 'Najimuddeen Musa El-Wakil',
  level: 200,
  programmee: 'Computer Science',
  department: 'Computer Science',
  faculty: 'Natural and Applied Science',
  session: '2025/2026',
})

interface Step {
  name: string
  status: 'completed' | 'current' | 'upcoming'
}

const applicationSteps = ref<Step[]>([
  { name: 'Start', status: 'current' },
  { name: 'Interest', status: 'upcoming' },
  { name: 'Allocation', status: 'upcoming' },
  { name: 'Acceptance', status: 'upcoming' },
])

const progress = ref(25) // Assuming progress moves in steps
</script>
