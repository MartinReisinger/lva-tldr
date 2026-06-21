export interface CtlFormula {
  formula: string
  states: number[]
  note: string
}

export const ctlFormulas: CtlFormula[] = [
  { formula: 'EX p', states: [1, 3], note: 'A successor satisfies p.' },
  { formula: 'EF q', states: [1, 2, 3], note: 'Some path eventually reaches q.' },
  { formula: 'AG p', states: [3], note: 'p holds on every reachable state.' },
]
