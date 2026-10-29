# The Jock Runtime Library Interface — Specification

**Status: NORMATIVE for the format and the pinned arms; population
continues.** This document states what crosses the boundary between
Jock and its substrate: every arm of the pinned `hoon` library (over
the hash-pinned hoon-138 snapshot), every `lib/*.jock` stdlib module,
and the record each must carry before a program may import it. It
carries no chronology — when and why each arm was pinned, retyped or
appended is [`docs/record/runtime-arc.md`](../record/runtime-arc.md).

Rules carry flat `R-n` ids, append-only: assigned in the order they
were written down, never in reading order, never renumbered. Each
names what pins it — a corpus vector, or, where the rule is about the
*interface* rather than about a program's behaviour, the lane that
checks it. A rule with neither says `⟨none — UNPINNED⟩` so the gap is
countable rather than invisible.

This is the FFI soundness story (types.md S11.2: *every* imported arm
is typed by its pinned signature — there is no projection judgment)
and the jet story (POSSIBLES P-4: the `%wild` stateless dashboard,
formula-keyed).

## 1. Scope

**R-1 · This spec owns four surfaces**, and operator resolution
consults the table in §7 and nothing else in 1.0:

- **The stdlib surface** — the pinned `hoon` library and the
  `lib/*.jock` modules: every arm reachable from Jock, under the
  import conventions (qualified access only, `hoon.add`, `m.f`; the
  library name binds in `nam`, types.md S7).
- **The operator table** (types.md S8.12 / D-20) — the head-directed
  mapping from surface operators to stdlib arms.
- **`$hlib` curation** — the pinned `$scheme` for every arm, dry and
  wet.
- **Dictionary and const pinning** (types.md S9.6) — compile-time
  constant nouns that ride `def.consts`.

⟨`t-run-import`, `t-mint-import-unknown`, `t-jres-site-hot`⟩

**R-2 · A wet arm's ∀-signature is hand-assigned and load-bearing.**
`turn`, `roll` and the rest get curated signatures, reviewed as spec
changes rather than code changes, each with its own rationale line. A
wrong wet signature is unsoundness, which is why this is a spec and
not a sweep. ⟨`t-list-turn-retype`, `t-list-reel`, `t-list-roll`⟩

**R-3 · Kernel state types are CLOSURE-FREE**, normative for shipped
kernels. Gate-containing types are not mold-checkable (types.md
S8.10), so they cannot cross poke or peek anyway; keeping them out of
*internal* state as well keeps checkpoints compact and avoids the
Hoon-vase-adjacent failure mode where serialized state drags a
construction-time context with it. ⟨`t-mint-asx-gate`,
`t-embed-gate-n`⟩

**R-4 · The per-arm record is the seed of the evaluation manifest**
(POSSIBLES P-8): the same row shape, generalized per call site, lets
a loader bind jets and direct calls at load time from compiler-emitted
subject knowledge — verified by the same content hashes this spec
already pins. ⟨none — UNPINNED⟩

## 2. Per-arm record format

**R-5 · One record per arm, six fields, and nothing ships unpinned.**
A record missing any field is not yet populated, and an unpopulated
arm is not importable.

| field | contents |
|---|---|
| **label** | qualified name as imported (`hoon.add`) |
| **formula hash** | sha-256 of the compiled formula noun — the pinned artifact, not the source |
| **mask** | the `$sock` cape for `%wild` matching: which parts of the template are exact vs wild (`[& |]` for a closure, code exact and env wild) |
| **signature** | the pinned `$scheme` (types.md); `gen=~` for dry arms, curated ∀ for wet |
| **vectors** | corpus vector ids exercising the arm through Jock source |
| **jet status** | `%hot` (in the NockVM hot state, hash-diff green) / `%cold` (interpreted, deliberately) / `%pending` |

⟨lane `tools/jets.sh`; `t-jres-site-hot`, `t-jres-pkg-cold`,
`t-jres-jock-cold`⟩

## 3. The CI hash-diff protocol

**R-6 · Jet drift is a CI diff, not a runtime mystery.** This
replaces the beta-era instrument-first protocol:

1. Compile the stdlib from the pinned snapshot; hash every emitted
   formula.
2. Diff the hashes against this spec's records **and** against the
   NockVM hot-state table.
3. Any mismatch fails loudly — either the spec is stale, and is
   re-pinned deliberately, or emission determinism broke, which is a
   bug (ROADMAP invariant 1).

⟨lane `tools/jets-lane.sh`; `t-jres-transitive`, `t-jres-unimported`⟩

**R-7 · Wilts are emitted UNCONDITIONALLY**, as `%hintd` with a
`%const` clue (OPEN-22). A non-supporting interpreter ignores them; a
supporting NockVM matches on label plus formula against its hot
state. ⟨none — UNPINNED⟩

## 4. Population obligations

**R-8 · An arm is pinned BEFORE the corpus test that imports it.**
No retroactive pinning. The operator table is completed before the
operator-desugar vectors are blessed, and `String`/`Path` erasure
pinning (types.md S14.6) lands here. ⟨lane `tools/jets.sh`⟩

### 4.1 The pinned arms

**R-9 · The ABI is FROZEN through 1.0, and APPEND is the one
sanctioned change shape.** A new arm enters at the END, so every
prior arm keeps its index; a modification in place is not available,
since it would move an index that emitted code already depends on.
⟨`t-fabi-frozen`⟩

**R-10 · The freeze rests on TWO pins, not one, and only one of them
is a mug.** `t-fabi-frozen` mug-pins `+harms:jock`, the *type* table
mint consumes and these records transcribe — pure data, so the mug is
build-stable, currently `2.089.799.381`. `+hoon-core:jock`, the
*value* table, is deliberately **not** mugged: its gates capture the
build subject, so a whole-core mug proved
build-composition-sensitive. Its formulas are held by the toolchain
pin until the wilt hashes land (R-6).
⟨`t-fabi-frozen`; lane `tools/jets.sh`⟩

**R-11 · The pairing of the two tables is pinned BEHAVIOURALLY.**
Battery order in `+hoon-core` pairs with `+harms` order — the order
*is* the pairing — and every arm carries at least one end-to-end
corpus row, attributed in the table below, so a reorder in either
table breaks a vector. Any change fails a pin until deliberately
re-blessed with a matching record change here. ⟨`t-fabi-frozen`⟩

**R-12 · Return auras are `Nat`, not `@`, wherever this table says
so.** Nineteen arms — `add` `sub` `mul` `div` `mod` `dec` `met` `mug`
`muk` `jam` `mix` `con` `dis` `rsh` `lsh` `end` `sdul` `sabs` `uint`
— return `[%atom %number ~]` in `+harms`, while their *arguments* are
`@`. `Nat` sits **below** `Atom` in the aura order (types.md S3.2),
so a declared `@` return would not flow into a `Nat` annotation and
these do. ⟨`t-cast-sint-out`, `t-abi-dec`⟩

> This section's own normativity claim is the one thing in it that
> has failed: the rows said `-> @` for all nineteen while the
> mug-pinned ABI said `Nat`, and the ABI was right throughout. The
> claim is only as good as a lane that checks it, and no lane checks
> signature agreement between these records and `+harms`. That gap is
> open — see `docs/spec-recomposition.md`.

**R-13 · Three record columns are deferred, deliberately, and one is
empty.** **Formula hashes** are deferred with the jet-drift protocol
(R-6): premature while the toolchain pin holds the formulas still,
and they land with wilt. **Jet status** is uniform across rows — the
wrappers close over the substrate's kernel gates, which carry the
jetted formulas, and `%wild` dashboard entries land with wilt.
**Masks** are empty, every wrapper being total over its signature's
domain. ⟨none — UNPINNED⟩

In the table, `Str` is the String nominal and `LC` is `List<Byte>`.

**R-14 · Curating an arm that takes a GATE turns on one question:
does the Hoon arm read or seed the gate's SAMPLE before calling it?**
If it only slams the gate, a Jock closure crosses as itself and the
arm needs no wrapper — `mink`'s scry gate, `lturn`'s mapper. If it
touches the sample, as `+reel` and `+roll` do in taking the fold's
initial accumulator from the gate's own sample tail, the wrapper must
build **its own** gate, seed that, and slam the caller's closure from
inside it.

