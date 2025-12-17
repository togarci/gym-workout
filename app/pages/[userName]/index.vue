<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import database from '~/states/data.workout.json';
import type { DatabaseTypes } from '~/states/type';

const route = useRoute();
const router = useRouter();
const userName = route.params.userName;

const dataWorkout = ref<DatabaseTypes>();
const storageWorkout = ref<Array<number>>([]);
const currentWorkout = ref<number>();

const setStorage = () => {
  const localWorkout = localStorage.getItem('workoutData');
  if (localWorkout) {
    storageWorkout.value = JSON.parse(localWorkout);

    if (dataWorkout.value?.workouts.every((item) => storageWorkout.value.includes(item.id))) {
      storageWorkout.value = [];
      localStorage.removeItem('workoutData');
    }
  } else {
    storageWorkout.value = [];
  }

  if (storageWorkout.value.length === 0) {
    currentWorkout.value = dataWorkout.value?.workouts[0]?.id;
  } else {
    const nextNotDone = dataWorkout.value?.workouts.find((workout) => !storageWorkout.value.includes(workout.id));
    currentWorkout.value = nextNotDone?.id;
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

  dataWorkout.value = findWorkout;
  setStorage();
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
        v-for="workout in dataWorkout?.workouts"
        :key="workout.name"
        :workoutName="workout.name"
        :link="`/${userName}/${workout.id}`"
        :isCurrent="workout.id === currentWorkout"
        :isDone="storageWorkout.includes(workout.id)"
      />
    </div>

    <span class="text-gray-700 text-lg">Treinos: {{ dataWorkout?.workouts?.length }}</span>
  </div>
</template>
