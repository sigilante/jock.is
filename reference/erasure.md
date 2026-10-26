# Erasure and lowering

What a Jock program becomes. Types erase totally — there is no runtime type information of any kind — so a struct is a tuple, a union case is a tagged cell, and a Bool is one bit of a noun.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` in the compiler repo writes this page.
>
> channel `%rc` · commit `81306cd` (sigilante/spec-recomposition) · corpus 1055 vectors · 2026-10-27

## The erasure table

`types.md` S10.1 — the total function `⟦τ⟧` from types to noun shapes, Hoon-compatible for every interop type (decision D-1). Projected verbatim.

| τ | ⟦τ⟧ |
|---|---|
| `%atom a g` | atom (aura and guard erased) |
| `%sing a v` | the atom `v` |
| `%cell p q` | `[⟦p⟧ ⟦q⟧]` |
| `%face`, alias | transparent |
| `%ref` | ⟦unfolding⟧ (seals erased) |
| struct | right-nested tuple of fields, **declaration order**. A **one-field** struct erases to its field alone and is therefore atom-headed if the field is — which is what S6's struct-implies-cell caveat and chain.md C-25 both turn on |
| union case, nullary | the tag's **cord** — `enum E { zebra, … }` gives `E.zebra` the atom `418.530.878.842`, not an index. Probed |
| union case, payload | `[tag ⟦payload⟧]` (payload tuple right-nested) |
| `%or` | the union of member shapes (discriminable by S6) |
| `T?` | `~` (= `0`) / `[~ v]` — Hoon unit |
| `List<T>` | null-terminated right-nested list |
| `Map<K->V>`, `Set<T>` | hoon-138 treap shape, `+mug`-ordered — ordering pinned per language version; changing the hash is a versioned break |
| `Bool` | `0` (true) / `1` (false) |
| `%gate` | closure per S9.8 — opaque |
| `%var` | opaque |
| `%noun` | any noun; `%void` — no values |

Erasure is **total**: no runtime type information, and no vases beyond the FFI boundary. Nothing in a running Jock program knows what type it is.

## The same table, run

Each row is a claim S10.1 makes and the value the compiler produced when asked, probed with `tools/jockc.sh run` on 2026-10-27. These are probes, not corpus rows: the corpus asserts field *accesses* on these shapes rather than the shapes themselves, and a field access is not an erasure.

```jock
struct P { x: @, y: @ }; P( x: 1, y: 2 )
```

→ `(1, 2)` — a struct is a right-nested tuple of its fields, in declaration order

```jock
struct One { v: @ }; One( v: 42 )
```

→ `42` — a ONE-FIELD struct erases to its field alone — there is no wrapper, so it is atom-headed if the field is

```jock
struct P { x: @, y: @ }; struct Q { p: P, z: @ }; Q( p: P( x: 1, y: 2 ), z: 3 )
```

→ `((1, 2), 3)` — nesting composes, still right-nested

```jock
enum E { zebra, ant }; E.zebra
```

→ `418530878842` — a nullary union case is the tag’s CORD, not an index — `zebra` as bytes

```jock
enum R { none, some(@) }; R.some(7)
```

→ `(1701670771, 7)` — a payload case is `[tag payload]`

```jock
[1, 2, 3]
```

→ `(1, (2, (3, 0)))` — a list is null-terminated and right-nested

```jock
import hoon; let x: @? = ~; x
```

→ `0` — `T?` is the Hoon unit: `~` is `0`

```jock
true
```

→ `0` — a Bool is a loobean — `0` is true, `1` is false

## Sugar rewrites

`language.md` §8 — what each surface form becomes before minting. The rewrite is normatively stated once, at the rule id each row names, and `lib/sugar.hoon` must match it. Projected verbatim.

| Sugar | Rewrite | Stated at |
|---|---|---|
| `assert c; e` | `if c { e } else { crash }` | L-61 (the inventory) |
| `a ?? b` | `match` on unit | L-126 |
| binary operators | stdlib calls | L-38 to L-45 |
| `===` / `!==` | kernel `%same` | L-106 |
| `and` / `or` | nested `%if` (short-circuit) | L-61 |
| `xor` / `not` | `%if` and stdlib rewrites | L-61 |
| `%dot` (postfix `.`, non-limb receiver) | irrefutable match binding the receiver once | L-113 |
| index family | `.at(i)` / `.slice(a, b)` / `.put(i, v)` | L-46 to L-51 |
| lark | head/tail by axis | L-100 to L-105 |
| Unicode glyph aliases | `∈`→`in`, `×`→`*`, `÷`→`/` | L-115 |
| `print e; k` | `%slog` dynamic hint | L-33 to L-37 |
| string interpolation | `.show()` per head | L-26 to L-32 |
| collection literals | constructor calls / raw nouns | L-79 |

## What this page does not carry

The **Nock formula** a program compiles to. `tools/jockc.sh` has `run`, `check`, `kernel` and `jets`, and none of them dumps a formula, so there is nothing to extract — emitting source-to-Nock means adding that mode first. The erasure table is the type-level half of the same story and is the half that exists today.
