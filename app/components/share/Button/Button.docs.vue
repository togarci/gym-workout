<script setup lang="ts">
import { ref } from 'vue';

const isSubmitDisabled = ref(false);
const isLoading = ref(false);
const feedbackMessage = ref('');

function submitSignIn() {
  isLoading.value = true;
  feedbackMessage.value = 'Ação submitSignIn executada!';
  setTimeout(() => {
    isLoading.value = false;
  }, 1200);
}

function sampleClick(name: string) {
  feedbackMessage.value = `Botão "${name}" clicado!`;
  setTimeout(() => {
    feedbackMessage.value = '';
  }, 2500);
}

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
        <h2 class="text-xl font-bold text-secondary">Button</h2>
        <span class="text-xs font-semibold px-2.5 py-1 bg-gray-600 text-gray-700 rounded-lg font-mono">
          share/Button
        </span>
      </div>
      <p class="text-sm text-gray-700 mt-1">
        Botão padrão com suporte a variantes, tamanhos, estado de carregamento/desabilitado e largura total.
      </p>
    </div>

    <!-- Mensagem de feedback de clique -->
    <div
      v-if="feedbackMessage"
      class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center justify-between transition-all"
    >
      <span>{{ feedbackMessage }}</span>
      <button @click="feedbackMessage = ''" class="text-emerald-600 hover:text-emerald-900 underline ml-2">Fechar</button>
    </div>

    <!-- Exemplo 1: Botão Principal com Estado Dinâmico -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-secondary uppercase tracking-wider">
          Exemplo: Botão Principal com Estado Dinâmico
        </h3>
        <button
          type="button"
          @click="copyCode(`<Button\n  :disabled=&quot;isSubmitDisabled || isLoading&quot;\n  @click=&quot;submitSignIn&quot;\n>ENTRAR</Button>`, 'btn-1')"
          class="text-xs font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          {{ copiedSnippet === 'btn-1' ? '✓ Copiado!' : 'Copiar código' }}
        </button>
      </div>

      <!-- Bloco de Código -->
      <pre class="bg-slate-900 text-slate-100 p-4 rounded-xl text-sm font-mono overflow-x-auto shadow-inner border border-slate-800 leading-relaxed"><code>&lt;Button
  :disabled="isSubmitDisabled || isLoading"
  @click="submitSignIn"
&gt;ENTRAR&lt;/Button&gt;</code></pre>

      <!-- Componente Renderizado -->
      <div class="p-4 bg-gray-500/40 border border-gray-600 rounded-xl space-y-3">
        <div class="text-xs text-gray-700 font-semibold mb-1">Visualização:</div>
        <Button
          :disabled="isSubmitDisabled || isLoading"
          @click="submitSignIn"
        >ENTRAR</Button>
        
        <div class="flex items-center gap-4 pt-2 text-xs text-gray-700">
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" v-model="isSubmitDisabled" class="rounded" />
            <span>Simular desabilitado (:disabled)</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Outras Variações de Button -->
    <div class="space-y-4 pt-4 border-t border-gray-600">
      <h3 class="text-sm font-semibold text-secondary uppercase tracking-wider">
        Outras Variações
      </h3>

      <!-- Secondary -->
      <div class="space-y-2">
        <pre class="bg-slate-900 text-slate-100 p-3 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800"><code>&lt;Button variant="secondary" @click="navigateToSignUp"&gt;CRIAR CONTA&lt;/Button&gt;</code></pre>
        <div class="p-3 bg-gray-500/40 border border-gray-600 rounded-xl">
          <Button variant="secondary" @click="sampleClick('CRIAR CONTA')">CRIAR CONTA</Button>
        </div>
      </div>

      <!-- Size sm -->
      <div class="space-y-2">
        <pre class="bg-slate-900 text-slate-100 p-3 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800"><code>&lt;Button size="sm" variant="primary"&gt;BOTÃO PEQUENO&lt;/Button&gt;</code></pre>
        <div class="p-3 bg-gray-500/40 border border-gray-600 rounded-xl">
          <Button size="sm" variant="primary" @click="sampleClick('BOTÃO PEQUENO')">BOTÃO PEQUENO</Button>
        </div>
      </div>

      <!-- isFull -->
      <div class="space-y-2">
        <pre class="bg-slate-900 text-slate-100 p-3 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800"><code>&lt;Button isFull variant="primary"&gt;BOTÃO LARGURA TOTAL&lt;/Button&gt;</code></pre>
        <div class="p-3 bg-gray-500/40 border border-gray-600 rounded-xl">
          <Button isFull variant="primary" @click="sampleClick('BOTÃO LARGURA TOTAL')">BOTÃO LARGURA TOTAL</Button>
        </div>
      </div>
    </div>
  </section>
</template>
