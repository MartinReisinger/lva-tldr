<script lang="ts" setup>
const locale = useLocale();
const emailRevealed = ref(false);

const t = computed(() => {
  if (locale.value === "de") {
    return {
      title: "Impressum",
      description: "Offenlegung gemäß § 25 Mediengesetz",
      provider: "Diensteanbieter & Medieninhaber",
      contact: "Kontakt",
      analytics: "Analyse & Statistik",
      analyticsText1: "Diese Website verwendet ",
      analyticsText2:
        " zur anonymen Besucherstatistik. GoatCounter speichert keine personenbezogenen Daten und setzt keine Cookies. Weitere Informationen: ",
      revealEmail: "anzeigen",
    };
  }
  return {
    title: "Legal Notice",
    description: "Disclosure according to § 25 Austrian Media Act",
    provider: "Service Provider & Media Owner",
    contact: "Contact",
    analytics: "Analytics & Statistics",
    analyticsText1: "This website uses ",
    analyticsText2:
      " for anonymous visitor statistics. GoatCounter does not store any personal data and does not set cookies. Further information: ",
    revealEmail: "show",
  };
});
</script>

<template>
  <UContainer class="py-8 max-w-xl space-y-6">
    <UPageHeader :description="t.description" :title="t.title" />

    <UCard>
      <template #header>
        <p class="font-semibold">{{ t.provider }}</p>
      </template>
      <p><strong>Martin Reisinger</strong><br />Linz, Austria</p>
    </UCard>

    <UCard>
      <template #header>
        <p class="font-semibold">{{ t.contact }}</p>
      </template>
      <p>
        E-Mail:
        <button
          v-if="!emailRevealed"
          class="text-primary underline cursor-pointer hover:text-primary/80"
          @click="emailRevealed = true"
        >
          {{ t.revealEmail }}
        </button>
        <a
          v-else
          class="text-primary underline"
          href="mailto:martin.projekte1@gmail.com"
        >
          martin.projekte1@gmail.com
        </a>
      </p>
    </UCard>

    <UCard>
      <template #header>
        <p class="font-semibold">{{ t.analytics }}</p>
      </template>
      <p>
        {{ t.analyticsText1 }}<strong>GoatCounter</strong>{{ t.analyticsText2 }}
        <a
          class="text-primary underline"
          href="https://www.goatcounter.com/help/privacy"
          target="_blank"
        >
          goatcounter.com/help/privacy
        </a>
      </p>
    </UCard>
  </UContainer>
</template>
