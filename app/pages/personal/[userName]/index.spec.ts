import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import PersonalHomePage from './index.vue';
import { mockPersonalStudents } from '~/states/mockPersonalStudents';
import { getPersonalTeam } from '~/services/personal';

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

vi.mock('~/services/personal', () => ({
  getPersonalTeam: vi.fn(),
}));

describe('PersonalHomePage', () => {
  const NuxtLinkStub = {
    template: '<a :href="href"><slot /></a>',
    props: ['href'],
  };

  const mockTeamResponse = {
    statusCode: 200,
    data: mockPersonalStudents.map((student) => ({
      id: student.id,
      name: student.name,
      userId: student.id,
      personalId: 1,
      user: {
        id: student.id,
        userName: student.userName,
        email: student.email,
      },
      workouts: Array.from({ length: student.workoutsCount }, (_, idx) => ({
        workoutId: idx + 1,
      })),
    })),
  };

  const mountPage = async () => {
    const wrapper = mount(PersonalHomePage, {
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
    await flushPromises();
    return wrapper;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getPersonalTeam).mockResolvedValue(mockTeamResponse);
  });

  it('deve renderizar a navbar lateral, saudação ao personal e todos os alunos retornados pela API', async () => {
    const wrapper = await mountPage();

    expect(getPersonalTeam).toHaveBeenCalledTimes(1);
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
    const wrapper = await mountPage();

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
    const wrapper = await mountPage();

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
