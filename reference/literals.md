# Literals and names

Every literal form Jock can spell, the aura each carries, and the names the language reserves for its own types. Companion to [keywords](../keywords/) and [refusal tags](../tags/).

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` in the compiler repo writes this page.
>
> channel `%rc` · commit `c8aac24` (sigilante/spec-recomposition) · corpus 1055 vectors · 2026-10-27

## The literal inventory

`language.md` L-77 — which says the table *is* the inventory, and that the `$jatom` mold in `sur/jock.hoon` must match it. Projected verbatim. The Example column is the spec’s own; the programs extracted from the corpus are in the Rules section of this page.

| Form | Aura | Example |
|---|---|---|
| decimal | `@` (number) | `42`, `1_024` — underscore grouping (OPEN-11); `.` is never a digit separator |
| hexadecimal | Hex | `0x2a` |
| signed | Int | `+42`, `-42` — ZigZag. Rules L-6 to L-16 below |
| float | Float64 (`@rd`) | `3.14` — digit-dot-digit, both sides required, ≤ 15 digits; rounding pinned `%n`, no mode surface. Float16/32/128 pend need |
| boolean | `Bool` (logical) | `true`, `false` — the beta `?` type spelling is retired (OPEN-2) |
| char/cord | chars | `'a'` |
| string | String | `"hello"` |
| term constant | (constant atom) | `%foo` — tag spellings match `[a-z][a-z0-9]*`; `%1` is the numeric constant 1 |
| date / span | Date / Span | unspecified — L-78 |
| path | Path | indicative `/a/b/c` — L-78 |
| interpolated string | String | `"x = {x}"`. Rules L-26 to L-32 below |
| list | List<T> | `[1, 2, 3]`, `[]` empty — KERNEL form, typed nominally: `List<join of widened elements>` (heterogeneous elements are a join error); `[]` stays sing-null, nesting into every `List<T>` by N13; against a wanted `List<T>` the elements check against `T` directly (at parameterized traits) |
| map | Map<K->V> | `[1 -> 100, 2 -> 200]` — brackets, told from a list by the arrow; `[->]` is the empty map |
| set | Set<T> | `Set<@>([1, 2, 3])` — CONSTRUCTED, not spelled; `Set<@>()` is empty |
| tuple | product | `(a, b, c)` |

**L-78:** `Date`, `Span` and `Path` exist as *types*, but what a literal of one looks like is **unspecified** — the `/a/b/c` in the inventory table is indicative, not normative. A program needing one constructs it. That rule is itself `⟨none — UNPINNED⟩`.

## Rules

Each rule as `language.md` states it, followed by a program from one of the vectors that rule itself cites — so the example is chosen by the spec and extracted from the corpus, not picked by this generator.

### L-77 · The table below is the literal inventory

```jock
"hi" 'ab'
```

from `t-lex-str-p` (`%lex`, `%pos`) · also cites `t-sint-lit`

### L-78 · Date, span and path literals have no settled surface spelling.

⟨none — UNPINNED⟩ — the spec states this rule and no corpus vector pins it.

### L-26 · `{expr}` renders through `.show()`

```jock
let a = 1; "{a a}"
```

from `t-parse-interp` (`%parse`, `%err`)

### L-27 · `{{` and `}}` are literal braces

```jock
"lit {{x}} ok"
```

from `t-text-interp-esc` (`%text`, `%pos`)

### L-28 · A backslash escape is one BYTE, written as two hex digits.

```jock
"back\\slash"
```

from `t-str-esc-backslash` (`%text`, `%pos`) · also cites `t-str-esc-newline`, `t-str-esc-tab`, `t-str-esc-upper`, `t-str-esc-short`

### L-29 · Anything else after a backslash refuses

```jock
"a\zzb"
```

from `t-str-esc-bad` (`%text`, `%err`)

### L-30 · Per-byte escapes are what settle Unicode.

```jock
"caf\c3\a9"
```

from `t-str-esc-utf8` (`%text`, `%pos`)

### L-31 · A fragment is a single expression.

```jock
"a{"b"}c"
```

from `t-err-interp-str` (`%text`, `%err`) · also cites `t-err-interp-open`, `t-err-interp-brace`

### L-32 · Comment markers inside a string are literal text.

⟨none — UNPINNED⟩ — the spec states this rule and no corpus vector pins it.

### L-6 · Int is ZigZag `@s`.

```jock
+42 as @
```

from `t-sint-lit` (`%text`, `%pos`)

### L-7 · An Int literal is a sign glued to a decimal, in operand position.

```jock
+42 as @
```

from `t-sint-lit` (`%text`, `%pos`) · also cites `t-sint-lit-neg`, `t-sint-lit-zero`

### L-8 · The glued sign cannot be mistaken for arithmetic

```jock
let a = 5; a +42
```

from `t-sint-not-add` (`%text`, `%pos`)

### L-9 · An Int literal is a primary

⟨none — UNPINNED⟩ — the spec states this rule and no corpus vector pins it.

### L-10 · The near-misses refuse, each with its own tag.

```jock
`
```

