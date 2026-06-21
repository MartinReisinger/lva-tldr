import { describe, expect, it } from 'vitest'
import { fireTransition } from '../../app/utils/net'

describe('fireTransition', () => {
  it('moves the configured number of tokens', () => {
    expect(fireTransition({ left: 3, right: 0 }, 2, 1)).toEqual({ left: 1, right: 1 })
  })

  it('does not fire without enough input tokens', () => {
    const marking = { left: 1, right: 2 }
    expect(fireTransition(marking, 2, 1)).toBe(marking)
  })
})
