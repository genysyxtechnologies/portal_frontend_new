<template>
  <div class="flex flex-col gap-6">
    <!-- Modern Dashboard Header with Gradient -->
    <div
      class="rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
      :style="{
        background: `linear-gradient(to right, var(--primary-dark-color), var(--primary-light-color))`,
      }"
    >
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="bg-white/10 backdrop-blur-lg p-3 rounded-lg">
            <i class="pi pi-home text-white text-2xl"></i>
          </div>
          <div>
            <h1 class="text-white text-2xl font-bold">Student Dashboard</h1>
            <p class="text-blue-100 text-sm">Welcome back! Here's your academic overview</p>
          </div>
        </div>

        <div class="flex flex-col md:flex-row items-center gap-4">
          <div class="w-full md:w-auto">
            <Sel-ect
              :size="'large'"
              v-model="selectedSession"
              :options="sessions"
              optionLabel="name"
              placeholder="Select Session"
              class="w-full md:w-[180px]"
              :pt="{
                root: { class: 'bg-white/90 backdrop-blur-sm border-none rounded-lg shadow-sm' },
                input: { class: 'font-medium text-gray-700' },
              }"
              disabled
            />
          </div>

          <div class="w-full md:w-auto">
            <Sel-ect
              :size="'large'"
              v-model="selectedSemester"
              :options="semesters"
              optionLabel="title"
              placeholder="Select Semester"
              class="w-full md:w-[180px]"
              :pt="{
                root: { class: 'bg-white/90 backdrop-blur-sm border-none rounded-lg shadow-sm' },
                input: { class: 'font-medium text-gray-700' },
              }"
              disabled
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div
      class="grid grid-cols-1 md:grid-cols-3 gap-4"
      v-motion="{
        initial: { opacity: 0, y: 20 },
        enter: { opacity: 1, y: 0, transition: { duration: 500, stagger: 100 } },
      }"
    >
      <!-- GPA Card -->
      <div
        class="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border-l-4"
        :style="{ borderLeftColor: 'var(--primary-light-color)' }"
      >
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-gray-500 text-sm">Current CGPA</h3>
            <p class="text-2xl font-bold text-gray-800">
              {{ studentResult?.data?.current?.cgpa || 'NOT AVAILABLE' }}
            </p>
          </div>
          <div
            class="p-3 rounded-full"
            :style="{ backgroundColor: 'rgba(var(--primary-color-rgb), 0.1)' }"
          >
            <i class="pi pi-chart-line text-xl" :style="{ color: 'var(--primary-color)' }"></i>
          </div>
        </div>
        <div class="mt-4">
          <div class="flex justify-between text-sm mb-1">
            <span class="text-gray-500">Progress</span>
            <span class="text-gray-800 font-medium"
              >{{ Math.floor((parseFloat(studentResult?.data?.current?.cgpa!) / 5) * 100 || 0) }} %
            </span>
          </div>
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full"
              :style="{
                backgroundColor: 'var(--primary-light-color)',
                width: `${(parseFloat(studentResult?.data?.current?.cgpa!) / 5) * 100 || 0}%`,
              }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Courses Card -->
      <div
        class="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#4CAF50]"
      >
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-gray-500 text-sm">Registered Courses</h3>
            <p class="text-2xl font-bold text-gray-800">
              {{ courses?.registeredCourses?.length || '0' }}
            </p>
          </div>
          <div class="bg-green-50 p-3 rounded-full">
            <i class="pi pi-book text-[#4CAF50] text-xl"></i>
          </div>
        </div>
        <div class="mt-4">
          <div class="flex justify-between text-sm mb-1">
            <span class="text-gray-500">Credit Units</span>
            <span class="text-gray-800 font-medium">{{
              courses?.registeredCourses?.reduce((total, course) => total + course.creditUnit, 0) ||
              '0'
            }}</span>
          </div>
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-[#4CAF50] rounded-full"
              :style="{
                width: `${
                  (courses?.registeredCourses?.reduce(
                    (total, course) => total + course.creditUnit,
                    0,
                  ) || 0) / 150
                }%`,
              }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Fees Card -->
      <div
        class="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#FF9800]"
      >
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-gray-500 text-sm">Payment Status</h3>
            <p class="text-2xl font-bold text-gray-800">Completed</p>
          </div>
          <div class="bg-orange-50 p-3 rounded-full">
            <i class="pi pi-wallet text-[#FF9800] text-xl"></i>
          </div>
        </div>
        <div class="mt-4">
          <Tag severity="success" rounded class="text-xs px-2">
            <i class="pi pi-check-circle mr-1"></i>
            <span>Current Session Paid</span>
          </Tag>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Student Profile Card -->
      <div
        class="lg:col-span-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        v-motion="{
          initial: { opacity: 0, x: -20 },
          enter: { opacity: 1, x: 0, transition: { duration: 500 } },
        }"
      >
        <div
          class="p-6"
          :style="{
            background: `linear-gradient(135deg, var(--primary-dark-color), var(--primary-light-color))`,
          }"
        >
          <div class="flex justify-center">
            <div class="relative">
              <div
                class="w-24 h-24 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center p-1 border-2 border-white/50"
              >
                <img :src="profile" alt="profile" class="w-full h-full rounded-full object-cover shadow-inner" />
              </div>
              <div
                class="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-2 border-white shadow-md"
              >
                <i class="pi pi-check-circle text-white"></i>
              </div>
            </div>
          </div>
          <div class="text-center mt-4 text-white">
            <h2 class="font-bold text-xl tracking-wide">{{ user?.name || 'Student Name' }}</h2>
            <p class="text-blue-100 text-sm backdrop-blur-sm bg-white/10 rounded-full px-3 py-1 inline-block mt-1">{{ user?.username || '00' }}</p>
          </div>
        </div>

        <!-- Student Info List -->
        <div class="p-6">
          <h3 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <i class="pi pi-user-edit text-primary-500"></i>
            <span>Student Information</span>
          </h3>

          <div class="space-y-4">
            <div class="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
              <div
                class="p-2 rounded-lg shadow-sm"
                :style="{ backgroundColor: 'rgba(var(--primary-color-rgb), 0.1)' }"
              >
                <i class="pi pi-id-card" :style="{ color: 'var(--primary-color)' }"></i>
              </div>
              <div>
                <p class="text-gray-500 text-xs font-medium">Level</p>
                <p class="font-medium text-gray-800">{{ user?.level.title || '100 Level' }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
              <div
                class="p-2 rounded-lg shadow-sm"
                :style="{ backgroundColor: 'rgba(var(--primary-color-rgb), 0.1)' }"
              >
                <i class="pi pi-envelope" :style="{ color: 'var(--primary-color)' }"></i>
              </div>
              <div>
                <p class="text-gray-500 text-xs font-medium">Email</p>
                <p class="font-medium text-gray-800">{{ user?.email || 'student@example.com' }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
              <div
                class="p-2 rounded-lg shadow-sm"
                :style="{ backgroundColor: 'rgba(var(--primary-color-rgb), 0.1)' }"
              >
                <i class="pi pi-phone" :style="{ color: 'var(--primary-color)' }"></i>
              </div>
              <div>
                <p class="text-gray-500 text-xs font-medium">Phone</p>
                <p class="font-medium text-gray-800">{{ user?.phone || '+234 000 0000 000' }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
              <div
                class="p-2 rounded-lg shadow-sm"
                :style="{ backgroundColor: 'rgba(var(--primary-color-rgb), 0.1)' }"
              >
                <i class="pi pi-building" :style="{ color: 'var(--primary-color)' }"></i>
              </div>
              <div>
                <p class="text-gray-500 text-xs font-medium">Department</p>
                <p class="font-medium text-gray-800">
                  {{ user?.programme.department.name || 'Computer Science' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Academic Details Card -->
      <div
        class="lg:col-span-8"
        v-motion="{
          initial: { opacity: 0, x: 20 },
          enter: { opacity: 1, x: 0, transition: { duration: 500 } },
        }"
      >
        <SpinningAnimation v-if="loading" :loading="loading" />
        <div v-else class="bg-white rounded-xl shadow-md p-6">
          <h3 class="font-semibold text-gray-800 mb-6 pb-2 border-b">Academic Information</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-gray-500 text-sm mb-1">State</label>
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p class="font-medium text-gray-800">
                    {{ user?.information.state.name || 'State' }}
                  </p>
                </div>
              </div>

              <div>
                <label class="block text-gray-500 text-sm mb-1">Local Government</label>
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p class="font-medium text-gray-800">{{ user?.information.lga.name || 'LGA' }}</p>
                </div>
              </div>

              <div>
                <label class="block text-gray-500 text-sm mb-1">Year of Admission</label>
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p class="font-medium text-gray-800">
                    {{ user?.yearOfAdmission.name || '2025' }}
                  </p>
                </div>
              </div>

              <div>
                <label class="block text-gray-500 text-sm mb-1">Programme Type</label>
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p class="font-medium text-gray-800">
                    {{ user?.programme.programmeType.name || 'Undergraduate' }}
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-gray-500 text-sm mb-1">Faculty</label>
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p class="font-medium text-gray-800">
                    {{ user?.programme.department.faculty.name || 'Science' }}
                  </p>
                </div>
              </div>

              <div>
                <label class="block text-gray-500 text-sm mb-1">Department</label>
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p class="font-medium text-gray-800">
                    {{ user?.programme.department.name || 'Computer Science' }}
                  </p>
                </div>
              </div>

              <div>
                <label class="block text-gray-500 text-sm mb-1">Programme</label>
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p class="font-medium text-gray-800">
                    {{ user?.programme.name || 'B.Sc Computer Science' }}
                  </p>
                </div>
              </div>

              <div>
                <label class="block text-gray-500 text-sm mb-1">Current Status</label>
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <Badge value="Active" severity="success" class="px-3 py-1"></Badge>
                </div>
              </div>
            </div>
          </div>

          <!-- Current Session Information -->
          <div class="mt-6 pt-4 border-t">
            <h4 class="font-medium text-gray-800 mb-4">Current Academic Status</h4>

            <div
              class="rounded-lg p-4 border"
              :style="{
                backgroundColor: 'rgba(var(--primary-color-rgb), 0.05)',
                borderColor: 'var(--primary-light-color)',
              }"
            >
              <div class="flex flex-col md:flex-row justify-between">
                <div class="mb-4 md:mb-0">
                  <p class="text-gray-500 text-sm">Current Session</p>
                  <p class="font-semibold text-gray-800">{{ currentSession }}</p>
                </div>

                <div class="mb-4 md:mb-0">
                  <p class="text-gray-500 text-sm">Current Semester</p>
                  <p class="font-semibold text-gray-800">{{ currentSemester }}</p>
                </div>

                <div>
                  <p class="text-gray-500 text-sm">Registration Status</p>
                  <div class="flex items-center gap-2 mt-1">
                    <Badge value="Registered" severity="success"></Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useStudentDashboard } from '@/services/student/useStudentDashboard'
import SpinningAnimation from '@/views/spinner/SpinningAnimation.vue'
import profile from '../../../assets/images/student/profile.png'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'
import { useStudentResult } from '@/services/student/useStudentResult'
import { useStudentCourses } from '@/services/student/useStudentCourses'

const { user, getStudentInformation, getSessions, sessions, loading } = useStudentDashboard()
const { fetchStudentResult, studentResult } = useStudentResult()
const { fetchAllCoursesForStudent, courses } = useStudentCourses()
const selectedSession = ref()
const selectedSemester = ref()
const currentSession = ref<string>('')
const currentSemester = ref<string>('')
const semesters = ref([])

onMounted(async () => {
  await getStudentInformation()
  await getSessions()
  if (
    sessions.value &&
    sessions.value.length > 0 &&
    sessions.value[sessions.value.length - 1].currentSemesters?.length > 0
  ) {
    await Promise.all([
      fetchStudentResult(
        user.value?.username!,
        sessions.value[sessions.value.length - 1].id,
        sessions.value[sessions.value.length - 1]?.currentSemesters[0]?.id,
      ),
      fetchAllCoursesForStudent(
        user.value?.username!,
        sessions.value[sessions.value.length - 1].id.toString(),
        sessions.value[sessions.value.length - 1]?.currentSemesters[0]?.id.toString(),
      ),
    ])
    currentSession.value = sessions.value[sessions.value.length - 1].name
    currentSemester.value = sessions.value[sessions.value.length - 1]?.currentSemesters[0]?.title
  }
})

watch(
  () => selectedSession.value,
  (value) => {
    if (value && value.semesters) {
      semesters.value = value.semesters
    }
  },
)

watch(
  () => [selectedSession.value, selectedSemester.value],
  ([session, semester]) => {
    if (session && semester) {
      console.log(session.id, semester.id)
    }
  },
)
</script>

<style scoped></style>
