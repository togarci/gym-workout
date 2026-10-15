<script lang="ts" setup>
import { computed, ref } from 'vue';
import { toast } from 'vue3-toastify';
import { loginUser } from '~/services/user';
import { useUserStore } from '~/stores/user';

const router = useRouter();
const userName = ref<string>('');
const password = ref<string>('');
const isLoading = ref<boolean>(false);
const userStore = useUserStore();

const isSubmitDisabled = computed(() => {
  return userName.value.length === 0 || password.value.length === 0;
});

function clearForm() {
  userName.value = '';
  password.value = '';
}

async function submitSignIn() {
  isLoading.value = true;
  try {
    const response = await loginUser({
      userName: userName.value,
      password: password.value,
    });

    if (response?.data) {
      userStore.setUser(response.data);
      
      const userNameCookie = useCookie<string | null>('userName');
      userNameCookie.value = response.data.userName;
      
      router.push(`/${response.data.userName}`);
    }
  } catch (error: any) {
    toast.error(error?.data?.message || error?.message || 'Usuário não encontrado');
    clearForm();
  } finally {
    isLoading.value = false;
  }
}

function navigateToSignUp() {
  router.push('/auth/signUp');
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

    <a class="w-full text-right text-secondary" href="/auth/personal/signIn">Sou Personal</a>
    
    <Button
      :disabled="isSubmitDisabled || isLoading"
      @click="submitSignIn"
    >
      ENTRAR
    </Button>
  </div>
</template>
