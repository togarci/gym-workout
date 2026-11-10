<script lang="ts" setup>
import { computed, ref } from 'vue';
import { toast } from 'vue3-toastify';
import { loginUser } from '~/services/user';
import { useUserStore } from '~/stores/user';
import Switch from '~/components/share/Switch/index.vue';

const router = useRouter();
const userName = ref<string>('');
const password = ref<string>('');
const isPersonal = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const userStore = useUserStore();

const isSubmitDisabled = computed(() => {
  return userName.value.length === 0 || password.value.length === 0;
});

function clearForm() {
  userName.value = '';
  password.value = '';
}

function goToSignUp() {
  router.push('/personal/auth/signUp');
}

async function submitSignIn() {
  isLoading.value = true;
  try {
    const response = await loginUser({
      userName: userName.value,
      password: password.value,
      personal: isPersonal.value,
    });

    if (response?.data) {
      userStore.setUser(response.data);
      
      const userNameCookie = useCookie<string | null>('userName');
      userNameCookie.value = response.data.userName;

      const isPersonal = response.data.isPersonal

      isPersonal ?
        router.push(`/personal/${response.data.userName}`) :  
        router.push(`/${response.data.userName}`)
    }
  } catch (error: any) {
    toast.error(error?.data?.message || error?.message || 'Usuário não encontrado');
    clearForm();
  } finally {
    isLoading.value = false;
  }
}

</script>

<template>
  <div class="flex w-full max-w-desktop flex-col px-4 gap-4">
    <Input
      type="text"
      v-model="userName"
      name="userName"
      placeholder="Digite o nome de usuário"
    />
    <Input
      type="password"
      v-model="password"
      name="password"
      placeholder="Digite a sua senha"
    />

    <label class="flex w-full items-center justify-end gap-3 cursor-pointer select-none">
      <span class="text-secondary">Sou Personal</span>
      <Switch v-model="isPersonal" />
    </label>

    <Button
      :disabled="isSubmitDisabled || isLoading"
      @click="submitSignIn"
    >
      ENTRAR
    </Button>

    <Button v-if="isPersonal" variant="secondary" @click="goToSignUp">
      CRIAR CONTA
    </Button>
  </div>
</template>
