import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const years = [2020, 2021, 2025, 2026, 2027]
const expectedQuestions: Record<number, number> = {
  2020: 6,
  2021: 6,
  2025: 7,
  2026: 7,
  2027: 7,
}

const expectedTitles: Record<number, string> = {
  2020: 'SS 2020',
  2021: 'SS 2021',
  2025: 'SS 2025',
  2026: 'AI 2026-2',
  2027: 'AI 2026-1',
}

describe('PR Software 2 content group', () => {
  it('defines a group index and all exam pages', () => {
    const index = readFileSync('content/pr-software2/index.md', 'utf8')
    expect(index).toContain('kind: group')

    for (const year of years) {
      const exam = readFileSync(`content/pr-software2/exam${year}.md`, 'utf8')
      expect(exam).toContain('kind: topic')
      expect(exam).toContain(`title: ${expectedTitles[year]}`)
      expect(exam).not.toMatch(/^# /gm)
      expect(exam).toContain(`originalDownloadPath: /pr-software2/exam${year}-original.md`)
      expect(exam).toContain(`solutionDownloadPath: /pr-software2/exam${year}-solution.md`)

      expect(readFileSync(`public/pr-software2/exam${year}-original.md`, 'utf8'))
        .toBe(readFileSync(`internal_docs/md - originals/ss${year}_original.md`, 'utf8'))
      expect(readFileSync(`public/pr-software2/exam${year}-solution.md`, 'utf8'))
        .toBe(readFileSync(`internal_docs/md - solution/ss${year}_solution.md`, 'utf8'))
    }
  })

  it('pairs every top-level question with a solution disclosure', () => {
    for (const year of years) {
      const exam = readFileSync(`content/pr-software2/exam${year}.md`, 'utf8')
      const questions = exam.match(/^## Frage/gm) ?? []
      const solutions = exam.match(
        /^::example-block\{title="Solution" collapsed-label="Reveal solution"\}/gm,
      ) ?? []

      expect(questions).toHaveLength(expectedQuestions[year])
      expect(solutions).toHaveLength(questions.length)
      expect(exam).not.toMatch(/^# Frage/gm)
    }
  })
})
