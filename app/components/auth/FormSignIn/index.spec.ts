
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import FormSignIn from './index.vue';
import { toast } from 'vue3-toastify';
import { loginUser } from '~/services/user';

const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }));

mockNuxtImport('useRouter', () => () => ({ push: pushMock }));

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

  it('deve renderizar os inputs, o switch e o botão de entrar desabilitado, sem o botão criar conta', () => {
    const wrapper = mountComponent();

    const inputs = wrapper.findAll('input');
    const buttons = wrapper.findAll('button');
    const submitButton = buttons.find((b) => b.text().includes('ENTRAR'))!;

    expect(inputs.length).toBe(2);
    expect(wrapper.text()).toContain('Sou Personal');
    expect(wrapper.find('[role="switch"]').exists()).toBe(true);
    expect(submitButton.exists()).toBe(true);
    expect(submitButton.attributes('disabled')).toBeDefined();
    expect(buttons.find((b) => b.text().includes('CRIAR CONTA'))).toBeUndefined();
  });

  it('deve exibir o botão criar conta somente quando o switch Sou Personal estiver ativo', async () => {
    const wrapper = mountComponent();

    await wrapper.find('[role="switch"]').trigger('click');
    const signUpButton = wrapper.findAll('button').find((b) => b.text().includes('CRIAR CONTA'))!;
    expect(signUpButton.exists()).toBe(true);
    expect(signUpButton.attributes('disabled')).toBeUndefined();

    await wrapper.find('[role="switch"]').trigger('click');
    expect(wrapper.findAll('button').find((b) => b.text().includes('CRIAR CONTA'))).toBeUndefined();
  });

  it('deve enviar personal: true no login quando o switch estiver ativo', async () => {
    vi.mocked(loginUser).mockResolvedValueOnce({
      statusCode: 200,
      data: { id: 1, userName: 'togarci', accessToken: 'a', refreshToken: 'r' },
      message: 'ok',
    });

    const wrapper = mountComponent();
    const inputs = wrapper.findAll('input');
    await inputs[0]?.setValue('togarci');
    await inputs[1]?.setValue('123456');
    await wrapper.find('[role="switch"]').trigger('click');

    const submitButton = wrapper.findAll('button').find((b) => b.text().includes('ENTRAR'))!;
    await submitButton.trigger('click');

    expect(loginUser).toHaveBeenCalledWith({
      userName: 'togarci',
      password: '123456',
      personal: true,
    });
  });

  it('deve redirecionar para /personal/:userName quando a resposta indicar isPersonal true', async () => {
    vi.mocked(loginUser).mockResolvedValueOnce({
      statusCode: 200,
      data: { id: 1, userName: 'togarci', accessToken: 'a', refreshToken: 'r', isPersonal: true },
      message: 'ok',
    });

    const wrapper = mountComponent();
    const inputs = wrapper.findAll('input');
    await inputs[0]?.setValue('togarci');
    await inputs[1]?.setValue('123456');
    await wrapper.find('[role="switch"]').trigger('click');

    const submitButton = wrapper.findAll('button').find((b) => b.text().includes('ENTRAR'))!;
    await submitButton.trigger('click');
    await flushPromises();

    expect(pushMock).toHaveBeenCalledWith('/personal/togarci');
  });

  it('deve redirecionar para /:userName quando a resposta indicar isPersonal false', async () => {
    vi.mocked(loginUser).mockResolvedValueOnce({
      statusCode: 200,
      data: { id: 1, userName: 'togarci', accessToken: 'a', refreshToken: 'r', isPersonal: false },
      message: 'ok',
    });

    const wrapper = mountComponent();
    const inputs = wrapper.findAll('input');
    await inputs[0]?.setValue('togarci');
    await inputs[1]?.setValue('123456');

    const submitButton = wrapper.findAll('button').find((b) => b.text().includes('ENTRAR'))!;
    await submitButton.trigger('click');
    await flushPromises();

    expect(pushMock).toHaveBeenCalledWith('/togarci');
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
      personal: false,
    });
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
      personal: false,
    });
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
  });
});
