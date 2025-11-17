<script lang="ts" setup>
defineProps<{
  workoutName: string;
  workoutDuration?: number;
  isCurrent?: boolean;
  isDisabled?: boolean;
  isDone?: boolean;
  link: string;
}>();
</script>

<template>
  <NuxtLink
    :href="link"
    class="rounded-2xl relative shadow-custom min-h-32 flex justify-end flex-col gap-4 p-5"
    :class="{
      'bg-linear-to-r from-primary to-secondary-500': isCurrent,
      'bg-primary': isDone,
      'bg-secondary-500/40': !isCurrent && !isDone,
    }"
  >
    <span v-if="isCurrent" class="text-xl font-semibold text-white">Treino de Hoje</span>
    <h1 class="text-2xl text-white text-wrap font-semibold">{{ workoutName }}</h1>
    <span v-if="workoutDuration" class="text-gray-500 font-medium">Duração: {{ workoutDuration }}</span>

    <div class="absolute top-5 right-5">
      <Checkbox variant="green" :modelValue="isDone" />
    </div>
  </NuxtLink>
</template>
