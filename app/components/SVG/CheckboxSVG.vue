<script setup lang="ts">
const { className = 'fill-none size-3.5 text-white' } = defineProps<{
  className?: string;
}>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 11" :class="className">
    <path
      d="M4.95801 11.0001L0.208008 6.25008L1.39551 5.06258L4.95801 8.62508L12.6038 0.979248L13.7913 2.16675L4.95801 11.0001Z"
      fill="currentColor"
    />
  </svg>
</template>
