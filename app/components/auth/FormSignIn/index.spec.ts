import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import FormSignIn from './index.vue';
import { toast } from 'vue3-toastify';

vi.mock('vue3-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('FormSignIn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('deve renderizar os elementos de input e botão desabilitado inicialmente', () => {
    const wrapper = mount(FormSignIn);

    const input = wrapper.find('input');
    const button = wrapper.find('button');

    expect(input.exists()).toBe(true);
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe('ENTRAR');
    expect(button.attributes('disabled')).toBeDefined();
  });

  it('deve habilitar o botão quando o campo de usuário for preenchido', async () => {
    const wrapper = mount(FormSignIn);

    const input = wrapper.find('input');
    await input.setValue('togarci');

    const button = wrapper.find('button');
    expect(button.attributes('disabled')).toBeUndefined();
  });

  it('deve realizar login com sucesso para um usuário existente no banco de dados', async () => {
    const wrapper = mount(FormSignIn);

    const input = wrapper.find('input');
    await input.setValue('togarci');

    const button = wrapper.find('button');
    await button.trigger('click');

    expect(localStorage.getItem('userName')).toBe('togarci');
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('deve aceitar nome de usuário insensível a maiúsculas/minúsculas', async () => {
    const wrapper = mount(FormSignIn);

    const input = wrapper.find('input');
    await input.setValue('ToGarCi');

    const button = wrapper.find('button');
    await button.trigger('click');

    expect(localStorage.getItem('userName')).toBe('togarci');
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('deve exibir toast de erro e resetar o input para um usuário inexistente', async () => {
    const wrapper = mount(FormSignIn);

    const input = wrapper.find('input');
    await input.setValue('usuario_inexistente');

    const button = wrapper.find('button');
    await button.trigger('click');

    expect(toast.error).toHaveBeenCalledWith('Usuário não encontrado');
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('');
    expect(localStorage.getItem('userName')).toBeNull();
  });
});
