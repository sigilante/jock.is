# Nockasm as a compiler target

*The consumer owns the compiler-target spec; the nockasm repo keeps
the IR implementation and its own docs. Maintained here. N.B.: the
phase names below (M0, M0.5, M1…) are nockasm-project phases, not the
Jock roadmap's M0–M5. Adoption provenance and the version history are
[`docs/record/nockasm-arc.md`](../record/nockasm-arc.md).*

Rules carry flat `N-n` ids, append-only, in **one space shared with
[`nockasm.md`](nockasm.md)** — that document holds N-1 to N-25 (Jock's
instantiation) and this one continues at N-26 (the target contract).
One subject, split by what each side owns. Neither document is
vendored; the Hoon pair they describe is.

*Spec, v0.5. M0 and M0.5 are implemented; later phases
are design. v0.5 (IR version 3) adds `%scry`, the named form of the
Nock 12 extension used by Urbit and Nockchain. Both operands are formula
positions. v0.4 (IR version 2) factored the types into
`/sur/nockasm` with the vocabulary as a self-parameterized builder;
the `%nock` opaque embed; `_` anonymous schema positions; the lift
fallback moves from structural raw cells to `%nock`. All of it is
pure vocabulary extension — every v1/v2 IR value lowers and renders
exactly as before.*

Nockasm today is a one-way street: a human writes `.nasm`, `expand`
produces canonical Nock. This document specs the other direction — a
compiler (concretely: Jock, built in Hoon) *emitting* Nockasm as its
code-generation target, so that legible assembly becomes the build
artifact and raw Nock becomes a derived output.

## 1. Motivation

**N-26 · The point is REVIEWABLE ARTIFACTS.** A compiler that emits
raw Nock nouns produces artifacts nobody can review; one that emits
Nockasm produces artifacts that are **auditable** (named opcodes,
named axes, provenance comments), **diffable** (codegen regressions
show up as readable text diffs in `.nasm` files checked into a
corpus) and **teachable** — Nockasm's pedagogical goal, extended from
hand-written examples to real compiler output.
⟨lane `tools/vex.sh`; `t-nx-strip-p`⟩

**N-27 · Nockasm stays a THIN, SEMANTICS-FREE macro layer.** It does
not become an optimizer, a type checker or a second compiler. Every
construct has a fixed lowering equation and the compiler upstream
owns all cleverness. ⟨`t-nx-conf-axis-p`, `t-nx-conf-let-p`⟩

## 2. Where it plugs in

**N-28 · `+mint` IS the emitter — there is no separate typed-AST
stage.** The front end is `+jeam`, which is
`desugar:sugar` over `parse:parse` over `tokenize:lex`, and it
produces the Jock AST. `+mint` then produces `[nasm typ]` in one
pass: code and type together, the same fusion `seek` has (types.md
S7). Execution goes through `+expand:expand`; the artifact goes
through `render`.

```
text ─tokenize→ tokens ─parse→ AST ─desugar→ kernel AST
                                                │
                                          mint ─┤─→ $nasm ─render→ .nasm   (artifact)
                                                │         └expand→ noun    (execution)
                                                └─→ typ
```

⟨`t-nx-conf-axis-p`, `t-nx-strip-p`⟩

> This section previously drew the pipeline as
> `source ─parse→ jock AST ─jype→ typed AST ─mint→ Nock noun`, with a
> standing note that the stage names were "to be confirmed against
> `jock-lang` source". Confirmed: there is no `+jype` anywhere in the
> tree, and no typed-AST intermediate — which also means the
> "`typed AST ─emit→ $nasm`" arrow was describing a stage boundary
> that does not exist. `nockasm.md` §4 had it right all along,
> calling `+mint` the producer.

**N-29 · The sur depends only on the Hoon stdlib; the lib depends
only on the stdlib and the sur.** A toolchain that merely constructs
or inspects IR vendors the types **without** the implementation; Jock
vendors both because it renders `.nasm` artifacts and uses the
reference expander in the conformance harness (N-3).
⟨lane `ci:pins`⟩

