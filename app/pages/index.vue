<script setup lang="ts">
const { data: allTopics } = await useAsyncData("topics", () =>
  queryCollection("topics").order("order", "ASC").all(),
);

const topics = computed(() =>
  (allTopics.value ?? []).filter((topic) =>
    topic.path.split('/').filter(Boolean).length === 1,
  ),
);

function childCount(path: string) {
  const prefix = `${path}/`;
  return (allTopics.value ?? []).filter((topic) => {
    if (!topic.path.startsWith(prefix)) return false;
    return topic.path.slice(prefix.length).split('/').length === 1;
  }).length;
}

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
      <p class="mt-3 text-muted">Lehrveranstaltung war to long; didn't read.</p>
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
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <UIcon
                  :name="topic.kind === 'group' ? 'i-lucide-folder' : 'i-lucide-file-text'"
                  class="size-5 shrink-0 text-primary"
                />
                <h2 class="font-semibold text-highlighted">{{ topic.title }}</h2>
              </div>
              <p class="mt-2 text-sm text-muted">{{ topic.description }}</p>
              <p v-if="topic.kind === 'group'" class="mt-3 text-xs font-medium text-primary">
                {{ childCount(topic.path) }} summaries
              </p>
            </div>
            <UIcon
              :name="topic.kind === 'group' ? 'i-lucide-chevron-right' : 'i-lucide-arrow-up-right'"
              class="size-5 shrink-0 text-primary"
            />
          </div>
        </UCard>
      </NuxtLink>
    </div>
  </UContainer>
</template>
