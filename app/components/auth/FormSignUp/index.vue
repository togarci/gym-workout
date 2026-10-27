<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { ValidationError } from 'yup';
import { toast } from 'vue3-toastify';
import { registerUser } from '~/services/user';
import signUpFormSchema from './schema';

type SignUpField = 'name' | 'userName' | 'email' | 'password' | 'confirmPassword';

const router = useRouter();
const isLoading = ref<boolean>(false);

const form = reactive<Record<SignUpField, string>>({
  name: '',
  userName: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const validationErrors = computed<Partial<Record<SignUpField, string>>>(() => {
  try {
    signUpFormSchema.validateSync(form, { abortEarly: false });
    return {};
  } catch (error) {
    if (!(error instanceof ValidationError)) return {};

    return error.inner.reduce<Partial<Record<SignUpField, string>>>((acc, item) => {
      const field = item.path as SignUpField;
      if (field && !acc[field]) acc[field] = item.message;
      return acc;
    }, {});
  }
});

// Só exibe o erro de um campo depois que o usuário começou a preenchê-lo.
const visibleErrors = computed(() => {
  const result: Partial<Record<SignUpField, string>> = {};
  (Object.keys(form) as SignUpField[]).forEach((field) => {
    if (form[field].length > 0) result[field] = validationErrors.value[field];
  });
  return result;
});

const isSubmitDisabled = computed(() => {
  return Object.keys(validationErrors.value).length > 0 || isLoading.value;
});

function clearForm() {
  (Object.keys(form) as SignUpField[]).forEach((field) => {
    form[field] = '';
  });
}

async function submitSignUp() {
  if (isSubmitDisabled.value) return;

  isLoading.value = true;
  try {
    await registerUser({
      name: form.name.trim() || undefined,
      userName: form.userName.trim(),
      email: form.email.trim(),
      password: form.password,
    });

    toast.success('Cadastro realizado com sucesso!');
    clearForm();
    router.push('/auth/signIn');
  } catch (error: any) {
    const status = error?.response?.status ?? error?.statusCode;
    const message =
      error?.response?.data?.message || error?.data?.message || error?.message;

    toast.error(
      status === 409
        ? 'Já existe um usuário com este nome de usuário ou e-mail.'
        : message || 'Não foi possível realizar o cadastro.',
    );
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <form
    class="flex w-full max-w-desktop flex-col px-4 gap-4"
    novalidate
    @submit.prevent="submitSignUp"
  >
    <Input
      type="text"
      v-model="form.name"
      name="name"
      placeholder="Digite o seu nome"
      :error="visibleErrors.name"
    />
    <Input
      type="text"
      v-model="form.userName"
      name="userName"
      placeholder="Digite o nome de usuário"
      :error="visibleErrors.userName"
    />
    <Input
      type="email"
      v-model="form.email"
      name="email"
      placeholder="Digite o seu e-mail"
      :error="visibleErrors.email"
    />
    <Input
      type="password"
      v-model="form.password"
      name="password"
      placeholder="Digite a sua senha"
      :error="visibleErrors.password"
    />
    <Input
      type="password"
      v-model="form.confirmPassword"
      name="confirmPassword"
      placeholder="Confirme a sua senha"
      :error="visibleErrors.confirmPassword"
    />

    <NuxtLink class="w-full text-right text-secondary" to="/auth/signIn">
      Já tenho conta
    </NuxtLink>

    <Button
      type="submit"
      :disabled="isSubmitDisabled"
    >
      CADASTRAR
    </Button>
  </form>
</template>
