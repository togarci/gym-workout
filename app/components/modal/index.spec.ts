import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Modal from './index.vue';

describe('Modal', () => {
  it('não deve renderizar nada quando isOpen (modelValue) for false', () => {
    const wrapper = mount(Modal, {
      props: {
        title: 'Título Teste',
        modelValue: false,
      },
    });

    expect(wrapper.find('div.absolute').exists()).toBe(false);
  });

  it('deve renderizar o modal e conteúdo quando isOpen for true', () => {
    const wrapper = mount(Modal, {
      props: {
        title: 'Título do Modal',
        modelValue: true,
      },
      slots: {
        default: '<p>Conteúdo interno</p>',
      },
      global: {
        stubs: {
          CloseSVG: true,
        },
      },
    });

    expect(wrapper.find('h1').text()).toBe('Título do Modal');
    expect(wrapper.text()).toContain('Conteúdo interno');
    expect(wrapper.find('.backdrop-blur-lg').exists()).toBe(true);
  });

  it('deve fechar o modal ao clicar no botão de fechar', async () => {
    const wrapper = mount(Modal, {
      props: {
        title: 'Título',
        modelValue: true,
      },
      global: {
        stubs: {
          CloseSVG: true,
        },
      },
    });

    await wrapper.find('header button').trigger('click');

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('deve fechar o modal ao clicar no overlay (fora do conteúdo)', async () => {
    const wrapper = mount(Modal, {
      props: { title: 'Título', modelValue: true },
      global: { stubs: { CloseSVG: true } },
    });

    const overlay = wrapper.find('[dataTestId="modal-container"]');
    await overlay.trigger('click');

    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });
});
