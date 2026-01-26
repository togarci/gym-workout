import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from './index.vue';

describe('Button', () => {
  it('deve renderizar o conteúdo do slot', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Clique aqui',
      },
    });
    expect(wrapper.text()).toContain('Clique aqui');
  });

  it('deve emitir o evento de click ao ser clicado', async () => {
    const wrapper = mount(Button);
    await wrapper.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click');
  });

  it('deve aplicar as props padrão corretamente', () => {
    const wrapper = mount(Button);
    const button = wrapper.find('button');

    expect(button.attributes('type')).toBe('button');
    expect(button.classes()).toContain('bg-primary');
    expect(button.classes()).toContain('text-white');
    expect(button.classes()).toContain('px-5');
    expect(button.classes()).toContain('py-4');
  });

  it('deve aplicar o estilo da variante secondary', () => {
    const wrapper = mount(Button, {
      props: { variant: 'secondary' },
    });
    const button = wrapper.find('button');

    expect(button.classes()).toContain('bg-white');
    expect(button.classes()).toContain('text-secondary');
    expect(button.classes()).toContain('border-secondary');
  });

  it('deve aplicar o estilo do tamanho sm', () => {
    const wrapper = mount(Button, {
      props: { size: 'sm' },
    });
    const button = wrapper.find('button');

    expect(button.classes()).toContain('px-3');
    expect(button.classes()).toContain('py-2');
  });

  it('deve estar desabilitado quando a prop disabled for true', () => {
    const wrapper = mount(Button, {
      props: { disabled: true },
    });
    const button = wrapper.find('button');

    expect(button.element.disabled).toBe(true);
    expect(button.classes()).toContain('bg-primary/60');
    expect(button.classes()).not.toContain('bg-primary');
  });
});
