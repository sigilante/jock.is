# lib/rational

exact rational arithmetic over Int.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` writes this from `crates/jockc/hoon/lib/rational.jock` and the examples that import it.
>
> 9 public declarations — 0 types, 9 arms. 9 pinned by a lane, 0 not. channel `%rc` · commit `1ee40c8`

## Import

A module arrives by name and nothing in it is ambient. Every arm below is reached as `rational.<name>`.

```jock
import rational;
```

The name is the file name minus `.jock`: `rational` is `crates/jockc/hoon/lib/rational.jock`, and it is found because the directory holding it was passed as a `--data-dir`. There is no search path and no implicit import; `tools/libs.py` holds the whole discovery rule, and the compiler itself is a pure function of source and libraries.

## About

A Rat is a pair of signed integers kept in CANONICAL FORM: the denominator is strictly positive and the pair is in lowest terms. Two canonical rationals are therefore identical nouns, so `==` (Nock 5) is exact equality needing no impl of its own, and every arithmetic arm re-normalizes, which closes the invariant under the operators.

THE INVARIANT IS SEALED, because Rat is a CLASS. Construction belongs to this module (imports.md ruling (e)): an importer cannot write `rational.Rat( num: +3, den: +6 )`, and cannot forge one through a cast either — the literal and all three cast doors refuse. So `==` really is exact equality: every Rat in existence came through a constructor here, and every arm here re-normalizes.

The state struct is `private`, so its name does not cross: an importer cannot name the type to ask for one. What keeps a Rat canonical is the SEAL, not the privacy — construction belongs to this module, and no cast acquires the type at any position. Privacy is API hygiene rather than a boundary: a two-step erasure cast still reads the fields, so the seal is the guarantee and privacy is the courtesy. A class may hold private state because construction is sealed and every method speaks `Self` — the state's name never crosses.

This is the payoff of classes crossing the import boundary (docs/record/class-crossing.md). Before that a class was unusable by importers, so Rat was a struct and this paragraph read as an apology instead of a guarantee.

Exactness is the point. Jock's Float64 is IEEE `@rd` with rounding pinned round-nearest at every site (runtime.md §7 — there is no rounding-mode surface), so a chain of Float64 operations carries no guarantee about where the true value went. A pair of Sints carries one: nothing here rounds, and no operation loses a bit that was not already mathematically absent. That is what lets `lib/interval` sit on top of this and mean something.

The op-traits being (Self, Self) -> Self costs nothing here: Rat op Rat is a Rat, closed, with no partiality but division by zero — which crashes rather than answering.

import rational; let half = rational.rat(+1, +2); (half + half).show()          // "1" gcd by Euclid. Int magnitudes are nats (hoon.sabs is total), so the recursion runs on `@` and returns through hoon.sint. Declared BEFORE the class because the class's methods call it, and it can be: its signature never mentions Rat.

## Arms

9 arms, in source order. The signature is reproduced exactly; the prose is the comment above the arm in `crates/jockc/hoon/lib/rational.jock`.

| arm | signature | pinned by |
|---|---|---|
| `gcd` | `func gcd(a: @, b: @) -> @` | `rational-arms` (assert) |
| `rat` | `func rat(n: Int, d: Int) -> Rat` | `rational-arms` (assert) |
| `whole` | `func whole(n: Int) -> Rat` | `rational-arms` (assert) |
| `zero` | `func zero() -> Rat` | `rational-arms` (assert) |
| `one` | `func one() -> Rat` | `rational-arms` (assert) |
| `neg` | `func neg(a: Rat) -> Rat` | `rational-arms` (assert) |
| `sign` | `func sign(a: Rat) -> Int` | `rational-arms` (assert) |
| `min` | `func min(a: Rat, b: Rat) -> Rat` | `rational-arms` (assert) |
| `max` | `func max(a: Rat, b: Rat) -> Rat` | `rational-arms` (assert) |

### `gcd`

```jock
func gcd(a: @, b: @) -> @ { ... }
```

No comment in the source. The signature above is the whole of what `gcd` states about itself.

*asserted by examples/rational-arms.jock*

```jock
assert rational.gcd(12, 18) == 6;
```

### `rat`

```jock
func rat(n: Int, d: Int) -> Rat { ... }
```

The constructors, and the only way an importer gets a Rat. rat: any pair in, canonical form out.

*asserted by examples/rational-arms.jock*

```jock
assert rational.rat(+2, +4) == half;
```

### `whole`

```jock
func whole(n: Int) -> Rat { ... }
```

whole: an integer as a rational; already canonical.

*asserted by examples/rational-arms.jock*

```jock
assert rational.whole(+2) == rational.rat(+2, +1);
```

### `zero`

```jock
func zero() -> Rat { ... }
```

No comment in the source. The signature above is the whole of what `zero` states about itself.

*asserted by examples/rational-arms.jock*

```jock
assert rational.zero() == rational.rat(+0, +1);
```

### `one`

```jock
func one() -> Rat { ... }
```

No comment in the source. The signature above is the whole of what `one` states about itself.

*asserted by examples/rational-arms.jock*

```jock
assert rational.one() == rational.rat(+1, +1);
```

### `neg`

```jock
func neg(a: Rat) -> Rat { ... }
```

No comment in the source. The signature above is the whole of what `neg` states about itself.

*asserted by examples/rational-arms.jock*

```jock
assert rational.sign(rational.neg(half)) == -1;
```

### `sign`

```jock
func sign(a: Rat) -> Int { ... }
```

sign: -1, +0, +1 — which side of zero a value falls on, which is the question every interval routine asks first.

*asserted by examples/rational-arms.jock*

```jock
assert rational.sign(half) == +1;
```

### `min`

```jock
func min(a: Rat, b: Rat) -> Rat { ... }
```

No comment in the source. The signature above is the whole of what `min` states about itself.

*asserted by examples/rational-arms.jock*

```jock
assert rational.min(third, half) == third;
```

### `max`

```jock
func max(a: Rat, b: Rat) -> Rat { ... }
```

No comment in the source. The signature above is the whole of what `max` states about itself.

*asserted by examples/rational-arms.jock*

```jock
assert rational.max(third, half) == half;
```

## What no lane pins

Nothing. All 9 public declarations are named by an example that runs on every push.

1 further declaration is `private` and therefore not reachable by an importer at all: `RatState`.

## Where it is used

4 examples import `rational`. Each is a complete program whose value `tools/examples.sh` pins on every push.

- `examples/interval-arms.jock` — a use
- `examples/interval.jock` — a use
- `examples/rational-arms.jock` — the arms sheet: one assertion per arm
- `examples/sort-imported.jock` — a use

The [worked examples](../../examples/) page shows the shortest of these in full.
