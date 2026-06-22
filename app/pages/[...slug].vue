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
  <UContainer v-if="page?.kind === 'group'" class="py-6 sm:py-10">
    <AppPageHeader
      :title="page.title"
      :description="page.description"
      eyebrow="Summary collection"
      icon="i-lucide-folder-open"
      back-to="/"
      back-label="All topics"
    />

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
    <AppPageHeader
      :title="page.title"
      :description="page.description"
      :back-to="parent?.path ?? '/'"
      :back-label="parent?.title ?? 'All topics'"
    >
      <template
        v-if="page.downloadPath || page.originalDownloadPath || page.solutionDownloadPath"
        #links
      >
        <UButton
          v-if="page.downloadPath"
          icon="i-heroicons-arrow-down-tray"
          color="neutral"
          variant="outline"
          size="sm"
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
          size="sm"
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
          size="sm"
          label="Download solution .md"
          :to="page.solutionDownloadPath"
          download
          external
        />
      </template>
    </AppPageHeader>

    <UContentToc
      v-if="tocLinks.length"
      class="lg:hidden"
      highlight
      highlight-variant="circuit"
      :links="tocLinks"
      :ui="{
        root: 'z-40 max-h-none overflow-visible',
        container: 'py-3 sm:py-4',
        content: 'absolute inset-x-0 top-full max-h-[calc(100vh-var(--ui-header-height)-4rem)] overflow-y-auto border-b border-default bg-default/90 px-4 pb-5 shadow-xl backdrop-blur-xl sm:px-6',
      }"
    />

    <div class="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <article class="min-w-0 pt-6 lg:pt-8">
        <ContentRenderer :value="page" />
      </article>

      <aside class="hidden lg:block">
        <UContentToc highlight highlight-variant="circuit" :links="tocLinks" />
      </aside>
    </div>
  </UContainer>
</template>
