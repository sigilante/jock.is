# R9 · Glossary

Jock’s vocabulary, each term pointing at the normative rule that introduces it. The definitions are the rules’ own sentences.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` writes this page.
>
> 25 terms · channel `%rc` · commit `076324d`

## Why this is an index and not prose

`OUTLINE.md` R9 asks for a glossary with prose definitions. The specs do not define these terms — they **use** them, normatively and precisely, which is a different thing. A regex for definitional sentences over all 448 normative rules was tried and returned `chain.md` rules about merkle proofs for "bunt" and about signers for "kernel".

So each entry below is the rule that introduces the term, quoted. A reader gets "aura: [L-97](/spec/language/#l-97) says the table below is the utterable aura set" rather than a definition this generator wrote. Writing one would make the generator a second author of the language’s vocabulary, which is the failure mode this whole reference exists to avoid.

## Terms

### adjacency law

> [L-1](/spec/language/#l-1) · A postfix form binds only when glued

`docs/spec/language.md` [L-1](/spec/language/#l-1) · pinned by `t-lex-glue-p`, `t-arc-ctor`, `t-lex-type-p`

### aura

> [S3.1](/spec/types/#s3.1) · Auras are flat: every named aura sits directly under bare `@` (aura `%$`). There is no Hoon-style prefix nesting; `@ud` vs `@u` subtlety does not exist. The initial semantic vocabulary (open-ended; surface-utterable set in language.md §3.1):

`docs/spec/types.md` [S3.1](/spec/types/#s3.1)

### bunt

> [L-71](/spec/language/#l-71) · Bunt is the FIRST case's bunt

`docs/spec/language.md` [L-71](/spec/language/#l-71) · pinned by `t-arc-enum`

### guard

> [S3.4](/spec/types/#s3.4) · Guards are a **closed, enumerated set** — `%based` (value < 2⁶⁴ − 2³² + 1, the Goldilocks prime), `%byte` (< 256), `%unic` (a Unicode scalar, `0x0`–`0x10FFFF`), `%loob` (< 2), `%term` (a valid Hoon term). **Five.** A guard is not a general refinement mechanism and never will be.

`docs/spec/types.md` [S3.4](/spec/types/#s3.4) · pinned by `t-mint-guard`, `t-nest-sa-p`, `t-nest-guard-loob-p`, `t-nest-guard-loob-n`

### option (`T?`)

> [L-95](/spec/language/#l-95) · `T?` is sugar for the `~`-form of that mechanism

`docs/spec/language.md` [L-95](/spec/language/#l-95) · pinned by `t-elab-unit-p`

### discriminable union

> [L-94](/spec/language/#l-94) · An untagged union's members must be erasure-disjoint

`docs/spec/language.md` [L-94](/spec/language/#l-94) · pinned by `t-elab-union-p`, `t-elab-union-n`

### void / `Never`

> [L-72](/spec/language/#l-72) · An empty enum is well-formed and uninhabited.

`docs/spec/language.md` [L-72](/spec/language/#l-72) · pinned by `t-bunt-void-n`, `t-bunt-or-void`

### lark

> [L-101](/spec/language/#l-101) · The lark is the only way into an ANONYMOUS product.

`docs/spec/language.md` [L-101](/spec/language/#l-101) · pinned by `t-lark-expr`

### axis

> [L-103](/spec/language/#l-103) · The general form is `p.+5`

`docs/spec/language.md` [L-103](/spec/language/#l-103) · pinned by `t-lark-atom-n`

### singleton

> [L-133](/spec/language/#l-133) · A singleton never survives a CALL boundary

`docs/spec/language.md` [L-133](/spec/language/#l-133) · pinned by `t-nest-sa-p`, `t-nest-sing-p`, `t-nest-sing-n`

### spaced minus

> [L-109](/spec/language/#l-109) · Binary `-` is SPACED ON BOTH SIDES.

`docs/spec/language.md` [L-109](/spec/language/#l-109) · pinned by `t-minus-glued-l`, `t-minus-glued-r`, `t-minus-spaced`

### glued hyphen

> [L-59](/spec/language/#l-59) · Names admit glued hyphens, Hoon-Term-style.

`docs/spec/language.md` [L-59](/spec/language/#l-59) · pinned by `t-term-hyphen`

### cast (`as`)

> [L-120](/spec/language/#l-120) · `as` is STATIC.

`docs/spec/language.md` [L-120](/spec/language/#l-120) · pinned by `t-mint-cast`, `t-run-cast`, `t-err-chars-cast`

### trait

> [L-62](/spec/language/#l-62) · A trait's methods carry full signatures

`docs/spec/language.md` [L-62](/spec/language/#l-62) · pinned by `t-decl-op-gen`

### impl

> [L-64](/spec/language/#l-64) · An impl supplies the arguments as a first glued group

`docs/spec/language.md` [L-64](/spec/language/#l-64) · pinned by `t-class-ptrait`, `t-err-class-ptrait`

### visibility

> [L-19](/spec/language/#l-19) · Visibility is module-scoped

`docs/spec/language.md` [L-19](/spec/language/#l-19)

### import (FFI)

> [L-171](/spec/language/#l-171) · `import <lib>;` brings a Hoon-compiled library into scope as FFI.

`docs/spec/language.md` [L-171](/spec/language/#l-171) · pinned by `t-run-import`, `t-run-import-dec`, `t-run-import-mix`, `t-mint-import-unknown`

### emission order

> [L-160](/spec/language/#l-160) · EMISSION ORDER is a jet-correctness requirement

`docs/spec/language.md` [L-160](/spec/language/#l-160) · pinned by `t-jdict-cross-multi`, `t-run-match-order`

### prelude

> [R-81](/spec/runtime/#r-81) · The prelude carries only what is TRUE IN EVERY WORLD Jock targets.

`docs/spec/runtime.md` [R-81](/spec/runtime/#r-81) · pinned by `t-halo-blessed`, `t-halo-abi-moved`

### ABI

> [R-9](/spec/runtime/#r-9) · The ABI is FROZEN through 1.0, and APPEND is the one sanctioned change shape.

`docs/spec/runtime.md` [R-9](/spec/runtime/#r-9) · pinned by `t-fabi-frozen`

### wilt

> [R-7](/spec/runtime/#r-7) · Wilts are emitted UNCONDITIONALLY

`docs/spec/runtime.md` [R-7](/spec/runtime/#r-7)

### jet drift

> [R-6](/spec/runtime/#r-6) · Jet drift is a CI diff, not a runtime mystery.

`docs/spec/runtime.md` [R-6](/spec/runtime/#r-6) · pinned by `t-jres-transitive`, `t-jres-unimported`

### roof

> [R-25](/spec/runtime/#r-25) · The roof answers `T??`, which is [R-24](/spec/runtime/#r-24)'s gate type with no glue.

`docs/spec/runtime.md` [R-25](/spec/runtime/#r-25) · pinned by `t-roof-shape-answer`, `t-roof-shape-absent`

### scry gate

> [R-24](/spec/runtime/#r-24) · The normative scry gate is `(*, *) -> T??`

`docs/spec/runtime.md` [R-24](/spec/runtime/#r-24) · pinned by `t-fabi-frozen`

### opcode

> [N-19](/spec/nockasm/#n-19) · Twenty-one is the count because `%scry` joined.

`docs/spec/nockasm.md` [N-19](/spec/nockasm/#n-19) · pinned by `t-nx-scry-p`, `t-nx-law-scry-p`, `t-nx-unkop-n`
