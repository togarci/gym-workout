import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SelectWorkout from './index.vue';

describe('SelectWorkout', () => {
  const defaultProps = {
    workoutName: 'Treino de Força',
    link: '/workout/123',
  };

  const NuxtLinkStub = {
    template: '<a :href="href"><slot /></a>',
    props: ['href'],
  };

  it('deve renderizar as informações básicas corretamente', () => {
    const wrapper = mount(SelectWorkout, {
      props: defaultProps,
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub,
          FitSVG: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Treino de Força');
    expect(wrapper.find('a').attributes('href')).toBe('/workout/123');
    expect(wrapper.findComponent({ name: 'FitSVG' }).exists()).toBe(true);
  });

  it('deve aplicar estilos de "Treino de Hoje" quando isCurrent for true', () => {
    const wrapper = mount(SelectWorkout, {
      props: {
        ...defaultProps,
        isCurrent: true,
      },
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub,
          FitSVG: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Treino de Hoje');
    expect(wrapper.classes()).toContain('border-secondary');
    expect(wrapper.find('h1').classes()).toContain('text-secondary');
  });

  it('deve aplicar estilos de "Concluido" quando isDone for true', () => {
    const wrapper = mount(SelectWorkout, {
      props: {
        ...defaultProps,
        isDone: true,
      },
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub,
          FitSVG: true,
          CheckboxSVG: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Concluido');
    expect(wrapper.classes()).toContain('bg-secondary');
    expect(wrapper.find('h1').classes()).toContain('text-white');
    expect(wrapper.findComponent({ name: 'CheckboxSVG' }).exists()).toBe(true);
  });

  it('deve exibir a duração quando a prop workoutDuration for passada', () => {
    const wrapper = mount(SelectWorkout, {
      props: {
        ...defaultProps,
        workoutDuration: 45,
      },
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub,
          FitSVG: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Duração: 45');
  });
});
