<script lang="ts" setup>
import { ref } from 'vue';

export type PersonalNavKey = 'students' | 'workouts' | 'exercises';

const { activeItem = 'students' } = defineProps<{
  userName?: string;
  activeItem?: PersonalNavKey;
}>();

const emits = defineEmits<{
  (e: 'logout'): void;
  (e: 'select', key: PersonalNavKey): void;
}>();

const isMobileMenuOpen = ref(false);

const navItems: { key: PersonalNavKey; label: string }[] = [
  { key: 'students', label: 'Meus Alunos' },
  { key: 'workouts', label: 'Treinos' },
  { key: 'exercises', label: 'Exercícios' },
];

function handleSelect(key: PersonalNavKey) {
  emits('select', key);
  isMobileMenuOpen.value = false;
}
</script>

<template>
  <div class="md:hidden flex w-full max-w-desktop justify-start items-center">
    <button
      type="button"
      aria-label="Abrir menu"
      data-testId="toggle-mobile-sidebar"
      class="cursor-pointer p-5 rounded-2xl bg-white border border-gray-600 shadow-custom flex items-center justify-center transition-transform duration-200 hover:scale-110"
      @click="isMobileMenuOpen = !isMobileMenuOpen"
    >
      <MenuSVG className="size-6 fill-secondary" />
    </button>
  </div>

  <div
    v-if="isMobileMenuOpen"
    data-testId="mobile-sidebar-overlay"
    class="fixed inset-0 bg-black/40 z-40 md:hidden"
    @click="isMobileMenuOpen = false"
  />

  <aside
    data-testId="personal-sidebar"
    class="fixed top-0 left-0 h-full flex items-center p-5 z-50 transition-transform duration-200 md:translate-x-0"
    :class="{
      'translate-x-0': isMobileMenuOpen,
      '-translate-x-full': !isMobileMenuOpen,
    }"
  >
    <nav
      aria-label="Navegação do Personal"
      class="flex flex-col items-center gap-4"
    >
      <Tooltip
        text="Fechar menu"
        class="md:hidden"
      >
        <button
          type="button"
          aria-label="Fechar menu"
          data-testId="close-mobile-sidebar"
          class="p-3 rounded-2xl bg-white border border-gray-600 shadow-custom flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110"
          @click="isMobileMenuOpen = false"
        >
          <CloseSVG className="size-6 fill-secondary" />
        </button>
      </Tooltip>

      <Tooltip
        v-for="item in navItems"
        :key="item.key"
        :text="item.label"
      >
        <button
          type="button"
          :aria-label="item.label"
          :data-testId="`nav-item-${item.key}`"
          class="p-3 rounded-2xl shadow-custom flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110"
          :class="{
            'bg-primary text-white': activeItem === item.key,
            'bg-white text-secondary border border-gray-600': activeItem !== item.key,
          }"
          @click="handleSelect(item.key)"
        >
          <UsersSVG
            v-if="item.key === 'students'"
            :className="activeItem === item.key ? 'size-6 fill-white' : 'size-6 fill-secondary'"
          />
          <FitSVG
            v-else-if="item.key === 'workouts'"
            :className="activeItem === item.key ? 'size-6 fill-white' : 'size-6 fill-secondary'"
          />
          <ExerciseSVG
            v-else
            :className="activeItem === item.key ? 'size-6 fill-white' : 'size-6 fill-secondary'"
          />
        </button>
      </Tooltip>

      <Tooltip text="Sair">
        <button
          type="button"
          aria-label="Sair"
          data-testId="sidebar-logout-button"
          class="p-3 rounded-2xl bg-white border border-gray-600 shadow-custom flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110"
          @click="emits('logout')"
        >
          <LogoutSVG className="size-6 fill-secondary" />
        </button>
      </Tooltip>
    </nav>
  </aside>
</template>
