# The chain library: blocks, transactions, and kernels for nockchain

**Status: NORMATIVE for the Jock-side types and kernels.** The
*format* authority is nockchain's `tx-engine` at the pinned snapshot
(§3) — where this document and the snapshot disagree, the snapshot
wins and this document has a bug.

This document carries no chronology. The phase history, the surveys
it rests on, and the questions that were resolved to produce these
rules are [`docs/record/chain-arc.md`](../record/chain-arc.md);
what is still ahead is `docs/ROADMAP.md`.

Rules carry flat `C-n` ids, append-only. Each names what pins it —
a corpus vector, or the lane that checks it, since most of this
document's claims are about agreement with a vendored artifact and
no corpus row can hold that. A rule with neither says
`⟨none — UNPINNED⟩` so the gap is countable.

## 1. Posture: representations and calls

**C-1 · A Jock kernel is a PURE STATE MACHINE at the NockApp driver
boundary.** Drivers own the world — gRPC, files, network, clocks.
This library owns **representations**, the chain types as Jock types
constructed and validated in-kernel, and **calls**, effects
requesting driver actions and pokes receiving driver-delivered data.
Nothing in Jock fetches, connects or persists.
⟨`t-kern-fx`, `t-kern-fx-res`; lane `tools/chain-e2e.sh`⟩

**C-2 · INBOUND: a watcher kernel never asks for blocks; a driver
pokes them in.** The precedent is the wallet's
`update-balance-grpc` poke — the kernel is *told* the chain view the
driver chose to share, and never derives its own.
⟨lane `tools/wallet.sh`⟩

**C-3 · OUTBOUND: the driver effect enums are the call
vocabulary** — `nockapp.Effect` for `exit` and `markdown`,
`wallet.Effect` for `file` and `nockchain-grpc` (runtime.md R-83).
Each case's erasure matches a shipped driver's scan exactly, union
erasure being the tagged-cell convention and therefore free.
⟨`t-kern-fx`, `t-kern-fx-res`, `t-kern-fx-resb`⟩

**C-4 · SERVED: the signer kernel is a driver making calls to US.**
`KernelSigner` pokes `create-tx` and we answer with an effect list,
via `poke_timeout` — one poke in, complete effects out, which is
exactly the kernel model, with no run-loop and no `%exit` handling
on either side. ⟨lane `tools/signer.sh`⟩

**C-5 · The ONLY imports rather than representations are crypto and
chain-container primitives** (§5) — computation, not I/O.
⟨`t-cimp-nest`, `t-cimp-annot`⟩

## 2. Phases and what each one owns

The phase *history* — when each landed, what was proven, and the
findings that narrowed them — is
[`docs/record/chain-arc.md`](../record/chain-arc.md); what is still
ahead is `docs/ROADMAP.md`. The rules here are the scope boundaries
themselves, which are normative because they say which document
owns a given claim.

**C-11 · The PACKAGE is the delivery mechanism, not the boot
surface.** `pkg/chain-core.hoon` is the curated core — z-ops, tip5's
hash arms, and `to-b58` mirroring the engine's own composition
verbatim — `tools/pkg.sh` builds `chain.jam`, and `libs.py`'s
`*.jam` pattern supplies it. A noun digest IS `Hash`'s erasure, so
the hash wrappers are pass-throughs.
⟨`t-cimp-nest`, `t-cimp-annot`, `t-cimp-seal`; lane `tools/pkg.sh`⟩

**C-12 · PHASE 1 owns the read-only surface**: Jock types for
`page`/`local-page`, `block-id`, `coinbase-split` and the tx-id set;
a watcher kernel whose state is the two-map store the node itself
uses; pokes delivering blocks and txs; peeks for height, tip and
summaries; and `nockapp.Effect.markdown` summaries out. No crypto
beyond hash display and optional digest re-verification.
⟨lane `tools/examples.sh`; lane `tools/watch.sh`⟩

**C-13 · A BLOCK COMMITS TX IDS ONLY, never bodies**, which is why
the store is two maps and not one: rendering a block requires the
second lookup and there is no shortcut. ⟨lane `tools/molds.sh`⟩

**C-14 · PHASE 2 owns construction**: the full tx mold family (§4),
seed/spend/raw-tx construction in Jock, IDs computed through the
pinned hash arms, and the fixture corpus (§7) proving
noun-identical results against `tx-engine` itself.
⟨lane `tools/molds.sh`⟩

**C-15 · PHASE 3 owns the SIGNING PATH ONLY.** A Jock wallet kernel
accepts a key, accepts a `create-tx` cause, signs, and emits the
signed envelope — serving that slice of the wallet contract (§6.2)
exactly. Key DERIVATION is phase 4. ⟨lane `tools/signer.sh`⟩

