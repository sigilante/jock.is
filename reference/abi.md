# The pinned ABI

What a Jock program can call: the arms the runtime pins, the traits the prelude declares, and who already implements them. Companion to [literals and names](/reference/literals/), which lists these names without saying what they are.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` in the compiler repo writes this page.
>
> channel `%rc` · commit `076324d` (sigilante/pre-rc-sweep) · corpus 1156 vectors · 2026-10-30

`docs/spec/runtime.md` is the authority for everything here. [R-9](/spec/runtime/#r-9) freezes the ABI through 1.0 with **append** as the one sanctioned change shape — a new arm enters at the END so every prior arm keeps its index, and a modification in place is not available because it would move an index that emitted code already depends on. [R-10](/spec/runtime/#r-10): the freeze rests on two pins, and only one is a mug.

## The pinned arms

37 rows, projected from `runtime.md` §4.1. Each names its signature and the corpus vectors that exercise it through Jock source — [R-11](/spec/runtime/#r-11) pins the pairing **behaviourally**, so a reorder in either table breaks a vector rather than passing quietly.

[R-12](/spec/runtime/#r-12) is the one to read twice: nineteen arms return `Nat`, not `@`. `Nat` sits *below* `Atom` in the aura order, so a declared `@` return would not flow into a `Nat` annotation and these do.

| label | signature | vectors | notes |
|---|---|---|---|
| `hoon.add` `sub` `mul` `div` `mod` | `(@, @) -> Nat` | ⟨`t-jimp-hoon`, `t-prec-mul`, `t-text-op-mixed`, `t-runs-op`, `t-diag-crash`⟩ | operator targets (§7) |
| `hoon.dec` | `@ -> Nat` | ⟨`t-abi-dec`, `t-cast-sint-out-deep`⟩ |  |
| `hoon.lth` `lte` `gth` `gte` | `(@, @) -> Bool` | ⟨`t-runs-op`, `t-opeq-cmp`, `t-text-op-char-lt`, `t-text-op-char-gte`⟩ | ordered comparisons (§7); the prelude `Lt`/`Lte`/`Gt`/`Gte` impls route here |
| `hoon.crip` | `LC -> Str` | ⟨`t-text-chars-2`, `t-text-chars-3`, `t-text-chars-bad`⟩ | tape → cord |
| `hoon.trip` | `Str -> LC` | ⟨`t-jimp-print`, `t-spot-print`, `t-text-glyph`⟩ | cord → tape (bytes); every `print` row rides it, the `%slog` clue being a tape |
| `hoon.cat` | `(Str, Str) -> Str` | ⟨`t-repl-str`, `t-text-op-cat`, `t-text-strif-let`⟩ | byte concat (curated `cat`-3 wrapper) |
| `hoon.met` | `@ -> Nat` | ⟨`t-text-len`, `t-text-bytes`⟩ | byte length (curated `met`-3 wrapper); reached through `impl Str for String`, so `Str.len` converts and the caller writes `hoon.met(self as! @)` |
| `hoon.mug` | `* -> Nat` | ⟨`t-text-mug`, `t-abi-mug-canon`⟩ | the collection hash (Map/Set, [S10.1](/spec/types/#s10.1)). `t-abi-mug-canon` is the treap-canonicity row: insertion order cannot show through a mug-placed treap |
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
| `hoon.lturn` | `forall A B. (List<A>, A -> B) -> List<B>` | ⟨`t-list-turn`, `t-list-turn-lambda`, `t-list-turn-retype`⟩ | `+turn` — slams only, so no wrapper ([R-14](/spec/runtime/#r-14)) |
| `hoon.lreel` | `forall A B. (List<A>, (A, B) -> B, B) -> B` | ⟨`t-list-reel`, `t-list-reel-empty`⟩ | `+reel` — **seeds the sample, so the wrapper builds its own gate** ([R-14](/spec/runtime/#r-14)) |
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

## The prelude traits

22 traits, read from `++prelude` in `lib/jock.hoon` — the source `+ripe` actually grafts, not a transcription of it. A trait whose method is spelled `add(+)` binds an operator; the rest are ordinary methods.

| Trait | Binders | Methods | Implemented for |
|---|---|---|---|
| `Str` | — | `len(self: Self) -> @` · `cat(self: Self, t: String) -> String` · `bytes(self: Self) -> List<Byte>` · `chars(self: Self) -> List<UniChar>` · `starts-with(self: Self, pre: String) -> Bool` · `ends-with(self: Self, suf: String) -> Bool` · `contains(self: Self, t: String) -> Bool` · `find(self: Self, t: String) -> @?` · `split(self: Self, sep: String) -> List<String>` · `replace(self: Self, from: String, to: String) -> Self` · `trim(self: Self) -> Self` | `String` |
| `Kernel` | `<E>` | `load(self: Self, old: *) -> Self` · `peek(self: Self, p: *) -> *` · `poke(self: Self, e: *) -> (List<E>, Self)` | — *(nothing in the prelude)* |
| `FullKernel` | `<E>` | `load(self: Self, old: *) -> Self` · `peek(self: Self, p: *) -> *` · `poke(self: Self, e: *) -> (List<E>, Self)` · `wish(self: Self, txt: *) -> *` | — *(nothing in the prelude)* |
| `Roof` | — | `answer(self: Self, r: *, p: *) -> *??` | — *(nothing in the prelude)* |
| `Meas` | — | `len(self: Self) -> @` | `List<T>` |
| `Has` | `<T>` | `has(self: Self, p: T) -> Bool` | `Map<K->V>` `Set<T>` |
| `Idx` | `<I, A>` | `at(self: Self, i: I) -> A` | `List<T>` `Map<K->V>` |
| `Put` | `<I, A>` | `put(self: Self, i: I, v: A) -> Self` | `List<T>` `Map<K->V>` |
| `Slice` | `<I>` | `slice(self: Self, a: I, b: I) -> Self` | `List<T>` |
| `Find` | — | `find(self: Self, sub: Self) -> @?` | `List<T>` |
| `Tap` | `<A>` | `tap(self: Self) -> List<A>` | `Map<K->V>` `Set<T>` |
| `Del` | `<I>` | `del(self: Self, i: I) -> Self` | `Map<K->V>` `Set<T>` |
| `Add` | — | `add(+)` | `Float64` `Int` `String` |
| `Sub` | — | `sub(-)` | `Float64` `Int` |
| `Mul` | — | `mul(*)` | `Float64` `Int` |
| `Div` | — | `div(/)` | `Float64` `Int` |
| `Lt` | — | `lt(<)` | `Byte` `Float64` `Int` |
| `Lte` | — | `lte(<=)` | `Byte` `Float64` `Int` |
| `Gt` | — | `gt(>)` | `Byte` `Float64` `Int` |
| `Gte` | — | `gte(>=)` | `Byte` `Float64` `Int` |
| `Eq` | — | `eq(==)` | `Float64` |
| `Show` | — | `show(self: Self) -> String` | `Bool` `Byte` `Float64` `Int` `String` |

3 declare no prelude impl: `Kernel` `FullKernel` `Roof`. `Add`, `Sub` and friends are not orphans by accident — the numeric column is a DIRECT arm call that never reaches a trait ([R-51](/spec/runtime/#r-51)), so the prelude binds them only where dispatch is needed, which is `Float64`, `Int`, `String` and `Byte`.

## How an operator resolves

`runtime.md` [R-51](/spec/runtime/#r-51). `%operator` and ordered `%compare` are KERNEL forms, and mint routes on the **left** operand's widened bar-type.

| left operand | resolution |
|---|---|
| **numeric** aura (`%$`, `%number`, `%hex`) | the pinned kernel column below — a direct arm call, NOT overloadable (the fast path; every compiler-emitted `+` rides it). **BOTH operands must be numeric**, `%mint-op-aura` |
| `%real` | the ops registry → the prelude's `Add(Float64)` and friends, `r*` arms underneath |
| nominal head (struct/union/class/data) or NON-numeric aura (`%chars`, `%logical`, …) | the ops registry → trait-method dispatch (`+mmet`: class-inherent, impl-dictionary, generic-head). An impl gives the operator meaning; its absence refuses `%mint-op-impl` |
| bounded `%var` | the same synthesized method call; the `$bnd` dictionary route resolves it |

## Jet status ([R-5](/spec/runtime/#r-5)’s sixth field)

Not per arm, and it cannot be. Every arm above lives in `hoon`, the one library that is hot **by construction**: `+hoonlib` builds it by evaluating in-process, so its arms are the substrate’s own kernel gates and the NockVM hot state matches them by formula identity. What varies is whether anything **registers**, and that is a property of the artifact you ship, not of the arm you call.

| shipping shape | gate | the ABI core | effective | pinned by |
|---|---|---|---|---|
| `kernel` | `%live` | `hoon` is `%hot` | **hot** | `t-jres-bare` |
| `sealed` | `%dead` | `hoon` is `%hot` | **cold** | `t-jres-sealed` |

So the same call is jetted in a kernel or value artifact and interpreted in a sealed one — `%fast` registration fires only while a trap evaluates, and a sealed artifact is a constant trap. This is the sealed-kernel finding stated as a predicate; `tools/jets.sh` answers it per program, and `jockc.sh jets` is the same lane.

Call sites are attributed individually — `hoon.add(20, 22)` reports `hoon`/`add`/`%hot` at 1:1 ⟨`t-jres-site-hot`⟩ — so the question "will the code I wrote hit jets in the artifact I am about to ship" has a build-time answer rather than a deployment surprise.

## What this page does not yet carry

The per-arm record format ([R-5](/spec/runtime/#r-5)) asks for six fields — label, formula hash, mask, signature, vectors, jet status. The §4.1 table carries **three** of them: label, signature and vectors. Its fourth column, `notes`, is not an [R-5](/spec/runtime/#r-5) field, and this page counted it as one and claimed four of six until 2026-10-27. Jet status is the section above, which makes it four for real.

The two that remain are **formula hash** and **mask**, and neither is withheld for want of a table. A formula hash needs the [R-6](/spec/runtime/#r-6) hash-diff protocol to pin a hash *per arm* — `tools/jets-lane.sh` diffs the stdlib’s hashes in bulk, which catches drift without ever naming which arm moved. The `%wild` mask needs the `$sock` cape, whose emission is the paused half of UIP-0122: the molds and the builder exist and pass, and the `%hintd` emission waits on runtime co-design. Both are tool work, not documentation work, and this page will carry them when the tools answer.
