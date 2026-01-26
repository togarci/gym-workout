import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Input from './index.vue';

describe('Input', () => {
  it('deve renderizar o input corretamente com props padrão', () => {
    const wrapper = mount(Input);
    const input = wrapper.find('[data-testId="custom-text-input"]');

    expect(input.exists()).toBe(true);
    expect(input.attributes('type')).toBe('text');
    expect(wrapper.find('.border-gray-600').exists()).toBe(true);
  });

  it('deve renderizar label e placeholder corretamente', () => {
    const wrapper = mount(Input, {
      props: {
        label: 'Nome do Usuário',
        name: 'user name',
        placeholder: 'Digite aqui',
      },
    });

    const label = wrapper.find('label');
    const input = wrapper.find('input');

    expect(label.text()).toBe('Nome do Usuário');
    expect(label.attributes('for')).toBe('user-name');

    expect(input.attributes('id')).toBe('user-name');
    expect(input.attributes('placeholder')).toBe('Digite aqui');
  });

  it('deve atualizar o v-model corretamente', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'valor inicial',
      },
    });

    const input = wrapper.find('input');
    expect(input.element.value).toBe('valor inicial');

    await input.setValue('novo valor');

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['novo valor']);
  });

  it('deve exibir estado de erro quando a prop error for passada', () => {
    const wrapper = mount(Input, {
      props: {
        error: 'Campo inválido',
      },
    });

    // Verifica mensagem de erro
    expect(wrapper.text()).toContain('Campo inválido');
    // Verifica classe de borda vermelha e ausência da cinza
    expect(wrapper.find('.border-red-600').exists()).toBe(true);
    expect(wrapper.find('.border-gray-600').exists()).toBe(false);
  });
});
