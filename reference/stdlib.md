# The standard library

13 modules under `lib/`, 222 public declarations between them. A module arrives by name through `import`; nothing in it is ambient, and nothing is in scope that was not imported.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` reads the module sources and the examples that import them.
>
> 135 of 222 declarations pinned by a lane · channel `%rc` · commit `15d64f3` (sigilante/pre-rc-sweep) · 2026-10-30

## What counts as the standard library

Three tiers, distinguished by WHY a piece of code is where it is rather than by what it does. The distinction decides where a contributor puts something new, so it is stated here and not left to precedent.

| tier | what | where | how it arrives |
|---|---|---|---|
| 1 | the pinned prelude | `++prelude` in `lib/jock.hoon` | ambient — no import, frozen; see [the ABI](../abi/) |
| 2 | a library module written in Jock | `lib/*.jock` — this page | `import <name>;` with the directory on `--data-dir` |
| 3 | a curated Hoon core, jammed | `pkgs/*.jam` via `tools/pkg.sh` | `import <name>;` against a built jam |

Tier 1 is what a program cannot reasonably be written without, and an addition to it is an ABI event. Tier 2 is what is expressible in Jock without a new ABI arm and that two unrelated programs would both want. Tier 3 is for where substantial tested Hoon already exists and a Jock version would be a rewrite rather than a port — nothing in a tier 3 package is jetted, which is the argument for keeping the tier small.

## The modules

| module | what it is | types | arms | pinned |
|---|---|---:|---:|---:|
| [`chainkey`](chainkey/) | the wallet key family (chain.md §6.2, phase 4) | 3 | 8 | 10/11 |
| [`chainrand`](chainrand/) | the chain's own generator | 1 | 7 | 5/8 |
| [`chaintx`](chaintx/) | the transaction mold family and its hashes (chain.md §4/S5) | 20 | 44 | 23/64 |
| [`hof`](hof/) | higher-order functions over closures and List | 0 | 18 | 18/18 |
| [`http`](http/) | the NockApp http driver, from the Jock side | 3 | 19 | 13/22 |
| [`interval`](interval/) | interval arithmetic over exact rationals | 1 | 3 | 3/4 |
| [`nockapp`](nockapp/) | the NockApp host's own effect vocabulary | 1 | 0 | 1/1 |
| [`parser`](parser/) | parser combinators | 7 | 31 | 33/38 |
| [`rand`](rand/) | deterministic pseudo-random numbers | 1 | 11 | 10/12 |
| [`rational`](rational/) | exact rational arithmetic over Int | 0 | 9 | 9/9 |
| [`twoc`](twoc/) | two's-complement signed integers at arbitrary bit width | 1 | 7 | 7/8 |
| [`urbit`](urbit/) | Urbit-native conversions, in Jock | 0 | 26 | 2/26 |
| [`wallet`](wallet/) | the wallet driver's effect vocabulary | 1 | 0 | 1/1 |

## How an arm is pinned

An arm is pinned when an example in `examples/` names it. 9 modules have an `examples/<name>-arms.jock` — a sheet whose every line asserts one arm, which fails the lane if the arm stops doing what the line says. That is the strongest pin a reference can cite, and each arm page quotes the line.

*one line of examples/hof-arms.jock*

```jock
assert hof.compose(inc, dbl)(10) == 21;
```

An arm named only by an ordinary program is marked a `use`: the call shape is demonstrated but no assertion fixes the result. An arm named by nothing is marked `—` and listed on its module page, because a reference that quietly omitted it would read as though the coverage were complete.

## What no lane pins

87 of 222 public declarations are named by no example — DIRECTLY; an arm reached only through a pinned caller is not counted. The gap is not spread evenly: 9 modules have an arms sheet and `http`, `nockapp`, `urbit`, `wallet` do not.

- `chainkey` — 10 of 11 pinned
- `chainrand` — 5 of 8 pinned
- `chaintx` — 23 of 64 pinned
- `http` — 13 of 22 pinned, no arms sheet
- `interval` — 3 of 4 pinned
- `parser` — 33 of 38 pinned
- `rand` — 10 of 12 pinned
- `twoc` — 7 of 8 pinned
- `urbit` — 2 of 26 pinned, no arms sheet

## What generates this

`tools/stdlib.py` parses every top-level declaration in `crates/jockc/hoon/lib/*.jock` for its kind, name, generic binders and signature, together with the comment block above it, and joins that against the examples that import the module. `tools/refgen.py --check` regenerates and fails on a diff, so a module that gains an arm reddens a lane until the page is rewritten.

The prose on each arm is the comment in the module source, reproduced and not paraphrased. A paraphrase would be a second copy to maintain, and it is the copy a reader of the source would never see go stale.
