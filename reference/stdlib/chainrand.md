# lib/chainrand

the chain's own generator.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` writes this from `crates/jockc/hoon/lib/chainrand.jock` and the examples that import it.
>
> 8 public declarations — 1 type, 7 arms. 5 pinned by a lane, 3 not. channel `%rc` · commit `15d64f3`

## Import

A module arrives by name and nothing in it is ambient. Every arm below is reached as `chainrand.<name>`.

```jock
import chainrand;
```

The name is the file name minus `.jock`: `chainrand` is `crates/jockc/hoon/lib/chainrand.jock`, and it is found because the directory holding it was passed as a `--data-dir`. There is no search path and no implicit import; `tools/libs.py` holds the whole discovery rule, and the compiler itself is a pure function of source and libraries.

## About

Shaped like lib/rand so a caller swaps the module rather than the code.  What differs is WHY you would reach for it: lib/rand's Philox is a perfectly good generator that Nockchain never vetted, and in consensus every node must compute the same bits.  This draws from tip5's sponge --- the chain's own primitive, already jetted --- so the stream is one the chain agrees with.

NOT AN ENTROPY SOURCE.  `seed` absorbs what it is handed and nothing else;  `squeeze` is a function of state.  Entropy, if a caller wants any, is what the caller absorbs.

NOT CRYPTOGRAPHIC RANDOMNESS EITHER.  A sponge over a vetted permutation is not a key generator, and nothing here should be used for key material or nonces. the sponge state, plus what a squeeze produced and this caller has not spent yet.

## Types

1 type. A type’s members ARE its interface, so each is shown whole rather than by name.

### `Sponge`

```jock
struct Sponge { st: List<@>, buf: List<@> };
```

No comment in the source. The signature above is the whole of what `Sponge` states about itself.

*used by examples/chainrand-arms.jock*

```jock
func drawn(s: chainrand.Sponge, n: @, acc: @) -> @ {
```

## Arms

7 arms, in source order. The signature is reproduced exactly; the prose is the comment above the arm in `crates/jockc/hoon/lib/chainrand.jock`.

| arm | signature | pinned by |
|---|---|---|
| `prime` | `func prime() -> @` | — |
| `seed` | `func seed(entropy: List<@>) -> Sponge` | `chainrand-arms` (assert) |
| `step` | `func step(s: Sponge) -> (@, Sponge)` | — |
| `bits` | `func bits(s: Sponge, n: @) -> (@, Sponge)` | `chainrand-arms` (assert) |
| `belowFrom` | `func belowFrom(s: Sponge, n: @, lim: @) -> (@, Sponge)` | — |
| `below` | `func below(s: Sponge, n: @) -> (@, Sponge)` | `chainrand-arms` (use) |
| `between` | `func between(s: Sponge, lo: @, hi: @) -> (@, Sponge)` | `chainrand-arms` (use) |

### `prime`

```jock
func prime() -> @ { ... }
```

the Goldilocks prime.  A field element is below it, which is what `below` has to reduce against --- see there.

### `seed`

```jock
func seed(entropy: List<@>) -> Sponge { ... }
```

a fresh sponge, having absorbed `entropy`.  Every element must be a field element;  the engine asserts it rather than wrapping, so a caller that has not reduced its input gets a crash.

*asserted by examples/chainrand-arms.jock*

```jock
assert drawn(chainrand.seed(short), 14, 0)
```

### `step`

```jock
func step(s: Sponge) -> (@, Sponge) { ... }
```

one field element.  A squeeze yields the whole rate at once, so the remainder is buffered: squeezing ten elements to spend one would be correct and ten times the work.

### `bits`

```jock
func bits(s: Sponge, n: @) -> (@, Sponge) { ... }
```

No comment in the source. The signature above is the whole of what `bits` states about itself.

*asserted by examples/chainrand-arms.jock*

```jock
assert chainrand.bits(chainrand.seed(short), 8).< < 256;
```

### `belowFrom`

```jock
func belowFrom(s: Sponge, n: @, lim: @) -> (@, Sponge) { ... }
```

uniform in [0, n), BY REJECTION.

lib/rand can use Lemire's multiply-and-shift because a Philox draw is uniform over [0, 2^64).  A belt is uniform over [0, p), and p is not a power of two, so that method does not transfer. Rejecting above the largest multiple of n at or below p leaves exactly a uniform distribution.

### `below`

```jock
func below(s: Sponge, n: @) -> (@, Sponge) { ... }
```

No comment in the source. The signature above is the whole of what `below` states about itself.

*used by examples/chainrand-arms.jock*

```jock
let d = chainrand.below(s, 6);
```

### `between`

```jock
func between(s: Sponge, lo: @, hi: @) -> (@, Sponge) { ... }
```

uniform in [lo, hi).  Half-open, like `below`.

*used by examples/chainrand-arms.jock*

```jock
let d = chainrand.between(s, 10, 20);
```

## What no lane pins

3 of 8 public declarations are named by no example in `examples/`. They compile — the module is built by `tools/modules.sh` on every push — but no assertion mentions them by name, so treat the signature as the only claim about them that a lane checks.

That count is of DIRECT mentions. An arm an assertion reaches only through a caller is not counted here, so a helper below may well be exercised on every push without appearing to be — what is true is that no lane fixes its result independently of its caller’s.

- `prime` — `func prime() -> @`
- `step` — `func step(s: Sponge) -> (@, Sponge)`
- `belowFrom` — `func belowFrom(s: Sponge, n: @, lim: @) -> (@, Sponge)`

## Where it is used

1 example imports `chainrand`. Each is a complete program whose value `tools/examples.sh` pins on every push.

- `examples/chainrand-arms.jock` — the arms sheet: one assertion per arm

The [worked examples](../../examples/) page shows the shortest of these in full.
