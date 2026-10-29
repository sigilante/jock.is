# The Jock Type System — Specification

**Status: NORMATIVE.** This document is the normative statement of Jock's static semantics: the judgments implemented by `crates/jockc/hoon/lib/check.hoon` (`elab`, `nest`, `join`, `dish`, `bunt`, `erase`, `embed`; `seek` is `+mimb:mint` — S7) and `lib/mint.hoon` (`mint` ⇒, `mill` ⇐), over the molds in `crates/jockc/hoon/sur/typ.hoon`. Surface syntax is owned by [`language.md`](language.md); this document owns meaning. It carries no chronology: the decision ledger this spec grew from, and the corrections it made to itself, are [`docs/record/types-arc.md`](../record/types-arc.md), with a forwarding index in the Appendix. Where prose here and a ledger entry disagree, this spec governs.

Section numbers (S1–S14) are stable: the sur/lib files cross-reference them by number.

Every rule stated here names the corpus vectors that PIN it, written
⟨`id`, `id`⟩ — live vector ids, not obligations. A rule with none says
⟨none — UNPINNED⟩, or says in prose which half is unvectored, so the
gap is countable rather than invisible. The vector format is S13.

The convention used to be ⟨id+, id−⟩: the *obligation* a rule carried,
one positive and one negative, written whether or not they existed. Of
93 such names, 12 resolved exactly, 42 resolved only as family
prefixes, and 39 pointed at nothing — and `tools/citecheck.py` could
see none of them, because its regex wanted a backtick around each name
where this file backticked the whole group.
[`docs/record/types-arc.md`](../record/types-arc.md) records what was
wrong with which.

---

## S1. Framework and judgment inventory

Jock's type system is the "Swift for Nock" package: **bidirectional local checking** over a **small closed subtype preorder** (not a lattice: see the note under S5.2), with **iso-recursion through nominal declarations only**, **erased rank-1 ∀ with trait dictionaries**, and **total erasure** (no runtime type information of any kind; no vases beyond the FFI-boundary `$hvase`).

There is no global unification, ever. Functions are fully annotated (syntactically required); `let`/`var` infer from their value; generic instantiation resolves locally from arguments or from the expected type.

The judgments, with signatures frozen in the named files:

| Judgment | Signature | Home | Reading |
|---|---|---|---|
| `elab` | `env × tex → typ` | check | a type expression acquires meaning |
| `nest` | `env × typ × typ → ?` | check | `have` usable where `want` demanded. The env is **not** optional: N13 unfolds data nominals through it (S5.1) |
| `join` | `env × typ × typ → typ` (partial) | check | *an* upper bound, synthesis only — **not** a least one, and not commutative (S5.2) |
| `dish` | `env × (list typ) → ?` | check | pairwise discriminability of union members |
| `seek` | `env × hair × (list jlimb) → (unit [code=nasm typ ax=@ mut=? arm=?])` | **mint** (`+mimb`) | limb path to **emitted code**, type, axis, mutability and armness. The `code` field is what "resolution and emission are fused" means (S7); a product of `[typ @]` would be the two-stage resolver S8.3 records as never built |
| `bunt` | `env × typ → nasm` (partial) | check | the default value, as code |
| `erase` | `typ → lay` (total) | check | the subject-layout skeleton |
| `embed` | `typ → type` (partial) | check | the `+ut` oracle boundary, CI-only |
| `mint` | `env × jock → [nasm typ]` | mint | ⇒ synthesize type and code |
| `mill` | `env × jock × typ → nasm` | mint | ⇐ check against expected type |

`nest` never changes a noun (subsumption is representation-preserving). The **only** checking-mode coercion in the language is optional injection (S8.1). `join` runs only under `mint`.

## S2. The type language

`$typ` (sur/typ) is the closed grammar of semantic types:

```
τ :=  %atom aura guard?       atoms:  aura, optional guard (S3)
   |  %sing aura val          singleton of a literal (S4)
   |  %cell τ τ               product
   |  %face name τ            name metadata; judgment-transparent
   |  %sum (tase list)        tagged sum — unfolded form only (below)
   |  %or (τ list)            untagged discriminable union (S6)
   |  %gate τ τ               function type (closure at the ABI, S9.8)
   |  %ref name (τ list)      nominal reference; sealed; invariant args
   |  %var name               rank-1 type variable (S9.7)
   |  %noun                   top
   |  %void                   bottom, uninhabited
```

Structural rules that hold everywhere:

- **`%face` transparency.** Every judgment looks through `%face` on either side. Names are metadata for `seek` and diagnostics, never type structure.
- **Seals.** `%ref` is sealed: same shape ≠ same type. `nest` on `%ref` is name equality plus invariant argument check (S5); no judgment unfolds a `%ref` except `elab` at elimination positions (field access, match, call of a constructor), `dish` (one level), and `bunt`/`embed`.
- **`%sum` is never utterable.** It has no surface spelling and no `tex` form; it arises exclusively as the one-level unfolding of a `%ref` naming a declared `union`. Invariant: any `%sum` in a derivation is the image of an unfolding. (`tase` is `[tag=@tas t=(unit typ)]`: `t=~` is a nullary case.)
- **`%or` is ordered.** The member list is syntactic order; the first non-`%void` member is the bunt case (S10.2). Members are pairwise discriminable (S6), enforced at `elab` time — an undiscriminable `%or` is unrepresentable in well-typed derivations.
- **`%var` occurs only under a binding `$scheme`** (or, as `'Self'`, under a trait declaration). A `%var` outside its binder's scope is an `elab` error.

## S3. Atoms: auras, the atom lattice, guards

### S3.1 Aura inventory

Auras are flat: every named aura sits directly under bare `@` (aura `%$`). There is no Hoon-style prefix nesting; `@ud` vs `@u` subtlety does not exist. The initial semantic vocabulary (open-ended; surface-utterable set in language.md §3.1):

| aura | surface | notes |
|---|---|---|
| `%$` | `@`, `Atom` | bare atom; top of the atom sublattice |
| `%number` | `Nat` | unsigned decimal; the aura a decimal literal carries, and the return aura of nineteen pinned arms (runtime.md R-12). Ordered **below** `%$` (S3.2) |
| `%hex` | `Hex` | |
| `%sint` | `Int` | ZigZag per `@sd` |
| `%real`, `%real16/32/128` | `Float64…` | IEEE 754 |
| `%logical` | `Bool` | `true` = `0`, `false` = `1` (Hoon loobean parity) |
| `%chars` | `Byte`, `UniChar` | one aura, two guards: `%byte` (< 256) and `%unic` (`0x0`–`0x10FFFF`). Both are reached by name through the boot env |
| `%date`, `%span` | `Date`, `Span` | |
| `%tas` | (term constants `%foo`) | tag atoms |
| `%n` | (the `~` literal) | null; the unit none-form |

`String` and `Path` are stdlib nominal types, not auras; their erasures are pinned by the runtime-library interface spec (M4).

### S3.2 The atom sublattice

```
%sing a v  ≤  %atom a g   (if sat(g, v))  ≤  %atom a ~  ≤  %atom %$ ~  (= @)  ≤  %noun
```

Aura mixing is not subtyping: `%atom a₁ g ≤ %atom a₂ g'` requires `a₁ = a₂` or `a₂ = %$`.

### S3.3 Conversions

Conversions between auras are **explicit casts** (`as`, S8.10), free at runtime (erasure-identical). There is no implicit aura conversion anywhere — including literals: `let x: Hex = 3;` is an error (`3` is `%number`); write `0x3`.

### S3.4 Guards


Guards are a **closed, enumerated set** — `%based` (value < 2⁶⁴ − 2³² + 1, the Goldilocks prime), `%byte` (< 256), `%unic` (a Unicode scalar, `0x0`–`0x10FFFF`), `%loob` (< 2), `%term` (a valid Hoon term). **Five.** A guard is not a general refinement mechanism and never will be.

The set is **partially ordered by inclusion**:

```
%loob  ⊂  %byte  ⊂  %unic  ⊂  %based  ⊂  ~   (~ = unguarded, every atom)
%term                                 ⊂  ~
```

**What the compile-time literal check actually refuses.** All three
reachable guards refuse through `nest`, so the tag is `%mill-nest` with
a position and not a guard-specific one: `let b: Base = p;` refuses
while `p - 1` passes, which is a genuine bound check. For `Byte` and
`Bool` the **aura gate fires first** (S3.3) — a decimal literal is
`%number` and neither type is, so `let b: Byte = 255;` refuses too, and
the range check is never reached from a decimal literal at all. The
spellings that do reach these types are `'a'` for `Byte` and
`true`/`false` for `Bool`. Probed. ⟨`t-mint-guard`, `t-nest-sa-p`,
`t-nest-guard-loob-p`, `t-nest-guard-loob-n`⟩

`%term` is **incomparable with the other four**, measured rather than assumed: `1` is not a term (so `%loob ⊄ %term`), `200` is not a term (`%byte ⊄ %term`), `0x1f600` is not a term (`%unic ⊄ %term`), and `'transaction'` is a term of 11 bytes, which exceeds the prime (`%term ⊄ %based`). They overlap without containment — `'a'` is both a byte and a term — which is why the order stopped being a chain when `Term` landed.

Two rules depend on the order, and the partiality shows in both:

- **N5 subsumes** along it: a tighter guard stands wherever a looser one is demanded. `%term` therefore stands only where `~` is demanded. `+subg` states the relation explicitly rather than comparing ranks, because there are no ranks in a partial order.
- **J5 synthesizes by AURA, not by ladder** (`+agrd`). Each aura names the guard its values are refined by — `%logical → %loob`, `%chars → %byte`, `%tas → %term`, `%$`/`%number`/`%hex` → `%based` — and the guard applies only if both values satisfy it. Walking a ladder instead would hand two `%tas` singletons `%byte` (since `'a'` and `'b'` are bytes), which does not nest under `Term`: exactly the `Byte` join bug this morning, in a new hat. `%real` deliberately names no guard — an IEEE double is a full 64-bit pattern, so `%based` would be wrong, and the old ladder gave small doubles `%based` by accident of magnitude.

Guarded types reach the checker through a **name** rather than a spelling — with one exception, `%based`, which *is* a `tex` form and so is utterable directly (`sur/jock`). `Bool`, `Byte`, and `Term` are boot-env aliases carrying their guards (`+booldef`, `+cdef`, `+termdef`). A bare `[%atom %logical ~]` written anywhere in the compiler re-opens the every-atom-is-a-`Bool` hole, which is why the parser resolves these by name rather than shortcutting them to an aura.

**`%term` is the first guard whose check is not O(1)** — `+sane` walks the atom's bytes. Guards are otherwise advertised as cheap construction-boundary checks; this one is proportional to the term's length. It is also the first guard implemented by *calling* the substrate rather than restating it: both `sat` (compile time) and the emitted mold test (`+mtst`, which embeds `(sane %tas)` as a constant gate) use Hoon's own checker, because `Term` exists for interop and a second implementation of the term grammar would be a correctness bug at the boundary it was added to guard.

**`Term` is deliberately not forced `%based`.** A based term would be capped at 8 bytes and `'transaction'` is 11; a `Term` that silently rejected ordinary chain terms would fail at exactly the boundary it exists to guard. Where a field element is genuinely wanted, that is `Term` *and* `Base` at that site.

- `sat(%based, v)` iff `v` < the prime; `sat(%byte, v)` iff `v` < 256; `sat(%loob, v)` iff `v` < 2; `sat(%term, v)` iff `((sane %tas) v)`; `sat(~, v)` always.
- **Checked at construction boundaries only**: compile time for literals (a literal checked against a guarded type must satisfy the guard — ⟨`t-nest-sa-p`, `t-nest-sa-n`⟩); runtime entry via `as!`/`as?` (S8.10). Erased everywhere else.
- Field arithmetic preserves `Base` via stdlib signatures (`(Base, Base) -> Base`); the checker never re-derives guard facts from operations.
- Widening (S4) **drops guards**: guards survive only through annotations and signatures, never through inference.

## S4. Singletons

Literals synthesize singleton types: `3 ⇒ %sing %number 3`, `%foo ⇒ %sing %tas 'foo'`, `true ⇒ %sing %logical 0`. The lexical constant flag on `$jatom` is the carrier.

**Shallow by construction** — the widening rule, `widen`:

```
widen(%sing a v)  =  %atom a ~        (aura kept, guard NOT synthesized)
widen(τ)          =  τ                 otherwise
```

applies at exactly these places:

1. **`var` binding**: the bound type is `widen(⇒-type)` (future edits store other values).
2. **Every call boundary**: arguments check against parameter types (which widen by being non-singleton); results take the signature's return type as written. Singletons never survive a call.
3. **Annotations**: an annotated binding has the annotation's type.

`let` preserves singletons. This shallow-propagation rule is the structural defense against Hoon's TMI/cube pain: loop state is `var` (widened) and operators are signature-typed, so the failure mode is unreachable rather than disciplined away.