**N-30 · Integration has two levels, and only L1 is committed.**
**L1**, the IR target: Jock's codegen constructs `$nasm` values
instead of nouns and lowers through this library, so names survive
into the artifact by construction. **L2**, macro extensions —
gate/core/loop macros so emitted assembly is compact rather than
drowning in `%push`/`%call` scaffolding — is **conditional** (§7,
N-24). ⟨`t-nx-push-p`, `t-nx-call-p`⟩

## 3. The IR contract (M0 — implemented; v3 vocabulary)

**N-31 · The target IR is `$nasm`**, promoted from internal AST to
public interface and factored into `desk/sur/nockasm.hoon`. The
vocabulary is a builder parameterized over its own recursion, and
plain `$nasm` is its self-instantiation. The block below is quoted
verbatim from the vendored sur and is checked against it:
⟨lane `ci:pins`; `t-nx-strip-p`⟩

```hoon
++  nasm-of                                ::  the vocabulary
  |$  [self]
  $%  [%atom p=@]                          ::  literal (never lifted here)
      [%axis p=@t]                         ::  named leg reference
      [%cell p=(list self)]                ::  raw cell, structural
      [%op p=@t q=(list self)]             ::  (%opcode ...) application
      [%let p=@t q=self r=self]            ::  #let p = q in r
      [%match p=self q=(list (mcas-of self)) r=self]
      [%nock p=*]                          ::  opaque formula embed
  ==
++  mcas-of  |$([self] [p=self q=self])    ::  one #match case
+$  nasm  $~([%atom 0] (nasm-of nasm))     ::  the plain instantiation
+$  mcas  (mcas-of nasm)
```

**N-32 · An annotated instantiation ties the knot through its own
wrapper** —
`+$  noted  $~([*note [%atom 0]] [=note node=(nasm-of noted)])`, the
explicit `$~` bunt being load-bearing (without it Hoon's bunt
derivation recurses forever) — so a debugger's span-carrying AST or
a provenance-carrying emitter IR is a first-class citizen of the
vocabulary, not a fork of it: every case, including any appended
later, is inherited by construction. `desk/tests/lib/nockasm.hoon`
(`test-vocabulary-instantiation`) pins the pattern.

**N-33 · `%nock` is the opaque formula embed.** `[%nock p=*]` holds an
already-formed Nock formula as a raw noun. Its purpose is boundary
embedding for foreign-produced formulas (FFI glue, precompiled
fragments); it is not a general escape hatch. Its expansion equation
is **identity**: `(%nock f)` lowers to exactly `f`.
⟨`t-nx-nock-p`, `t-nx-conf-nock-p`, `t-nx-law-fallback-p`⟩

**N-34 · The expander never recurses into, validates or rewrites a
`%nock` payload** —
well-formedness is the producer's responsibility, and tooling treats
the payload as opaque (hint-laden and intentionally-partial formulas
must survive untouched). In an argument position the enclosing op's
kind applies to the expanded value as for any expression (a bare-atom
result in a formula position lifts to `[1 atom]`). In text, the
payload is a *noun literal* — atom literals and `[...]` cells only,
never an expression.

Public arms (`lib/nockasm.hoon`), with Python equivalents in
`nockasm.py` (`parse`, `lower`, `render`, `NASM_VERSION`):

```hoon
++  nasm-version  ::  3; version of the node set, lowering equations,
                  ::  and rendering rules. append-only. (in the sur)
++  parse   ::  @t -> [sch=(unit sema) ast=nasm]
++  lower   ::  [sch=(unit sema) ast=nasm] -> *   IR to Nock
++  render  ::  [sch=(unit sema) ast=nasm] -> @t  IR to canonical text
```

**N-35 · THE ROUND-TRIP LAW.** For every well-formed `[sch ast]`:

```
(expand (render sch ast))  ===  (lower sch ast)      (bit-identical)
```

Checked by `tests/test_render.py` (round-trip + idempotence through parse +
76-column invariant, over the full corpus including the benchmark
transcriptions) and by `tests/test_hoon.py` (Hoon `render` output is
**byte-identical** to the Python renderer's, and the Hoon round-trip
matches, for every corpus case).

### Nock 12 scry extension

IR version 3 adds one named opcode:

```text
(%scry REF PATH)  ->  [12 REF PATH]
```

`REF` and `PATH` are both formula positions, so bare atoms lift to
opcode-1 constants exactly as they do for `%eval`, `%eq`, and `%comp`.
The runtime evaluates both against the current subject, then delegates the
resulting ref/path pair to its scry handler. That handler and its failure
semantics are runtime concerns; Nockasm only specifies the formula shape.

