import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PersonalSidebar from './index.vue';

describe('PersonalSidebar', () => {
  const globalConfig = {
    stubs: {
      UsersSVG: true,
      FitSVG: true,
      ExerciseSVG: true,
      LogoutSVG: true,
      CloseSVG: true,
      MenuSVG: true,
    },
  };

  it('deve renderizar posicionado fixed left-0 sem background e com ícones agrupados com p-5, rounded-2xl e hover:scale-110', () => {
    const wrapper = mount(PersonalSidebar, {
      props: {
        userName: 'carlos.personal',
        activeItem: 'students',
      },
      global: globalConfig,
    });

    const sidebar = wrapper.find('[data-testId="personal-sidebar"]');
    expect(sidebar.classes()).toContain('fixed');
    expect(sidebar.classes()).toContain('left-0');
    expect(sidebar.classes()).toContain('-translate-x-full');
    expect(sidebar.classes()).toContain('md:translate-x-0');
    expect(sidebar.classes()).not.toContain('bg-white');

    const studentsBtn = wrapper.find('[data-testId="nav-item-students"]');
    expect(studentsBtn.classes()).toContain('p-3');
    expect(studentsBtn.classes()).toContain('rounded-2xl');
    expect(studentsBtn.classes()).toContain('hover:scale-110');
    expect(studentsBtn.classes()).toContain('bg-primary');

    const tooltips = wrapper.findAll('[data-testId="tooltip-content"]').map((t) => t.text());
    expect(tooltips).toEqual(
      expect.arrayContaining(['Meus Alunos', 'Treinos', 'Exercícios', 'Sair'])
    );
  });

  it('deve abrir e fechar a sidebar no mobile ao clicar no botão sanduíche', async () => {
    const wrapper = mount(PersonalSidebar, {
      props: {
        userName: 'carlos.personal',
      },
      global: globalConfig,
    });

    const sidebar = wrapper.find('[data-testId="personal-sidebar"]');
    expect(sidebar.classes()).toContain('-translate-x-full');

    await wrapper.find('[data-testId="toggle-mobile-sidebar"]').trigger('click');
    expect(sidebar.classes()).toContain('translate-x-0');
    expect(wrapper.find('[data-testId="mobile-sidebar-overlay"]').exists()).toBe(true);

    await wrapper.find('[data-testId="close-mobile-sidebar"]').trigger('click');
    expect(sidebar.classes()).toContain('-translate-x-full');
  });

  it('deve emitir o evento select ao clicar em um ícone de navegação', async () => {
    const wrapper = mount(PersonalSidebar, {
      props: {
        userName: 'carlos.personal',
      },
      global: globalConfig,
    });

    await wrapper.find('[data-testId="nav-item-workouts"]').trigger('click');

    expect(wrapper.emitted('select')?.[0]).toEqual(['workouts']);
  });

  it('deve emitir o evento logout ao clicar no ícone de Sair', async () => {
    const wrapper = mount(PersonalSidebar, {
      props: {
        userName: 'carlos.personal',
      },
      global: globalConfig,
    });

    await wrapper.find('[data-testId="sidebar-logout-button"]').trigger('click');

    expect(wrapper.emitted('logout')).toBeTruthy();
  });
});
