import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import PersonalHomePage from './index.vue';
import { mockPersonalStudents } from '~/states/mockPersonalStudents';

const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }));

mockNuxtImport('useRoute', () => () => ({
  params: { userName: 'togarci' },
}));

mockNuxtImport('useRouter', () => () => ({
  push: pushMock,
}));

vi.mock('~/services/auth', () => ({
  logoutUser: vi.fn(),
}));

describe('PersonalHomePage', () => {
  const NuxtLinkStub = {
    template: '<a :href="href"><slot /></a>',
    props: ['href'],
  };

  const mountPage = () =>
    mount(PersonalHomePage, {
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub,
          UsersSVG: true,
          FitSVG: true,
          ExerciseSVG: true,
          LogoutSVG: true,
          CloseSVG: true,
          MenuSVG: true,
        },
      },
    });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar a navbar lateral, saudação ao personal e todos os alunos mockados', () => {
    const wrapper = mountPage();

    expect(wrapper.find('[data-testId="personal-sidebar"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Olá, togarci');
    expect(wrapper.findAll('[data-testId="student-card"]').length).toBe(
      mockPersonalStudents.length
    );
    expect(wrapper.find('[data-testId="students-counter"]').text()).toContain(
      `Exibindo ${mockPersonalStudents.length} de ${mockPersonalStudents.length} alunos`
    );
  });

  it('deve filtrar os alunos pelo input de busca', async () => {
    const wrapper = mountPage();

    const input = wrapper.find('[data-testId="custom-text-input"]');
    await input.setValue('Mariana');

    const cards = wrapper.findAll('[data-testId="student-card"]');
    expect(cards.length).toBe(1);
    expect(cards[0]?.text()).toContain('Mariana Costa');
    expect(wrapper.find('[data-testId="students-counter"]').text()).toContain(
      `Exibindo 1 de ${mockPersonalStudents.length} alunos`
    );
  });

  it('deve exibir estado vazio quando nenhum aluno corresponder à busca e limpar ao clicar no botão', async () => {
    const wrapper = mountPage();

    const input = wrapper.find('[data-testId="custom-text-input"]');
    await input.setValue('aluno-inexistente-xyz');

    expect(wrapper.find('[data-testId="students-empty-state"]').exists()).toBe(true);
    expect(wrapper.findAll('[data-testId="student-card"]').length).toBe(0);

    await wrapper.find('[data-testId="clear-search-button"]').trigger('click');

    expect(wrapper.find('[data-testId="students-empty-state"]').exists()).toBe(false);
    expect(wrapper.findAll('[data-testId="student-card"]').length).toBe(
      mockPersonalStudents.length
    );
  });
});
