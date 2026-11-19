<script lang="ts" setup>
defineProps<{
  userName: string;
  studentsCount: number;
}>();

const searchQuery = defineModel<string>({ default: '' });
</script>

<template>
  <section
    class="bg-white p-6 rounded-2xl shadow-custom border border-gray-600 flex flex-col gap-5"
  >
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex flex-col gap-1">
        <h1 class="text-secondary font-semibold text-3xl text-wrap line-clamp-1">
          Olá, {{ userName }} 🏋️‍♂️
        </h1>
        <p class="text-gray-700 text-base">
          Gerencie os alunos e acompanhe os treinos vinculados ao seu perfil.
        </p>
      </div>

      <div class="flex items-center gap-3 shrink-0">
        <div class="bg-gray-500 px-4 py-2.5 rounded-2xl flex flex-col items-center">
          <span class="text-secondary font-bold text-lg">{{ studentsCount }}</span>
          <span class="text-gray-700 text-xs font-semibold">Alunos</span>
        </div>
      </div>
    </div>

    <Input
      v-model="searchQuery"
      name="buscar-aluno"
      label="Buscar aluno"
      placeholder="Digite o nome, usuário ou e-mail do aluno..."
    />
  </section>
</template>
