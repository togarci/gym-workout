<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import database from '~/states/data.workout.json';
import type { DatabaseTypes } from '~/states/type';

const route = useRoute();
const router = useRouter();
const userName = route.params.userName;

const selectedDataUser = ref<DatabaseTypes>();
const allWorkoutIdsDone = ref<Array<number>>([]);
const nextWorkoutId = computed(
  () => selectedDataUser.value?.workouts.find((workout) => !allWorkoutIdsDone.value.includes(workout.id))?.id
);

const resetWorkoutOnAllComplete = () => {
  if (selectedDataUser.value?.workouts.every((item) => allWorkoutIdsDone.value.includes(item.id))) {
    allWorkoutIdsDone.value = [];
    localStorage.removeItem('workoutData');
  }
};

const getDataByLocalStorage = () => {
  const localData = localStorage.getItem('workoutData');
  if (localData) {
    allWorkoutIdsDone.value = JSON.parse(localData);
    resetWorkoutOnAllComplete();
  } else {
    allWorkoutIdsDone.value = [];
  }
};

const logout = () => {
  localStorage.removeItem('userName');
  const userNameCookie = useCookie('userName');
  userNameCookie.value = '';
  router.push('/');
};

onMounted(() => {
  if (!userName) router.push('/404');

  const findWorkout = database?.find((workT) => workT.userName === userName);
  if (!findWorkout) router.push('/404');

  selectedDataUser.value = findWorkout;
  getDataByLocalStorage();
});
</script>

<template>
  <div class="flex px-5 py-10 min-h-screen flex-col gap-8">
    <div class="flex w-full justify-between items-center">
      <h1 class="text-secondary font-semibold text-3xl text-wrap line-clamp-1">Olá, {{ userName }} 🏋️‍♂️</h1>
      <Button @click="logout" variant="secondary" size="sm">Sair</Button>
    </div>

    <div class="flex-1 flex flex-col gap-5">
      <SelectWorkout
        v-for="workout in selectedDataUser?.workouts"
        :key="workout.name"
        :workoutName="workout.name"
        :link="`/${userName}/${workout.id}`"
        :isCurrent="workout.id === nextWorkoutId"
        :isDone="allWorkoutIdsDone.includes(workout.id)"
      />
    </div>

    <span class="text-gray-700 text-lg">Treinos: {{ selectedDataUser?.workouts?.length }}</span>
  </div>
</template>
