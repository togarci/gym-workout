<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import database from '~/states/data.workout.json';

const route = useRoute();
const router = useRouter();

const userName = route.params.userName;
const exerciseId = route.params.exerciseId;

const dataWorkout = ref();
const formValues = ref<{ [key: string]: boolean }>({});

const isDisabledButton = ref(true);

const submitWorkout = () => {
  const localWorkout = localStorage.getItem('workoutData');
  if (localWorkout) {
    const storageWorkout = JSON.parse(localWorkout);
    storageWorkout.push(Number(exerciseId));
    localStorage.setItem('workoutData', JSON.stringify(storageWorkout));
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

  const findWorkout = database?.find((workT) => workT.userName === userName);
  if (!findWorkout) router.push('/404');

  const exercise = findWorkout?.workouts.find((w) => w.id === Number(exerciseId));
  if (!exercise) router.push('/404');

  exercise?.exercises.forEach((_, idx) => {
    formValues.value[`item${idx}`] = false;
  });

  dataWorkout.value = exercise;
});
</script>

<template>
  <div class="flex px-5 py-10 min-h-screen flex-col gap-8">
    <NuxtLink :href="`/${userName}`" class="flex gap-2 items-center">
      <ArrowLeft />
      <h1 class="text-secondary-900 font-semibold text-2xl text-wrap">{{ dataWorkout?.name }}</h1>
    </NuxtLink>

    <div class="flex flex-1 flex-col gap-3">
      <ItemWorkout
        v-for="(exercise, idx) in dataWorkout?.exercises"
        v-model="formValues[`item${idx}`]"
        :key="exercise.name"
        :exercise="exercise"
      />
    </div>

    <Button @click="submitWorkout" :disabled="isDisabledButton"> FINALIZAR TREINO </Button>
  </div>
</template>