**C-16 · "Drop-in with zero Rust-side changes" is retained as the
EVENTUAL claim and is NOT phase 3's exit condition.** It is roughly
the size of phases 1 and 2 combined: the stock wallet is ~4,800
lines of Hoon (`wallet.hoon` 2,289, `utils` 1,160, `types` 680,
`tx-builder` 595, `s10` 56) over a ~35-variant cause union, plus
`/common/bip39` and `/common/slip10`. ⟨none — UNPINNED⟩

**C-17 · Substitution is a FILE SWAP.** The harness that can gate a
lane is `crates/nockchain-wallet/src/tests.rs`, which boots
`kernels_open_wallet::KERNEL` =
`include_bytes!(env!("WALLET_JAM_PATH"))` → `assets/wal.jam`. The
`crates/tx-driver` crate — whose `KERNEL_SIGNER_SPEC.md` is the
document §6.2 was written from — lives on the `tx-driver` branch,
not master and not at the vendored anchor, so it cannot gate a lane
today. ⟨lane `tools/wallet.sh`⟩

> **The wallet suite is not a signer suite**, which is why passing
> it would demonstrate the signing format not at all. Of its 22
> kernel tests, 16 are active and 6 are `#[ignore]` stubs whose
> bodies are `// TODO` and `Ok(())` — and the ignored six are
> precisely the tx-shaped ones
> (`test_spend_single_sig_format`, `test_spend_multisig_format`,
> `test_make_tx_from_draft`, `test_show_tx`, `test_import_keys`).
> The 16 that run gate on key derivation, the planner, and the
> v0→v1 migration.
>
> `tx-driver` is where phase 4 should end up, and it answers the
> coverage gap §7 records: `sign.rs::validate_signed` checks a
> signed transaction against the plan that asked for it —
> signatures, inputs, outputs and fee — which is exactly the "does
> a Jock-emitted tx validate" test we do not have.

**C-18 · PHASE 4 owns key management**: `keygen` (argon2 entropy →
mnemonic), `import-seed-phrase` (bip39 `to-seed` → SLIP-10
`from-seed`), `derive-child`, the active-signers peek, and the
v0→v1 migration path. ⟨lane `tools/molds.sh`⟩

**C-19 · Phase 4 is SEPARABLE because `%import-keys` takes a raw
coil**, `[%0|%1 [key cc]]`. A signing key can be injected with no
derivation machinery at all, which is what lets phase 3 reach the
full signing path without any of phase 4. ⟨lane `tools/signer.sh`⟩

**C-20 · The derivation libraries are vendored at the same anchor
and validated the same way.** `bip39`, `bip39-english` and `slip10`
sit beside the format snapshot, and `zoon.hoon` at that rev was
re-hashed to the recorded `SNAPSHOT.txt` value before any of them
was trusted. The package carries four pass-through arms —
`toseed`, `fromseed`, `derivekey`, `mnemonic` — mirroring
`/apps/wallet/lib/s10`, which is app code and so is **not**
vendored; `lib/chainkey.jock` puts the molds back on as `Keyc`,
`Coil` and the derivation wrappers.
⟨lane `tools/molds.sh`; lane `ci:pins`⟩

**C-21 · HARDENING IS AN INDEX CONVENTION, not a flag.**
`+derive-child:utils` receives an index with 2^31 already added and
infers hardening from its magnitude. A wrapper that added the bit
twice, or not at all, would still produce a valid-looking key —
only the hardened/unhardened row pair catches it.
⟨lane `tools/molds.sh`⟩

**C-22 · The derivation fixtures use the WALLET SUITE'S OWN test
seed phrase**, so a divergence in them is a divergence from the
value the Rust tests would compute.
⟨lane `tools/molds.sh`⟩

## 3. The format snapshot

**C-6 · Four vendored files are the format authority**, pinned at a
nockchain commit with hashes in `vendor/SNAPSHOT.txt` and never
edited:

| file | what it carries |
|---|---|
| `hoon/common/tx-engine.hoon` (+ `-0`, `-1`) | molds and engine |
| `hoon/common/zoon.hoon` | `z-map`/`z-set`, TIP5-ordered treaps |
| `hoon/common/h-zoon.hoon` | the `h-map` family — digest-keyed node-state treaps, with distinct empty-leaf tags, **not** interchangeable with z-maps |
| `hoon/common/ztd/three.hoon` | `tip5`, `cheetah`/`belt-schnorr`, `merkle`, `bignum` |

⟨lane `tools/molds.sh`; lane `ci:pins`⟩

**C-7 · The source channel is Typhoon**, the Hoon package registry
for NockApp (sigilante/typhoon). The registry's `nockchain`
workspace is the provenance authority: its pinned ref names the
snapshot commit, and its package entries carry the dependency
closures — machine-derived from `/+`-header parsing, drift-checked
in the registry's own CI — that define the curated core's import
set. ⟨lane `ci:pins`⟩

