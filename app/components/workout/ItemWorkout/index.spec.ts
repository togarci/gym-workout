import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ItemWorkout from './index.vue';

describe('ItemWorkout', () => {
  const defaultExercise = {
    name: 'Supino Reto',
    sets: 4,
    reps: 12,
  };

  it('deve renderizar corretamente as informações do exercício', () => {
    const wrapper = mount(ItemWorkout, {
      props: {
        exercise: defaultExercise,
        modelValue: false,
      },
      global: {
        stubs: {
          Checkbox: true,
          Modal: true,
          InfoSVG: true,
        },
      },
    });

    expect(wrapper.find('[dataTestId="item-name"]').text()).toBe('Supino Reto');
    expect(wrapper.text()).toContain('4');
    expect(wrapper.text()).toContain('12');
    expect(wrapper.find('[dataTestId="obs-btn"]').exists()).toBe(false);
  });

  it('deve emitir update:modelValue ao clicar no card', async () => {
    const wrapper = mount(ItemWorkout, {
      props: {
        exercise: defaultExercise,
        modelValue: false,
      },
      global: {
        stubs: {
          Checkbox: true,
          Modal: true,
          InfoSVG: true,
        },
      },
    });

    const card = wrapper.find('[dataTestId="item-container"]');
    await card.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
  });

  it('deve exibir o botão de observação quando houver obs', () => {
    const wrapper = mount(ItemWorkout, {
      props: {
        exercise: { ...defaultExercise, obs: 'Nota importante' },
        modelValue: false,
      },
      global: {
        stubs: { Checkbox: true, Modal: true, InfoSVG: true },
      },
    });

    expect(wrapper.find('[dataTestId="obs-btn"]').exists()).toBe(true);
  });

  it('deve abrir o modal e NÃO alterar o checkbox ao clicar no botão de obs', async () => {
    const wrapper = mount(ItemWorkout, {
      props: {
        exercise: { ...defaultExercise, obs: 'Nota importante' },
        modelValue: false,
      },
      global: {
        stubs: { Checkbox: true, Modal: true, InfoSVG: true },
      },
    });

    const button = wrapper.find('[dataTestId="obs-btn"]');
    await button.trigger('click');

    expect(wrapper.findComponent({ name: 'Modal' }).props('modelValue')).toBe(true);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });
});
