# lib/chaintx

the transaction mold family and its hashes (chain.md §4/S5).  Every mold is written so its erasure matches the vendored engine noun for noun, and every hash so it agrees with the engine's own arm;  tools/molds.sh checks both against the engine rather than against this comment.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` writes this from `crates/jockc/hoon/lib/chaintx.jock` and the examples that import it.
>
> 64 public declarations — 20 types, 44 arms. 23 pinned by a lane, 41 not. channel `%rc` · commit `15d64f3`

## Import

A module arrives by name and nothing in it is ambient. Every arm below is reached as `chaintx.<name>`.

```jock
import chaintx;
```

The name is the file name minus `.jock`: `chaintx` is `crates/jockc/hoon/lib/chaintx.jock`, and it is found because the directory holding it was passed as a `--data-dir`. There is no search path and no implicit import; `tools/libs.py` holds the whole discovery rule, and the compiler itself is a pure function of source and libraries.

## About

TYPES FIRST, then the funcs, and that order is load-bearing: +mdreg stubs only the LEADING run of declarations, so a struct cannot name a type declared after an intervening func (it refuses %elab-unbound).  Keeping the declarations together also keeps the funcs in ONE scope frame:  interleaving them costs 7-12% of every compile.

## Types

20 types. A type’s members ARE its interface, so each is shown whole rather than by name.

### `Source`

```jock
struct Source { hash: chain.Hash, coinbase: Bool };
```

No comment in the source. The signature above is the whole of what `Source` states about itself.

### `Name`

```jock
struct Name { first: chain.Hash, last: chain.Hash, pad: @ };
```

No comment in the source. The signature above is the whole of what `Name` states about itself.

*used by examples/walletkernel.jock*

```jock
func decodeName(n: B58Name) -> chaintx.Name {
```

### `Seed`

```jock
struct Seed { source: Source?, lockroot: chain.Hash, notedata: NoteData, gift: @, parent: chain.Hash, };
```

No comment in the source. The signature above is the whole of what `Seed` states about itself.

*used by examples/walletkernel.jock*

```jock
func orderSeed(o: LockRootOrder, zero: chain.Hash) -> chaintx.Seed {
```

### `SpendV0`

```jock
struct SpendV0 { version: @, signature: *, seeds: Seeds, fee: @ };
```

spend is $%([%0 spend-0] [%1 spend-1]) --- NUMERIC tags, which a Jock union cannot spell (it tags with the case name as @tas). So each version is its own struct with the tag as a leading field, and they are NOT joined:  v1 is the live shape and is what Spends carries;  v0 is declared for completeness.

### `SpendV1`

```jock
struct SpendV1 { version: @, witness: Witness, seeds: Seeds, fee: @ };
```

No comment in the source. The signature above is the whole of what `SpendV1` states about itself.

### `RawTx`

```jock
struct RawTx { version: @, id: chain.Hash, spends: Spends };
```

raw-tx v1 is a SINGLE version, not a dispatch:  [%1 id spends].

### `F6`

```jock
struct F6 { a: @, b: @, c: @, d: @, e: @, f: @ };
```

The witness family (chain.md §6.2) --- phase 3's data layer.

ONE RULING IS BAKED IN HERE.  lock-merkle-proof is a $^ head-shape union --- the stub case's head is a CELL, the full case's head is the atom %full --- and Jock cannot spell $^ at all.  A SIGNER does not need it to:  it PRODUCES proofs rather than accepting them, the engine's own bunt is the %full case, and the stub is the legacy shape whose hardcoded digest chain.md §7 preserves rather than fixes.  So only %full is declared and a Jock signer emits only %full.  READING a stub proof needs a $^ spelling, and nothing here should pretend otherwise. the two field-element widths the schnorr types are built from

### `F8`

```jock
struct F8 { a: @, b: @, c: @, d: @, e: @, f: @, g: @, h: @ };
```

No comment in the source. The signature above is the whole of what `F8` states about itself.

### `SchnorrPubkey`

```jock
struct SchnorrPubkey { x: F6, y: F6, inf: @ };
```

schnorr-pubkey:  a curve point --- two field elements and the point-at-infinity flag

*used by examples/walletkernel.jock*

```jock
pubkey: chaintx.SchnorrPubkey,
```

### `SchnorrSignature`

