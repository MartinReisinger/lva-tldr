---
title: Formal Models TL;DR
description: Compact exam preparation notes for Formal Models.
order: 1
---

# Formal Models TL;DR



## Automata

5-Tuple automaton spec = {`S`tates, `I`nitial, `∑`alphabet, `F`accept, `T`ransitions}

### 1. Deterministic:

- At most one path per symbol

### 2. Complete:

- At least one path per symbol

::automata-example{variant="basics"}
::


### 3. Power automaton:

- Advantage: always deterministic & complete; same alphabet
- Disadvantage: exponential state space
- TODO: table of original; then make new table of all reachable states, including ∅ if original was incomplete

::automata-example{variant="power"}
::

### 4. Oracle automaton:

- Advantage: linear state space; deterministic (if original has only 1 initial state)
- Disadvantage: can become incomplete; has a different & bigger alphabet; needs external oracle for choices
- TODO: just add the targets state to the transition name

::automata-example{variant="oracle"}
::

### 5. Optimized oracle automaton:

- Advantage: linear state space; deterministic & complete (if original has only 1 initial state); smaller alphabet than unoptimized
- Disadvantage: still different alphabet; needs external oracle for choices
- TODO: minimize oracle alphabet by mapping transition targets to the smallest possible set of numeric indices; n has to be minimal on a per-state and per-alphabet-symbol level

::automata-example{variant="oracle-optimized"}
::


### 6. Complement automaton:

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

### 7. Product automaton:

- TODO: make a merger of both, walking through all transitions simultaneously
  - A transition can only be taken if both have the transition
  - The product accepts only if both originals accept
  - NTS: takes a lot of time and thinking; do last in exam

::automata-example{variant="product"}
::

---

## Machines (Moore & Mealy)

### Moore machine:

- Output bound to state (NTS: while stuck in a moor)
- Convert to Mealy:
  - Make it deterministic and complete if necessary (power automaton)
  - Move the output (accept/reject) to all outgoing transitions (NTS: last step)
    - If a state accepts, all outgoing transitions have /1
    - If a state rejects, all outgoing transitions have /0

::machine-example{variant="moore"}
::

### Mealy machine:

- Output bound to transition (NTS: while eating a meal)
- Convert to Moore:
  - Determinism and completeness do not matter
  - The incoming accept/reject value is put into the states
  - This can require an extra state

::machine-example{variant="mealy"}
::



### Subset checking

- L(A1) ⊆ L(A2) ⇔ L(A1) ∩ ¬L(A2) = ∅
- In words: proving that language A1 is a subset of A2 is the same as proving that the intersection of language A1 and the complement of language A2 is empty
- TODO: A1 × C(P(A2)) = ∅
  1. Make a power automaton of A2 (it has to be deterministic and complete)
  2. Make the complement automaton of P(A2)
  3. Make the product automaton of A1 and C(P(A2))
     1. No accepting state can be reached: language A1 is a subset of A2
        1. L(A1) ⊆ L(A2)
     2. An accepting state can be reached: language A1 is not a subset of A2
        1. L(A1) ⊈ L(A2)

::machine-example{variant="subset"}
::

---

## Condition Event Nets (CEN)

4-Tuple CEN spec = {`C`onditions, `I`nitial, `E`vents, `G`raph}

### In a CEN there are $2^{|C|}$ possible markings (C = number of conditions)

- Each event consumes exactly 1 token
- Each node can hold exactly 1 token

::net-example{variant="markings"}
::



### Precondition $G^{-1}$ and Postcondition $G$:

- **Precondition $G^{-1}$ of e**: What needs to hold to make a transition possible (incoming arrows).
- **Postcondition G of e**: What holds after a transition happened (outgoing arrows).

::net-example{variant="cen"}
::

---


## Place Transition Net (PTN)

5-Tuple PTN spec = {`P`laces, `T`ransitions, `F`low relation, edge `W`eight mapping, Initial `M`arkings}



### Difference to CEN:

- Can have multiple tokens per place
  - The limit is the number next to the places
  - If a transition would exceed the limit, it is blocked
  - The default is ∞
- Can consume and produce multiple tokens per event
  - The number is shown next to the edges
  - The default is 1

::net-example{variant="ptn"}
::



### Labeled Transition System (LTS)

Just a graph of nodes (=states) whose directed edges (=state transitions) have labels (=actions/events) that trigger them.

::net-example{variant="lts"}
::

---

## Process Algebra (PA)

### Process Algebra Terminology

| Syntax        | Name       | Meaning                                                      |
| ------------- | ---------- | ------------------------------------------------------------ |
| `a`, `b`, `c` | action     | A step that can be performed.                                |
| `P`, `Q`, `R` | process    | A behavior that may perform actions.                         |
| `a.P`         | prefix     | Perform `a`, then continue as `P`.                           |
| `P + Q`       | choice     | Choose either `P` or `Q`, then discard the other.            |
| `P \|\| Q`   | parallel   | Do `P` and `Q` simultaneously; if one is not affected, it is kept. |
| `Σ(P)`        | alphabet   | Set of all actions that can occur in `P`.                    |
| `P -a-> Q`    | transition | `P` can perform `a` and become `Q`.                          |

### Prefix

$$
a.Q \xrightarrow{a} Q
$$

### Choice

Choose to perform the action on one side; the other side can then be discarded.

$$
\begin{aligned}
a.P + b.Q &\xrightarrow{a} P \\
a.P + b.Q &\xrightarrow{b} Q
\end{aligned}
$$

### Parallel

Do the same action on the right and left (a.k.a. in parallel); if one is not affected, it stays.

$$
\begin{aligned}
a.P \parallel b.Q &\xrightarrow{a} P \parallel b.Q \\
a.P \parallel b.Q &\xrightarrow{b} a.P \parallel Q
\end{aligned}
$$

::process-example{variant="combined"}
::

### Alphabet (Set of Actions)

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

### Synchronization Set

Forces all actions in it to happen in lockstep. If `P` and `Q` share `a`, this makes it a rendezvous point, meaning `a` can never happen in only one process. All other actions, such as `b` and `c`, can interleave freely.

$$
\Theta_{pq}
= \Sigma(P)\cap\Sigma(Q)
= \{a,b\}\cap\{a,c\}
= \{a\}
$$

::process-example{variant="synchronization"}
::

### Satisfiable

- For every allowed input, there exists at least one valid output.
- NTS: At least one solution exists.

::process-example{variant="satisfiable"}
::

### Underspecification

- Multiple outputs are possible for the same input.
- NTS: Too many solutions.

::process-example{variant="underspecification"}
::



---

## CTL Operators

### General Operators

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

### Singular Operators

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