This is an explicit extension beyond Nock 4K. Runtimes that implement only
opcodes 0–11 can still parse the lowered noun but cannot execute it. The
extension is append-only at the IR level: every v1/v2 value has unchanged
lowering and rendering.

**Subject schemas (`$sema`).** Schemas are spec surface and live in
the sur beside `$nasm`:

```hoon
+$  sema
  $%  [%leaf p=@t]                         ::  named position
      [%pair p=sema q=sema]                ::  nesting, arbitrary depth
      [%hole ~]                            ::  anonymous position (_)
  ==
```

**N-36 · The `:subject {…}` text form is a CONVENIENCE, not the
interface.** It parses to a `$sema` value, but a downstream compiler holds a
binary tree mirroring subject shape plus a name→axis map, and
projects those into `$sema` mechanically — construction as data is
the contract, and the differential suites pin data-constructed
schemas against their text-parsed equivalents. construction as data is the contract. Three requirements follow.
⟨`t-nx-axis-p`, `t-nx-conf-axis-p`⟩

**N-37 · ANONYMOUS POSITIONS.** Generated schemas mirror subject shape
  and leave unnamed axes as holes: `[%hole ~]`, rendered `_`
  (Python: the marker string `'_'`, distinguishable from names,
  which always carry their leading dot). Holes are structure with no
  name bound; they bind nothing at resolution.
**N-38 · NAMES AND AXES ONLY.** `$sema` carries names, structure, and
  axes — never type information of any kind (not Hoon `$type`, not
  anything else). A downstream type system projects onto `$sema` by
  dropping types.
**N-39 · UNIQUENESS is the PRODUCER's obligation.** A name may appear at most once in a schema.
  Uniqueness is the **producer's obligation** — an emitter
  uniquifies before constructing `$sema`. The expander rejects
  duplicates at resolution time (`%duplicate-schema-name` crash) and
  defines no shadowing semantics. Holes are not names and repeat
  freely.

**N-40 · The target states four obligations on ANY emitter.** Jock's
own commitments against them are `nockasm.md` N-12 to N-17, which are
stricter in two places — Jock reserves `.t0`, `.t1`, … for temporaries
where the target merely requires α-renaming, and Jock's
`%duplicate-schema-name` is a *compiler bug* rather than a tolerated
refusal. The target stays strict and the compiler adapts:
⟨`t-nx-shadow-n`, `t-nx-axarg-n`, `t-nx-match-p`, `t-nx-unbound-n`⟩

1. *No shadowing.* `#let` of a bound name is a compile error by
   design. Emitters α-rename (`x`, `x-1`, …); compiler temporaries use
   a reserved convention (`.t0`, `.t1`, …).
2. *Names* match `[a-z][a-z0-9-]*` (the grammar allows more; hoon-term
   discipline keeps artifacts portable).
3. *Every `#match` carries a default.* Non-exhaustive source matches
   lower with `_ => (%crash)`.
4. *Axis arguments are atoms.* Symbolic axes go through `.name`; an
   emitter never writes a literal axis for anything that has a
   source-level name — the library's peg-shift machinery owns that
   bookkeeping.

## 4. Canonical rendering (v1, normative)

**N-41 · Rendering is CANONICAL and normative.** The rules below are
a function from IR to text, so two producers of the same IR render the
same bytes — which is what makes a `.nasm` artifact diffable (N-26)
and what the Hoon↔Python parity suite asserts.
⟨lane `ci:pins`⟩

`render` is deterministic so `.nasm` artifacts diff cleanly across
compiler versions, and both implementations must agree byte-for-byte.
The rules, as implemented:

- **Atoms**: cord form `'...'` iff the value is ≥ 2 bytes and every
  little-endian byte is printable ASCII (0x20–0x7E) excluding the
  quote (0x27); otherwise decimal with dots every three digits.
  Rendering is a function of the *value* — the IR does not remember
  source spelling.
- **Wide forms** (single line): atom and axis literals; cells
  `[e1 e2 …]`; ops `(%name e1 …)`; `%nock` embeds
  `(%nock <noun-literal>)`, whose payload renders as its structural
  reading (atoms and right-spine-flattened raw cells) and therefore
  always has a wide form. `#let`/`#match` have no wide form, so
  anything containing them renders tall.
