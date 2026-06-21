export interface CtlFormula {
  formula: string
  states: number[]
  note: string
}

export const ctlFormulas: CtlFormula[] = [
  { formula: 'EX p', states: [1, 2], note: 'A successor satisfies p.' },
  { formula: 'EF q', states: [1, 2, 3], note: 'Some path eventually reaches q.' },
  { formula: 'AG p', states: [], note: 'p is not globally true on all paths.' },
  { formula: 'AF q', states: [3], note: 'Every path eventually reaches q.' },
]
