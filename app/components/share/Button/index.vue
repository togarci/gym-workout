<script setup lang="ts">
const emits = defineEmits(['click']);

const {
  type = 'button',
  variant = 'primary',
  size = 'md',
} = defineProps<{
  disabled?: boolean;
  type?: HTMLButtonElement['type'];
  isFull?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'sm';
}>();
</script>

<template>
  <button
    @click="emits('click')"
    :type="type"
    :disabled="disabled"
    class="font-bold shadow-custom"
    :class="{
      'bg-primary text-white': !disabled && variant == 'primary',
      'bg-white border text-secondary border-secondary': !disabled && variant == 'secondary',
      'bg-primary/60 text-white': disabled,
      'px-5 py-4 rounded-2xl': size == 'md',
      'px-3 py-2 rounded-xl': size == 'sm',
      'w-full': isFull,
    }"
  >
    <slot />
  </button>
</template>
