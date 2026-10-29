# Keywords

All 30 keywords Jock reserves, what each one does, and a working program that uses it. The counterpart to [refusal tags](/reference/tags/), which is the same corpus read for what it rejects.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` in the compiler repo writes this page.
>
> channel `%rc` · commit `0ea53e5` (sigilante/pre-rc-sweep) · corpus 1155 vectors · 2026-10-30

Each keyword below carries its **class** — kernel or sugar, one of the language’s four design principles — and **what it does**, both projected from the keyword inventory at [L-61](/spec/language/#l-61), whose table is normative. Where a rule states the keyword’s behaviour, that rule is quoted; where none does, the section says so rather than citing a rule that merely mentions it.

The keyword set is read from the `$keyword` mold in `sur/jock.hoon` — the lexer’s own authority, which `tools/hilite.py` holds the web highlighter to. A keyword cannot appear here without being in the language, or be in the language without appearing here.

|  | count |
|---|---:|
| keywords in the mold | 30 |
| usable, with a demonstrating program | 29 |
| usable, demonstrated by nothing | 0 |
| deliberately not usable | 1 |
| with a rule that states what it does | 12 |
| specified only by their inventory row | 18 |

## Syntactic slots

Which slot each keyword occupies, from the tmLanguage grammar’s three keyword groups — the only machine-readable statement of this in the tree. `tools/hilite.py` checks that the three **partition** the `$keyword` mold: disjoint, and summing to it.

- **declaration** (14): `alias` `class` `enum` `for` `func` `impl` `import` `is` `lambda` `let` `private` `struct` `trait` `var`
- **control** (10): `assert` `crash` `defer` `else` `eval` `if` `loop` `match` `print` `recur`
- **operator** (6): `and` `as` `in` `not` `or` `xor`

There is deliberately **no BNF here.** Jock’s parser is recursive descent (`parse.hoon`); no grammar artifact exists to project from, so a written-out grammar would be a second author of the syntax rather than a rendering of it — which is exactly how this reference’s predecessor acquired seven wrong tag names. A formal grammar is worth having and is expressible (the adjacency law needs glued and spaced `(` as *distinct terminals*, which the lexer’s `glu` flag already supplies), but it should arrive with the corpus as its acceptance suite — every source-bearing `%pos` vector parsing, every `%parse` and `%lex` refusal failing to — so that it is a lane and not a claim.

## Precedence

13 levels, tightest first — `language.md` [L-107](/spec/language/#l-107), which says the table *is* the rule. Projected from it verbatim.

| Level | Operators | Associativity |
|---|---|---|
| 1 | postfix: glued call `(`, glued index `[`, field `.`, lark `.<` `.>`, axis `.+n` ([L-46](/spec/language/#l-46) to [L-51](/spec/language/#l-51), [L-98](/spec/language/#l-98) to [L-105](/spec/language/#l-105)) | left |
| 2 | `as`, `as?`, `as!` | left |
| 3 | `**` *(reserved — [L-112](/spec/language/#l-112))* | right |
| 4 | unary `-` *(reserved — [L-112](/spec/language/#l-112))* | — |
| 5 | `*` `/` `%` `×` `÷` `⊛` `∩` `⊗` `∘` `·` | left |
| 6 | `+` `-` (binary `-` is spaced — [L-109](/spec/language/#l-109)) `∪` `⊕` `⊖` `±` | left |
| 7 | `??` | right |
| 8 | `<` `>` `<=` `>=` `in` `∈` `⊂` `⊃` | none |
| 9 | `==` `!=` `===` `!==` | none |
| 10 | `not` | — |
| 11 | `and` | left |
| 12 | `xor` | left |
| 13 | `or` | left |

The comparisons at 8 and 9 are **non-associative** and must be parenthesized: `a < b < c` refuses `%parse-nonassoc` rather than returning a boolean surprise ([L-108](/spec/language/#l-108)).

Every level of this table is drawn as a railroad diagram on [the surface grammar](/reference/grammar/), projected from the parse arm that implements it — including the dead ends, which is where the non-associativity above is visible rather than stated.

## Keywords

### `alias`

**declaration keyword.**

**Kernel (declaration).** `alias New is Old`. Rules [L-67](/spec/language/#l-67) to [L-69](/spec/language/#l-69) below

**No rule in `language.md` states what `alias` does.** The line above is its row in the keyword inventory, and that row is the whole of its specification. It is named in passing by [L-22](/spec/language/#l-22), [L-45](/spec/language/#l-45), [L-61](/spec/language/#l-61), [L-66](/spec/language/#l-66), [L-81](/spec/language/#l-81).

```jock
alias Foo is @; let x: Foo = 1; x
```

pinned by `t-arc-alias-is` · 7 vectors use this keyword

### `and`

**operator keyword.** Precedence level 11 of 13 (left-associative), sharing it with nothing.

**Sugar.** word connectives (OPEN-13): `and`/`or` → nested `%if` (short-circuit); `xor`/`not` → `%if`/stdlib rewrites

**No rule in `language.md` states what `and` does.** The line above is its row in the keyword inventory, and that row is the whole of its specification. It is named in passing by [L-61](/spec/language/#l-61), [L-107](/spec/language/#l-107), [L-173](/spec/language/#l-173), [L-178](/spec/language/#l-178).

```jock
true and true
```

pinned by `t-logic-and-tt` · 8 vectors use this keyword

### `as`

**operator keyword.** Precedence level 2 of 13 (left-associative), sharing it with `as?`, `as!`.

**Kernel.** cast: `%cast` (particle of expression grammar, not a standalone form)

Specified by [L-120](/spec/language/#l-120):

> [L-120](/spec/language/#l-120) · `as` is STATIC.

Also named by [L-12](/spec/language/#l-12), [L-24](/spec/language/#l-24), [L-61](/spec/language/#l-61), [L-107](/spec/language/#l-107).

```jock
+42 as @
```

pinned by `t-sint-lit` · 52 vectors use this keyword

### `assert`

**control keyword.**

**Sugar.** → `if cond { next } else { crash }`

**No rule in `language.md` states what `assert` does.** The line above is its row in the keyword inventory, and that row is the whole of its specification. It is named in passing by [L-61](/spec/language/#l-61), [L-185](/spec/language/#l-185).

*module*

```jock
func dbl(n: @) -> @ { n + n }; assert 1 == 1; func inc(n: @) -> @ { n + 1 };
```

*program*

```jock
import m; m.inc(41)
```

pinned by `t-jimp-assert` · 1 vector use this keyword

### `class`

**declaration keyword.**

**Kernel (declaration).** `%decl`: registration + method minting; standalone instances are `impl Trait for Type { … };` (types.md [S9.4](/spec/types/#s9.4)/S9.5)

Specified by [L-146](/spec/language/#l-146):

> [L-146](/spec/language/#l-146) · `class` keeps PARENTHESES for its state struct

Also named by [L-22](/spec/language/#l-22), [L-45](/spec/language/#l-45), [L-61](/spec/language/#l-61).

```jock
struct BS<T> { v: T }; class Box<T>(BS<T>) { get(self: Self) -> T { self.v } }; Box( v: 5 ).get()
```

pinned by `t-text-class-gen` · 25 vectors use this keyword

### `crash`

**control keyword.**

**Kernel.** `%crash` (Nock `[0 0]`)

**No rule in `language.md` states what `crash` does.** The line above is its row in the keyword inventory, and that row is the whole of its specification. It is named in passing by [L-61](/spec/language/#l-61), [L-178](/spec/language/#l-178), [L-182](/spec/language/#l-182).

```jock
enum Nope {}; func f(x: @) -> Nope { crash }; 1
```

pinned by `t-text-never` · 4 vectors use this keyword

### `defer`

**control keyword.**

****reserved, unimplemented**.** the keyword lexes and the parser then refuses `%parse-todo %defer` unconditionally (`parse.hoon`); `sugar.hoon` carries a `%defer` arm no program can reach. Reserved on the same footing as `$(…)` re-entry, so the meaning can land without reinterpreting any legal program.

Specified by [L-188](/spec/language/#l-188):

> [L-188](/spec/language/#l-188) · `defer` is the one reserved word.

Also named by [L-61](/spec/language/#l-61).

**RESERVED.** Reserved in the lexer’s mold so that the parser recognises it and refuses with a diagnosis rather than an unbound name. Refuses `%parse-todo %defer` — parsed and refused;  not implemented for 1.0.

### `else`

**control keyword.**

**Kernel.** `%if`; `else if` chains flatten to nested `%if` at parse

**No rule in `language.md` states what `else` does.** The line above is its row in the keyword inventory, and that row is the whole of its specification. It is named in passing by [L-61](/spec/language/#l-61).

```jock
if 3 != 4 { 7 } else { 9 }
```

pinned by `t-eq-ne` · 33 vectors use this keyword

### `enum`

**declaration keyword.**

**Kernel (declaration).** `%decl`: tagged sum. Rules [L-70](/spec/language/#l-70) to [L-73](/spec/language/#l-73) below

**No rule in `language.md` states what `enum` does.** The line above is its row in the keyword inventory, and that row is the whole of its specification. It is named in passing by [L-22](/spec/language/#l-22), [L-45](/spec/language/#l-45), [L-61](/spec/language/#l-61), [L-69](/spec/language/#l-69), [L-149](/spec/language/#l-149), [L-170](/spec/language/#l-170).

```jock
enum Rec { leaf, cell(Rec, Rec) }; 0
```

pinned by `t-decl-fond-reorder` · 15 vectors use this keyword

### `eval`

**control keyword.**

**Kernel.** Nock evaluation: `%eval` (Nock 2)

Specified by [L-129](/spec/language/#l-129):

> [L-129](/spec/language/#l-129) · `eval` is CALL-SHAPED

Also named by [L-13](/spec/language/#l-13), [L-61](/spec/language/#l-61), [L-188](/spec/language/#l-188).

```jock
(eval(42, (0, 1)) as? @) ?? 99
```

pinned by `t-text-qq` · 3 vectors use this keyword

### `for`

**declaration keyword.**

**Kernel (declaration).** separates trait from target in `impl Area for Shape`; with a parameterized trait the arguments ride on the trait name, `impl<T> Idx<@, T> for List<T>`

**No rule in `language.md` states what `for` does.** The line above is its row in the keyword inventory, and that row is the whole of its specification. It is named in passing by [L-61](/spec/language/#l-61).

```jock
struct P { v: @ }; impl Show for P { show(self: P) -> String { "P!" }; }; let p = P( v: 1 ); "{p}"
```

pinned by `t-text-interp-user` · 20 vectors use this keyword

### `func`

**declaration keyword.**

**Kernel.** named (recursive) function: `%func` — kernel by decision (OPEN-10 resolved): one lowering rule owns self-name binding, recursion, and the generics binders

Specified by [L-17](/spec/language/#l-17), [L-20](/spec/language/#l-20), [L-135](/spec/language/#l-135), [L-136](/spec/language/#l-136), [L-137](/spec/language/#l-137), [L-140](/spec/language/#l-140):

> [L-17](/spec/language/#l-17) · `private` marks the next declaration or `func` unexported.

> [L-20](/spec/language/#l-20) · It takes only a declaration or a `func`.

> [L-135](/spec/language/#l-135) · A named `func` is recursive by construction

> [L-136](/spec/language/#l-136) · A `func` requires an ANNOTATED return

> [L-137](/spec/language/#l-137) · Adjacent `func`s form a MUTUAL-RECURSION GROUP.

> [L-140](/spec/language/#l-140) · `recur` re-enters only the innermost enclosing `func` or `loop`.

Also named by [L-61](/spec/language/#l-61), [L-87](/spec/language/#l-87), [L-139](/spec/language/#l-139), [L-143](/spec/language/#l-143), [L-185](/spec/language/#l-185).

```jock
func<T> id(x: T) -> T { x }; id(42)
```

pinned by `t-text-gen` · 78 vectors use this keyword

### `if`

**control keyword.**

**Kernel.** `%if`; `else if` chains flatten to nested `%if` at parse

**No rule in `language.md` states what `if` does.** The line above is its row in the keyword inventory, and that row is the whole of its specification. It is named in passing by [L-61](/spec/language/#l-61), [L-185](/spec/language/#l-185).

```jock
if 3 != 4 { 7 } else { 9 }
```

pinned by `t-eq-ne` · 34 vectors use this keyword

### `impl`

**declaration keyword.**

**Kernel (declaration).** `%decl`: registration + method minting; standalone instances are `impl Trait for Type { … };` (types.md [S9.4](/spec/types/#s9.4)/S9.5)

**No rule in `language.md` states what `impl` does.** The line above is its row in the keyword inventory, and that row is the whole of its specification. It is named in passing by [L-20](/spec/language/#l-20), [L-45](/spec/language/#l-45), [L-61](/spec/language/#l-61).

```jock
struct P { v: @ }; impl Show for P { show(self: P) -> String { "P!" }; }; let p = P( v: 1 ); "{p}"
```

pinned by `t-text-interp-user` · 35 vectors use this keyword

### `import`

**declaration keyword.**

**Kernel.** `%import`; resolution happens at environment construction, not parse

**No rule in `language.md` states what `import` does.** The line above is its row in the keyword inventory, and that row is the whole of its specification. It is named in passing by [L-61](/spec/language/#l-61), [L-185](/spec/language/#l-185).

```jock
import hoon; 20 + 22
```

pinned by `t-text-arith` · 72 vectors use this keyword

### `in`

**operator keyword.** Precedence level 8 of 13 (non-associative), sharing it with `<` `>` `<=` `>=`  `∈` `⊂` `⊃`.

**Sugar.** **membership**. Rules [L-74](/spec/language/#l-74) to [L-76](/spec/language/#l-76) below

**No rule in `language.md` states what `in` does.** The line above is its row in the keyword inventory, and that row is the whole of its specification. It is named in passing by [L-61](/spec/language/#l-61), [L-73](/spec/language/#l-73), [L-107](/spec/language/#l-107), [L-108](/spec/language/#l-108), [L-115](/spec/language/#l-115), [L-173](/spec/language/#l-173), [L-188](/spec/language/#l-188).

```jock
let s = "in"; "[{s}]"
```

pinned by `t-text-interp-str` · 6 vectors use this keyword

### `is`

**declaration keyword.**

**Kernel (declaration).** `alias New is Old`. Rules [L-67](/spec/language/#l-67) to [L-69](/spec/language/#l-69) below

Specified by [L-69](/spec/language/#l-69):

> [L-69](/spec/language/#l-69) · The `is` is load-bearing.

Also named by [L-61](/spec/language/#l-61).

```jock
alias Foo is @; let x: Foo = 1; x
```

pinned by `t-arc-alias-is` · 7 vectors use this keyword

### `lambda`

**declaration keyword.**

**Kernel.** anonymous function value: `%lambda`

**No rule in `language.md` states what `lambda` does.** The line above is its row in the keyword inventory, and that row is the whole of its specification. It is named in passing by [L-61](/spec/language/#l-61).

```jock
peekUnder(lambda (r: *, p: *) -> * { (0, 0) }, 0)
```

pinned by `t-roof-lift-absent` · 17 vectors use this keyword

### `let`

**declaration keyword.**

**Kernel.** immutable binding: `%let`

Specified by [L-134](/spec/language/#l-134):

> [L-134](/spec/language/#l-134) · Destructuring `let` is admitted

Also named by [L-20](/spec/language/#l-20), [L-61](/spec/language/#l-61), [L-129](/spec/language/#l-129), [L-130](/spec/language/#l-130), [L-131](/spec/language/#l-131), [L-171](/spec/language/#l-171), [L-185](/spec/language/#l-185).

```jock
let x = 1; x;
```

pinned by `t-arc-term-semi` · 187 vectors use this keyword

### `loop`

**control keyword.**

**Kernel.** recursion point / re-entry: `%loop` / `%recur`, both optionally labeled (`loop outer { … recur outer }`) — note no `;` before the closing brace; a trailing separator there refuses `%parse-expected %'}'`

Specified by [L-140](/spec/language/#l-140):

> [L-140](/spec/language/#l-140) · `recur` re-enters only the innermost enclosing `func` or `loop`.

Also named by [L-61](/spec/language/#l-61), [L-87](/spec/language/#l-87), [L-185](/spec/language/#l-185).

```jock
import hoon; var b = 0; loop { if b == 5 { b } else { b = b + 1; recur } }
```

pinned by `t-text-loop` · 4 vectors use this keyword

### `match`

**control keyword.**

**Kernel.** pattern/type discrimination: `%match`

Specified by [L-84](/spec/language/#l-84), [L-148](/spec/language/#l-148):

> [L-84](/spec/language/#l-84) · `match` arms are comma-separated

> [L-148](/spec/language/#l-148) · `match` is the eliminator, and `$patt` is closed

Also named by [L-61](/spec/language/#l-61), [L-101](/spec/language/#l-101), [L-126](/spec/language/#l-126), [L-150](/spec/language/#l-150), [L-151](/spec/language/#l-151), [L-173](/spec/language/#l-173), [L-185](/spec/language/#l-185).

```jock
let a: @ = 3; match a { 1 => 0, _ => 84, }
```

pinned by `t-arc-arm-comma` · 20 vectors use this keyword

### `not`

**operator keyword.** Precedence level 10 of 13 (nothing to associate, being prefix), sharing it with nothing.

**Sugar.** word connectives (OPEN-13): `and`/`or` → nested `%if` (short-circuit); `xor`/`not` → `%if`/stdlib rewrites

**No rule in `language.md` states what `not` does.** The line above is its row in the keyword inventory, and that row is the whole of its specification. It is named in passing by [L-61](/spec/language/#l-61), [L-107](/spec/language/#l-107), [L-173](/spec/language/#l-173), [L-178](/spec/language/#l-178).

```jock
not true
```

pinned by `t-logic-not-t` · 4 vectors use this keyword

### `or`

**operator keyword.** Precedence level 13 of 13 (left-associative), sharing it with nothing.

**Sugar.** word connectives (OPEN-13): `and`/`or` → nested `%if` (short-circuit); `xor`/`not` → `%if`/stdlib rewrites

**No rule in `language.md` states what `or` does.** The line above is its row in the keyword inventory, and that row is the whole of its specification. It is named in passing by [L-61](/spec/language/#l-61), [L-107](/spec/language/#l-107), [L-173](/spec/language/#l-173), [L-178](/spec/language/#l-178).

```jock
true or true
```

pinned by `t-logic-or-tt` · 6 vectors use this keyword

### `print`

**control keyword.**

**Kernel.** `print e; k` / `print(e, N); k`. Rules [L-33](/spec/language/#l-33) to [L-37](/spec/language/#l-37) below

**No rule in `language.md` states what `print` does.** The line above is its row in the keyword inventory, and that row is the whole of its specification. It is named in passing by [L-35](/spec/language/#l-35), [L-61](/spec/language/#l-61), [L-76](/spec/language/#l-76).

```jock
print("hi"); 42
```

pinned by `t-text-print` · 10 vectors use this keyword

### `private`

**declaration keyword.**

**Kernel (declaration).** marks the next declaration or `func` unexported. Rules [L-17](/spec/language/#l-17) to [L-25](/spec/language/#l-25) below

Specified by [L-17](/spec/language/#l-17):

> [L-17](/spec/language/#l-17) · `private` marks the next declaration or `func` unexported.

Also named by [L-25](/spec/language/#l-25), [L-37](/spec/language/#l-37), [L-61](/spec/language/#l-61).

```jock
private func dbl(n: @) -> @ { n + n }; dbl(21)
```

pinned by `t-text-private-func` · 5 vectors use this keyword

### `recur`

**control keyword.**

**Kernel.** recursion point / re-entry: `%loop` / `%recur`, both optionally labeled (`loop outer { … recur outer }`) — note no `;` before the closing brace; a trailing separator there refuses `%parse-expected %'}'`

Specified by [L-140](/spec/language/#l-140):

> [L-140](/spec/language/#l-140) · `recur` re-enters only the innermost enclosing `func` or `loop`.

Also named by [L-61](/spec/language/#l-61), [L-152](/spec/language/#l-152).

```jock
import hoon; var b = 0; loop { if b == 5 { b } else { b = b + 1; recur } }
```

pinned by `t-text-loop` · 4 vectors use this keyword

### `struct`

**declaration keyword.**

**Kernel (declaration).** `%decl`: def-registration in `+mint` (types.md [S9.1](/spec/types/#s9.1) — desugar has no environment, so declarations are one kernel form the parser emits directly)

**No rule in `language.md` states what `struct` does.** The line above is its row in the keyword inventory, and that row is the whole of its specification. It is named in passing by [L-45](/spec/language/#l-45), [L-61](/spec/language/#l-61).

```jock
struct Q { w: @ }; Q( w: 9 ).w
```

pinned by `t-text-dot-slit` · 70 vectors use this keyword

### `trait`

**declaration keyword.**

**Kernel (declaration).** `%decl`. Rules [L-62](/spec/language/#l-62) to [L-66](/spec/language/#l-66) below

**No rule in `language.md` states what `trait` does.** The line above is its row in the keyword inventory, and that row is the whole of its specification. It is named in passing by [L-22](/spec/language/#l-22), [L-45](/spec/language/#l-45), [L-61](/spec/language/#l-61).

```jock
trait Tw { tw(self: Self) -> @; } struct B { v: @ } impl Tw for B { tw(self: B) -> @ { self.v } } let b = B(v: 7); b.tw()
```

pinned by `t-arc-impl-for` · 15 vectors use this keyword

### `var`

**declaration keyword.**

**Kernel.** mutable binding: `%let` with `mut=%.y`; `%edit` targets only `var` bindings (OPEN-14)

Specified by [L-132](/spec/language/#l-132):

> [L-132](/spec/language/#l-132) · `var` widening is SHALLOW.

Also named by [L-61](/spec/language/#l-61), [L-129](/spec/language/#l-129), [L-130](/spec/language/#l-130), [L-131](/spec/language/#l-131), [L-134](/spec/language/#l-134).

```jock
var b = 1; b = 3; b
```

pinned by `t-var-widen` · 12 vectors use this keyword

### `xor`

**operator keyword.** Precedence level 12 of 13 (left-associative), sharing it with nothing.

**Sugar.** word connectives (OPEN-13): `and`/`or` → nested `%if` (short-circuit); `xor`/`not` → `%if`/stdlib rewrites

**No rule in `language.md` states what `xor` does.** The line above is its row in the keyword inventory, and that row is the whole of its specification. It is named in passing by [L-61](/spec/language/#l-61), [L-107](/spec/language/#l-107), [L-173](/spec/language/#l-173), [L-178](/spec/language/#l-178).

```jock
true xor true
```

pinned by `t-logic-xor-tt` · 6 vectors use this keyword

## Punctuators

From the `$jpunc` mold, the same authority as the keywords.

- **single byte** (29): `!` `#` `$` `%` `&` `(` `)` `*` `+` `,` `-` `.` `/` `:` `;` `<` `=` `>` `?` `@` `[` `\` `]` `^` `_` `{` `|` `}` `~`
- **two byte** (3): `->` `..` `=>`

## Glyphs

The 14 multi-byte punctuators, decoded from the LSB-first UTF-8 byte sequences in `+unis:lex` — which is how the lexer stores them, because a multibyte cord literal in compiler source is a compiler-dependent constant.

| Glyph | Punctuator | Codepoint | ASCII | Status |
|---|---|---|---|---|
| `×` | `%uni-mul` | U+00D7 | `*` | sugar for `*` |
| `÷` | `%uni-div` | U+00F7 | `/` | sugar for `/` |
| `±` | `%uni-pm` | U+00B1 | — | its own operator — no ASCII spelling |
| `⊕` | `%uni-oplus` | U+2295 | — | its own operator — no ASCII spelling |
| `⊗` | `%uni-otimes` | U+2297 | — | its own operator — no ASCII spelling |
| `⊖` | `%uni-ominus` | U+2296 | — | its own operator — no ASCII spelling |
| `∘` | `%uni-ring` | U+2218 | — | its own operator — no ASCII spelling |
| `·` | `%uni-dot` | U+00B7 | — | its own operator — no ASCII spelling |
| `∩` | `%uni-cap` | U+2229 | — | its own operator — no ASCII spelling |
| `∪` | `%uni-cup` | U+222A | — | its own operator — no ASCII spelling |
| `∈` | `%uni-in` | U+2208 | `in` | sugar for `in` |
| `⊂` | `%uni-sub` | U+2282 | — | its own operator — no ASCII spelling |
| `⊃` | `%uni-sup` | U+2283 | — | its own operator — no ASCII spelling |
| `⊛` | `%uni-ast` | U+229B | — | its own operator — no ASCII spelling |

> [!NOTE]
> **Only 3 of the 14 are sugar.** `+desugar` normalizes `×` to `*` and `÷` to `/`, and the parser reads `∈` as the `in` keyword. The other 11 are *deliberately* not normalized — each is its own operator with no pinned arm, so a library binds it or the program refuses `%mint-op`. Probed: `6 × 7` is `42`; `a ∩ b` refuses.

So a glyph with no ASCII column is not a typographic alternative to anything. It is an operator name that happens to be spelled with one non-ASCII character, and reaching for it commits you to an `impl` that binds it.

`language.md` [L-115](/spec/language/#l-115) (the three aliases), [L-116](/spec/language/#l-116) (the eleven trait-only operators) and L-107a (their precedence: multiplicative glyphs parse at station 5, additive at 6, relational at 8 — fixed at parse, so a library may give a glyph meaning but cannot move it).