**Singletons are unutterable**: `$tex` deliberately has no singleton spelling. They arise from literals and from sum-tag positions only. Flow-sensitive narrowing is deferred (POSSIBLES P-7).

Vectors: ⟨`t-var-widen`, `t-var-widen-shallow`, `t-var-widen-annot`⟩ (a `var` widens a scalar; the widening is shallow, so a tuple needs the annotation), ⟨`t-nest-sa-p`⟩ (a singleton nests into its aura, which is what a call boundary does to it). That `let` *preserves* a singleton is observable only through the refusal its preservation causes, so `t-var-widen-shallow` is the `var` half and no row isolates the `let` side. (It was described as carrying both halves in the same breath as the admission that nothing isolates the other one; the second clause is the true one.)

## S5. Subtyping (`nest`) and join (`join`)

### S5.1 `nest` rules

`nest(Δ, want, have)` carries the definition environment (like `dish`): rule N13 unfolds **data nominals** (S9.2) on the want side. All other rules are Δ-blind.

`nest(want, have)` — may a value of type `have` be used where `want` is demanded? Reflexive on structurally equal types; `%face`-transparent both sides.

**The rules are ORDERED, and the order is load-bearing.** `+nets`
tests an `%or` on the *have* side before an `%or` on the *want* side,
and the relation is non-confluent without that priority ⟨none — UNPINNED: `t-nest-oror-p` answers `%.y` under either order, so it does not discriminate the priority⟩: for
`want = @ | (@,@)` and `have = %sing 3 | (@,@)`, applying N10 first
answers yes and applying N9 first answers no. Read the table as a
priority list in the order the rows are given — which is **not**
numeric order, N9 and N10 being the pair whose priority matters.

The complete rule set, **in `+nets`'s own order**. The numbers are the
rules' names and are not the order; the rows are. Two rules have no
step of their own and are marked where they are actually discharged.

| step | # | rule | vectors |
|---|---|---|---|
| 0 | — | `%face` is stripped from either side before anything else | — |
| 1 | **N3, N12** | structural reflexivity, `want = have`. `%sing a v ≤ %sing a v` and `%var n ≤ %var n` are **equality only**, so they need no rule of their own and get none — `+nets`'s fall-through comment names them both | ⟨`t-nest-sing-p`, `t-nest-sing-n`, `t-nest-var-p`, `t-nest-var-n`⟩ |
| 2 | N1 | `τ ≤ %noun` for all τ | ⟨`t-nest-noun-p`, —⟩ |
| 3 | N2 | `%void ≤ τ` for all τ | ⟨`t-nest-void-p`, `t-nest-void-n`⟩ (void ≤ τ but τ ≰ void unless τ = void) |
| 4 | **N10** | `%or ms ≤ τ` iff `mᵢ ≤ τ` for **all** members. **Tested before N9** — this is the priority the relation needs | ⟨`t-nest-orout-p`, `t-nest-orout-n`⟩ |
| 5 | **N9** | `τ ≤ %or ms` iff `τ ≤ mᵢ` for some member (representation-preserving injection — no code) | ⟨`t-nest-orin-p`, `t-nest-orin-n`⟩ |
| 6 | N4 | `%sing a v ≤ %atom a' g` iff (`a' = a` or `a' = %$`) and `sat(g, v)` | ⟨`t-nest-sa-p`, `t-nest-sa-n`⟩ |
| 6 | N5 | `%atom a g ≤ %atom a' g'` iff (`a' = a` or `a' = %$`) and `g` **refines** `g'` in the **partial** guard order `%loob ⊂ %byte ⊂ %unic ⊂ %based ⊂ ~`, `%term ⊂ ~` only (S3.4) | ⟨`t-nest-aa-p`, `t-nest-aa-n`, `t-nest-guard-sub-p`, `t-nest-guard-wide-n`⟩ |
| 7 | N6 | `%cell p q ≤ %cell p' q'` componentwise (depth covariance; width via a `%noun` tail: `[x y z] ≤ [x *]` follows) | ⟨`t-nest-cell-p`, `t-nest-cell-n`⟩ |
| 8 | N7 | `%gate` is **invariant in the argument, COVARIANT in the return**: `%gate a r ≤ %gate a' r'` iff mutual nest of `a,a'` and `r ≤ r'` | ⟨`t-nest-gate-p`, `t-nest-gate-ret-p`, `t-nest-gate-ret-n`, `t-nest-gate-arg-n`, `t-nest-gate-argb-n`⟩ |
| 9 | N8 | `%ref n as ≤ %ref n' as'` iff `n = n'` and pairwise **mutual** nest of args (invariance; seal: no unfolding) | ⟨`t-nest-ref-p`, `t-nest-ref-n`⟩ (the − vector is two shape-identical distinct nominals) |
| 9 | **N13** | inside the same `%ref` step: a **data** nominal on the want side unrolls against a non-`%ref` have. Stated in full below | ⟨`t-nest-data-p`, `t-nest-data-n`, `t-nest-data-loop`, `t-nest-data-mutual`⟩ |
| 10 | N11 | `%sum cs ≤ %sum cs'` iff every case of `cs` occurs in `cs'` with mutually nesting payload (tag-set width, invariant payloads) | ⟨`t-nest-sum-p`, `t-nest-sum-n`⟩ |
| 11 | — | fall through: **no** | — |

Notes. N7's **argument** invariance is deliberate — contravariance would also be sound, but nothing needs it and invariance is the conservative half. Its **return** was invariant too, described here as "the smallest sound rule", until 2026-10-28: smaller than sound requires, and the cost was that every numeric `hoon` ABI arm was unusable as a *value*. `+harms` pins `hoon.dec` as `@ -> Nat` — a deliberate NARROWING, since Hoon's own `+dec` casts to `^- @` (runtime.md R-59a) — surface `@ -> @` has `%$` in the return, and `%$` does not nest into `%number` — so `let g = hoon.dec; g(5)` compiled while `let g: @ -> @ = hoon.dec`, a struct field, and `hof.ap(hoon.dec, 5)` all refused `%mill-nest`. Return covariance is sound by the obvious argument: calls through the gate produce values of `have`'s return type, which are values of `want`'s exactly when `have`'s return nests into `want`'s. *(Re-pinning the returns to bare `@` was tried first and is worse: `var b = 0` widens to `Nat`, so `b = b + 1` stops nesting and every mutable counter breaks. The asymmetry was in this rule, not in the curation — runtime.md R-59a records the rejection with its measurement.)* **Casts stay invariant** — `+gcng`, S8.10 — because a cast reinterprets bits rather than passing values through. Hoon's `+ut` nests gate payloads covariantly, so gates are excluded from nest-agreement oracle vectors (S11) — and that covariance is why Hoon survives the same `@`/`@ud` equivocation that was fatal here: this rule is now the one Hoon already had. N4/N5 make guard satisfaction a *computation* on singletons — `%sing %number 3 ≤ Base`-atoms holds because `sat(%based, 3)`.

- **N13 (data roll), stated in full.** `nest(Δ, %ref n args, have)` where `n` is a **data nominal** and `have` is *not* a `%ref`: unfold `n` (arguments substituted) and retry, under a **coinductive seen-set of `[want have]` pairs** — a repeated pair holds (`≤` is the largest such relation). Iso-recursion's roll is implicit for data nominals — a structural value flows into `List<T>` with no constructor. Terminating by the seen-set: an unroll leaves `have` untouched; between unrolls the structural rules decompose `have`, whose subterms are finite, and data bodies are regular, so the reachable pairs are finite. **That last clause is a PREMISE, not a checked property** — stated here as a fact until 2026-10-28, while `+nets`'s own header has named it since 2026-09-01. Regular means no polymorphic recursion: a `%data` body that grew an argument (`data A(T) = … A(f(T)) …`) would never repeat a pair, the seen-set would never fire, and this arm has **no depth cap**, alone among the type walkers. Nothing checks it and nothing needs to yet, because there is no surface form for `%data` — the population is the five boot registrations (`List`, `Map`, `Set`, `String`, `Path`), all regular. The tripwire is explicit: the day a module can export a user-authored `%data` (S9.2 contemplates it) is the day this needs a cap. See S14. ⟨`t-nest-data-p`, `t-nest-data-n`, `t-nest-data-loop`, `t-nest-data-mutual`⟩

**Nominal identity across module boundaries.** N8
compares `n` as a cord, so what a nominal's *name* is across an
import decides when two values unify. It is the **canonical**
`lib.T`, written by `+qnam` from the DECLARING module's name: a
qualified name is stable because `import` admits no alias and
module names are globally unique per build (`libs.py` refuses a
collision), and one type stands behind it because `+hlibs` mints
each module exactly once. So a `d.T` reaching a program through
`b` and one reaching it through `c` are the same cord and nest by
N8 — which is why modules may re-expose a dependency's type at all
(`t-jdag-tdiamond`; docs/record/module-layering.md). Jock has no functor
and no parameterized module, so a module has exactly one meaning
per build; name-canonicalization is sufficient here where it would
not be for a language with generative instantiation.

### S5.2 `join` rules

**What `join` is not**. It returns *an* upper
bound, not a least one: `join(%sing %number 300, %atom %number %byte)`
is `Nat`, though `%atom %number %based` is a strictly tighter bound.
It is **not commutative** — for the mutually-nesting pair
`%or[~, (~,@)]` and `%or[(~,@), ~]`, `join` returns `@?` one way and
`(~, @) | ~` the other, because J0 returns whichever operand it tests
first. And `nest` is a **preorder, not a partial order**: those two
types nest both ways while differing, and their *bunts* differ (`0` vs
a cell), so mutually-nesting types are not interchangeable and `bunt`
is not well-defined on the equivalence classes.

None of this is unsound — upper bounds suffice for synthesis — but two
consequences are worth knowing: `if c { x } else { y }` and
`if c { y } else { x }` can synthesize different (mutually-nesting)
types, and `A | B` and `B | A` have different defaults while being
mutually substitutable, including as the invariant argument of a `%ref`
under N8.

`join` is **partial**. It is invoked only in synthesis position (S8.1); failure is a compile error whose diagnostic names both branch types and suggests an annotation or an explicit `A | B`. `join` never **synthesizes** `%noun`, `%or`, or `%sum` — a lub that would require *inventing* one is a failure (the union-invention case P-9 shelved). J0 may **return** an `%or`/`%ref` only when it was already an operand: subsumption selects the wider input, inventing nothing.

| # | rule |
|---|---|
| J0 | subsumption, **not both atom-shaped**: `a ≤ b ⇒ join = b`; `b ≤ a ⇒ join = a`. The lub of a subtype/supertype pair is the wider one, decided by `nest` (S4) — so J0 reaches the `%ref`/`%or`/`%cell` operands the structural rules below cannot, letting a cons/unit literal in one branch merge with the `List`/optional **value** the other branch carries (retiring the `func cons(x,xs) -> List<T> { (x,xs) }` coercion helper). Guarded to skip atom-vs-atom, which J5/J6 own — including J6's deliberate cross-aura refusals. **Scope:** J0 fires only when one branch already *is* a supertype of the other; two structural subtypes of a common collection that is *neither* operand (the `~`-and-cons arms of a recursive list **builder**) still need a typed helper or a checking-position annotation, since selecting an operand cannot reach a type neither side names |
| J1 | `join(τ, τ) = τ` (structural equality) |
| J2 | `join(%void, τ) = τ` |
| J3 | `join(%noun, τ) = %noun` (only when one side already *is* `%noun`) |
| J4 | `join(%face n τ, %face n υ) = %face n join(τ, υ)`; differing names strip: `join(τ, υ)` |
| J5 | same-aura atoms: `join(%sing a v, %sing a w)` = `%sing a v` if `v = w`, else `%atom a g` where `g` is the guard **of the aura** if both values satisfy it (`+agrd`/`+jgrd`), *not* the tightest guard in the ladder, or `~` if none does. `join(%sing a v, %atom a g)` = `%atom a g` if `sat(g,v)` else `%atom a ~`. `join(%atom a g, %atom a g')` = `%atom a` with the **looser** of `g`, `g'` (the union admits both) |
| J6 | differing auras: within the NUMERIC family (`%$`/`%number`/`%hex`) `join = %atom %$ ~`; every other pair REFUSES with `%join-aura` (universal widening put an integer and an IEEE double under one `@`, which the operator column refuses at the front door; a union is unavailable because `%or` needs runtime discriminability and auras are erased — POSSIBLES P-9) |
| J7 | `join(%cell p q, %cell p' q') = %cell join(p,p') join(q,q')` |
| J8 | `%ref`: equal name and args → itself; otherwise **fail** |
| J9 | `%gate`, `%or`, `%sum`, `%var`: structurally equal → itself; otherwise **fail** |
| J10 | atom-shaped vs cell-shaped: **fail** |