```jock
struct SchnorrSignature { chal: F8, sig: F8 };
```

No comment in the source. The signature above is the whole of what `SchnorrSignature` states about itself.

### `Pkh`

```jock
struct Pkh { m: @, h: chain.ZSet<chain.Hash> };
```

pkh:  [m=@ h=(z-set hash)] --- the m-of-n public-key-hash set

### `TimRange`

```jock
struct TimRange { min: @?, max: @? };
```

tim:  a relative and an absolute page-number range

### `Tim`

```jock
struct Tim { rel: TimRange, abs: TimRange };
```

No comment in the source. The signature above is the whole of what `Tim` states about itself.

### `LockPrimitive`

```jock
enum LockPrimitive { pkh(Pkh), tim(Tim), hax(Hax), brn(@) };
```

lock-primitive is $% with ALPHABETIC tags, so a Jock union matches it noun for noun.  `brn` carries an `@` rather than being nullary:  hoon's [%brn ~] erases to ['brn' 0], a CELL, where a Jock NULLARY case erases to the bare tag atom and would not match.  Pass 0.

### `MerkProof`

```jock
struct MerkProof { root: chain.Hash, path: List<chain.Hash> };
```

merk-proof:  [root path]

*used by examples/chaintx-arms.jock*

```jock
let mp = chaintx.MerkProof( root: z, path: e );
```

### `LockMerkleProof`

```jock
struct LockMerkleProof { version: @, cond: SpendCondition, axis: @, proof: MerkProof, };
```

lock-merkle-proof, %full only (see the ruling above)

*used by examples/chaintx-arms.jock*

```jock
let lmp = chaintx.LockMerkleProof( version: %full, cond: ~, axis: 0, proof: mp );
```

### `Witness`

```jock
struct Witness { lmp: LockMerkleProof, pkh: PkhSignature, hax: WitHax, tim: @ };
```

witness:  [lmp pkh hax tim].  tim is ~ --- the engine's comment is "timelock is dynamic", so the slot is present and empty.

*used by examples/chaintx-arms.jock*

```jock
let wt = chaintx.Witness( lmp: lmp, pkh: ps, hax: wh, tim: 0 );
```

### `LockMerkleProofStub`

```jock
struct LockMerkleProofStub { cond: SpendCondition, axis: @, proof: MerkProof };
```

the STUB lock-merkle-proof's payload.  The $^ union it is one half of has no Jock spelling (see the ruling above), but the payload alone is an ordinary struct, and its DIGEST is worth having:  the stub's hashable commits to a hardcoded legacy constant and, by the same legacy, not to the axis.  Both are preserved rather than fixed (chain.md §7), so both are pinned.

### `Bignum`

```jock
struct Bignum { tag: @, p: List<@> };
```

The block layer (chain.md §5), for `page-digest`. bignum is [%bn (list u32)], LSB first;  the tag is carried as a field so the erasure is the engine's noun.

### `Page`

```jock
struct Page { version: @, digest: chain.Hash, pow: *?, parent: chain.Hash, txids: TxIds, coinbase: CoinbaseSplit, timestamp: @, epoch: @, target: Bignum, work: Bignum, height: @, msg: List<@>, };
```

page, VERSION 1's own struct.  The $^ version dispatch lives in the COMBINED engine (`$^(page:v0 page:v1)`);  v1's own form is a plain twelve-field record, which is what a v1 kernel handles and what this declares.

`pow` is (unit proof) and the proof is a STARK object.  The slot is declared for mold fidelity;  nothing here hashes it --- see hashPow below for why that is a decision rather than a gap.

## Arms

44 arms, in source order. The signature is reproduced exactly; the prose is the comment above the arm in `crates/jockc/hoon/lib/chaintx.jock`.

