import { describe, expect, it } from 'vitest'
import { ctlFormulas } from '../../app/utils/ctl'

describe('CTL state-highlighting examples', () => {
  it('uses a distinct result set for each operator', () => {
    const resultSets = ctlFormulas.map(({ states }) => states.join(','))

    expect(new Set(resultSets).size).toBe(ctlFormulas.length)
  })

  it('distinguishes existential and universal reachability', () => {
    expect(ctlFormulas.find(({ formula }) => formula === 'EF q')?.states).toEqual([1, 2, 3])
    expect(ctlFormulas.find(({ formula }) => formula === 'AF q')?.states).toEqual([3])
  })
})
