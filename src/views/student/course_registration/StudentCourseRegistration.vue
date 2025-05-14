<template>
  <div class="flex flex-col gap-6">
    <h1 class="head-title">Course Registration</h1>
    <div
      class="lg:col-span-7 bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <Ta-bs v-model:value="tabCount" class="h-full flex flex-col">
        <TabList class="flex border-b border-gray-200">
          <T-ab v-for="(tab, index) in tabs" :key="index" :value="index.toString()"
            class="px-6 py-3  text-sm font-medium h-[5rem] relative transition-all duration-200" :class="{
              'text-primary-500': tabCount === index.toString(),
              'text-gray-500 hover:text-gray-700': tabCount !== index.toString()
            }">
            {{ tab.label }}
            <span v-if="tabCount === index.toString()"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 animate-underline"></span>
          </T-ab>
        </TabList>

        <TabPanels class="flex-1 overflow-auto p-6">
          <transition-group name="fade-slide" mode="out-in">
            <TabPanel v-for="(tab, index) in tabs" :key="index" :value="index.toString()" class="h-full">
              <component :is="tab.component" />
            </TabPanel>
          </transition-group>
        </TabPanels>
      </Ta-bs>
    </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue';
import CourseRegistration from './CourseRegistration.vue';
import CourseRegistrationForm from './CourseRegistrationForm.vue';
import { useStudentCourses } from '@/services/student/useStudentCourses';
const { fetchAllCoursesForStudent } = useStudentCourses();

const tabCount = ref<string>('0')

const tabs = [
  { label: 'Registration', component: CourseRegistration },
  { label: 'Forms', component: CourseRegistrationForm },
];


// fetch data immediately the component mounted
onMounted(async () => {
  await fetchAllCoursesForStudent('', '', '');
})



</script>