Vectors: ⟨`t-join-sing-p`, `t-join-fail-n`⟩ (J5 widens two literals; J10 errors on `if c { 3 } else { [1 2] }` in synthesis position), ⟨`t-join-void-p`⟩ (crash-branch: `join(%void, τ) = τ`), and one per aura — ⟨`t-join-sing-loob-p`, `t-join-sing-byte-p`, `t-join-sing-based-p`⟩ for per-aura guard synthesis, ⟨`t-join-atom-guard-p`⟩ for the looser-of rule on two guarded atoms. `t-join-sing-p` is the decisive row: `join(3, 5)` is `%based`, not `%byte`, though both values satisfy `%byte` — synthesis consults the aura and does not walk the ladder.

**Why the aura and not the ladder.** `%term` makes the guard order *partial*: `'a'` is both a byte and a term, so a ladder would hand two `%tas` singletons `%byte`, which does not nest under `Term`. Consulting the aura is what keeps J5 total. J0 subsumption: ⟨`t-join-sub-cell-or-p`, `t-join-sub-or-cell-p`, `t-join-sub-null-or-p`, `t-join-sub-miss-n`⟩ (a cons or null literal merges with an option-shaped `%or`, commutatively; the miss case still fails when neither side nests).

## S6. Untagged unions and the discriminability judgment (`dish`)

`A | B` is admitted iff its members are **pairwise discriminable**: separable at runtime by the bounded discriminant instruction set

```
D1:  cell-test at axis 1          (Nock 3)
D2:  equality-to-constant at axis 1   (root atom vs finite tag set)
D3:  equality-to-constant at axis 2   (head tag vs finite tag set)
D4:  cell-test at axis 2              (head SHAPE: pair vs atom)
```

— and nothing else. This is the *exact* bounded-depth statement: a
discriminant may inspect the root's cellness, compare the root (if
atom) or the head (if cell) against finite atom sets, and test the
head's cellness.  No deeper inspection, no loops: the emitted
discriminant inspects depth ≤ 2 and never iterates.

*D4 was always emitted — `+dorf`
produces `[6 [3 [0 1]] [3 [0 2]] [1 1]]` for a `pair` head and its
inversion for `atom` — and the Judgment paragraph below has named it
since jock#72 as "D1 applied at the head". The list said "and nothing
else" while the rule beneath it used a fourth instruction, so the
bounded-depth statement was understated rather than wrong.*

**Classification.** For an elaborated member τ, define its shape-classes and tag sets:

- `%sing a v` → atom-shaped, atom-tags `{v}`.
- `%atom a g` → atom-shaped, atom-tags **⊤** (unbounded).
- `%cell p q` → cell-shaped. Head-tags = atom-tags of `p` when `p` is tag-like; otherwise the head's **shape** is classified (jock#72): `pair` if `p` is definitely a cell, `atom` if definitely an atom of unknown value, ⊤ only if it could be either. The shape comes from a separate walk (`+dshp`) that stops at the *first* shape rather than classifying the whole type, which is why it may follow `%ref`s past the one-unfolding budget without reopening termination — a recursive nominal places its recursive occurrence under a `%cell`, so reaching it means the answer is already `pair`. **Struct-implies-cell holds only at two or more fields**: a one-field struct erases *to* its field, so `struct One { x: @ }` is an atom.
- `%ref` → classify its **one-level unfolding** (aliases expand fully first; a `%ref` still unresolved to tag-like structure after one unfolding classifies as ⊤ in the relevant dimension — this is what bounds the judgment).
- `%sum cs` → mixed: atom-tags = tags of nullary cases; head-tags = tags of payload cases.
- `%or ms` → the unions of its members' classifications (already discriminable inductively).
- `%face` → transparent. `%void` → empty (vacuously disjoint). `%noun`, `%var`, `%gate` → ⊤ in both dimensions (never discriminable against anything overlapping).