- **Width**: an expression renders wide iff it has a wide form and
  `indent + length + reserve ≤ 76`, where *reserve* is the number of
  closing-delimiter characters an enclosing form will append to its
  final line. No emitted line exceeds 76 columns.
- **Tall cell**: `[ ` merged with the first element's first line
  (two columns, so continuations align); remaining elements at
  indent+2; `]` appended to the final line.
- **Tall op**: `(%name` on its own line; arguments at indent+2; `)`
  appended to the final line. A `%nock` embed too wide for one line
  renders the same way: `(%nock` on its own line, the payload's
  structural reading at indent+2, `)` appended.
- **Tall `#let`**: `#let .n = V in` on one line when `V`'s wide form
  fits; else `#let .n =`, `V` at indent+2, `in` at the same indent;
  body at the same indent as `#let`.
- **Tall `#match`**: `#match S {` when `S`'s wide form fits; else
  `#match`, `S` at indent+2, `{` at the indent. Each arm at indent+2:
  `P => B` on one line when both fit; else `P =>` with `B` at
  indent+4; else `P` tall with ` =>` appended and `B` at indent+4.
  The default renders as an arm with pattern `_`, last. `}` on its own
  line at the match's indent.
- **Schemas** always render wide; right spines flatten
  (`{.a .b .c}`, never `{.a {.b .c}}`); anonymous positions render
  as `_`.
- **Program**: `:subject SCH` line when a schema is present, then the
  expression at indent 0; every line newline-terminated.
- **Comments** are not represented in the IR and never emitted
  (provenance annotations are §8 and ride a side channel).

## 5. Jamfiles and the deterministic lift (M0.5 — implemented)

**N-42 · The lift is DETERMINISTIC and makes no claim about intent.**
It names well-shaped formulas and falls back to `%nock` for
everything else, so it is total (`nockasm.md` N-10). The heuristic
tier — skeleton recognition, core-alias axes, `%arm` promotion — is
cut and stays cut (§9.4): it would make claims about intent, and
intent belongs to debug info.
⟨`t-nx-lift-p`, `t-nx-lift-const-p`, `t-nx-law-fallback-p`,
`t-nx-law-scry-p`⟩

Nock artifacts in the wild are jamfiles — hoonc kernels, pills,
`.jam` build outputs. `nasm-from-jam` (Hoon) / `nasm_from_jam`
(Python, plus `python -m nockasm --from-jam formula.jam`) reads one
and emits canonical `.nasm`: cue, then *lift*, then render.

`lift : * -> nasm` is the **deterministic, zero-heuristic** reading of
a noun as a formula. Nock is homoiconic — nothing in a noun marks it
as code — so the contract is: the caller asserts the root is a
formula, and the lift propagates that assumption through Nock's
positional grammar (the expander's per-opcode kinds table read in
reverse). Concretely:

- Cell heads 0–12 with well-shaped tails lift to named ops; formula
  positions recurse; a cell head means cons-formula (both halves
  lift, so a readable half is still read even when its sibling is
  not).
- **Anywhere a formula-position subtree cannot be macro-ized** — an
  atom in a formula position (`[2 5 6]`, or a bare atom at the
  root), an opcode head above 12, a cell axis, a malformed tail —
  the node falls back to an opaque `%nock` embed. This makes the
  lift **total** as a formula reader: every subtree is either read
  as a formula or explicitly marked as not one, rather than
  silently re-dressed as structure. (v1 fell back to structural raw
  cells; same soundness, weaker claim.)
- **Data positions stay structural**: opcode-1 payloads and dynamic
  hint tags lift to raw cells/atoms, not `%nock` — they are nouns,
  not formulas, and `%nock` there would be a false claim.
- **No intent is ever claimed**: constants are `%const` (never
  `%arm`), axes are `%slot` (never the core aliases), and no macro
  skeleton is recognized. Opcode-1 payloads render as pure data even
  when they are batteries — that judgment belongs to tooling with
  out-of-band knowledge (debug info), not to a deterministic reader.

Soundness law, enforced over the corpus and the fallback zoo by
`tests/test_lift.py`, and cross-implementation (byte-identical lifted
renders, via `tests/test_hoon.py`):

