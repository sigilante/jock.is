# Keywords

All 31 keywords Jock reserves, what each one does, and a working program that uses it. The counterpart to [refusal tags](../tags/), which is the same corpus read for what it rejects.

> **GENERATED — do not edit.** `tools/refgen.py` in the compiler repo writes this page.
>
> channel `%rc` · commit `026a52b` (sigilante/spec-recomposition) · corpus 1055 vectors · 2026-10-27

The keyword set is read from the `$keyword` mold in `sur/jock.hoon` — the lexer’s own authority, which `tools/hilite.py` holds the web highlighter to. A keyword cannot appear here without being in the language, or be in the language without appearing here.

|  | count |
|---|---:|
| keywords in the mold | 31 |
| usable, with a demonstrating program | 26 |
| usable, demonstrated by nothing | 3 |
| deliberately not usable | 2 |
| defined by at least one `language.md` rule | 31 |

## Syntactic slots

Which slot each keyword occupies, from the tmLanguage grammar’s three keyword groups — the only machine-readable statement of this in the tree. `tools/hilite.py` checks that the three **partition** the `$keyword` mold: disjoint, and summing to it.

- **declaration** (14): `alias` `class` `enum` `for` `func` `impl` `import` `is` `lambda` `let` `private` `struct` `trait` `var`
- **control** (11): `assert` `crash` `defer` `else` `eval` `if` `loop` `match` `print` `recur` `switch`
- **operator** (6): `and` `as` `in` `not` `or` `xor`

There is deliberately **no BNF here.** Jock’s parser is recursive descent (`parse.hoon`); no grammar artifact exists to project from, so a written-out grammar would be a second author of the syntax rather than a rendering of it — which is exactly how this reference’s predecessor acquired seven wrong tag names. A formal grammar is worth having and is expressible (the adjacency law needs glued and spaced `(` as *distinct terminals*, which the lexer’s `glu` flag already supplies), but it should arrive with the corpus as its acceptance suite — every source-bearing `%pos` vector parsing, every `%parse` and `%lex` refusal failing to — so that it is a lane and not a claim.

## Precedence

Twelve levels, tightest first — `language.md` L-107, which says the table *is* the rule. Projected from it verbatim.

| Level | Operators | Associativity |
|---|---|---|
| 1 | postfix: glued call `(`, glued index `[`, field `.`, lark `.<` `.>`, axis `.+n` (L-46 to L-51, L-98 to L-105) | left |
| 2 | `as`, `as?`, `as!` | left |
| 3 | `**` *(reserved — L-112)* | right |
| 4 | unary `-` *(reserved — L-112)* | — |
| 5 | `*` `/` `%` `×` `÷` `⊛` | left |
| 6 | `+` `-` (binary `-` is spaced — L-109) | left |
| 7 | `??` | right |
| 8 | `<` `>` `<=` `>=` `in` `∈` | none |
| 9 | `==` `!=` `===` `!==` | none |
| 10 | `not` | — |
| 11 | `and`, `xor` | left |
| 12 | `or` | left |

The comparisons at 8 and 9 are **non-associative** and must be parenthesized: `a < b < c` refuses `%parse-nonassoc` rather than returning a boolean surprise (L-108).

## Usable, and demonstrated by nothing

These work — verified by hand with `tools/jockc.sh` on 2026-10-27; this generator classifies, it does not probe — and no `%pos` vector exercises them. A test gap, and a documentation gap of the worst kind, because the compiler *recommends* them: `%lex-connective` refuses `&&` and `||` and points the user at `and` and `or`, so the did-you-mean names a spelling the corpus never runs. The refusal is pinned twice; what it advises is pinned zero times.

- `and` — language.md L-61, language.md L-107, language.md L-173, language.md L-178
- `or` — language.md L-61, language.md L-107, language.md L-173, language.md L-178
- `xor` — language.md L-61, language.md L-107, language.md L-173, language.md L-178

## Keywords

### `alias`

**declaration keyword.**

```
alias Foo is @; let x: Foo = 1; x
```

pinned by `t-arc-alias-is` · 6 vectors use this keyword

defined by: `language.md` L-22, `language.md` L-45, `language.md` L-61, `language.md` L-66, `language.md` L-81

### `and`

**operator keyword.** Precedence level 11 of 12 (left-associative), sharing it with `xor`.

**Usable, but no vector demonstrates it.** See above.

defined by: `language.md` L-61, `language.md` L-107, `language.md` L-173, `language.md` L-178

### `as`

**operator keyword.** Precedence level 2 of 12 (left-associative), sharing it with `as?`, `as!`.

