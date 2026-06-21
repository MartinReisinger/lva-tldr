export interface NetMarking {
  left: number
  right: number
}

export function fireTransition(marking: NetMarking, inputWeight = 1, outputWeight = 1): NetMarking {
  if (marking.left < inputWeight) return marking
  return {
    left: marking.left - inputWeight,
    right: marking.right + outputWeight,
  }
}