The reason is a shape difference, not anything about wetness: a Hoon
gate's sample is its mold's bunt, so `+<+` exists, while a Jock
closure's sample is the atom `0` at every arity (types.md S9.8, as
amended). This is not fixable by bunting closures — `bunt` is partial
and crashes on `%var`, so a generic closure has no bunt to take.
⟨`t-list-reel`, `t-list-roll`, `t-list-turn-lambda`⟩

**R-15 · The failure mode when R-14 is got wrong is UNKIND**, which
is why it is written down. Editing *into* a Jock closure's sample —
axis 13, the sample's tail, which is what seeding an accumulator
touches — dies with `Invalid axis for edit: NotCell`, the sample being
the atom `0` and having no tail. Editing axis 6, which replaces the
sample wholesale, is exactly what a slam does and works fine; the
failure is one axis deeper. It is a runtime panic rather than a Nock
`!!` — and **`mule` does not catch it**, so from Jock it surfaces as
an unexplained harness crash, identical to the one an empty list
gives where the gate is never called. ⟨none — UNPINNED⟩

| label | signature | vectors | notes |
|---|---|---|---|
| `hoon.add` `sub` `mul` `div` `mod` | `(@, @) -> Nat` | ⟨`t-jimp-hoon`, `t-prec-mul`, `t-text-op-mixed`, `t-runs-op`, `t-diag-crash`⟩ | operator targets (§7) |
| `hoon.dec` | `@ -> Nat` | ⟨`t-abi-dec`, `t-cast-sint-out-deep`⟩ | |
| `hoon.lth` `lte` `gth` `gte` | `(@, @) -> Bool` | ⟨`t-runs-op`, `t-opeq-cmp`, `t-text-op-char-lt`, `t-text-op-char-gte`⟩ | ordered comparisons (§7); the prelude `Lt`/`Lte`/`Gt`/`Gte` impls route here |
| `hoon.crip` | `LC -> Str` | ⟨`t-text-chars-2`, `t-text-chars-3`, `t-text-chars-bad`⟩ | tape → cord |
| `hoon.trip` | `Str -> LC` | ⟨`t-jimp-print`, `t-spot-print`, `t-text-glyph`⟩ | cord → tape (bytes); every `print` row rides it, the `%slog` clue being a tape |
| `hoon.cat` | `(Str, Str) -> Str` | ⟨`t-repl-str`, `t-text-op-cat`, `t-text-strif-let`⟩ | byte concat (curated `cat`-3 wrapper) |
| `hoon.met` | `@ -> Nat` | ⟨`t-text-len`, `t-text-bytes`⟩ | byte length (curated `met`-3 wrapper); reached through `impl Str for String`, so `Str.len` converts and the caller writes `hoon.met(self as! @)` |
| `hoon.mug` | `* -> Nat` | ⟨`t-text-mug`, `t-abi-mug-canon`⟩ | the collection hash (Map/Set, S10.1). `t-abi-mug-canon` is the treap-canonicity row: insertion order cannot show through a mug-placed treap |
| `hoon.radd` `rdiv` | `(Float64, Float64) -> Float64` | ⟨`t-text-radd`, `t-text-rdiv`, `t-text-radd-op`, `t-text-rdiv-op`⟩ | `~(op rd %n)` — the **`%n` rounding mode is pinned in the wrapper**, with no mode surface |
| `hoon.rsub` `rmul` | `(Float64, Float64) -> Float64` | ⟨none — UNPINNED⟩ | the other half of the same family, and the gap is real: no corpus row multiplies or subtracts two Float64s |
| `hoon.rlth` `rlte` `rgth` `rgte` | `(Float64, Float64) -> Bool` | ⟨`t-text-rlth`, `t-text-rlt-op`, `t-text-rlte-op`, `t-text-rgte-op`, `t-eq-nan-ieee`, `t-eq-zero-ieee`⟩ | IEEE-correct on NaN and signed zero, which is why `Eq(Float64)` composes from `rlte` |
| `hoon.mput` | `forall K V. (Map<K->V>, K, V) -> Map<K->V>` | ⟨`t-asx-map-struct`, `t-text-map-put-ix`⟩ | `+put:by` wrapper |
| `hoon.mget` | `forall K V. (Map<K->V>, K) -> V?` | ⟨`t-arc-map-bracket`, `t-arc-map-empty`, `t-map-dup-last`⟩ | `+get:by` — the unit product IS `T?`, by construction |
| `hoon.mhas` | `forall K V. (Map<K->V>, K) -> Bool` | ⟨`t-text-mhas`⟩ | `+has:by`; the `in`/`∈` rows over Map route here |
| `hoon.mdel` | `forall K V. (Map<K->V>, K) -> Map<K->V>` | ⟨`t-text-mdel`⟩ | `+del:by` |
| `hoon.mkey` | `forall K V. Map<K->V> -> Set<K>` | ⟨`t-abi-mkey`, `t-text-mkey`, `t-text-mkey-has`⟩ | `+key:by` — builds through the set engine itself, so canonicality is by construction |
| `hoon.sput` | `forall T. (Set<T>, T) -> Set<T>` | ⟨`t-arc-set-ctor`, `t-asx-set`⟩ | `+put:in` |
| `hoon.shas` | `forall T. (Set<T>, T) -> Bool` | ⟨`t-text-shas`, `t-text-shas-no`, `t-text-mkey-has`⟩ | `+has:in`; the `in`/`∈` rows over Set route here |
| `hoon.sdel` | `forall T. (Set<T>, T) -> Set<T>` | ⟨`t-text-sdel`⟩ | `+del:in` |
| `hoon.mtap` | `forall K V. Map<K->V> -> List<(K, V)>` | ⟨`t-map-tap`, `t-map-tap-method`⟩ | `+tap:by` |
| `hoon.stap` | `forall T. Set<T> -> List<T>` | ⟨`t-set-tap`, `t-set-tap-method`⟩ | `+tap:in` — **treap order, not sorted order** |
| `hoon.lturn` | `forall A B. (List<A>, A -> B) -> List<B>` | ⟨`t-list-turn`, `t-list-turn-lambda`, `t-list-turn-retype`⟩ | `+turn` — slams only, so no wrapper (R-14) |
| `hoon.lreel` | `forall A B. (List<A>, (A, B) -> B, B) -> B` | ⟨`t-list-reel`, `t-list-reel-empty`⟩ | `+reel` — **seeds the sample, so the wrapper builds its own gate** (R-14) |
| `hoon.lroll` | `forall A B. (List<A>, (A, B) -> B, B) -> B` | ⟨`t-list-roll`, `t-list-roll-empty`⟩ | `+roll` — same wrapper shape as `lreel` |
| `hoon.mix` `con` `dis` | `(@, @) -> Nat` | ⟨`t-bit-mix`, `t-bit-con`, `t-bit-dis`⟩ | xor / or / and; the `@p` differential rides them (`examples/patp.jock`, `lib/urbit.jock`) |
| `hoon.rsh` `lsh` `end` | `(@, @) -> Nat` | ⟨`t-bit-rsh`, `t-bit-lsh`, `t-bit-end`⟩ | (bit-count, atom) |
| `hoon.muk` | `(@, @, @) -> Nat` | ⟨`t-bit-muk`⟩ | murmur3-32 `(syd, len, key)` — seed, byte length, key |
| `hoon.mink` | `((*, *), scry) -> Tone` | ⟨none — UNPINNED⟩ | virtualization. `examples/peektry.jock` and `examples/roof.jock` exercise it, but an example is not a vector — `peekTry` reaches `mock`, not `mink`, so no corpus row calls this arm |
| `hoon.mock` | `((*, *), scry) -> Toon` | ⟨`t-repl-peektry-some`, `t-repl-peektry-none`⟩ | `(mook (mink …))` — tone → toon; **trace frames flatten to `List<String>`** |
| `hoon.ssum` `sdif` `spro` `sfra` `srem` | `(Int, Int) -> Int` | ⟨`t-sint-sum`, `t-sint-sum-mixed`, `t-sint-sub`, `t-sint-mul`, `t-sint-div`, `t-sint-rem`⟩ | ZigZag `@s` over `+si` verbatim |
| `hoon.sdul` | `(Int, @) -> Nat` | ⟨`t-sint-dul`⟩ | **curated, not mirrored**; includes the exact-multiple edge |
| `hoon.scmp` | `(Int, Int) -> Int` | ⟨`t-sint-cmp`⟩ | `-1`/`0`/`+1` as Int (ZigZag), reached via the `Lt` impl |
| `hoon.sabs` | `Int -> Nat` | ⟨`t-sint-conv`⟩ | total magnitude |
| `hoon.sint` | `@ -> Int` | ⟨`t-sint-conv`⟩ | `+sun:si` — the ruled conversion name |
| `hoon.uint` | `Int -> Nat` | ⟨`t-sint-conv`, `t-sint-uint-neg`⟩ | the inverse: **crashes `%uint-neg`** on a negative |
| `hoon.iscell` | `* -> Bool` | ⟨`t-abi-iscell-cell`, `t-abi-iscell-atom`⟩ | Nock 3, the **only runtime discrimination Jock has** |
| `hoon.jam` | `* -> Nat` | ⟨`t-abi-jam`⟩ | the substrate's noun serializer. A kernel's `[%file %write path jam]` effect (chain.md §6.2) carries a jammed noun and has no other way to make one |

