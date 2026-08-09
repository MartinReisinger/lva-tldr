<script setup lang="ts">
const props = defineProps<{
  auth: {
    enabled: boolean
    user: null | { name: string, email: string, avatar?: string }
  }
  syncState: 'local' | 'syncing' | 'synced' | 'error'
}>()

const emit = defineEmits<{ dismiss: [], signOut: [] }>()
const stage = ref(0)
const lastStage = 2

const syncLabel = computed(() => {
  if (props.syncState === 'syncing') return 'Syncing…'
  if (props.syncState === 'error') return 'Sync failed; your local copy is safe'
  return 'Synced with Google'
})

function continueOnboarding() {
  if (stage.value === lastStage) emit('dismiss')
  else stage.value++
}
</script>

<template>
  <section class="mb-5 rounded-xl border border-primary/30 bg-primary/5 p-4 sm:p-5">
    <div class="flex items-start gap-3">
      <UIcon
        :name="stage === 0 ? 'i-lucide-repeat-2' : stage === 1 ? 'i-lucide-hard-drive' : 'i-lucide-keyboard'"
        class="mt-0.5 size-5 shrink-0 text-primary"
      />
      <div class="min-w-0 flex-1">
        <template v-if="stage === 0">
          <p class="font-medium text-highlighted">Two correct answers, spaced apart</p>
          <p class="mt-1 text-sm leading-relaxed text-muted">
            Answer a question correctly twice without getting it wrong in between to complete it.
            The same question returns only after five different submitted questions.
          </p>
        </template>

        <template v-else-if="stage === 1">
          <p class="font-medium text-highlighted">Saved on this device</p>
          <p class="mt-1 text-sm leading-relaxed text-muted">
            Anonymous local progress stays in this browser, even after a reload.
          </p>
          <div v-if="auth.user" class="mt-3 flex items-center gap-3 rounded-lg bg-default/70 p-3">
            <UAvatar :src="auth.user.avatar" :alt="auth.user.name" size="sm" />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-highlighted">{{ auth.user.name }}</p>
              <p class="text-xs text-muted">{{ syncLabel }}</p>
            </div>
            <UButton color="neutral" label="Sign out" size="xs" variant="ghost" @click="emit('signOut')" />
          </div>
          <div v-else-if="auth.enabled" class="mt-3">
            <p class="mb-2 text-sm text-muted">Sign in to keep the same progress on another device.</p>
            <UButton
              to="/auth/google"
              external
              color="neutral"
              icon="i-lucide-log-in"
              label="Sign in with Google"
              variant="outline"
            />
          </div>
        </template>

        <template v-else>
          <p class="font-medium text-highlighted">Fast controls</p>
          <p class="mt-1 text-sm leading-relaxed text-muted">
            Use number keys to select visible answers, then press Enter to check and advance.
            After checking, the same number keys open or close explanations. Focus mode keeps the
            question centered and the next action within reach.
          </p>
        </template>

        <div class="mt-4 flex items-center justify-between gap-3">
          <UButton
            v-if="stage > 0"
            color="neutral"
            icon="i-lucide-arrow-left"
            label="Back"
            size="xs"
            variant="ghost"
            @click="stage -= 1"
          />
          <span v-else />
          <div class="flex items-center gap-1.5" aria-label="Onboarding progress">
            <span
              v-for="step in lastStage + 1"
              :key="step"
              class="size-1.5 rounded-full"
              :class="step - 1 === stage ? 'bg-primary' : 'bg-primary/30'"
            />
          </div>
          <UButton
            :label="stage === lastStage ? 'Got it' : 'Continue'"
            size="xs"
            @click="continueOnboarding"
          />
        </div>
      </div>
    </div>
  </section>
</template>
