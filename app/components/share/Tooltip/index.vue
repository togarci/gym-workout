<script lang="ts" setup>
const { position = 'right' } = defineProps<{
  text: string;
  position?: 'right' | 'top' | 'bottom' | 'left';
}>();
</script>

<template>
  <div class="relative group flex items-center justify-center">
    <slot />
    <span
      role="tooltip"
      data-testId="tooltip-content"
      class="pointer-events-none absolute whitespace-nowrap rounded-xl bg-secondary px-3 py-1.5 text-xs font-semibold text-white shadow-custom opacity-0 scale-95 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100 z-50"
      :class="{
        'left-full ml-3 top-1/2 -translate-y-1/2': position === 'right',
        'right-full mr-3 top-1/2 -translate-y-1/2': position === 'left',
        'bottom-full mb-2 left-1/2 -translate-x-1/2': position === 'top',
        'top-full mt-2 left-1/2 -translate-x-1/2': position === 'bottom',
      }"
    >
      {{ text }}
    </span>
  </div>
</template>
