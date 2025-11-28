<script lang="ts" setup>
import { toast } from 'vue3-toastify';
import database from '~/states/data.workout.json';

const router = useRouter();
const userName = ref<string>('');
const cookie = useCookie('userName');

const submitSignIn = () => {
  const findUserName = database.find((dt) => dt.userName === userName.value.toLowerCase());
  if (findUserName?.userName) {
    cookie.value = findUserName.userName;
    router.push(`/${findUserName.userName}`);
  } else {
    userName.value = '';
    toast.error('Usuário não encontrado');
  }
};
</script>

<template>
  <div class="flex w-full flex-col px-4 gap-4">
    <Input label="Nome de usuário" type="text" v-model="userName" name="email" placeholder="Digite o nome de usuário" />
    <Button :disabled="userName.length === 0" @click="submitSignIn">ENTRAR</Button>
  </div>
</template>