**Judgment.** `dish(e, [τ₁ … τₙ])` holds iff for every pair `i ≠ j`, in each dimension where both members are inhabited (atom~atom, cell~cell), both tag sets are ≠ ⊤ and disjoint. Atom-shaped vs cell-shaped needs no tags (D1 separates). **On the cell side, `pair` and `atom` are disjoint from each other — D1 applied at the head** — which is what makes an untagged union of two struct types admissible when one is struct-headed and the other atom-headed (hoon's `$^`; jock#72). `atom` subsumes a tag set, so it is disjoint from neither; two `pair`s are not disjoint, because the refinement is head *shape*, not head identity.

`T?` is the canonical instance: `%or [%sing %n 0, %cell (%sing %n 0) T]` — none-form is the atom `0`, some-form is a cell, so **every** `T` is admissible, including atoms, cells, and nested `T??`.

Bool is *not* tag-like in 1.0 (`%logical` is an aura, hence ⊤); `Bool | T` is only admissible where cellness separates.

Vectors: ⟨`t-dish-ac-p`, `t-dish-aa-n`⟩ (atom|cell ok; `@ | %foo` refused — aura is ⊤), ⟨`t-dish-tags-p`, `t-dish-tags-n`⟩ (two unions with disjoint/overlapping tag sets), ⟨`t-dish-unit-p`⟩ (`T?` for cell-shaped `T`).

## S7. Environments and resolution (`seek`)

*(`seek` **is implemented by `+mimb:mint`**, not by `check.hoon`. A judgment-side mirror in `check.hoon` was deleted: it had no callers, it had never learned imports — `check.hoon` cannot see `def.imports`, so it could not resolve `hoon.add`, the first limb of nearly every program — and its `%type` head was a standing `XX`. `+mimb` resolves and emits in one pass, which is why the judgment lives on the emitting side; the S7 vectors run against it.)*

`$env` is three structures with one job each: `lay` (the shape of the runtime subject), `nam` (lexical scopes, innermost first; shadowing is list order; each entry carries `ax`, `mut`, `typ`), `def` (types, impls, imports, consts).

`seek(e, h, limbs)` resolves a limb path to
`(unit [code=nasm t=typ ax=@ mut=? arm=?])` — the **emitted code** for
the access, its type, the axis it lives at, whether the binding is
editable, and whether it resolved to an arm. The `code` field is item 3
below in the product rather than in prose: resolution and emission are
one pass, so there is no intermediate location to hand on.

1. **Head resolution.** A `%name` head searches `nam` scopes innermost-first; the first hit wins (shadowing). `import` binds the library name in `nam` like any binding, so qualified access (`hoon.add`) is ordinary head-then-tail resolution; an unqualified name that would be ambiguous between an import's exports and a local binding does not exist — imports put only the *library name* in scope (qualified access is the only access; the "ambiguous name, qualify it" diagnostic belongs to the import section of language.md). A `%type` head (`Option.some`, `Point.new`) resolves in `def.types`: union case constructors, class static/inherent methods. `%axis` is a raw axis (compiler-internal).
2. **Tail resolution.** Each subsequent `%name` limb resolves against the type at hand, in this order: `%face` match → struct/class field (unfolding the seal of a `%ref` for **fields of its own declaration only** — field access does not unseal foreign nominals) → inherent method (class suite) → trait method (via `def.impls`; ambiguity between two traits both providing the name is an error: qualify). Field axes follow the declaration-order right-nested tuple layout (S10.1).
3. The result axis is a leg (Nock 0). *(It was once typed `$jwing`, "a bare axis or `[arm core]`, an arm at a core (Nock 9)" — the shape a **two-stage** resolver would produce, handing a location to a separate emitter. That resolver was never built: `+mimb` fuses resolution with emission, so an ABI arm — dictionary, import, group member — becomes a fired arm or a built closure at the point of resolution, and the cell case was constructed by nothing anywhere. `$jwing` is removed rather than collapsed to a bare `@` and kept for its name: a mold with no consumer is the same debt as an arm with no caller.)*

`%edit` legality reads the `mut` flag on the resolved `nam` entry (S8.4).

### S7.1 Positional access (lark), and why it stops at a seal

Two spellings, one meaning. **`p.+5`** names the axis directly;
**`p.<>`** spells the same path as a run of head/tail steps.
Lark is self-describing at shallow depth (`<>` reads "tail of the
head"); the numeric form is the general one, for deep or
generated axes. Both make the same `%axis` limb, so everything
below applies to both. `p.+0` refuses; `p.+1` is the identity.

**The axis is always a literal.** `+tyax` needs it statically to
type the result, so a computed axis is untypeable and stays in
`%eval` territory.

*(A bare `p.5` is deliberately unavailable: the lexer reads
digit-dot-digit as one Float64 literal, so `p.2.3` would tokenize as
name-dot-real and two consecutive numeric steps would be
unspellable. The `+` also matches Hoon's wing vocabulary.)*

`p.<` is the head, `p.>` the tail, read left to right
outermost-first — so `p.<>` is the tail of the head (axis 5) and
`p.>>` the tail of the tail (axis 7). A run is one limb
(`p.<>`) or several (`p.<.>`); both compose to the same axis, and
the whole path collapses to a **single** Nock 0 at emission
(`+mimb` accumulates with `peg`), so depth is free at runtime.

Typing is `+tyax`: the axis is decomposed with `cap`/`mas`, each
step **demands a `%cell`**, `%face` is transparent, and axis 1 is
the whole value. Anything that is not a cell ends the walk, the
limb fails to resolve, and mint refuses `%mint-naxis` — *"P has no
component at that axis; positional access does not open a
nominal"* — with a position. (This and four
other failures shared one bare `%mint-limb`; see `+dimb`.)

That gives three ways into a value, one per shape:

| shape | how you get in |
|---|---|
| anonymous product | **lark** — `p.<`, `p.>` |
| struct, class | **by name** — `p.x` |
| list, union, option | **`match`** |

**Lark does not open a seal, and this is deliberate** *(ruled
2026-08-05, with the rule itself — the date was left blank here and
is recovered from `c5d84fc`, the commit that added this section)*. `+tfan` (name access) explicitly opens "the fields
of its own declaration"; `+tyax` (axis access) does not. So `p.<`
on a `struct P { x, y }` refuses even though `p.x` succeeds.

The reasoning, recorded because it is the kind of decision worth
revisiting: **positional access into a nominal would make field
ORDER load-bearing.** Reorder a struct's fields and every `p.x`
still means what it meant; every `p.<` would silently change
meaning. Nominal typing exists precisely to make a declaration's
shape private to it, and a lark that reached through the seal
would hand that away for a spelling that is already available by
name.

If this is ever reopened, the change is one line in `+tyax` (open
a `%ref` to its own declaration, mirroring `+tfan`), and the
argument to weigh against the above is that anonymous tuples and
structs are otherwise the *same* shape with different access
rules, which is a wart. The reason to keep the wart is that the
seal is the only thing standing between field order and the
public interface. ⟨`t-lark-head`, `t-lark-seal-n`⟩



Value aliases (`=*`-style) remain shelved (POSSIBLES P-2): `seek` has no alias expansion step.

Vectors: ⟨`t-seek-shadow-p`, `t-seek-miss-n`⟩, ⟨`t-seek-field-p`, `t-seek-seal-n`⟩ (own-field unseal ok; foreign nominal's field refused), ⟨`t-mint-meth-amb`⟩ (two-trait method ambiguity).

## S8. Expression judgments (`mint` ⇒ / `mill` ⇐)

### S8.1 Modes and the mode-switch

Two mutually recursive judgments over kernel forms (`mint` crashes on any sugar-chapter node):

```
Γ ⊢ e ⇒ τ     synthesis:  mint(Γ, e) = [code τ]
Γ ⊢ e ⇐ τ     checking:   mill(Γ, e, τ) = code
```

**Mode-switch (the default ⇐ rule).** If no form-specific ⇐ rule applies:

```
Γ ⊢ e ⇒ σ    nest(τ, σ)
—————————————————————————     (no code emitted by the switch itself)
Γ ⊢ e ⇐ τ
```

**Optional injection — the only coercion.** If the mode-switch fails and τ is unit-shaped (`%or [none-sing, %cell none-sing υ]`):

```
Γ ⊢ e ⇐ υ
—————————————————     emits the wrap:  [~ v]
Γ ⊢ e ⇐ υ?
```

This is checking-position-only by construction (there is no expected type in ⇒). It covers the `~`-else idiom wherever an expected type exists. No other `%or` gets a coercion: general union acceptance is representation-preserving nest (N9). ⟨`t-text-opt-match`⟩. The negative — the same expression in synthesis position, joining to an error — is unvectored.

`join` runs in exactly one place: synthesis-mode branch forms (S8.7, S8.8).

### S8.2 Literals

- `%atom` (constant): ⇒ `%sing aura val`. Non-constant: ⇒ `%atom aura ~`.
- **The null literal** (`%null`; surface lexeme owned by language.md): ⇒ `%sing %n 0` — the only spelling that inhabits `T?`'s none member. Flat auras (D-7) make this a real requirement, exactly as in Hoon: a `%number` zero does *not* nest into `%sing %n 0`. (Found implementing S8.6 want-instantiation: none was unutterable.) ⟨`t-run-gen-want`⟩
- ⇐ `%atom a g`: aura must match exactly (S3.3); for a constant, `sat(g, val)` is checked **at compile time** (⟨`t-nest-sa-p`, `t-mint-guard`⟩); a non-constant atom expression checks only by nest (guards enter via `as!`/`as?`).
- `%crash` ⇒ `%void` (and hence ⇐ anything, by N2). ⟨`t-run-crash`⟩

### S8.3 Limbs and pairs

- `%limb`: `seek`; error (with position and a did-you-mean over `nam`) on `~`. The type is the entry's type **as stored** — a `let`-preserved singleton stays a singleton. ⇒ only (⇐ via mode-switch).
- `%cons`: ⇒ `%cell` of componentwise ⇒. ⇐ `%cell p q`: componentwise ⇐ (so injection and literal-guard checks distribute). ⇐ anything else: mode-switch. ⟨`t-run-cons`⟩ — the checking-mode refusal is unvectored

### S8.4 Bindings and edits

- `%let` (mut=`%.n`): with annotation `t`: `τ = elab(t)`, val ⇐ τ, bind τ. Without: val ⇒ σ, bind σ (singleton preserved). Body typed in the extended Γ (nam entry `mut=%.n`, fresh axis; lay extended).
- `%let` (mut=`%.y`, i.e. `var`): as above but bind `widen(σ)`; with annotation, bind the annotation **as written**, which is S4's clause 3 and is *not* widening — `var x: Base = 3;` binds `Base`, guard and all, where `widen` would have dropped it. Probed.
- `%edit`: `seek` the limb; **error unless `mut=%.y`** (⟨`t-run-edit`, `t-let-no-edit`⟩); val ⇐ the binding's type (invariant edit — no narrowing, no re-typing).

### S8.5 Functions and lambdas

- `%func`: binders `gen` enter type scope (S9.7); the signature elaborates (every parameter annotated — syntactically required; return annotated); the body checks ⇐ the return type with the function name bound to its own (instantiation-free) `%gate` for recursion, parameters bound at their annotated types. Recursive uses at the same instantiation only (rank-1). `next` typed with the function registered.
- **Function groups (mutual recursion).** Maximal runs of consecutive `%func` statements form a *group*, typed in two passes exactly like declaration groups (S9.1): signatures first, then every body checked with **all** group members' names bound at their `%gate`/scheme types. Names within a group must be distinct. Any interposed statement (a `let`, a `%decl`, an expression) splits the run — a function below the split cannot be called from above it. Full annotation is what makes this trivial: there is no inference order to solve, so mutual recursion between *generic* members at differing instantiations is unremarkable (each call instantiates locally against the callee's signature as usual). `recur`/`$()` still re-enters only the innermost enclosing `func` or `loop`; mutual calls are ordinary calls by name. Lowering: S9.8. ⟨`t-run-grp-mutual`, `t-text-grp-split-decl`⟩ (the − vector: a `let` between two `func`s breaks the forward reference). * It is now pinned by `t-text-grp-split-decl`, `t-text-grp-split-let`, `t-text-grp-split-back` and `t-text-grp-hoisted`. **RULED the same day (jock#76): a `%decl` keeps splitting a func run.** Making decls transparent would have recovered the 7–12% declaration-order cost cliff, but it forces the decl's types to register before the run's signature pass — so a type would become visible to funcs written above it — and it makes forward type reference conditional on whether a `let` happens to intervene, replacing one uniform rule ("across groups, references are strictly backward") with two. The cliff is answered by the hint instead.*
- `%lambda`: monomorphic, always (no `gen`). ⇒: every parameter must be annotated (error otherwise: "annotate or give the lambda an expected type"); body ⇒. ⇐ `%gate a r`: missing parameter annotations fill from `a`; body ⇐ `r`. ⟨`t-mill-lambda`, `t-mill-lambda-arity`⟩
- Body-position `recur`/`$()` (S8.9) re-enters with edits checked ⇐ the parameter types.

### S8.6 Calls and instantiation

`%call`: `func` ⇒ first.

- Monomorphic `%gate a r`: `arg` ⇐ `a` (argument list right-folds to the tuple shape of `a`); ⇒ `r` **as written in the signature** — singletons in arguments never reach `r` (S4).
- Generic (a `%ref`/limb resolving to a def entry with scheme `∀gen. %gate a r`): instantiation is **local first-order matching**: match `widen(⇒-type)` of each argument against `a`'s structure to solve binders left-to-right; in ⇐ position, unsolved binders may additionally match `want` against `r`. Any binder still unsolved → error ("cannot infer T; annotate"). There is **no explicit instantiation syntax** (Appendix D-14): the two local sources are the only sources.
- **Solving order is first match wins, left to right**, which is observable: `foldr(xs, ~, cons)` solves `U` from `~`'s type and then refuses `cons` against the solution. Annotate the argument that carries the informative type (bind the accumulator through an annotated `let`) rather than relying on a later argument to correct an earlier solution.
- **Enclosing binders are RIGID** *(building lib/hof)*: inside a generic body the enclosing scheme's binders are already fixed by the caller's instantiation, so a call whose callee type mentions them — canonically a call to a **function-typed parameter** — must **check** against them and must never re-solve them. Solving is for the callee's own binders only. Operationally `+gcal` seeds its solution map with `{T ↦ %var T}` for every in-scope binder (`+rgid`), after which matching skips them and the argument nest-checks against the binder under N12. Getting this wrong is not a nuisance but a soundness hole: while enclosing binders were solvable, `f(s)` for `f: T -> U` and `s: String` solved `T := String` and compiled, so a function-typed parameter's declared type was not enforced at all. ⟨`t-gen-rigid-arg`, `t-gen-rigid-unit`, `t-gen-nested-call`⟩
- For each solved binder with a trait bound `T: Tr`, require `impy(Tr, head(τ_T))` ∈ `def.impls` (S9.4) — else error naming the missing impl. Code: the dictionary for that impl is passed per the ABI (S9.8).
- Union case constructors (`Option.some(3)`) and struct literals instantiate identically — **including the rigidity above**, which is the clause this sentence described before it was true: `+mslit` and `+mcon` kept solving from `~` for five weeks after `+gcal` was fixed, so a nested declaration inside a generic body could forge its enclosing `T` from a literal. Payload constructors exist only applied (S9.3 — not first-class values in 1.0). ⟨`t-jimp-call`, `t-run-gen-bound`, `t-mint-inst-annot`, `t-err-bound-ptrait`, `t-rigid-slit`, `t-rigid-mcon`, `t-rigid-nested-ok`⟩

### S8.7 Conditionals

- `%if` ⇐ τ: `cond ⇐ Bool`; both branches ⇐ τ independently. **`join` never runs.**
- `%if` ⇒: `cond ⇐ Bool`; branches ⇒ σ₁, σ₂; result `join(σ₁, σ₂)` (J-rules; failure is the S5.2 diagnostic). ⟨`t-run-if-t`, `t-run-if-f`, `t-mint-cond` (cond ⇍ Bool), `t-join-cell-p`, `t-join-fail-n` (the join itself)⟩

### S8.8 Match

`%match` value ⇒ σ (the scrutinee synthesizes; singletons in σ enable literal-pattern completeness). Each case: pattern typed against σ (S12) extending Γ with its bindings; bodies ⇐ τ in checking mode, or ⇒ and fold with `join` in synthesis mode. Exhaustiveness per S12.3; the default case, if present, absorbs the residual space. ⟨`t-run-match-lit`, `t-run-match-sum-c`, `t-mint-match-inex`⟩

### S8.9 Loops, recur, defer

- `%loop` (label optional): the body synthesizes; `recur` (targeting this loop by label or innermost) types as `%void` (N2 makes it disappear into joins — a diverging loop is `Never`). Loop state is whatever `var` bindings the body edits; there is no loop-local type refinement (S4 keeps state widened).
- `%recur`: each edit's `limb` must resolve (S7) into the re-entered scope frame with `mut=%.y` semantics of `$()`-edit; each `val ⇐` the binding's type. ⇒ `%void`. ⟨`t-mint-recur-outer`, `t-mint-recur-naked`⟩
- `%defer`: typing rule pends the runtime spec's semantics for the form (S14); until stated, `%defer` types as its `next`.

### S8.10 Casts and coalescing

Elaborate `target` to υ; `expr ⇒ σ` (widened: casts are call-like boundaries).

- **`as` (static).** Legal iff `nest(υ, σ)` (upcast — no-op) **or** σ and υ are *erasure-congruent*: identical shape after unfolding every seal and dropping auras, faces, and singleton values, with **guards subsumed positionwise** — σ's guard must refine υ's at every atom position, invariantly under `%gate` (an argument forges one way, a return the other). This is how nominal types unseal (newtype for free) and how auras convert. Emits nothing. Never legal across genuinely different erasures, and never a way to **gain** a guard: `n as Bool` from an unguarded `n` refuses — `as!`/`as?` are the value-checked spelling. (congruence formerly dropped guards, which forged `Bool`/`Byte`/`Base` with no check emitted and falsified D-18's soundness argument.) ⟨`t-run-cast`, `t-mint-cast`, `t-as-grd-sub`, `t-err-chars-cast`⟩
- **`as?` (soft, ⇒ `υ?`)** and **`as!` (forced, ⇒ υ; crash on failure).** Legal in exactly two situations:
  1. σ is an `%or` and υ covers a subset of its members: the emitted test is the members' discriminant (D1–D4) — O(1).
  2. υ is **mold-checkable** and σ is anything (typically `%noun` from `eval`/FFI): the test is the full structural mold of υ's erasure — recursive, terminating, O(size of noun). Mold-checkable = erasures built from atoms (aura irrelevant, but **guards are checked**: `as! Base` verifies the bound — this is the runtime construction boundary of S3.4), cells, tags, declared sums, `T?`, `List`/`Map`/`Set` of mold-checkable — and (`%mold-gen` retired), **generic nominal instantiations generally** (the checker clique keys on instantiations) and **`%or` generally** (a predicate needs no discriminant: the test is the member-test OR-fold, which subsumes the old `T?`-only case). **`%gate` and dictionary types are never mold-checkable** (a noun cannot be verified to be a function) — `as?`/`as!` to any type containing them is a compile error.
  ⟨`t-run-asq-or`, `t-mint-asx-gate`, `t-run-asx-mold`, `t-run-asx-grd`⟩
- **Two fences sit on top of all three doors** — `as`, `as?`/`as!`, and
  S12.1's `%type-test`, which inherits them by being "legal exactly
  where `as?` is legal". They are stated here because they bear on
  *meaning*, not spelling, and because stating only the rule above
  made this section **permit a soundness hole it does not intend**:
  read literally, "σ is anything" licenses `(5, 4) as! SB` for
  `struct SB { a: Int, k: @ }`, which gave the field the value `-3`
  until 2026-10-28.
  1. **`%sint` is not acquirable at any position** (`%mint-cast-sint`).
     A cast reinterprets bits and ZigZag makes `Int` the one aura
     where that is value-nonsense. `sint(n)` is the conversion.
     Positionwise and **pairwise** (`+sintf:mint`): it refuses where
     the source's aura at that position is known and is not `%sint`,
     which leaves the **ingestion lane** open — an untyped source
     (`%noun`, a `%var`, an unresolvable nominal) stays moldable
     however deep the `Int` sits, because arbitrary bits genuinely
     *are* a ZigZag integer. One-way: `Int -> Atom` remains the raw
     escape hatch, as for every aura.
     ⟨`t-cast-sint-deep`, `t-cast-sint-deep-soft`,
     `t-cast-sint-deep-test`, `t-cast-sint-deep-tuple`,
     `t-cast-sint-ingest`, `t-cast-sint-deep-same`⟩
  2. **A sealed class is not forgeable** (`%mint-cast-sealed`),
     positionwise via `+sealx:mint`, and with **no** ingestion
     carve-out: arbitrary bits are a ZigZag integer but they are not
     a canonical `Rat`. A module that wants its own type ingested
     exports an arm that validates. ⟨`t-jimp-seal-deep-cast`,
     `t-jimp-seal-deep-soft`, `t-jimp-seal-deep-arg`,
     `t-seal-deep-local`⟩
- `??` (coalesce) is sugar (match on the unit), not a judgment.

### S8.11 Nock-level forms

- `%increment`: val ⇐ `%atom %$ ~`; ⇒ `%atom %number ~`. (Kernel-internal: surface `inc` is stdlib.)
- `%cell-check`: val ⇒ anything; ⇒ `Bool`.
- `%same`: both ⇒, unrestricted; ⇒ `Bool`. (Deep structural equality; comparing unrelated types is legal and simply false.)
- `%eval`: `subj ⇒`, `form ⇒`, both unrestricted; ⇒ `%noun`. Useful only under a cast (S8.10 case 2): *values crossing from `eval` must be molded*. ⟨`t-run-eval`⟩
- `%import`: binds the library name in `nam` (type from `def.imports` per S11.2); `next` continues. Unknown library → error at environment construction.

### S8.12 Type-directed constructions

- **Map literals replace on a duplicate key.** `[1 -> 100, 1 -> 200]` is `[1 -> 200]`: the literal desugars to an `mput` fold in written order, and `mput` replaces, so the LAST binding for a key wins. This is not a refusal — a duplicate key is legal and silent, deliberately, because the fold is the same operation a program performs by hand. ⟨`t-map-dup-last`⟩

- **`%struct-literal`** (kernel): `Name( f₁: e₁, … )`. Resolve `Name` in `def.types` (struct, or class — construction against its state struct, sealed to the class). Fields must cover the declaration exactly (missing/extra/duplicate = error, by name); each `eᵢ ⇐` its field type (binders solved as in S8.6 when the target is generic); ⇒ `%ref Name args`. Emission is the right-nested tuple in **declaration order** regardless of literal order. ⟨`t-mint-slit-missing`, `t-slit-miss`⟩
- **Index family** (sugar): `e[i]` and `e[i] = v` rewrite to METHOD calls `.at(i)`/`.put(i, v)` through the prelude `Idx`/`Put` traits — per-head dispatch, so `xs[i]` and `m[k]` are the same sugar. A non-limb receiver binds once through an irrefutable match; a put requires a limb place and rewrites through `%edit`. The rest of the family is trimmed — named functions when their collections land.
- **Operators** (KERNEL): `%operator` and ordered `%compare` survive desugaring (only `==`/`!=` still rewrite, to kernel `%same` — never overloadable). Mint routes on the left operand's widened bar-type: a plain aura takes the pinned kernel column directly (the fast path, not overloadable); `%real` and nominal heads consult the ops registry (`def.ops`: operator → (trait, method), registered by the **per-method** hook, `trait Add { add(+); }` — one trait per operator, `%decl-op-rebind` on a rebind. The trait-NAME form `trait Add(+)` is retired and does not parse, refusing `%parse-expected` at the paren (runtime.md R-61) and elaborate as the synthesized method call `a.add(b)`, so trait dispatch (S9) does the rest — impls, class conformance, atom-headed impls (`impl Add for Float64`, keyed `'@'++aura`), and bounded `%var` operands through the `$bnd` route. Op-traits are unparameterized, single-method, with the bare-method shorthand's signature implied by operator family (arithmetic `(Self, Self) -> Self`; comparison `-> Bool`). The column tables and prelude claims are owned by the runtime-library interface spec (§7).

## S9. Declarations, generics, traits, and the ABI

### S9.1 The `%decl` form and registration

Declarations are one kernel form: `[%decl d=dreg next=jock]` — the parser emits it directly (there is nothing to desugar: `desugar` has no environment, and registration *is* the semantics). The `mint` rule for `%decl`:

1. **Grouping.** Maximal runs of consecutive `%decl` statements register **simultaneously** (two passes: names and arities first, then bodies) — this admits mutually recursive unions/structs within a group. Across groups, references are strictly backward; self-reference within a declaration is always legal (iso-recursion). The same adjacency rule applies to `%func` statements for mutual function recursion (S8.5) — one grouping principle, two judgments. ⟨`t-run-decl-mutual`, `t-text-grp-split-decl`⟩
2. **Uniqueness.** Type names live in one flat program namespace; redeclaration is an error.
3. **Side conditions** per case: well-foundedness of bunts (S10.3); trait/impl checks (S9.4); class state must elaborate to a struct `%ref` (S9.5).
4. Method bodies (impl/class) mint as gates and extend the subject per the ABI (S9.8); `next` is typed with `def` extended.

### S9.2 Structs and aliases

*The three declaration forms below were written `struct Name(T…)`, `enum Name(T…)` and `alias Name(T…) Target;`, from before syntax-arc items 6 and 10 moved binders to angle brackets and gave `alias` its `is`. The parenthesised form is not merely stale — a class's parens now hold its STATE argument, so the old spelling reads as something else.*

`struct Name<T…> { f: τ, … }` registers `[gen body=[%struct fields]]`: a **sealed** nominal product; fields ordered (declaration order is the erasure, S10.1). `alias Name<T…> is Target;` is transparent: `elab` expands aliases immediately and totally — an alias never appears in a `typ`. ⟨`t-alias-ok`⟩

**Data nominals** (`%data`, M3 stdlib): a nominal over an arbitrary `typ`, iso-recursive, with the roll implicit in `nest` (N13) — how `List<T>` is the null-terminated hoon shape (S10.1) while remaining a nominal. No surface form declares one in 1.0: the boot environment owns the registrations — `List`, `Map`, `Set`, `String` and `Path` (`base-env`). They are registered now, and `+nets` already names all five as the `%data` population.*. Data nominals have no constructors, no fields, no cases: values flow in structurally (N13) and out by pattern (the match compiler unfolds a data scrutinee one level, so lists match as `~` and `(h, t)` — no tags anywhere).

### S9.3 Unions

`enum Name<T…> { case₁(τ…), case₂, … }` registers ordered `tase` cases. Tag names carry identity; case order is semantic: **bunt = first case** (S10.2) and erasure order is fixed. `enum Never {}` is well-formed and uninhabited — it elaborates to `%void` wherever used (the checker's bottom); it has no bunt (S10.3).

Registration side conditions and construction rules (surface statement in language.md §6):

- **Tags are terms**, unique within the union — a duplicate tag is a registration error naming the first occurrence. ⟨`t-decl-dup-tag`⟩ Tags across *different* unions may collide freely (constructors are qualified; patterns are scrutinee-directed).
- **Payloads are positional and unnamed**: a multi-payload case folds to the right-nested tuple of its types (`tase.t` holds the folded typ); faces in payload position are rejected at **parse** (`%parse-tex`). ⟨`t-parse-or-face`⟩
- **Construction**: `Name.tag` resolves through the `%type` limb head (S7); a nullary case *is* the value (`⇒ %ref Name args` — never applied); a payload case must be applied, and its argument checks ⇐ the (instantiated) payload type. A payload constructor is **not a first-class value** in 1.0 — unapplied `Name.tag` for a payload case is an error suggesting eta-expansion — a suggestion this sentence promised before `%mint-ctor-applied` carried one, and which it now does. This fence is now the narrow one it reads as, and no longer part of a pattern: a **module arm** is a value (S11.2, lowered 2026-10-28), and so is a function-typed struct field, so the remaining applied-only forms are the payload constructor here and the method (S9.8). What a dot resolves to decides it, not the dot. ⟨`t-mint-ctor-tag`, `t-mint-ctor-applied`, `t-text-ctor-applied`⟩
- The convention that the first case be non-recursive is not merely style: S10.3's well-foundedness check makes a self-recursive first case a registration error.
- **Sum-of-products is the modeling idiom**: a payload type is any `typ`, including nominal refs — cases with named fields wrap a struct or class declared alongside (this is the flip side of payloads having no faces). A case pattern binds the payload value; its fields come through the struct. Unions declare no methods of their own; behavior attaches by trait (S9.4).

### S9.4 Traits, impls, coherence

- `trait Name { m(self: Self, …) -> τ; … };` registers method signatures. **Traits are parameterized**: `trait Idx<I, A> { at(self: Self, i: I) -> A; }` takes *unbounded* binders (a bounded trait binder is a superclass constraint — post-1.0, `%trait-bound`); method signatures may mention `Self` and the trait binders. Methods are monomorphic in 1.0 (`gen=~` in every `msig` scheme); `Self` is the distinguished `%var`, bound by the trait.
- **Distinct binders are required of a generic impl**: the stated admission criterion for an unbounded generic impl — "the target is the head applied to exactly the binders, in order" — is satisfied by `impl<T, T> Tr for Pair<T, T>`, which repeats a binder. `+ifac` does not reject it, and `+funi` solves `%var`s first-match-wins, so `T` is bound from the first argument only and the second is never checked. It does not escape: `+mmet` re-checks the substituted `self` against the receiver (`%mint-meth-self`, N8 invariance) and refuses. So the implementation is sound and the *argument for it* was incomplete — the safety net is downstream of the criterion, not in it.
- An impl of a parameterized trait supplies **one type argument per trait binder**, elaborated with the impl's own binders in scope — arguments may be any typ over them: `impl<T> Idx<@, T> for List<T>`, `impl<K, V> Idx<K, V?> for Map<K->V>`, or ground `impl Get<@> for Box`. Arity mismatch refuses (`%mint-impl-targs`). The `impy` fact carries the arguments (`targs`); signature checking and dispatch substitute `{Self, trait binders}` simultaneously, then solve the impl binders from the receiver — **trait binders erase exactly like impl binders**, so the dictionary is still ONE core per (trait, head), and coherence stays per (trait, head), deliberately conservative: one `Idx` instantiation per collection head. 1.0 fences: `func` bounds name unparameterized traits only (`%bound-ptrait` — a parameterized bound needs instantiated dictionaries at the `$bnd` ABI). *The class fence is down:* a class's impl clause may apply a parameterized trait (`class K(St) impl Kernel<nockapp.Effect>`), reading its arguments with the same `+p-targs` impl position uses and checking them against the trait's binders with the same arity test and the same `zipg` substitution beside `Self` — so no second mechanism was added, and `%mint-impl-targs` is deliberately the tag both spellings raise. The `%class-ptrait` tag is retired. One fence remains in its place and is narrower: a parameterized class impl cannot cross a **module** boundary — refusing `%mint-todo` with `%export-class-ptrait` as its clue, so the tag a vector would assert is `%mint-todo` and not the clue (S13) — because `+clsfacts` builds the import-side fact with no environment to elaborate its `tex` arguments, and registering empty ones would read as an unapplied impl and mis-resolve silently at the importer. That remaining fence is itself ⟨none — UNPINNED⟩. ⟨`t-class-ptrait`, `t-err-class-ptrait`⟩ — the first a positive, the class fence being down, the second the arity refusal; both are named for the retired tag and assert the live one.
- `impl Trait for Type { m(…) -> τ { … }; … };` — `Type` must elaborate to a **head**: a nominal `%ref`, an aura, or a builtin head. Declared unions are nominal heads and thus legal targets — the idiomatic union impl matches its cases and delegates to the payload types' impls. `Self := Type` throughout; every trait method defined exactly once with a signature that matches after substitution; extras and omissions are errors.
- **Unbounded generic impls are admitted**: `impl<T> Tr for List<T>` with *unbounded* binders, the target the head applied to **exactly the binders, in order** (a structured or ground argument is a specialized impl — overlap territory, refused). Erasure makes them free: the dictionary is ONE core for every instantiation; dispatch solves the binders from the receiver's arguments. **Bounded** generic impls (`impl<T: Ord> …`) need per-instantiation dictionaries and stay out of 1.0 (S14). The typing boundary noted here at admission — element-typed methods inexpressible under unparameterized traits — **fell when traits gained binders**: `trait Idx<I, A>` expresses `at(self: Self, i: I) -> A`, and the prelude's `Idx`/`Put` impls give `List` and `Map` element-typed method access; the index sugar `e[i]` / `e[i] = v` rewrites to these methods, dispatching per receiver head.
- **There are no trait objects.** No `any Trait` type exists: dictionaries are passed at generic call boundaries (S9.8) and are never storable values, so heterogeneity is always a declared union (`List<Shape>`), and open-world polymorphism is always a bound (`func<T: Trait> …`), resolved statically.
- **Global coherence**: at most one impl per `(trait, head)` pair — the second registration is an error at the *registration site*, naming the first. ⟨`t-jimp-impl`, `t-mint-impl-coh`, `t-mint-impl-sig`⟩

  This clause used to add "there is no orphan rule (whole-program compilation; there are no crates)", and that was wrong in a way worth spelling out, because the coherence property **depends on the thing the sentence denied**. Within one module the registration-site check is the whole story. **Across modules there is no site at which both registrations are seen**: what runs instead is `+iadd`, which compares `$impy` records structurally — and `$impy` carries no provenance, so two genuinely different impls of the same `(trait, head)` compare equal and are **deduplicated silently** rather than conflicting. The `%impl-conflict` branch fires only on a *divergent target*, which is not what a coherence violation looks like.

  What actually closes the hole is an orphan rule, `+orphck:jock` (`%mint-impl-orphan`): an impl's trait **or** its head must be declared by the module writing it. With acyclic imports and one mint per module, that makes a cross-module collision unconstructible — the impl must live in the trait's module `T` or the head's module `H`; an impl in `T` needs `T → H`, one in `H` needs `H → T`, and both is a cycle. The theorem holds; it is proved by the orphan rule, not by the registration check, and a reader who believed the old sentence would have concluded the property was unguarded across modules.
- Bound satisfaction (S8.6) consults exactly this registry.

### S9.5 Classes

`class Name(State) impl Tr₁, … { arms };` = a **sealed nominal over its state struct** plus an inherent method suite plus trait impls, in one declaration. `State` must be a declared struct, and anything else refuses `%decl-class-state` (runtime.md R-159). Arms are an *ordered list*, never a map — determinism reaches dictionary layout. Construction is struct-literal syntax against the state, sealed to the class (S8.12). `self` is an ordinary parameter name rather than a keyword, but its declared type must be the receiver — the class, not the state struct — and anything else refuses `%mint-meth-self` (runtime.md R-158). Lowering is state-struct plus dictionary; no core algebra is user-visible (P-3, promoted). ⟨`t-mint-class-state`, `t-mint-meth-self`, `t-jimp-class`, `t-run-class`⟩

### S9.6 Constants

`def.consts` holds compile-time constant values (today: reserved; populated by the runtime-library interface spec for pinned formulas/dictionaries). Scope rule, binding form, and user access are **not** in 1.0's surface. Invariant regardless: no emission path iterates a `def` map — everything ordered that reaches output comes from the ordered lists.

### S9.7 Generics: schemes and erasure

Rank-1, erased, invariant:

- Binders live in `$scheme` (`gen` on def entries and `func`), never inside `$typ`; `%var` is an occurrence, not a binder. Rank-1 means: no scheme under a `%gate`, no binder in a field, no partial instantiation value.
- **One formula per generic function** — Nock's uniform representation means instantiation is a typing-time substitution with zero code effect. Nothing type-dependent survives erasure; type-dependent *behavior* goes through dictionaries only.
- Inside a generic body, a bound `T` is opaque: no `bunt` (S10.3), no `as?`/`as!` target (S8.10), no discriminability tags (S6). Its operations come exclusively from its bound's dictionary.

### S9.8 Cores as ABI

The core algebra is calling convention only (P-3, promoted):

- **Closures** (`%gate` values): one-arm cores `[formula [sample context]]`, fired `9 2` with the sample edited at axis 6 — bit-compatible with Hoon gates for **calling**, which is what FFI in both directions needs. *(The compatibility does not extend to the sample's CONTENTS. A Hoon gate's sample is its mold's bunt — `|=([x=* y=*])` holds the cell `[0 0]` — while a Jock closure's is the atom `0`, a placeholder, at every arity and for a lambda alike. So `+<+` exists on the one and not the other, and a Hoon arm that reads or seeds a gate's sample **before the first call** cannot take a Jock closure: `+reel`/`+roll` do exactly that with the fold's initial accumulator, and the curated wrappers seed a gate of their own rather than the caller's. Editing axis 13 of a Jock closure dies in the runtime with `Invalid axis for edit: NotCell`, and is not caught by `mule`.)*
- **Dictionaries**: multi-arm cores; battery = formula tree of the trait's methods in **trait-declaration order**; fired at the conventional arm axes. A kernel trait (`trait Kernel { load; peek; poke; }`) therefore lowers to exactly the NockApp boot contract.
- **Function groups** (S8.5): a multi-member group lowers to one multi-arm core — battery arms in declaration order, each *building* its member's closure with the group core as context, which is how every member reaches every other (Hoon's `|%`-of-gates pattern, invisible at the surface). A call is arm-fire (Nock 9) then the ordinary closure fire. A group of one lowers to the plain closure push — the degenerate case, deterministic because group size is syntactic. Each member's name resolves to an arm at the group core, emitted directly by `+mimb` as the closure-building fire — not handed on as a location (S7 rule 3).
- Nothing in this subsection is visible to the type system: no `%core` exists in `$typ`.

## S10. Erasure and bunts

### S10.1 The erasure table

Total function `⟦τ⟧` from types to noun-shape families. Hoon-compatible for every interop type (decision D-1):

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

Declared sums land in `$%` shape, i.e. inside the embeddable fragment (S11). `String`/`Path`: pinned by the runtime-library interface spec (M4).

`erase` (the lib arm) computes the **layout skeleton** only — `%cell` splits, everything else is a `%leaf` holding the type, refs not unfolded. It is total and environment-free; this table (which unfolds) is realized by `bunt`, `embed`, and the mold checks of S8.10.

### S10.2 Bunts

`bunt(e, τ)` — the default value, as nasm (typically `%const`):

atoms → `0` (satisfies `%based`); `%sing` → its value; cells/structs → componentwise; `%ref` → bunt of unfolding; **union → first case's bunt** (nullary: the tag; payload: `[tag bunt(payload)]`) — deliberately **not** Hoon's last-case `$%` convention; `%or` → first **non-`%void`** member's bunt (a `%void` member (`Never`) adds no values, and taking it unconditionally made an inhabited union unbuntable; `T?` therefore bunts to `~`, agreeing with Hoon's unit); `%noun` → `0`; `%gate` → the canonical constant closure returning `bunt(ret)`.

**No bunt**: `%void` (bunting `Never` is a compile error), `%var` (no `Default` dictionary exists in 1.0), and any type whose bunt requires one of these. ⟨`t-bunt-union-p`, `t-bunt-void-n`⟩

**The bunt is not observable from Jock source**, which is why its
vectors ride the judgment directly. `+bunt` is called from the harness
and from `+fond`'s well-foundedness check, not from `+mint`, and every
surface route to a default is shut ahead of it: an omitted struct field
refuses `%mint-slit-cover`, `let e: E = ~` refuses `%mill-nest`, and
`0 as! E` crashes in the mold. So the first-case rule above is pinned
at the judgment and nowhere else — the honest surface, as
`vex-bunt.hoon` says of itself.

### S10.3 Bunt well-foundedness

First-case bunting kills Hoon's reorder-the-last-case pitfall but admits its mirror: `enum Rec { cell(Rec, Rec), leaf }` has a divergent bunt. Registration (S9.1) therefore checks well-foundedness: over each declaration group, build the **bunt-dependency graph** — edges from each name to the names its bunt requires per S10.2 (struct: all fields; union: *first case only*; alias: target; class: state; `%or`: first non-`%void` member; cell: both sides; gate: return). A cycle is a registration error with a reorder hint ("make a non-recursive case first"). This does **not** subsume "`Never` has no bunt", and said it did
until 2026-10-28: `+fond` answers `%good` on `%void` by design, so the
graph establishes **acyclicity only**. `enum E { a(Never), b }` and
`struct S { f: Never }` both register clean and have no bunt; neither
is a cycle. The next sentence is the operative one, and it is wider
than its own example — a `Never` payload in the **first** case
registers fine too. Types that merely *contain* unbuntable positions (a `Never` payload in a non-first case) register fine and fail only if bunted. ⟨`t-decl-fond-reorder`, `t-mint-decl-fond`⟩

## S11. FFI and the differential oracle

### S11.1 `embed` — the `+ut` oracle fragment

`embed(τ)` renders the embeddable fragment as a Hoon `$type`, CI-only. **In (implemented)**: auras (`%atom a ~` with no constant), singletons (Hoon's constant atoms — cubes), cells, faces, `%noun`, `%void`. **In (spec'd, not yet implemented — `+embed` currently crashes on these, so the oracle runs on the smaller fragment)**: `T?` (as Hoon unit), `List`/`Map`/`Set` (as the hoon-138 molds), declared sums (as `$%` shape), monomorphic gates. **Out** (crash, by design): `%var`, dictionaries, general `%or`.  **Guards are not in this list**: `+embed` returns `[%atom aura ~]` for a guarded atom and does not crash — it embeds as the bare atom, which the parenthetical here always said while the list membership said otherwise.  The oracle is blind to guards, which is the documented consequence, not a refusal.

Oracle agreement, wired into CI from M1's first commit:

- **Nest-agreement** on the fragment **minus** four excluded pair classes:
  1. **sealed-nominal pairs** (seals unfold before embedding — Hoon is structural, agreement on distinct same-shape nominals is impossible by design);
  2. **gates** (we are invariant, `+ut` is payload-covariant, S5.1 N7);
  3. **aura-direction pairs** (D-24): Hoon's `+fitz` nests prefix-related auras in *both* directions (`@` into `@ud` as readily as `@ud` into `@`); flat auras (S3.2) refuse gaining a name. Agreement holds for equal-aura pairs and for widening *to* `@`; the reverse direction is excluded — a divergence of D-7's design, not an accident;
  4. **guard pairs** (the oracle is guard-blind — both sides embed as the bare atom, so `+ut` accepts what N5 refuses).
- **Bunt-agreement** on the fragment **minus declared unions** — our first-case bunt diverges from Hoon's last-case `$%` bunt *by design* (D-2); union vectors assert *our* bunt against the S10.2 rule instead. `T?`, lists, maps, atoms, tuples agree.

### S11.2 Import typing

There is **no** Hoon-`$type`-to-`$typ` projection judgment. Every imported arm — dry and wet alike — is typed by its **curated pinned signature** (`$scheme`) from the runtime-library interface spec; `def.imports` stores `[hvase arms]` (`$hlib`). Wet arms get hand-assigned ∀-signatures (unglamorous and load-bearing); dry arms get their signatures at curation time (the interface spec may *derive* a candidate from the vase's type as tooling, but what is pinned is the signature, and the pin is normative). Values crossing back from FFI are **not** molded:  `+mimpg` emits the Nock-9 fire and adopts the pinned return type as the result type, so a curated signature is an *assertion* about the foreign implementation and nothing checks it.  Where that assertion concerns a **guard**, the arm's own wrapper must establish it — see the ABI requirement below.

**An arm is a value.** `lib.arm` unapplied ⇒ the arm's pinned `%gate`
type, emitting the arm-fire at the library binding's current pegged
axis — the same node `+mimpg` builds for a call, handed over instead of
applied, so a module's functions are first-class across the boundary
and a generic consumer instantiates from them, so
`hof.compose(f, g)` typechecks with `f` and `g` monomorphic arms from
any **`%jock`** module (⟨`t-jdag-arm-generic`⟩).

Two limits, both narrower than the sentence above reads, and the
second is why it says `%jock`:

- `lib/hof`'s own arms are all ∀-signed, so `hof.ap(hof.id, 3)`
  still refuses by the rule below.
- A `%nock` ABI arm is value-referenceable **as of 2026-10-28**, and
  was not before. `+harms` pins `hoon.dec` and its numeric siblings
  as returning `%number` while surface `@` elaborates to `%$`, and
  N7's return was invariant — so `let g = hoon.dec; g(5)` compiled
  (inferred) while `let g: @ -> @ = hoon.dec`, a struct field and
  `hof.ap(hoon.dec, 5)` refused `%mill-nest`. The fix is **N7's
  return covariance**, not a re-pinning: re-pinning the returns to
  bare `@` was tried and breaks every mutable counter, since
  `var b = 0` widens to `Nat` and `b = b + 1` then stops nesting.
  Arithmetic still types `Nat`, and the pinned-arms-mirror-the-Hoon-
  type ruling stands. ⟨`t-nest-gate-ret-p`, `t-nest-gate-ret-n`⟩
Both spellings read the arm's index, arity and signature from one arm
(`+marm`), so they cannot disagree about which arm they resolved.
Resolution order at a limb is unchanged: bindings and fields first
(`+mimb`), then the import arm, then the diagnostics — so a field named
like an arm still wins, and an *unimported* library still gets
`%mint-unimported` rather than this path. A **∀-signed** arm refuses
`%mint-todo` with `%import-arm-gen` as its clue (S13: the tag a vector
asserts is `%mint-todo`). The erasure would be well-defined — one
formula serves every instantiation — so what is missing is the
binding's *type*. The operative reason is **not** "no arguments to
solve the binders from", which this paragraph said until 2026-10-28
and the clue still says: S8.6 gives two local sources for a solution,
arguments *and* a `want` matched against the return in ⇐ position, and
`let g: (@) -> @ = m.id` supplies the second and determines `A := @`
uniquely. It refuses anyway, and correctly, because **a limb resolves
in synthesis mode only** (S8.3): `+mimb` has no `want` to consult even
where the surrounding `mill` does. Fixing the reason is a doc change;
admitting the checking-position case would be a real one. The clue
names the eta-expansion, which compiles.

Two further limits, both reader-visible. The path is **exactly two
segments** — an arm's gate has no fields, so `lib.arm.more` reports
`%mint-field` against the gate rather than resolving. And the
`%mint-unimported` message above is for a library **reachable** but
not imported; one absent from the configured set is an ordinary
unbound limb (`%mint-limb`).
⟨`t-jimp-arm-value`, `t-jimp-arm-hof`, `t-jimp-arm-stored`,
`t-jdag-arm-value`, `t-jdag-arm-generic`, `t-jimp-arm-gen`,
`t-jdag-arm-generic-n`, `t-jimp-arm-gen-eta`⟩

### ABI requirement G (guarded returns)

**An arm whose pinned return type carries a guard, and which
constructs that value from data the caller supplies, must establish
the guard in its own wrapper.** This is a condition on *curation*, not
a compiler check, because the compiler performs none: by the paragraph
above, the pin is an assertion. An arm that cannot meet it must be
pinned to an unguarded return type instead, and let its caller
establish the guard where it is actually checked.

Scope, stated so it can be applied mechanically to a new arm:

- It binds an arm that **decodes, parses, or otherwise derives** a
  guarded value from caller-supplied input. `chain.fromb58`
  (`String -> Hash`) is the type case.
- It does **not** bind an arm that *computes* a guarded value through
  arithmetic that maintains the guard — `chain.hashnoun` and
  `hashten` return `Hash` out of the engine's own field operations, so
  basedness is a property of the computation.
- It does **not** bind an unguarded return. `tob58` returns `String`;
  the nineteen `Nat`-returning arms in runtime.md §4.1 carry no guard.
- Rejection, not repair. A wrapper that *reduces* an out-of-range
  value into range returns a well-formed value **denoting something
  else**, which for an identifier is worse than a crash.

Why the requirement sits here rather than in the compiler: molding
every guarded return was measured and refused — see the three cases
below — so for the foreseeable release the guard on a pinned return is
kept by the arm or not at all. That makes this a standing obligation
on whoever adds the next arm, and the reason it is written as a
numbered requirement rather than as advice.

**RULED: G is enforced by REVIEW, not by a lane, and that
is a decision rather than a gap.** It is recorded as such so nobody
reads the absence of a check as an oversight and closes it
accidentally. What a lane could do is narrower than it first looks:
the pinned signatures are machine-readable, so "which arms return a
guarded type" is mechanical — but the discriminator G actually turns
on is whether an arm **derives** that value from caller input or
**computes** it through guard-maintaining arithmetic, and nothing in a
signature says which. A lane would therefore flag every guarded return
and need an exemption list, which is the shape that rots: `citecheck`'s
41-entry allowlist is the local precedent for an exemption list
outliving the judgement that filled it.

So the test for a new arm is a reviewer's question, asked at curation
time, and the obligation is on the curator: *does this arm derive its
guarded return from data a caller supplies?* If the answer is yes and
the wrapper does not establish the guard, the arm is wrong — pin it to
an unguarded type instead. This is revisited if the ABI grows enough
guarded returns that review stops being reliable, which is a question
about count rather than about principle.

**The requirement is retrospective, and one arm failed it.** `chain.fromb58` is pinned `(String) -> Hash`, `Hash` is
five `%based`-guarded belts, and the underlying `atom-to-digest`
reduces only four limbs — the fifth is the final quotient and is never
reduced mod p. `chain.fromb58("z"×80).e` returns a **213-bit** value in
a field typed `< 2^64 − 2^32 + 1`, and the next `hashten` over it
crashes inside the engine's own `based` assertion. The path is live
from a hostile peer, since a kernel molds its cause and a mold checks
cordness, never base58 validity.

**The decoder boundary is now validated** (`pkg/chain-core.hoon`'s
`wfromb58` asserts `+based-noun` over all five limbs and rejects
rather than reducing — reducing would return a well-formed `Hash`
naming something else). It is pinned by `fromb58-boundary-valid` and
`fromb58-boundary-unbased` in `tools/signer.sh`, which assert the
VENDORED decoder's limb arithmetic rather than our wrapper:  what can
change under us is upstream, and if it ever reduces all five limbs
those rows redden and say the wrapper's assertion became redundant.

The sibling arms were checked against requirement G at the same time.
`fromb58` is the only arm that derives a guarded value from
caller-supplied bytes;  `hashnoun` and `hashten` compute theirs through
the engine's field operations, and `tob58` returns an unguarded
`String`.  So the requirement currently has exactly one binding case,
and it is met.

**Why requirement G is a curation rule and not a compiler check.**
Three cases of "foreign value crossing into Jock" look alike and want
different answers;  collapsing them is what produced both the
unenforced sentence above and the instinct to mold everything:

1. **Foreign data entering a guarded type** — validate at that
   boundary, including guards nested inside structures. **This case is
   discharged by requirement G**, in the wrapper rather than the
   compiler, for the reason the measurements give below. This is where
   a `%based` promise is first *asserted*, so it is a construction
   boundary in S3.4's sense; S3.4 already separates establishing a
   guard from preserving it through signatures, and does not ask for
   a recheck on every copy or assignment. `wfromb58` is this case.
2. **Pinned, audited primitives that preserve their declared type** —
   eligible for an explicit exemption. The comparison arms are the
   candidates: their Hoon implementations do produce loobeans. An
   exemption must attach to **the pinned implementation and its
   contract**, never to an arm's name or to which file it lives in —
   package membership is an accident of layout, not a safety property.

   *What the exemption would actually be trusting, stated precisely,
   because it is narrower than "the arm is correct".* A guarded FFI
   return is trusted **transitively**: nothing downstream re-checks
   it, and the guard it carries then vouches for it to every wider
   guard above it. For Bool that chain is `%loob ⊂ %based`, so a
   value admitted as Bool widens into `Base` **on the strength of
   Bool's guard** — and `Base` is entitled to assume it, since a bare
   `@` cannot enter a `Base` binding at all (`%mill-nest`, probed).
   Every other door into a guarded atom is shut: `p as Bool` refuses
   `%mint-cast` and `p as! Bool` crashes in the mold. **So a pinned
   signature is the only unvalidated way into a guard**, which is both
   why an exemption is defensible here — the surface around it is
   closed — and why it must be explicit rather than incidental.

   **That containment argument is about GUARDS, and only guards.**
   The same argument structure applies, unaddressed, to at least
   three other things a pinned return type asserts without
   validation: a **sealed nominal** (the `%mint-cast-sealed` fence
   shuts the cast door for exactly this reason, and a pinned
   signature returning `m.Counter` is the same unvalidated door), a
   **declared sum's tag set** (a tag outside the declaration breaks
   an exhaustive match's totality the way a bad `%loob` breaks
   `?:`), and **`T?`'s discriminant shape**. Requirement G is
   correct as far as it goes and its scope section below is
   deliberately about guarded returns; the sentence above is
   narrower than it reads, and extending the requirement to the
   other three is open (S14).

   *Demonstrated by mutation.* Re-pinning `hoon.jam`'s
   return as `Bool` while its implementation returns what it always
   returns — i.e. exactly a lying curated signature, nothing else
   changed — gives:

   ```jock
   let b: Bool = hoon.jam((1, 2, 3, 4, 5, 6, 7, 8));
   let n: Base = b;                // 19202517364290572306545
   ```

   That value is **above 1040 p** — `1040 p + 17.903.532.099.404.612.705`,
   so a shade under 1041 p rather than a multiple of it — sitting in a
   binding whose guard asserts `< p`, with no Boolean match anywhere
   in the path. So the Bool case
   is not confined to a crash: it lands an invalid value in a *different*
   guarded type, which is the same class of defect as the `fromb58`
   violation and not merely a progress failure. (A conditional on such a
   value does crash — Nock's own `6` rejects anything but 0 and 1 — but
   nothing forces the value through a conditional.) The mutation was
   reverted; this is a property of the trust boundary, not a report
   about any real arm.
3. **Jock functions the compiler checked** — rely on the checked body
   and argument types. No boundary, nothing to re-assert.

Two constraints on any "mold every return" rule, both measured rather
than assumed. It would **traverse collections**: molding a returned
`Map<K, Base>` walks its contents, and repeating that per insertion
turns map building quadratic. And it cannot express the contracts that
matter most — `mold.hoon` refuses `%var` and `%gate` outright
(`%mint-mold`), so a generic body's unresolved binders and any
higher-order return have no mold to compile. Blanket molding therefore
needs a decision about polymorphic and higher-order contracts, not
just an extra emission step.

**MEASURED** (`tools/exbench.sh`, which exists because
`vex-cost.hoon` budgets *compile* work and so cannot see a per-call
runtime check at all). Step counts are from the Python Nock with the
arms NockVM jets wired, so they are comparable to each other; `as!`
emits exactly the mold a molded return would, so the proposed check
was measured without being built.

*The comparison path.* A loop with a bare kernel `%same` condition
costs 32.0 steps per iteration; the same loop with `i < n` costs 39.0,
so **one jetted `hoon.lth` call is 7 steps**. Adding a `%loob` mold
costs about 16 more, taking the guarded call from **7 to 23 steps —
3.3×**. So molding the comparison arms is not free and not negligible:
it roughly triples the cost of the cheapest FFI call in the language,
on the hottest path. That is the price of *not* taking the case-2
exemption.

*One mold over a collection is asymptotically free.* A single walk of
a `Map<@->Base>` costs 47–50 steps per element and is **linear in n**
(1.91× then 1.95× per doubling), while building the map is n log n —
so the mold's share *falls* as the map grows: 9.4% at n=4, 7.7% at
n=8, 5.8% at n=16. Validating a collection once, at the boundary where
it enters, costs little and costs relatively less at scale.

*A mold per operation is quadratic, and this is why blanket molding is
rejected.* `m[i] = v` lowers to `put`, which is
`hoon.mput(self, i, v)` returning `Map<K->V>` — so **every insertion
is an FFI return of the guarded collection**. Molding every guarded
return therefore molds the whole map on each insertion, turning
O(n log n) construction into O(n²):

| n | mold once | mold per insertion | ratio |
|---|---|---|---|
| 16 | 754 | 6,409 | 8× |
| 100 | 4,712 | 237,981 | 50× |
| 1000 | 47,125 | 23,586,062 | **500×** |

So "mold every guarded FFI return" is refused on measurement rather
than on taste, and the three-case split above is what the numbers
support: validate at the boundary (cheap, and cheaper at scale), exempt
audited primitives that preserve their type (3.3× otherwise, for a
check that provably cannot fail), and re-assert nothing inside
compiler-checked Jock.

One scoping fact the benchmarks forced out: a collection of a guarded
type is **harder to build than to describe**. `m[i] = i` into a
`Map<@->Base>` refuses `%mill-nest`, because an unguarded `@` does not
nest into a guarded type and guards establish at compile time only for
literals. `Map<@->@>` has no guard and so would never mold at all, so
the quadratic exposure is specific to collections *of guarded types*,
not to collections.

## S12. Patterns and exhaustiveness

### S12.1 The pattern grammar

`$patt`: `_` (wild), name (bind), literal atom, cell destructure, `tag(p?)` sum case, type test. Typing against scrutinee type σ:

| pattern | requirement | bindings |
|---|---|---|
| `%wild` | — | none |
| `%bind n` | — | `n : σ` (as stored, singletons kept) |
| `%atom lit` | σ atom-compatible (aura match; nest of the literal's sing into σ *or* σ a singleton equal to it) | none |
| `%cell p q` | σ cell-shaped (or `%noun`) | union of sub-bindings; sub-scrutinees are the components |
| `%tag t p?` | σ unfolds to a `%sum` containing case `t`; payload pattern against the case payload (present iff payload case) | sub-bindings |
| `%type-test τ` | legal exactly where `e as? τ` is legal from σ (S8.10), **including its two fences** | none (combine with `%bind` via `n as? …`-style match idiom in language.md) |

**σ an `%or`: member selection** (`+porm:mint`). A `%cell` or `%tag`
pattern against an `%or` scrutinee does not type against σ directly.
Each member is classified for plausibility; **exactly one** must fit
— none refuses `%mint-patt`, two or more refuses
`%mint-patt-ambiguous` rather than picking — and the pattern then
types against *that member*, with an `%isa` prefixed to its
conditions when the member is statically a cell. Bindings take the
member's component types, not σ's.

This rule was missing from this section, and it is **the only
narrowing mechanism the language has**: it is what makes
`match x { ~ => …, (~, v) => … }` give `v` the type `T` for an
`x: T?`, including where `T` is an opaque generic binder. So an
emptiness-preserving option map over a bound `T` is expressible,
and a project note claiming otherwise ("no `T?` narrowing"; a
suspected soundness hole in `%var` nesting) was wrong on both counts
— the program compiles and runs, and the refusal it expected is
`%mill-nest`. Soundness rests on `dish`: every pair that survives
selection is erasure-disjoint (S6), and a pattern fitting two
cell-shaped members is refused rather than resolved.
⟨`t-text-opt-match`, `t-text-opt-nest`, `t-mint-patt-ambiguous`⟩

**The grammar is closed, and three refusals close it.** A String
literal pattern refuses `%parse-patt` — a String is a nominal over a
cord, not an atom, so it is not a literal-atom pattern. A
struct-literal pattern refuses `%parse-patt-case` in every spelling
(`P( x: 1 )`, `P(1, 2)`, `P { x: 1 }`), and a bare cell pattern
against a struct reaches `%mint-patt`. An or-pattern (`1 | 2`) and a
range pattern (`1..5`) refuse `%parse-expected %'=>'`, the grammar
having nowhere to put them. A **Float64** literal *is* admitted, being
an atom like any other: `match a { 1.5 => 1, _ => 2 }` matches, and
the same pattern against an `@` scrutinee simply fails to match rather
than refusing. So are `'a'`, `~`, and `true`/`false`. All probed.
⟨`t-parse-patt`, `t-parse-patt-case`, `t-parse-patt-as`,
`t-mint-patt-tag`, `t-run-match-lit`, `t-run-match-cell`⟩

Case bodies see the bindings; the scrutinee's *type* is refined per-case only through the bindings (no flow narrowing of outer names — P-7 deferred).

### S12.2 Irrefutable patterns and destructuring `let`

`let (a, b) = e;` admits exactly the irrefutable subset: `%wild`, `%bind`, and `%cell` of irrefutable, and the pattern's shape must be *guaranteed* by the scrutinee's type (a `%cell` pattern needs a `%cell`-typed scrutinee — `%noun` is refutable there). Everything else is a `match`. ⟨`t-arc-let-unpack`, `t-parse-var-patt`⟩

### S12.3 Exhaustiveness and redundancy

**Exhaustiveness checking** over constructor spaces derived from the scrutinee type. *The implementation (`+mcov`) is a conservative five-case cover test, not Maranget specialize/default matrices; it is sound for exhaustiveness and weaker for redundancy, which is what S12.3's redundancy note now records.*

| σ | constructor space |
|---|---|
| `%sum` (unfolded union) | its tags (finite) |
| `%or` | its members (each a "constructor" tested by its S6 discriminant) |
| `%sing` | that value (space of one) |
| `Bool` (`%atom %logical`) | `{true, false}` — the constructor space is `{0,1}` by Bool's pinned mold (S8.10). * The rule it would rely on does not exist: an FFI return is **not** molded (S11.2), `+mimpg` adopting the arm's pinned return type as the result type and emitting no `+mchk`. So the guarantee here is the curated signature alone, which is an assertion. Bool's failure mode is **not** confined to a crash, and saying so here was too strong. An exhaustive match does crash, and Nock's own conditionals reject anything but 0 and 1 — but `%loob` **refines** `%based` (N5), so Bool widens into `Base`, and `let b: Bool = x; let n: Base = b;` compiles. A foreign arm falsely returning `p` as Bool therefore reaches a `Base` binding, whose guard that value violates, **without ever meeting a Boolean match**. That is derived from the subtyping rules, not from any misbehaviour of the real comparison arms, whose Hoon implementations do produce loobeans. The same trust boundary was violated in practice for `%based` — `chain.fromb58` — which is what requirement G below exists to prevent.* |
| `%cell` | the single cell constructor (recurse componentwise) |
| any other atom, `%noun`, `%ref` (non-union), `%gate`, `%var` | infinite — a wildcard/bind row (or `default`) is required |

A `match` must be exhaustive: if the wildcard row is useful against the residual matrix, error — `%mint-inexhaustive`, which retires the interim `%match-needs-default` rule — **carrying a witness in the hint noun rather than in the message**, and the witness is only as sharp as `+mcov` is. For a union it is concrete: `enum E { a, b, c }` matched on `.a` and `.b` reports `[%tag tag=%c pat=~]`. For an atom or a cell scrutinee it degrades to a bare `_`: `(Bool, Bool)` matched on `(true, true)` and `(false, _)` leaves `(true, false)` uncovered and reports `[%wild ~]`. Probed; the imprecision is the cover test showing through, and is the same weakness the redundancy note below records. A case shadowed by an **irrefutable** earlier case is an error, not a
warning (`+pirr`) — `match x { _ => 1, E.b => 2 }` refuses
`%mint-unreachable`.

*This once said any case that is not useful is an
error. Duplicate REFUTABLE cases are not detected — `match x { E.a
=> 1, E.b => 2, E.a => 3 }` compiles and returns 1 — because `+mcov`
is a cover test rather than a usefulness algorithm (S12.2). So
exhaustiveness is enforced and redundancy only partly; the stated rule
is the goal, not the implementation. Both halves probed: the duplicate
compiles and answers 1, and `match x { _ => 1, E.b => 2 }` refuses.* ⟨`t-run-match-sum-p`, `t-mint-match-inex`, `t-mint-match-unreach`⟩

## S13. Corpus vector format

One vector = one entry; vector files live at `tests/hoon/lib/vex-*.hoon` (one library per judgment, each exporting `++vex` as `(list tvec)`), and `tests/hoon/run.hoon` composes them with the judgment gates into a harness tuple. The M1 runner is `tools/vex.sh`: honk compiles the runner (a deferred vase trap), `honk-kick` (`tools/kick.rs`) fires it under NockVM's formula-keyed jets, and `tools/vexrun.py` slams each vector with per-vector crash isolation and a step budget. The eventual `jockc` binary replaces the driver, not the vectors. Format (mold at `tests/hoon/sur/vec.hoon`):

```hoon
+$  tvec
  $:  id=@tas                ::  %t-nest-aa-p, %t-join-fail-n, ...
      judgment=@tas          ::  which gate runs it -- an OPEN set (below)
      mode=?(%pos %neg %err) ::  three, not two
      in=*                   ::  judgment-specific input noun (e.g. [want have] for %nest;
                             ::  [env tex] for %elab; a kernel AST for %mint)
      out=(unit *)           ::  expected result for %pos; ~ for %neg;
                             ::  the expected error TAG for %err
  ==
```

**Three modes, and `%err` is the one that carries a diagnostic.** `%pos`
expects a result, `%neg` expects rejection *in the judgment's own terms*
— a `%neg` `%nest` row expects `[~ %.n]`, not a crash — and `%err`
expects a crash whose **innermost** error tag equals `out`'s payload,
extracted by `+dtag:vex-diag` from the mule tang. So an `%err` row
asserts the tag, not merely the refusal. The Python debug lane **skips**
`%err` rows, tag extraction being Hoon-side.

**The judgment set is OPEN, and it is large.** `tests/hoon/run.hoon`
dispatches **65** of them today, so this spec does not enumerate them;
the harness is the inventory. The judgment-shaped ones this document
owns are `%nest`, `%join`, `%elab`, `%dish`, `%seek`, `%bunt`, `%erase`
and `%embed`; `%mint` and `%mill` are the expression judgments of S8.
The rest exist because a rule is cheapest to pin where it is reachable
— `%text` (126 rows) runs whole programs from source, `%jimp` (52)
goes through the module path, `%run` evaluates, and the `k*` family
fires kernel arms by axis.

Discipline: a rule ships with the vectors that pin it, or says
`⟨none — UNPINNED⟩`. Vectors are blessed per-vector with
commit-message rationale; wholesale regeneration is forbidden (roadmap
invariant 3). The obligation form this section used to require —
`⟨…+, …−⟩` per rule, written whether or not the vectors existed — is
retired; `docs/record/types-arc.md` records what it cost.

## S14. What is open

Genuinely open, and none of it blocks the release. What used to sit
here and has since shipped is listed under **closed** below, because a
section called "Open" holding four closed items is how a reader ends
up implementing around a feature that exists.

1. **`%defer` semantics** — owned by the runtime spec; the typing rule
   is a placeholder and `%defer` types as its `next` (S8.9).
2. **Bounded generic impls** (`impl<T: Ord> …`) and **bounded trait
   binders** — excluded from 1.0 (S9.4). Both need per-instantiation
   dictionaries; dictionaries-as-values make them natural extensions.
3. **Parameterized bounds** — `func<T: Tr<A>>` still refuses
   `%bound-ptrait`, a parameterized bound needing instantiated
   dictionaries at the `$bnd` ABI. runtime.md R-78 names the customer
   for lifting it: `GallAgent` is used as a bound, so parameterizing
   it over its card vocabulary breaks `gallMount`.
4. **Explicit instantiation syntax** — deliberately absent (S8.6);
   revisit only on corpus pressure.
5. **Mutual recursion across declaration groups** — the adjacent-group
   rule (S9.1) is the 1.0 answer; a `forward`-declaration form would
   be the extension.
6. **Flow-sensitive narrowing** — POSSIBLES P-7. **Row/effect
   algebra** — POSSIBLES P-6.
7. **Aura arithmetic and conversion completeness** (Float64 semantics,
   date and span ops) — stdlib signature work.
8. **Self-hosting.** Open, but not for want of an import story: see
   the closed item below.
9. **A depth cap for `+nets`'s data roll.** N13's termination rests on
   `%data` bodies being **regular**, which nothing checks (S5.1). It
   holds today because there is no surface form for `%data` and the
   population is five regular boot registrations — so the obligation
   is a tripwire, not a bug: a module that can export a user-authored
   `%data` needs the cap in the same change. `+funi` carries the same
   shape (no seen-set and no depth cap) and the same note.
10. **Requirement G beyond guards.** G's containment argument —
   "a pinned signature is the only unvalidated way into a guard" — is
   about guards alone, and three other things a pinned return asserts
   get the same unvalidated trust with no requirement attached: a
   sealed nominal, a declared sum's tag set, and `T?`'s discriminant
   shape (S11.2). Extending G is curation work, not compiler work,
   which is why it is open rather than broken.
11. **Redundancy checking.** `+mcov` is a cover test, so duplicate
   *refutable* cases are not detected (S12.3). Exhaustiveness is
   enforced; redundancy is partial by implementation rather than by
   ruling.

**Closed, and recorded here because this section asserted otherwise.**

- **The operator-trait hook.** This read "user operator overloading,
  post-1.0". It is live and probed: `trait Mod { modu(%); }` with an
  impl makes `a % b` dispatch to it, `%` being the one operator the
  prelude deliberately leaves unclaimed (runtime.md R-63). The hook is
  **per-method**; the trait-name form `trait Add(+)` is retired and
  does not parse (S8.12).
- **Parameterized class conformance.** Listed as excluded; the class
  fence came down and `class K(St) impl Kernel<nockapp.Effect>` is
  ordinary (S9.4). One narrower fence remains and is item 3's
  neighbour, not item 3: such an impl cannot cross a module boundary.
- **`String`/`Path` erasures.** Listed as pending the runtime-library
  interface spec. They are pinned there now — runtime.md R-38 and
  R-49.
- **Jock-native modules.** `$lsrc` discriminates on whether a library
  is *minted* or arrives *already typed*, not on its language, so a
  `%jock` module compiles through `+modl` to an ordinary `$hlib` whose
  `arms` are derived by minting and therefore cannot lie — against a
  `%nock` library's signatures, which are pinned assertions nothing
  verifies (S11.2, and requirement G for what that costs). `+habi`
  gives both the same ABI core, so `+mimp` fires a Jock module and a
  Hoon core identically. Stdlib-in-Jock is consequently real: `lib/`
  carries `chainkey`, `chaintx`, `hof`, `interval`, `parser`,
  `rational` and `urbit`, and precompiled libraries ship as `%nock`
  packages.

---

## Appendix: the decision index

The deliberations — what each `D-n` asked, what it settled, and what
it superseded — live in
[`docs/record/types-arc.md`](../record/types-arc.md). The ids are
cited from `crates/`, `tests/` and `tools/`, so they are permanent:
never renumbered, never deleted.

What each decision *settled* is stated as a rule in the body. The
index below says where, so a reader following a citation from the
compiler lands on the rule rather than on its history.

| id | the rule it settled now lives in |
|---|---|
| D-1 | S10.1 (Hoon-compatible erasure) |
| D-2 | S10.2 (declared unions; bunt is the first case) |
| D-3 | S3 (`enum Never {}` is `%void`) |
| D-4 | S6 (untagged discriminable unions), S3 (`T?`) |
| D-5 | S5.2, S8.1 (join failure confined to synthesis) |
| D-6 | S4 (singletons, shallow) |
| D-7 | S3 (flat auras) |
| D-8 | S3.4 (the closed guard set) |
| D-9 | S11.1 (`+ut` oracle scope) |
| D-10 | S9.1 (`%decl` is kernel) |
| D-11 | S9.8 (cores as ABI only) |
| D-12 | S5.1 N7 (gates are invariant) |
| D-13 | S11.2 (import typing is curation) |
| D-14 | S9.7 (the generics surface) |
| D-15 | S10.3 (bunt well-foundedness at registration) |
| D-16 | S4 (singletons are unutterable) |
| D-17 | S4 (widening drops guards) |
| D-18 | S8.10 (`Bool` is pinned to `{0, 1}`) |
| D-19 | S9.5 (class state must be a declared struct) |
| D-20 | S8.12 (head-directed operator resolution) |
| D-21 | S9.3 (the union surface) |
| D-22 | S9.3, S9.4 (sum-of-products; no existentials) |
| D-23 | S8.5 (function groups) |
| D-24 | S11.1 (oracle exclusion #3: aura direction) |