| arm | signature | pinned by |
|---|---|---|
| `mkname` | `func mkname(f: chain.Hash, l: chain.Hash) -> Name` | `walletkernel` (use) |
| `mkspend` | `func mkspend(w: Witness, s: Seeds, fee: @) -> SpendV1` | `chaintx-arms` (use) |
| `mkrawtx` | `func mkrawtx(id: chain.Hash, sp: Spends) -> RawTx` | `walletkernel` (use) |
| `hzero` | `func hzero() -> chain.Hash` | `chaintx-arms` (assert) |
| `hashNoun` | `func hashNoun(n: *) -> chain.Hash` | — |
| `hashSource` | `func hashSource(s: Source) -> chain.Hash` | — |
| `nameFirst` | `func nameFirst(lock: chain.Hash) -> chain.Hash` | — |
| `nameLast` | `func nameLast(s: Source) -> chain.Hash` | — |
| `hashNoteData` | `func hashNoteData(d: NoteData) -> chain.Hash` | — |
| `hashSeed` | `func hashSeed(sd: Seed) -> chain.Hash` | — |
| `hashName` | `func hashName(n: Name) -> chain.Hash` | — |
| `hashPath` | `func hashPath(p: List<chain.Hash>) -> chain.Hash` | `chaintx-arms` (assert) |
| `hashMerkProof` | `func hashMerkProof(m: MerkProof) -> chain.Hash` | — |
| `hashHashes` | `func hashHashes(s: chain.ZSet<chain.Hash>) -> chain.Hash` | — |
| `hashPkh` | `func hashPkh(p: Pkh) -> chain.Hash` | — |
| `hashTimOpt` | `func hashTimOpt(u: @?) -> chain.Hash` | `chaintx-arms` (assert) |
| `hashTim` | `func hashTim(t: Tim) -> chain.Hash` | — |
| `hashLockPrim` | `func hashLockPrim(p: LockPrimitive) -> chain.Hash` | — |
| `hashSpendCond` | `func hashSpendCond(c: SpendCondition) -> chain.Hash` | — |
| `hashLmp` | `func hashLmp(l: LockMerkleProof) -> chain.Hash` | — |
| `hashPkhSig` | `func hashPkhSig(m: PkhSignature) -> chain.Hash` | — |
| `hashWitHax` | `func hashWitHax(m: WitHax) -> chain.Hash` | — |
| `hashWitness` | `func hashWitness(w: Witness) -> chain.Hash` | `chaintx-arms` (use) |
| `hashSeeds` | `func hashSeeds(s: Seeds) -> chain.Hash` | `chaintx-arms` (use) |
| `hashSpend1` | `func hashSpend1(s: SpendV1) -> chain.Hash` | `chaintx-arms` (assert) |
| `hashSpend` | `func hashSpend(s: SpendV1) -> chain.Hash` | `chaintx-arms` (assert) |
| `hashSpends` | `func hashSpends(m: Spends) -> chain.Hash` | — |
| `computeId` | `func computeId(sp: Spends) -> chain.Hash` | `walletkernel` (use) |
| `hashSourceOpt` | `func hashSourceOpt(u: Source?) -> chain.Hash` | — |
| `sigHashSeed` | `func sigHashSeed(sd: Seed) -> chain.Hash` | — |
| `sigHashSeeds` | `func sigHashSeeds(s: Seeds) -> chain.Hash` | — |
| `sigHashSpend` | `func sigHashSpend(s: SpendV1) -> chain.Hash` | `walletkernel` (use) |
| `signDigest` | `func signDigest(sk: SchnorrSeckey, m: chain.Hash) -> SchnorrSignature` | — |
| `pubkeyOf` | `func pubkeyOf(sk: SchnorrSeckey) -> SchnorrPubkey` | `walletkernel` (use) |
| `pkhash` | `func pkhash(pk: SchnorrPubkey) -> chain.Hash` | `walletkernel` (use) |
| `verifyDigest` | `func verifyDigest(pk: SchnorrPubkey, m: chain.Hash, sg: SchnorrSignature) -> Bool` | `walletkernel` (use) |
| `signWitness` | `func signWitness(w: Witness, sk: SchnorrSeckey, m: chain.Hash) -> Witness` | — |
| `signSpend` | `func signSpend(s: SpendV1, sk: SchnorrSeckey) -> SpendV1` | `walletkernel` (use) |
| `lmpStubDigest` | `func lmpStubDigest() -> chain.Hash` | — |
| `hashLmpStub` | `func hashLmpStub(l: LockMerkleProofStub) -> chain.Hash` | — |
| `hashCoinbaseSplit` | `func hashCoinbaseSplit(m: CoinbaseSplit) -> chain.Hash` | — |
| `hashBlockCommitment` | `func hashBlockCommitment(p: Page) -> chain.Hash` | — |
| `hashPow` | `func hashPow(pd: chain.Hash?) -> chain.Hash` | `chaintx-arms` (assert) |
| `computeDigest` | `func computeDigest(p: Page, pd: chain.Hash?) -> chain.Hash` | — |

