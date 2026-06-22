<script setup lang="ts">
const route = useRoute();
const { data: page } = await useAsyncData(`topic:${route.path}`, () =>
  queryCollection("topics").path(route.path).first(),
);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Topic not found",
  });
}

useSeoMeta({
  title: () => `${page.value?.title} · LVA TL;DR`,
  description: () => page.value?.description,
});

const tocLinks = computed(() => page.value?.body?.toc?.links ?? []);

const { data: children } = await useAsyncData(`children:${route.path}`, async () => {
  if (page.value?.kind !== 'group') return [];

  const prefix = `${page.value.path}/`;
  const candidates = await queryCollection('topics').order('order', 'ASC').all();
  return candidates.filter((candidate) => {
    if (!candidate.path.startsWith(prefix)) return false;
    return candidate.path.slice(prefix.length).split('/').length === 1;
  });
});

const parentPath = computed(() => {
  const segments = route.path.split('/').filter(Boolean);
  return segments.length === 2 ? `/${segments[0]}` : undefined;
});

const { data: parent } = await useAsyncData(`parent:${route.path}`, async () => {
  const path = parentPath.value;
  if (!path) return null;
  return await queryCollection('topics').path(path).first();
});
</script>

<template>
  <UContainer v-if="page?.kind === 'group'" class="py-10 sm:py-16">
    <NuxtLink
      to="/"
      class="mb-5 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-highlighted"
    >
      <UIcon name="i-lucide-arrow-left" class="size-4" />
      All topics
    </NuxtLink>

    <div class="max-w-2xl">
      <div class="mb-3 flex items-center gap-3">
        <span class="rounded-lg bg-primary/10 p-2 text-primary">
          <UIcon name="i-lucide-folder-open" class="size-6" />
        </span>
        <p class="text-sm font-medium text-primary">Summary collection</p>
      </div>
      <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">{{ page.title }}</h1>
      <p class="mt-3 text-muted">{{ page.description }}</p>
    </div>

    <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="child in children"
        :key="child.path"
        :to="child.path"
        class="group block"
      >
        <UCard class="h-full transition-colors group-hover:border-primary">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <UIcon name="i-lucide-file-text" class="mb-3 size-5 text-primary" />
              <h2 class="font-semibold text-highlighted">{{ child.title }}</h2>
              <p class="mt-2 text-sm text-muted">{{ child.description }}</p>
            </div>
            <UIcon name="i-lucide-arrow-up-right" class="size-5 shrink-0 text-primary" />
          </div>
        </UCard>
      </NuxtLink>
    </div>
  </UContainer>

  <UContainer v-else-if="page" class="py-6 sm:py-10">
    <NuxtLink
      v-if="parent"
      :to="parent.path"
      class="mb-5 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-highlighted"
    >
      <UIcon name="i-lucide-arrow-left" class="size-4" />
      {{ parent.title }}
    </NuxtLink>

    <div class="mb-6 lg:hidden">
      <UContentToc highlight highlight-variant="circuit" :links="tocLinks" />
    </div>

    <div class="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <article class="min-w-0 relative">
        <div
          v-if="page.downloadPath || page.originalDownloadPath || page.solutionDownloadPath"
          class="mb-4 flex flex-wrap justify-end gap-2"
        >
          <UButton
            v-if="page.downloadPath"
            icon="i-heroicons-arrow-down-tray"
            color="neutral"
            variant="outline"
            label="Download .md"
            :to="page.downloadPath"
            download
            external
          />
          <UButton
            v-if="page.originalDownloadPath"
            icon="i-heroicons-arrow-down-tray"
            color="neutral"
            variant="outline"
            label="Download original .md"
            :to="page.originalDownloadPath"
            download
            external
          />
          <UButton
            v-if="page.solutionDownloadPath"
            icon="i-heroicons-arrow-down-tray"
            color="neutral"
            variant="outline"
            label="Download solution .md"
            :to="page.solutionDownloadPath"
            download
            external
          />
        </div>
        <ContentRenderer :value="page" />
      </article>

      <aside class="hidden lg:block">
        <UContentToc highlight highlight-variant="circuit" :links="tocLinks" />
      </aside>
    </div>
  </UContainer>
</template>
