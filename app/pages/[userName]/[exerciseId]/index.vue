<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import database from '~/states/data.workout.json';

const route = useRoute();
const router = useRouter();

const userName = route.params.userName;
const exerciseId = route.params.exerciseId;

const currentWorkout = ref();
const isModalOpen = ref(false);
const formValues = ref<{ [key: string]: boolean }>({});

const validateForm = () => {
  const isValid = Object.keys(formValues.value).every((key) => formValues.value[key]);

  if (isValid) {
    submitWorkout();
  } else {
    isModalOpen.value = true;
  }
};

const submitWorkout = () => {
  let localWorkoutIds = localStorage.getItem('workoutData');
  if (localWorkoutIds) {
    const workoutIds = JSON.parse(localWorkoutIds);
    workoutIds.push(Number(exerciseId));
    localStorage.setItem('workoutData', JSON.stringify(workoutIds));
  } else {
    localStorage.setItem('workoutData', JSON.stringify([Number(exerciseId)]));
  }
  router.push(`/${userName}`);
};

onMounted(() => {
  if (!userName || !exerciseId) router.push('/404');

  const findUserData = database?.find((workT) => workT.userName === userName);
  if (!findUserData) router.push('/404');

  const workoutData = findUserData?.workouts.find((w) => w.id === Number(exerciseId));
  if (!workoutData) router.push('/404');

  workoutData?.exercises.forEach((_, idx) => {
    formValues.value[`item${idx}`] = false;
  });

  currentWorkout.value = workoutData;
});
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
        class="flex gap-2 md:bg-white/70 md:p-6 rounded-2xl items-center"
      >
        <div class="w-6 flex items-center h-8">
          <ArrowLeft />
        </div>
        <h1 class="text-secondary font-semibold line-clamp-2 text-2xl text-wrap">{{ currentWorkout?.name }}</h1>
      </NuxtLink>

      <div class="flex flex-1 flex-col gap-3 md:bg-white/70 md:p-6 rounded-2xl">
        <ItemWorkout
          v-for="(exercise, idx) in currentWorkout?.exercises"
          v-model="formValues[`item${idx}`]"
          :key="exercise.name"
          :exercise="exercise"
        />
      </div>
      <Button @click="validateForm"> FINALIZAR TREINO </Button>
    </div>
  </div>
</template>
