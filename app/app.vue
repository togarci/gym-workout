<script lang="ts" setup>
import database from '~/states/data.workout.json';

const router = useRouter();
const userName = useCookie('userName');

const setUserNameOnCoockie = () => {
  const currentPath = router.currentRoute.value.path;
  const localUserName = localStorage.getItem('userName');
  const userNameExist = database.some((dt) => dt.userName === localUserName);

  if (userNameExist && !currentPath.includes(String(localUserName))) {
    userName.value = localUserName;
    router.push(`/${localUserName}`);
  }
};

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