**C-8 · A fetched file still lands in `vendor/` as a committed
copy** with `SNAPSHOT.txt` hashes, so the repo stays self-contained
and the frozen-never-edited rule holds. ⟨lane `ci:pins`⟩

**C-9 · A format upgrade is a PROCEDURE**: bump the registry ref,
refetch, rehash, re-run the fixture corpus, bless. It is not an
edit. ⟨lane `tools/molds.sh`; lane `ci:pins`⟩

**C-10 · Version ACTIVATION is height-gated, not wire-tagged.**
`v1-phase` 39.000, `bythos-phase` 54.000 and `asert-phase` 65.500
are defaults from `blockchain-constants`, which becomes a Jock
struct so tests can move the gates. ⟨none — UNPINNED⟩

## 4. Type mapping (normative table)

**C-23 · A Hoon `$%` tagged union maps to a Jock union ONLY where
the Hoon tags are ALPHABETIC.** A Jock union tags with the case name
as `@tas`, so `%leaf`/`%hash`/`%list` erase identically while
`spend`'s `%0`/`%1` do not — and `$tex` has no singleton spelling
(language.md L-93), so a field cannot be typed as the literal `1`
either. A numeric-tagged mold carries the tag as an ordinary leading
`version: @` field and is left un-joined.
⟨`t-cimp-match`, `t-cimp-nest`⟩

**C-24 · A Hoon `$^` head-shape union DOES have a Jock spelling.**
The judgment's cell side names head *shape* as well as head tags:
`pair`, where the head is a cell, is disjoint from `atom` and from
any tag set, so an untagged union of a struct-headed member and an
atom-headed one is admissible and its members are told apart at
runtime. This is what makes `page`, `nnote`, `local-page` and
`lock-merkle-proof` expressible.
⟨`t-nest-orin-p`, `t-nest-oror-p`, `t-join-sub-cell-or-p`,
`t-join-sub-or-cell-p`⟩

**C-25 · A ONE-FIELD struct erases to its field and is therefore
ATOM-HEADED**, so `$^` alternatives must differ in head shape at two
or more fields. This caveat survived both earlier readings of C-24
and is the part that bites.
⟨`t-join-sub-null-or-p`, `t-nest-orout-n`⟩

**C-26 · C-24 does not affect the transaction core**, which never
needed it: `raw-tx` v1 is a single version (`$: version=%1 id
spends`, not a dispatch at all) and `spend` is `$%`, so `Source`,
`Name`, `Seed`, `Seeds`, `Spend`, `Spends` and `RawTx` are all
expressible without it. ⟨lane `tools/molds.sh`⟩

**C-27 · `z-map`/`z-set` become boot data nominals `ZMap<K, V>` and
`ZSet<T>`** — the same treap *shape* as Map and Set, so reading by
data-unrolled match works identically, but **TIP5-hash-ordered**.
Construction goes through the pinned `z-*` arms over the vendored
zoon doors, NEVER through the mug-ordered `mput`/`sput` family.
⟨`t-cimp-nest`, `t-cimp-annot`; lane `tools/pkg.sh`⟩

**C-28 · The treap SHAPE is consensus-critical**, every container
hashing as its literal tree and IDs baking the shape in. So
Jock-native z-construction is deferred until the tip5 FFI story is
jetted — wrappers-first, on the Map/Set precedent (runtime.md
R-37). ⟨lane `tools/molds.sh`⟩

**C-29 · `hash` — which is also `block-id` and `tx-id` — is
`struct Hash { a: @, b: @, c: @, d: @, e: @ }`** of `%based`-guarded
belts: five Goldilocks field elements, under the guard the language
already has. A belt elsewhere is `@` with the same guard wherever
field-validity is an invariant, as in `note-data` leaves and hash
limbs. ⟨`t-as-grd-sub`, `t-nest-guard-wide-n`; lane
`tools/molds.sh`⟩

