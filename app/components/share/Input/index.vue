<script setup lang="ts">
const { type = 'text' } = defineProps<{
  label?: string;
  name?: string;
  placeholder?: string;
  error: string | undefined;
  type?: HTMLInputElement['type'];
}>();

const model = defineModel<any>();
</script>

<template>
  <div class="flex flex-col w-full gap-2">
    <div
      class="w-full flex bg-white gap-1.5 items-center rounded-2xl h-12 py-2 px-4 border-2"
      :class="{ 'border-red-600': error, 'border-gray-600': !error }"
    >
      <input
        :id="name?.replaceAll(' ', '-')"
        :type="type"
        :name="name"
        v-model="model"
        data-testId="custom-text-input"
        :placeholder="placeholder"
        class="size-full text-secondary-900 placeholder:text-600 font-medium text-sm"
      />
    </div>

    <span class="text-red-400 text-xs font-semibold">{{ error }}</span>
  </div>
</template>
