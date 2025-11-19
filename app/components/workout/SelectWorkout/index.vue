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
    class="rounded-2xl relative shadow-custom min-h-32 flex justify-start flex-col gap-4 p-5"
    :class="{
      'bg-secondary': isDone,
      'bg-white border-secondary border': isCurrent,
      'bg-white border-primary border': !isCurrent && !isDone,
    }"
  >
    <span v-if="isCurrent" class="text-xl font-semibold text-secondary">Treino de Hoje</span>

    <div class="flex gap-2">
      <div class="flex items-center w-6 h-8">
        <FitSVG />
      </div>
      <h1
        class="text-2xl text-wrap font-semibold line-clamp-2"
        :class="{ 'text-white': isDone, 'text-secondary': isCurrent, 'text-primary': !isCurrent || !isDone }"
      >
        {{ workoutName }}
      </h1>
    </div>
    <span v-if="workoutDuration" class="text-gray-500 font-medium">Duração: {{ workoutDuration }}</span>

    <div v-if="isDone" class="absolute text-primary font-bold text-sm bottom-5 flex gap-2 right-5">
      Concluido
      <CheckboxSVG className="size-4 fill-primary" />
    </div>
  </NuxtLink>
</template>
