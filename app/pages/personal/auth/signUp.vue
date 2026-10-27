<script lang="ts" setup>
useHead({
  title: 'Cadastro de Personal | Gym Workout',
  meta: [
    { name: 'description', content: 'Crie sua conta de personal trainer no Gym Workout.' },
  ],
});
</script>

<template>
  <main class="min-h-screen w-full px-5 py-10 gap-20 flex flex-col items-center justify-center">
    <div class="flex flex-col items-center gap-5">
      <img
        class="size-60"
        src="/logo.png"
        alt="logo"
      />
    </div>

    <FormSignUp />
  </main>
</template>
