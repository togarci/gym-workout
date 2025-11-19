<script setup lang="ts">
const emits = defineEmits(['click']);

const { type = 'button' } = defineProps<{
  disabled?: boolean;
  type?: HTMLButtonElement['type'];
  isFull?: boolean;
}>();
</script>

<template>
  <button
    @click="emits('click')"
    :type="type"
    :disabled="disabled"
    class="bg-primary text-white font-bold px-5 py-4 rounded-2xl shadow-custom"
    :class="{ 'bg-primary': !disabled, 'bg-primary/60': disabled }"
  >
    <slot />
  </button>
</template>
