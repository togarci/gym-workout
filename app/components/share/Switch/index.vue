<script lang="ts" setup>
const model = defineModel<boolean>({ default: false });

const props = defineProps<{
  disabled?: boolean;
}>();

function toggle() {
  if (props.disabled) return;
  model.value = !model.value;
}
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="!!model"
    :disabled="disabled"
    @click="toggle"
    class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full cursor-pointer transition-colors duration-200 bg-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    :class="{ 'bg-tertiary': model }"
  >
    <span
      class="inline-block size-5 rounded-full bg-white shadow-custom transition-transform duration-200 translate-x-0.5"
      :class="{ 'translate-x-[22px]': model }"
    />
  </button>
</template>
