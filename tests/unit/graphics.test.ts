import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const componentPaths = [
  'app/components/content/AutomataExample.vue',
  'app/components/content/CtlExample.vue',
  'app/components/content/MachineExample.vue',
  'app/components/content/NetExample.vue',
  'app/components/content/ProcessExample.vue',
  'app/components/content/TlaExample.vue',
]

describe('graph styling', () => {
  it.each(componentPaths)('%s uses the shared class for every SVG', (path) => {
    const component = readFileSync(path, 'utf8')
    const svgTags = component.match(/<svg\b[^>]*>/g) ?? []

    expect(svgTags.length).toBeGreaterThan(0)
    expect(svgTags.every((tag) => tag.includes('graph-svg'))).toBe(true)
  })
})
