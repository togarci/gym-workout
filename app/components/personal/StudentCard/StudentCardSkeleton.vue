<script lang="ts" setup></script>

<template>
  <div
    data-testId="student-card-skeleton"
    class="rounded-2xl shadow-custom bg-white p-5 flex flex-col justify-between gap-4 border border-gray-600 animate-pulse"
  >
    <div class="flex items-center gap-3 min-w-0">
      <div class="size-10 rounded-xl bg-gray-200 shrink-0" />
      <div class="flex flex-col gap-2 flex-1 min-w-0">
        <div class="h-5 bg-gray-200 rounded-md w-40" />
        <div class="h-4 bg-gray-200 rounded-md w-28" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="h-4 bg-gray-200 rounded-md w-48" />
      <div class="h-4 bg-gray-200 rounded-md w-56" />
    </div>

    <div class="pt-3 border-t border-gray-600 flex items-center justify-between">
      <div class="h-4 bg-gray-200 rounded-md w-20" />
      <div class="h-4 bg-gray-200 rounded-md w-24" />
    </div>
  </div>
</template>