```
+42 as @
```

pinned by `t-sint-lit` · 47 vectors use this keyword

defined by: `language.md` L-24, `language.md` L-61, `language.md` L-107, `language.md` L-120

### `assert`

**control keyword.**

*module*

```
func dbl(n: @) -> @ { n + n }; assert 1 == 1; func inc(n: @) -> @ { n + 1 };
```

*program*

```
import m; m.inc(41)
```

pinned by `t-jimp-assert` · 1 vector use this keyword

defined by: `language.md` L-61, `language.md` L-185

### `class`

**declaration keyword.**

```
struct BS<T> { v: T }; class Box<T>(BS<T>) { get(self: Self) -> T { self.v } }; Box( v: 5 ).get()
```

pinned by `t-text-class-gen` · 25 vectors use this keyword

defined by: `language.md` L-22, `language.md` L-45, `language.md` L-61, `language.md` L-146

### `crash`

**control keyword.**

```
enum Nope {}; func f(x: @) -> Nope { crash }; 1
```

pinned by `t-text-never` · 3 vectors use this keyword

defined by: `language.md` L-61, `language.md` L-182

### `defer`

**control keyword.**

**RESERVED.** Reserved in the lexer’s mold so that the parser recognises it and refuses with a diagnosis rather than an unbound name. Refuses `%parse-todo %defer` — parsed and refused;  not implemented for 1.0.

defined by: `language.md` L-61

### `else`

**control keyword.**

```
if 3 != 4 { 7 } else { 9 }
```

pinned by `t-eq-ne` · 30 vectors use this keyword

defined by: `language.md` L-61

### `enum`

**declaration keyword.**

```
enum Rec { leaf, cell(Rec, Rec) }; 0
```

pinned by `t-decl-fond-reorder` · 15 vectors use this keyword

defined by: `language.md` L-22, `language.md` L-45, `language.md` L-61, `language.md` L-69, `language.md` L-149, `language.md` L-170

### `eval`

**control keyword.**

```
(eval(42, (0, 1)) as? @) ?? 99
```

pinned by `t-text-qq` · 3 vectors use this keyword

defined by: `language.md` L-13, `language.md` L-61, `language.md` L-129, `language.md` L-183

### `for`

**declaration keyword.**

```
struct P { v: @ }; impl Show for P { show(self: P) -> String { "P!" }; }; let p = P( v: 1 ); "{p}"
```

pinned by `t-text-interp-user` · 20 vectors use this keyword

defined by: `language.md` L-61

### `func`

**declaration keyword.**

```
func<T> id(x: T) -> T { x }; id(42)
```

pinned by `t-text-gen` · 70 vectors use this keyword

defined by: `language.md` L-17, `language.md` L-20, `language.md` L-61, `language.md` L-87, `language.md` L-135, `language.md` L-136, `language.md` L-137, `language.md` L-139, `language.md` L-140, `language.md` L-143, `language.md` L-185

### `if`

**control keyword.**

```
if 3 != 4 { 7 } else { 9 }
```

pinned by `t-eq-ne` · 31 vectors use this keyword

defined by: `language.md` L-61, `language.md` L-185

### `impl`

**declaration keyword.**

```
struct P { v: @ }; impl Show for P { show(self: P) -> String { "P!" }; }; let p = P( v: 1 ); "{p}"
```

pinned by `t-text-interp-user` · 35 vectors use this keyword

defined by: `language.md` L-20, `language.md` L-45, `language.md` L-61

### `import`

**declaration keyword.**

```
import hoon; 20 + 22
```

pinned by `t-text-arith` · 60 vectors use this keyword

defined by: `language.md` L-61, `language.md` L-185

### `in`

**operator keyword.** Precedence level 8 of 12 (none-associative), sharing it with `<` `>` `<=` `>=`  `∈`.

```
let s = "in"; "[{s}]"
```

pinned by `t-text-interp-str` · 6 vectors use this keyword

defined by: `language.md` L-61, `language.md` L-73, `language.md` L-107, `language.md` L-108, `language.md` L-115, `language.md` L-173, `language.md` L-183

### `is`

**declaration keyword.**

```
alias Foo is @; let x: Foo = 1; x
```

pinned by `t-arc-alias-is` · 6 vectors use this keyword

defined by: `language.md` L-61, `language.md` L-69

### `lambda`

**declaration keyword.**

```
let f = lambda (x: @) -> @ { x * 10 }; hoon.lturn([1, 2, 3], f)
```

pinned by `t-list-turn-lambda` · 11 vectors use this keyword

defined by: `language.md` L-61

### `let`

