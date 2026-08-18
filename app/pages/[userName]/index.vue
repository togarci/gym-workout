<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '~/stores/user';
import { useWorkoutStore } from '~/stores/workout';

const route = useRoute();
const router = useRouter();
const userName = route.params.userName;
const userStore = useUserStore();
const workoutStore = useWorkoutStore();

const allWorkoutIdsDone = ref<Array<number>>([]);
const nextWorkoutId = computed(
  () => workoutStore.workouts.find((workout) => !allWorkoutIdsDone.value.includes(workout.id))?.id
);

function resetWorkoutOnAllComplete() {
  if (
    workoutStore.workouts.length > 0 &&
    workoutStore.workouts.every((item) => allWorkoutIdsDone.value.includes(item.id))
  ) {
    allWorkoutIdsDone.value = [];
    localStorage.removeItem('workoutData');
  }
}

function getDataByLocalStorage() {
  const localData = localStorage.getItem('workoutData');
  if (localData) {
    allWorkoutIdsDone.value = JSON.parse(localData);
    resetWorkoutOnAllComplete();
  } else {
    allWorkoutIdsDone.value = [];
  }
}

function logout() {
  const accessTokenCookie = useCookie('accessToken', { httpOnly: true });
  const refreshTokenCookie = useCookie('refreshToken', { httpOnly: true });
  accessTokenCookie.value = '';
  refreshTokenCookie.value = '';

  userStore.clearUser();
  localStorage.removeItem('userName');
  router.push('/');
}

onMounted(async () => {
  const name = Array.isArray(userName) ? userName[0] : userName;
  if (!name) {
    router.push('/404');
    return;
  }

  await workoutStore.fetchWorkouts(name);
  getDataByLocalStorage();
});
</script>

<template>
  <div class="flex px-5 py-10 min-h-screen items-center flex-col gap-8">
    <div class="flex w-full md:bg-white md:p-6 max-w-desktop rounded-2xl justify-between items-center">
      <h1 class="text-secondary font-semibold text-3xl text-wrap line-clamp-1">Olá, {{ userName }} 🏋️‍♂️</h1>
      <Button
        @click="logout"
        variant="secondary"
        size="sm"
        >Sair</Button
      >
    </div>

    <div class="flex-1 md:bg-white md:p-6 rounded-2xl flex flex-col w-full max-w-desktop gap-5">
      <SelectWorkout
        v-for="workout in workoutStore.workouts"
        :key="workout.id"
        :workoutName="workout.name"
        :link="`/${userName}/${workout.id}`"
        :isCurrent="workout.id === nextWorkoutId"
        :isDone="allWorkoutIdsDone.includes(workout.id)"
      />
    </div>

    <span class="text-gray-700 text-lg">Treinos: {{ workoutStore.workouts.length }}</span>
  </div>
</template>