### `mkname`

```jock
func mkname(f: chain.Hash, l: chain.Hash) -> Name { ... }
```

nnote, local-page and lock-merkle-proof are $^ head-shape unions and are NOT here.  Jock's discriminability judgment tells an atom from a cell, or one singleton head tag from another (hoon's $%);  it has no way to say "the head is a cell", which is what $^ dispatches on.  Both alternatives are structs, so both are simply cells and nothing separates them. The transaction core below needs none of them.

*used by examples/walletkernel.jock*

```jock
chaintx.mkname(chain.fromb58(n.first), chain.fromb58(n.last))
```

### `mkspend`

```jock
func mkspend(w: Witness, s: Seeds, fee: @) -> SpendV1 { ... }
```

No comment in the source. The signature above is the whole of what `mkspend` states about itself.

*used by examples/chaintx-arms.jock*

```jock
let sp = chaintx.mkspend(wt, es, 0);
```

### `mkrawtx`

```jock
func mkrawtx(id: chain.Hash, sp: Spends) -> RawTx { ... }
```

No comment in the source. The signature above is the whole of what `mkrawtx` states about itself.

*used by examples/walletkernel.jock*

```jock
let raw = chaintx.mkrawtx(chaintx.computeId(tx.spends), tx.spends);
```

### `hzero`

```jock
func hzero() -> chain.Hash { ... }
```

Hashes.

hash-hashable:tip5 walks a $hashable --- a little DSL --- and reduces it to a digest:

hash+X  ->  X                    (already a digest) leaf+X  ->  hash-noun-varlen(X) list+L  ->  hash-noun-varlen of L's digests [a b]   ->  hash-ten-cell(a', b')

A $hashable is a DESCRIPTION of a hash, and every structure below is known at the point it is written, so the walk is FUSED AWAY:  each arm applies the rules directly instead of building a value for an interpreter to take apart again.  The reduction is compositional --- a pair's digest is hash-ten-cell of its parts' digests --- so fusing arm by arm is sound.

This is also why no `Hashable` TYPE appears here, which matters: its $^ head-shape case has no Jock spelling, and a recursive untagged union cannot be declared from source at all. Fusing sidesteps both.

chain.hashnoun and chain.hashten are the only primitives, and both were already exported --- this needed nothing new from the package. the digest of `~`, which the DSL reaches often (leaf+~, leaf+&, and the empty note-data all bottom out here)

*asserted by examples/chaintx-arms.jock*

```jock
assert chaintx.hzero() == chain.hashnoun(0);
```

### `hashNoun`

```jock
func hashNoun(n: *) -> chain.Hash { ... }
```

hashable-noun:  the walk over an OPAQUE value.  The engine's arm is

?^  n  [$(n -.n) $(n +.n)] leaf+n

--- a cell becomes the pair of its halves' hashables, an atom a leaf --- so fused it is hash-ten-cell of the two recursions, and hash-noun-varlen at the bottom.  It is the one arm here that cannot be written against a declared shape, because the value has none:  a note's data and a witness's hax hold whatever the lock put there.  hoon.iscell (Nock 3) is the discrimination, and `as! (*, *)` is how the halves are reached once it answers.

### `hashSource`

```jock
func hashSource(s: Source) -> chain.Hash { ... }
```

source:  [hash+p leaf+is-coinbase]

### `nameFirst`

```jock
func nameFirst(lock: chain.Hash) -> chain.Hash { ... }
```

nname:  a name is [first last 0], and the two halves hash differently --- first over the lock, last over the source. first  =  [leaf+& hash+lock] last   =  [leaf+& (hashable:source source) leaf+~]

### `nameLast`

```jock
func nameLast(s: Source) -> chain.Hash { ... }
```

No comment in the source. The signature above is the whole of what `nameLast` states about itself.

### `hashNoteData`

```jock
func hashNoteData(d: NoteData) -> chain.Hash { ... }
```

note-data:  a z-map @ -> opaque, walked node by node.  The key is an atom (leaf+p) and the value is whatever the lock stored, so it goes through hashNoun.  An EMPTY treap is an atom and bottoms out at leaf+~.

