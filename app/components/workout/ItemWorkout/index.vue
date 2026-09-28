<script lang="ts" setup>
defineProps<{
  exercise: {
    id: number;
    name: string;
    sets: number | string;
    reps: number | string;
    obs?: string;
    notes?: string;
    weight?: string;
  };
}>();

const emit = defineEmits<{
  (e: 'updateWeight', exerciseId: number, weight: string): void;
}>();

const isChecked = defineModel();
const obsBtnRef = ref<any>();
const weightBtnRef = ref<any>();
const isOpenModal = ref(false);
const isWeightModalOpen = ref(false);
const weightInput = ref('');
const isSaving = ref(false);

function setCheck(event: MouseEvent) {
  const eventTarget = event.target as HTMLElement;
  const isObsBtn = obsBtnRef.value?.$el?.contains(eventTarget) || eventTarget === obsBtnRef.value?.$el;
  const isWeightBtn = weightBtnRef.value?.$el?.contains(eventTarget) || eventTarget === weightBtnRef.value?.$el;
  if (!isObsBtn && !isWeightBtn) isChecked.value = !isChecked.value;
}

function openWeightModal(currentWeight?: string) {
  weightInput.value = currentWeight || '';
  isWeightModalOpen.value = true;
}

async function saveWeight(exerciseId: number) {
  try {
    isSaving.value = true;
    await $fetch(`/api/workout-exercise/weight`, {
      method: 'PUT',
      body: {
        id: exerciseId,
        weight: weightInput.value,
      },
    });
    // Updating local state (usually you'd emit an update or use a store to update it centrally)
    emit('updateWeight', exerciseId, weightInput.value);
    isWeightModalOpen.value = false;
  } catch (error) {
    console.error('Error saving weight:', error);
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <div class="w-full">
    <Modal
      v-model="isOpenModal"
      title="Observação"
    >
      <span class="text-base">
        {{ exercise.obs }}
      </span>
    </Modal>
    
    <Modal
      v-model="isWeightModalOpen"
      title="Peso"
    >
      <div class="flex flex-col gap-4">
        <input 
          v-model="weightInput" 
          type="text" 
          class="border rounded-md px-3 py-2 w-full" 
          placeholder="Ex: 45" 
        />
        <Button @click="saveWeight(exercise.id)" :disabled="isSaving"> 
          {{ isSaving ? 'Salvando...' : 'Salvar' }} 
        </Button>
      </div>
    </Modal>

    <div
      dataTestId="item-container"
      @click="setCheck"
      class="flex flex-col px-5 py-4 bg-white rounded-2xl gap-2 shadow-custom cursor-pointer"
    >
      <div class="flex items-center justify-between w-full">
        <span
          dataTestId="item-name"
          class="line-clamp-1 font-semibold text-lg text-secondary"
        >
          {{ exercise.name }}</span
        >

        <Checkbox :modelValue="isChecked" />
      </div>

      <div class="flex items-center text-base gap-2.5 flex-wrap">
        <div class="flex items-center gap-1 text-gray-700">
          <span
            dataTestId="item-serie"
            class="font-semibold"
            >Serie:</span
          ><span>{{ exercise.sets }}</span>
        </div>
        <div class="flex items-center gap-1 text-gray-700">
          <span
            dataTestId="item-rep"
            class="font-semibold"
            >Rep:</span
          ><span>{{ exercise.reps }}</span>
        </div>

        <WorkoutItemButton
          v-if="exercise.obs"
          ref="obsBtnRef"
          dataTestId="obs-btn"
          label="Obs"
          @click.stop="isOpenModal = true"
        >
          <InfoSVG />
        </WorkoutItemButton>

        <WorkoutItemButton
          ref="weightBtnRef"
          dataTestId="weight-btn"
          :label="exercise.weight ? `${exercise.weight} kg` : 'Peso'"
          @click.stop="openWeightModal(exercise.weight)"
        >
          <FitSVG className="fill-primary size-4"/>
        </WorkoutItemButton>
      </div>
    </div>
  </div>
</template>