from `t-lex-stray-n` (`%lex`, `%err`) · also cites `t-minus-spaced`, `t-minus-glued-l`, `t-minus-glued-r`

### L-11 · Arithmetic and comparison ride the trait route

```jock
(-7 + +3) as @
```

from `t-sint-sum` (`%text`, `%pos`) · also cites `t-sint-sub`, `t-sint-mul`, `t-sint-cmp`, `t-sint-sum-mixed`

### L-12 · Casting INTO Int refuses through all three doors

```jock
42 as Int
```

from `t-sint-cast` (`%text`, `%err`) · also cites `t-sint-castp`, `t-sint-castq`, `t-sint-castx`, `t-cast-sint-out`, `t-cast-sint-deep`, `t-cast-sint-out-deep`

### L-13 · Ingestion is the one sanctioned soft use.

```jock
let v = eval(83, (0, 1)); (v as! Int) as @
```

from `t-sint-ingest` (`%text`, `%pos`) · also cites `t-sint-ingestp`

### L-14 · Conversion from a known nat is a function, not a cast.

```jock
import hoon; (hoon.uint(+5), (hoon.sint(5) as @, hoon.sabs(-42)))
```

from `t-sint-conv` (`%text`, `%pos`) · also cites `t-sint-uint-neg`

### L-15 · `Int -> @` is general, and is a deliberate footgun.

⟨none — UNPINNED⟩ — the spec states this rule and no corpus vector pins it.

### L-16 · Division truncates toward zero

```jock
(-7 / +2) as @
```

from `t-sint-div` (`%text`, `%pos`) · also cites `t-sint-rem`, `t-sint-dul`

### L-79 · Separators are commas everywhere

```jock
struct P { x: @, y: @ } let p = P(x: 1, y: 2); p.x
```

from `t-arc-ctor` (`%text`, `%pos`)

### L-80 · A trailing comma is permitted

⟨none — UNPINNED⟩ — the spec states this rule and no corpus vector pins it.

### L-81 · A braced declaration needs no terminator.

```jock
func inc(x: @) -> @ { x + 1 } inc(41)
```

from `t-arc-decl-nosemi` (`%text`, `%pos`) · also cites `t-arc-term-semi`

### L-82 · Data shapes take commas; signatures take semicolons.

```jock
enum C { red, green } let c = C.green; match c { .red => 1, .green => 2, }
```

from `t-arc-enum` (`%text`, `%pos`)

### L-83 · The last separator is optional; the ones between are not.

```jock
struct A { n: @ }; class C(A) { f(self: C) -> @ { self.n } g(self: C) -> @ { self.n }; }; 0
```

