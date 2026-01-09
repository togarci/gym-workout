<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import database from '~/states/data.workout.json';

const route = useRoute();
const router = useRouter();

const userName = route.params.userName;
const exerciseId = route.params.exerciseId;

const currentWorkout = ref();
const formValues = ref<{ [key: string]: boolean }>({});

const isDisabledButton = ref(true);

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

watch(
  formValues,
  () => {
    isDisabledButton.value = !Object.keys(formValues.value).every((key: string) => formValues.value[key] === true);
  },
  { deep: true }
);

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
  <div class="flex px-5 py-10 min-h-screen flex-col gap-8">
    <NuxtLink :href="`/${userName}`" class="flex gap-2">
      <div class="w-6 flex items-center h-8">
        <ArrowLeft />
      </div>
      <h1 class="text-secondary font-semibold line-clamp-2 text-2xl text-wrap">{{ currentWorkout?.name }}</h1>
    </NuxtLink>

    <div class="flex flex-1 flex-col gap-3">
      <ItemWorkout
        v-for="(exercise, idx) in currentWorkout?.exercises"
        v-model="formValues[`item${idx}`]"
        :key="exercise.name"
        :exercise="exercise"
      />
    </div>

    <Button @click="submitWorkout" :disabled="isDisabledButton"> FINALIZAR TREINO </Button>
  </div>
</template>
