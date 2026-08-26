<script lang="ts" setup>
import database from '~/states/data.workout.json';

const router = useRouter();
const userName = useCookie('userName', {
  maxAge: 60 * 60 * 24 * 30, // 30 dias
  path: '/',
  sameSite: 'lax',
});

function setUserNameOnCoockie() {
  const currentPath = router.currentRoute.value.path;
  const localUserName = localStorage.getItem('userName') || userName.value;
  
  const isValidUser = !!localUserName;

  if (localUserName && isValidUser && !currentPath.includes(String(localUserName))) {
    userName.value = localUserName;
    router.push(`/${localUserName}`);
  }
}

onBeforeMount(() => {
  if (!userName.value) setUserNameOnCoockie();
});
</script>

<template>
  <div>
    <VitePwaManifest />
    <NuxtPage />
  </div>
</template>