from `t-parse-method-nosep` (`%parse`, `%err`) · also cites `t-text-method-nosemi`, `t-parse-match-nosep`

### L-84 · `match` arms are comma-separated

```jock
match a { 1 => 0, _ => 84 }
```

from `t-parse-match-nocomma` (`%parse`, `%pos`) · also cites `t-parse-match-nosep`, `t-arc-patt-bare`

### L-85 · Literal-ness is lexical; constancy is a judgment.

⟨none — UNPINNED⟩ — the spec states this rule and no corpus vector pins it.

Of 27 rules in this section, 21 cite at least one vector and 6 are marked `⟨none — UNPINNED⟩`.

## Aura names

`language.md` L-97 — the *utterable* aura set: the names a program may write, each mapping to a `$jatom-type`. The semantic aura vocabulary is open-ended; this is the spellable part of it. Projected verbatim.

| Surface | `$jatom-type` | Notes |
|---|---|---|
| `@`, `Atom` | `%$` | the any-aura atom (top of the aura order — the parser maps the surface spelling to `%$`) |
| `Nat` | `%number` | the aura a decimal **literal** carries, ordered *below* `Atom`. Every `Nat` is an `Atom`, so a signature written `@` takes one |
| `Bool` | `%logical` | `true` / `false`; beta `?` spelling retired (OPEN-2/17). The annotation resolves through the **boot alias**, not a bare parser mapping, so the `%loob` guard rides along |
| `Hex` | `%hex` |  |
| `Int` | `%sint` |  |
| `Float64`, `Float16`, `Float32`, `Float128` | `%real*` |  |
| `Byte` | `%chars` | one UTF-8 byte; resolves through the boot alias (the `%byte` guard rides along) |
| `UniChar` | `%chars` | one Unicode scalar, `0x0`–`0x10FFFF`. Shares `Byte`'s aura and refines it with a wider guard, so a `Byte` flows **into** a `UniChar` and a `UniChar` does not flow back. Nothing converts silently: a scalar is one-to-four bytes, so encoding is an explicit operation |
| `Date`, `Span` | `%date`, `%span` |  |
| `String`, `Path` | (jnoun) | noun types, not atoms |
| `*`, `Noun` | — | any noun (top) |
| `Base` | — | BasedAtom: atom < 2^64 − 2^32 + 1 (types.md S3.4; OPEN-4 resolved) |

## Builtin type names

The 41 names the lexer treats as type names. Read from the tmLanguage grammar’s `types-builtin` rule, which `tools/hilite.py` holds in agreement with the web highlighter’s own table on every push — the two have no mold to check against, so mutual agreement is the available invariant.

- **named in L-97** (17): `Atom` `Base` `Bool` `Byte` `Date` `Float128` `Float16` `Float32` `Float64` `Hex` `Int` `Nat` `Noun` `Path` `Span` `String` `UniChar` — note that table is the utterable set, not the atoms: it lists `String` and `Path` as noun types and `Noun`/`Base` as neither
- **not in L-97** (24): `Add` `Del` `Div` `Effect` `Eq` `Gt` `Gte` `Has` `Idx` `Kernel` `List` `Lt` `Lte` `Map` `Meas` `Mul` `Octs` `Put` `Roof` `Self` `Set` `Show` `Str` `Sub`

The second group is where this reference is still thin: container heads (`List`, `Map`, `Set`, `Octs`), the prelude traits (`Add`, `Sub`, `Eq`, `Show`, `Idx`, `Put`, `Meas`, `Has` and the comparison family) and the kernel types (`Kernel`, `Effect`, `Roof`, `Self`, `Str`). Nothing here yet says what each one is. `runtime.md` is their authority, and projecting it is the next slice (GENERATOR.md A5).

## Builtins

Only 2 names are builtin *functions* rather than types, which is worth stating plainly because the absence is unguessable (GENERATOR.md A6): everything else a program calls arrives through `import`.

- `peekContext`
- `peekUnder`
