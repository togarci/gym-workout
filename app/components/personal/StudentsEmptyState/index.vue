<script lang="ts" setup>
defineProps<{
  searchQuery: string;
}>();

const emits = defineEmits<{
  (e: 'clear'): void;
}>();
</script>

<template>
  <div
    data-testId="students-empty-state"
    class="flex-1 flex flex-col items-center justify-center text-center py-12 gap-4"
  >
    <p class="text-secondary font-semibold text-xl">Nenhum aluno encontrado</p>
    <span class="text-gray-700 text-base">
      Não encontramos alunos correspondentes a "{{ searchQuery }}".
    </span>
    <Button
      variant="secondary"
      size="sm"
      data-testId="clear-search-button"
      @click="emits('clear')"
    >
      Limpar busca
    </Button>
  </div>
</template>
