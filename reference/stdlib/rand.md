# lib/rand

deterministic pseudo-random numbers.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` writes this from `crates/jockc/hoon/lib/rand.jock` and the examples that import it.
>
> 12 public declarations — 1 type, 11 arms. 10 pinned by a lane, 2 not. channel `%rc` · commit `1ee40c8`

## Import

A module arrives by name and nothing in it is ambient. Every arm below is reached as `rand.<name>`.

```jock
import rand;
```

The name is the file name minus `.jock`: `rand` is `crates/jockc/hoon/lib/rand.jock`, and it is found because the directory holding it was passed as a `--data-dir`. There is no search path and no implicit import; `tools/libs.py` holds the whole discovery rule, and the compiler itself is a pure function of source and libraries.

## About

NOT CRYPTOGRAPHIC.  This is deterministic pseudo-randomness for numerical work --- shuffles, sampling, simulation.  It must not be used for key material, nonces, or anything adversarial.

Philox4x32-10 (Salmon et al., SC'11;  Random123 is the reference).

The output is a pure function of (key, counter), which is the property that matters here:  a counter-based generator acquires no entropy, so it is not an oracle and needs no capability gate.  It also makes a draw reproducible across ships, runtimes and replays.

`ctr` packs four 32-bit little-endian lanes (c0 = bits [0,32) up to c3 = bits [96,128));  `key` packs two (k0 low, k1 high).

## Types

1 type. A type’s members ARE its interface, so each is shown whole rather than by name.

### `Phil`

```jock
struct Phil { key: @, ctr: @ };
```

the Philox engine's state: a key and a 128-bit counter.

*asserted by examples/rand-arms.jock*

```jock
assert rand.step(rand.Phil( key: 0, ctr: 0 )).< == 0xe169c58d6627e8d5;
```

## Arms

11 arms, in source order. The signature is reproduced exactly; the prose is the comment above the arm in `crates/jockc/hoon/lib/rand.jock`.

| arm | signature | pinned by |
|---|---|---|
| `rounds` | `func rounds(c0: @, c1: @, c2: @, c3: @, k0: @, k1: @, n: @) -> @` | — |
| `block` | `func block(key: @, ctr: @) -> @` | `rand-arms` (assert) |
| `next` | `func next(p: Phil) -> (@, Phil)` | `rand-arms` (use) |
| `step` | `func step(p: Phil) -> (@, Phil)` | `rand-arms` (assert) |
| `finalize` | `func finalize(z: @) -> @` | `rand-arms` (assert) |
| `smNext` | `func smNext(s: @) -> (@, @)` | `rand-arms` (use) |
| `seedPhil` | `func seedPhil(eny: @) -> Phil` | `rand-arms` (assert) |
| `bits` | `func bits(p: Phil, n: @) -> (@, Phil)` | `rand-arms` (use) |
| `belowFrom` | `func belowFrom(p: Phil, n: @, t: @) -> (@, Phil)` | — |
| `below` | `func below(p: Phil, n: @) -> (@, Phil)` | `rand-arms` (use) |
| `between` | `func between(p: Phil, lo: @, hi: @) -> (@, Phil)` | `rand-arms` (use) |

### `rounds`

```jock
func rounds(c0: @, c1: @, c2: @, c3: @, k0: @, k1: @, n: @) -> @ { ... }
```

No comment in the source. The signature above is the whole of what `rounds` states about itself.

### `block`

```jock
func block(key: @, ctr: @) -> @ { ... }
```

No comment in the source. The signature above is the whole of what `block` states about itself.

*asserted by examples/rand-arms.jock*

```jock
assert rand.block(0, 0) == 0x9b00dbd8bc57ac4ce169c58d6627e8d5;
```

### `next`

```jock
func next(p: Phil) -> (@, Phil) { ... }
```

one draw: the block at the current counter, then the counter advances by one (mod 2^128).  The key never changes --- distinct keys are distinct streams, and splitting them is collision-free.

*used by examples/rand-arms.jock*

```jock
let n0 = rand.next(rand.Phil( key: 0, ctr: 0 ));
```

### `step`

```jock
func step(p: Phil) -> (@, Phil) { ... }
```

a 64-bit draw: the low lane of the 128-bit block.

*asserted by examples/rand-arms.jock*

```jock
assert rand.step(rand.Phil( key: 0, ctr: 0 )).< == 0xe169c58d6627e8d5;
```

### `finalize`

```jock
func finalize(z: @) -> @ { ... }
```

SplitMix64 (Steele/Lea/Flood, OOPSLA'14;  Vigna's reference C).

Two roles: a small sequential generator, and the seed-mixing primitive --- `finalize` is what turns an arbitrary atom into a well-distributed one, which is why seeding goes through it.

*asserted by examples/rand-arms.jock*

```jock
assert rand.finalize(0) == 0;
```

### `smNext`

```jock
func smNext(s: @) -> (@, @) { ... }
```

No comment in the source. The signature above is the whole of what `smNext` states about itself.

*used by examples/rand-arms.jock*

```jock
let s0 = rand.smNext(0);
```

### `seedPhil`

```jock
func seedPhil(eny: @) -> Phil { ... }
```

Seeding.

An arbitrary atom becomes a key.  THIS IS WHERE ENTROPY ENTERS, and it enters as an ARGUMENT --- the caller supplies it (a NockApp passes the ovum's `eny`).  Nothing in this module acquires it.

*asserted by examples/rand-arms.jock*

```jock
assert rand.seedPhil(111).key == pa.key;
```

### `bits`

```jock
func bits(p: Phil, n: @) -> (@, Phil) { ... }
```

Uniform integer deviates.  No floats anywhere in this section. the low `n` bits of a draw.

*used by examples/rand-arms.jock*

```jock
let d = rand.bits(p, 2);
```

### `belowFrom`

```jock
func belowFrom(p: Phil, n: @, t: @) -> (@, Phil) { ... }
```

a uniform value in [0, n), by Lemire's multiply-and-reject.  The naive `draw % n` is BIASED whenever n does not divide 2^64;  the rejection zone below `t` is exactly the excess.

### `below`

```jock
func below(p: Phil, n: @) -> (@, Phil) { ... }
```

No comment in the source. The signature above is the whole of what `below` states about itself.

*used by examples/rand-arms.jock*

```jock
let d = rand.below(p, bound);
```

### `between`

```jock
func between(p: Phil, lo: @, hi: @) -> (@, Phil) { ... }
```

a uniform value in [lo, hi).  Half-open, like `below`.

*used by examples/rand-arms.jock*

```jock
let d = rand.between(p, lo, hi);
```

## What no lane pins

2 of 12 public declarations are named by no example in `examples/`. They compile — the module is built by `tools/modules.sh` on every push — but no assertion mentions them by name, so treat the signature as the only claim about them that a lane checks.

That count is of DIRECT mentions. An arm an assertion reaches only through a caller is not counted here, so a helper below may well be exercised on every push without appearing to be — what is true is that no lane fixes its result independently of its caller’s.

- `rounds` — `func rounds(c0: @, c1: @, c2: @, c3: @, k0: @, k1: @, n: @) -> @`
- `belowFrom` — `func belowFrom(p: Phil, n: @, t: @) -> (@, Phil)`

## Where it is used

1 example imports `rand`. Each is a complete program whose value `tools/examples.sh` pins on every push.

- `examples/rand-arms.jock` — the arms sheet: one assertion per arm

The [worked examples](../../examples/) page shows the shortest of these in full.
