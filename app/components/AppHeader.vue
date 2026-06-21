<template>
  <header
    class="sticky top-0 z-50 border-b border-default bg-default/90 backdrop-blur"
  >
    <UContainer class="flex h-14 items-center justify-between gap-4">
      <NuxtLink to="/" class="flex min-w-0 items-center gap-2 font-semibold">
        <UIcon
          name="i-lucide-graduation-cap"
          class="size-5 shrink-0 text-primary"
        />
        <span class="truncate">LVA TL;DR</span>
      </NuxtLink>

      <div class="flex items-center gap-2">
        <span
          v-if="$route.path !== '/'"
          class="hidden text-sm text-muted sm:block"
        >
          Formal Models
        </span>
        <UColorModeButton color="neutral" variant="ghost" />
      </div>
    </UContainer>
  </header>
</template>
