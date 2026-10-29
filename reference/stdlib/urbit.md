# lib/urbit

Urbit-native conversions, in Jock.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` writes this from `crates/jockc/hoon/lib/urbit.jock` and the examples that import it.
>
> 2 public declarations — 0 types, 2 arms. 2 pinned by a lane, 0 not. channel `%rc` · commit `7b85ef8`

## Import

A module arrives by name and nothing in it is ambient. Every arm below is reached as `urbit.<name>`.

```jock
import urbit;
```

The name is the file name minus `.jock`: `urbit` is `crates/jockc/hoon/lib/urbit.jock`, and it is found because the directory holding it was passed as a `--data-dir`. There is no search path and no implicit import; `tools/libs.py` holds the whole discovery rule, and the compiler itself is a pure function of source and libraries.

## About

First module: @p (ship names) — the +po syllable tables and the +ob obfuscation + render, translated from hoon.  Module boundary notes: string cat is hoon.cat (no prelude Add(String) impl in a module); @ arithmetic/comparison ride the numeric column; the +ob prf is INLINED (eff) since HOF is post-1.0. Verified differentially against hoon (scot %p) across ranks.

THE EXPORTED SURFACE IS TWO ARMS: topatp and frompatp.  The other twenty-four are the Feistel and the syllable tables, and they are `private` — an importer that could call `fein` or `tail` would be holding half a cipher, and `tail` in particular is a name no library should be putting in an importer's reach.  They were public only because nothing had asked the question; the generated reference asked it by reporting 2 of 26 arms pinned.

## Arms

2 arms, in source order. The signature is reproduced exactly; the prose is the comment above the arm in `crates/jockc/hoon/lib/urbit.jock`.

| arm | signature | pinned by |
|---|---|---|
| `topatp` | `func topatp(n: @) -> String` | `patp` (use) |
| `frompatp` | `func frompatp(name: String) -> @` | `patp` (use) |

### `topatp`

```jock
func topatp(n: @) -> String { ... }
```

No comment in the source. The signature above is the whole of what `topatp` states about itself.

*used by examples/patp.jock*

```jock
func chk(n: @, want: String) -> @ { if urbit.topatp(n) === want { 1 } else { 0 } };
```

### `frompatp`

```jock
func frompatp(name: String) -> @ { ... }
```

No comment in the source. The signature above is the whole of what `frompatp` states about itself.

*used by examples/patp.jock*

```jock
func rt(n: @) -> @ { if urbit.frompatp(urbit.topatp(n)) == n { 1 } else { 0 } };
```

## What no lane pins

Nothing. All 2 public declarations are named by an example that runs on every push.

24 further declarations are `private` and therefore not reachable by an importer at all: `sisTab`, `dexTab`, `tos`, `tod`, `raku`, `eff`, `feLoop`, `fe`, `fee`, `feis`, `fein`, `wsyl`, `ploop`, `fenLoop`, `fen`, `feen`, `tail`, `fynd`, `sylAt`, `strip`, `find`, `ins`, `ind`, `rebuild`.

## Where it is used

1 example imports `urbit`. Each is a complete program whose value `tools/examples.sh` pins on every push.

- `examples/patp.jock` — a use

The [worked examples](/reference/examples/) page shows the shortest of these in full.
