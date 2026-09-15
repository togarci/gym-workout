<script setup lang="ts">
import { ref } from 'vue';

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
        <h2 class="text-xl font-bold text-secondary">Ícones (SVGs)</h2>
        <span class="text-xs font-semibold px-2.5 py-1 bg-gray-600 text-gray-700 rounded-lg font-mono">
          share/SVG
        </span>
      </div>
      <p class="text-sm text-gray-700 mt-1">
        Todos os ícones vetoriais disponíveis no projeto agrupados neste card único. Aceitam a prop <code class="font-mono text-xs">className</code> para customização de cor e tamanho com classes utilitárias do Tailwind.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 1. ArrowLeft -->
      <div class="flex flex-col justify-between p-4 bg-gray-500/30 border border-gray-600 rounded-xl space-y-3">
        <div>
          <div class="flex items-center justify-between mb-1">
            <span class="font-bold text-sm text-secondary font-mono">&lt;ArrowLeft /&gt;</span>
            <button
              type="button"
              @click="copyCode(`<ArrowLeft className=&quot;size-6 fill-secondary&quot; />`, 'svg-arrow')"
              class="text-xs text-primary hover:underline cursor-pointer"
            >
              {{ copiedSnippet === 'svg-arrow' ? '✓ Copiado!' : 'Copiar' }}
            </button>
          </div>
          <pre class="bg-slate-900 text-slate-100 p-2.5 rounded-lg text-xs font-mono overflow-x-auto border border-slate-800"><code>&lt;ArrowLeft className="size-6 fill-secondary" /&gt;</code></pre>
        </div>
        <div class="flex items-center justify-center p-3 bg-white rounded-lg border border-gray-600 shadow-xs">
          <ArrowLeft className="size-6 fill-secondary" />
        </div>
      </div>

      <!-- 2. FitSVG -->
      <div class="flex flex-col justify-between p-4 bg-gray-500/30 border border-gray-600 rounded-xl space-y-3">
        <div>
          <div class="flex items-center justify-between mb-1">
            <span class="font-bold text-sm text-secondary font-mono">&lt;FitSVG /&gt;</span>
            <button
              type="button"
              @click="copyCode(`<FitSVG className=&quot;size-6 fill-primary&quot; />`, 'svg-fit')"
              class="text-xs text-primary hover:underline cursor-pointer"
            >
              {{ copiedSnippet === 'svg-fit' ? '✓ Copiado!' : 'Copiar' }}
            </button>
          </div>
          <pre class="bg-slate-900 text-slate-100 p-2.5 rounded-lg text-xs font-mono overflow-x-auto border border-slate-800"><code>&lt;FitSVG className="size-6 fill-primary" /&gt;</code></pre>
        </div>
        <div class="flex items-center justify-center p-3 bg-white rounded-lg border border-gray-600 shadow-xs">
          <FitSVG className="size-6 fill-primary" />
        </div>
      </div>

      <!-- 3. EyeSVG -->
      <div class="flex flex-col justify-between p-4 bg-gray-500/30 border border-gray-600 rounded-xl space-y-3">
        <div>
          <div class="flex items-center justify-between mb-1">
            <span class="font-bold text-sm text-secondary font-mono">&lt;EyeSVG /&gt;</span>
            <button
              type="button"
              @click="copyCode(`<EyeSVG className=&quot;size-6 fill-secondary&quot; />`, 'svg-eye')"
              class="text-xs text-primary hover:underline cursor-pointer"
            >
              {{ copiedSnippet === 'svg-eye' ? '✓ Copiado!' : 'Copiar' }}
            </button>
          </div>
          <pre class="bg-slate-900 text-slate-100 p-2.5 rounded-lg text-xs font-mono overflow-x-auto border border-slate-800"><code>&lt;EyeSVG className="size-6 fill-secondary" /&gt;</code></pre>
        </div>
        <div class="flex items-center justify-center p-3 bg-white rounded-lg border border-gray-600 shadow-xs">
          <EyeSVG className="size-6 fill-secondary" />
        </div>
      </div>

      <!-- 4. CloseEye -->
      <div class="flex flex-col justify-between p-4 bg-gray-500/30 border border-gray-600 rounded-xl space-y-3">
        <div>
          <div class="flex items-center justify-between mb-1">
            <span class="font-bold text-sm text-secondary font-mono">&lt;CloseEye /&gt;</span>
            <button
              type="button"
              @click="copyCode(`<CloseEye className=&quot;size-6 fill-secondary&quot; />`, 'svg-closeeye')"
              class="text-xs text-primary hover:underline cursor-pointer"
            >
              {{ copiedSnippet === 'svg-closeeye' ? '✓ Copiado!' : 'Copiar' }}
            </button>
          </div>
          <pre class="bg-slate-900 text-slate-100 p-2.5 rounded-lg text-xs font-mono overflow-x-auto border border-slate-800"><code>&lt;CloseEye className="size-6 fill-secondary" /&gt;</code></pre>
        </div>
        <div class="flex items-center justify-center p-3 bg-white rounded-lg border border-gray-600 shadow-xs">
          <CloseEye className="size-6 fill-secondary" />
        </div>
      </div>

      <!-- 5. InfoSVG -->
      <div class="flex flex-col justify-between p-4 bg-gray-500/30 border border-gray-600 rounded-xl space-y-3">
        <div>
          <div class="flex items-center justify-between mb-1">
            <span class="font-bold text-sm text-secondary font-mono">&lt;InfoSVG /&gt;</span>
            <button
              type="button"
              @click="copyCode(`<InfoSVG className=&quot;fill-primary size-5&quot; />`, 'svg-info')"
              class="text-xs text-primary hover:underline cursor-pointer"
            >
              {{ copiedSnippet === 'svg-info' ? '✓ Copiado!' : 'Copiar' }}
            </button>
          </div>
          <pre class="bg-slate-900 text-slate-100 p-2.5 rounded-lg text-xs font-mono overflow-x-auto border border-slate-800"><code>&lt;InfoSVG className="fill-primary size-5" /&gt;</code></pre>
        </div>
        <div class="flex items-center justify-center p-3 bg-white rounded-lg border border-gray-600 shadow-xs">
          <InfoSVG className="fill-primary size-5" />
        </div>
      </div>

      <!-- 6. CloseSVG -->
      <div class="flex flex-col justify-between p-4 bg-gray-500/30 border border-gray-600 rounded-xl space-y-3">
        <div>
          <div class="flex items-center justify-between mb-1">
            <span class="font-bold text-sm text-secondary font-mono">&lt;CloseSVG /&gt;</span>
            <button
              type="button"
              @click="copyCode(`<CloseSVG className=&quot;size-6 fill-secondary&quot; />`, 'svg-close')"
              class="text-xs text-primary hover:underline cursor-pointer"
            >
              {{ copiedSnippet === 'svg-close' ? '✓ Copiado!' : 'Copiar' }}
            </button>
          </div>
          <pre class="bg-slate-900 text-slate-100 p-2.5 rounded-lg text-xs font-mono overflow-x-auto border border-slate-800"><code>&lt;CloseSVG className="size-6 fill-secondary" /&gt;</code></pre>
        </div>
        <div class="flex items-center justify-center p-3 bg-white rounded-lg border border-gray-600 shadow-xs">
          <CloseSVG className="size-6 fill-secondary" />
        </div>
      </div>

      <!-- 7. CheckboxSVG -->
      <div class="flex flex-col justify-between p-4 bg-gray-500/30 border border-gray-600 rounded-xl space-y-3">
        <div>
          <div class="flex items-center justify-between mb-1">
            <span class="font-bold text-sm text-secondary font-mono">&lt;CheckboxSVG /&gt;</span>
            <button
              type="button"
              @click="copyCode(`<CheckboxSVG className=&quot;fill-none size-4 text-tertiary&quot; />`, 'svg-checkbox')"
              class="text-xs text-primary hover:underline cursor-pointer"
            >
              {{ copiedSnippet === 'svg-checkbox' ? '✓ Copiado!' : 'Copiar' }}
            </button>
          </div>
          <pre class="bg-slate-900 text-slate-100 p-2.5 rounded-lg text-xs font-mono overflow-x-auto border border-slate-800"><code>&lt;CheckboxSVG className="fill-none size-4 text-tertiary" /&gt;</code></pre>
        </div>
        <div class="flex items-center justify-center p-3 bg-secondary rounded-lg border border-gray-600 shadow-xs">
          <CheckboxSVG className="fill-none size-5 text-tertiary" />
        </div>
      </div>
    </div>
  </section>
</template>
