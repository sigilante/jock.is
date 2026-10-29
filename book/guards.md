# R5 · The guard set

A guard is a value refinement carried by a type. There are five, the set is closed, and it is not a general refinement mechanism.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` writes this page from `docs/spec/types.md` [S3.4](/spec/types/#s3.4).
>
> channel `%rc` · commit `0ea53e5`

## The set

> Guards are a **closed, enumerated set** — `%based` (value < 2⁶⁴ − 2³² + 1, the Goldilocks prime), `%byte` (< 256), `%unic` (a Unicode scalar, `0x0`–`0x10FFFF`), `%loob` (< 2), `%term` (a valid Hoon term). **Five.** A guard is not a general refinement mechanism and never will be.

| guard | admits ([S3.4](/spec/types/#s3.4)) | reached by |
|---|---|---|
| `%based` | value < 2⁶⁴ − 2³² + 1, the Goldilocks prime | `Base` — the only guard utterable as a type expression; also the `%$`, `%number` and `%hex` auras |
| `%byte` | < 256 | `Byte`, a boot-env alias carrying the guard |
| `%unic` | a Unicode scalar, `0x0`–`0x10FFFF` | `UniChar` |
| `%loob` | < 2 | `Bool`, a boot-env alias carrying the guard |
| `%term` | a valid Hoon term | `Term`, a boot-env alias carrying the guard |

Only `%based` is utterable as a type expression in its own right — it *is* a `tex` form, spelled `Base`. The other four reach the checker through a **name**, because a bare `[%atom %logical ~]` written anywhere in the compiler re-opens the every-atom-is-a-`Bool` hole.

## The order is PARTIAL

Four of the five form a chain by inclusion; `%term` is incomparable with all of them, which is the fact that makes this an order and not a ladder.

```text
%loob  ⊂  %byte  ⊂  %unic  ⊂  %based  ⊂  ~   (~ = unguarded, every atom)
%term                                 ⊂  ~
```

Measured rather than assumed: `1` is not a term, `200` is not a term, `0x1f600` is not a term, and `'transaction'` is a term of 11 bytes, which exceeds the prime. They overlap without containment — `'a'` is both a byte and a term — which is why the order stopped being a chain when `Term` landed.

Two judgments depend on the order, and the partiality shows in both. **Nest** subsumes along it, so a tighter guard stands wherever a looser one is demanded, and `%term` therefore stands only where `~` is demanded. **Join** synthesizes by AURA rather than by walking the order: each aura names the guard its values are refined by, and the guard applies only if both values satisfy it. `%real` deliberately names no guard — an IEEE double is a full 64-bit pattern, so `%based` would be wrong.

## What a failing guard refuses

All three reachable guards refuse through `nest`, so the tag is `%mill-nest` with a position rather than a guard-specific one. For `Byte` and `Bool` the **aura gate fires first**: a decimal literal is `%number` and neither type is, so `let b: Byte = 255;` refuses on the aura and the range check is never reached from a decimal literal at all. The spellings that do reach these types are `'a'` for `Byte` and `true`/`false` for `Bool`.

Pinned by `t-mint-guard`, `t-nest-sa-p`, `t-nest-guard-loob-p`, `t-nest-guard-loob-n`, `t-nest-sa-n`.
