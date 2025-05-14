<template>
  <div class="flex items-center justify-between">
    <h1 class="head-title">Dashboard</h1>
    <div class="flex items-center gap-4">
      <Select
        size="large"
        :modelValue="selectedSession"
        :options="sessions"
        optionLabel="name"
        placeholder="Select Session"
        class="card w-[300px]"
        @update:modelValue="handleSessionChange"
      />

      <Select
        size="large"
        :modelValue="selectedSemester"
        :options="semesters"
        optionLabel="title"
        placeholder="Select Semester"
        class="card w-[300px]"
        :disabled="!selectedSession"
        @update:modelValue="handleSemesterChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Select from 'primevue/select';

interface AcademicSession {
  id: number | string;
  name: string;
  semesters: Semester[];
}

interface Semester {
  id: number | string;
  title: string;
}

const props = defineProps<{
  sessions: AcademicSession[];
  selectedSession: AcademicSession | null;
  selectedSemester: Semester | null;
}>();

const emit = defineEmits<{
  (e: 'update:selectedSession', value: AcademicSession | null): void;
  (e: 'update:selectedSemester', value: Semester | null): void;
}>();

const semesters = ref<Semester[]>([]);

// Handle session change
const handleSessionChange = (session: AcademicSession | null) => {
  semesters.value = session?.semesters || [];
  emit('update:selectedSession', session);
  emit('update:selectedSemester', null); // Reset semester when session changes
};

// Handle semester change
const handleSemesterChange = (semester: Semester | null) => {
  emit('update:selectedSemester', semester);
};

// Watch for external changes to selectedSession
watch(() => props.selectedSession, (session) => {
  semesters.value = session?.semesters || [];
}, { immediate: true });
</script>
