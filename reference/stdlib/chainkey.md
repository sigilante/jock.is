# lib/chainkey

the wallet key family (chain.md §6.2, phase 4).

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` writes this from `crates/jockc/hoon/lib/chainkey.jock` and the examples that import it.
>
> 11 public declarations — 3 types, 8 arms. 10 pinned by a lane, 1 not. channel `%rc` · commit `15d64f3`

## Import

A module arrives by name and nothing in it is ambient. Every arm below is reached as `chainkey.<name>`.

```jock
import chainkey;
```

The name is the file name minus `.jock`: `chainkey` is `crates/jockc/hoon/lib/chainkey.jock`, and it is found because the directory holding it was passed as a `--data-dir`. There is no search path and no implicit import; `tools/libs.py` holds the whole discovery rule, and the compiler itself is a pure function of source and libraries.

## About

Derivation only.  SIGNING lives in chaintx, because a signature is transaction business; what is here is how a key comes to exist and how it travels on the wire.

Every arm is a call into the package, which is a call into the vendored bip39 and slip10.  Nothing here computes any part of a key, and nothing should ever be added here that does.

TYPES FIRST, then the funcs (+mdreg stubs only the leading run of declarations, and one scope frame is cheaper than two). slip10's own $keyc: a key, its chain code, and the protocol version.  The field ORDER is slip10's, not a convenience: the package hands back [prv cad ver] and this is what molds it.

## Types

3 types. A type’s members ARE its interface, so each is shown whole rather than by name.

### `Keyc`

```jock
struct Keyc { key: @, cai: @, ver: @ };
```

No comment in the source. The signature above is the whole of what `Keyc` states about itself.

*used by examples/walletkernel.jock*

```jock
master: chainkey.Keyc,
```

### `CoilKey`

```jock
struct CoilKey { kind: @, p: @ };
```

the wallet's $coil as it travels on the wire --- version, then a TAGGED key, then the chain code:

[%0|%1 [[%prv|%pub p] cc]]

The tag matters: only a %prv coil can sign or derive a private child, and a %pub one is a watch-only address.

### `Coil`

```jock
struct Coil { version: @, key: CoilKey, cc: @ };
```

No comment in the source. The signature above is the whole of what `Coil` states about itself.

*used by examples/walletkernel.jock*

```jock
let entries = c.rest as! List<(*, chainkey.Coil)>;
```

## Arms

8 arms, in source order. The signature is reproduced exactly; the prose is the comment above the arm in `crates/jockc/hoon/lib/chainkey.jock`.

| arm | signature | pinned by |
|---|---|---|
| `fromPhrase` | `func fromPhrase(phrase: String, version: @) -> Keyc` | `chainkey-arms` (use) |
| `phraseOf` | `func phraseOf(entropy: @, elen: @, salt: @, slen: @) -> String` | `chainkey-arms` (assert) |
| `hardIndex` | `func hardIndex(i: @) -> @` | `chainkey-arms` (assert) |
| `deriveAt` | `func deriveAt(parent: Keyc, i: @) -> Keyc` | `chainkey-arms` (assert) |
| `deriveChild` | `func deriveChild(parent: Keyc, i: @, hardened: Bool) -> Keyc` | `chainkey-arms` (assert) |
| `coilOf` | `func coilOf(k: Keyc) -> Coil` | `chainkey-arms` (use) |
| `keycOf` | `func keycOf(c: Coil) -> Keyc` | `chainkey-arms` (assert) |
| `isPrivate` | `func isPrivate(c: Coil) -> Bool` | `chainkey-arms` (assert) |

### `fromPhrase`

```jock
func fromPhrase(phrase: String, version: @) -> Keyc { ... }
```

a seed phrase becomes a master key.  The empty passphrase is the wallet's own call (`(to-seed:bip39 memo "")`), not a default we chose; a wallet that took one would be a different wallet.

*used by examples/chainkey-arms.jock*

```jock
let master = chainkey.fromPhrase(mn, 1);
```

### `phraseOf`

```jock
func phraseOf(entropy: @, elen: @, salt: @, slen: @) -> String { ... }
```

entropy becomes a seed phrase, by way of argon2.  This is the first half of the wallet's +gen-master-key; +fromPhrase is the second, and keeping them apart means a caller can show the phrase before committing to the key it makes.

*asserted by examples/chainkey-arms.jock*

```jock
assert chainkey.phraseOf(ent, 32, salt, 16) === chainkey.phraseOf(ent, 32, salt, 16);
```

### `hardIndex`

```jock
func hardIndex(i: @) -> @ { ... }
```

HARDENING IS AN INDEX CONVENTION, not a flag the library takes: +derive-child:utils receives an index with 2^31 already added and infers hardening from its magnitude.  Spelling it out here keeps the convention where a reader can see it.

*asserted by examples/chainkey-arms.jock*

```jock
assert chainkey.hardIndex(0) == 2_147_483_648;
```

### `deriveAt`

```jock
func deriveAt(parent: Keyc, i: @) -> Keyc { ... }
```

No comment in the source. The signature above is the whole of what `deriveAt` states about itself.

*asserted by examples/chainkey-arms.jock*

```jock
assert chainkey.deriveChild(master, 5, false) == chainkey.deriveAt(master, 5);
```

### `deriveChild`

```jock
func deriveChild(parent: Keyc, i: @, hardened: Bool) -> Keyc { ... }
```

No comment in the source. The signature above is the whole of what `deriveChild` states about itself.

*asserted by examples/chainkey-arms.jock*

```jock
assert chainkey.deriveChild(master, 5, false) == chainkey.deriveAt(master, 5);
```

### `coilOf`

```jock
func coilOf(k: Keyc) -> Coil { ... }
```

Coils.  A derived key is private by construction --- slip10's +derive-private is the only arm these wrappers call --- so the coil they build carries the %prv tag, and reading one back drops the tag because a Keyc has nowhere to put it.

*used by examples/chainkey-arms.jock*

```jock
let c = chainkey.coilOf(master);
```

### `keycOf`

```jock
func keycOf(c: Coil) -> Keyc { ... }
```

No comment in the source. The signature above is the whole of what `keycOf` states about itself.

*asserted by examples/chainkey-arms.jock*

```jock
assert chainkey.keycOf(c) == master;
```

### `isPrivate`

```jock
func isPrivate(c: Coil) -> Bool { ... }
```

No comment in the source. The signature above is the whole of what `isPrivate` states about itself.

*asserted by examples/chainkey-arms.jock*

```jock
assert chainkey.isPrivate(c);
```

## What no lane pins

1 of 11 public declarations are named by no example in `examples/`. They compile — the module is built by `tools/modules.sh` on every push — but no assertion mentions them by name, so treat the signature as the only claim about them that a lane checks.

That count is of DIRECT mentions. An arm an assertion reaches only through a caller is not counted here, so a helper below may well be exercised on every push without appearing to be — what is true is that no lane fixes its result independently of its caller’s.

- `CoilKey` — `struct CoilKey { kind: @, p: @ };`

## Where it is used

2 examples import `chainkey`. Each is a complete program whose value `tools/examples.sh` pins on every push.

- `examples/chainkey-arms.jock` — the arms sheet: one assertion per arm
- `examples/walletkernel.jock` — a use

The [worked examples](../../examples/) page shows the shortest of these in full.
