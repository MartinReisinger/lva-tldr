import { describe, expect, it } from 'vitest'
import { ctlFormulas } from '../../app/utils/ctl'

describe('CTL examples', () => {
  it('only references states in the fixed Kripke structure', () => {
    for (const item of ctlFormulas) {
      expect(item.states.length).toBeGreaterThan(0)
      expect(item.states.every(state => state >= 1 && state <= 3)).toBe(true)
    }
  })
})
