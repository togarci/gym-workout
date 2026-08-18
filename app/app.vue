<script lang="ts" setup>
import database from '~/states/data.workout.json';

const router = useRouter();
const userName = useCookie('userName');

function setUserNameOnCoockie() {
  const currentPath = router.currentRoute.value.path;
  const localUserName = localStorage.getItem('userName');
  const accessToken = useCookie('accessToken').value;
  
  // Considera válido se tiver token OU se estiver no mock de fallback
  const isValidUser = !!accessToken || database.some((dt) => dt.userName === localUserName);

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
