<script setup lang="ts">
useHead({
  script: [
    {
      src: '//gc.zgo.at/count.js',
      async: true,
      'data-goatcounter': 'https://lva-tldr.goatcounter.com/count',
    },
  ],
});
</script>

<template>
  <UApp>
    <AppHeader />
    <UMain>
      <NuxtPage />
    </UMain>
    <footer class="border-t border-default py-6 text-sm text-muted">
      <UContainer class="flex justify-between items-center gap-4">
        <p>LVA TL;DR - © Martin Reisinger</p>
        <UButton to="/impressum" variant="link" size="xs" color="neutral">Impressum</UButton>
      </UContainer>
    </footer>
  </UApp>
</template>
