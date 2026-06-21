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
</script>

<template>
  <UContainer v-if="page" class="py-6 sm:py-10">
    <div class="mb-6 lg:hidden">
      <UContentToc highlight highlight-variant="circuit" :links="tocLinks" />
    </div>

    <div class="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <article class="min-w-0">
        <ContentRenderer :value="page" />
      </article>

      <aside class="hidden lg:block">
        <UContentToc highlight highlight-variant="circuit" :links="tocLinks" />
      </aside>
    </div>
  </UContainer>
</template>