```
(lower ~ (lift f))  ===  f        for every noun f
```

Misclassifying data as code is impossible by construction — the only
cost of the no-heuristics stance is that lifted output for constants
reads as data, which is the honest default.

`jam`/`cue` ship in both implementations (canonical encoding,
backreferences included; a `.jam` file is the jammed atom's bytes,
little-endian).

## 6. Mapping Jock environments to names

**N-43 · A name→axis map plus subject shape projects into `$sema`
mechanically** (N-36), which is the whole of the mapping: Jock's
`lay`/`nam` do the projection and nothing textual is involved.
⟨`t-nx-axis-p`, `t-nx-conf-axis-p`⟩

Jock's lexical environment at any program point is a subject shape.
The mapping is mechanical:

- The compilation unit's initial subject becomes the `:subject`
  schema; nested shapes are already expressible (`{{.a .b} .c}`).
- Every Jock `let` becomes `#let` — the axis bookkeeping (`peg 3`
  shifting of names in scope) is what the library already implements.
- Jock scalar-tag matches become `#match`. Structural patterns with
  binders are an open extension (§9).

## 7. Macro extensions (L2 — conditional)

**N-46 · L2 is GATED on reading real artifacts, not on taste.** The
macros below are specified so the decision can be taken against
evidence; nothing in Jock presumes them, and Jock emits L1
scaffolding (N-30). ⟨`t-nx-push-p`, `t-nx-call-p`, `t-nx-arm-p`⟩

Hand-written Nockasm (see `benchmarks/*.nasm`) exhibits the idioms
every compiled functional program needs — gate, call, core, loop — as
raw `%push`/`%arm`/`%call` scaffolding. L2 would mechanize them:

| Macro | Lowering |
|---|---|
| `#gate .n = D in B` | `[8 [1 D] [1 B] 0 1]` — `.n` at axis 6, prior names pegged under 7 |
| `#call G A` | `[8 G 9 2 10 [6 A] 0 2]` — `A` compiled with names pegged under 3 |
| `#core { %a => B1 … }` | `[[1 battery] 0 1]` — battery at 2, prior names pegged under 3 |
| `#invoke %arm CORE` | `(%call axis CORE)` — battery axis computed by the library |
| `#loop .acc = I in B` | `[8 I 8 [1 B] 9 2 0 1]` — `.acc` at 6, prior names under 7 |
| `#recur E` | `[9 2 10 [6 E] 0 1]` — works in non-tail position (it is just a kick) |
| `#set .x = E in B` | `[7 [10 [ax E] 0 1] B]` — rebind an existing name; axes unchanged |

(All skeletons verified executable under pinochle; multi-argument
gates and multi-accumulator loops take a schema in the binder
position.)

**Why conditional.** As a *target*, the macros add zero expressive
power — a machine emits scaffolding as easily as sugar. What they buy
is artifact legibility/compression and a single point of truth for the
calling conventions. What they cost is a doubled maintenance surface:
every macro is two synced implementations, forever, held together by
the differential suite. So:

> L2 ships only as a **single frozen batch, gated on evidence**:
> compile real Jock programs at L1 and read the artifacts. Skeleton
> soup → the batch is priced correctly; legible enough → skip it.

**The resolution firewall.** Arm names never resolve implicitly across
core boundaries. `#invoke` always takes an explicit core expression;
crossing into a nested gate/core, the emitter binds the enclosing core
to a leg first:

```
#core {
  %method =>
    #let .this = (%self) in
    #gate .x = 0 in
      (#call (#invoke %sibling .this) .x)
}
```

Explicit `.this`, no capture magic. The moment names resolve through
the subject tree, this layer is reimplementing Hoon — that is the line
not to cross. Arm names (`%name`, battery positions) and leg names
(`.name`, subject axes) remain distinct namespaces.

**Acceptance (if gated in):** rewrite `benchmarks/dec.nasm` and
`benchmarks/fibonacci.nasm` in the macros; they must expand
bit-identical to the `urbit/benchmark` formulas. The inner skeletons
already match exactly; the outermost call conventions may force a
`#call` sibling for "kick the gate that is already the subject" —
add the sibling rather than weaken the test. For scale: `dec` in L2 is