| tx-engine mold | Jock type | notes |
|---|---|---|
| `hash` / `block-id` / `tx-id` | `Hash` struct (5 based belts) | b58 display via pinned arms |
| `nname` `[hash hash ~]` | `struct Name { first: Hash, last: Hash }` + trailing null in erasure | the dead pact slot is FORMAT — erased as `[first last 0]` exactly |
| `source` | `struct Source { hash: Hash, coinbase: Bool }` | |
| `coins` / `page-number` | `@` | `nicks-per-nock = 2^16` |
| `sig` (v0) | `struct Sig { m: @, keys: ZSet<Pubkey> }` | v0 ownership; converts to a `%pkh` lock via the pinned arm |
| `lock-primitive` | `enum LockPrim { pkh(Pkh), tim(Tim), hax(ZSet<Hash>), brn }` | `%brn` is the padding/burn case |
| `pkh` | `struct Pkh { m: @, hashes: ZSet<Hash> }` | m-of-n by count over a hash set |
| `tim` | rel/abs page-number ranges (units) | `T?` maps Hoon units |
| `spend-condition` | `List<LockPrim>` | AND-clause |
| `lock` | `SpendCondition \| LockTree` where `LockTree = enum { two(…), four(…), eight(…), sixteen(…) }` | the OR-merkle tree; `%2`/`%4`/`%8`/`%16` tags |
| `witness` | struct: merkle proof, `ZMap<Hash, (Pubkey, Signature)>`, `ZMap<Hash, *>` preimages, tim = `~` | |
| `seed` (v1) | struct: `Source?`, `lock_root: Hash`, `NoteData`, `gift: @`, `parent: Hash` | two hash roles — identity vs sig (§5) |
| `nnote` v0 / v1 | `NoteV0 \| NoteV1` (untagged; v1 head `%1`) | `note-data = ZMap<@tas, *>`, leaves based-checked |
| `spend` | `enum Spend { v0(SpendV0), v1(SpendV1) }` | tagged `%0`/`%1` — one tx mixes both |
| `raw-tx` v0 / v1 | `RawTxV0 \| RawTxV1` | v1 = `[%1 id spends]`; id cached, always recomputed for trust |
| `input` / `output` / `outputs` | per the facade's tagged unions | outputs derived at acceptance, not wire |
| `timelock` family (v0) | structs of `PageNumber?` ranges + the non-degenerate refinement | refinement is a guard-style check arm, phase 2 |
| `coinbase-split` | `ZMap<Hash, @>` | the 80/20 fund carve post-asert |
| `page` v0 / v1 | `PageV0 \| PageV1` | fields in commitment order; `pow` is `Proof?`, treated as opaque `*` in phase 1 |
| `local-page` | like page, `pow: @?` (jammed) | the storage form a watcher is fed |
| `genesis-seal` / `genesis-template` / `page-msg` | small structs; `page-msg = List<@>` based | genesis parsing only |

**C-30 · `Name` keeps the dead pact slot as a zero `pad`**, so its
key noun erases `[first last 0]` on the wire. The slot is format,
not data. ⟨lane `tools/molds.sh`⟩

**C-31 · The tx id is DERIVED, not supplied** — content-addressed
from the spends. ⟨lane `tools/molds.sh`; lane
`tools/chain-e2e.sh`⟩

> **The fixture-parity boundary, phase 2 proper.** The real
> `compute-id` is `hash-hashable:tip5` over the spends' structured
> hashable DSL, which needs tip5 serialization arms the package
> does not yet export. So `hashnoun` gives a real, self-consistent
> content hash but **not the consensus id**, and `witness` stays
> `*` until phase-3 signatures. z-ordering is self-consistent, the
> put and has arms sharing the vendored z-doors, so membership is
> exact even where the absolute id is not.

**C-32 · Nesting works through `%mold-gen` on the imported
nominals**: a `ZSet<Seed>` lives inside a spend inside a `ZMap`
value. ⟨`t-cimp-nest`; lane `tools/examples.sh`⟩

**C-33 · Wallet-side molds enter at PHASE 3 with the same
treatment** — `order`, the `create-tx` cause 10-tuple, the
`transaction-1` envelope, and the witness-data maps.
⟨lane `tools/signer.sh`⟩

## 5. Hashing, serialization, and the FFI surface

**C-34 · WIRE IS JAM OF THE EXACT NOUN.** There is no custom byte
layout anywhere, and `size` is `(met 0 (jam n))`. Fixture-identical
therefore means noun-identical, which Jock's erasure discipline is
built for. ⟨`t-abi-jam`; lane `tools/molds.sh`⟩

**C-35 · IDENTITY IS THE TIP5 HASHABLE DSL, not the jam.** Every ID
composes `hash-noun-varlen` (noun → digest via leaf-sequence plus
Dyck word) and `hash-ten-cell` (digest pair → digest), with
domain-separating `leaf+%tag` siblings. ⟨lane `tools/molds.sh`⟩

**C-36 · A CONTAINER HASHES AS ITS LITERAL TREAP TREE**, which is
the load-bearing half of C-35 and the reason C-28 defers
Jock-native construction. ⟨lane `tools/molds.sh`⟩

**C-37 · SIGNING AND IDENTITY HASHING DIVERGE ON `seed`.**
`output-source` is excluded from identity, to break a cycle, and
included in what is signed. ⟨lane `tools/signer.sh`⟩

