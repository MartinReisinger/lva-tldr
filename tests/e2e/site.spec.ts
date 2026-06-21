import { expect, test } from '@playwright/test'

async function waitForHydration(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => Boolean((document.querySelector('#__nuxt') as Element & { __vue_app__?: object })?.__vue_app__))
}

test('opens the Formal Models topic from the overview', async ({ page }) => {
  await page.goto('/')
  await waitForHydration(page)
  await page.getByRole('link', { name: /Formal Models TL;DR/ }).click()
  await expect(page).toHaveURL(/\/formal-models$/)
  await expect(page.getByRole('heading', { name: 'Formal Models TL;DR', level: 1 })).toBeVisible()
})

test('renders the TOC and expands examples', async ({ page }) => {
  await page.goto('/formal-models')
  await waitForHydration(page)
  await expect(page.getByRole('link', { name: 'Automata', exact: true }).first()).toBeVisible()

  await page.getByRole('button', { name: 'Example: deterministic and complete' }).click()
  await expect(page.getByText('Deterministic: one target per symbol')).toBeVisible()

  await page.getByRole('button', { name: 'Example: CTL state highlighting' }).click()
  await page.getByRole('button', { name: 'EF q' }).click()
  await expect(page.getByText('Some path eventually reaches q.')).toBeVisible()
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
