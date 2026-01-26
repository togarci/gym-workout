import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Checkbox from './index.vue';

describe('Checkbox', () => {
  it('deve renderizar corretamente o estado inicial desmarcado', () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: false },
    });

    // Verifica classes padrão (desmarcado)
    expect(wrapper.classes()).toContain('bg-gray-500');
    expect(wrapper.classes()).not.toContain('bg-tertiary');

    // Verifica se o ícone não existe
    expect(wrapper.findComponent({ name: 'CheckboxSVG' }).exists()).toBe(false);
  });

  it('deve renderizar corretamente o estado marcado', () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: true },
      global: {
        stubs: {
          CheckboxSVG: true,
        },
      },
    });

    // Verifica classe ativa
    expect(wrapper.classes()).toContain('bg-tertiary');

    // Verifica se o ícone existe
    expect(wrapper.findComponent({ name: 'CheckboxSVG' }).exists()).toBe(true);
  });

  it('deve emitir o evento update:modelValue ao clicar', async () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: false },
    });

    await wrapper.trigger('click');

    // Verifica se o evento foi emitido com o novo valor (true)
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
  });
});
