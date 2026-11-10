import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Switch from './index.vue';

describe('Switch', () => {
  it('deve renderizar desligado por padrão', () => {
    const wrapper = mount(Switch, { props: { modelValue: false } });

    expect(wrapper.classes()).toContain('bg-gray-500');
    expect(wrapper.classes()).not.toContain('bg-tertiary');
    expect(wrapper.attributes('aria-checked')).toBe('false');
  });

  it('deve renderizar ligado', () => {
    const wrapper = mount(Switch, { props: { modelValue: true } });

    expect(wrapper.classes()).toContain('bg-tertiary');
    expect(wrapper.attributes('aria-checked')).toBe('true');
  });

  it('deve emitir update:modelValue ao clicar', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false } });

    await wrapper.trigger('click');

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
  });

  it('não deve emitir evento quando desabilitado', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false, disabled: true } });

    await wrapper.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });
});
