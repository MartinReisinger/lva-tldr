---
title: Formal Models TL;DR
description: Dense summary of the most important concepts.
order: 1
kind: topic
downloadPath: /formal-models.md
updatedAt: "2026-06-24T17:25:26+02:00"
---

## Automata

5-Tuple automaton spec = {`S`tates, `I`nitial, `∑`alphabet, `F`accept, `T`ransitions}

### Properties

#### Deterministic

- At most one path per symbol

#### Complete

- At least one path per symbol

::automata-example{variant="basics"}
::

### Automata Types

#### Power automaton

- Advantage: always deterministic & complete; same alphabet
- Disadvantage: exponential state space
- TODO: table of original; then make new table of all reachable states, including ∅ if original was incomplete

::automata-example{variant="power"}
::

#### Oracle automaton

- Advantage: linear state space; deterministic (if original has only 1 initial state)
- Disadvantage: can become incomplete; has a different & bigger alphabet; needs external oracle for choices
- TODO: just add the targets state to the transition name

::automata-example{variant="oracle"}
::

#### Optimized oracle automaton

- Advantage: linear state space; deterministic; smaller alphabet than unoptimized
- Disadvantage: still different alphabet; can still be incomplete if original was incomplte; needs external oracle for choices
- TODO: minimize oracle alphabet by mapping transition targets to the smallest possible set of numeric indices; n has to be minimal on a per-state and per-alphabet-symbol level

::automata-example{variant="oracle-optimized"}
::

#### Complement automaton

- If deterministic & complete
  - Just flip the final states
- Else if incomplete & deterministic
  - make complete via a sink ∅
  - then just flip the final states
- Else (assert nondeterministic)
  - Make power automaton
  - Then just flip the final states

::automata-example{variant="complement"}
::

#### Product automaton

- TODO: make a merger of both, walking through all transitions simultaneously
  - A transition can only be taken if both have the transition
  - The product accepts only if both originals accept
  - NTS: takes a lot of time and thinking; do last in exam

::automata-example{variant="product"}
::

---

## Machines (Moore & Mealy)

#### Moore machine

- Output bound to state (NTS: while stuck in a moor)
- Convert to Mealy:
  - Make it deterministic and complete if necessary (power automaton)
  - Move the output (accept/reject) to all outgoing transitions (NTS: last step)
    - If a state accepts, all outgoing transitions have /1
    - If a state rejects, all outgoing transitions have /0

::machine-example{variant="moore"}
::

#### Mealy machine

- Output bound to transition (NTS: while eating a meal)
- Convert to Moore:
  - Determinism and completeness do not matter
  - The incoming accept/reject value is put into the states
  - This can require an extra state

::machine-example{variant="mealy"}
::

## Subset checking

$$
L(A_1) \subseteq L(A_2)
\iff
L(A_1) \cap \overline{L(A_2)} = \varnothing
$$

In words: $A_1$ is a subset of $A_2$ exactly when no word is accepted by $A_1$ and rejected by $A_2$.

::machine-example{variant="subset"}

1. Build the complete deterministic power automaton $P(A_2)$.
2. Complement it to obtain $C(P(A_2))$.
3. Build the product automaton $A_1 \times C(P(A_2))$.
   - **No accepting state is reachable:** $L(A_1) \subseteq L(A_2)$.
   - **An accepting state is reachable:** $L(A_1) \nsubseteq L(A_2)$; the path to it gives a counterexample.

::

---

## Condition Event Nets (CEN)

4-Tuple CEN spec = {`C`onditions, `I`nitial, `E`vents, `G`raph}

#### Markings

A CEN with $|C|$ conditions has $2^{|C|}$ possible markings.

- Each event consumes exactly 1 token
- Each node can hold exactly 1 token

::net-example{variant="markings"}
::

### Conditions

- **Precondition $G^{-1}$ of e**: What needs to hold to make a transition possible (incoming arrows).
- **Postcondition G of e**: What holds after a transition happened (outgoing arrows).

::net-example{variant="cen"}
::

---

## Place Transition Net (PTN)