**Wet-arm rationales**, the per-pin reasons R-2 requires (types.md
S11.2: a wrong ∀-signature is unsoundness):

- `mput` — `+put:by` verbatim; inserting a `(K, V)` pair at `K`
  preserves shape and manufactures no value of either binder.
- `mget` — the product is Hoon's own unit, and `T?`'s erasure IS the
  unit by construction; soundness additionally rests on `Map<K->V>`
  values being built only through these wrappers, the nominal having
  no other constructor.
- `mhas` — `+has:by`'s loobean, guarded `%loob`; no binder appears in
  the product.
- `mdel` — shape-preserving; deletion cannot manufacture values.
- `mkey` — the keys of a `Map<K->V>` are `K`s by the `mput`-only
  construction invariant, and the set engine makes the product
  canonical.
- `sput`/`shas`/`sdel` — the same three arguments over `+in`.
- `mtap`/`stap` — traversal, and the arms that make `Map` and `Set`
  **foldable**: before them a collection could be built and queried
  but never walked, so every aggregate had to be threaded by hand
  through the keys. The binder in the product is sound for the same
  reason `mkey`'s is. Order is R-16; the trait is R-20.
- `lturn` — `+turn`, and the first pinned arm to take a user gate
  other than `mink`/`mock`'s scry. The crossing is R-17.
- `lreel`/`lroll` — `+reel` and `+roll`. Both take the initial
  accumulator from **the gate's own sample tail** rather than as an
  argument, so the wrapper seeds a gate of its own and slams the
  caller's closure from inside it (R-14, and R-15 for what happens
  if it does not). The `-empty` rows pin the seeding: an unseeded
  wrapper would answer the gate's bunt instead of the caller's `z`.

**R-16 · Traversal order is the TREAP's — mug order, S10.1's pin —
and NOT sorted by key.** It is deterministic for a given language
version and carries no other meaning, so a program that needs an
order must sort the product. `t-map-tap` and `t-set-tap` pin the
actual order, so a change to it is a visible break rather than a
silent reshuffle. ⟨`t-map-tap`, `t-set-tap`, `t-abi-mug-canon`⟩

**R-17 · A user closure crosses to `lturn` AS ITSELF.** A Jock
closure *is* a Hoon gate (types.md S9.8), and a `$-` sample in the
wrapper is nest-checked rather than normalized, so nothing rebuilds
it on the way in. ⟨`t-list-turn-lambda`, `t-list-turn-retype`⟩

**R-18 · `lib/hof` delegates to these arms**, so a program writes one
spelling and gets the kernel's formula — jetted where the Jock
recursion was interpreted. `hof.foldr` already takes `(item, acc)`,
which is Hoon's order and therefore the arms', and passes straight
through; `hof.foldl` is accumulator-first by convention and flips
with one wrapper closure per call, not per element.
⟨`t-list-turn`, `t-list-reel`, `t-list-roll`⟩

**R-19 · Delegation pays for `lturn` and NOT for the folds**, which
is why they are here for the arms rather than for speed. Over 20,000
elements against a 12s compile baseline the delegating `turn` costs
no time the harness can resolve while the recursion costs about two
seconds; folding 50,000 elements against a 24s baseline, the
delegating and hand-written forms land within a second of each other.
At small sizes there is nothing in either. `lturn`'s two seconds do
not generalize. ⟨none — UNPINNED⟩

**R-20 · `Tap` is ONE parameterized trait over two honest item
types**, `trait Tap<A> { tap(self: Self) -> List<A>; }` — a map's
item is a pair, a set's is the element. A `List` needs no impl,
being already the product type. ⟨`t-map-tap-method`,
`t-set-tap-method`⟩

**R-21 · The treap arms are the first FORALL-SIGNED imports**
(types.md S11.2's wet-arm story, live): `+mimp` instantiates the
scheme from the arguments exactly as a generic call does.
`Map<K->V>` and `Set<T>` are boot-registered data nominals over the
hoon-138 treap shapes. ⟨`t-jimp-mimp`, `t-asx-map`, `t-asx-set`⟩

**R-22 · Map and set literals desugar to `mput`/`sput` folds over
`~`** — same door, same insertion order, identical treaps by
construction. ⟨`t-arc-map-bracket`, `t-arc-set-ctor`,
`t-map-dup-last`⟩

**R-23 · The `m`-/`s`-prefixed names are the import-qualified
surface, and the prelude traits route the sugar.** `m.at(k)`,
`m[k]` and `m[k] = v` go through the `Idx`/`Put` impls over Map, and
`xs[i]` over List — per-head method dispatch, the same wrappers
underneath. Jock-source ports of the treap logic are the later
self-hosting exercise. ⟨`t-text-map-put-ix`, `t-index-put`,
`t-text-map-annot-put`⟩

#### The roof convention — a KNOWN DEVIATION, flagged pre-release

**R-24 · The normative scry gate is `(*, *) -> T??`**, and
`+harms`'s `roft` is correspondingly
`[%gate [%cell nn nn] un2]` with `un2 = (unit (unit *))`. The
`hoon.mink` and `hoon.mock` rows above type the caller's scry gate
that way. ⟨`t-fabi-frozen`⟩

**R-25 · The roof answers `T??`, which is R-24's gate type with no
glue.** `trait Roof` declares
`answer(self: Self, r: *, p: *) -> *??`, so a roof says what mink's
contract says and the three outcomes are each reachable:

| roof answers | spelled | means |
|---|---|---|
| `some(some(v))` | `(v as? T) as? T?` | here is the value |
| `some(none)` | `~ as? *?` | **no value at this path** |
| `none` | `~` | block — but see R-29 |

`T?`'s some-erasure *is* Hoon's unit, so `T??` erases onto
`$-(^ (unit (unit)))` exactly. ⟨`t-roof-shape-answer`,
`t-roof-shape-absent`⟩

**R-26 · A roof may instead answer a BARE value, and is then
LIFTED.** A `lambda (r, p) -> * { v }` is accepted: its body is
checked against the contract and optional injection — `+mint`'s
only checking-mode coercion — wraps it **twice** into `[~ [~ v]]`,
which `+mink` strips with `u.u.result`. Lift-two and strip-two
cancel, so the product is the body, **verbatim, always**:

| roof body | `peekUnder` / `peekTry` yields |
|---|---|
| `42` | `42` |
| `0` | *blocks* — `~` nests as the OUTER none |
| `(0, 0)` | `(0, 0)` — not absence |
| `(0, 42)` | `(0, 42)` — not unwrapped |
| `(5, 6)` | `(5, 6)` |

A lifted body can therefore only ever **answer**, which is why
absence was unsayable before `trait Roof` adopted `T??`
(2026-10-29). This table replaces one that was wrong in three of
six rows and attributed the behaviour to the `mink` jet handing the
return back un-unwrapped. No such bypass exists: nockvm's
`jet_mink` and the pinned Hoon `+mink` both implement
`[%0 u.u.result]` as specified, and the emitted Nock shows the lift
plainly — a lifted roof's battery is `[[1 0] [[1 0] [1 42]]]`, whose
autocons is `[~ [~ 42]]`, where the same lambda in an ordinary call
has battery `[1 42]`.
⟨`t-roof-lift-unit`, `t-roof-lift-nested`, `t-roof-lift-absent`⟩

**R-27 · `peekTry`'s `none` means "nothing you can use".** It is
returned for a crashing roof *and* for a reported absence, on
purpose: both are the absence of a usable value. A caller that must
distinguish them uses `peekUnder`, which crashes on the former and
produces mink's `%2` carrying a `%hunk` frame on the latter.
⟨`t-repl-peektry-none`, `t-roof-shape-absent`⟩

**R-28 · Prefer the explicit shape.** Two spellings reaching one
meaning is what this language does not do, and the lift survives
only because it is `+mill`'s general coercion rather than
roof-specific code. New roofs answer `T??`; the lift is a
convenience for a roof that only ever answers.
⟨`t-roof-shape-answer`⟩

**R-29 · A BLOCKING roof loses its tone under `kick`, and `kick` is
the outlier.** A roof answering `none` should make `+mink` return
`[%1 path]` as a value. Measured three ways on one expression,
`?:(?=([%1 *] (mink [[0 0] [12 [1 0] [0 2]]] |=(^ ~))) 8 9)`:

| implementation | result |
|---|---|
| Vere 4.6, `urbit eval` | `8` ✓ |
| NockVM, `jet_mink` direct (unit test) | `[%1 path]` ✓ |
| `kick`, trap built by honk **or** hoonc | `[1 0]` ✗ |

Under `kick` the tone becomes the program's product and the `?:`
never runs, at exit 0 — it is not reporting a crash. It is specific
to `%1`: the same driver gets `%0` and `%2` right. Ruled out: the
compiler (honk and hoonc produce byte-identical products here),
`kick`'s dispatch mode (reproduced on three builds including a
pre-`Exact` one), and `jet_mink` itself (`util::mink` converts
`Error::ScryBlocked` to `Ok([%1 path])`, and a direct unit test of
that passes — NockVM has no test for this case today, which is
how it stayed invisible). The reproduction, the ruled-out list and
a lead are in
[`docs/record/scry-block-escape.md`](../record/scry-block-escape.md),
drafted for nockchain.

