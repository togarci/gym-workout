<script setup lang="ts">
import { ref } from 'vue';

const isSwitchOn1 = ref(false);
const isSwitchOn2 = ref(true);

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
        <h2 class="text-xl font-bold text-secondary">Switch</h2>
        <span class="text-xs font-semibold px-2.5 py-1 bg-gray-600 text-gray-700 rounded-lg font-mono">
          share/Switch
        </span>
      </div>
      <p class="text-sm text-gray-700 mt-1">
        Interruptor liga/desliga com transição suave via <code class="font-mono text-xs">v-model</code>. Suporta a prop <code class="font-mono text-xs">disabled</code>.
      </p>
    </div>

    <!-- Exemplo 1: Switch Padrão -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-secondary uppercase tracking-wider">
          Exemplo: Switch Padrão
        </h3>
        <button
          type="button"
          @click="copyCode(`<Switch v-model=&quot;isOn&quot; />`, 'sw-1')"
          class="text-xs font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          {{ copiedSnippet === 'sw-1' ? '✓ Copiado!' : 'Copiar código' }}
        </button>
      </div>

      <pre class="bg-slate-900 text-slate-100 p-4 rounded-xl text-sm font-mono overflow-x-auto shadow-inner border border-slate-800 leading-relaxed"><code>&lt;Switch v-model="isOn" /&gt;</code></pre>

      <div class="p-4 bg-gray-500/40 border border-gray-600 rounded-xl flex items-center gap-4">
        <Switch v-model="isSwitchOn1" />
        <span class="text-sm font-medium text-secondary">
          Status atual: <strong class="font-mono">{{ isSwitchOn1 ? 'Ligado (true)' : 'Desligado (false)' }}</strong>
        </span>
      </div>
    </div>

    <!-- Exemplo 2: Switch com Rótulo e Desabilitado -->
    <div class="space-y-3 pt-4 border-t border-gray-600">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-secondary uppercase tracking-wider">
          Exemplo: Com Rótulo e Desabilitado
        </h3>
        <button
          type="button"
          @click="copyCode(`<div class=&quot;flex items-center gap-3&quot;>\n  <Switch v-model=&quot;isOn&quot; />\n  <span>Notificações</span>\n</div>\n<Switch :modelValue=&quot;true&quot; disabled />`, 'sw-2')"
          class="text-xs font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          {{ copiedSnippet === 'sw-2' ? '✓ Copiado!' : 'Copiar código' }}
        </button>
      </div>

      <pre class="bg-slate-900 text-slate-100 p-4 rounded-xl text-sm font-mono overflow-x-auto shadow-inner border border-slate-800 leading-relaxed"><code>&lt;div class="flex items-center gap-3"&gt;
  &lt;Switch v-model="isOn" /&gt;
  &lt;span&gt;Notificações&lt;/span&gt;
&lt;/div&gt;
&lt;Switch :modelValue="true" disabled /&gt;</code></pre>

      <div class="p-4 bg-gray-500/40 border border-gray-600 rounded-xl space-y-3">
        <div class="flex items-center gap-3 py-2 px-3 bg-white rounded-xl shadow-xs border border-gray-600 max-w-sm">
          <Switch v-model="isSwitchOn2" />
          <span class="text-base font-medium text-secondary">Notificações</span>
        </div>
        <div class="flex items-center gap-3 py-2 px-3 bg-white rounded-xl shadow-xs border border-gray-600 max-w-sm">
          <Switch :modelValue="true" disabled />
          <span class="text-base font-medium text-secondary">Desabilitado</span>
        </div>
      </div>
    </div>
  </section>
</template>
