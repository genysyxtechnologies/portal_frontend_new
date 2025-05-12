<template>
  <div class="w-full bg-[#fff] p-10 rounded-xl">

    <div class="flex items-center justify-between gap-8">
      <div>
        <img :src="profile" alt="profile" class=" scale-80">
      </div>
      <div class="grid grid-cols-3 flex-1 gap-8">
        <div class="flex flex-col">
          <span class="labels">Student ID</span>
          <InputText :placeholder="items.username" style="border: 1px solid #90CAF9;" />
        </div>
        <div class="flex flex-col">
          <span class="labels">Level</span>
          <InputText :placeholder="items.level.toString()" style="border: 1px solid #90CAF9;" />
        </div>
        <div class="flex flex-col">
          <span class="labels">Programme</span>
          <InputText :placeholder="items.programmee" style="border: 1px solid #90CAF9;" />
        </div>
        <div class="flex flex-col">
          <span class="labels">Department</span>
          <InputText :placeholder="items.department" style="border: 1px solid #90CAF9;" />
        </div>
        <div class="flex flex-col">
          <span class="labels">Faculty</span>
          <InputText :placeholder="items.faculty" style="border: 1px solid #90CAF9;" />
        </div>
        <div class="flex flex-col">
          <span class="labels">Session</span>
          <InputText :placeholder="items.session" style="border: 1px solid #90CAF9;" />
        </div>

      </div>

    </div>
    <!-- section 2 -->
    <Div-ider class="my-4 opacity-30 transition-all duration-500" style="height: 2px; background-color: #0D47A1;" />

    <div class="flex items-center justify-center gap-2">
      <img :src="warning" alt="warning" class=" scale-65">
      <h3 class="head-title labels" style="font-size: 20px;">Please select a session to proceed</h3>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import profile from '../../../assets/images/student/profile.png'
import warning from '../../../assets/images/student/accomodation/warning.png'

const items = ref({
  username: 'Najimuddeen Musa El-Wakil',
  level: 200,
  programmee: "Computer Science",
  department: "Computer Science",
  faculty: 'Natural and Applied Science',
  session: '2025/2026'
})
</script>
