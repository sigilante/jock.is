# lib/wallet

the wallet driver's effect vocabulary.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` writes this from `crates/jockc/hoon/lib/wallet.jock` and the examples that import it.
>
> 1 public declaration — 1 type, 0 arms. 1 pinned by a lane, 0 not. channel `%rc` · commit `15d64f3`

## Import

A module arrives by name and nothing in it is ambient. Every arm below is reached as `wallet.<name>`.

```jock
import wallet;
```

The name is the file name minus `.jock`: `wallet` is `crates/jockc/hoon/lib/wallet.jock`, and it is found because the directory holding it was passed as a `--data-dir`. There is no search path and no implicit import; `tools/libs.py` holds the whole discovery rule, and the compiler itself is a pure function of source and libraries.

## About

`file` is [%file path-tag path contents], the effect a kernel writes a jammed noun through (chain.md §6.2).  The path is a cord on the wire, so it is a String and NOT the Path nominal, which is a list of Strings and would erase wrong.  The payload carries the operation as its first element, so `file((%write, path, jam))` erases to exactly the driver's parse.

`nockchain-grpc` is the submit effect, [%nockchain-grpc %send-tx raw-tx].  Its case name CARRIES THE HYPHEN deliberately:  the case name is the wire tag the driver matches on.

A kernel that emits these and also prints or exits wants both vocabularies, which is an untagged union of the two enums --- `impl Kernel<nockapp.Effect | wallet.Effect>`.  Distinct head tags are erasure-disjoint, so the union is discriminable by construction.

## Types

1 type. A type’s members ARE its interface, so each is shown whole rather than by name.

### `Effect`

```jock
enum Effect { file((@, String, @)), nockchain-grpc((@, *)) };
```

No comment in the source. The signature above is the whole of what `Effect` states about itself.

*used by examples/walletkernel.jock*

```jock
alias Fx is nockapp.Effect | wallet.Effect;
```

## What no lane pins

Nothing. All 1 public declaration is named by an example that runs on every push.

## Where it is used

1 example imports `wallet`. Each is a complete program whose value `tools/examples.sh` pins on every push.

- `examples/walletkernel.jock` — a use

The [worked examples](../../examples/) page shows the shortest of these in full.
