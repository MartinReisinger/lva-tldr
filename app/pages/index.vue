<script setup lang="ts">
const { data: topics } = await useAsyncData("topics", () =>
  queryCollection("topics").order("order", "ASC").all(),
);

useSeoMeta({
  title: "LVA TL;DR",
  description: "Kompakte Zusammenfassungen für die Klausur.",
});
</script>

<template>
  <UContainer class="py-10 sm:py-16">
    <div class="max-w-2xl">
      <p class="mb-2 text-sm font-medium text-primary">Study notes</p>
      <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">LVA TL;DR</h1>
      <p class="mt-3 text-muted">
        Compact references and examples for exam preparation.
      </p>
    </div>

    <div class="mt-8 grid gap-4 sm:grid-cols-2">
      <NuxtLink
        v-for="topic in topics"
        :key="topic.path"
        :to="topic.path"
        class="group block"
      >
        <UCard class="h-full transition-colors group-hover:border-primary">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="font-semibold text-highlighted">{{ topic.title }}</h2>
              <p class="mt-2 text-sm text-muted">{{ topic.description }}</p>
            </div>
            <UIcon
              name="i-lucide-arrow-up-right"
              class="size-5 shrink-0 text-primary"
            />
          </div>
        </UCard>
      </NuxtLink>
    </div>
  </UContainer>
</template>
