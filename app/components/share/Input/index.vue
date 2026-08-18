<script setup lang="ts">
import { ref, computed } from 'vue';

const { type = 'text' } = defineProps<{
  label?: string;
  name?: string;
  placeholder?: string;
  error?: string | undefined;
  type?: HTMLInputElement['type'];
}>();

const model = defineModel<any>();

const showPassword = ref(false);

const inputType = computed(() => {
  if (type === 'password') {
    return showPassword.value ? 'text' : 'password';
  }
  return type;
});
</script>

<template>
  <div class="flex flex-col w-full gap-2">
    <label
      class="font-semibold text-lg px-1"
      v-if="label"
      :for="name?.replaceAll(' ', '-')"
      >{{ label }}</label
    >
    <div
      class="w-full flex bg-white gap-1.5 items-center rounded-2xl h-15 py-2 px-4 border-2"
      :class="{ 'border-red-600': error, 'border-gray-600': !error }"
    >
      <input
        :id="name?.replaceAll(' ', '-')"
        :type="inputType"
        :name="name"
        v-model="model"
        data-testId="custom-text-input"
        :placeholder="placeholder"
        class="size-full placeholder:text-600 font-medium text-base"
      />
      <button
        v-if="type === 'password'"
        type="button"
        @click="showPassword = !showPassword"
        class="cursor-pointer focus:outline-none flex items-center justify-center"
        data-testId="toggle-password-visibility"
      >
        <CloseEye v-if="showPassword" />
        <EyeSVG v-else />
      </button>
    </div>

    <span class="text-red-400 text-xs font-semibold">{{ error }}</span>
  </div>
</template>
