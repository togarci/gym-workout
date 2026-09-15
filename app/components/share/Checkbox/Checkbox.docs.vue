<script setup lang="ts">
import { ref } from 'vue';

const isCheckboxChecked1 = ref(false);
const isCheckboxChecked2 = ref(true);

const copiedSnippet = ref<string | null>(null);
function copyCode(codeText: string, id: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(codeText);
    copiedSnippet.value = id;
    setTimeout(() => {
      copiedSnippet.value = null;
    }, 2000);
  }
}
</script>

<template>
  <section class="bg-white rounded-2xl p-6 sm:p-8 shadow-custom space-y-6">
    <div class="border-b border-gray-600 pb-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-secondary">Checkbox</h2>
        <span class="text-xs font-semibold px-2.5 py-1 bg-gray-600 text-gray-700 rounded-lg font-mono">
          share/Checkbox
        </span>
      </div>
      <p class="text-sm text-gray-700 mt-1">
        Componente de seleção estilo circular com transição de estado e ícone de check integrado via <code class="font-mono text-xs">v-model</code>.
      </p>
    </div>

    <!-- Exemplo 1: Checkbox Padrão -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-secondary uppercase tracking-wider">
          Exemplo: Checkbox Padrão
        </h3>
        <button
          type="button"
          @click="copyCode(`<Checkbox v-model=&quot;isChecked&quot; />`, 'chk-1')"
          class="text-xs font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          {{ copiedSnippet === 'chk-1' ? '✓ Copiado!' : 'Copiar código' }}
        </button>
      </div>

      <pre class="bg-slate-900 text-slate-100 p-4 rounded-xl text-sm font-mono overflow-x-auto shadow-inner border border-slate-800 leading-relaxed"><code>&lt;Checkbox v-model="isChecked" /&gt;</code></pre>

      <div class="p-4 bg-gray-500/40 border border-gray-600 rounded-xl flex items-center gap-4">
        <Checkbox v-model="isCheckboxChecked1" />
        <span class="text-sm font-medium text-secondary">
          Status atual: <strong class="font-mono">{{ isCheckboxChecked1 ? 'Marcado (true)' : 'Desmarcado (false)' }}</strong> (clique no círculo para alternar)
        </span>
      </div>
    </div>

    <!-- Exemplo 2: Checkbox com Rótulo/Container -->
    <div class="space-y-3 pt-4 border-t border-gray-600">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-secondary uppercase tracking-wider">
          Exemplo: Checkbox com Rótulo Clicável
        </h3>
        <button
          type="button"
          @click="copyCode(`<div class=&quot;flex items-center gap-3 cursor-pointer&quot; @click=&quot;isChecked = !isChecked&quot;>\n  <Checkbox :modelValue=&quot;isChecked&quot; />\n  <span>Concluir série do exercício</span>\n</div>`, 'chk-2')"
          class="text-xs font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          {{ copiedSnippet === 'chk-2' ? '✓ Copiado!' : 'Copiar código' }}
        </button>
      </div>

      <pre class="bg-slate-900 text-slate-100 p-4 rounded-xl text-sm font-mono overflow-x-auto shadow-inner border border-slate-800 leading-relaxed"><code>&lt;div class="flex items-center gap-3 cursor-pointer" @click="isChecked = !isChecked"&gt;
  &lt;Checkbox :modelValue="isChecked" /&gt;
  &lt;span&gt;Concluir série do exercício&lt;/span&gt;
&lt;/div&gt;</code></pre>

      <div class="p-4 bg-gray-500/40 border border-gray-600 rounded-xl">
        <div
          class="flex items-center gap-3 cursor-pointer select-none py-2 px-3 bg-white rounded-xl shadow-xs border border-gray-600 max-w-sm"
          @click="isCheckboxChecked2 = !isCheckboxChecked2"
        >
          <Checkbox :modelValue="isCheckboxChecked2" />
          <span class="text-base font-medium text-secondary">Concluir série do exercício</span>
        </div>
      </div>
    </div>
  </section>
</template>
