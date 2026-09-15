<script setup lang="ts">
import { ref } from 'vue';

const isModalSimpleOpen = ref(false);
const isModalConfirmOpen = ref(false);
const modalConfirmStatus = ref('');

function onModalConfirm() {
  modalConfirmStatus.value = 'Ação confirmada pelo usuário no modal!';
  setTimeout(() => {
    modalConfirmStatus.value = '';
  }, 3000);
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
        <h2 class="text-xl font-bold text-secondary">Modal</h2>
        <span class="text-xs font-semibold px-2.5 py-1 bg-gray-600 text-gray-700 rounded-lg font-mono">
          share/modal
        </span>
      </div>
      <p class="text-sm text-gray-700 mt-1">
        Modal com backdrop blur, fechamento ao clicar fora, suporte a título, slots personalizados e ações de confirmação/cancelamento opcionais.
      </p>
    </div>

    <!-- Mensagem de confirmação -->
    <div
      v-if="modalConfirmStatus"
      class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center justify-between transition-all"
    >
      <span>{{ modalConfirmStatus }}</span>
      <button @click="modalConfirmStatus = ''" class="text-emerald-600 hover:text-emerald-900 underline ml-2">Fechar</button>
    </div>

    <!-- Exemplo 1: Modal com Confirmação -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-secondary uppercase tracking-wider">
          Exemplo: Modal com Confirmação (useConfirm)
        </h3>
        <button
          type="button"
          @click="copyCode(`<Button @click=&quot;isOpen = true&quot;>ABRIR MODAL</Button>\n\n<Modal\n  v-model=&quot;isOpen&quot;\n  title=&quot;Finalizar Treino&quot;\n  useConfirm\n  @confirm=&quot;handleConfirm&quot;\n>\n  <span class=&quot;text-base text-gray-700&quot;>\n    Deseja realmente marcar todos os exercícios como concluídos?\n  </span>\n</Modal>`, 'mod-1')"
          class="text-xs font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          {{ copiedSnippet === 'mod-1' ? '✓ Copiado!' : 'Copiar código' }}
        </button>
      </div>

      <pre class="bg-slate-900 text-slate-100 p-4 rounded-xl text-sm font-mono overflow-x-auto shadow-inner border border-slate-800 leading-relaxed"><code>&lt;Button @click="isOpen = true"&gt;ABRIR MODAL&lt;/Button&gt;

&lt;Modal
  v-model="isOpen"
  title="Finalizar Treino"
  useConfirm
  @confirm="handleConfirm"
&gt;
  &lt;span class="text-base text-gray-700"&gt;
    Deseja realmente marcar todos os exercícios como concluídos?
  &lt;/span&gt;
&lt;/Modal&gt;</code></pre>

      <div class="p-4 bg-gray-500/40 border border-gray-600 rounded-xl space-y-3">
        <div class="text-xs text-gray-700 font-semibold mb-1">Visualização:</div>
        <Button @click="isModalConfirmOpen = true">ABRIR MODAL COM CONFIRMAÇÃO</Button>

        <!-- Instância do Modal Interativo -->
        <Modal
          v-model="isModalConfirmOpen"
          title="Finalizar Treino"
          useConfirm
          @confirm="onModalConfirm"
        >
          <div class="space-y-2">
            <p class="text-base text-gray-700">
              Deseja realmente marcar todos os exercícios como concluídos?
            </p>
            <p class="text-xs text-gray-700">
              Esta ação atualizará o status do seu treino no sistema.
            </p>
          </div>
        </Modal>
      </div>
    </div>

    <!-- Exemplo 2: Modal Simples (Sem confirmação) -->
    <div class="space-y-3 pt-4 border-t border-gray-600">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-secondary uppercase tracking-wider">
          Exemplo: Modal Simples / Informativo
        </h3>
        <button
          type="button"
          @click="copyCode(`<Button variant=&quot;secondary&quot; @click=&quot;isOpen = true&quot;>VER OBSERVAÇÃO</Button>\n\n<Modal\n  v-model=&quot;isOpen&quot;\n  title=&quot;Observação do Exercício&quot;\n>\n  <span class=&quot;text-base&quot;>\n    Manter a postura ereta e controlar a descida.\n  </span>\n</Modal>`, 'mod-2')"
          class="text-xs font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          {{ copiedSnippet === 'mod-2' ? '✓ Copiado!' : 'Copiar código' }}
        </button>
      </div>

      <pre class="bg-slate-900 text-slate-100 p-4 rounded-xl text-sm font-mono overflow-x-auto shadow-inner border border-slate-800 leading-relaxed"><code>&lt;Button variant="secondary" @click="isOpen = true"&gt;VER OBSERVAÇÃO&lt;/Button&gt;

&lt;Modal
  v-model="isOpen"
  title="Observação do Exercício"
&gt;
  &lt;span class="text-base"&gt;
    Manter a postura ereta e controlar a descida.
  &lt;/span&gt;
&lt;/Modal&gt;</code></pre>

      <div class="p-4 bg-gray-500/40 border border-gray-600 rounded-xl space-y-3">
        <div class="text-xs text-gray-700 font-semibold mb-1">Visualização:</div>
        <Button variant="secondary" @click="isModalSimpleOpen = true">VER OBSERVAÇÃO</Button>

        <!-- Instância do Modal Simples -->
        <Modal
          v-model="isModalSimpleOpen"
          title="Observação do Exercício"
        >
          <div class="space-y-2">
            <p class="text-base text-gray-700">
              Manter a postura ereta e controlar a fase excêntrica do movimento.
            </p>
            <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <InfoSVG className="fill-amber-600 size-4 shrink-0" />
              <span>Dica: Descanse de 45 a 60 segundos entre as séries.</span>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  </section>
</template>
