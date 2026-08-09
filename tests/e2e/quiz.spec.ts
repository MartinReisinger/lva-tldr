import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

type QuizQuestion = {
  id: number
  type: 'text' | 'single' | 'multiple'
  answer?: string
  options?: Array<{ text: string, correct: boolean }>
}

const quizQuestions = (JSON.parse(
  readFileSync('content/quizzes/computer-graphics.json', 'utf8'),
) as { questions: QuizQuestion[] }).questions

async function waitForHydration(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => Boolean(
    (document.querySelector('#__nuxt') as Element & { __vue_app__?: object })?.__vue_app__,
  ))
}

async function currentQuestionId(page: import('@playwright/test').Page) {
  const label = await page.getByText(/^Question \d+$/).first().textContent()
  return Number(label?.match(/\d+/)?.[0])
}

async function answerCurrentQuestion(page: import('@playwright/test').Page) {
  const questionId = await currentQuestionId(page)
  const question = quizQuestions.find(item => item.id === questionId)!
  const form = page.locator('form')
  if (question.type === 'text') await form.getByRole('textbox').fill(question.answer!)
  else {
    for (const option of question.options!.filter(item => item.correct)) {
      await form.locator('label').filter({ hasText: option.text }).locator('input').check()
    }
  }
  await form.getByRole('button', { name: 'Check answer' }).click()
}

async function finishOnboarding(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: 'Got it' }).click()
}

test('persists partial mastery and always spaces repeated questions', async ({ page }) => {
  await page.goto('/computer-graphics/quiz')
  await waitForHydration(page)
  await expect(page.getByText('Two correct answers, spaced apart')).toBeVisible()
  await finishOnboarding(page)
  await expect(page.getByText('Saved on this device')).toHaveCount(0)

  const firstId = await currentQuestionId(page)
  await answerCurrentQuestion(page)
  await expect(page.getByRole('status')).toContainText('see this question again later')
  await expect(page.getByText('Learning progress').locator('..')).toContainText('1%')

  await page.reload()
  await waitForHydration(page)
  await expect(page.getByText('Two correct answers, spaced apart')).toHaveCount(0)
  expect(await currentQuestionId(page)).not.toBe(firstId)
  await expect(page.getByText('1/2 correct').first()).toBeVisible()

  const showSolution = page.getByRole('button', { name: 'Show solution' })
  await showSolution.hover()
  await expect(page.getByText('Counts as a wrong submission')).toBeVisible()

  const intervening = new Set<number>()
  for (let index = 0; index < 5; index++) {
    const questionId = await currentQuestionId(page)
    expect(questionId).not.toBe(firstId)
    intervening.add(questionId)
    await page.getByRole('button', { name: 'Show solution' }).click()
    await page.getByRole('button', { name: 'Next question' }).click()
  }
  expect(intervening.size).toBe(5)
})

test('reopens the multi-step onboarding from How it works', async ({ page }) => {
  await page.goto('/computer-graphics/quiz')
  await waitForHydration(page)
  await finishOnboarding(page)

  await page.getByRole('button', { name: 'How it works' }).click()
  await expect(page.getByText('Two correct answers, spaced apart')).toBeVisible()
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.getByText('Saved on this device')).toBeVisible()
})

test('supports keyboard selection, explanations, and advancing', async ({ page }) => {
  await page.goto('/computer-graphics/quiz')
  await waitForHydration(page)
  await expect(page.getByRole('textbox')).toBeFocused()

  await page.getByRole('textbox').fill(quizQuestions[0]!.answer!)
  await page.keyboard.press('Enter')
  await expect(page.getByRole('status')).toBeVisible()
  await page.keyboard.press('Enter')

  const secondId = await currentQuestionId(page)
  const firstVisibleOption = page.locator('form label').first().locator('input')
  await page.keyboard.press('1')
  await expect(firstVisibleOption).toBeChecked()
  await page.keyboard.press('Enter')
  await page.keyboard.press('1')
  await expect(page.locator('form details').first()).toHaveAttribute('open', '')
  await page.keyboard.press('1')
  await expect(page.locator('form details').first()).not.toHaveAttribute('open', '')
  await page.keyboard.press('Enter')
  expect(await currentQuestionId(page)).not.toBe(secondId)
})

test('shuffle deals a different current question', async ({ page }) => {
  await page.goto('/computer-graphics/quiz')
  await waitForHydration(page)
  const currentId = await currentQuestionId(page)

  await page.getByRole('button', { name: 'Shuffle current and unseen questions' }).click()

  expect(await currentQuestionId(page)).not.toBe(currentId)
})

test('focus mode keeps only the centered quiz visible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/computer-graphics/quiz')
  await waitForHydration(page)

  await page.getByRole('button', { name: 'Enter focus mode' }).click()

  await expect(page.getByRole('button', { name: 'Exit focus mode' })).toBeVisible()
  await expect(page.getByText('Question order')).toHaveCount(0)
  await page.getByRole('button', { name: 'Exit focus mode' }).click()
  await expect(page.getByRole('button', { name: 'Enter focus mode' })).toBeVisible()
})
