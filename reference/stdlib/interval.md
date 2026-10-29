# lib/interval

interval arithmetic over exact rationals.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` writes this from `crates/jockc/hoon/lib/interval.jock` and the examples that import it.
>
> 4 public declarations — 1 type, 3 arms. 3 pinned by a lane, 1 not. channel `%rc` · commit `15d64f3`

## Import

A module arrives by name and nothing in it is ambient. Every arm below is reached as `interval.<name>`.

```jock
import interval;
```

The name is the file name minus `.jock`: `interval` is `crates/jockc/hoon/lib/interval.jock`, and it is found because the directory holding it was passed as a `--data-dir`. There is no search path and no implicit import; `tools/libs.py` holds the whole discovery rule, and the compiler itself is a pure function of source and libraries.

## About

An Iv is a closed interval [lo, hi] of `rational.Rat`, and the contract is ENCLOSURE: if x is in a and y is in b, then x op y is in (a op b). Every arm here is written to keep that true.

Enclosure is the whole product, and it is why this sits on `lib/rational` rather than on Float64. Sound interval arithmetic over floating point needs DIRECTED rounding — the low end toward -inf, the high end toward +inf — so an interval only ever widens. Jock pins rounding to round-nearest at every site and exposes no mode surface (runtime.md §7), so on Float64 the endpoints would creep INWARD by an ulp per operation and the guarantee would fail silently, which is the worst way for a numeric library to be wrong. Over exact rationals nothing rounds, so enclosure is exact.

THE INVARIANT IS SEALED. Iv is a CLASS, so construction belongs to this module (imports.md ruling (e)): `interval.Iv( lo: 3, hi: 1 )` does not type-check, and no cast can forge one either. An inverted interval cannot enter the system, which is what makes the enclosure contract a guarantee rather than a hope. `Rat` is sealed the same way, so the endpoints cannot be un-canonical either — the two seals compose.

SHAPE. Everything taking an interval is a METHOD; the three constructors are funcs after the class. That is not a style choice: a class fuses its type declaration and its method bodies, so an arm mentioning Iv can be declared neither before the class (the type is not registered yet) nor after it (the bodies have already minted). The operator impls are the class's own conformances, so each rule is still written exactly once.

A consequence worth stating: the methods cannot call `iv()`, the checking constructor, because it is declared after them. They construct directly and preserve `lo <= hi` by the arithmetic — sums and differences of ordered endpoints stay ordered, `mul` takes an explicit min and max, `hull` takes a min and a max, and `recip` is reached only through the zero test. `iv()` is where an untrusted pair is checked.

NOT GENERIC, and not by choice. `Iv` over any ordered ring would need a binder bounded by Lt AND Add AND Sub AND Mul AND Div, and `$gbin` carries `bound=(unit cord)` — exactly one bound per binder (`T: Lt + Add` is a parse error; `T: Lt, Add` reads as two binders).

TWO PLACES THE LANGUAGE SHAPES THE DESIGN.

Order is PARTIAL — [1,3] and [2,4] are not ordered — but comparison op-traits answer Bool, so `<` cannot report the third case. It therefore means CERTAINLY less than: every element of the left below every element of the right. The overlapping question is a separately named method, `possibly-lt`. The signature forces the ambiguity into two names rather than hiding it in one.

Division is PARTIAL: a divisor spanning zero has no interval answer, and `/` is (Self, Self) -> Self so it cannot answer `Iv?`. `try-div` is the total form and `/` is its crashing face — literally `try-div(...) ?? crash`, so there is one division rule and one zero test.

EQUALITY needs no impl. `==` is Nock 5 on the erasure, and both seals hold, so two intervals are the same noun exactly when they are the same interval. Structural equality IS the right equality here — inherited, not implemented.

import interval; (interval.unit() + interval.unit()).show()   // "[0, 2]" `private`, as lib/rational's state is: the non-empty invariant below is only an invariant if the pair cannot be built directly.

## Types

1 type. A type’s members ARE its interface, so each is shown whole rather than by name.

### `Hull`

```jock
trait Hull { hull(⊛); };
```

Hull binds `⊛`, the one operator the language lexes and leaves meaningless — no pinned arm, so a library gives it a meaning or it refuses. The hull is a fair claimant: it is total (any two intervals have a smallest enclosing one), closed, associative, and it is not any of the arithmetic operators. Declared before the class, which names it as a conformance.

## Arms

3 arms, in source order. The signature is reproduced exactly; the prose is the comment above the arm in `crates/jockc/hoon/lib/interval.jock`.

| arm | signature | pinned by |
|---|---|---|
| `iv` | `func iv(lo: rational.Rat, hi: rational.Rat) -> Iv` | `interval-arms` (assert) |
| `exact` | `func exact(x: rational.Rat) -> Iv` | `interval-arms` (assert) |
| `unit` | `func unit() -> Iv` | `interval-arms` (use) |

### `iv`

```jock
func iv(lo: rational.Rat, hi: rational.Rat) -> Iv { ... }
```

The constructors, and the only way an importer gets an Iv. iv: the checking constructor, and the place an inverted interval is refused rather than silently swapped — [3, 1] is a caller bug, and an empty interval is not a value this library represents. Since Iv is sealed, this check cannot be bypassed.

*asserted by examples/interval-arms.jock*

```jock
assert not a.overlaps(interval.iv(rational.whole(+5), rational.whole(+6)));
```

### `exact`

```jock
func exact(x: rational.Rat) -> Iv { ... }
```

exact: the degenerate interval, a single point. Ordered by construction, so it needs no check.

*asserted by examples/interval-arms.jock*

```jock
assert interval.exact(two).contains(two);
```

### `unit`

```jock
func unit() -> Iv { ... }
```

unit: [0, 1]. Reachable without naming `rational` at all, which is the point of the resolution/spelling split — an importer can use this library, and hold the rationals it hands back, without importing `rational` to say their name.

*used by examples/interval-arms.jock*

```jock
let u = interval.unit();                        //  [0, 1]
```

## What no lane pins

1 of 4 public declarations are named by no example in `examples/`. They compile — the module is built by `tools/modules.sh` on every push — but no assertion mentions them by name, so treat the signature as the only claim about them that a lane checks.

That count is of DIRECT mentions. An arm an assertion reaches only through a caller is not counted here, so a helper below may well be exercised on every push without appearing to be — what is true is that no lane fixes its result independently of its caller’s.

- `Hull` — `trait Hull { hull(⊛); };`

1 declaration further is `private` and therefore not reachable by an importer at all: `IvState`.

## Where it is used

2 examples import `interval`. Each is a complete program whose value `tools/examples.sh` pins on every push.

- `examples/interval-arms.jock` — the arms sheet: one assertion per arm
- `examples/interval.jock` — a use

The [worked examples](../../examples/) page shows the shortest of these in full.