```
#gate .m = 0 in
#loop .b = 0 in
  (%if (%eq .m (%inc .b))
       .b
       (#recur (%inc .b)))
```

against ~40 lines hand-drilled today.

## 8. Provenance channel

**N-44 · Provenance has TWO TIERS and neither enters the IR
semantically.** Tier 1 is comments, a `render`-side channel. Tier 2 is
`%spot`-style dynamic hints, emitted through the existing `%hintd` op
and derived from `pos` — off in release builds and off in the
differential suite (`nockasm.md` N-23).
⟨`t-nx-hintd-p`, `t-nx-hint-p`⟩

Two tiers, both optional, neither in the IR:

1. **Comment provenance** (zero-cost): `render` grows an annotation
   side-table emitting structured comments before forms:

   ```
   ;@ src/fib.jock:12:3
   (%call 2 …)
   ```

   Comments are lexical; the round-trip law is unaffected.

2. **`%spot` hints** (debug builds): wrap annotated forms in dynamic
   hints, `[11 [%spot [1 p q]] f]`, mirroring Hoon's `~_`, so stack
   traces from a crashed formula point at Jock source lines. A
   `lower`/`render` flag; release builds omit it; the differential
   suite runs with it off.

## 9. What is open

**N-47 · Four questions are open here, and all four are genuinely
open** — unlike the lists this recomposition found elsewhere, none of
these has an answer written underneath it. ⟨none — UNPINNED⟩

1. **Structural match patterns.** `#match` compares whole nouns by
   equality. Jock destructuring (`[%tag a b]` binding `a`, `b`) wants
   cell patterns with binders — depth tests + tag equality +
   `#let`-style binding. A real extension; needs its own mini-spec.
2. **Jets and hints.** Where Jock wants `%fast` registration, the
   emitter writes `(%hintd …)` directly (works today); revisit a
   `#jet` convenience only if artifacts get noisy.
3. **Optimization surface.** If Jock grows peephole passes, they could
   run on `$nasm` (legible before/after diffs) rather than on nouns.
   Nothing blocks either; the IR makes the option real.
4. **Heuristic lifting.** The *deterministic* lift shipped in M0.5
   (§5) — jamfiles were the concrete consumer. What remains cut is the
   heuristic tier specced in v0.1: skeleton recognition (re-sugaring
   gates/cores/loops), core-alias axes, and `%arm` promotion of
   opcode-1 payloads on use-evidence. All of it is sound
   (`%const`/`%arm` lower identically, so misclassification costs
   legibility, never bits) but it makes claims about intent, and
   intent belongs to debug info. Revisit only if reading lifted
   artifacts without provenance becomes a real workflow.

## 10. Phasing

**N-45 · The phase names here are NOCKASM-PROJECT phases**, not the
Jock roadmap's. M0 and M0.5 are implemented; everything later is
design. ⟨none — UNPINNED⟩

| Phase | Deliverable | Repo | Status |
|-------|-------------|------|--------|
| M0 | `parse`/`lower`/`render` public, `nasm-version`, round-trip + parity tests | nockasm | **done** |
| M0.5 | `jam`/`cue`, the deterministic `lift`, `nasm-from-jam` + CLI, soundness + parity tests | nockasm | **done** |
| v0.4 | `/sur/nockasm` factoring, `+nasm-of` builder, `%nock` embed, `$sema` holes + contract, IR version 2 | nockasm | **done** |
| v0.5 | `%scry` for Nock 12, deterministic lift support, IR version 3 | nockasm | **done** |
| M1 | Jock backend: `mint : [env ast] -> [nasm typ]` behind a flag (N-28 — there is no separate typed-AST stage to emit from); differential CI vs legacy codegen (bit-identical nouns); `.nasm` artifacts in review | jock-lang | design |
| M2 | The L2 decision, from M1's artifacts; if gated in: the frozen macro batch + benchmark-rewrite acceptance | nockasm | gated |
| M3 | Provenance comments, `%spot` debug mode | both | design |
| — | `%nasm` clay mark + hoonc usage patterns (`doc/nasm-mark.md`) | nockasm | **done** (first-class hoonc patch proposed) |

M0 is useful with no Jock buy-in. Everything Jock-side rides behind a
flag until the differential CI is green.
