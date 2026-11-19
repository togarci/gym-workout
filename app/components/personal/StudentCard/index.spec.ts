import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StudentCard from './index.vue';
import type { PersonalStudentMock } from '~/states/mockPersonalStudents';

describe('StudentCard', () => {
  const NuxtLinkStub = {
    template: '<a :href="href"><slot /></a>',
    props: ['href'],
  };

  const studentWithWorkout: PersonalStudentMock = {
    id: 1,
    name: 'Lucas Mendes',
    userName: 'lucas.mendes',
    email: 'lucas.mendes@email.com',
    workoutsCount: 4,
    lastWorkout: 'Treino A - Peito e Tríceps',
  };

  const studentWithoutWorkout: PersonalStudentMock = {
    id: 2,
    name: 'Juliana Rocha',
    userName: 'juliana.rocha',
    email: 'juliana.rocha@email.com',
    workoutsCount: 0,
  };

  it('deve renderizar os dados do aluno corretamente sem status de ativo/inativo', () => {
    const wrapper = mount(StudentCard, {
      props: { student: studentWithWorkout },
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub,
          FitSVG: true,
        },
      },
    });

    expect(wrapper.find('[data-testId="student-name"]').text()).toBe('Lucas Mendes');
    expect(wrapper.find('[data-testId="student-username"]').text()).toBe('@lucas.mendes');
    expect(wrapper.find('[data-testId="student-status"]').exists()).toBe(false);
    expect(wrapper.find('[data-testId="student-workouts-count"]').text()).toBe('Treinos: 4');
    expect(wrapper.find('[data-testId="student-last-workout"]').text()).toContain(
      'Treino A - Peito e Tríceps'
    );
    expect(wrapper.find('a').attributes('href')).toBe('/lucas.mendes');
  });

  it('deve exibir mensagem quando nenhum treino estiver atribuído', () => {
    const wrapper = mount(StudentCard, {
      props: { student: studentWithoutWorkout },
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub,
          FitSVG: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Nenhum treino atribuído');
    expect(wrapper.find('[data-testId="student-workouts-count"]').text()).toBe('Treinos: 0');
  });
});
