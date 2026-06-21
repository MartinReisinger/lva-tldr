import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const content = readFileSync('content/formal-models.md', 'utf8')

describe('Formal Models content', () => {
  it('contains metadata and no print-only spacing', () => {
    expect(content).toContain('title: Formal Models TL;DR')
    expect(content).toContain('order: 1')
    expect(content).not.toContain('<br>')
  })

  it('references every fixed example variant', () => {
    const variants = [
      'basics', 'power', 'oracle', 'optimized', 'complement', 'product',
      'moore', 'mealy', 'subset', 'markings', 'prepost', 'cen', 'ptn', 'lts',
      'combined', 'alphabet', 'synchronization',
      'satisfiable', 'underspecification', 'operators',
    ]

    for (const variant of variants) {
      expect(content).toContain(`variant="${variant}"`)
    }
  })
})
