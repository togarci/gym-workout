<script lang="ts" setup>
defineProps<{
  label: string;
}>();
</script>

<template>
  <button
    class="text-primary flex items-center gap-1 py-0.5 px-2 border rounded-lg border-primary"
    type="button"
  >
    <span class="font-semibold">{{ label }}</span>
    <slot />
  </button>
</template>
