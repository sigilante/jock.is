# lib/twoc

two's-complement signed integers at arbitrary bit width

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` writes this from `crates/jockc/hoon/lib/twoc.jock` and the examples that import it.
>
> 8 public declarations — 1 type, 7 arms. 7 pinned by a lane, 1 not. channel `%rc` · commit `080874d`

## Import

A module arrives by name and nothing in it is ambient. Every arm below is reached as `twoc.<name>`.

```jock
import twoc;
```

The name is the file name minus `.jock`: `twoc` is `crates/jockc/hoon/lib/twoc.jock`, and it is found because the directory holding it was passed as a `--data-dir`. There is no search path and no implicit import; `tools/libs.py` holds the whole discovery rule, and the compiler itself is a pure function of source and libraries.

## About

Operations wrap mod 2^width rather than crashing on overflow. That is deliberate, and it is what hardware does: a checked type is a different library. The consequence worth stating once is that the minimum value is its own negation — neg(min) = min, abs(min) = min, div(min, -1) = min — because there is no room above it.

WHY A CLASS. The width is not a parameter of each operation but of the whole arithmetic, so it belongs in state: `let t = w32(); t.add(a, b)` reads as one 32-bit arithmetic rather than a pile of width arguments. Twoc is SEALED, so `wid` is positive by construction and no arm has to re-check it.

THE REPRESENTATION. A width-w value is an ordinary Nat holding the low w bits; the sign lives in bit w-1 and nowhere else. This is NOT Jock's `Int`, which is ZigZag (`+n` = 2n) — the two encodings disagree about every negative number, so crossing between them goes through `fromInt`/`toInt` and never through a cast.

HOW THE BITS ARE REACHED. The pinned `rsh`/`lsh`/`end` arms take a BIT count, not a bloq, which is what makes this library short: end(w, a)     is  a mod 2^w        — the truncation, everywhere lsh(w, 1)     is  2^w              — the modulus dec(lsh(w,1)) is  2^w - 1          — the all-ones mask mix(a, ones)  is  bitwise NOT      — within the width so `wrap` is one call and every other arm is arithmetic on top.

FLOAT LANES. w16/w32/w64/w128 are the widths of Float16, Float32, Float64 and Float128, so this is the integer view of a float's bits: the lanes a numerics stack needs for exponent arithmetic, ordering tricks and bit-level round-tripping.

## Types

1 type. A type’s members ARE its interface, so each is shown whole rather than by name.

### `TwocState`

```jock
struct TwocState { wid: Nat };
```

No comment in the source. The signature above is the whole of what `TwocState` states about itself.

## Arms

7 arms, in source order. The signature is reproduced exactly; the prose is the comment above the arm in `crates/jockc/hoon/lib/twoc.jock`.

| arm | signature | pinned by |
|---|---|---|
| `wid` | `func wid(n: Nat) -> Twoc` | `twoc-arms` (assert) |
| `bloq` | `func bloq(b: Nat) -> Twoc` | `twoc-arms` (assert) |
| `w8` | `func w8() -> Twoc` | `twoc-arms` (use) |
| `w16` | `func w16() -> Twoc` | `twoc-arms` (assert) |
| `w32` | `func w32() -> Twoc` | `twoc-arms` (assert) |
| `w64` | `func w64() -> Twoc` | `twoc-arms` (assert) |
| `w128` | `func w128() -> Twoc` | `twoc-arms` (assert) |

### `wid`

```jock
func wid(n: Nat) -> Twoc { ... }
```

wid: the general constructor, and the one refusal site — a zero-width two's complement has no sign bit to speak of.

*asserted by examples/twoc-arms.jock*

```jock
assert twoc.wid(12).ones() == 4095;
```

### `bloq`

```jock
func bloq(b: Nat) -> Twoc { ... }
```

bloq: the bloq-keyed spelling, width 2^b, for callers working in bloq-sized lanes.

*asserted by examples/twoc-arms.jock*

```jock
assert twoc.bloq(5).len() == 32;
```

### `w8`

```jock
func w8() -> Twoc { ... }
```

The float lanes, and the byte.

*used by examples/twoc-arms.jock*

```jock
let t = twoc.w8();
```

### `w16`

```jock
func w16() -> Twoc { ... }
```

No comment in the source. The signature above is the whole of what `w16` states about itself.

*asserted by examples/twoc-arms.jock*

```jock
assert twoc.w16().neg(1) == 65535;
```

### `w32`

```jock
func w32() -> Twoc { ... }
```

No comment in the source. The signature above is the whole of what `w32` states about itself.

*asserted by examples/twoc-arms.jock*

```jock
assert twoc.w32().neg(1) == 4294967295;
```

### `w64`

```jock
func w64() -> Twoc { ... }
```

No comment in the source. The signature above is the whole of what `w64` states about itself.

*asserted by examples/twoc-arms.jock*

```jock
assert twoc.w64().neg(1) == 18446744073709551615;
```

### `w128`

```jock
func w128() -> Twoc { ... }
```

No comment in the source. The signature above is the whole of what `w128` states about itself.

*asserted by examples/twoc-arms.jock*

```jock
assert twoc.w128().len() == 128;
```

## What no lane pins

1 of 8 public declarations are named by no example in `examples/`. They compile — the module is built by `tools/modules.sh` on every push — but no assertion mentions them by name, so treat the signature as the only claim about them that a lane checks.

That count is of DIRECT mentions. An arm an assertion reaches only through a caller is not counted here, so a helper below may well be exercised on every push without appearing to be — what is true is that no lane fixes its result independently of its caller’s.

- `TwocState` — `struct TwocState { wid: Nat };`

## Where it is used

2 examples import `twoc`. Each is a complete program whose value `tools/examples.sh` pins on every push.

- `examples/twoc-arms.jock` — the arms sheet: one assertion per arm
- `examples/twoc.jock` — a use

The [worked examples](/reference/examples/) page shows the shortest of these in full.
