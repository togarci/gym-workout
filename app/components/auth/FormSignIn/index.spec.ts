
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import FormSignIn from './index.vue';
import { toast } from 'vue3-toastify';
import { loginUser } from '~/services/user';

vi.mock('vue3-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock('~/services/user', () => ({
  loginUser: vi.fn(),
}));

describe('FormSignIn', () => {
  const mountComponent = () =>
    mount(FormSignIn, {
      global: {
        stubs: {
          EyeSVG: true,
          CloseEye: true,
        },
      },
    });

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('deve renderizar os elementos de input, botão de entrar desabilitado e botão secundário', () => {
    const wrapper = mountComponent();

    const inputs = wrapper.findAll('input');
    const buttons = wrapper.findAll('button');
    const submitButton = buttons.find((b) => b.text().includes('ENTRAR'))!;
    const signUpButton = buttons.find((b) => b.text().includes('CRIAR CONTA'))!;

    expect(inputs.length).toBe(2);
    expect(submitButton.exists()).toBe(true);
    expect(submitButton.attributes('disabled')).toBeDefined();

    expect(signUpButton.exists()).toBe(true);
    expect(signUpButton.attributes('disabled')).toBeUndefined();
  });

  it('deve habilitar o botão quando os campos de usuário e senha forem preenchidos', async () => {
    const wrapper = mountComponent();

    const inputs = wrapper.findAll('input');
    await inputs[0]?.setValue('togarci');
    await inputs[1]?.setValue('123456');

    const submitButton = wrapper.findAll('button').find((b) => b.text().includes('ENTRAR'))!;
    expect(submitButton.attributes('disabled')).toBeUndefined();
  });

  it('deve realizar login com sucesso para um usuário existente no banco de dados', async () => {
    vi.mocked(loginUser).mockResolvedValueOnce({
      statusCode: 200,
      data: {
        id: 1,
        userName: 'togarci',
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      },
      message: 'Login realizado com sucesso.',
    });

    const wrapper = mountComponent();

    const inputs = wrapper.findAll('input');
    await inputs[0]?.setValue('togarci');
    await inputs[1]?.setValue('123456');

    const submitButton = wrapper.findAll('button').find((b) => b.text().includes('ENTRAR'))!;
    await submitButton.trigger('click');

    expect(loginUser).toHaveBeenCalledWith({
      userName: 'togarci',
      password: '123456',
    });
    expect(localStorage.getItem('userName')).toBe('togarci');
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('deve aceitar nome de usuário insensível a maiúsculas/minúsculas', async () => {
    vi.mocked(loginUser).mockResolvedValueOnce({
      statusCode: 200,
      data: {
        id: 1,
        userName: 'togarci',
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      },
      message: 'Login realizado com sucesso.',
    });

    const wrapper = mountComponent();

    const inputs = wrapper.findAll('input');
    await inputs[0]?.setValue('ToGarCi');
    await inputs[1]?.setValue('123456');

    const submitButton = wrapper.findAll('button').find((b) => b.text().includes('ENTRAR'))!;
    await submitButton.trigger('click');

    expect(loginUser).toHaveBeenCalledWith({
      userName: 'ToGarCi',
      password: '123456',
    });
    expect(localStorage.getItem('userName')).toBe('togarci');
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('deve exibir toast de erro e resetar os inputs para um usuário inexistente', async () => {
    vi.mocked(loginUser).mockRejectedValueOnce({
      data: { message: 'Usuário não encontrado' },
    });

    const wrapper = mountComponent();

    const inputs = wrapper.findAll('input');
    await inputs[0]?.setValue('usuario_inexistente');
    await inputs[1]?.setValue('123456');

    const submitButton = wrapper.findAll('button').find((b) => b.text().includes('ENTRAR'))!;
    await submitButton.trigger('click');

    expect(toast.error).toHaveBeenCalledWith('Usuário não encontrado');
    expect((inputs[0]?.element as HTMLInputElement).value).toBe('');
    expect((inputs[1]?.element as HTMLInputElement).value).toBe('');
    expect(localStorage.getItem('userName')).toBeNull();
  });
});
