<script setup lang="ts">
import { ref } from 'vue';

const inputDemoText = ref('');
const inputDemoPassword = ref('');
const inputDemoError = ref('admin@empresa');

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
        <h2 class="text-xl font-bold text-secondary">Input</h2>
        <span class="text-xs font-semibold px-2.5 py-1 bg-gray-600 text-gray-700 rounded-lg font-mono">
          share/Input
        </span>
      </div>
      <p class="text-sm text-gray-700 mt-1">
        Campo de entrada de texto com suporte a label, placeholder, estado de erro e alternância automática de visibilidade para tipo <code class="font-mono text-xs">password</code>.
      </p>
    </div>

    <!-- Exemplo 1: Texto Padrão -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-secondary uppercase tracking-wider">
          Exemplo: Campo de Texto Padrão
        </h3>
        <button
          type="button"
          @click="copyCode(`<Input\n  v-model=&quot;userName&quot;\n  label=&quot;Nome de usuário&quot;\n  name=&quot;userName&quot;\n  placeholder=&quot;Digite o nome de usuário&quot;\n/>`, 'inp-1')"
          class="text-xs font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          {{ copiedSnippet === 'inp-1' ? '✓ Copiado!' : 'Copiar código' }}
        </button>
      </div>

      <pre class="bg-slate-900 text-slate-100 p-4 rounded-xl text-sm font-mono overflow-x-auto shadow-inner border border-slate-800 leading-relaxed"><code>&lt;Input
  v-model="userName"
  label="Nome de usuário"
  name="userName"
  placeholder="Digite o nome de usuário"
/&gt;</code></pre>

      <div class="p-4 bg-gray-500/40 border border-gray-600 rounded-xl space-y-2">
        <div class="text-xs text-gray-700 font-semibold mb-1">Visualização:</div>
        <Input
          v-model="inputDemoText"
          label="Nome de usuário"
          name="userName"
          placeholder="Digite o nome de usuário"
        />
        <p class="text-xs text-gray-700 pt-1">
          Valor digitado no v-model: <strong class="text-secondary font-mono">{{ inputDemoText || '(vazio)' }}</strong>
        </p>
      </div>
    </div>

    <!-- Exemplo 2: Tipo Password -->
    <div class="space-y-3 pt-4 border-t border-gray-600">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-secondary uppercase tracking-wider">
          Exemplo: Campo de Senha (com Toggle de Visibilidade)
        </h3>
        <button
          type="button"
          @click="copyCode(`<Input\n  v-model=&quot;password&quot;\n  label=&quot;Senha&quot;\n  type=&quot;password&quot;\n  name=&quot;password&quot;\n  placeholder=&quot;Digite a sua senha&quot;\n/>`, 'inp-2')"
          class="text-xs font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          {{ copiedSnippet === 'inp-2' ? '✓ Copiado!' : 'Copiar código' }}
        </button>
      </div>

      <pre class="bg-slate-900 text-slate-100 p-4 rounded-xl text-sm font-mono overflow-x-auto shadow-inner border border-slate-800 leading-relaxed"><code>&lt;Input
  v-model="password"
  label="Senha"
  type="password"
  name="password"
  placeholder="Digite a sua senha"
/&gt;</code></pre>

      <div class="p-4 bg-gray-500/40 border border-gray-600 rounded-xl space-y-2">
        <div class="text-xs text-gray-700 font-semibold mb-1">Visualização:</div>
        <Input
          v-model="inputDemoPassword"
          label="Senha"
          type="password"
          name="password"
          placeholder="Digite a sua senha"
        />
      </div>
    </div>

    <!-- Exemplo 3: Campo com Erro -->
    <div class="space-y-3 pt-4 border-t border-gray-600">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-secondary uppercase tracking-wider">
          Exemplo: Campo com Mensagem de Erro
        </h3>
        <button
          type="button"
          @click="copyCode(`<Input\n  v-model=&quot;email&quot;\n  label=&quot;E-mail&quot;\n  name=&quot;email&quot;\n  placeholder=&quot;Digite seu e-mail&quot;\n  error=&quot;E-mail inválido ou já cadastrado&quot;\n/>`, 'inp-3')"
          class="text-xs font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          {{ copiedSnippet === 'inp-3' ? '✓ Copiado!' : 'Copiar código' }}
        </button>
      </div>

      <pre class="bg-slate-900 text-slate-100 p-4 rounded-xl text-sm font-mono overflow-x-auto shadow-inner border border-slate-800 leading-relaxed"><code>&lt;Input
  v-model="email"
  label="E-mail"
  name="email"
  placeholder="Digite seu e-mail"
  error="E-mail inválido ou já cadastrado"
/&gt;</code></pre>

      <div class="p-4 bg-gray-500/40 border border-gray-600 rounded-xl space-y-2">
        <div class="text-xs text-gray-700 font-semibold mb-1">Visualização:</div>
        <Input
          v-model="inputDemoError"
          label="E-mail"
          name="email"
          placeholder="Digite seu e-mail"
          error="E-mail inválido ou já cadastrado"
        />
      </div>
    </div>
  </section>
</template>