### `hashSeed`

```jock
func hashSeed(sd: Seed) -> chain.Hash { ... }
```

seed:  [hash+lock-root hash+(hash:note-data) leaf+gift hash+parent-hash].  NOTE it does not include output-source --- that is sig-hashable, a different arm.

### `hashName`

```jock
func hashName(n: Name) -> chain.Hash { ... }
```

The treap and list walks, and the consensus transaction id.

Every container the engine hashes is walked in the SAME shape it stores:  a z-map node is [[key value] [left right]], a z-set node is [element [left right]], and an empty one is an atom that bottoms out at leaf+~.  The Jock ZMap/ZSet nominals erase to exactly those, so the walks destructure the real treap rather than a copy of it --- which is what makes the digest agree.

The two containers holding OPAQUE values --- a seed's note-data and a witness's hax --- are walked the same way, except that their values go through hashNoun, which discriminates with hoon.iscell rather than against a declared shape. nname:  [hash+first hash+last leaf+pad]

### `hashPath`

```jock
func hashPath(p: List<chain.Hash>) -> chain.Hash { ... }
```

merk-proof:  [hash+root <the path, a list of hashes>]

*asserted by examples/chaintx-arms.jock*

```jock
assert chaintx.hashPath(e) == chaintx.hzero();
```

### `hashMerkProof`

```jock
func hashMerkProof(m: MerkProof) -> chain.Hash { ... }
```

No comment in the source. The signature above is the whole of what `hashMerkProof` states about itself.

### `hashHashes`

```jock
func hashHashes(s: chain.ZSet<chain.Hash>) -> chain.Hash { ... }
```

a (z-set hash), which pkh and lock-primitive's hax both are

### `hashPkh`

```jock
func hashPkh(p: Pkh) -> chain.Hash { ... }
```

pkh:  [leaf+m <the hash set>]

### `hashTimOpt`

```jock
func hashTimOpt(u: @?) -> chain.Hash { ... }
```

a page-number bound inside tim:  ~ hashes as leaf+~, and a present one as [leaf+~ leaf+value]

*asserted by examples/chaintx-arms.jock*

```jock
assert chaintx.hashTimOpt(notim) == chaintx.hzero();
```

### `hashTim`

```jock
func hashTim(t: Tim) -> chain.Hash { ... }
```

No comment in the source. The signature above is the whole of what `hashTim` states about itself.

### `hashLockPrim`

```jock
func hashLockPrim(p: LockPrimitive) -> chain.Hash { ... }
```

lock-primitive:  [leaf+<tag> <payload>], and %brn's payload is ~

### `hashSpendCond`

```jock
func hashSpendCond(c: SpendCondition) -> chain.Hash { ... }
```

spend-condition:  a list of lock-primitives

### `hashLmp`

```jock
func hashLmp(l: LockMerkleProof) -> chain.Hash { ... }
```

lock-merkle-proof, %full:  [leaf+ver hash+H(cond) leaf+axis <merk>]

### `hashPkhSig`

```jock
func hashPkhSig(m: PkhSignature) -> chain.Hash { ... }
```

pkh-signature:  a z-map hash -> (pubkey, signature).  A pubkey hashes as leaf+form and so does a signature.

### `hashWitHax`

```jock
func hashWitHax(m: WitHax) -> chain.Hash { ... }
```

the witness's hax:  a z-map hash -> opaque.  The key is ALREADY a digest (hash+p, passed through, not re-hashed) --- which is what distinguishes this walk from note-data's, whose key is an atom.

### `hashWitness`

```jock
func hashWitness(w: Witness) -> chain.Hash { ... }
```

witness:  [hash+H(lmp) hash+H(pkh) hash+H(hax) leaf+tim]

*used by examples/chaintx-arms.jock*

```jock
chaintx.hashWitness(sp.witness),
```

### `hashSeeds`

```jock
func hashSeeds(s: Seeds) -> chain.Hash { ... }
```

seeds:  a z-set of seed

*used by examples/chaintx-arms.jock*

```jock
chain.hashten(chaintx.hashSeeds(sp.seeds), chain.hashnoun(sp.fee)));
```

### `hashSpend1`