**C-38 · The chain arms do NOT join the prelude**, which stays the
universal hoon-138 surface (runtime.md R-81). They arrive as a
**library package**: a def-env fragment `[types + hlib]` — the
data-nominal registrations (`ZMap`, `ZSet`, `Hash`, later the tx
primitive layer) together with the import binding, which is the
compiled curated core over the vendored snapshot plus its pinned
signatures. ⟨`t-cimp-nest`, `t-cimp-annot`, `t-cimp-seal`⟩

**C-39 · TYPES TRAVEL WITH ARMS because the signatures reference
the nominals.** A package is precisely the piece of `def.env` a
library contributes, and `import chain;` resolves it exactly as
`import hoon;` does — `imports.def` was always plural.
⟨`t-cimp-annot`, `t-run-import-mix`⟩

**C-40 · A package is built by a dedicated tool and supplied via
`libs.cfg`.** Compile the curated core under the pinned toolchain,
pair it with the signature list, jam it; `+boot-env` merges it at
construction. The core compiler carries no chain code. This is the
module shape of `docs/imports.md` §8 — types.md records it under S14's
closed Jock-native-modules item, and S11.2 is the typing half —
instantiated for Hoon libraries first; Jock-compiled packages later
reuse the format with only the core's provenance changing. ⟨lane `tools/pkg.sh`; lane `ci:pins`⟩

**C-41 · The import story is a PHASE-1 PREREQUISITE**, the printer
needing tip5 digest verification and b58 display, and it raises the
stakes on closure slimming — an importing kernel embeds the package
core in its captured spine. ⟨lane `tools/watch.sh`⟩

**C-42 · The pinned arms are curated wrappers over the vendored
snapshot**, on the treap and `rd` pattern, with formula hashes
recorded per runtime.md R-5:

| family | arms |
|---|---|
| tip5 | `hash-noun-varlen`, `hash-ten-cell`, and per-mold conveniences as phases need them: `page-digest`, `page-commitment`, `raw-tx-id`, `sig-hash`, `name-first`/`-last`, `lock-root` |
| z-containers | `zput`/`zget`/`zhas`/`zdel`/`zkey` over `z-by`/`z-in`, forall-signed on the `mput` template — the ONLY legal constructors for `ZMap`/`ZSet` |
| b58 | `to-b58`/`from-b58`, for hash display and the pinned literals |
| schnorr (phase 3) | `sign`, `verify`, `batch-verify`, `pubkey-from-sk` over `belt-schnorr:cheetah` |
| jam/cue | already kernel arms; pinned spellings for the `local-page.pow` decode |

⟨lane `tools/pkg.sh`; lane `tools/molds.sh`⟩

**C-43 · The schnorr transcript is CODEBASE-SPECIFIC, not BIP-340**,
and is never reimplemented. ⟨lane `tools/signer.sh`⟩

**C-44 · READING a z-container is pure Jock** — a data-unrolled
match on the treap shape, ordering-blind — so the block printer
walks `tx-ids` and `coinbase-split` natively. Only *construction*
requires the pinned arms. ⟨`t-cimp-match`; lane
`tools/examples.sh`⟩

## 6. The kernels

### 6.1 The watcher (phase 1)

**C-45 · State mirrors the node's own two-map split** (C-13):

    struct WatchState {
      blocks: ZMap<Hash, LocalPage>,   // by block-id
      txs: ZMap<Hash, RawTx>,          // by tx-id
      tip: Hash?,                      // heaviest seen
    }

⟨lane `tools/watch.sh`; lane `tools/examples.sh`⟩

**C-46 · Each poke is a tagged union case, driver-delivered.**
`block(LocalPage)` verifies `check-digest` under optional strict
mode, stores, updates tip by accumulated-work comparison, and emits
a `markdown` summary; `tx(RawTx)` recomputes the id and stores.
Peeks are `height`, `tip` and `block(id)`. Effects are `markdown`
only. ⟨`t-kern-fx`; lane `tools/watch.sh`⟩

**C-47 · Pokes arrive ARVO-SHAPED and unwrap through an `Ovum`
mirror struct** — mold dispatch rather than axis arithmetic. Kernel
state holds the imported nominal, molded by `load`'s `as!` through
`%mold-gen`. ⟨`t-cimp-annot`, `t-kern-load`; lane
`tools/examples.sh`⟩

