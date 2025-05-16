<template>
  <div class="flex flex-col gap-6">
    <!-- Filter Section -->
    <div class="bg-white flex flex-col md:flex-row justify-between gap-4 p-6 rounded-xl shadow-sm">
      <Sel-ect
        :options="sessionOptions"
        optionLabel="name"
        :size="'large'"
        :placeholder="sessionPlaceholder"
        :modelValue="selectedSession"
        @update:modelValue="(value: string | null) => $emit('update:selectedSession', value)"
        class="card w-full"
      />
      <Sel-ect
        :options="semesterOptions"
        optionLabel="title"
        :size="'large'"
        :placeholder="semesterPlaceholder"
        :modelValue="selectedSemester"
        @update:modelValue="(value: string | null) => $emit('update:selectedSemester', value)"
        class="card w-full"
      />
      <div class="w-full relative">
        <InputText
          class="flex-1 w-full h-full"
          :placeholder="searchPlaceholder"
          :modelValue="searchQuery"
          @update:modelValue="(value: string) => $emit('update:searchQuery', value)"
        />
        <span class="absolute top-3 right-3 text-gray-400">
          <i class="pi pi-search"></i>
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="courseLoading" class="relative">
      <SpinningAnimation :loading="courseLoading" />
    </div>

    <EmptyData
      v-else-if="
        (!registeredCourses || registeredCourses?.length === 0) &&
        (!courseList || courseList?.length === 0) &&
        !courseLoading
      "
      :emptyMessage="emptyStateMessage"
    />

    <!-- <div
      v-if="(!registeredCourses || registeredCourses?.length === 0) && (!courseList || courseList?.length === 0) && !courseLoading"
      class="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center justify-center h-64">
      <i class="pi pi-book text-4xl text-gray-300 mb-3"></i>
      <h2 class="text-xl font-medium text-gray-500">{{ emptyStateMessage }}</h2>
      <p class="text-gray-400 mt-1 text-sm">Try changing your filters</p>
    </div> -->

    <!-- Course List -->
    <div v-else class="flex w-full gap-12">
      <div v-if="!courseLoading" class="w-full">
        <h2>Available Courses</h2>
        <div class="flex items-center">
          <div class="bg-white rounded-xl shadow-sm overflow-hidden flex-1">
            <div class="grid grid-cols-1 divide-y divide-gray-100">
              <div name="list">
                <div
                  v-for="course in courseList"
                  :key="course.id"
                  class="group hover:bg-gray-50 transition-colors duration-200"
                  :class="{ 'bg-blue-50': course.selected }"
                >
                  <div class="flex items-center p-4">
                    <div class="mr-4 flex-shrink-0"></div>
                    <div class="flex-1 min-w-0">
                      <div class="flex justify-between items-baseline">
                        <div class="flex items-center gap-4">
                          <Check-box
                            v-model="course.selected"
                            :binary="true"
                            @change="handleRegistredCoursesCheckboxChange(course)"
                            class="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <div>
                            <h3 class="text-lg font-semibold text-gray-800">
                              {{ course.courseCode }}
                            </h3>
                            <p class="text-gray-600 text-sm mt-1">{{ course.title }}</p>
                          </div>
                        </div>
                        <span
                          class="ml-2 text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full"
                        >
                          {{ course.creditUnit }} Credit Unit
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Summary Footer -->
            <div
              v-if="selectedCount > 0"
              class="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-200"
            >
              <div class="text-sm text-gray-500">
                {{ selectedCount }} of {{ registeredCourses.length }} selected
              </div>
              <Button
                label="Register Selected"
                icon="pi pi-send"
                class="p-button-sm"
                @click="handleRegistration"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- REGISTRED COURSE -->
      <div v-if="!courseLoading" class="w-full">
        <h1>Registered Courses</h1>
        <div class="bg-white rounded-xl shadow-sm overflow-hidden flex-1">
          <div class="grid grid-cols-1 divide-y divide-gray-100">
            <div name="list">
              <div
                v-for="course in registeredCourses"
                :key="course.id"
                class="group hover:bg-gray-50 transition-colors duration-200"
                :class="{ 'bg-blue-50': course.selected }"
              >
                <div class="flex items-center p-4">
                  <div class="mr-4 flex-shrink-0"></div>
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-baseline">
                      <div class="flex items-center gap-4">
                        <Check-box
                          v-model="course.selected"
                          :binary="true"
                          @change="handleCourseRemovalCheckBox(course)"
                          class="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div>
                          <h3 class="text-lg font-semibold text-gray-800">
                            {{ course.courseCode }}
                          </h3>
                          <p class="text-gray-600 text-sm mt-1">{{ course.title }}</p>
                        </div>
                      </div>
                      <span
                        class="ml-2 text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full"
                      >
                        {{ course.creditUnit }} Credit Units
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary Footer -->
          <div
            v-if="selectedCount > 0"
            class="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-200"
          >
            <div class="text-sm text-gray-500">
              {{ selectedCount }} of {{ registeredCourses.length }} selected
            </div>
            <Button
              label="Register Selected"
              icon="pi pi-send"
              class="p-button-sm"
              @click="handleRegistration"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EmptyData from '@/views/empty/EmptyData.vue'
