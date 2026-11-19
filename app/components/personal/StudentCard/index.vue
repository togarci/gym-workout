<script lang="ts" setup>
import type { PersonalStudentMock } from '~/states/mockPersonalStudents';

defineProps<{
  student: PersonalStudentMock;
}>();
</script>

<template>
  <NuxtLink
    :href="`/${student.userName}`"
    data-testId="student-card"
    class="rounded-2xl relative shadow-custom bg-white p-5 flex flex-col justify-between gap-4 border border-primary transition-colors"
  >
    <div class="flex items-center gap-3 min-w-0">
      <div class="flex items-center justify-center size-10 rounded-xl bg-gray-500 shrink-0">
        <FitSVG className="size-6 fill-primary" />
      </div>
      <div class="flex flex-col min-w-0">
        <h3
          data-testId="student-name"
          class="text-xl font-semibold text-secondary truncate"
        >
          {{ student.name }}
        </h3>
        <span
          data-testId="student-username"
          class="text-gray-700 text-sm truncate"
        >
          @{{ student.userName }}
        </span>
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <span class="text-gray-700 text-sm truncate">{{ student.email }}</span>
      <span
        v-if="student.lastWorkout"
        data-testId="student-last-workout"
        class="text-secondary text-sm font-medium truncate"
      >
        Último treino: {{ student.lastWorkout }}
      </span>
      <span
        v-else
        class="text-gray-700 text-sm italic"
      >
        Nenhum treino atribuído
      </span>
    </div>

    <div class="pt-3 border-t border-gray-600 flex items-center justify-between">
      <span
        data-testId="student-workouts-count"
        class="text-secondary font-semibold text-sm"
      >
        Treinos: {{ student.workoutsCount }}
      </span>
      <span class="text-primary font-bold text-sm">Ver perfil →</span>
    </div>
  </NuxtLink>
</template>
