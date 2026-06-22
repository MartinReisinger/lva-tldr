import { existsSync, readFileSync } from 'node:fs'
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

const pageSlugs: Record<number, string> = {
  2020: 'exam2020',
  2021: 'exam2021',
  2025: 'exam2025',
  2026: 'ai2026-2',
  2027: 'ai2026-1',
}

describe('PR Software 2 content group', () => {
  it('defines a group index and all exam pages', () => {
    const index = readFileSync('content/pr-software2/index.md', 'utf8')
    expect(index).toContain('kind: group')
    expect(index).toMatch(/updatedAt: "\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}"/)

    for (const year of years) {
      const slug = pageSlugs[year]
      const exam = readFileSync(`content/pr-software2/${slug}.md`, 'utf8')
      expect(exam).toContain('kind: topic')
      expect(exam).toMatch(/updatedAt: "\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}"/)
      expect(exam).toContain(`title: ${expectedTitles[year]}`)
      expect(exam).not.toMatch(/^# /gm)
      expect(exam).toContain(`originalDownloadPath: /pr-software2/${slug}-original.md`)
      expect(exam).toContain(`solutionDownloadPath: /pr-software2/${slug}-solution.md`)

      expect(existsSync(`public/pr-software2/${slug}-original.md`)).toBe(true)
      expect(existsSync(`public/pr-software2/${slug}-solution.md`)).toBe(true)
    }

    expect(readFileSync('public/pr-software2/ai2026-1-original.md', 'utf8'))
      .toBe(readFileSync('internal_docs/ss2027_original.md', 'utf8'))
    expect(readFileSync('public/pr-software2/ai2026-1-solution.md', 'utf8'))
      .toBe(readFileSync('internal_docs/ss2027_solution.md', 'utf8'))
  })

  it('pairs every top-level question with a solution disclosure', () => {
    for (const year of years) {
      const exam = readFileSync(`content/pr-software2/${pageSlugs[year]}.md`, 'utf8')
      const questions = exam.match(/^## Frage/gm) ?? []
      const solutions = exam.match(
        /^::example-block\{title="Solution" collapsed-label="Reveal solution"\}/gm,
      ) ?? []

      expect(questions).toHaveLength(expectedQuestions[year])
      expect(solutions).toHaveLength(questions.length)
      expect(exam).not.toMatch(/^# Frage/gm)
    }
  })

  it('uses registration and cleanup in the AI 2026-1 selector question', () => {
    const exam = readFileSync('content/pr-software2/ai2026-1.md', 'utf8')
    expect(exam).toContain('channel.register(')
    expect(exam).toContain('channelKeys.remove(channel);')
    expect(exam).toContain('loggedInClients.remove(state.name());')
    expect(exam).not.toContain('OP_WRITE')
    expect(exam).not.toContain('interestOps')
  })

  it('limits AI 2026-2 reflection to APIs covered in class', () => {
    const exam = readFileSync('content/pr-software2/ai2026-2.md', 'utf8')
    expect(exam).toContain('Dog.class.getSuperclass()')
    expect(exam).toContain('Dog.class.getInterfaces()')
    expect(exam).toContain('Trainable.class.isInterface()')
    expect(exam).not.toContain('isAssignableFrom')
  })
})
