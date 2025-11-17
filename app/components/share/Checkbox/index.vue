<script lang="ts" setup>
const { variant = 'default' } = defineProps<{
  variant?: 'default' | 'green';
}>();
const model = defineModel();
</script>

<template>
  <div
    @click="model = !model"
    class="size-6 overflow-hidden cursor-pointer bg-gray-500 rounded-full flex items-center justify-center"
    :class="{ 'bg-secondary-500': model && variant === 'default', 'bg-green-500': model && variant === 'green' }"
  >
    <CheckboxSVG v-if="model" />
  </div>
</template>