**declaration keyword.**

```
let x = 1; x;
```

pinned by `t-arc-term-semi` · 174 vectors use this keyword

defined by: `language.md` L-20, `language.md` L-61, `language.md` L-129, `language.md` L-130, `language.md` L-131, `language.md` L-134, `language.md` L-185

### `loop`

**control keyword.**

```
import hoon; var b = 0; loop { if b == 5 { b } else { b = b + 1; recur } }
```

pinned by `t-text-loop` · 3 vectors use this keyword

defined by: `language.md` L-61, `language.md` L-87, `language.md` L-140, `language.md` L-185

### `match`

**control keyword.**

```
let a: @ = 3; match a { 1 => 0, _ => 84, }
```

pinned by `t-arc-arm-comma` · 20 vectors use this keyword

defined by: `language.md` L-61, `language.md` L-84, `language.md` L-101, `language.md` L-126, `language.md` L-148, `language.md` L-150, `language.md` L-151, `language.md` L-173, `language.md` L-185

### `not`

**operator keyword.** Precedence level 10 of 12 (—-associative), sharing it with nothing.

```
not a == b
```

pinned by `t-parse-not` · 1 vector use this keyword

defined by: `language.md` L-61, `language.md` L-107, `language.md` L-173, `language.md` L-178

### `or`

**operator keyword.** Precedence level 12 of 12 (left-associative), sharing it with nothing.

**Usable, but no vector demonstrates it.** See above.

defined by: `language.md` L-61, `language.md` L-107, `language.md` L-173, `language.md` L-178

### `print`

**control keyword.**

```
print("hi"); 42
```

pinned by `t-text-print` · 10 vectors use this keyword

defined by: `language.md` L-35, `language.md` L-61, `language.md` L-76

### `private`

**declaration keyword.**

```
private func dbl(n: @) -> @ { n + n }; dbl(21)
```

pinned by `t-text-private-func` · 5 vectors use this keyword

defined by: `language.md` L-17, `language.md` L-25, `language.md` L-37, `language.md` L-61

### `recur`

**control keyword.**

```
import hoon; var b = 0; loop { if b == 5 { b } else { b = b + 1; recur } }
```

pinned by `t-text-loop` · 3 vectors use this keyword

defined by: `language.md` L-61, `language.md` L-140, `language.md` L-152

### `struct`

**declaration keyword.**

```
struct Q { w: @ }; Q( w: 9 ).w
```

pinned by `t-text-dot-slit` · 65 vectors use this keyword

defined by: `language.md` L-45, `language.md` L-61

### `switch`

**control keyword.**

**RETIRED.** Reserved in the lexer’s mold so that the parser recognises it and refuses with a diagnosis rather than an unbound name. Refuses `%parse-switch-gone` — use `match`, which replaced it.

defined by: `language.md` L-61, `language.md` L-151, `language.md` L-183

### `trait`

**declaration keyword.**

```
trait Tw { tw(self: Self) -> @; } struct B { v: @ } impl Tw for B { tw(self: B) -> @ { self.v } } let b = B(v: 7); b.tw()
```

pinned by `t-arc-impl-for` · 15 vectors use this keyword

defined by: `language.md` L-22, `language.md` L-45, `language.md` L-61

### `var`

**declaration keyword.**

```
var b = 1; b = 3; b
```

pinned by `t-var-widen` · 11 vectors use this keyword

defined by: `language.md` L-61, `language.md` L-129, `language.md` L-130, `language.md` L-131, `language.md` L-132, `language.md` L-134

### `xor`

**operator keyword.** Precedence level 11 of 12 (left-associative), sharing it with `and`.

**Usable, but no vector demonstrates it.** See above.

defined by: `language.md` L-61, `language.md` L-107, `language.md` L-173, `language.md` L-178

## Punctuators

From the `$jpunc` mold, the same authority as the keywords.

- **single byte** (29): `!` `#` `$` `%` `&` `(` `)` `*` `+` `,` `-` `.` `/` `:` `;` `<` `=` `>` `?` `@` `[` `\` `]` `^` `_` `{` `|` `}` `~`
- **two byte** (3): `->` `..` `=>`
- **glyphs** (14): `uni-ast` `uni-cap` `uni-cup` `uni-div` `uni-dot` `uni-in` `uni-mul` `uni-ominus` `uni-oplus` `uni-otimes` `uni-pm` `uni-ring` `uni-sub` `uni-sup`

The glyphs are ASCII sugar — each has an ASCII spelling that is the normal way to write it. Emitting that mapping needs the byte tables in `lex.hoon`, and is not done yet.
