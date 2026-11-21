<script lang="ts" setup>
import type { PersonalStudentMock } from '~/states/mockPersonalStudents';

defineProps<{
  students: PersonalStudentMock[];
  totalCount: number;
  searchQuery: string;
  isLoading?: boolean;
}>();

const emits = defineEmits<{
  (e: 'clearSearch'): void;
}>();
</script>

<template>
  <section class="bg-white p-6 rounded-2xl shadow-custom border border-gray-600 flex-1 flex flex-col gap-5">
    <div class="flex items-center justify-between gap-2">
      <h2 class="text-secondary font-semibold text-2xl">Alunos</h2>
      <div
        v-if="isLoading"
        class="h-4 w-44 bg-gray-200 rounded-md animate-pulse"
      />
      <span
        v-else
        data-testId="students-counter"
        class="text-gray-700 text-sm font-medium"
      >
        Exibindo {{ students.length }} de {{ totalCount }} alunos
      </span>
    </div>

    <div
      v-if="isLoading"
      data-testId="students-loading-state"
      class="flex flex-col gap-5"
    >
      <StudentCardSkeleton
        v-for="i in 4"
        :key="i"
      />
    </div>

    <div
      v-else-if="students.length > 0"
      data-testId="students-list"
      class="grid grid-cols-2 gap-5"
    >
      <StudentCard
        v-for="student in students"
        :key="student.id"
        :student="student"
      />
    </div>

    <StudentsEmptyState
      v-else
      :searchQuery="searchQuery"
      @clear="emits('clearSearch')"
    />
  </section>
</template>
