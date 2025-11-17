<script lang="ts" setup>
const { className = 'size-6 fill-secondary-900' } = defineProps<{
  className?: string;
}>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" :class="className" viewBox="0 -960 960 960">
    <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80z"></path>
  </svg>
</template>