```jock
func hashSpend1(s: SpendV1) -> chain.Hash { ... }
```

spend-1:  [<witness> <seeds> leaf+fee] --- the payload only, since the version tag is hashed by spend below

*asserted by examples/chaintx-arms.jock*

```jock
assert chaintx.hashSpend1(sp)
```

### `hashSpend`

```jock
func hashSpend(s: SpendV1) -> chain.Hash { ... }
```

spend:  [leaf+<version> <the versioned payload>]

*asserted by examples/chaintx-arms.jock*

```jock
assert chaintx.hashSpend(sp)
```

### `hashSpends`

```jock
func hashSpends(m: Spends) -> chain.Hash { ... }
```

spends:  a z-map nname -> spend

### `computeId`

```jock
func computeId(sp: Spends) -> chain.Hash { ... }
```

compute-id:  hash-hashable([leaf+%1 (hashable:spends spends)]). THE CONSENSUS TRANSACTION ID --- what examples/txbuild.jock has been approximating with a content hash since phase 2 opened.

*used by examples/walletkernel.jock*

```jock
(chaintx.computeId(spends), spends)
```

### `hashSourceOpt`

```jock
func hashSourceOpt(u: Source?) -> chain.Hash { ... }
```

THE SIGNATURE HASH --- what a witness actually signs.

It is NOT the spend's own hash.  That covers the witness, and a witness cannot commit to itself, so signing it would be circular. sig-hash covers the seeds and the fee, and nothing else:  what the spend PAYS OUT and what it PAYS FOR.

The seed's sig-hashable differs from its id hashable in exactly one place --- it INCLUDES output-source, which the id omits --- and that difference is the whole point.  A signature commits to where the output must come from;  the transaction id does not. source, as a unit:  ~ hashes as leaf+~, a present one as [leaf+~ <the source hashable>].

### `sigHashSeed`

```jock
func sigHashSeed(sd: Seed) -> chain.Hash { ... }
```

seed, sig-hashable:  [<output-source> hash+lock-root hash+H(note-data) leaf+gift hash+parent-hash]

### `sigHashSeeds`

```jock
func sigHashSeeds(s: Seeds) -> chain.Hash { ... }
```

seeds, sig-hashable:  the id walk's shape with the sig-hashable seed at each node.

### `sigHashSpend`

```jock
func sigHashSpend(s: SpendV1) -> chain.Hash { ... }
```

spend-1's sig-hash:  [<the seeds> leaf+fee].

*used by examples/walletkernel.jock*

```jock
if verifyPkhSig(v.witness.pkh, chaintx.sigHashSpend(v)) {
```

### `signDigest`

```jock
func signDigest(sk: SchnorrSeckey, m: chain.Hash) -> SchnorrSignature { ... }
```

SIGNING.

Every arm here is a call into the package, which is a call into the vendored curve.  Nothing in this file computes any part of a signature, and nothing should ever be added here that does.

The package types key material as a bare noun so that no arm of it can take a secret apart;  these four wrappers put the molds back on at the Jock boundary, which is where a caller wants them.  The casts are the only place a shape assumption is made, and tools/molds.sh checks each against the engine's own value.

### `pubkeyOf`

```jock
func pubkeyOf(sk: SchnorrSeckey) -> SchnorrPubkey { ... }
```

No comment in the source. The signature above is the whole of what `pubkeyOf` states about itself.

*used by examples/walletkernel.jock*

```jock
let pk = chaintx.pubkeyOf(chain.seckey(k.key) as! chaintx.SchnorrSeckey);
```

### `pkhash`

```jock
func pkhash(pk: SchnorrPubkey) -> chain.Hash { ... }
```

hash:schnorr-pubkey is hash-hashable(leaf+pk), so this is hashnoun and not a second primitive.

*used by examples/walletkernel.jock*

```jock
if version == 0 { chain.pubb58(pk) } else { chain.tob58(chaintx.pkhash(pk)) }
```

### `verifyDigest`

```jock
func verifyDigest(pk: SchnorrPubkey, m: chain.Hash, sg: SchnorrSignature) -> Bool { ... }
```

No comment in the source. The signature above is the whole of what `verifyDigest` states about itself.

*used by examples/walletkernel.jock*

```jock
if chaintx.verifyDigest(pk, digest, sg) {
```

