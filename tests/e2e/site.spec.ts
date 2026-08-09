import { expect, test } from '@playwright/test'

async function waitForHydration(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => Boolean((document.querySelector('#__nuxt') as Element & { __vue_app__?: object })?.__vue_app__))
}

test('opens the Formal Models topic from the overview', async ({ page }) => {
  await page.goto('/')
  await waitForHydration(page)
  await page.locator('a[href="/formal-models"]').first().click()
  await expect(page).toHaveURL(/\/formal-models$/)
  await expect(page.getByRole('heading', { name: 'Formal Models TL;DR', level: 1 })).toBeVisible()
})

test('renders the TOC and expands examples', async ({ page }) => {
  await page.goto('/formal-models')
  await waitForHydration(page)
  await expect(page.getByRole('link', { name: 'Automata', exact: true }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: 'Properties', exact: true }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: 'Deterministic', exact: true })).toHaveCount(0)

  await page.getByRole('button', { name: 'Example: deterministic and complete' }).click()
  await expect(page.locator('button:has-text("Deterministic")').first()).toBeVisible()
  await expect(page.getByText('Every state has at most one outgoing transition per action.')).toBeVisible()
  await expect(page.getByText('Every state has a transition for both a and b.')).toBeVisible()

  await page.getByRole('button', { name: 'Complete', exact: true }).click()
  await expect(page.getByText('The alphabet is {a, b}, but states B and C are missing transitions.')).toBeVisible()
  await expect(page.locator('svg[aria-label="Basics Automaton"]').getByText('b')).toBeVisible()

  await page.getByRole('button', { name: 'Deterministic', exact: true }).click()
  await expect(page.getByText('State A has two outgoing transitions for action a.')).toBeVisible()

  await page.getByRole('button', { name: 'Complete', exact: true }).click()
  await expect(page.getByText('Every state has a transition for both a and b.')).toBeVisible()
  await expect(page.getByText('State A has two outgoing transitions for action a.')).toBeVisible()

  await page.getByRole('button', { name: 'Example: CTL state highlighting' }).click()
  await expect(page.getByText('EF q').first()).toBeVisible()
  await expect(page.getByText('Some path eventually reaches q.')).toBeVisible()
  await expect(page.getByText('AF q').first()).toBeVisible()
  await expect(page.getByText('Every path eventually reaches q.')).toBeVisible()

  await page.getByRole('button', { name: 'Example: subset check' }).click()
  await expect(page.getByText('Build the complete deterministic power automaton')).toBeVisible()
})

test('uses the shared graph style across example families', async ({ page }) => {
  await page.goto('/formal-models')
  await waitForHydration(page)

  await page.getByRole('button', { name: 'Example: pre-/postconditions and fire event' }).click()
  await expect(page.locator('svg.graph-svg[aria-label="Example: Pre-/Postconditions and Fire Event"]')).toBeVisible()

  await page.getByRole('button', { name: 'Example: process algebra semantics' }).click()
  await expect(page.locator('svg.graph-svg[aria-label="Process Algebra Evaluation Tree"]')).toBeVisible()
})

test('shows outputs on every Moore state', async ({ page }) => {
  await page.goto('/formal-models')
  await waitForHydration(page)

  await page.getByRole('button', { name: 'Example: Moore to Mealy' }).click()
  await expect(page.getByText('q0 / 1', { exact: true })).toBeVisible()
  await expect(page.getByText('q1 / 0', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Example: Mealy to Moore' }).click()
  await page.getByRole('button', { name: 'Convert to Moore' }).click()
  await expect(page.getByText('q0 / 0', { exact: true })).toBeVisible()
  await expect(page.getByText('q1 / 1', { exact: true })).toBeVisible()
})

test('shows the focused TLA+ examples', async ({ page }) => {
  await page.goto('/formal-models')
  await waitForHydration(page)

  const tlaCode = page.locator('pre.shiki').filter({ hasText: 'MODULE Vending' })
  await expect(tlaCode).toBeVisible()
  const tokenColors = await tlaCode.locator('code span').evaluateAll((tokens) =>
    [...new Set(tokens.map((token) => getComputedStyle(token).color))],
  )
  expect(tokenColors.length).toBeGreaterThan(1)

  await page.getByRole('button', { name: 'Example: correct a TLA+ action' }).click()
  await expect(page.getByText('coins becomes 1; brewing keeps its value.')).toBeVisible()
  await page.getByRole('button', { name: 'Missing UNCHANGED' }).click()
  await expect(page.getByText('brewing is neither updated nor declared UNCHANGED.')).toBeVisible()

  await page.getByRole('button', { name: 'Example: TLC checks and fairness' }).click()
  await page.getByRole('button', { name: 'Reachability' }).click()
  await expect(page.getByText('TLC violates this invariant with the trace InsertCoin → Brew.')).toBeVisible()
  await page.getByRole('button', { name: 'Fairness' }).click()
  await expect(page.getByText('If Brew remains enabled, stuttering cannot postpone it forever.')).toBeVisible()
})

test('persists a manual color-mode change', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/formal-models')
  await waitForHydration(page)
  await expect(page.locator('html')).toHaveClass(/dark/)

  await page.locator('header button').click()
  await expect(page.locator('html')).toHaveClass(/light/)
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/light/)
})

test('fits the mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/formal-models')
  await waitForHydration(page)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  expect(overflow).toBe(false)
})
