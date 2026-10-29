# Nockasm in Jock — Specification

**Status: NORMATIVE.** This document specifies Jock's *instantiation*
of the Nockasm IR: the positioned emitter type, the projection and
conformance contract, the emitter obligations `+mint` assumes, and the
conformance vector set. It deliberately does **not** restate the IR
itself — the vocabulary, lowering equations, canonical rendering,
schemas and the lift are owned by the compiler-target specification,
[`nockasm-target.md`](nockasm-target.md), whose spec surface is the
vendored `/sur/nockasm`.

Rules carry flat `N-n` ids, append-only. Each names what pins it — a
corpus vector, or the lane that checks it where the claim is about
agreement with a vendored artifact. A rule with neither says
`⟨none — UNPINNED⟩`.

Both documents live here; neither is vendored. `nockasm-target.md`
moved out of sigilante/nockasm into this repository, and that repo's
README now cites this one as authoritative. What **is** vendored is
the Hoon pair below.

## 1. The pin

**N-1 · The vendored pair is `sur/nockasm.hoon` and
`lib/nockasm.hoon`, bit-identical to the reference** — verified
against both the `desk/` and `nasmc/hoon/` copies upstream.

| what | value |
|---|---|
| reference | **sigilante/nockasm @ `6b3d812`** ("Add Nock 12 scry support", PR #11) |
| spec | v0.5, `+nasm-version` **3** |
| `crates/jockc/hoon/sur/nockasm.hoon` | `39e6b205…79e2a0` |
| `crates/jockc/hoon/lib/nockasm.hoon` | `a5c49e9c…29cb57e3` |

⟨lane `ci:pins`⟩

> **The authority for those hashes is `vendor/SNAPSHOT.txt`**, which
> the `pins` lane reads and this table does not. The table is a
> convenience copy, truncated deliberately so it cannot be mistaken
> for the checked record — it carried the full PR #9 hashes for three
> months after the tree moved to PR #11, which is what an unchecked
> second copy of a hash is for.

**N-2 · The pair is FROZEN except bugfixes.** The vendored files are
never edited here; adaptation happens in our own files, `sur/nasm` and
`lib/expand`. The IR version is append-only upstream, so adopting a
version bump is a deliberate re-pin — new hashes, new conformance run
— and never a drift. ⟨lane `ci:pins`⟩

**N-3 · The sur is the type contract and the lib is the reference
implementation** (`parse`/`lower`/`render`/`lift`/`jam`/`cue`). Jock
vendors both: the lib because we render `.nasm` build artifacts and
use the reference expander in the conformance harness. Our own
expander is `+expand:expand`. ⟨`t-nx-law-fallback-p`,
`t-nx-conf-axis-p`⟩

## 2. The positioned knot (`sur/nasm`)

The vocabulary is a self-parameterized builder (`+nasm-of`), designed
so that annotated instantiations are first-class rather than forks.
Jock's emitter IR is the provenance-carrying instantiation:

```hoon
+$  nasm
  $~  [~ [%atom 0]]                    ::  explicit bunt: load-bearing
  [pos=(unit hair) node=(nasm-of:nockasm nasm)]
```

**N-4 · The explicit `$~` bunt is required by the builder pattern** —
without it, bunt derivation recurses forever. The reference pins the
pattern with `test-vocabulary-instantiation`.
⟨lane `ci:pins`⟩

**N-5 · Drift between our IR and the reference is UNREPRESENTABLE.**
Every vocabulary case, including any appended in a future IR version,
is inherited by construction, both sides instantiating the same
builder. `$mcas` (positioned match case), `$sema`, `$opco` and
`$bare` (the pure instantiation) re-export per `sur/nasm`.
⟨`t-nx-strip-p`, `t-nx-strip-match-p`⟩

**N-6 · PROVENANCE TOTALITY** (ROADMAP invariant 2): no `$nasm` node
with a source ancestor may carry `pos=~`. `pos=~` is legal only for
compiler-fabricated nodes with no source correlate — bunt bodies,
injected defaults, ABI scaffolding. This is an emitter obligation on
`+mint`/`+mill`, and a corpus-checkable property that lands with
`+mint`'s own vectors. ⟨none — UNPINNED⟩

## 3. Projection and the conformance contract

**N-7 · `+strip:expand : nasm → bare` drops `pos` and recurses** —
nothing else. ⟨`t-nx-strip-p`, `t-nx-strip-match-p`⟩

**N-8 · The conformance contract is bit-identity with the
reference**, for every emitted `n`, with `sch` the schema in force
(§4):

```
(expand:expand n)  ===  (lower:nockasm sch (strip n))
```

⟨`t-nx-conf-axis-p`, `t-nx-conf-let-p`, `t-nx-conf-match-p`,
`t-nx-conf-nock-p`⟩

**N-9 · Two corollaries are INHERITED from the reference laws rather
than re-proved here**: render/parse round-trip
(`expand (render x) === lower x`) and lift soundness
(`lower ~ (lift f) === f`).
⟨`t-nx-law-atom-p`, `t-nx-law-cons-p`, `t-nx-law-inc-p`,
`t-nx-law-scry-p`, `t-nx-law-fallback-p`⟩

**N-10 · `+lift` with the `%nock` fallback is TOTAL** (v3): every
noun reads as a formula or is explicitly marked opaque.
⟨`t-nx-lift-p`, `t-nx-lift-const-p`, `t-nx-law-fallback-p`⟩

**N-11 · `%nock` embeds are for the BOUNDARY, never a general escape
hatch.** Jock uses them for foreign-produced formulas — FFI glue via
`$hlib`, precompiled fragments, wilt payloads — and the expander
treats payloads as opaque, which is what lets hint-laden formulas
survive untouched. ⟨`t-nx-nock-p`, `t-nx-conf-nock-p`⟩

> **Honesty note, and it is a real exception to N-11.** Beyond the
> boundary uses the emitter also rides `%nock` for a handful of
> **compiler-authored** formulas: the `as!`/`as?` wrappers, the
> `%type-test` predicate, and everything `lib/mold.hoon` produces.
> The mold checks are the largest generated code in the compiler and
> are consequently invisible in `.nasm` artifacts. Re-expressing the
> mold compiler in the vocabulary is the named fix — mechanical, and
> unscheduled.

## 4. Emitter obligations (`+mint` is the producer)

The target stays strict and the compiler adapts. These are
`+mint`/`+mill` obligations, normative here.

**N-12 · SCHEMAS ARE GENERATED, never written.** `$sema` is projected
mechanically from `lay`/`nam.env` — names, structure and axes only,
`%hole` for unnamed positions — and never constructed via text. Type
information never enters a schema; `lay` projects by dropping types.
⟨`t-nx-axis-p`, `t-nx-conf-axis-p`⟩

**N-13 · UNIQUENESS IS OURS.** A name appears at most once per
schema and the emitter α-renames before construction, so the
expander's `%duplicate-schema-name` crash is a **compiler bug** if
ever reached from Jock source. Compiler temporaries use the reserved
`.t0`, `.t1`, … convention. There is no shadowing: a `#let` of a
bound name is likewise α-renamed at emission, surface shadowing
having been resolved by `nam` long before.
⟨`t-nx-shadow-n`, `t-nx-let-p`⟩

**N-14 · Emitted names match `[a-z][a-z0-9-]*`** — Hoon-term
discipline, for portable artifacts. ⟨none — UNPINNED⟩

**N-15 · Every `#match` carries a default.** A source match proven
exhaustive (types.md S12.3) still lowers with `_ => (%crash)`: the
checker's proof does not relax the target's contract. This is
**currently vacuous** — `+mint` does not yet emit `#match` (N-21) —
and binds the moment it does.
⟨`t-nx-match-p`, `t-nx-conf-match-p`⟩

**N-16 · SYMBOLIC AXES ONLY.** Anything with a source-level name goes
through `.name`; a literal axis appears only for ABI-fabricated
structure — dictionary arms, closure internals. The library's
peg-shift machinery owns axis bookkeeping.
⟨`t-nx-axis-p`, `t-nx-axarg-n`, `t-nx-unbound-n`⟩

**N-17 · DETERMINISM** (ROADMAP invariant 1): emitted `$nasm` is a
pure function of source plus pinned inputs. Formula-keyed jets (§6)
and the bootstrap fixed point both depend on it.
⟨lane `tools/vex.sh`; `t-nx-conf-axis-p`⟩

## 5. Conformance vector set

**N-18 · One mold, one runner.** Expander-track vectors are ordinary
`$tvec` rows (types.md S13, `tests/hoon/sur/vec.hoon`), distinguished
by judgment tag, living at `tests/hoon/lib/vex-nasm.hoon` and run by
`tools/vex.sh` like every other vector. Five judgments, 44 rows:

| judgment | in → out | what it asserts |
|---|---|---|
| `%strip` | positioned → bare | the projection is exact, and junk positions in the input prove it ignores them |
| `%expand` | `[sch positioned]` → Nock noun | the lowering equations value by value — **all twenty-one** opcodes, schema axes, raw cells, the `%nock` identity embed, `#let` pegging, `#match` chain compilation; negatives for unbound axes, unknown opcodes, empty raw cells, non-atom axis arguments and `#let` shadowing |
| `%conform` | `[sch positioned]` | the N-8 contract computed both ways in the harness, `expand` against `lower`∘`strip`, asserted equal per input |
| `%lift` | structured formula → positioned IR | op recovery and structural (`+noun-ast`) constants, `pos=~` throughout |
| `%liftlaw` | raw noun | the reference soundness law, including `%nock`-fallback nouns our `+lift`'s structured `$nock` argument cannot express — a malformed formula is unrepresentable in the typed view, so the fallback is reachable only from raw nouns |

⟨`t-nx-strip-p`, `t-nx-slot-p`, `t-nx-const-p`, `t-nx-conf-axis-p`,
`t-nx-lift-p`, `t-nx-law-atom-p`⟩ — one per judgment; the `%expand`
rows are the per-opcode family, `t-nx-slot-p` through `t-nx-scry-p`.

**N-19 · Twenty-one is the count because `%scry` joined.** `$opco` is
a closed term set — `%self %battery %payload %sample %context %crash
%slot %const %arm %eval %isa %inc %eq %if %comp %push %call %edit
%hint %hintd %scry` — and `+expa-op` refines against it, so an
unknown opcode is a crash at expansion time. This section read
"twenty" while the set was at v0.4.
⟨`t-nx-scry-p`, `t-nx-law-scry-p`, `t-nx-unkop-n`⟩

**N-20 · Vectors are blessed per-vector with rationale** (ROADMAP
invariant 3); wholesale regeneration is forbidden.
⟨lane `tools/vex.sh`⟩

## 6. Interactions fixed elsewhere

**N-21 · `#match` emission is PLANNED, NOT CURRENT.** The vocabulary
and its lowering exist and are conformance-tested on hand-built IR,
but the match compiler emits `%if` chains everywhere, so an n-arm tag
match renders as n nested `(%if …)` forms in the artifact. Until
then `+mint` lowers pattern matches (types.md S12) to discriminant
tests (D1–D4) plus `#let` binding plus short-circuit `%if`/`%eq`
chains. Lowering through `#match` where every case is a bare tag is
the legibility fix, semantically equivalent.
⟨`t-nx-match-p`, `t-nx-if-p`, `t-nx-eq-p`⟩

**N-22 · Wilts ride `%hintd`** (POSSIBLES P-4, OPEN-22): there is no
`%jet` node, and **Jock will not request one** — the IR leaves the
door open (`nockasm-target.md` §9.2 revisits a `#jet` convenience if
artifacts get noisy), and this is Jock declining to walk through it,
not the IR refusing to build it. When wilt emission lands —
nothing emits wilts today — `+mint` will emit `%wild` jet
registration as `%hintd` with a `%const` clue. The wilt's structure
is checked in compiler molds, not in the IR.
⟨`t-nx-hintd-p`⟩

**N-23 · Crash provenance rides the same op.** A debug build may wrap
positioned forms in `%spot`-style dynamic hints
(`nockasm-target.md` §8 tier 2), emitted through the existing
`%hintd` op and derived from `pos`, off in release builds and off in
the differential suite. Comment provenance (tier 1) is a `render`-side
channel and never enters the IR. ⟨`t-nx-hintd-p`, `t-nx-hint-p`⟩

**N-24 · L2 macros are CONDITIONAL** (`nockasm-target.md` §7). Jock
emits L1 scaffolding; the L2 decision is made by reading real
artifacts, per that section's own gate, and nothing in this spec
presumes them. ⟨none — UNPINNED⟩

**N-25 · Structural match patterns are an OPEN EXTENSION of the IR**
(`nockasm-target.md` §9.1), which is why N-21's discriminant lowering
is what exists. ⟨none — UNPINNED⟩

## 7. What is open

1. Whether the conformance harness also runs the reference's Python
   implementation as a second oracle in CI. The reference repo already
   proves Hoon↔Python parity, so running one of them is probably
   sufficient.
2. The `%spot` hint payload shape for Jock positions — `hair` versus
   `[path hair hair]` — to be decided with the provenance demo.