### `signWitness`

```jock
func signWitness(w: Witness, sk: SchnorrSeckey, m: chain.Hash) -> Witness { ... }
```

witness.sign, the engine's arm step for step:  derive the pubkey from the secret, sign the digest, and file the pair under the pubkey's hash.  Only `pkh` changes.

### `signSpend`

```jock
func signSpend(s: SpendV1, sk: SchnorrSeckey) -> SpendV1 { ... }
```

sign a spend:  the witness signs the spend's SIG-HASH, which covers the seeds and the fee and not the witness itself.

*used by examples/walletkernel.jock*

```jock
buildSpends(t, sd, fee, sk, w, chain.zput(acc, h, chaintx.signSpend(unsigned, sk)))
```

### `lmpStubDigest`

```jock
func lmpStubDigest() -> chain.Hash { ... }
```

The stub lock-merkle-proof's digest, and the block layer. THE FROZEN LEGACY DIGEST.  The stub hashable commits to this constant where the corrected one commits to the axis;  upstream calls it "the standard library hash (stopgap for determinism)" and spells it as base58 in the source.  It is written out here because a Jock program cannot decode base58 at compile time and because a constant that must never drift is better read than derived.  tools/molds.sh checks it against the engine's own decode, so a change upstream reddens the lane.

### `hashLmpStub`

```jock
func hashLmpStub(l: LockMerkleProofStub) -> chain.Hash { ... }
```

lock-merkle-proof, STUB:  [hash+H(cond) hash+<legacy> <merk>]. NOTE WHAT IS ABSENT --- `axis` is a field of the stub and is not hashed, which is the "does not commit to axis" defect the full case exists to correct.  Two stubs differing only in axis have the same digest, and a fixture pins exactly that.

### `hashCoinbaseSplit`

```jock
func hashCoinbaseSplit(m: CoinbaseSplit) -> chain.Hash { ... }
```

coinbase-split:  a z-map lock-hash -> coins.  The key is already a digest and passes through;  the value is a leaf.

### `hashBlockCommitment`

```jock
func hashBlockCommitment(p: Page) -> chain.Hash { ... }
```

block-commitment:  a NINE-element hashable, right-nested ---

[hash+parent hash+H(tx-ids) hash+H(coinbase) leaf+timestamp leaf+epoch-counter leaf+target leaf+accumulated-work leaf+height leaf+msg]

tx-ids is a z-set of digests, which is hashHashes' shape exactly, so it is not given an arm of its own.  target and accumulated-work are bignums and hash as whole nouns, msg likewise as a list of belts.  NOTE the commitment does NOT include the page's own digest --- that would be circular --- nor its pow.

### `hashPow`

```jock
func hashPow(pd: chain.Hash?) -> chain.Hash { ... }
```

the pow slot's contribution:  leaf+~ with no proof, and [leaf+~ hash+H(proof)] with one.

THE PROOF DIGEST IS AN ARGUMENT, not a computation, and that is deliberate.  H(proof) is hash-proof, which absorbs STARK proof objects into a sponge --- machinery chain.md §8 puts out of scope indefinitely.  Jock hashes the PAGE;  it does not hash a proof, and pretending otherwise would be the only dishonest arm in this file.  A candidate page (the one a Jock miner-side program builds) has no proof and needs nothing.

*asserted by examples/chaintx-arms.jock*

```jock
assert chaintx.hashPow(nopow) == chaintx.hzero();
```

### `computeDigest`

```jock
func computeDigest(p: Page, pd: chain.Hash?) -> chain.Hash { ... }
```

compute-digest:  hash-hashable([<pow> <block-commitment>]). THE BLOCK ID.

## What no lane pins

41 of 64 public declarations are named by no example in `examples/`. They compile — the module is built by `tools/modules.sh` on every push — but no assertion mentions them by name, so treat the signature as the only claim about them that a lane checks.

That count is of DIRECT mentions. An arm an assertion reaches only through a caller is not counted here, so a helper below may well be exercised on every push without appearing to be — what is true is that no lane fixes its result independently of its caller’s.

