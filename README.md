# CCC Circuits

*A Cartesian Closed Category as a circuit description language*

## So... What is a circuit?

A circuit is a directed acyclic graph with three types of nodes:

- **Input nodes** — zero inputs, serve as entry points
- **Output nodes** — exactly one input, zero outputs, serve as exit points
- **Function nodes** — labeled with a function *f* of in-arity *N* and out-arity *M*, with N labeled inputs (1 through N) and M labeled outputs (1 through M)

### Example: Boolean circuits

Three functions are allowed: `{AND, OR, NOT}`, all with out-arity 1. `AND` and `OR` have in-arity 2; `NOT` has in-arity 1.

### Example: Algebraic circuits

Functions allowed: `{+, *, k}` for all constants *k* in your field. `+` and `*` have in-arity 2 and out-arity 1; constant gates *k* have in-arity 0 and out-arity 1. The set of allowed functions can be infinite.

## Now do that, but meta

What if what flows through the wires isn't boolean values or field elements, **but circuits themselves**?

This is the central idea of CCC Circuits: a circuit description language where wires carry *morphisms*, not singular values. A gate is no longer a primitive boolean function — it's a higher-order combinator that takes circuits as inputs and produces circuits as outputs.
