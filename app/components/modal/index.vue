<script lang="ts" setup>
defineProps<{
  title: string;
}>();
const isOpen = defineModel();
const refContainer = ref<Element | null>(null);

const clickOutside = (e: MouseEvent) => {
  if (refContainer.value && !refContainer.value.contains(e.target as Node)) isOpen.value = false;
};
</script>

<template>
  <div
    v-if="isOpen"
    @click="clickOutside"
    class="absolute flex p-5 items-center justify-center top-0 right-0 w-screen h-screen z-20 bg-white/20 backdrop-blur-lg"
  >
    <div ref="refContainer" class="flex w-full shadow-custom flex-col bg-white rounded-2xl">
      <header class="flex items-center border-b border-y-gray-500 justify-between p-4">
        <h1 class="text-lg font-semibold text-primary">{{ title }}</h1>

        <button @click="isOpen = false" type="button">
          <CloseSVG />
        </button>
      </header>

      <div class="w-full p-5">
        <slot />
      </div>
    </div>
  </div>
</template>
