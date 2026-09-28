<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWorkoutStore } from '~/stores/workout';

const route = useRoute();
const router = useRouter();
const workoutStore = useWorkoutStore();

const userName = route.params.userName;
const exerciseId = route.params.exerciseId;

const currentWorkout = ref();
const isModalOpen = ref(false);
const formValues = ref<{ [key: string]: boolean }>({});

function validateForm() {
  const isValid = Object.keys(formValues.value).every((key) => formValues.value[key]);

  if (isValid) {
    submitWorkout();
  } else {
    isModalOpen.value = true;
  }
}

function submitWorkout() {
  let localWorkoutIds = localStorage.getItem('workoutData');
  if (localWorkoutIds) {
    const workoutIds = JSON.parse(localWorkoutIds);
    workoutIds.push(Number(exerciseId));
    localStorage.setItem('workoutData', JSON.stringify(workoutIds));
  } else {
    localStorage.setItem('workoutData', JSON.stringify([Number(exerciseId)]));
  }
  router.push(`/${userName}`);
}

onMounted(async () => {
  if (!userName || !exerciseId) router.push('/404');
  
  const workoutData = await workoutStore.fetchWorkoutById(Number(exerciseId));

  if (!workoutData) {
    router.push(`/${userName}`);
    return;
  }

  const mappedExercises = workoutData.exercises.map((ex: any) => ({
    id: ex.id,
    name: ex.exercise?.name || 'Exercício Desconhecido',
    sets: ex.sets,
    reps: ex.reps,
    obs: ex.observation,
    weight: ex.weight,
  }));

  mappedExercises.forEach((_: any, idx: number) => {
    formValues.value[`item${idx}`] = false;
  });

  currentWorkout.value = {
    ...workoutData,
    exercises: mappedExercises,
  };
});

function handleUpdateWeight(exerciseId: number, weight: string) {
  if (currentWorkout.value) {
    const ex = currentWorkout.value.exercises.find((e: any) => e.id === exerciseId);
    if (ex) ex.weight = weight;
  }
}
</script>

<template>
  <div class="flex items-center flex-col gap-8 px-5 py-10 min-h-screen">
    <Modal
      v-model="isModalOpen"
      title="Atenção"
      useConfirm
      @confirm="submitWorkout"
    >
      <span class="text-lg"> Alguns exercicios não foram concluidos, tem certeza que deseja finalizar o treino? </span>
    </Modal>

    <div class="flex flex-col w-full max-w-desktop gap-5">
      <NuxtLink
        :href="`/${userName}`"
        class="flex gap-2 bg-white/70 md:p-6 rounded-2xl items-center"
      >
        <div class="w-6 flex items-center h-8">
          <ArrowLeft />
        </div>
        <div v-if="workoutStore.isLoading" class="h-6 animate-pulse bg-gray-200 rounded-md w-full"></div>
        <h1 v-else class="text-secondary font-semibold line-clamp-2 text-2xl text-wrap">{{ currentWorkout?.name }}</h1>
      </NuxtLink>

      <div class="flex flex-1 flex-col gap-3 md:bg-white/70 md:p-6 rounded-2xl">
        <template v-if="workoutStore.isLoading">
          <ItemWorkoutSkeleton v-for="i in 4" :key="i" />
        </template>
        <template v-else>
          <ItemWorkout
            v-for="(exercise, idx) in currentWorkout?.exercises"
            v-model="formValues[`item${idx}`]"
            :key="exercise.name"
            :exercise="exercise"
            @updateWeight="handleUpdateWeight"
          />
        </template>
      </div>
      <Button @click="validateForm"> FINALIZAR TREINO </Button>
    </div>
  </div>
</template>
