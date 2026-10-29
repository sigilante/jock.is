# lib/urbit

Urbit-native conversions, in Jock.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` writes this from `crates/jockc/hoon/lib/urbit.jock` and the examples that import it.
>
> 26 public declarations — 0 types, 26 arms. 2 pinned by a lane, 24 not. channel `%rc` · commit `15d64f3`

## Import

A module arrives by name and nothing in it is ambient. Every arm below is reached as `urbit.<name>`.

```jock
import urbit;
```

The name is the file name minus `.jock`: `urbit` is `crates/jockc/hoon/lib/urbit.jock`, and it is found because the directory holding it was passed as a `--data-dir`. There is no search path and no implicit import; `tools/libs.py` holds the whole discovery rule, and the compiler itself is a pure function of source and libraries.

## About

First module: @p (ship names) — the +po syllable tables and the +ob obfuscation + render, translated from hoon.  Module boundary notes: string cat is hoon.cat (no prelude Add(String) impl in a module); @ arithmetic/comparison ride the numeric column; the +ob prf is INLINED (eff) since HOF is post-1.0. Verified differentially against hoon (scot %p) across ranks.

## Arms

26 arms, in source order. The signature is reproduced exactly; the prose is the comment above the arm in `crates/jockc/hoon/lib/urbit.jock`.

| arm | signature | pinned by |
|---|---|---|
| `sisTab` | `func sisTab() -> String` | — |
| `dexTab` | `func dexTab() -> String` | — |
| `tos` | `func tos(a: @) -> String` | — |
| `tod` | `func tod(a: @) -> String` | — |
| `raku` | `func raku(j: @) -> @` | — |
| `eff` | `func eff(j: @, r: @) -> @` | — |
| `feLoop` | `func feLoop(a: @, b: @, r: @, j: @, ell: @, arr: @) -> @` | — |
| `fe` | `func fe(a: @, b: @, r: @, m: @) -> @` | — |
| `fee` | `func fee(a: @, b: @, k: @, r: @, m: @) -> @` | — |
| `feis` | `func feis(m: @) -> @` | — |
| `fein` | `func fein(pyn: @) -> @` | — |
| `wsyl` | `func wsyl(w: @) -> String` | — |
| `ploop` | `func ploop(sxz: @, imp: @, words: @, rep: String) -> String` | — |
| `topatp` | `func topatp(n: @) -> String` | `patp` (use) |
| `fenLoop` | `func fenLoop(a: @, b: @, j: @, ell: @, arr: @) -> @` | — |
| `fen` | `func fen(a: @, b: @, r: @, m: @) -> @` | — |
| `feen` | `func feen(a: @, b: @, k: @, r: @, m: @) -> @` | — |
| `tail` | `func tail(m: @) -> @` | — |
| `fynd` | `func fynd(cry: @) -> @` | — |
| `sylAt` | `func sylAt(tab: @, k: @) -> @` | — |
| `strip` | `func strip(s: @, acc: @, sh: @) -> @` | — |
| `find` | `func find(tab: @, b: @, i: @) -> @` | — |
| `ins` | `func ins(b: @, i: @) -> @` | — |
| `ind` | `func ind(b: @, i: @) -> @` | — |
| `rebuild` | `func rebuild(dense: @, wi: @, words: @, acc: @) -> @` | — |
| `frompatp` | `func frompatp(name: String) -> @` | `patp` (use) |

### `sisTab`

```jock
func sisTab() -> String { ... }
```

No comment in the source. The signature above is the whole of what `sisTab` states about itself.

### `dexTab`

```jock
func dexTab() -> String { ... }
```

No comment in the source. The signature above is the whole of what `dexTab` states about itself.

### `tos`

```jock
func tos(a: @) -> String { ... }
```

syllable a: 3 bytes at byte-offset 3a = low 24 bits after a 24a-bit right shift.

### `tod`

```jock
func tod(a: @) -> String { ... }
```

No comment in the source. The signature above is the whole of what `tod` states about itself.

### `raku`

```jock
func raku(j: @) -> @ { ... }
```

+ob: the four-round Feistel that conceals planet structure.

### `eff`

```jock
func eff(j: @, r: @) -> @ { ... }
```

No comment in the source. The signature above is the whole of what `eff` states about itself.

### `feLoop`

```jock
func feLoop(a: @, b: @, r: @, j: @, ell: @, arr: @) -> @ { ... }
```

No comment in the source. The signature above is the whole of what `feLoop` states about itself.

### `fe`

```jock
func fe(a: @, b: @, r: @, m: @) -> @ { ... }
```

No comment in the source. The signature above is the whole of what `fe` states about itself.

### `fee`

```jock
func fee(a: @, b: @, k: @, r: @, m: @) -> @ { ... }
```

No comment in the source. The signature above is the whole of what `fee` states about itself.

### `feis`

```jock
func feis(m: @) -> @ { ... }
```

No comment in the source. The signature above is the whole of what `feis` states about itself.

### `fein`

```jock
func fein(pyn: @) -> @ { ... }
```

No comment in the source. The signature above is the whole of what `fein` states about itself.

### `wsyl`

```jock
func wsyl(w: @) -> String { ... }
```

one 16-bit word -> prefix(hi byte) ++ suffix(lo byte)

### `ploop`

```jock
func ploop(sxz: @, imp: @, words: @, rep: String) -> String { ... }
```

render words most-significant-first, prepending; single dash within a group of 4, double dash between groups.

### `topatp`

```jock
func topatp(n: @) -> String { ... }
```

No comment in the source. The signature above is the whole of what `topatp` states about itself.

*used by examples/patp.jock*

```jock
func chk(n: @, want: String) -> @ { if urbit.topatp(n) === want { 1 } else { 0 } };
```

### `fenLoop`

```jock
func fenLoop(a: @, b: @, j: @, ell: @, arr: @) -> @ { ... }
```

---- the inverse road:  @p text -> atom ---- +fen: the inverse round of +fe.  Same shape, but the swap keys on ale (not arr), the prf feeds on ell, and the residues add a (or b) before subtracting f to stay non-negative.  hoon.mod is used for the outer reductions so precedence can't bite.

### `fen`

```jock
func fen(a: @, b: @, r: @, m: @) -> @ { ... }
```

No comment in the source. The signature above is the whole of what `fen` states about itself.

### `feen`

```jock
func feen(a: @, b: @, k: @, r: @, m: @) -> @ { ... }
```

No comment in the source. The signature above is the whole of what `feen` states about itself.

### `tail`

```jock
func tail(m: @) -> @ { ... }
```

No comment in the source. The signature above is the whole of what `tail` states about itself.

### `fynd`

```jock
func fynd(cry: @) -> @ { ... }
```

No comment in the source. The signature above is the whole of what `fynd` states about itself.

### `sylAt`

```jock
func sylAt(tab: @, k: @) -> @ { ... }
```

syllable k of a table atom: 3 bytes at bit-offset 24k

### `strip`

```jock
func strip(s: @, acc: @, sh: @) -> @ { ... }
```

strip '~' (126) and '-' (45), packing the surviving bytes into a dense cord in their original (little-endian) order.

### `find`

```jock
func find(tab: @, b: @, i: @) -> @ { ... }
```

+ins / +ind:  syllable atom -> table index (linear search). The table atom is threaded, not rebuilt per step (the search is 256-wide; re-parsing the 768-byte table each iteration is a 256x tax).  ins keys on sis, ind on dex; the walk is shared.

### `ins`

```jock
func ins(b: @, i: @) -> @ { ... }
```

No comment in the source. The signature above is the whole of what `ins` states about itself.

### `ind`

```jock
func ind(b: @, i: @) -> @ { ... }
```

No comment in the source. The signature above is the whole of what `ind` states about itself.

### `rebuild`

```jock
func rebuild(dense: @, wi: @, words: @, acc: @) -> @ { ... }
```

reassemble words most-significant-first: word wi lives at syllables (2wi, 2wi+1) = (prefix, suffix), shifted to its place.

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

24 of 26 public declarations are named by no example in `examples/`. They compile — the module is built by `tools/modules.sh` on every push — but no assertion mentions them by name, so treat the signature as the only claim about them that a lane checks.

That count is of DIRECT mentions. An arm an assertion reaches only through a caller is not counted here, so a helper below may well be exercised on every push without appearing to be — what is true is that no lane fixes its result independently of its caller’s.

- `sisTab` — `func sisTab() -> String`
- `dexTab` — `func dexTab() -> String`
- `tos` — `func tos(a: @) -> String`
- `tod` — `func tod(a: @) -> String`
- `raku` — `func raku(j: @) -> @`
- `eff` — `func eff(j: @, r: @) -> @`
- `feLoop` — `func feLoop(a: @, b: @, r: @, j: @, ell: @, arr: @) -> @`
- `fe` — `func fe(a: @, b: @, r: @, m: @) -> @`
- `fee` — `func fee(a: @, b: @, k: @, r: @, m: @) -> @`
- `feis` — `func feis(m: @) -> @`
- `fein` — `func fein(pyn: @) -> @`
- `wsyl` — `func wsyl(w: @) -> String`
- `ploop` — `func ploop(sxz: @, imp: @, words: @, rep: String) -> String`
- `fenLoop` — `func fenLoop(a: @, b: @, j: @, ell: @, arr: @) -> @`
- `fen` — `func fen(a: @, b: @, r: @, m: @) -> @`
- `feen` — `func feen(a: @, b: @, k: @, r: @, m: @) -> @`
- `tail` — `func tail(m: @) -> @`
- `fynd` — `func fynd(cry: @) -> @`
- `sylAt` — `func sylAt(tab: @, k: @) -> @`
- `strip` — `func strip(s: @, acc: @, sh: @) -> @`
- `find` — `func find(tab: @, b: @, i: @) -> @`
- `ins` — `func ins(b: @, i: @) -> @`
- `ind` — `func ind(b: @, i: @) -> @`
- `rebuild` — `func rebuild(dense: @, wi: @, words: @, acc: @) -> @`

## Where it is used

1 example imports `urbit`. Each is a complete program whose value `tools/examples.sh` pins on every push.

- `examples/patp.jock` — a use

The [worked examples](../../examples/) page shows the shortest of these in full.