5-Tuple PTN spec = {`P`laces, `T`ransitions, `F`low relation, edge `W`eight mapping, Initial `M`arkings}

#### PTN vs. CEN

- Can have multiple tokens per place
  - The limit is the number next to the places
  - If a transition would exceed the limit, it is blocked
  - The default is ∞
- Can consume and produce multiple tokens per event
  - The number is shown next to the edges
  - The default is 1

::net-example{variant="ptn"}
::

---

#### Labeled Transition System (LTS)

Just a graph of nodes (=states) whose directed edges (=state transitions) have labels (=actions/events) that trigger them.

::net-example{variant="lts"}
::

---

## Process Algebra (PA)

### Terminology

| Syntax        | Name       | Meaning                                                            |
| ------------- | ---------- | ------------------------------------------------------------------ |
| `a`, `b`, `c` | action     | A step that can be performed.                                      |
| `P`, `Q`, `R` | process    | A behavior that may perform actions.                               |
| `a.P`         | prefix     | Perform `a`, then continue as `P`.                                 |
| `P + Q`       | choice     | Choose either `P` or `Q`, then discard the other.                  |
| `P \|\| Q`    | parallel   | Do `P` and `Q` simultaneously; if one is not affected, it is kept. |
| `Σ(P)`        | alphabet   | Set of all actions that can occur in `P`.                          |
| `P -a-> Q`    | transition | `P` can perform `a` and become `Q`.                                |

#### Prefix

$$
a.Q \xrightarrow{a} Q
$$

#### Choice

Choose to perform the action on one side; the other side can then be discarded.

$$
\begin{aligned}
a.P + b.Q &\xrightarrow{a} P \\
a.P + b.Q &\xrightarrow{b} Q
\end{aligned}
$$

#### Parallel

Do the same action on the right and left (a.k.a. in parallel); if one is not affected, it stays.

$$
\begin{aligned}
a.P \parallel b.Q &\xrightarrow{a} P \parallel b.Q \\
a.P \parallel b.Q &\xrightarrow{b} a.P \parallel Q
\end{aligned}
$$

::process-example{variant="combined"}
::

### Composition

#### Alphabet

Just a set of all action symbols of the given process.

::formula-scroll

$$
\begin{aligned}
P &= a.b.b.P & \Sigma(P) &= \{a,b\} \\
Q &= a.R \parallel c.Q & \Sigma(Q) &= \{a,c\} \\
S &= a.P + c.R & \Sigma(S) &= \{a,b,c\} \\
\Sigma(P+Q) &= \Sigma(P\parallel Q)
= \Sigma(P)\cup\Sigma(Q)
= \{a,b\}\cup\{a,c\}
= \{a,b,c\}
\end{aligned}
$$

::

::process-example{variant="alphabet"}
::

#### Synchronization set

Forces all actions in it to happen in lockstep. If `P` and `Q` share `a`, this makes it a rendezvous point, meaning `a` can never happen in only one process. All other actions, such as `b` and `c`, can interleave freely.

$$
\Theta_{pq}
= \Sigma(P)\cap\Sigma(Q)
= \{a,b\}\cap\{a,c\}
= \{a\}
$$

::process-example{variant="synchronization"}
::

### Specifications

#### Satisfiable

- For every allowed input, there exists at least one valid output.
- NTS: At least one solution exists.

::process-example{variant="satisfiable"}
::

#### Underspecification

- Multiple outputs are possible for the same input.
- NTS: Too many solutions.

::process-example{variant="underspecification"}
::

---

## CTL Operators

### Operators

#### Combined operators

| Formula    | Meaning                                              | NTS                        |
| ---------- | ---------------------------------------------------- | -------------------------- |
| `EX φ`     | There exists a successor with `φ`                    | one step reachable         |
| `AX φ`     | All successors have `φ`                              | all next states            |
| `EF φ`     | There exists a path where `φ` eventually occurs      | can reach `φ`              |
| `AF φ`     | On every path `φ` eventually occurs                  | all must reach `φ`         |
| `EG φ`     | There exists a path where `φ` holds forever          | find a `φ`-only cycle      |
| `AG φ`     | On every path `φ` holds forever                      | `φ` is never violated      |
| `E(φ U ψ)` | There exists a path where `φ` holds until `ψ` occurs | stay in `φ` until `ψ`      |
| `A(φ U ψ)` | On every path `φ` holds until `ψ` occurs             | must stay in `φ` until `ψ` |

