<script lang="ts" setup>
defineProps<{
  exercise: {
    name: string;
    sets: number;
    reps: number;
    obs?: string;
  };
}>();

const isChecked = defineModel();
const obsBtnRef = ref<HTMLButtonElement>();

const setCheck = (event: MouseEvent) => {
  const eventTarget = event.target as HTMLElement;
  if (!obsBtnRef.value?.contains(eventTarget)) isChecked.value = !isChecked.value;
};
</script>

<template>
  <div @click="setCheck" class="flex flex-col px-5 py-4 bg-white rounded-2xl gap-2 shadow-custom">
    <div class="flex items-center justify-between w-full">
      <span class="line-clamp-1 font-semibold text-lg text-secondary-900"> {{ exercise.name }}</span>

      <Checkbox v-model="isChecked" />
    </div>

    <div class="flex items-center text-base gap-2.5">
      <div class="flex items-center gap-1 text-gray-700">
        <span class="font-semibold">Serie:</span><span>{{ exercise.sets }}</span>
      </div>
      <div class="flex items-center gap-1 text-gray-700">
        <span class="font-semibold">Rep:</span><span>{{ exercise.reps }}</span>
      </div>
      <button
        v-if="exercise.obs"
        ref="obsBtnRef"
        class="text-primary flex items-center gap-1 py-0.5 px-2 border rounded-lg border-primary"
        type="button"
      >
        <span class="font-semibold">Obs</span>
        <InfoSVG />
      </button>
    </div>
  </div>
</template>