**C-48 · A match mixing quiet and effectful arms needs an annotated
empty list.** Arms mixing `(~, self)` with `([fx], st')` refuse
`%join-fail`; the quiet arms need
`let none: List<nockapp.Effect> = ~` to join. This is the `cons`/`fxs`
idiom (language.md L-94's `+join` rule seen from a kernel).
⟨`t-join-fail-n`, `t-join-sub-null-or-p`⟩

### 6.2 The signer (phase 3)

**C-49 · `lib/chaintx.jock` carries the witness family** —
`SchnorrPubkey`, `SchnorrSignature`, `Pkh`, `Tim`, `Hax`,
`LockPrimitive`, `SpendCondition`, `MerkProof`, `LockMerkleProof`,
`PkhSignature`, `Witness` — and every mold is checked against the
engine's own bunts. ⟨lane `tools/molds.sh`⟩

**C-50 · A Jock signer emits `%full` lock-merkle-proofs ONLY.**
`lock-merkle-proof` is a `$^` head-shape union — the stub's head a
cell, the full case's the atom `%full` — which Jock can spell
(C-24). A signer does not need to: it PRODUCES proofs rather than
accepting them, the engine's own bunt IS the `%full` case, and the
stub is the legacy shape whose hardcoded digest §7 preserves rather
than fixes. Only `%full` is declared; READING a stub proof needs the
head-shape judgment. ⟨lane `tools/molds.sh`⟩

**C-51 · Signing arms must be PASS-THROUGHS to the engine's
schnorr.** A hand-written signature scheme would be the one
unacceptable thing to put in this tree. ⟨lane `tools/signer.sh`⟩

**C-52 · A Jock signature is BYTE-IDENTICAL to the engine's for the
same `(sk, digest)`**, so signing is exact-equality testable and not
merely verify-testable: the schnorr nonce is
`hash-varlen(pubkey ‖ m ‖ sk)` — fully deterministic, no randomness.
⟨lane `tools/molds.sh`; lane `tools/signer.sh`⟩

**C-53 · The redaction discipline is that every String-producing arm
takes only types that cannot hold a key** — and it does NOT refuse a
leaking program. Rewrite a render arm to take the keyring and print
its secret and it compiles cleanly. What the discipline buys is that
a leak requires changing a SIGNATURE, a visible and reviewable edit,
rather than slipping into a body. The enforcement is the lane.
⟨lane `tools/signer.sh`⟩

**C-54 · The redaction adversary searches TWICE**: for the key as a
value, and for its decimal rendering as a substring, each with a
control row proving the search finds what it is looking for. One
search is not enough — interpolation renders an atom as decimal text
inside a cord, which a noun search cannot see.
⟨lane `tools/signer.sh`⟩

**C-55 · The v0 MIGRATION path is not implemented in Jock.** It is
legacy-only, a one-way sweep of pre-v1 notes, and a Jock signer that
never has to spend a v0 note never needs it. The version dispatch is
not the obstacle — the stock wallet chooses between `spend-0` and
`spend-1` with `?: (levy notes |=(=nnote ?=(^ -.nnote)))`, a cell
head meaning a v0 note, which is the head-shape test of C-24 and is
writable at runtime with `hoon.iscell`. The obstacle is the
construction. ⟨`t-abi-iscell-cell`; lane `tools/wallet.sh`⟩

**C-56 · The kernel builds `%1` spends UNCONDITIONALLY.** Handed an
all-v0 input set it would emit a v1 spend, which is **wrong rather
than refused** — the honest consequence of eliding C-55's path.
⟨lane `tools/wallet.sh`⟩

**C-57 · The state has FIVE FIELDS with the constants LAST**,
because the driver's constants peek reads AXIS 31 and a right-nested
five-tuple puts its last field there. A state-layout change reddens
the lane exactly as it would redden the wallet suite.
⟨lane `tools/signer.sh`⟩

**C-58 · The two key peeks compute what the stock wallet computes** —
`hash:schnorr-pubkey` of the point `ch-scal` derives from the active
secret — and the absent case REFUSES rather than answering a zero
hash, which would be a well-formed value meaning nothing.
⟨lane `tools/signer.sh`⟩

> **A row written against the implementation instead of against the
> engine proves only that the implementation is itself.**
> `/master-signing-key` and `/signing-keys` first shipped as
> placeholders, and `contract-peek-master-key` compared the kernel's
> placeholder against a hand-written copy of the same placeholder —
> green, and a test of nothing. Every other row in this lane and in
> `molds.sh` compares to a vendored arm; these two did not, and that
> is exactly why they passed while wrong.

**C-59 · The kernel serves five causes and four peeks.**
`examples/walletkernel.jock` serves `%import-keys`, `%fakenet`,
`%update-balance-grpc`, `%list-notes` and `%create-tx`; peeks
`%fakenet`, `%state`, `%signing-keys` and `%master-signing-key`; and
emits `[%file %write path jam]`, `%markdown` and `%exit`.
⟨lane `tools/wallet.sh`; lane `tools/signer.sh`⟩

**C-60 · `create-tx` builds its seeds from the cause's own orders
and binds NO PARENT HASH.** Parent-hash binding and lock
reconstruction are the planner's, which is phase 4 with key
derivation. The signature is correct for the spend it signs; giving
that spend the right inputs is the next phase's job, and the
kernel's markdown says so. ⟨lane `tools/signer.sh`⟩

## 7. Fixtures and vectors

**C-61 · EVERY FIXTURE CHECKS AGAINST THE VENDORED ENGINE ITSELF**,
building a value in Jock and the expected one in Hoon **typed by the
engine's own mold**, compared noun for noun. Four families are live
in `tools/molds.sh` — mold, id, treap-shape and quirk — and run per
push. ⟨lane `tools/molds.sh`; lane `ci:pins`⟩

**C-62 · AN EXPECTED VALUE IS THE ENGINE'S BUNT**: canonical,
shape-revealing, needing no constructor, and impossible to
transcribe wrongly by hand — which is the failure mode a
hand-written fixture has. A mold whose noun differs reports MOLD
MISMATCH, and one that stops compiling fails hard.
⟨lane `tools/molds.sh`⟩

**C-63 · MOLD-FIDELITY vectors are Jock-constructed values
noun-equal to tx-engine-constructed expected values**, computed IN
the harness by the vendored engine — the `mkey` pattern, where the
expected treap is built by the same door the wire uses.
⟨lane `tools/molds.sh`⟩

**C-64 · ID vectors compute digests by FUSING `hash-hashable:tip5`.**
The DSL is a description of a hash and every structure is known
where it is written, so each arm applies the reduction rules
directly instead of building a `$hashable` for an interpreter to
take apart. The reduction is compositional — a pair's digest is
`hash-ten-cell` of its parts' — so fusing arm by arm is sound, and
it means **no `Hashable` type is needed**.
⟨lane `tools/molds.sh`⟩

> What blocks declaring `Hashable` is no longer its `$^` case,
> which C-24 spells. It is the other half of that sentence, a
> separate limitation that outlives the first: **a recursive
> untagged union cannot be declared from source at all.**

**C-65 · A ZMAP NODE IS `[[key value] [left right]]` AND A ZSET NODE
`[element [left right]]`**, and the Jock `ZMap`/`ZSet` nominals
erase to exactly those — so the walks destructure the real treap
rather than a copy. ⟨`t-cimp-match`; lane `tools/molds.sh`⟩

**C-66 · `compute-id` agrees on an empty, a one-entry and a
TWO-ENTRY spends map.** The two-entry case is the one that matters:
swapping the walk's left and right recursion left the one-entry
fixtures green, a one-node treap having no left and right to swap.
⟨lane `tools/molds.sh`⟩

**C-67 · The two containers holding OPAQUE values hash through
`hoon.iscell`.** A seed's `note-data` and a witness's `hax` both
need `hashable-noun`, which walks an arbitrary noun and so needs a
runtime cell test. Jock had none — `?(e)` was cut (language.md
L-88) and `%cell-check` stayed compiler-internal — so the fix was an
ABI arm rather than a language change, `hoon.iscell` being how Jock
reaches every other substrate primitive. The surface ruling stands
untouched. ⟨`t-abi-iscell-cell`, `t-abi-iscell-atom`; lane
`tools/molds.sh`⟩

**C-68 · `page` v1 is a plain TWELVE-FIELD RECORD**, the `$^`
version dispatch living in the *combined* engine rather than in v1's
own core — so it can be declared and both of its hashes computed:
`hashBlockCommitment`, a nine-element hashable committing to neither
the page's own digest nor its pow, and `computeDigest`, which is the
block id. ⟨lane `tools/molds.sh`⟩

**C-69 · THE POW SLOT IS THE ONE THING JOCK DOES NOT COMPUTE, and
that is a decision.** `H(proof)` is `hash-proof`, which absorbs
STARK proof objects into a sponge. So the proof digest is an
*argument* to `computeDigest`, and the present-proof branch is
pinned by handing it one and checking the structure around it
against the engine's own hashable. A candidate page — the kind a
Jock program actually builds — has no proof and needs nothing.
Hashing a proof would be the only dishonest arm in the file.
⟨lane `tools/molds.sh`⟩

**C-70 · AN ATOM AT OR ABOVE THE OXFOI PRIME IS NOT A BELT** (2^64 −
2^32 + 1) and crashes the engine, so a fixture's leaves must stay
under it. ⟨`t-as-grd-sub`; lane `tools/molds.sh`⟩

**C-71 · TREAP-SHAPE vectors build the same containers in OPPOSITE
INSERTION ORDERS and compare NOUNS, not digests.** Ordering is
consensus. Deletion is included because that is where a treap
rebalances, and a rebalance that disagreed would still hash
consistently on each side while diverging from the wire; so are the
two idempotence claims — re-putting a key at its existing value,
deleting an absent one — and `zkey`. ⟨lane `tools/molds.sh`⟩

**C-72 · THE QUIRK LEDGER pins deliberate legacy rather than
design**, so a future upstream "fix" reddens the lane instead of
silently changing consensus. ⟨lane `tools/molds.sh`⟩

1. **The `nname` dead pact slot.** A name is `[first last ~]`; the
   third slot is the residue of a pact mechanism that no longer
   exists, is always `~`, and is still hashed. Jock carries it as
   `pad` rather than pretending a name is a pair (C-30).
2. **`lock-merkle-proof-stub`'s hardcoded legacy digest** —
   upstream's "standard library hash (stopgap for determinism)",
   preserved and never fixed. The sharp row is the axis-blindness:
   the Jock stub hash at axis **seven** equals the engine's at axis
   **one**, which is only true because the stub hashable does not
   commit to the axis at all — the defect the `%full` case exists
   to correct (C-50).
3. **The two fee-counting regimes around `bythos-phase`.** Below
   the activation height, base-fee is doubled, seed words are
   counted per-spend, and inputs pay undiscounted; at or above it,
   base-fee halves back, note-data merges by lock-root before
   counting, and inputs pay `1/input-fee-divisor`. The same spends
   map has two different minimum fees — 557.056 and 131.072 — and
   the boundary is exact: 53.999 is legacy, 54.000 is bythos.
4. **coinbase-split's two-round-then-dust remainder.** After two
   proportional rounds the leftover atoms go to the **first key in
   treap order**: 100 over three equal shares is 34/33/33, not
   33/33/33 with a coin lost; 7 is 3/2/2.
5. **The `$^` vs `$%` version-dispatch inconsistency**, one row per
   type. Three shapes coexist: `spend` dispatches on a numeric head
   tag (`$%`), `nnote` and `lock-merkle-proof` on the head's
   *shape* (`$^`), and `raw-tx` and `page` v1 do not dispatch at
   all, carrying a fixed version field.

**C-73 · A `$%` FORK BUNTS TO ITS MUG-FIRST CASE, not its
source-first one.** So `*spend` is the `%1` case though `%0` is
written first, and every fixture leaning on a `$%` bunt leans on
that. ⟨lane `tools/molds.sh`⟩

**C-74 · NOTHING YET PROVES AN EMITTED TRANSACTION IS THE ONE THAT
WAS PLANNED.** Everything here proves a signature is right for a
digest. The check this corpus most lacks is `tx-driver`'s
`validate_signed` — a signed transaction against the plan that
asked for it, covering signatures, inputs, outputs and fee
together — and it lives on a branch, not master (C-17).
⟨none — UNPINNED⟩

## 8. Resolved questions

The six questions this section used to carry as *open* all have
answers, written under them as sub-bullets. They are rules now; the
questions and their deliberation are in
[`docs/record/chain-arc.md`](../record/chain-arc.md).

**C-75 · The snapshot commit is a MASTER ANCESTOR, dated and
recorded**, picked at vendoring time rather than tracking a branch.
⟨lane `ci:pins`⟩

**C-76 · The printer reports PROOF PRESENCE ONLY.** `pow` stays
opaque — `*` or a jammed `@` — the proof is opaque to the kernel,
and the kernel never needs to know its size. Presence plus
bit-length would be free; STARK internals are out of scope
indefinitely. This changes when the kernel gains proof-support
capabilities; for now the printer is a read-only tool.
⟨lane `tools/watch.sh`⟩

**C-77 · `ZMap`/`ZSet` registration travels with the chain
package's def-env fragment, not the boot surface** (C-38).
⟨`t-cimp-nest`, `t-cimp-annot`⟩

> **The longer-term shape, ruled workable but not built.** Treap
> containers become instances of an ORDERING-PARAMETERIZED
> mechanism: the ordering pair `(gor, mor)` attaches to the nominal
> at declaration as a def-env fact — no dependent types, just
> declaration-time constants of noun type `(*, *) -> Bool` — and
> `put`/`get`/`del`/`key` derive from ONE shared treap algebra
> instantiated per nominal. `zoon.hoon` being Hoon's map code with
> the comparators swapped is the existence proof that one algebra
> serves both. Only the ordering functions, mug and tip5, stay FFI.
> Sequencing stays wrappers-first: pinned z-arms for phase 2, the
> mechanism as its own language slice, and the arms retire behind
> unchanged signatures.

**C-78 · The printer uses INTERPOLATION.** The question of whether
it would need cat-composition in v0 is moot: interpolation landed
before the question could bind. ⟨`t-text-interp`; lane
`tools/watch.sh`⟩

**C-79 · The watcher state uses `ZMap` for UNIFORMITY**, while the
node uses `h-map`s for digest keys. If fixture parity ever covers
node-state nouns, h-maps need their own nominals; until something
needs them, they have none. ⟨`t-cimp-nest`⟩

**C-80 · `file`'s payload is `(Path, @)`** — the path as our `Path`
nominal (language.md L-49), the jam as `@`.
⟨`t-kern-fx`; lane `tools/wallet.sh`⟩
