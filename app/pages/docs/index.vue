<script setup lang="ts">
import ButtonDocs from '~/components/share/Button/Button.docs.vue';
import InputDocs from '~/components/share/Input/Input.docs.vue';
import CheckboxDocs from '~/components/share/Checkbox/Checkbox.docs.vue';
import ModalDocs from '~/components/share/modal/modal.docs.vue';
import SVGDocs from '~/components/share/SVG/SVG.docs.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-500 py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto space-y-10">
      <!-- Header -->
      <header class="bg-white rounded-2xl p-6 sm:p-8 shadow-custom border-l-4 border-primary">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2.5 mb-1">
              <FitSVG className="size-7 fill-primary" />
              <h1 class="text-2xl sm:text-3xl font-bold text-secondary">
                Documentação de Componentes
              </h1>
            </div>
            <p class="text-gray-700 text-sm sm:text-base mt-1">
              Catálogo visual e guia de uso dos componentes compartilhados (<code class="bg-gray-600 px-1.5 py-0.5 rounded text-xs font-mono text-secondary">app/components/share</code>).
            </p>
          </div>
          <span class="inline-flex self-start items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            UI Kit • Gym Workout
          </span>
        </div>
      </header>

      <!-- 1. Card Button -->
      <ButtonDocs />

      <!-- 2. Card Input -->
      <InputDocs />

      <!-- 3. Card Checkbox -->
      <CheckboxDocs />

      <!-- 4. Card Modal -->
      <ModalDocs />

      <!-- 5. Card Único dos Ícones (SVGs) -->
      <SVGDocs />
    </div>
  </div>
</template>
