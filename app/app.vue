<script setup lang="ts">
const cookie = useCookie('userName');
onBeforeMount(() => {
  const userName = localStorage.getItem('userName');
  if (userName) cookie.value = String(userName);
});
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
