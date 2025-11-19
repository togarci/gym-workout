<script lang="ts" setup>
const model = defineModel();
</script>

<template>
  <div
    @click="model = !model"
    class="size-6 overflow-hidden cursor-pointer bg-gray-500 rounded-full flex items-center justify-center"
    :class="{ 'bg-tertiary': model }"
  >
    <CheckboxSVG v-if="model" />
  </div>
</template>
