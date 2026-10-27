import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import FormSignUp from './index.vue';
import { toast } from 'vue3-toastify';
import { registerUser } from '~/services/user';

vi.mock('vue3-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('~/services/user', () => ({
  registerUser: vi.fn(),
}));

describe('FormSignUp', () => {
  const mountComponent = () =>
    mount(FormSignUp, {
      global: {
        stubs: {
          EyeSVG: true,
          CloseEye: true,
          NuxtLink: { template: '<a><slot /></a>' },
        },
      },
    });

  const fillForm = async (
    wrapper: ReturnType<typeof mountComponent>,
    overrides: Partial<Record<'name' | 'userName' | 'email' | 'password' | 'confirmPassword', string>> = {},
  ) => {
    const values = {
      name: 'Thyago',
      userName: 'togarci',
      email: 'thyago@email.com',
      password: '123456',
      confirmPassword: '123456',
      ...overrides,
    };

    for (const [field, value] of Object.entries(values)) {
      await wrapper.find(`input[name="${field}"]`).setValue(value);
    }
    await flushPromises();
  };

  const getSubmitButton = (wrapper: ReturnType<typeof mountComponent>) =>
    wrapper.findAll('button').find((b) => b.text().includes('CADASTRAR'))!;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar 5 inputs e o botão de cadastrar desabilitado', async () => {
    const wrapper = mountComponent();
    await flushPromises();

    expect(wrapper.findAll('input').length).toBe(5);
    expect(getSubmitButton(wrapper).attributes('disabled')).toBeDefined();
  });

  it('deve habilitar o botão quando o formulário for válido', async () => {
    const wrapper = mountComponent();
    await fillForm(wrapper);

    expect(getSubmitButton(wrapper).attributes('disabled')).toBeUndefined();
  });

  it('deve manter o botão desabilitado e exibir erro quando as senhas não conferem', async () => {
    const wrapper = mountComponent();
    await fillForm(wrapper, { confirmPassword: '654321' });

    expect(getSubmitButton(wrapper).attributes('disabled')).toBeDefined();
    expect(wrapper.text()).toContain('As senhas não conferem');
  });

  it('deve chamar registerUser com os dados do formulário', async () => {
    vi.mocked(registerUser).mockResolvedValueOnce({ id: 1, userName: 'togarci' });

    const wrapper = mountComponent();
    await fillForm(wrapper);
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(registerUser).toHaveBeenCalledWith({
      name: 'Thyago',
      userName: 'togarci',
      email: 'thyago@email.com',
      password: '123456',
    });
    expect(toast.success).toHaveBeenCalled();
  });

  it('deve exibir mensagem de conflito quando o usuário já existe', async () => {
    vi.mocked(registerUser).mockRejectedValueOnce({ response: { status: 409 } });

    const wrapper = mountComponent();
    await fillForm(wrapper);
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(toast.error).toHaveBeenCalledWith(
      'Já existe um usuário com este nome de usuário ou e-mail.',
    );
  });
});