- `Source` — `struct Source { hash: chain.Hash, coinbase: Bool };`
- `SpendV0` — `struct SpendV0 { version: @, signature: *, seeds: Seeds, fee: @ };`
- `SpendV1` — `struct SpendV1 { version: @, witness: Witness, seeds: Seeds, fee: @ };`
- `RawTx` — `struct RawTx { version: @, id: chain.Hash, spends: Spends };`
- `F6` — `struct F6 { a: @, b: @, c: @, d: @, e: @, f: @ };`
- `F8` — `struct F8 { a: @, b: @, c: @, d: @, e: @, f: @, g: @, h: @ };`
- `SchnorrSignature` — `struct SchnorrSignature { chal: F8, sig: F8 };`
- `Pkh` — `struct Pkh { m: @, h: chain.ZSet<chain.Hash> };`
- `TimRange` — `struct TimRange { min: @?, max: @? };`
- `Tim` — `struct Tim { rel: TimRange, abs: TimRange };`
- `LockPrimitive` — `enum LockPrimitive { pkh(Pkh), tim(Tim), hax(Hax), brn(@) };`
- `LockMerkleProofStub` — `struct LockMerkleProofStub { cond: SpendCondition, axis: @, proof: MerkProof };`
- `Bignum` — `struct Bignum { tag: @, p: List<@> };`
- `Page` — `struct Page { version: @, digest: chain.Hash, pow: *?, parent: chain.Hash, txids: TxIds, coinbase: CoinbaseSplit, timestamp: @, epoch: @, target: Bignum, work: Bignum, height: @, msg: List<@>, };`
- `hashNoun` — `func hashNoun(n: *) -> chain.Hash`
- `hashSource` — `func hashSource(s: Source) -> chain.Hash`
- `nameFirst` — `func nameFirst(lock: chain.Hash) -> chain.Hash`
- `nameLast` — `func nameLast(s: Source) -> chain.Hash`
- `hashNoteData` — `func hashNoteData(d: NoteData) -> chain.Hash`
- `hashSeed` — `func hashSeed(sd: Seed) -> chain.Hash`
- `hashName` — `func hashName(n: Name) -> chain.Hash`
- `hashMerkProof` — `func hashMerkProof(m: MerkProof) -> chain.Hash`
- `hashHashes` — `func hashHashes(s: chain.ZSet<chain.Hash>) -> chain.Hash`
- `hashPkh` — `func hashPkh(p: Pkh) -> chain.Hash`
- `hashTim` — `func hashTim(t: Tim) -> chain.Hash`
- `hashLockPrim` — `func hashLockPrim(p: LockPrimitive) -> chain.Hash`
- `hashSpendCond` — `func hashSpendCond(c: SpendCondition) -> chain.Hash`
- `hashLmp` — `func hashLmp(l: LockMerkleProof) -> chain.Hash`
- `hashPkhSig` — `func hashPkhSig(m: PkhSignature) -> chain.Hash`
- `hashWitHax` — `func hashWitHax(m: WitHax) -> chain.Hash`
- `hashSpends` — `func hashSpends(m: Spends) -> chain.Hash`
- `hashSourceOpt` — `func hashSourceOpt(u: Source?) -> chain.Hash`
- `sigHashSeed` — `func sigHashSeed(sd: Seed) -> chain.Hash`
- `sigHashSeeds` — `func sigHashSeeds(s: Seeds) -> chain.Hash`
- `signDigest` — `func signDigest(sk: SchnorrSeckey, m: chain.Hash) -> SchnorrSignature`
- `signWitness` — `func signWitness(w: Witness, sk: SchnorrSeckey, m: chain.Hash) -> Witness`
- `lmpStubDigest` — `func lmpStubDigest() -> chain.Hash`
- `hashLmpStub` — `func hashLmpStub(l: LockMerkleProofStub) -> chain.Hash`
- `hashCoinbaseSplit` — `func hashCoinbaseSplit(m: CoinbaseSplit) -> chain.Hash`
- `hashBlockCommitment` — `func hashBlockCommitment(p: Page) -> chain.Hash`
- `computeDigest` — `func computeDigest(p: Page, pd: chain.Hash?) -> chain.Hash`

## Where it is used

2 examples import `chaintx`. Each is a complete program whose value `tools/examples.sh` pins on every push.

- `examples/chaintx-arms.jock` — the arms sheet: one assertion per arm
- `examples/walletkernel.jock` — a use

The [worked examples](../../examples/) page shows the shortest of these in full.
