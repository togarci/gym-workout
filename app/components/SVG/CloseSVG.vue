<script lang="ts" setup>
const { className = 'size-6 fill-secondary' } = defineProps<{
  className?: string;
}>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" :class="className" viewBox="0 -960 960 960">
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224z"></path>
  </svg>
</template>