::ctl-example{variant="operators"}
::

#### Operator symbols

| Symbol | Meaning             |
| ------ | ------------------- |
| `E`    | there exists a path |
| `A`    | all paths           |
| `X`    | next state          |
| `F`    | eventually / future |
| `G`    | always / globally   |
| `U`    | until               |

### Equivalences

| Formula | Equivalent |
| ------- | ---------- |
| `AG φ`  | `¬EF(¬φ)`  |
| `AF φ`  | `¬EG(¬φ)`  |
| `EG φ`  | `¬AF(¬φ)`  |
| `EF φ`  | `¬AG(¬φ)`  |

::example-block{title="Equivalence shortcut" collapsed-label="Show equivalence shortcut"}

Just remember these 3 rules for the equivalences:
- Swap `F ↔ G`
- Swap `A ↔ E`
- Negate everything: `(φ)  (¬φ)`

::

---

## TLA+

TLA+ describes a state machine with logic: variables are the state, actions are the transitions.

### Syntax

| Syntax        | Meaning                                       |
| ------------- | --------------------------------------------- |
| `/\`, `\/`    | and, or                                       |
| `x`           | value in the current state (eg. precondition) |
| `x'`          | value in the next state (eg. postcondition)   |
| `UNCHANGED x` | shorthand for `x' = x`                        |
| `Init`        | allowed initial states                        |
| `Next`        | disjunction of all actions                    |

### Structure

```haskell
---- MODULE Vending ----
EXTENDS Naturals

VARIABLES coins, brewing
vars == <<coins, brewing>>

Init == /\ coins = 0
        /\ brewing = FALSE

InsertCoin == /\ coins = 0
              /\ coins' = 1
              /\ UNCHANGED brewing

Next == \/ InsertCoin

Spec == Init /\ [][Next]_vars
```

::tla-example{variant="action"}
::

### Model checking

#### Invariants and reachability

```haskell
TypeOK == coins \in 0..1 /\ brewing \in BOOLEAN
BrewingNotReachable == brewing = FALSE
```

- Invariant:
  - Must hold in every reachable state.

- Reachability:
  - Negate the target and check it as an invariant. A violation gives the path to the target.

- Counterexample:
  - Read the error top-to-bottom
  - Each step shows the action and changed variables.

- Deadlock:
  - The system is stuck because no actions in `Next` are enabled in this state.

#### Refinement

```c
Abstract == INSTANCE Vending
THEOREM Spec1 => Abstract!Spec
```

- A refinement adds detail but must preserve the abstract behavior.
- Check `Spec1` and add `Abstract!Spec` under Properties; `THEOREM` alone is not run by TLC.
- Use `INSTANCE ... WITH x <- expression` when the refined representation differs.
- Time is explicit: use a bounded counter in a wait action. More counter values mean more states.

### Operators

| Syntax   | Meaning                      | Classifies |
| -------- | ---------------------------- | ---------- |
| `[]P`    | always `P`                   | safety     |
| `<>P`    | eventually `P`               | liveness   |
| `P ~> Q` | whenever `P`, eventually `Q` | leads-to   |

### Definitions

- **Stuttering:** An enabled action may be ignored forever.
- **Fairness:** May be required to prove liveness when the model contains non-deterministic transitions that allow the system to stall or stutter forever.
- **Liveness:** Is the guarantee that progress eventually happens.

### Fairness

- **No Fairness:**
  - Use this when the action is optional for the liveness.
  - An external event that is not required to occur.
- **Weak fairness:**
  - If an action is continuously enabled, it must eventually fire.
  - It is not enough when the precondition keeps becoming false and true.
- **Strong fairness:**
  - If an action is infinitely often enabled, it must eventually fire.
  - Use if the action flickers between false and true.

::tla-example{variant="checking"}
::
