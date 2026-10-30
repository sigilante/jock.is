# lib/hof

higher-order functions over closures and List.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` writes this from `crates/jockc/hoon/lib/hof.jock` and the examples that import it.
>
> 18 public declarations — 0 types, 18 arms. 18 pinned by a lane, 0 not. channel `%rc` · commit `242d79e`

## Import

A module arrives by name and nothing in it is ambient. Every arm below is reached as `hof.<name>`.

```jock
import hof;
```

The name is the file name minus `.jock`: `hof` is `crates/jockc/hoon/lib/hof.jock`, and it is found because the directory holding it was passed as a `--data-dir`. There is no search path and no implicit import; `tools/libs.py` holds the whole discovery rule, and the compiler itself is a pure function of source and libraries.

## About

Jock's function type is `A -> B` and it is RIGHT-ASSOCIATIVE, so `A -> B -> C` is `A -> (B -> C)` and currying is spellable in the surface syntax with no encoding. A multi-argument func has a TUPLE domain: `func add(x: @, y: @) -> @` has the type `(@, @) -> @`, one argument that happens to be a pair. That single fact organizes this whole module — `curry` moves between the two shapes, and nothing here needs a Curry2, Curry3 tower.

Function values are closures, so the arms that RETURN functions return real values: `compose(f, g)` is a noun you can bind, store in a struct field, and pass on.

A gate-typed VALUE takes one argument, so a tupled domain is applied to an explicit tuple — `f((a, b))`, not `f(a, b)`. A declared func keeps the familiar `add(2, 3)`.

## Arms

18 arms, in source order. The signature is reproduced exactly; the prose is the comment above the arm in `crates/jockc/hoon/lib/hof.jock`.

| arm | signature | pinned by |
|---|---|---|
| `id` | `func<A> id(x: A) -> A` | `hof-arms` (assert) |
| `constant` | `func<A, B> constant(a: A, b: B) -> A` | `hof-arms` (assert) |
| `ap` | `func<A, B> ap(f: A -> B, a: A) -> B` | `hof-arms` (assert) |
| `compose` | `func<A, B, C> compose(g: B -> C, f: A -> B) -> A -> C` | `hof-arms` (assert) |
| `pipe` | `func<A, B, C> pipe(f: A -> B, g: B -> C) -> A -> C` | `hof-arms` (assert) |
| `curry` | `func<A, B, C> curry(f: (A, B) -> C) -> A -> B -> C` | `hof-arms` (assert) |
| `uncurry` | `func<A, B, C> uncurry(f: A -> B -> C) -> (A, B) -> C` | `hof-arms` (assert) |
| `flip` | `func<A, B, C> flip(f: (A, B) -> C) -> (B, A) -> C` | `hof-arms` (assert) |
| `bind1` | `func<A, B, C> bind1(f: (A, B) -> C, a: A) -> B -> C` | `hof-arms` (assert) |
| `turn` | `func<T, U> turn(xs: List<T>, f: T -> U) -> List<U>` | `hof-arms` (assert) |
| `weld` | `func<T> weld(a: List<T>, b: List<T>) -> List<T>` | `hof-arms` (assert) |
| `filter` | `func<T> filter(xs: List<T>, p: T -> Bool) -> List<T>` | `hof-arms` (assert) |
| `foldr` | `func<T, U> foldr(xs: List<T>, z: U, f: (T, U) -> U) -> U` | `hof-arms` (assert) |
| `foldl` | `func<T, U> foldl(acc: U, xs: List<T>, f: (U, T) -> U) -> U` | `hof-arms` (assert) |
| `all` | `func<T> all(xs: List<T>, p: T -> Bool) -> Bool` | `hof-arms` (assert) |
| `any` | `func<T> any(xs: List<T>, p: T -> Bool) -> Bool` | `hof-arms` (assert) |
| `find` | `func<T> find(xs: List<T>, p: T -> Bool) -> T?` | `hof-arms` (assert) |
| `mapor` | `func<T, U> mapor(x: T?, f: T -> U, d: T) -> U` | `hof-arms` (assert) |

### `id`

```jock
func<A> id(x: A) -> A { ... }
```

Generic in `A`.

No comment in the source. The signature above is the whole of what `id` states about itself.

*asserted by examples/hof-arms.jock*

```jock
assert hof.id(7) == 7;
```

### `constant`

```jock
func<A, B> constant(a: A, b: B) -> A { ... }
```

Generic in `A, B`.

No comment in the source. The signature above is the whole of what `constant` states about itself.

*asserted by examples/hof-arms.jock*

```jock
assert hof.constant(1, 2) == 1;
```

### `ap`

```jock
func<A, B> ap(f: A -> B, a: A) -> B { ... }
```

Generic in `A, B`.

No comment in the source. The signature above is the whole of what `ap` states about itself.

*asserted by examples/hof-arms.jock*

```jock
assert hof.ap(inc, 41) == 42;
```

### `compose`

```jock
func<A, B, C> compose(g: B -> C, f: A -> B) -> A -> C { ... }
```

Generic in `A, B, C`.

compose(g, f) is g after f; pipe(f, g) is the same in reading order, which is the one worth having in a chain.

*asserted by examples/hof-arms.jock*

```jock
assert hof.compose(inc, dbl)(10) == 21;
```

### `pipe`

```jock
func<A, B, C> pipe(f: A -> B, g: B -> C) -> A -> C { ... }
```

Generic in `A, B, C`.

No comment in the source. The signature above is the whole of what `pipe` states about itself.

*asserted by examples/hof-arms.jock*

```jock
assert hof.pipe(inc, dbl)(10) == 22;
```

### `curry`

```jock
func<A, B, C> curry(f: (A, B) -> C) -> A -> B -> C { ... }
```

Generic in `A, B, C`.

curry and uncurry move between the tupled domain a declared func has and the nested-arrow shape. They are inverses: uncurry(curry(f)) has f's type and f's behavior.

*asserted by examples/hof-arms.jock*

```jock
assert hof.curry(add)(2)(3) == 5;
```

### `uncurry`

```jock
func<A, B, C> uncurry(f: A -> B -> C) -> (A, B) -> C { ... }
```

Generic in `A, B, C`.

No comment in the source. The signature above is the whole of what `uncurry` states about itself.

*asserted by examples/hof-arms.jock*

```jock
assert hof.uncurry(hof.curry(add))((4, 5)) == 9;
```

### `flip`

```jock
func<A, B, C> flip(f: (A, B) -> C) -> (B, A) -> C { ... }
```

Generic in `A, B, C`.

No comment in the source. The signature above is the whole of what `flip` states about itself.

*asserted by examples/hof-arms.jock*

```jock
assert hof.flip(sub)((1, 9)) == 8;
```

### `bind1`

```jock
func<A, B, C> bind1(f: (A, B) -> C, a: A) -> B -> C { ... }
```

Generic in `A, B, C`.

A partial application: the closure keeps `a`, so this is the one-shot form of currying for an already-tupled func.

*asserted by examples/hof-arms.jock*

```jock
assert hof.bind1(add, 100)(5) == 105;
```

### `turn`

```jock
func<T, U> turn(xs: List<T>, f: T -> U) -> List<U> { ... }
```

Generic in `T, U`.

turn DELEGATES to the pinned +turn rather than recursing here, so a program writes one spelling and gets the kernel's formula — which is jetted, where this recursion was interpreted. Measured over 20,000 elements: the delegating form costs no time the harness can resolve, the recursion below it cost about two seconds. At small sizes there is nothing in it; this matters for long lists and hot loops, and costs nothing either way.

The arm is forall-signed, and this func is generic, so the call is a generic call from inside a generic body: T and U are rigid here and the arm's own binders solve from the arguments.

*asserted by examples/hof-arms.jock*

```jock
assert hof.turn([1, 2, 3], inc) === [2, 3, 4];
```

### `weld`

```jock
func<T> weld(a: List<T>, b: List<T>) -> List<T> { ... }
```

Generic in `T`.

weld appends: every element of `a`, then every element of `b`. A list is built at its head, so without this the only way to put something BEHIND an existing list is to rebuild it by hand --- and a breadth-first walk, a flood fill and an accumulating render all need exactly that.  Discovered missing by a real caller rather than guessed at.

*asserted by examples/hof-arms.jock*

```jock
assert hof.weld([1, 2], [3, 4, 5]) === [1, 2, 3, 4, 5];
```

### `filter`

```jock
func<T> filter(xs: List<T>, p: T -> Bool) -> List<T> { ... }
```

Generic in `T`.

No comment in the source. The signature above is the whole of what `filter` states about itself.

*asserted by examples/hof-arms.jock*

```jock
assert hof.filter([1, 2, 3, 4, 5], isodd) === [1, 3, 5];
```

### `foldr`

```jock
func<T, U> foldr(xs: List<T>, z: U, f: (T, U) -> U) -> U { ... }
```

Generic in `T, U`.

foldr is the right fold: f(x1, f(x2, ... f(xn, z))). It is the one that builds lists, since `cons` drops straight into it. It delegates to the kernel's +reel, whose gate takes (item, acc) — the order this signature already had, so this is a straight pass-through.

*asserted by examples/hof-arms.jock*

```jock
assert hof.foldr([1, 2, 3], 0, add) == 6;
```

### `foldl`

```jock
func<T, U> foldl(acc: U, xs: List<T>, f: (U, T) -> U) -> U { ... }
```

Generic in `T, U`.

foldl is the left fold, accumulator first: f(f(f(z, x1), x2), …).

It delegates to the kernel's +roll, whose gate takes (item, acc) — the OPPOSITE order to this signature. Accumulator-first is the conventional spelling and the one every other arm here reads with, so the flip happens here rather than in the API: one wrapper closure per call, not one per element.

*asserted by examples/hof-arms.jock*

```jock
assert hof.foldl(0, [1, 2, 3, 4], add) == 10;
```

### `all`

```jock
func<T> all(xs: List<T>, p: T -> Bool) -> Bool { ... }
```

Generic in `T`.

No comment in the source. The signature above is the whole of what `all` states about itself.

*asserted by examples/hof-arms.jock*

```jock
assert hof.all([1, 3, 5], isodd);
```

### `any`

```jock
func<T> any(xs: List<T>, p: T -> Bool) -> Bool { ... }
```

Generic in `T`.

No comment in the source. The signature above is the whole of what `any` states about itself.

*asserted by examples/hof-arms.jock*

```jock
assert hof.any([2, 4, 5], isodd);
```

### `find`

```jock
func<T> find(xs: List<T>, p: T -> Bool) -> T? { ... }
```

Generic in `T`.

find answers a unit: `~` when nothing matches. The branches are annotated to `T?` because the join of `T` and `T?` is not computed — that is the join rule, not the call rule.

*asserted by examples/hof-arms.jock*

```jock
assert (hof.find([1, 5, 20], big) ?? 0) == 20;
```

### `mapor`

```jock
func<T, U> mapor(x: T?, f: T -> U, d: T) -> U { ... }
```

Generic in `T, U`.

mapor applies f through a unit, taking the fallback the narrowing needs from the caller. See WHAT IS NOT HERE.

*asserted by examples/hof-arms.jock*

```jock
assert hof.mapor(some, inc, 0) == 42;
```

## What is not here

Stated by the module itself. The absences are the part a reader cannot guess at, so they are written down rather than left to be discovered by a refusal.

There is no fold or map over Map and Set. Their nouns are hoon treaps and traversal means enumerating entries, which needs a curated FFI arm of the `tap` family; the pinned interface carries none, so the gap is in the interface, not in this library. An option map that PRESERVES emptiness is also absent: narrowing a `T?` to its `T` member is only possible through the `??` coalesce, which needs a fallback value, and an opaque binder has no bunt to supply one. `mapor` therefore takes the fallback from the caller.

## What no lane pins

Nothing. All 18 public declarations are named by an example that runs on every push.

## Where it is used

4 examples import `hof`. Each is a complete program whose value `tools/examples.sh` pins on every push.

- `examples/hof-arms.jock` — the arms sheet: one assertion per arm
- `examples/hof.jock` — a use
- `examples/minesweeper.jock` — a use
- `examples/tap.jock` — a use

The [worked examples](/reference/examples/) page shows the shortest of these in full.
