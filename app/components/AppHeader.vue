<template>
  <UHeader
    title="LVA TL;DR"
    :toggle="false"
    :ui="{
      root: 'bg-default/90',
      title: 'flex min-w-0 items-center gap-2 font-semibold',
    }"
  >
    <template #title>
      <UIcon
        name="i-lucide-graduation-cap"
        class="size-5 shrink-0 text-primary"
      />
      <span class="truncate">LVA TL;DR</span>
    </template>

    <template #right>
      <UColorModeButton color="neutral" variant="ghost" />
    </template>
  </UHeader>
</template>