Answer and absence are unaffected and verified. **Block is
therefore not usable from Jock**, which costs an in-code roof
nothing — the caller supplied the namespace, so "ask again with
more in scope" has no meaning for it — and is the one thing the
*runtime* roof (jock#73) would need. ⟨`t-roof-shape-absent`⟩

**R-30 · This section's signatures were always right.** `roft` has
returned `un2` since it was written and the frozen `+harms` mug is
unchanged, which is why adopting `T??` on the surface was a
one-token change to `trait Roof` plus the `peekUnder`/`peekTry`
wrapper annotation, with no re-bless. Tracked as jock#52; jock#73,
the *runtime* roof for bare `peekContext`, is a separate problem
and is not closed by it. ⟨`t-fabi-frozen`⟩

**R-102 · A named `func` cannot be a lifted roof, though an
identical `lambda` can.** The lift is a checking-mode coercion on a
lambda *body*; a named func's return type is already fixed, and
gate-return nesting is covariant, so `-> *` does not nest under
`un2` and the call refuses `%mill-nest`. A named func declared
`-> *??` is accepted, which is the shape to prefer anyway (R-28).
⟨`t-roof-named-func`⟩

### 4.2 Embedded formulas (not imports, still ABI)

**R-31 · Exactly ONE formula enters artifacts outside the import
path: `(sane %tas)`**, embedded by the `%term` mold check
(`+mtst:mold`). That is the deliberate call-Hoon's-own decision
(types.md S3.4) — a second implementation of the term grammar would
be a correctness bug at the boundary it guards. It is held still by
the toolchain pin today and joins the hash-diff protocol with wilt
(R-6). ⟨`t-nest-term-sat-p`, `t-nest-term-sat-n`, `t-lex-term-p`⟩

**R-32 · Nothing else embeds raw library code.** The `as!`/`as?`
wrappers and `%type-test` are compiler-authored control flow, and the
`print` hint rides the imported `trip`.
⟨`t-run-asx-mold`, `t-jimp-print`⟩

**R-33 · A curated wrapper closes over the substrate gate**, so the
jetted formula fires inside it. `crip`, `trip` and `mug` import
unwrapped. ⟨`t-text-chars-2`, `t-text-mug`⟩

**R-34 · The `rd` wrappers pin rounding `%n` EXPLICITLY**, never the
door's bunt. This was found the hard way: the bunt truncates, and
`3.14` came out wrong until it was pinned.
⟨`t-text-real`, `t-text-real-typ`, `t-text-radd`⟩

**R-35 · `Show` is interpolation's renderer**,
`trait Show { show(self: Self) -> String; }` in the prelude, with
impls for `String`, `@`, `Bool`, `Byte`, `Int` and `Float64`. The `@`
renderer is pure Jock — `shwgo` digit recursion over the pinned
`crip`; `Int` renders with an explicit sign; `Float64` renders
through `er-showreal`, the Errol3 implementation. Atom-headed impls
make the primitive impls ordinary, and a user type opts in with
`impl Show for T`. ⟨`t-text-interp`, `t-text-interp-bool`,
`t-text-interp-user`, `t-text-interp-zero`, `t-sint-show`⟩

**R-36 · A dispatch head key normalizes the bare-number literal aura
to plain `@`** (`+akey`) — the aura-join rule applied to dispatch, so
a literal receiver finds the impl its widened self would find.
⟨`t-text-interp-zero`, `t-join-sing-p`⟩

**R-37 · The collection and string arms are FFI as a BOOTSTRAPPING
POSTURE, not an endpoint.** Jock-native ports replace them when the
wilt and jetting story lands — the algorithmic scaling of interpreted
treap walks is the gate (`jetting-memo.md` layer 3) — and the
forall-import machinery of R-21 makes each arm's retirement
independent. ⟨none — UNPINNED⟩

## 5. The NockApp kernel ABI

Pinned against `crates/nockapp` at the toolchain pin
(`vendor/TOOLCHAIN.txt`).

**R-90 · The runtime's invocation is NORMATIVE** (`src/noun/ops.rs`):

    slam(arvo, axis, ovo):
      subject  [arvo ovo]
      formula  [8 [9 axis [0 2]] [9 2 [10 [6 [0 7]] [0 2]]]]

Pull the arm at `axis` of the kernel core — the arm must PRODUCE A
GATE — then fire that gate with sample `ovo`. `+kslam:jock`
reproduces this verbatim, for drivers and for the `%kern`, `%kimp`,
`%kfx` and `%kup` corpus judgments.
⟨`t-kern-batt`, `t-kern-three`, `t-kern-load`⟩

**R-91 · The four axes are 4, 22, 23 and 6** (`src/kernel/form.rs`):

| axis | role |
|---|---|
| 4 | `load` — upgrade hook: gate over the old kernel noun |
| 22 | `peek` — gate over the read request; product is the result |
| 23 | `poke` — gate over the event; product is `[effects new-kernel]` |
| 6 | state — the runtime checkpoints `+6` of the kernel |

⟨`t-kern-batt`, `t-kern-full-peek`, `t-kern-full-poke`⟩

**R-92 · A kernel program's VALUE is the quad.** It is an ordinary
Jock program producing

    (poke-gate, peek-gate, load-gate, initial-state)

with `poke : (State, *) -> (List<E>, State)`,
`peek : (State, *) -> *` and `load : (State, *) -> State`. Classes
are the idiomatic source of the gates — methods closed over by
lambdas — and the compiler does not care.
⟨`t-kern-shape`, `t-kern-three`⟩

**R-93 · `+kernel:jock` checks the quad's type shape, evaluates it,
and wraps it in the adapter:**

    K = [kbatt [state [poke-gate [peek-gate load-gate]]]]

`kbatt` is fixed generated Nock (`+kbatt:jock`). State sits at axis
6, the checkpoint axis; the three arms are closure-builders
(`[[1 g] [1 0] [0 1]]`, the types.md S9.8 pattern) whose gates close
over K. ⟨`t-kern-batt`⟩

**R-94 · State threads BY CONSTRUCTION.** The poke gate fires the
user gate with `[state event]` and rebuilds
`[effects [kbatt [state' gates]]]` from its own closure, so the
kernel is self-contained — the class suite lives inside the user
gates' contexts. ⟨`t-kern-fx`, `t-kern-fx-res`⟩

**R-95 · `load`, the serf Import path, fires the USER's load gate.**
The arm receives the OLD kernel's exported state as its sample, fires
`load-gate` with `[fresh-state old-noun]`, and rebuilds the COMPLETE
new arvo around the product, `[kbatt [migrated [gates]]]`. The `as!`
idiom covers the same-shape case as a mold-checked adoption; a shape
change is an ordinary Jock function of the old noun.
⟨`t-kern-load`, `t-kern-up`⟩

**R-96 · The gate axes against `g = [gbatt [ovo K]]`** are `ovo` 6,
`kbatt` 14, `st` 30, `pokeg` 62, `peekg` 126 and `loadg` 127 —
doubling under the result push. `tools/kern.sh` emits a bootable
kernel jam from them. ⟨`t-kern-batt`; lane `tools/kern.sh`⟩

**R-97 · The trait-shaped surface ALREADY EXISTS as ordinary
syntax** —
`class Agent(State) impl Kernel<E> { load(…) … peek(…) … poke(…) … }`
— which is how `examples/webserver.jock`, `http-counter.jock` and
`minesweeper.jock` are written. What is pending is trait-directed
**emission**: lowering such a class directly to this core instead of
through the synthesized quad (types.md S9.8's observation). The
adapter shape and axes above are the contract either way.
⟨`t-kern-trait`, `t-run-class-trait`; lane `tools/examples.sh`⟩

### 5.1 The http driver's wire

**R-98 · Requests arrive as pokes on wire `[http req]`**, the cause
inside the arvo ovum (`crates/nockapp/src/drivers/http`):

    [%req id=@ uri=@t method=@t
          headers=(list [k=@t v=@t]) body=(unit octs)]

`id` is a driver-side counter matching the response to the waiting
connection; `uri` and `method` are cords; and the body unit's octs is
`[len=@ dat=@]`. ⟨none — UNPINNED⟩

**R-99 · The kernel answers with `http.Effect.res` carrying the same
`id`** (R-83). The driver maps `status` onto the real HTTP status
line, replays `headers`, and writes the body bytes.
⟨`t-kern-fx-res`, `t-kern-fx-resb`⟩

**R-100 · The kernel-side idiom is a MIRROR STRUCT over the cause** —
`HttpReq { tag, id, uri: String, method: String, headers, body:
Octs? }`, mold dispatch, with `tag === 'req'` because the tas and the
cord are the same atom — routing on the uri, and
`Octs( len: bod.len(), dat: bod as! @ )` with the some-construction
`o as? Octs` for the body.
⟨lane `tools/examples.sh`; `t-run-asq-noun`⟩

**R-101 · Four driver behaviours ride for free.** A GET response
caches by URI, so a repeated GET may not re-poke the kernel;
`WEB_DIR` serves statics; `HTTP_PORT` binds locally, default 8080;
and the ACME path turns real domains into TLS.
`examples/webserver.jock` and `drivers/webserve/jock_serve.rs` are
the living pair, curl-verified end to end — page, state threading
across requests, and a 404 status honored.
⟨lane `tools/examples.sh`⟩

## 6. Strings, Byte, Path

**R-38 · `String` is a data nominal over the UTF-8 CORD** — the
compact form — and `List<Byte>` is the processing form, a Hoon `tape`
byte for byte. The Hoon-compatible List erasure makes `trip`'s
product a `List<Byte>` value by construction, and `crip`/`trip`
convert. ⟨`t-text-bytes`, `t-text-chars-2`⟩

**R-39 · String methods come from the prelude's `Str` trait** —
`len`, `cat`, `bytes`, `chars`, `starts-with`, `ends-with`,
`contains`, `find`, `split`, `replace`, `trim` — and are
**method-only**: no string operators until operator overloading,
much later. ⟨`t-text-len`, `t-str-startw`, `t-str-startw-n`,
`t-text-op-cat`⟩

**R-40 · The named operations are UNIT-FREE, and get to be.**
`contains`, `starts-with`, `ends-with`, `split`, `replace` and `trim`
are implemented on **bytes** and are nonetheless correct for scalars,
with no decoding, because **UTF-8 is self-synchronizing**: lead bytes
(`0x00`–`0x7F`, `0xC0`–`0xFF`) and continuation bytes
(`0x80`–`0xBF`) occupy **disjoint** ranges, so a valid UTF-8 needle
can never match starting inside a scalar. Every byte-level match is
therefore already scalar-aligned at both ends. `trim` strips ASCII
space, tab, LF and CR, all below `0x80`, so it is safe for the same
reason.

| operation | answers |
|---|---|
| `s.contains(t)` / `s.starts-with(t)` / `s.ends-with(t)` | `Bool` |
| `s.split(sep)` | `List<String>` — leftmost, non-overlapping |
| `s.replace(from, to)` | `String` — leftmost, non-overlapping |
| `s.trim()` | `String` |
| `join(ps, sep)` | `String` — **inverts `split`** for non-empty `sep` |

⟨`t-text-split-piece`, `t-text-split-overlap`, `t-text-replace`,
`t-text-replace-overlap`, `t-text-trim`, `t-text-trim-all`,
`t-text-join-round`⟩

**R-41 · An empty separator or pattern CRASHES**, in `split` and
`replace`. The guard is load-bearing, not a courtesy: an empty
pattern matches at every position and consumes nothing, so the walk
would not terminate. `contains("")` is `true` and does *not* crash,
which is not in tension — a predicate on the empty needle has an
obvious answer, a partition by it does not.
⟨`t-text-split-empty-sep`, `t-text-replace-empty-pat`,
`t-text-join-empty`⟩

**R-42 · `find` is the exception, because an INDEX CARRIES A UNIT.**
`s.find(t)` answers a **byte** offset, which is the unit `s.len()`
already answers in, so the two agree. A scalar offset belongs to the
scalar view: `s.chars().find(t.chars())`, through the `Find` trait
(`impl<T> Find for List<T>`, comparing with `===` so it needs no `Eq`
bound). As with slicing, the unit is the *view's* and nothing guesses
on the caller's behalf — on `"héllo"`, `chars().find` answers 2 and
`bytes().find` answers 3, and both are right.
⟨`t-text-find-str`, `t-text-find-byte`, `t-text-find-scalar`,
`t-text-find-list`, `t-text-find-miss`, `t-text-find-list-empty`⟩

**R-43 · A String has TWO VIEWS and neither is the default.** One
cord answers two different questions:

| view | product | what it is |
|---|---|---|
| `s.bytes()` | `List<Byte>` | the **storage** view — a Hoon `tape` |
| `s.chars()` | `List<UniChar>` | the **scalar** view — UTF-8 decoded |

`len()` is **bytes** and always was; the scalar count is
`s.chars().len()`. Coming back, `hoon.crip` inverts `bytes()` and the
prelude's `utf8` inverts `chars()`. ⟨`t-text-bytes`,
`t-text-chars-len`, `t-text-chars-slice`, `t-text-utf8-round`,
`t-text-utf8-enc`⟩

**R-44 · `s as List<UniChar>` is REFUSED, `%mint-cast`, and must
be.** A `String` erases to an atom and a `List` to a cell, so the
erasures genuinely differ; `as` emits nothing and therefore cannot
decode UTF-8. `chars()` is the named operation that can, and naming
it puts its cost where a reader sees it — the "nothing converts
silently" rule (types.md S14.6) applied to its own representation.
⟨`t-err-chars-cast`⟩

**R-45 · The decoder is PURE JOCK in the prelude** (`uc-*`), not an
ABI append: the pinned `+harms` mug does not move, and a jet can be
added later without a re-blessing. ⟨`t-text-chars-3`,
`t-text-chars-4`⟩

**R-46 · Malformed input CRASHES** — a stray continuation byte, a
lead byte with no sequence, or a truncated tail is a loud failure,
not a replacement character. `UniChar`'s guard admits surrogates and
over-long forms, so those round-trip; excluding them would be a guard
change, not a decoder change.
⟨`t-text-chars-bad`, `t-arc-unichar-narrow`⟩

**R-47 · `Byte` is one byte, honestly**: the `%chars` aura guarded by
`%byte`, value under 256 (types.md S3.4's second guard). Enforcement
is the guard's — compile time for literals, so `'ab' ⇐ Byte` refuses
with a position, and `as!`-time for foreign data. Codepoints and
graphemes are a post-1.0 library concern.
⟨`t-nest-byte-term-n`, `t-nest-term-byte-n`, `t-join-sing-byte-p`⟩

**R-48 · `"…"` synthesizes `String` and `'…'` stays a general cord
literal.** The double-quoted form is the literal cast to the nominal,
and free, the unfolding being congruent. The single-quoted form is
the only spelling of a raw multi-byte cord, String being sealed, and
takes any length; the `Byte` *type* does the one-byte enforcement
where that is wanted. ⟨`t-text-strif-let`, `t-str-esc-utf8`,
`t-str-esc-bad`⟩

**R-49 · `Path` is a data nominal over list-of-`String`, with NO
KNOTS.** Segments are Strings; Hoon's `@ta` discipline was aura
bookkeeping and the nouns round-trip without it. `/a/b/c` desugars to
the `%null`-terminated segment chain, cast.
⟨`t-des-path`, `t-parse-path`, `t-text-path`⟩

**R-50 · UTF-8 through the honk lane is TRANSITIONAL.** honk is
correcting its codepoint-per-char tapes to UTF-8 bytes; until that
merges, non-ASCII string literals through that lane are unreliable
and stay out of the corpus. This spec pins byte semantics as
formula-truth and honk converges on merge (L-119 is the same
constraint seen from the lexer's side).
⟨lane `tools/gate.sh`; `t-str-esc-utf8`⟩

## 7. The operator table

This section is types.md S8.12's authority. The *grammar* — what binds
tighter than what, which spellings exist — is language.md L-38 to
L-45 and L-106 to L-119; this is where each spelling's target lives.

**R-51 · `%operator` and ordered `%compare` are KERNEL forms, and
mint routes on the LEFT operand's widened bar-type.**

| left operand | resolution |
|---|---|
| **numeric** aura (`%$`, `%number`, `%hex`) | the pinned kernel column below — a direct arm call, NOT overloadable (the fast path; every compiler-emitted `+` rides it). **BOTH operands must be numeric**, `%mint-op-aura` |
| `%real` | the ops registry → the prelude's `Add(Float64)` and friends, `r*` arms underneath |
| nominal head (struct/union/class/data) or NON-numeric aura (`%chars`, `%logical`, …) | the ops registry → trait-method dispatch (`+mmet`: class-inherent, impl-dictionary, generic-head). An impl gives the operator meaning; its absence refuses `%mint-op-impl` |
| bounded `%var` | the same synthesized method call; the `$bnd` dictionary route resolves it |

⟨`t-jimp-op-add`, `t-err-op-aura-char`, `t-err-op-aura-real`,
`t-jimp-op-nominal`, `t-pfeq-op-bound`⟩

**R-52 · The pinned `@` column is ten arms.** `+ - * / %` go to
`hoon.add sub mul div mod`; `< > <= >=` to `hoon.lth gth lte gte`.
⟨`t-runs-op`, `t-prec-mul`, `t-opeq-cmp`⟩

**R-53 · Two operators sit OUTSIDE the head-directed table.** `⊛` is
trait-only — no pinned column and no numeric meaning even on numeric
operands, so every head consults the ops registry (`trait Seq {
then(⊛); }` binds it or it refuses). `∈`/`in` is not an
ops-registry operator at all: it dispatches by TRAIT NAME, `Has`,
which is why the hook spelling `has(∈)` does not exist.
⟨`t-des-glyph-ast`, `t-trait-op-junk`, `t-hyg-in`, `t-text-mhas`⟩

**R-54 · `===`/`!==` are kernel `%same`** — raw noun identity, Nock
5, for ALL types, never overloadable. They are unoverloadable **by
construction**: the operator-binding grammar reads at most a
two-character comparator, so `r(===)` cannot be spelled in a trait at
all. Match arms and mold checks lean on this reading, which is
exactly why it stays reachable and unoverloadable.
⟨`t-des-same`, `t-des-nsame`, `t-eq-nsame`⟩

**R-55 · `==`/`!=` route through `Eq` when the head has an impl, and
otherwise mean what `===` means.** The absent impl is a DEFAULT, not
an error, and the asymmetry against `+` is deliberate: `+` has no
universal meaning, so a head without an `Add` impl is a mistake,
while `==` has one — structural identity — so a head without an `Eq`
impl gets it. This was measured before it was chosen: `==` compares
`List<@>`, user unions and `Byte` across the corpus and the examples,
so requiring impls would have been a redesign rather than a
migration. ⟨`t-eq-struct`, `t-eq-ne`, `t-err-op-ne`⟩

**R-56 · `!=` is itself UNBINDABLE**, being derived through `==`: a
separate binding could disagree with what it negates.
⟨`t-err-op-ne`⟩

**R-57 · `@rd` is the one head where raw identity is WRONG rather
than coarse, and it is wrong twice.** Nock 5 answers `NaN == NaN`
**true** — `0.0 / 0.0` yields the canonical qNaN, so two
independently computed NaNs share a bit pattern — and `+0.0 == -0.0`
**false**, their patterns differing. Both are backwards from IEEE.
The prelude's `impl Eq for Float64` is the whole behavioural
difference the `==`/`===` split buys, and it needs NO new pinned arm:
`a <= b and b <= a` is IEEE equality exactly, because `lte:rd` is
itself IEEE-correct on NaN and signed zero. "No fancy mathematics"
still cuts both ways; it just no longer cuts the wrong way in
silence. ⟨`t-eq-nan-ieee`, `t-eq-nan-raw`, `t-eq-zero-ieee`,
`t-eq-zero-raw`⟩

**R-58 · `**` and unary `-` stay RESERVED through 1.0**, refusing
loudly at desugar — neither is silence (language.md L-111, L-112).
`**` pends an exponentiation arm story: `pow` exists for `@` in the
substrate, but the column should land whole, Float64 included, and
`rd` has no `pow`. ⟨`t-des-op-unary`, `t-mint-op-unary`⟩

> The reason originally given for reserving unary `-` was that
> "Jock has no signed integers, so unary minus is meaningless on
> `@`". That premise has **expired**: `Int` is a type and the `s*`
> family is pinned (R-12, language.md L-6). The
> reservation has not been re-taken on other grounds, so what stands
> is the refusal, not the argument for it. One candidate argument
> survives — `-42` in operand position is already an Int literal
> (L-109), so a prefix operator would be a second spelling for it —
> but that is an observation, not a ruling, and it is recorded as
> such in `docs/record/runtime-arc.md`.

**R-59 · The pinned arms take bare `@`, so the column is GATED to
the numeric family and checks BOTH operands.** Without that gate it
silently misread every other aura: `'a' + 1` did integer arithmetic
on a Byte, and `2 + 1.5` read a float's bit pattern as an integer.
Every other head falls through to trait dispatch, and the raw layer
stays reachable — `hoon.add(x, y)` takes bare atoms and asks no
questions. ⟨`t-err-op-aura-char`, `t-err-op-aura-real`,
`t-text-op-at`⟩

**R-59a · The numeric returns stay `Nat`, and re-pinning them to
bare `@` is REJECTED — tried, measured, reverted 2026-10-28.** The
arms take bare `@` and return `Nat` (`%atom %number`), which reads
as an asymmetry and had a visible cost: `%gate` was invariant in the
return, so `let g: @ -> @ = hoon.dec` refused `%mill-nest` and no
numeric arm was usable as a *value*. The obvious repair is to re-pin
the four returns (`+harms`' `g2`, `dec`, `met`, `mug`) to `ta`, bare
`@`, making the signature symmetric.

**It breaks every mutable counter in the language.** `var b = 0`
widens to `Nat` (S4), so with `+` returning bare `@` the assignment
`b = b + 1` no longer nests and `var b = 0; loop { … b = b + 1 … }`
refuses `%mill-nest`. Measured on `t-text-loop` and by probe. The
`Nat` return is not decoration: the whole numeric lane is
`%number`-typed because that is what a literal widens to, and the
re-pin moves the mismatch rather than removing it.

It also exposes a **second writer**: `+tsyn` hardcodes its own
numeric-operator result type instead of reading the pinned return,
so the two disagree the moment one moves (`t-tsyn-agree-*` catches
it). Any future re-pin has to move both.

**The `Nat` return is a NARROWING, not a mirror**, and saying
otherwise was wrong when this rule was first written. Hoon's own
`+add` and `+dec` cast to `^- @`, not `@ud` — checked in
`vendor/hoon-138.hoon` — so the arms we pin as returning `Nat`
return a bare atom upstream. A read-the-Hoon-type reading of R-59
would therefore pin `@ -> @`, i.e. exactly the re-pin rejected
above. The narrowing is benign because `%number` carries **no
guard**: it asserts an aura, not a value property, so requirement G
does not bite. But it is an assertion, per S11.2, and it should be
read as one.

**This is Hoon's own `@`/`@ud` equivocation, inherited.** Hoon
arms return `@` while callers want `@ud`, and Hoon lives with it
because `+ut` nests gate payloads **covariantly** (types.md S5.1
N7's note says so). Jock's `nest` was invariant in the return, so
the same equivocation was fatal here and harmless there. N7 is
covariant in the return as of 2026-10-28, which makes every numeric
arm value-referenceable with the signatures unchanged — the ABI mug
untouched, no re-blessing. So the asymmetry was never in the
curation and never Jock's invention: it was in `nest`, and the fix
is the rule Hoon already had.
⟨`t-text-loop`, `t-nest-gate-ret-p`, `t-nest-gate-ret-n`⟩

**R-60 · Three consequences of R-59 worth stating.** `String`'s `Add`
is concatenation (`"foo" + "bar"`, and a `Byte` appends by N13, being
a one-byte String). `Byte` comparisons ride explicit prelude impls,
`Lt`/`Lte`/`Gt`/`Gte`. And `Byte + Byte` is deliberately **absent**:
the implied op-method signature is `(Self, Self) -> Self` and
concatenating two Chars yields a String, which needs associated types
(post-1.0) — the idioms are interpolation, `"{c}{d}"`, or
`c.show() + d.show()`. ⟨`t-text-op-cat`, `t-text-op-cat-char`,
`t-text-op-char-lt`, `t-text-op-char-gte`⟩

**R-61 · The op hook is PER-METHOD.** A trait method may bind one
operator and the operator rides the method, so
`trait Arithmetic { add(+); sub(-); }` is expressible and the
trait-name form `trait Add(+)` is retired — one spelling. A trait
batches exactly as its author chooses, and op-bound methods mix
freely with ordinary signed ones. They take the implied signature by
family (arithmetic `(Self, Self) -> Self`, comparison `-> Bool`),
never bind `==`/`!=`, and live only in unparameterized traits.
⟨`t-decl-op-gen`, `t-err-op-ne`, `t-op-amb-trait`⟩

**R-62 · Registration is ONE FACT PER OPERATOR** (`ops.def`), with
coherence by `%decl-op-rebind`, and `a + b` elaborates as `a.add(b)`
— so user impls, class conformance and the prelude's Float64 impls
are ONE mechanism. ⟨`t-err-op-rebind`, `t-jimp-op-nominal-meth`,
`t-text-op-user`⟩

**R-63 · The PRELUDE stays fine-grained — one operator per trait** —
for conformance ergonomics; batched constraints arrive as superclass
bounds (types.md S14). It claims `+ - * /` (Add/Sub/Mul/Div) and
`< <= > >=` (Lt/Lte/Gt/Gte) with Float64 impls. `%` is deliberately
unclaimed, there being no `mod:rd` in the substrate, so user code may
bind it. ⟨`t-err-op-rmod`, `t-text-op-user`⟩

**R-64 · An atom-headed impl is a GROUND impl keyed `'@'++aura`**
(`'@real'`) — no collision, since type names cannot start with `@`.
⟨`t-jimp-impl-prelude`, `t-text-op-at`⟩

**R-65 · `Bool` is a boot alias for the loobean aura** (true = 0)
guarded by `%loob`, value under 2 (types.md S3.4's third guard) — the
same discipline `Byte` gets from `%byte`. Without it every atom
inhabits `Bool`, `42 as! Bool` passes at the foreign boundary, and
the fault lands later at the `?:` with no connection to where the bad
value entered. Like `Byte`, `Bool` is reached by NAME through the
boot env; a bare `[%atom %logical ~]` written anywhere in the
compiler re-opens the hole. ⟨`t-nest-loob-sat-p`,
`t-nest-loob-sat-n`, `t-nest-guard-loob-n`, `t-as-grd-bool`⟩

**R-66 · A Float64 literal is `@rd`, digit-dot-digit, at most 15
digits**, constructed as one exact division — `+sun` is exact below
2^53, so the single `div:rd` rounding gives the correctly-rounded
result. ⟨`t-text-real`, `t-text-real-typ`, `t-lex-real-prec`⟩

**R-67 · Rounding is pinned `%n`, round-nearest, at EVERY site** —
wrappers and literal construction alike. Jock exposes no
rounding-mode surface. ⟨`t-text-radd`, `t-text-rdiv`⟩

**R-68 · Float64 operator spellings route through the prelude**, so
`1.5 + 2.25` goes to `Add(Float64)` and thence to `radd`. String rows
are deliberately absent, strings being method-only (R-39).
⟨`t-text-radd-op`, `t-text-rdiv-op`, `t-text-rlte-op`⟩

## 8. The Kernel traits

    trait Kernel<E> {
      load(self: Self, old: *) -> Self;
      peek(self: Self, p: *) -> *;
      poke(self: Self, e: *) -> (List<E>, Self);
    };

**R-69 · `Kernel<E>` is declared in the prelude and parameterized
over the EFFECT VOCABULARY.** The shape `load`/`peek`/`poke` is true
in every world Jock targets and the effect type is not, so fixing one
made every kernel's signature transitively name whatever the prelude
happened to carry. The vocabulary belongs to the drivers that own it,
so a kernel names what it answers with and the prelude names no
driver. ⟨`t-kern-trait`, `t-kern-fx`⟩

**R-70 · `+kernel` reads the effect argument off the class's impl
clause** (`+kgen`) and annotates the synthesized poke lambda with it.
`+kfin` builds SOURCE, so it needs the `tex` the author wrote rather
than the elaborated `typ` the impl fact carries. A class that names
`Kernel` unapplied, or not at all, refuses `%kernel-trait` there
rather than failing unrecognizably inside the re-mint — without an
argument there is no return type to write.
⟨`t-kern-trait`, `t-kern-batt`⟩

### FullKernel — the four-arm trait

    trait FullKernel<E> {
      load(self: Self, old: *) -> Self;
      peek(self: Self, p: *) -> *;
      poke(self: Self, e: *) -> (List<E>, Self);
      wish(self: Self, txt: *) -> *;
    };

**R-71 · `Kernel` and `FullKernel` are STANDALONE, not a
hierarchy** — an impl names one. `Kernel` keeps the shorter name
despite being the partial one, because every kernel that exists impls
it; a reader should not infer from the name that it is the whole
interface. ⟨`t-kern-full-poke`, `t-kern-three`⟩

**R-72 · Every adapter arm's sample is `*`, `wish` included**, and
deliberately not the `@` Arvo's own `+wish` takes. The adapter hands
an arm whatever the runtime passed and cannot narrow it, so the
author casts — `txt as! @`, the same idiom `e as! Event` uses on the
poke side. Typing this one arm from the foreign ABI broke that
symmetry, and the synthesized lambda could not nest `*` into it.
⟨`t-kern-full-wish`, `t-kern-full-peek`⟩

**R-73 · `+10` in the three-arm battery is `[0 0]`, a crash
formula.** It held the bare atom `0`, which is **not a formula at
all**, so the runtime's `u3n_nock_on(roc, u3x_at(10, roc))` met a
malformed arm rather than a refusal — a structural bug, not a missing
feature. `[0 0]` is a zero-axis read: well-formed, bails cleanly, no
provenance. A `%mean`-hinted refusal naming the trait would be better
diagnostics and needs a hint opcode in the `+kbatt` schema; that is
deferred, the structural defect having been the atom.
⟨`t-kern-zero`, `t-kern-zeroc`, `t-kern-nowish`⟩

**R-74 · Arity comes from the TRAIT, never from the shape.**
`+kshape` is a prefix check and cannot distinguish four gates from
three gates plus a cell state whose head is a gate — a real struct
shape (`struct Rule { run: Nail -> Edge }`), not a contrived one. So
`FullKernel` is reachable only through the class path, where `+kgen`
reads the trait name off the impl clause and nothing is inferred.
⟨`t-kern-shape`, `t-kern-full-poke`⟩

**R-75 · The explicit quad stays three-arm**, which costs little:
parameterizing `Kernel` removed the main reason explicit quads
existed, since a kernel whose effects are not `Effect` can now say so
(`impl Kernel<lull.Ovum>`) instead of escaping to a raw tuple.
⟨`t-kern-three`, `t-kern-fx`⟩

**R-76 · `+kbattf` is a SIBLING of `+kbatt`, not a parameter of
it.** Both are `^~` constants frozen as ABI nouns, and the `wishg`
schema leaf shifts every axis below it, so the two cannot share an
expansion whatever the spelling.
⟨`t-kern-batt`, `t-kern-full-poke`⟩

**R-77 · A poke/peek round trip CANNOT see the wish arm**, which is
why the corpus has a `%karm` judgment. `%kern` pokes then peeks,
which structurally cannot reach `+4` or `+10`. `%karm` fires one arm
by axis — `+kslam` already took one — and the wish row asserts
**n+1000**, a value that exists nowhere but the user's arm, so a pass
cannot be explained by the slot merely being well-formed.
⟨`t-kern-full-wish`, `t-kern-full-peek`, `t-kern-load`⟩

**R-78 · A generic bound may name only UNPARAMETERIZED traits**
(`%bound-ptrait`) — a real ABI fence, since a parameterized bound
needs instantiated dictionaries at the `$bnd` ABI. So `func<T:
Kernel>` is no longer writable. It was never used: one occurrence in
the whole tree, in a corpus row testing crossed dictionaries that
merely borrowed `Kernel` for its three methods. A kernel is a
whole-program artifact and being generic over kernels buys nothing.
⟨`t-err-bound-ptrait`, `t-jimp-bound-qual-ptrait`,
`t-err-class-ptrait`⟩

> **The fence will cost something real later.** `GallAgent` *is*
> used as a bound (`func<T: GallAgent> gallMount`), so
> parameterizing it over its card vocabulary — which the same purge
> wants — breaks `gallMount`. That is the customer for lifting
> `%bound-ptrait`, and it is worth knowing before the gall side is
> parameterized rather than after.

**R-79 · `load` is REQUIRED**, there being no default methods in
1.0. The trivial implementation is the one-line idiom `old as!
Self`-concrete, which mold-checks the foreign checkpoint at the
boundary and is better than blind adoption; a REAL migration
pattern-builds the new state from the old noun.
⟨`t-kern-load`, `t-kern-up`⟩

**R-80 · Trait order `load`/`peek`/`poke` aligns with the boot axes
4/22/23.** Dictionary order is trait order, so the eventual direct
lowering permutes nothing. ⟨`t-kern-batt`, `t-kern-three`⟩

### What may enter the prelude

**R-81 · The prelude carries only what is TRUE IN EVERY WORLD Jock
targets.** A name that identifies a driver, a vane, a chain or a wire
format belongs in a library. The test is forward-looking: *could this
name appear in a program running under a runtime that does not exist
yet?* If not, it is not prelude material. ⟨lane `tools/blessed.sh`;
`t-halo-blessed`, `t-halo-abi-moved`⟩

The prelude is grafted ahead of every program and is checkpointed
(`$pfix`), so it is the one layer that cannot be flavored per build —
a second prelude is a second checkpoint to build, pin and keep in
step.

**R-82 · A LIBRARY IS FREE to a program that does not import it**,
which is what makes R-81 cheap to obey. `+hlibs` resolves only the
transitive closure of the program's own imports (the laziness slice,
`docs/imports.md`), and `tools/kern.sh` scopes the embedded source
map to that same closure — so a NockApp pays nothing, neither compile
time nor jam bytes, for a vane library, and an Urbit app pays nothing
for a chain one. The prelude is the only layer where placement has an
unavoidable cost, which is why it is the only layer that needs a
rule. ⟨`t-jres-unimported`, `t-jdag-unimported`, `t-jres-transitive`⟩

**R-83 · The effect vocabulary belongs to the DRIVERS that own it,
one enum each.** `Effect` is no longer declared in the prelude; a
bare `Effect` refuses `%elab-unbound`.

| case | owner | the driver's noun |
|---|---|---|
| `exit(@)` | `lib/nockapp` | `[%exit code]` — drivers/exit.rs, `eq_bytes(b"exit")`, terminates with the code |
| `markdown(String)` | `lib/nockapp` | `[%markdown text]` — drivers/markdown.rs, the "print" of the nockapp world |
| `res((@, @, List<Header>, Octs?))` | `lib/http` | `[%res id status headers body]`, the http driver's own parse |
| `file((@, String, @))` | `lib/wallet` | `[%file path-tag path contents]` (chain.md §6.2) |
| `nockchain-grpc((@, *))` | `lib/wallet` | `[%nockchain-grpc %send-tx raw-tx]` |

⟨`t-kern-fx`, `t-kern-fx-res`, `t-kern-fx-resb`⟩

> How the prelude came to hold it is the instructive part: `Effect`
> gained `res`, then `file`, then `nockchain-grpc`, each by an
> individually reasonable ruling, none of which asked whether the
> prelude was the right home. The result was that `poke` returned
> `List<Effect>` and so every Jock kernel's signature transitively
> named Nockchain — the one unflavorable layer carrying a flavor.
> The Urbit side routed around it, `GallAgent` returning `List<*>`
> and juno's Arvo kernel needing the explicit-quad escape, which was
> the evidence that the fixed return was the wrong shape rather than
> a tight one.

**R-84 · `Octs` STAYS in the prelude.** It is a byte buffer — data,
not driver vocabulary — and it is one of the curated structs
`+mtypes` grafts so a module can name it in a type *declaration*,
which `lib/http` needs for its response body. `Roof` is the other
borderline case and goes the other way: it is the namespace
protocol, which `--nockchain` denies outright, so it is dead weight
in that flavor. ⟨`t-halo-blessed`, `t-jimp-mimp`⟩

**R-85 · THE CASE NAMES ARE WIRE FORMAT.** A Jock union erases to
`[tag payload]` and that noun IS what the pinned `crates/nockapp`
drivers scan, so renaming a case is a protocol change rather than a
refactor. String's erasure is its cord, so
`nockapp.Effect.markdown("bye")` is `[%markdown 'bye']` verbatim;
`res`'s tuple payload right-nests, so the effect noun is the
driver's parse exactly; and `nockchain-grpc` carries its hyphen
because the case name *is* the tag the driver matches on. Moving a
case between modules changes none of that — which is the point: the
vocabulary was always the driver's, and the prelude was only where
it happened to be written down.
⟨`t-kern-fx-res`, `t-kern-fx-resb`⟩

**R-86 · A kernel names what it ANSWERS WITH**, and may name more
than one driver. `impl Kernel<nockapp.Effect>` is the ordinary case;
where a kernel genuinely mixes drivers it takes an **untagged
union**, `impl Kernel<nockapp.Effect | wallet.Effect>`, which is
what the wallet kernel does — it prints, exits, writes files and
submits. That works without a composite enum because distinct head
tags are erasure-disjoint, so the union is discriminable by
construction (types.md S4, language.md L-94).
⟨`t-nest-orin-p`, `t-nest-oror-p`, `t-join-sub-or-cell-p`⟩

**R-87 · Corpus rows declare their OWN effect enum.** `vex-kern`'s
runner builds with an empty library map, so vector source cannot
import — and should not have to. Each row declares a local
`enum Fx { … }` with the case names it exercises, which pins the same
driver-facing noun, the erasure keying on the case name rather than
on the declaring module, while no longer coupling a kernel row to
whichever module owns the vocabulary this month.
⟨`t-kern-fx`, `t-kern-fx-res`⟩

**R-88 · The union is closed under THIS vocabulary per owner**: it
IS the supported driver surface. Remaining driver families (timer,
npc) and the http cache variants (`%htmx`, `%cache`, `%h-cache`)
extend their owner's enum when their payloads earn Jock types, by
the same ruling discipline. ⟨none — UNPINNED⟩

**R-89 · `+kernel`'s zero-ceremony mode synthesizes the quad**
(`+kwrap`), the load lambda included, so the user's `load` fires
from the adapter. ⟨`t-kern-batt`, `t-kern-load`, `t-kern-up`⟩