import SpinningAnimation from '@/views/spinner/SpinningAnimation.vue'
import { computed, type PropType } from 'vue'

interface Course {
  id: number
  courseCode: string
  title: string
  creditUnit: number
  selected: boolean
}

const props = defineProps({
  courseLoading: {
    type: Boolean,
    default: false,
  },
  sessionOptions: {
    type: Array as PropType<{ name: string; value: string }[]>,
    default: () => [],
  },
  semesterOptions: {
    type: Array as PropType<{ name: string; value: string }[]>,
    default: () => [],
  },
  selectedSession: {
    type: String as PropType<string | null>,
    default: null,
  },
  selectedSemester: {
    type: String as PropType<string | null>,
    default: null,
  },
  searchQuery: {
    type: String,
    default: '',
  },
  sessionPlaceholder: {
    type: String,
    default: 'Select Session',
  },
  semesterPlaceholder: {
    type: String,
    default: 'Select Semester',
  },
  searchPlaceholder: {
    type: String,
    default: 'Search Course',
  },
  emptyStateMessage: {
    type: String,
    default: 'No courses available',
  },
  registeredCourses: {
    type: Array as PropType<Course[]>,
    required: true,
  },
  courseList: {
    type: Array as PropType<Course[]>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'update:selectedSession', value: string | null): void
  (e: 'update:selectedSemester', value: string | null): void
  (e: 'update:searchQuery', value: string): void
  (e: 'course-selected', course: Course): void
  (e: 'remove-selected', course: Course): void
  (e: 'register-selected', registeredCourses: Course[]): void
}>()

const selectedCount = computed(() => {
  return props.registeredCourses?.filter((c) => c.selected).length
})

const handleRegistredCoursesCheckboxChange = (course: Course) => {
  emit('course-selected', course)
}

const handleCourseRemovalCheckBox = (course: Course) => {
  emit('remove-selected', course)
}

const handleRegistration = () => {
  const selectedCourses = props.registeredCourses?.filter((c) => c.selected)
  emit('register-selected', selectedCourses)
}
</script>

<style scoped>
/* List transition */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Custom checkbox styling */
:deep(.p-checkbox .p-checkbox-box) {
  border-radius: 0.25rem;
  border-width: 1px;
  transition: all 0.2s ease;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

/* Button hover effect */
:deep(.p-button) {
  transition: all 0.2s ease;
}

:deep(.p-button:not(:disabled):hover) {
  transform: translateY(-1px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Credit unit badge */
.badge {
  transition: all 0.2s ease;
}
</style>
