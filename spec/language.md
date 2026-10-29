# The Jock Language — Description

**Status: NORMATIVE.** This document states what Jock *is*. It
carries no chronology: when and why each rule became true is
[`docs/record/language-arc.md`](../record/language-arc.md), and
every rule that has one links to it.

Rules carry flat `L-n` ids. The ids are **append-only** — assigned
in the order they were written down, never in reading order, and
never renumbered, because `crates/`, `tests/` and `tools/` cite
them. Each rule names the corpus vectors that pin it, or says
`⟨none — UNPINNED⟩` so the gap is countable rather than invisible.

The surface syntax is settled, and the release may ship
zero-versioned precisely so it can settle further — so read the
tables below as current rather than as a contract. The molds in
`crates/jockc/hoon/sur/jock.hoon` (`$keyword`, `$jpunc`, `$jatom`,
`$tex`, `$jock-form`) must match the tables here; a mismatch is a
bug in one or the other.

Jock is a statically typed language that compiles to the Nock ISA (via Nockasm). Its syntax is Swift-inspired first, Rust-inspired second; its semantics are Nock-native (everything is a noun; functions are closures, emitted as cores at the ABI only — no core algebra is user-visible (types.md S9.8); recursion is the loop primitive). It is not an imitation of either source language: where Swift/Rust idiom conflicts with noun semantics, the noun wins.

**Design principles**

1. **One meaning per spelling.** No syntactic form may mean different things in different contexts (see the adjacency law, §2.4).
2. **Kernel and sugar.** Every construct is either a *kernel form* (one typed lowering rule, one Nockasm production) or *sugar* (one AST rewrite). A keyword enters the language only with: grammar entry, classification, its rule, and a positive + negative corpus vector.
3. **Loud failure.** Where a plausible mis-spelling would otherwise silently change meaning, the grammar is arranged so it fails to parse, with a hint.
4. **Provenance.** Every AST node, type expression, and emitted Nockasm node carries a source position.

---

## 1. Programs

A program is a sequence of `;`-terminated statements followed by a final expression, whose value is the program's value:

```jock
let a: @ = 3;
func inc(n: @) -> @ { n + 1 };
inc(a)
```

**L-184 · A program is `;`-terminated statements followed by a final
expression**, whose value is the program's value. A missing
terminator refuses `%parse-expected %';'`, pointed at the start of
the next statement. ⟨`t-arc-term-semi`, `t-text-split-trail`⟩

**L-185 · Binding forms are STATEMENTS and require the `;`** —
`let`, `func`, declarations, `import`, `assert`, assignment. Control
expressions with braced bodies (`if`, `match`, `loop`) do not take a
trailing `;` when they are the final expression, and a braced
declaration needs none at all (L-81).
⟨`t-arc-decl-nosemi`, `t-arc-term-semi`⟩

**L-186 · Sequencing is EXPLICIT.** Adjacent expressions never
silently compose: the beta's implicit compose is removed, and with
P-3's promotion the `compose` keyword went with it. Sequencing uses
`;`, and names enter scope through bindings, declarations and imports
only. Juxtaposition does not exist anywhere in the grammar —
collections and tuples are comma-separated (L-79) — so two adjacent
expressions are either separated by `;` or a parse error (L-174).
⟨`t-arc-ctor`, `t-parse-unglued`⟩

## 2. Lexical structure
### 2.1 Source, comments, identifiers

**L-52 · Source is UTF-8 with LF-terminated lines.** Tab and CR are
lexical errors — loud failure, so there is no invisible-whitespace
ambiguity to debug. ⟨`t-lex-tab-n`⟩

**L-53 · Comments are `//` to end of line and `/* … */`**, stripped
by the lexer. Non-nesting. ⟨`t-lex-comment-p`⟩

**L-54 · A comment separates tokens exactly as whitespace does.** A
token after a comment is never glued, so a comment can never create
or destroy a postfix binding (L-1). ⟨`t-lex-comment-p`⟩

**L-55 · Token positions are 1-based line and column**, columns
counting tape characters — bytes, for ASCII. Every lexer vector
asserts the positions, so the whole `vex-lex` file pins this; the
three named here are representative.
⟨`t-lex-num-p`, `t-lex-type-p`, `t-lex-uni-p`⟩

**L-56 · There are two identifier classes, distinguished
lexically.** A **name** has a lower-case initial (`foo`, `myCount`)
and denotes values, functions and fields. A **type name** has an
upper-case initial (`Point`, `List`) and denotes types, structs,
classes, traits and aliases. ⟨`t-lex-term-p`⟩

**L-57 · The casing split is load-bearing**, not convention: the
parser distinguishes name tokens from type tokens, so it is the
Rust convention enforced *as grammar* rather than as style. It is
also what lets L-59 hold — a hyphen can be part of a name because
no type name can contain one.

**L-58 · An identifier is a letter followed by letters and
digits.** No underscores; `_` is the wildcard. ⟨`t-lex-term`⟩

**L-59 · Names admit glued hyphens, Hoon-Term-style.** `a-1` and
`foo-bar` are each ONE name token, never a subtraction. A trailing
hyphen (`a-`) is not a name and refuses. Hyphens never appear in
type names — a `-` after a type name is minus. The readings cannot
collide because binary `-` is spaced on both sides (§4.2).
⟨`t-term-hyphen`⟩

**L-60 · Stdlib multi-word naming prefers hyphens; user style is
free.** Both hyphenated (`starts-with`) and camelCase (`myCount`,
`peekUnder`) are legal everywhere names are legal. The *prelude and
stdlib* prefer hyphenated Term-style for new multi-word names, with
`starts-with` as the precedent, while existing camelCase prelude
names stand. The rule governs what the stdlib adds, not what users
write.
### 2.2 Keywords

**L-61 · The table below is the keyword inventory.** A word not in
it is an ordinary identifier. A keyword enters the language only
with a grammar entry, a kernel-or-sugar classification, its rule,
and both a positive and a negative corpus vector — so the
inventory and the mold `$keyword` in
`crates/jockc/hoon/sur/jock.hoon` cannot drift apart silently.

| Keyword | Class | Rule |
|---|---|---|
| `let` | kernel | immutable binding: `%let` |
| `var` | kernel | mutable binding: `%let` with `mut=%.y`; `%edit` targets only `var` bindings (OPEN-14) |
| `func` | kernel | named (recursive) function: `%func` — kernel by decision (OPEN-10 resolved): one lowering rule owns self-name binding, recursion, and the generics binders |
| `lambda` | kernel | anonymous function value: `%lambda` |
| `if` / `else` | kernel | `%if`; `else if` chains flatten to nested `%if` at parse |
| `match` | kernel | pattern/type discrimination: `%match` |
| `switch` | **retired, and NOT reserved** | collapsed into `match` (OPEN-15), then **unsquatted 2026-10-29**: it is an ordinary name and not in `$keyword`. Listed here because a reader who remembers the word comes looking. Vector `t-switch-name` |
| `loop` / `recur` | kernel | recursion point / re-entry: `%loop` / `%recur`, both optionally labeled (`loop outer { … recur outer }`) — note no `;` before the closing brace; a trailing separator there refuses `%parse-expected %'}'` |
| `defer` | **reserved, unimplemented** | the keyword lexes and the parser then refuses `%parse-todo %defer` unconditionally (`parse.hoon`); `sugar.hoon` carries a `%defer` arm no program can reach. Reserved on the same footing as `$(…)` re-entry, so the meaning can land without reinterpreting any legal program. |
| `eval` | kernel | Nock evaluation: `%eval` (Nock 2) |
| `crash` | kernel | `%crash` (Nock `[0 0]`) |
| `import` | kernel | `%import`; resolution happens at environment construction, not parse |
| `as` (`as?`, `as!`) | kernel | cast: `%cast` (particle of expression grammar, not a standalone form) |
| `assert` | sugar | → `if cond { next } else { crash }` |
| `print` | kernel | `print e; k` / `print(e, N); k`. Rules L-33 to L-37 below |
| `and`, `or`, `xor`, `not` | sugar | word connectives (OPEN-13): `and`/`or` → nested `%if` (short-circuit); `xor`/`not` → `%if`/stdlib rewrites |
| `struct` | kernel (declaration) | `%decl`: def-registration in `+mint` (types.md S9.1 — desugar has no environment, so declarations are one kernel form the parser emits directly) |
| `class` / `impl` | kernel (declaration) | `%decl`: registration + method minting; standalone instances are `impl Trait for Type { … };` (types.md S9.4/S9.5) |
| `trait` | kernel (declaration) | `%decl`. Rules L-62 to L-66 below |
| `for` | kernel (declaration) | separates trait from target in `impl Area for Shape`; with a parameterized trait the arguments ride on the trait name, `impl<T> Idx<@, T> for List<T>` |
| `alias` / `is` | kernel (declaration) | `alias New is Old`. Rules L-67 to L-69 below |
| `enum` | kernel (declaration) | `%decl`: tagged sum. Rules L-70 to L-73 below |
| `in` | sugar | **membership**. Rules L-74 to L-76 below |
| `private` | kernel (declaration) | marks the next declaration or `func` unexported. Rules L-17 to L-25 below |



#### `trait` — L-62 to L-66

**L-62 · A trait's methods carry full signatures**, not just names:
`add(self: Self, other: Self) -> Self;`. ⟨`t-decl-op-gen`⟩

**L-63 · A trait may be parameterized**, with unbounded binders on
the name: `trait Idx<I, A> { at(self: Self, i: I) -> A; }`.
⟨`t-class-ptrait`⟩

**L-64 · An impl supplies the arguments as a first glued group**,
`impl<T> Idx<@, T> for List<T>` — one group means an unparameterized
target, by the adjacency law (L-1). A class's impl clause may apply
a trait the same way, `class K(St) impl Idx<@, T>`.
⟨`t-class-ptrait`, `t-err-class-ptrait`⟩

**L-65 · Operator binding is per-METHOD**, not per-trait:
`add(+);`. The signature is implied by the family, several hooks may
appear per trait, and they mix freely with signed methods. The
trait-name form of the hook is retired. ⟨`t-decl-op-gen`⟩

**L-66 · One dictionary serves every instantiation.** Trait binders
erase exactly as impl binders do, so the dictionary is one core per
(trait, head) and coherence is per (trait, head) — see types.md.

#### `alias` — L-67 to L-69

**L-67 · `alias New is Old` is transparent**, expanded at
elaboration. ⟨`t-alias-ok`, `t-elab-alias-p`⟩

**L-68 · It is an ALIAS, not a newtype.** The two names denote one
type; there is no wrapping, no distinct identity, and nothing to
unwrap. ⟨`t-decl-or-alias`⟩

**L-69 · The `is` is load-bearing.** An alias has neither braces nor
an `=` of its own, so without `is` its two halves would sit
adjacent with nothing between them. Omitting it refuses.
⟨`t-arc-alias-is`, `t-arc-alias-no-is`⟩

#### `enum` — L-70 to L-73

**L-70 · An enum is a tagged sum declaration.** ⟨`t-arc-enum`⟩

**L-71 · Bunt is the FIRST case's bunt**, by declaration order.
This deliberately breaks Hoon's last-case `$%` convention, so a
reader coming from Hoon should not assume. Well-foundedness is
checked at registration (types.md S10.3). ⟨`t-arc-enum`⟩

**L-72 · An empty enum is well-formed and uninhabited.** It is
`%void`, it nests into everything, and it has **no** bunt —
bunting it is an error. ⟨`t-bunt-void-n`, `t-bunt-or-void`⟩

**L-73 · `Never` is declared by the prelude**, so a program writing
`enum Never {}` verbatim refuses `%decl-dup` rather than
illustrating L-72. Use a fresh name to try it. ⟨none — UNPINNED⟩

#### `in` — L-74 to L-76

**L-74 · `x in s` rewrites to `s.has(x)`** — a METHOD call on the
collection, so dispatch is ordinary per-head resolution and **no
operator trait is involved**. ⟨none — UNPINNED⟩

**L-75 · It sits at the ordered-comparison level**, and is
non-associative there like the rest of that level (§4.2).
⟨none — UNPINNED⟩

**L-76 · `∈` is its glyph alias**, one of the three aliases rather
than a trait-only operator (§4.2).


#### `print` — L-33 to L-37

**L-33 · `print e; k` takes one `String`.** The statement form is
`print e; k`; with a priority it is `print(e, N); k`.
⟨`t-text-print`, `t-des-print`⟩

**L-34 · The priority is a BARE number literal.** Severities are
static, so `N` is a literal and nothing else — an expression in
that position refuses `%parse-print-pri`.
⟨`t-err-print-pri-expr`, `t-err-print-num`⟩

**L-35 · Rendering happens by interpolation inside the one String
argument, never by an argument list.** Variadic `print` is
deliberately foreclosed, and that is what keeps the
trailing-priority shape permanently unambiguous: with a variadic
form, `print(x, 2)` could not be told from a two-value print.
⟨`t-text-interp-print`⟩

**L-36 · It lowers to a slog hint**, `[11 [%slog [N %leaf tape]] k]`,
through the pinned `trip` arm. ⟨`t-jimp-print`, `t-jimp-print-first`⟩

**L-37 · A blind runtime computes and discards.** A slog-aware
runtime prints — 0 info, 1 warn `>`, 2 error `>>`, 3 crit `>>>`,
following NockVM's Slogger — and one without the hint evaluates `k`
regardless, so a program's *value* never depends on whether anyone
was listening. ⟨`t-text-print-crit`, `t-spot-print`⟩

#### `private` — L-17 to L-25

**L-17 · `private` marks the next declaration or `func`
unexported.** It registers, compiles and is fully usable inside its
own module; it does not enter the module's `$hlib`.
⟨`t-text-private-local`, `t-text-private-func`⟩

**L-18 · It is opt-out, not opt-in.** There is no `pub`. A program
that never writes the word cannot be broken by the feature
existing — which is the whole reason the default is export.

**L-19 · Visibility is module-scoped**, following Rust: the
declaring module *and its descendants*. That is the reading which
survives multi-file modules; while a module is one file the two are
indistinguishable. There is no graduated visibility, because
`pub(crate)` has no referent here — there is no crate layer to be
visible within.

**L-20 · It takes only a declaration or a `func`.** A private `let`
refuses `%parse-private`, a module's `let`s not being exports in
the first place. A private `impl` refuses `%parse-private-impl`:
impls are global facts scoped by reachability, so a private one is
either meaningless, the fact travelling anyway, or a coherence
hole. ⟨`t-err-private-let`, `t-err-private-impl`⟩

**L-21 · Nothing public may mention a private type**, refused at
the module as `%export-private` — otherwise an importer receives a
name it can never resolve.
⟨`t-jimp-export-private`, `t-jimp-export-private-field`,
`t-jimp-export-private-alias`⟩

**L-22 · Both export surfaces are checked**, not just signatures:
an arm's signature *and* an exported typedef's body — a public
`struct Pub { f: Priv }`, an `enum` case payload, an `alias`
target, a `trait` or `class` method signature — and the
**types-only** module exit as well as the ordinary one.
⟨`t-jimp-private-arm`, `t-jimp-private-type`,
`t-jimp-private-public`⟩

**L-23 · A class's `state` is the sanctioned exception.**
Construction is sealed and every method speaks `Self`, so the state
name never crosses a boundary. This is what lets `lib/rational` and
`lib/interval` keep their state structs private.
⟨`t-jimp-private-class-state`⟩

**L-24 · Privacy is API hygiene, not a security boundary.** An
erasure cast reads private fields across a module boundary. Note
the shape precisely, because it is easy to check and conclude the
opposite: the *direct* `r as (Int, Int)` is **refused**
`%mint-cast`, a private state struct not unfolding in an importer.
The leak is the **two-step** `(r as *) as! (Int, Int)`, which reads
the fields. Making such a nominal non-congruent for `as` is the
recorded follow-on. ⟨`t-jimp-private-forge`⟩

**L-25 · What keeps a sealed nominal canonical is its SEAL, not its
privacy.** A class is constructed only by its declaring module, at
every position of a cast target (`docs/record/class-crossing.md`).
`lib/rational` and `lib/interval` rest on the seal; privacy is
hygiene layered over it.

*Stage one: `private` takes declarations and funcs. Private*
*fields and methods are in scope and not yet built —*
**Record** `record/language-arc.md`.

### 2.3 Literals

**L-77 · The table below is the literal inventory**, and the mold
`$jatom` in `crates/jockc/hoon/sur/jock.hoon` must match it.
⟨`t-lex-str-p`, `t-sint-lit`⟩

**L-78 · Date, span and path literals have no settled surface
spelling.** `Date`, `Span` and `Path` exist as types; what a
*literal* of one looks like is **unspecified**, and the `/a/b/c`
below is indicative rather than normative. A program needing one
constructs it. ⟨none — UNPINNED⟩

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



#### Interpolation and escapes — L-26 to L-32

**L-26 · `{expr}` renders through `.show()`**, dispatched per head
and user-extensible — `impl Show for P` makes `{p}` work. Pieces
fold through the pinned `cat`. The `Show` trait and the prelude's
impls for it are `runtime.md`'s, not restated here.
⟨`t-parse-interp`⟩

**L-27 · `{{` and `}}` are literal braces**, so `"lit {{x}} ok"`
renders as `lit {x} ok`. ⟨`t-text-interp-esc`⟩

**L-28 · A backslash escape is one BYTE, written as two hex
digits.** `\0a` is a newline, `\09` a tab, either case of hex.
`\\` is a backslash. The five named escapes — `\n` `\t` `\"`
`\'` `\\` — are sugar over exactly that form: `\n` **is**
`\0a`, per byte, with no separate mechanism. Both string paths
take them, `"…"` and `'…'` alike.
⟨`t-str-esc-backslash`, `t-str-esc-newline`, `t-str-esc-tab`,
`t-str-esc-upper`, `t-str-esc-short`⟩

**L-29 · Anything else after a backslash refuses**
`%lex-string-escape`. The absence of escapes was expensive
precisely because it was *silent*, so their presence is loud.
⟨`t-str-esc-bad`⟩

> **Aside — the hex pair collides with octal, and that is
> accepted.** The two digits carry no `x` marker, so `"\41"` is
> `A` (L-28). In C, Python, JavaScript and Ruby the same four
> characters are an *octal* escape and mean `!`, since `0o41` is
> 33. Both readings compile and neither warns, which makes this
> the one divergence in the string syntax that is silent in both
> directions: L-29's loudness covers an *unknown* escape, not a
> known one that means something else elsewhere.
>
> Ruled 2026-10-27 — the collision stands rather than being
> respelled `\xNN`, recorded here as a known risk rather than
> left to be discovered. It is stated outright because a reader
> arriving from any of those four languages cannot guess it, and
> `/reference/transfer/` carries it for the same reason: that page
> is otherwise built from refusals, and this divergence has none.
> ⟨`t-str-esc-octal-trap`⟩

**L-30 · Per-byte escapes are what settle Unicode.** A Jock String
IS a cord and UTF-8 is a byte encoding, so `"caf\c3\a9"` is
`café`. A `\u{…}` codepoint form could only ever be sugar over
this. ⟨`t-str-esc-utf8`⟩

**L-31 · A fragment is a single expression.** No string literals
inside a fragment (`%lex-interp-str`), and no newlines. Fragment
diagnostics are fragment-relative, not whole-string-relative.
⟨`t-err-interp-str`, `t-err-interp-open`, `t-err-interp-brace`⟩

**L-32 · Comment markers inside a string are literal text.**
`"a // b"` is six bytes of `a // b`, and `"a /* b */ c"` likewise.
The lexer leaves a string body alone; comments are recognised only
outside one.
⟨none — UNPINNED⟩  *(verified by hand)*

#### Int — L-6 to L-16

**L-6 · Int is ZigZag `@s`.** `+n` encodes as `2n` and `-n` as
`2n−1` — Hoon's own encoding, so small magnitudes stay small and the
FFI arms mirror `+si`. ⟨`t-sint-lit`⟩

**L-7 · An Int literal is a sign glued to a decimal, in operand
position.** `+42` is 84 and `-42` is 83. `-0`, `+0` and `0` are the
same value. ⟨`t-sint-lit`, `t-sint-lit-neg`, `t-sint-lit-zero`⟩

**L-8 · The glued sign cannot be mistaken for arithmetic**, because
binary `+`/`-` are consumed at the additive level first. So
`a +42` is addition — with `a` = 5 it is 47, exactly as `a + 42` is.
⟨`t-sint-not-add`⟩

**L-9 · An Int literal is a primary**, so postfix forms and casts
bind tighter than the sign: `-42 as @` is `(-42) as @`.
⟨none — UNPINNED⟩  *(verified by hand, not by corpus)*

**L-10 · The near-misses refuse, each with its own tag.** A spaced
`+ 42` refuses `%parse-stray`. A spaced `- 42` reaches the
desugarer and refuses `%sugar-op-unary`, unary minus being reserved
(§4.2). A sign glued to a *name* is the hyphen case: `a -1` and
`a- 1` refuse `%parse-minus-glue`, while `a-1` is a single
hyphenated name (§2.1) and `a - 1` is subtraction. Hex and Float64
magnitudes keep their refusals.
⟨`t-lex-stray-n`, `t-minus-spaced`, `t-minus-glued-l`, `t-minus-glued-r`⟩

**L-11 · Arithmetic and comparison ride the trait route**, as
Float64 does — prelude impls over the `hoon.ssum` family. `==`
remains `%same`, which ZigZag satisfies. Mixed `@`/Int arithmetic
refuses across aura families.
⟨`t-sint-sum`, `t-sint-sub`, `t-sint-mul`, `t-sint-cmp`, `t-sint-sum-mixed`⟩

**L-12 · Casting INTO Int refuses through all three doors, at every
position**, `%mint-cast-sint`. A cast reinterprets bits, so
`42 as Int` would read as `+21`; and the soft doors are no safer,
because Int's erasure is a bare unguarded atom whose mold passes
everything — so `42 as? Int` and `42 as! Int` refuse identically.

**"At every position" was false until 2026-10-28**, and this rule is
the reason it is worth saying twice. The check ran on the top of the
cast target only, so `(5, 4) as! SB` gave an `Int`-declared field the
value `-3`; the `as` door alone was deep, because its congruence walk
(`+ecng`/`+gcng`) happened to hold the rule positionwise, and the one
nested vector covered that door. `+sintf:mint` is the shared walk
now. It is **pairwise**: whether a position reinterprets is a fact
about the *source* as well as the target, which is what keeps L-13's
ingestion lane open underneath it.
⟨`t-sint-cast`, `t-sint-castp`, `t-sint-castq`, `t-sint-castx`,
`t-cast-sint-out`, `t-cast-sint-out-deep`, `t-cast-sint-deep`,
`t-cast-sint-deep-soft`, `t-cast-sint-deep-test`,
`t-cast-sint-deep-tuple`, `t-cast-sint-deep-same`⟩

**L-13 · Ingestion is the one sanctioned soft use.** An *untyped*
source — an `eval` product, a poke payload, anything typed `*` —
keeps the mold path, because its bits are ZigZag by provenance.
`(v as? Int) ?? fallback` is the idiom. The lane survives L-12's
positionwise check because that check is pairwise — it refuses only
where the source's aura at that position is KNOWN and is not `%sint`
— so an untyped source stays moldable however deep the `Int` sits.
Three rows pin it, and a blanket refusal reddens all three.
⟨`t-sint-ingest`, `t-sint-ingestp`, `t-cast-sint-ingest`⟩

**L-14 · Conversion from a known nat is a function, not a cast.**
`hoon.sint(n)` and `hoon.uint(s)` convert; `uint` crashes
`%uint-neg` on a negative. `hoon.sabs` is the total magnitude.
⟨`t-sint-conv`, `t-sint-uint-neg`⟩

**L-15 · `Int -> @` is general, and is a deliberate footgun.**
`@`/`Atom` is the top of the aura order, so an Int flows into it in
every checking position — `let s: @ = +2`, `func f() -> @ { +2 }`,
and a bare argument alike. It is **not** confined to a written
annotation. `+2` then reads **4**, because the ZigZag encoding of
`+n` is `2n`. That is the price of atoms as the base type, and it is
meant to be visible rather than papered over.

*A ruling to confine this edge to identity-denoted auras is open;
until it lands this rule states the compiler.* **Record**
`record/language-arc.md`. ⟨none — UNPINNED⟩
*(genuinely unpinned: nothing in the corpus exercises the implicit
edge, which is part of why confining it was thought to be an
addition rather than a restriction)*

**L-16 · Division truncates toward zero** (`sfra`). `srem` follows
the dividend; `sdul` is the curated Euclidean modulus.
⟨`t-sint-div`, `t-sint-rem`, `t-sint-dul`⟩

**L-79 · Separators are commas everywhere** — tuples, lists, sets,
arguments and type arguments all agree with the map syntax that
already used them. The beta's space-separated forms (`(a b)`,
`[1 2 3]`, `{1 2}`) do not parse. ⟨`t-arc-ctor`⟩

**L-80 · A trailing comma is permitted** before every closing
delimiter of a comma-separated body — diff-friendly, following Rust
and Swift. ⟨none — UNPINNED⟩

**L-81 · A braced declaration needs no terminator.**
`struct P { x: @ }` and `func f() -> @ { 1 }` stand alone; the
closing brace ends them. One written anyway is accepted. `alias`,
having no braces, keeps its mandatory `;` — there the terminator is
the only thing saying where it ends. A trailing `;` after the
program's terminal expression is likewise optional.
⟨`t-arc-decl-nosemi`, `t-arc-term-semi`⟩

**L-82 · Data shapes take commas; signatures take semicolons.**
Bodies that enumerate **data** — struct fields, enum cases — are
comma-separated like every other enumeration. Bodies that contain
**signatures or definitions** — trait methods, impl and class arms
— are `;`-terminated statements, like the declarations they are.
⟨`t-arc-enum`⟩

**L-83 · The last separator is optional; the ones between are
not.** `class C(S) { f(self: C) -> @ { 1 } }` and
`class C(S) { f(self: C) -> @ { 1 }; }` are the same class. A
dropped separator *between* items is a loud parse error,
`%parse-expected %';'`, never a silent mis-parse.
⟨`t-parse-method-nosep`, `t-text-method-nosemi`,
`t-parse-match-nosep`⟩

**L-84 · `match` arms are comma-separated**, an arm list being an
enumeration of cases (§5.3), with the comma optional on the last
arm and a dropped one between arms a loud `%parse-expected`.
⟨`t-parse-match-nocomma`, `t-parse-match-nosep`, `t-arc-patt-bare`⟩

**L-85 · Literal-ness is lexical; constancy is a judgment.** The
`$jatom` constant flag records that a token was written as a
literal. Whether a *type* is constant is the checker's question,
not the lexer's.
⟨none — UNPINNED⟩  *(the flag is `q=?(%.y %.n)` in `$jatom`,
`sur/jock.hoon`; no vector asserts its value)*

### 2.4 The adjacency law

#### L-1 · A postfix form binds only when glued

A call `(`, an index `[`, or a type application `<` attaches to the
expression or type name before it **iff no whitespace separates
them**. The lexer's `glued` flag is the whole mechanism; no rule
anywhere consults anything else.

So `fib(n)` calls and `fib (n)` does not; `xs[0]` indexes and
`xs [0]` does not; `Map<@->@>` applies and `Map <@, @>` does not;
`Point( x: 1 )` constructs.

⟨`t-lex-glue-p`, `t-arc-ctor`, `t-lex-type-p`⟩

#### L-2 · An un-glued postfix opener is an error, with a hint

Collections are comma-separated (§2.3), so nothing in the grammar
is juxtaposition. An un-glued `(` or `[` after a complete
expression is therefore never a second expression — it is a parse
error naming the likely intent: `%parse-unglued`, hinting
"`f (x)` does not call `f`; write `f(x)` to call, or `;` to
sequence".

In **type** position the same spacing is also an error but reports
differently — `List <@>` refuses `%parse-expected`, because the
type grammar fails before the adjacency check is reached. The
outcome is identical; the tag is not.

⟨`t-parse-unglued`, `t-lex-unglue-p`⟩

#### L-3 · `{` is never postfix

A brace after an expression is always a block, in every syntactic
context. There is no glued-brace form, so the braced constructor
`Point{ x: 1 }` does not parse — it refuses `%parse-expected`.
Construction is the glued paren, `Point( x: 1 )`.

⟨`t-arc-ctor-brace`⟩

#### L-4 · A block must produce a value, so `{}` refuses

Bare `{}` is not a collection literal and not a value; it refuses
`%parse-empty-brace`. Empty collections are constructed or
annotated — `Set<@>()`, or the empty map literal `[->]`.

⟨`t-parse-empty-brace`⟩

#### L-5 · Why the law is kept

Not style. Two reasons, and both are load-bearing.

It is what makes L-2's diagnostic *possible*: a whitespace-blind
grammar must guess what the user meant, and so cannot name the
error. And it forecloses the JavaScript newline-swallow hazard,
where a line break changes what the previous line meant.

It also removes an ambiguity Rust still carries. Because a brace
after an expression is always a block (L-3), the Rust
`if a == Point { x: 1 }` problem **cannot be stated** in Jock.

**Record** `record/language-arc.md` — OPEN-12, dissolved rather
than resolved by the glued-paren move.
### 2.5 Punctuators and special unary forms

**L-86 · The punctuator inventory is `$jpunc`** in
`crates/jockc/hoon/sur/jock.hoon`. One glyph leads a built-in form,
always with a glued `(`.

**L-87 · `$(…)` is reserved and NOT IMPLEMENTED.** It names
recursion re-entry with edits, inside `func` and `loop` bodies. The
punctuator is reserved so the meaning can land later without
reinterpreting any legal program; writing it refuses
`%parse-todo %recur-edits`. ⟨`t-recur-edits`⟩

**L-88 · The beta's `+(e)` and `?(e)` are cut.** Increment is the
stdlib `inc(e)`; the cell test is `hoon.iscell` (`* -> Bool`), Nock
3 through the substrate — the same arm the compiler uses, not a
second mechanism. The cut spellings now refuse `%parse-stray`, which
is unvectored. ⟨`t-nx-inc-p`, `t-abi-iscell-cell`,
`t-abi-iscell-atom`⟩

**L-89 · `~` is the null/empty literal and `_` is the wildcard
pattern.** ⟨none — UNPINNED⟩

**L-90 · `->` separates argument types from return types** and keys
map literals. The two readings never collide, `->` being a single
two-byte munch read in different positions.
⟨`t-arc-map-empty`, `t-arc-map-bracket`, `t-text-map-annot-put`,
`t-lex-type-nest`⟩

**L-91 · `&` is reserved through 1.0, and refuses.** It stays in
the punctuator inventory, but the lexer refuses every occurrence
with prose — `%lex-connective`, carrying the `&&`-habit hint — so
no legal program contains it and a future meaning lands without
reinterpretation. A glued `||` pair refuses the same way. Bitwise
work is FFI: `hoon.dis`, `hoon.con`, `hoon.mix`.
⟨`t-hint-amp`, `t-hint-amp-mid`, `t-hint-bar`⟩

## 3. Types (surface syntax)

**L-92 · Surface type expressions are `$tex`: parsed, positioned,
and uninterpreted.** Every judgment about a type happens in the
checker, never in the parser — so the grammar below says what can
be *written*, not what it means.

```
tex :=  TypeName                        nominal reference:      Point
     |  TypeName<tex, ...>              type application:       List<@>, Map<@->Bool>
     |  (tex, tex, ...)                 product / tuple type:   (Float64, Float64)
     |  name: tex                       named field (in decls): x: Float64
     |  tex -> tex                      function type
     |  @ | Bool | * | Atom | Float64 ...  aura names (§3.1)
     |  Base                            BasedAtom (guard semantics: types.md S3.4)
     |  tex?                            option, postfix (OPEN-2 resolved)
     |  tex | tex                       untagged discriminable union
     |  (inferred)                      omitted annotation: let x = ...
```

**L-93 · The productions above are the whole surface.** A type
expression is one of: a nominal reference, a type application, a
product, a named field, a function type, an aura name (§3.1),
`Base`, a postfix option `tex?`, an untagged union, or omitted
entirely for inference. ⟨`t-lex-type-p`, `t-lex-type-nest`⟩

**L-94 · An untagged union's members must be erasure-disjoint** —
provably distinguishable at bounded depth, by atom-versus-cell or
by distinct head tags. The discriminability judgment in types.md
decides it. ⟨`t-elab-union-p`, `t-elab-union-n`⟩

**L-95 · `T?` is sugar for the `~`-form of that mechanism**, so an
option is an ordinary discriminable union rather than a separate
kind. ⟨`t-elab-unit-p`⟩

**L-96 · `|` is the type-position union punctuator and nothing
else.** It is retired from the operator inventory entirely to hold
this single meaning. ⟨`t-hint-bar`⟩

### 3.1 Aura names

**L-97 · The table below is the utterable aura set.** The *semantic*
aura vocabulary is open-ended; these are the names a program may
write, and each maps to a `$jatom-type`. ⟨`t-lex-type-p`⟩

Surface names for atom auras (the utterable set; the semantic aura vocabulary is open-ended):

| Surface | `$jatom-type` | Notes |
|---|---|---|
| `@`, `Atom` | `%$` | the any-aura atom (top of the aura order — the parser maps the surface spelling to `%$`) |
| `Nat` | `%number` | the aura a decimal **literal** carries, ordered *below* `Atom`. Every `Nat` is an `Atom`, so a signature written `@` takes one |
| `Bool` | `%logical` | `true` / `false`; beta `?` spelling retired (OPEN-2/17). The annotation resolves through the **boot alias**, not a bare parser mapping, so the `%loob` guard rides along |
| `Hex` | `%hex` | |
| `Int` | `%sint` | |
| `Float64`, `Float16`, `Float32`, `Float128` | `%real*` | |
| `Byte` | `%chars` | one UTF-8 byte; resolves through the boot alias (the `%byte` guard rides along) |
| `UniChar` | `%chars` | one Unicode scalar, `0x0`–`0x10FFFF`. Shares `Byte`'s aura and refines it with a wider guard, so a `Byte` flows **into** a `UniChar` and a `UniChar` does not flow back. Nothing converts silently: a scalar is one-to-four bytes, so encoding is an explicit operation |
| `Date`, `Span` | `%date`, `%span` | |
| `String`, `Path` | (jnoun) | noun types, not atoms |
| `*`, `Noun` | — | any noun (top) |
| `Base` | — | BasedAtom: atom < 2^64 − 2^32 + 1 (types.md S3.4; OPEN-4 resolved) |

## 4. Expressions

### 4.1 Calls and access

**L-98 · A call is `f(a, b)`** — glued `(`, comma-separated
arguments, `f()` for none. ⟨`t-arc-ctor`⟩

**L-99 · Field access is `p.x`.** The dot never needs the adjacency
rule, being unambiguous either way. ⟨`t-lark-param`⟩

#### Positional access — the lark, L-100 to L-105

**L-100 · `p.<` is the head and `p.>` the tail**, composing
left-to-right outermost-first: `p.<>` is the tail of the head.
`p.<>` and `p.<.>` are both legal and reach the same axis.
⟨`t-lark-head`, `t-lark-compose`, `t-lark-nest`⟩

**L-101 · The lark is the only way into an ANONYMOUS product.**
Structs are entered by name and lists by `match`; a bare tuple has
neither, so it has the lark. ⟨`t-lark-expr`⟩

**L-102 · A lark does not open a seal.** types.md S7.1 records why,
and what would have to change to reopen it. ⟨none — UNPINNED⟩

**L-103 · The general form is `p.+5`** — the axis named directly,
and **always a literal**, because a computed axis is untypeable.
Lark is idiomatic for shallow, self-describing access; `+n` is the
escape hatch for deep or generated axes. ⟨`t-lark-atom-n`⟩

**L-104 · A bare `p.5` is deliberately unavailable.** The lexer
reads digit-dot-digit as one Float64, so `p.2.3` would tokenize as
name-dot-real. The `+n` form exists because this one cannot.
⟨none — UNPINNED⟩

**L-105 · A glued `=` after a lark run refuses**,
`%parse-lark-cmp`: `p.>= 3` would otherwise parse as the lark `p.>`
followed by an *assignment*. Write `p.> >= 3` to compare, or
`p.> = 3` to assign.
⟨`t-lark-eq-glued`, `t-lark-eq-glued-lt`, `t-lark-eq-spaced`,
`t-lark-cmp-spaced`⟩

- Index family — **three spellings**, all sugar → method calls, dispatching on the receiver's type at elaboration:

| Spelling | Meaning | Rewrites to |
|---|---|---|
| `e[i]` | index / lookup | `e.at(i)` — the `Idx` trait |
| `e[a..b]` | slice | `e.slice(a, b)` — the `Slice` trait; **half-open** `[a, b)` |
| `e[i] = v; ...` | put | `e.put(i, v)` through `%edit` — the `Put` trait |

  Six further spellings were proposed and are **not in the language**: `e[i?]` (membership), `e[!i]` (delete), `e[]` (stack peek), `e[!]` (stack pop), `e[i:j]` and `e[i::j]` (slices). They are named methods when their collections land. They are not reserved, not deprecated, and do not parse — see the resolution below.

#### The index family — L-46 to L-51

**L-46 · The family is exactly `e[i]` and `e[i] = v`**, desugaring
to `.at()` and `.put()` method calls through the prelude's `Idx`
and `Put` traits. So indexing dispatches per receiver head, and
`xs[i]` and `m[k]` are one rule rather than two.
⟨`t-index-gone-has`, `t-index-gone-peek`⟩

**L-47 · Everything else is withdrawn.** `has`, `del` and `pop`
are named methods when their collections land, not bracket forms.
⟨`t-index-gone-pop`, `t-index-gone-push`⟩

**L-48 · There is exactly one range spelling, `..`**, it lives on
the `Slice` trait, and `List<T>` is its only impl. A `String` has
no slice at all: it must first say which view it means — `bytes()`
or `chars()` — and it is the **view** that carries the unit,
visibly, at the call, in the reader's line of sight.

The objection was never to slicing. It was to a slice *pair* —
two spellings in the brackets, one meaning bytes and one meaning
scalars — smuggling a Byte/UniChar decision into an indexing form.
One spelling obeys that rather than reversing it, which is why the
withdrawn `e[i:j]` / `e[i::j]` pair is not revived under new
punctuation. ⟨`t-text-slice`, `t-text-chars-slice`,
`t-index-gone-slice`⟩

**L-49 · A range is half-open, `[a, b)`**, chosen for the
composition law: `e[0..k]` and `e[k..n]` partition `e` with no
arithmetic at the seam. ⟨`t-text-slice-compose`⟩

**L-50 · Past the end crashes; an inverted range does not.**
Indexing past the end crashes as `at` does. An inverted range
(`b <= a`) is the empty list, because a range is not an index and
has nothing to be out of.
⟨`t-text-slice-inverted`, `t-text-slice-empty`⟩

**L-51 · Withdrawn means EXCISED, not refused.** A withdrawn
spelling is a parse error — `xs[1?]` reports
`%parse-expected %']'` with the caret on the `?` — not a
positioned desugar refusal. `$index-query` holds exactly the forms
the language has, three of them: `%at`, `%slice`, `%put`. The
alternative kept seven live-but-dead grammar branches, a
`$index-query` case apiece, and a desugar arm whose only customer
was its own error message — all of which 1.0 would have frozen.
⟨`t-err-slice-place`⟩

### 4.2 Operators

Binary operators are sugar: each rewrites to a stdlib call through the
environment's import definitions. Which call, and how a head claims
one, is the routing question — rules L-38 to L-45. This section is the
*grammar*: what binds tighter than what, and which spellings the
grammar admits at all.

**L-106 · `===`/`!==` lower to the kernel `%same`** (Nock 5) and are
never overloadable; `==`/`!=` dispatch through `Eq` and fall back to
`%same` for a head with no impl (L-45; runtime.md says why the
fallback is a default rather than an error). `!==` desugars one step
further than `===`, to an `%if` over `%same`.
⟨`t-des-same`, `t-des-nsame`, `t-eq-nsame`⟩

**L-107 · Precedence is thirteen levels, tightest first.** The table is
the rule; the rows are not separately numbered.
⟨`t-parse-prec`, `t-parse-assoc`, `t-prec-mul`, `t-parse-not`,
`t-logic-prec-or-xor`, `t-logic-prec-or-and`, `t-logic-prec-not`,
`t-logic-prec-and-xor`⟩ — the four `t-logic-prec-*` rows discriminate
the three word stations by a grouping that answers differently when
the level is wrong, which is the only way a precedence row can be
pinned rather than merely exercised.

| Level | Operators | Associativity |
|---|---|---|
| 1 | postfix: glued call `(`, glued index `[`, field `.`, lark `.<` `.>`, axis `.+n` (L-46 to L-51, L-98 to L-105) | left |
| 2 | `as`, `as?`, `as!` | left |
| 3 | `**` *(reserved — L-112)* | right |
| 4 | unary `-` *(reserved — L-112)* | — |
| 5 | `*` `/` `%` `×` `÷` `⊛` `∩` `⊗` `∘` `·` | left |
| 6 | `+` `-` (binary `-` is spaced — L-109) `∪` `⊕` `⊖` `±` | left |
| 7 | `??` | right |
| 8 | `<` `>` `<=` `>=` `in` `∈` `⊂` `⊃` | none |
| 9 | `==` `!=` `===` `!==` | none |
| 10 | `not` | — |
| 11 | `and` | left |
| 12 | `xor` | left |
| 13 | `or` | left |

> **Aside — `xor` took its own station on 2026-10-27, and this is
> a re-blessing of OPEN-5's freeze rather than a correction of
> it.** `and` and `xor` shared station 11, left-associative, so
> `a xor b and c` grouped as `(a xor b) and c`. C gives `&` `^`
> `|` three distinct levels in exactly the order `and` `xor` `or`,
> so a reader arriving from there reads `a xor (b and c)` — and
> both groupings are legal, differ in value, and say nothing.
> `true xor true and false` was false and is now true.
>
> The old grouping was pinned by `t-logic-prec-and-xor`
> deliberately, on the day it was found and before it was changed,
> so that moving the station had to flip a corpus row rather than
> pass unnoticed. Twelve levels became thirteen; nothing else
> moved, because the new station was inserted at the loose end and
> only `or` renumbered (12 → 13).
> ⟨`t-logic-prec-and-xor`, `t-logic-prec-or-xor`⟩

**L-107a · A trait-only glyph takes its ASCII analogue's family.**
The eleven glyphs of L-116 have no ASCII spelling, so their station
cannot be read off one: the parser assigns it, and the table above
now names all fourteen. Multiplicative-shaped glyphs parse in
`+p-mul` (station 5), additive in `+p-add` (6), relational in
`+p-ord` (8). A library may give a glyph any meaning; it may **not**
move it, because precedence is fixed at parse. Ten of the fourteen
were missing from the table above until 2026-10-27 — the three
family representatives were pinned, the rest were in the parser
only.
⟨`t-text-glyph-prec`, `t-parse-subset-nonassoc`,
`t-text-glyph-cap-prec`, `t-text-glyph-ring-prec`,
`t-text-glyph-dot-prec`, `t-text-glyph-ominus-prec`,
`t-text-glyph-pm-prec`, `t-text-glyph-supset`,
`t-parse-supset-nonassoc`⟩ — every station row *discriminates*,
binding the glyph over `@` and setting it against the ASCII operator
one family away: `2 ⊕ 3 ⊗ 4` is 14 where the drifted grouping answers
20, and the five rows added for `∩ ∘ · ⊖ ±` are built to the same
shape by `+gstm`/`+gsta`. `⊂` and `⊃` carry a Bool-signature positive
row and a non-associativity refusal apiece. The three `t-des-glyph-*`
vectors are **desugar** rows (AST in, AST out) and pin
non-normalization, not placement; they are not what stations rest on.

Until 2026-10-27 six of the fourteen — `⊖ ± ∩ ∘ · ⊃` — had no vector
at any stage, so two thirds of the family's table was parser source
read back as prose (jock#128). The ASCII operator each glyph is set
against is independently pinned at its own station, so a red row
indicts the glyph and not the comparison.

**L-108 · The comparisons are NON-ASSOCIATIVE** — both stations, 8
and 9 — and must be parenthesized: `a < b < c` refuses
`%parse-nonassoc` rather than returning a boolean surprise (the Rust
rule). `in` sits at station 8 and is non-associative with the rest
(Python's placement). Word connectives sit loosest, also Python-style,
so `not a == b` reads `not (a == b)`.
⟨`t-parse-nonassoc`, `t-in-nonassoc`, `t-parse-subset-nonassoc`,
`t-parse-supset-nonassoc`, `t-parse-not`⟩

**L-109 · Binary `-` is SPACED ON BOTH SIDES.** This is an adjacency
rule, not a precedence one: `a- 1` and `a -1` both refuse
`%parse-minus-glue` with a hint. Fully glued `a-1` is one
hyphenated Term-style name (L-59), and the right-glued form is
reserved for the operand-position Int literal (L-6: `+42`/`-42`).
⟨`t-minus-glued-l`, `t-minus-glued-r`, `t-minus-spaced`⟩

**L-110 · `??` binds tighter than the comparisons and looser than
`+ -`** (station 7), right-associative, following Swift's
nil-coalescing placement: `m[k] ?? 0 == 5` groups as
`(m[k] ?? 0) == 5`, and a fallback may be an arithmetic expression
unparenthesized. A chain falls through left to right.
⟨`t-prec-qq-cmp`, `t-prec-qq-add`, `t-prec-qq-right`⟩

**L-111 · Every operator is BINARY-ONLY.** A unary form refuses
`%sugar-op-unary` at desugar, or `%mint-op-unary` if it reaches mint
by another route. This is why `±` has no unary reading.
⟨`t-des-op-unary`, `t-mint-op-unary`⟩

**L-112 · `**` and unary `-` are reserved through 1.0**, at stations
3 and 4 — `**` the tighter, so `-x ** 2` will read `-(x ** 2)`, the
universal convention. Both refuse today (L-111 for the unary form),
so no program can depend on the order; it is frozen now precisely so
it cannot be renegotiated when they land. ⟨none — UNPINNED⟩

**L-113 · Postfix `.` applies to ANY expression**, not just limb
paths: `f(x).y`, `(a + b).len()` and `P( … ).v` all parse. A limb
receiver extends its path, so `a.b.c` is one unchanged `%limb`; any
other receiver becomes the `%dot` sugar form, whose receiver binds
once through an irrefutable match and is therefore evaluated exactly
once. For a method call the whole call rides inside that binding — a
method is not a first-class value.
⟨`t-parse-dot`, `t-parse-dot-expr`, `t-des-dot`, `t-des-dot-limb`⟩

**L-114 · A temporary is not an assignable place.** `f().x = v`
refuses `%parse-place`. ⟨`t-err-dot-place`⟩

**L-115 · Every BUILT-IN operator has an ASCII-first spelling.**
Three Unicode glyphs are sugar aliases that normalize at desugar to
their ASCII equivalents — `∈` to `in`, `×` and `÷` to `*` and `/`.
⟨`t-des-glyph`, `t-lex-uni-p`⟩

**L-116 · The other eleven glyphs are TRAIT-ONLY operators**: the
language lexes and parses them and assigns them no meaning — no
pinned kernel arm (`+opar:mint` answers `~`), no ASCII normalization
at desugar. Each routes straight to the ops registry, so a *library*
gives it meaning (`trait Seq { then(⊛); }`) or the program refuses
`%mint-op`. `⊛` (`%uni-ast`, U+229B) was the first;
`examples/parser.jock` is the worked case.
⟨`t-des-glyph-ast`, `t-des-glyph-cup`, `t-des-glyph-subset`⟩

**L-117 · Trait-only glyphs take one of three parse stations**, by
mathematical convention, with the signature the station implies:

| Station | Operators | Associativity | Implied signature |
|---|---|---|---|
| multiplicative (with `* / %`) | `⊛ ∩ ⊗ ∘ ·` | left | `(Self, Self) -> Self` |
| additive (with `+ -`) | `∪ ⊕ ⊖ ±` | left | `(Self, Self) -> Self` |
| comparator (with `< > <= >= in`) | `⊂ ⊃` | none | `(Self, Self) -> Bool` |

So multiplicative-like glyphs bind tighter than additive-like —
`2 ⊕ 3 ⊗ 4` is `2 ⊕ (3 ⊗ 4)`, which gives a combinator library
sequencing-binds-tighter-than-alternation for free — and the
relations sit with the comparisons, non-associative like them
(L-108). `⊂` and `⊃` emit `%operator`, **not** `%compare`: they
dispatch through the ops registry exactly like `⊛`, borrowing only
their station and implied signature from the comparators.
⟨`t-text-glyph-prec`, `t-text-glyph-cup-chain`,
`t-text-glyph-subset`, `t-parse-subset-nonassoc`⟩

**L-118 · A punctuator outside the vocabulary refuses `%sugar-op`.**
The operator inventory is closed at desugar, so `1 ^ 2` is an error
rather than a silently unregistered hook. `|` is retired from the
inventory entirely — it is the type-position union punctuator (§3)
and nothing else. `⊂` has no type-position reading either: a subset
relation on types, if ever wanted, must find another spelling or a
position-split. ⟨`t-des-op-bad`⟩

**L-119 · Glyph BYTES appear in exactly ONE place** — the lexer's
match tapes, spelled as numeric cords, where `(trip 0x97c3)` is the
UTF-8 pair of `×`. Everywhere else the tokens are synthetic tas
constants (`%uni-mul`, `%uni-div`, …), and no multibyte literal may
sit anywhere its value flows: molds, tables, comparisons, or vector
texts (a vector cord carrying a glyph is spelled as a numeric atom).
The reason is that a glyph literal inside compiler source is a
compiler-dependent constant until honk's UTF-8 correction merges —
honk collapses it to one unit, hoonc reads the byte pair, and hoonc
is right. The differential acceptance lane is what caught this.
⟨`t-lex-uni-p`, `t-lex-uni-n`⟩

### 4.3 Casts and coalescing

```jock
p as (Float64, Float64)     // static cast:  must nest, checked at compile time
x as? Atom                  // soft cast:  produces a unit (~ or [~ value])
x as! Atom                  // forced cast:  crash on failure
(x as? Atom) ?? 99          // coalesce:  unwrap-or-default
```

**L-120 · `as` is STATIC.** The source type must nest in the target
and nothing is checked at runtime; a cast that does not nest refuses
`%mint-cast` at elaboration. ⟨`t-mint-cast`, `t-run-cast`,
`t-err-chars-cast`⟩

**L-121 · `as?` is a SOFT cast producing a unit** — `[~ value]` on
success, `~` on failure — so it is the one cast that is a question
rather than an assertion. It reads a union arm as well as a mold.
⟨`t-parse-asq`, `t-run-asq-noun`, `t-run-asq-miss`, `t-run-asq-or`,
`t-run-asq-or-no`⟩

**L-122 · `as!` is a FORCED cast and crashes on failure.** It is the
spelling an adapter arm uses on an untyped `*` sample, where the
alternative would be to thread a unit through a signature that cannot
carry one. ⟨`t-run-asx-mold`, `t-run-asx-rec`⟩

**L-123 · Both runtime casts check GUARDS**, not just shape: a
guarded type whose guard fails is a cast failure, crashing under `as!`
and answering `~` under `as?`.
⟨`t-run-asx-grd`, `t-run-asq-grd-no`⟩

**L-124 · A cast target must be a MOLD, not a gate.** A gate in
target position refuses `%mint-mold`, which keeps the cast forms from
becoming an arbitrary call. ⟨`t-mint-asx-gate`⟩

**L-125 · Recursive types cast**, under both runtime forms: the
target is the declared type, not its one-step unrolling.
⟨`t-run-asx-rec`, `t-run-asq-rec-no`⟩

**L-126 · `??` unwraps a unit with a default.** It is the companion
to `as?` and the reason the soft cast needs no `match`: `(x as? Atom)
?? 99`. ⟨`t-des-coalesce`, `t-text-qq`⟩

**L-127 · Nothing casts INTO `Int`**, under any of the three forms,
nor through an `as?` match pattern, nor inside a struct — all refuse
`%mint-cast-sint`. Casting *out* of `Int` is permitted and yields the
ZigZag encoding (`+7 as @` is `14`), which is the asymmetry the
refusal exists to make visible: an `@` has no sign to recover, so the
inbound direction would be a silent reinterpretation.
⟨`t-sint-cast`, `t-sint-castq`, `t-sint-castx`, `t-sint-castp`,
`t-cast-sint-deep`, `t-cast-sint-out`, `t-cast-sint-out-deep`⟩

> The inbound refusal is **today's behaviour**, recorded as such. The
> Int confinement question (whether `Int` should be a confined type
> with explicit conversions, or an aura like any other) is open; when
> it is ruled, L-127 is re-blessed rather than treated as having been
> wrong. See ROADMAP.

### 4.4 Evaluation

**L-128 · `eval(subj, form)` evaluates a noun as Nock** (Nock 2). It
is a kernel form, not a library call, and it is the escape hatch —
spelled like what it is. ⟨`t-run-eval`, `t-run-eval-inc`,
`t-nx-eval-p`⟩

**L-129 · `eval` is CALL-SHAPED**, like every other kernel form that
takes operands: `eval 5` refuses `%parse-eval`. Keyword-led
juxtaposition exists nowhere in the language — the same rule gives
`lambda 5` a `%parse-lambda`. ⟨`t-parse-eval`, `t-parse-lambda`⟩

## 5. Bindings, mutation, flow

### 5.1 `let`, `var`, and assignment

```jock
let a: @ = 3;            // immutable binding
var b: (@, @) = (1, 2);  // mutable binding -- see L-132 on the annotation
b = (3, 4);              // edit:  legal only on var bindings (Nock 10)
```

**L-130 · Assignment is an EDIT, not a declaration.** `b = e` edits an
existing `var` binding through the kernel `%edit` (Nock 10); assigning
a `let`-bound name refuses `%mint-edit-immutable`, and an unbound
name is an error too.
⟨`t-mint-edit-let`, `t-let-no-edit`⟩

**L-131 · Elaboration uses the BINDING CLASS.** A `let` of a literal
keeps its singleton (constant) type, while a `var` widens the literal
to its general aura at binding, because future edits will store other
values. ⟨`t-var-widen`⟩

**L-132 · `var` widening is SHALLOW.** It widens the binding's own
type and does not descend into cells, so singletons *inside* a tuple
survive and `var b = (1, 2); b = (3, 4)` refuses `%mill-nest` — the
second tuple's literals do not nest into the first's singleton types.
An annotation is the spelling that works, as in the listing above.
Deep widening for `var` is a recorded design question and deliberately
not in this release; until it is settled, annotate a mutable tuple.
⟨`t-var-widen-shallow`, `t-var-widen-annot`⟩

**L-133 · A singleton never survives a CALL boundary** — the
signature governs, a singleton nesting into its own aura on the way in
(types.md S4). This is the structural defense against Hoon-style TMI
pain. Flow-sensitive narrowing is deferred (POSSIBLES P-7).
⟨`t-nest-sa-p`, `t-nest-sing-p`, `t-nest-sing-n`⟩

**L-134 · Destructuring `let` is admitted**, for exactly the
irrefutable pattern subset (types.md S12.2): `let (h, t) = e;` is the
irrefutable match `match e { (h, t) => … }` and costs no kernel form,
being the same desugaring the `.`-receiver sugar already uses. Only
`let` destructures — `var` needs a place to assign back to and a
pattern is not one, so `var (a, b) = …` refuses `%parse-var-patt`.
⟨`t-arc-let-unpack`, `t-parse-var-patt`⟩

### 5.2 Functions

```jock
func fib(n: @) -> @ {
  if n == 0 { 1 }
  else if n == 1 { 1 }
  else { fib(n - 1) + fib(n - 2) }
};

lambda (b: @) -> @ { b + 1 }(41)   // anonymous;  immediately called (glued paren)
```

**L-135 · A named `func` is recursive by construction** — it sees its
own name in its body, which is how `fib` above calls itself. Function
values are closures, one-arm cores at the ABI (types.md S9.8).
⟨`t-run-grp-self`, `t-mint-recur-arm`⟩

**L-136 · A `func` requires an ANNOTATED return**, because the
recursion of L-135 needs it: `func f(a) -> @ { 1 }` refuses
`%mint-func-annot`. ⟨`t-mint-func-annot`⟩

**L-137 · Adjacent `func`s form a MUTUAL-RECURSION GROUP.**
Consecutive `func` statements see each other's names in every body —
the same adjacency rule declarations use (types.md S8.5/S9.1). A
group lowers to one shared multi-arm core at the ABI (types.md S9.8),
invisible at the surface. A duplicate name within a group refuses
`%mint-func-dup`.
⟨`t-run-grp-mutual`, `t-run-grp-parity`, `t-run-grp-three`,
`t-run-grp-capture`, `t-run-grp-value`, `t-mint-grp-dup`⟩

```jock
func even(n: @) -> Bool {
  if n == 0 { true } else { odd(n - 1) }
};
func odd(n: @) -> Bool {
  if n == 0 { false } else { even(n - 1) }
};
even(10)
```

**L-138 · Any interposed statement SPLITS the group**, and calling
forward across a split is an error — never a silent scope surprise.
The split is *directional*: a backward call still resolves, and
hoisting the interposed statement above both funcs is the workaround.
⟨`t-text-grp-split-decl`, `t-text-grp-split-let`,
`t-text-grp-split-back`, `t-text-grp-hoisted`⟩

**L-139 · The split hint is CONDITIONAL, not detected.** `%mint-limb`
on any unresolved bare one-segment name appends *"if it is a `func`
declared below, only ADJACENT funcs see each other — move them
together"*. `+dimb` receives the environment, not the statement
spine, and the funcs below have not been minted, so there is nothing
to detect: the note never asserts the func exists, and a misspelled
name gets it too.
⟨`t-diag-limb`, `t-drec-limb`, `t-chkj-refuse`⟩

**L-140 · `recur` re-enters only the innermost enclosing `func` or
`loop`.** Mutual calls are ordinary calls by name; a bare `recur`
outside any such form refuses `%mint-recur`.
⟨`t-mint-recur-naked`, `t-mint-recur-limb`⟩

**L-141 · Lambdas are monomorphic and arity-checked.** A lambda
assigned to an annotated function type whose arity disagrees refuses
`%mill-lambda-arity`. ⟨`t-mill-lambda-arity`, `t-mill-lambda`⟩

**Generics** (semantics in types.md S9.7):

**L-142 · A binder paren attaches to the declaring KEYWORD for a
value declaration and to the declared NAME for a type declaration** —
declaration-site binds, use-site applies, exactly as value parameters
already work:

```jock
func<T> id(x: T) -> T { x };
func<T: Arithmetic> double(x: T) -> T { x.add(x) };

struct Pair<T> { a: T, b: T };
enum Option<T> { none, some(T) };   // nullary case first:  Option<T> bunts to none

let p = Pair( a: 1, b: 2 );         // T inferred from arguments
let q: Option<@> = Option.some(3);  // or from the expected type
```

⟨`t-run-gen-bound`, `t-text-class-gen`, `t-jimp-class-gen`⟩

**L-143 · Instantiation resolves LOCALLY** — from the arguments, or
in checking position from the expected type. There is no explicit
call-site instantiation syntax. `func` and class suites may be
generic (`class Box<T>(BS<T>)`); lambdas may not.
⟨`t-as-cong-struct`, `t-text-class-gen-arg`, `t-mint-fond-inst`⟩

**L-144 · The type bracket is ANGLE, and it does not fight the
comparison.** Type arguments and binders are written `<…>` —
`List<@>`, `func<T>`, `struct Pair<T>`, `trait Idx<I, A>` — while `<`
and `>` remain the comparison operators at station 8 (L-107). The two
never meet, for two independent reasons: a type-argument list is
parsed in **type position** only (after `:`, after `->`, inside
another `<…>`, at a declaration head), where a comparison cannot
appear; and the bracket obeys the ordinary glue law, so `List<@>`
applies and `List <@>` is a parse error exactly as `f (x)` is.
⟨`t-lex-type-p`, `t-lex-type-nest`⟩

**L-145 · Nothing in the lexer was changed to make L-144 work.** `<`
and `>` have always been single-byte punctuators — the only two-byte
munches are `->`, `=>` and `..` — so nested arguments close with a
plain `>>` and need no C++-style `> >` kludge, and a glued
`Map<@->@>= m` hands the `=` back correctly. `..` cannot collide with
a numeral, since digit grouping is `_` and a real literal is
digit-dot-**digit**, lexed on the number path: `1..2` is `1 .. 2`
(that last clause is unvectored).
⟨`t-lex-type-nest`, `t-text-map-annot-put`, `t-lex-num-p`⟩

**L-146 · `class` keeps PARENTHESES for its state struct**
(`class Rat(RatState)`). That is a declaration head, where no
expression — and therefore no constructor call — can appear, so the
glued-paren-constructs rule has nothing to collide with.
⟨`t-parse-class`, `t-jimp-class`⟩

**L-147 · A generic NULLARY constructor is the one gap in L-143.**
`let q: Option<@> = Option.none;` refuses `%mint-inst-annot` today,
because a nullary case offers no argument to solve `T` from and the
expected-type route is unbuilt for it. The payload cases are
unaffected, as is an annotated generic struct literal
(`let p: Pair<@> = Pair( … )`); until it is built, a nullary generic
case needs a monomorphic declaration.
⟨`t-mint-inst-annot`⟩

### 5.3 Conditionals and matching

```jock
if a == 3 { 42 } else { 17 }

match a {                  // literal values are patterns too
  1 => 0,
  2 => 21,
  _ => 84,
}

match a {                  // pattern/type dispatch (kernel)
  %1 => 0,
  _  => 84,
}
```

Arm separation is L-84 and L-83: commas, optional on the last arm,
loud if dropped between arms.

**L-148 · `match` is the eliminator, and `$patt` is closed**: `_`
wildcard, literal atoms, case patterns, cell destructuring, name
binding, and type tests — the last legal exactly where `as?` is legal
(L-121).
⟨`t-run-match-lit`, `t-run-match-cell`, `t-run-match-bind`,
`t-run-match-bool`, `t-run-match-order`, `t-parse-patt`,
`t-parse-patt-as`, `t-parse-patt-case`⟩

**L-149 · A case pattern is QUALIFIED; a bare name is a BINDING.**
Write `.circle(r)` or `Shape.circle(r)` to match a case, and `x` to
bind. A bare name that happens to be a case of the scrutinee refuses
`%mint-patt-bare` rather than being reinterpreted — because a binding
matches everything, so the old coincidence rule meant adding a case
to an `enum` could silently turn somebody's binding into a match and
kill every arm below it. ⟨`t-arc-patt-bare`, `t-arc-enum`,
`t-mint-patt-tag`, `t-mint-patt-ambiguous`⟩

**L-150 · Exhaustiveness is CHECKED; redundancy only partly**, by a
cover test over the scrutinee's type (types.md S12.3): a
non-exhaustive `match` errors with a witness pattern, and an
unreachable case is an error rather than a warning.

This said "by **usefulness analysis**", and `types.md` S12.3 had
already corrected itself and said so: `+mcov` is a conservative
five-case **cover** test, not Maranget specialize/default matrices.
It is sound for exhaustiveness and weaker for redundancy —
`match x { E.a => 1, E.b => 2, E.a => 3 }` compiles and returns 1,
because duplicate *refutable* cases are not detected. The two
documents disagreed for as long as the correction existed, and
`types.md` was the honest one; this rule is the goal, S12.3 is the
implementation. ⟨`t-mint-match-inex`, `t-mint-match-unreach`,
`t-mint-match-sing`⟩

**L-151 · `switch` is GONE, and the word is NOT reserved.** It was
never the value-equality special case this section used to claim:
both keywords shared one parser, so `switch` accepted case patterns,
cell destructuring and type tests exactly as `match` does — a
synonym, and two spellings for one construct is the thing the
language does not do. Literal values are patterns (L-148), so `match`
covers value dispatch with no second keyword.

This rule used to end "a retired spelling that becomes a legal
variable name is worse than one that errors", and the word stayed in
`$keyword` on that reasoning, refusing `%parse-switch-gone` with the
rewrite named. **Reversed 2026-10-29**, deliberately and with the
trade stated: a reservation taxes every program that would like the
name, forever, while the did-you-mean serves only readers who
remember a spelling that was never in a released Jock and has had
zero call sites in this tree since before `$patt` landed. Bare
`switch` now refuses as any unbound name does, with the limb
sentence; `switch a { … }` refuses `%parse-trailing`, which is a
worse sentence than the old hint and is the acknowledged price.
⟨`t-switch-name`⟩

**L-187 · `mut` is an ordinary name**, as `self` is (L-158), and
for the same reason. It was never in `$keyword` —
`+p-let` refused it at one site, so `let mut x = …`, the habit a
Rust-shaped writer brings, reported `%parse-let-mut` with prose
instead of dying as expected-`'='`. **Unsquatted 2026-10-29** with
`switch`, same trade: the hint bought one clear sentence for one
mistake and charged every program wanting a binding called `mut`.
`let mut x = 1` is `%parse-expected %'='` at `x` again — which is
not the baffling error the hint's own note called it, since the
report now carries a caret under the offending token.
⟨`t-let-mut-name`⟩

### 5.4 Loops

```jock
let a: @ = 5;
var b: @ = 0;
loop {
  if a == b + 1 { b }
  else { b = b + 1; recur }
}
```

**L-152 · `loop { … }` marks the recursion point over its braced
body** and `recur` re-enters it. There is no statement-marker form.
⟨`t-run-loop`, `t-run-loop-let`, `t-text-loop`⟩

**L-153 · Loops may be LABELED** (`loop outer { … recur outer; … }`)
and labels scope as written: an inner `recur outer` re-enters the
outer loop, nesting resolves innermost-first, and a label that names
no enclosing loop refuses `%mint-recur`.
⟨`t-loop-label`, `t-loop-label-bad`, `t-loop-recur-inner`,
`t-mint-recur-outer`⟩

**L-154 · `$(…)` with edits is reserved and unimplemented**, refusing
`%parse-todo` (L-87 is the reservation). ⟨`t-recur-edits`⟩

## 6. Declarations

```jock
alias Number is Float64;

struct PointState { x: Float64, y: Float64 };

enum Shape {
  point,                   // nullary case -- first, so Shape bunts to it
  circle(Float64),         // payload case:  positional, unnamed
  rect(Float64, Float64)   // multi-payload:  the payload is a (Float64, Float64) tuple
};

trait Arithmetic {
  add(self: Self, other: Self) -> Self;
  neg(self: Self) -> Self;
};

impl Arithmetic for Float64 {          // standalone:  impl Trait for Type
  add(self: Float64, other: Float64) -> Float64 { self + other };
  neg(self: Float64) -> Float64 { 0.0 - self };
};

class Point(PointState) impl Arithmetic {
  add(self: Point, other: Point) -> Point {
    Point( x: self.x + other.x, y: self.y + other.y )
  };
  neg(self: Point) -> Point { Point( x: 0.0 - self.x, y: 0.0 - self.y ) };
};

let p = Point( x: 42.0, y: 7.0 );     // construction:  glued paren (L-1)
p.x
```

**L-155 · All declarations are ONE kernel form, `%decl`.** The parser
emits it directly and `+mint` registers it in the compile-time
environment (`def.env`), minting method bodies where present
(types.md S9). ⟨`t-parse-decl`, `t-run-decl-struct`,
`t-run-decl-alias`, `t-arc-alias-is`, `t-arc-alias-no-is`⟩

**L-156 · Adjacent declarations register SIMULTANEOUSLY**, which is
what admits mutually recursive unions and structs (types.md S9.1).
⟨`t-run-decl-mutual`⟩

**L-157 · A redeclaration refuses, at every grain.** Two
declarations of one name refuse `%decl-dup`, and so does a
redeclaration separated by an interposed statement — the compiler
does not distinguish the two shapes by tag, though the corpus pins
them separately. Duplicate fields, methods and tags refuse
`%decl-dup-field`, `%decl-dup-method` and `%decl-dup-tag`.
⟨`t-mint-decl-dup`, `t-mint-decl-redecl`, `t-decl-dup-field`,
`t-decl-dup-method`, `t-decl-dup-tag`⟩

**L-158 · `self` is an ORDINARY parameter name, not a keyword** — but
its declared type must be the receiver, so `m(self: @)` on a class
`C` refuses `%mint-meth-self`. Trait methods take it first (types.md
S9.4). ⟨`t-jimp-self`, `t-mint-meth-self`, `t-mint-trait-self`,
`t-mint-meth-shape`⟩

**L-159 · Class state must be a DECLARED STRUCT.** A non-struct in
state position refuses `%decl-class-state`.
⟨`t-mint-class-state`, `t-asx-class-state`⟩

**L-160 · EMISSION ORDER is a jet-correctness requirement**, not a
convenience: deterministic ordered emission is what lets a jet key on
a formula hash. So class arms, impl bodies and object bodies are
ordered lists, and declaration order reaches dictionary layout.
⟨`t-jdict-cross-multi`, `t-run-match-order`⟩

**L-161 · A method call follows the adjacency law** — `p.getx()`, the
paren glued to the field access (L-1, L-99).
⟨`t-run-meth-basic`, `t-text-dot-field`⟩

**Union declarations, fully** (semantics in types.md S9.3):

**L-162 · Cases are COMMA-SEPARATED in one flat list** (L-82: they
are data shapes), and a tag may appear once per enum.
⟨`t-arc-enum`, `t-decl-dup-tag`⟩

**L-163 · Case tags are NAMES**, lowercase — forced, not stylistic:
tags erase to term atoms (`@tas`) and the uppercase namespace belongs
to types (L-57). `enum S { Point }` refuses `%parse-enum-casing`,
with a casing hint. ⟨`t-parse-casing`⟩

**L-164 · CASE ORDER IS SEMANTIC**: the first case is the bunt, so
the convention is a nullary — or at least non-recursive — case first.
`enum L { nil, cons(@, L) }` is accepted and the same two cases
reversed are not. The refusal distinguishes the two ways a union can
fail to be well-founded: a first case that contains the union while
some *other* case does not is an ordering mistake and refuses
`%decl-fond-order`, naming the reorder; a union with no base case at
any ordering refuses `%decl-fond`. A third tag, `%decl-fond-deep`,
reports the 64-deep unroll cap, which is not evidence of
ill-foundedness at all.
⟨`t-decl-fond-cycl`, `t-decl-fond-only`, `t-decl-fond-reorder`,
`t-decl-fond-deep`, `t-mint-decl-fond`, `t-bunt-fond-n`⟩

**L-165 · A nullary case is BARE; a payload case is POSITIONAL.**
`E.a()` on a nullary case refuses `%mint-ctor-nullary`, and the wrong
number of payload arguments refuses `%mint-ctor-arity`. A *named*
payload (`circle(r: Float64)`) is not a declaration the grammar has:
it refuses `%parse-or-face` at the colon, hinting to drop the face
and bind the name in the match arm instead. A multi-payload case's
payload is the right-nested tuple of its types.
⟨`t-mint-ctor-nullary`, `t-mint-ctor-arity`, `t-run-decl-nullary`,
`t-parse-or-face`, `t-parse-or-posn`⟩

**L-166 · Construction is QUALIFIED and APPLIED** — `Shape.point`,
`Shape.circle(2.0)`: the same shape as the declaration, per
declaration-site-binds/use-site-applies (L-142). An unknown tag
refuses `%mint-ctor-tag`. A bare payload constructor refuses
`%mint-ctor-applied`, a payload constructor not being a first-class
value in 1.0 — and the refusal hints the eta wrapper,
`lambda (x: T) -> Shape { Shape.circle(x) }`, which is written by
hand. ⟨`t-mint-ctor-tag`, `t-mint-ctor-applied`, `t-run-decl-ctor`,
`t-qual-ctor`, `t-text-ctor-applied`⟩

**L-167 · Patterns are QUALIFIED and POSITIONAL.**
`match s { .point => …, .circle(r) => …, .rect(w, h) => …, }` — write
`.member` or `Type.member`; a bare name is a binding (L-149).
`rect(w, h)` folds to the nested cell pattern matching the payload
tuple. ⟨`t-run-match-sum-c`, `t-run-match-sum-p`, `t-arc-enum`⟩

**L-168 · Sum-of-products: CASES REFERENCE TYPES, they do not
declare them.** A case payload is any type — in particular a struct
or class declared alongside. That is where named fields live, which
is why case payloads have no faces, and behavior attaches by trait,
per payload type. ⟨`t-decl-or-field`, `t-run-match-sum-p`⟩

**L-169 · A declared union is itself a NOMINAL HEAD**, so an impl
attaches to the union as well as to each payload type — which is how
a union delegates to its cases. ⟨`t-run-meth-union`,
`t-elab-union-p`, `t-elab-union-n`⟩

**L-170 · `union` as a keyword is RETIRED.** `enum` is the only
spelling; `union C { … }` refuses. ⟨`t-arc-union-gone`⟩

```jock
struct Circle { radius: Float64 };
struct Rect { w: Float64, h: Float64 };

enum Shape { point, circle(Circle), rect(Rect) };

trait Area { area(self: Self) -> Float64; };

impl Area for Circle {
  area(self: Circle) -> Float64 { 3.14 * self.radius * self.radius };
};
impl Area for Rect {
  area(self: Rect) -> Float64 { self.w * self.h };
};
impl Area for Shape {                    // a union is a nominal head (L-169)
  area(self: Shape) -> Float64 {
    match self {
      .point => 0.0,
      .circle(c) => c.area(),
      .rect(r) => r.area(),
    }
  };
};

let s = Shape.rect(Rect( w: 3.0, h: 4.0 ));
s.area()                              // 12.0 -- static dispatch throughout
```

This is the earlier `Shape` remodeled: there `rect(Float64, Float64)`
carried bare payloads and destructured as `rect(w, h)`; here the
payloads are structs, each case binds one value, and the fields come
through the struct. They mix freely — pick per case. The union impl
matches and delegates, and the match needs no default because the
checker proves the three cases exhaustive (L-150).

What deliberately does **not** exist is the trait-object route: §9
has it. Open-world polymorphism is a generic bound
(`func<T: Area> …`), resolved statically at each call (L-142).

## 7. Interop

**L-171 · `import <lib>;` brings a Hoon-compiled library into scope
as FFI.** An import parses to a plain AST node; binding happens at
environment construction, governed by the runtime-library interface
spec. An unknown library refuses `%mint-import`, a wrong arity
`%mint-call-arity`, and a generic import `%mint-inst`. (Inside a
module the entry scan gets there first and refuses `%import-unknown`,
positioned — imports.md §3.)
⟨`t-run-import`, `t-run-import-dec`, `t-run-import-mix`,
`t-mint-import-unknown`, `t-mint-import-arity`,
`t-mint-import-gen`⟩

**L-171a · `lib.arm` UNAPPLIED is the arm's gate** (since
2026-10-28), so a module's functions are first-class across the
boundary and pass to a higher-order arm of any module. Exactly two
segments: an arm's gate has no fields, so `lib.arm.more` refuses
`%mint-field` against the gate. A **∀-signed** arm still refuses
`%mint-todo` (clue `%import-arm-gen`), because a limb resolves in
synthesis position and has no expected type to solve its binders
from; the clue names the eta wrapper, which compiles. A name that is
not an exported arm — including a module-level `let`, which is never
exported — refuses `%mint-import-arm` with the module's arm list.
Typing is types.md S11.2. ⟨`t-jimp-arm-value`, `t-jimp-arm-hof`,
`t-jimp-arm-stored`, `t-jdag-arm-value`, `t-jdag-arm-generic`,
`t-jimp-arm-gen`, `t-jimp-arm-gen-eta`,
`t-jimp-arm-value-absent`, `t-jimp-arm-value-deep`⟩

**L-172 · A local binding SHADOWS an import.** `import hoon;` then
`let hoon = 5;` binds the literal, not the library — imports take
part in ordinary scoping and get no privileged name. The library axis
also pegs correctly under later pushes.
⟨`t-run-import-shadow`, `t-boot-import`⟩

*The scoping is right and the DIAGNOSTIC is not, measured
2026-10-28: naming a shadowed library's arm (`import m; let m = 7;
m.f(3)`) refuses `%mint-unimported` — "reachable here but not
imported; add `import m;`" — advice already taken on line 1. `+ilib`
asks the frame where the name is bound for the `$lib-` marker, so a
shadowing binding satisfies both of `+unimp`'s conditions and
"shadowed" is reported as "not imported". Both the call and the
unapplied spelling reach it. Recorded here rather than left for the
next person to re-derive; the fix is a compiler change, not a
wording one.*

**L-173 · Values crossing the boundary are typed by EMBEDDING**
(`+embed`) and must be molded on return — there is no Nock 12 at the
boundary. Not everything embeds: a gate, a type variable, a sum and a
`%ref` all refuse `%embed-out`.
⟨`t-embed-atom-p`, `t-embed-cell-p`, `t-embed-noun-p`,
`t-embed-guard-p`, `t-embed-gate-n`, `t-embed-var-n`,
`t-embed-sum-n`, `t-embed-ref-n`⟩

## 8. Sugar rewrite index

A pointer index, not a second statement of the rules: each sugar form
is normatively stated once, at the id named here, and the
implementation is `lib/sugar.hoon` and must match. The one block that
lives in this section rather than being pointed at is operator
routing, below — it is about the *rewrite target*, which is what this
section is for.

| Sugar | Rewrite | Stated at |
|---|---|---|
| `assert c; e` | `if c { e } else { crash }` | L-61 (the inventory) |
| `a ?? b` | `match` on unit | L-126 |
| binary operators | stdlib calls | L-38 to L-45 |
| `===` / `!==` | kernel `%same` | L-106 |
| `and` / `or` | nested `%if` (short-circuit) | L-61 |
| `xor` / `not` | `%if` and stdlib rewrites | L-61 |
| `%dot` (postfix `.`, non-limb receiver) | irrefutable match binding the receiver once | L-113 |
| index family | `.at(i)` / `.slice(a, b)` / `.put(i, v)` | L-46 to L-51 |
| lark | head/tail by axis | L-100 to L-105 |
| Unicode glyph aliases | `∈`→`in`, `×`→`*`, `÷`→`/` | L-115 |
| `print e; k` | `%slog` dynamic hint | L-33 to L-37 |
| string interpolation | `.show()` per head | L-26 to L-32 |
| collection literals | constructor calls / raw nouns | L-79 |


#### Operator routing and the trait hook — L-38 to L-45

**L-38 · `a + b` and the ordered comparisons are kernel forms, and
mint routes on the LEFT operand's head.** ⟨`t-jimp-op-add`⟩

**L-39 · The pinned `@` column serves the NUMERIC aura family
only**, and checks *both* operands — a non-numeric aura on either
side refuses `%mint-op-aura`.
⟨`t-err-op-aura-char`, `t-err-op-aura-real`⟩

**L-40 · Other heads dispatch through traits.** `"foo" + "bar"`
concatenates via `impl Add for String`. Plain auras take the pinned
kernel arms directly and are not overloadable; `%real` and nominal
heads elaborate as `a.add(b)` through the operator's registered
trait. ⟨`t-jimp-op-add-nominal`, `t-jimp-op-nominal`⟩

**L-41 · The hook is spelled on the METHOD**, not the trait:
`trait Add { add(+); }`. The signature is implied by the family.
⟨`t-decl-op-gen`⟩

**L-42 · The hook spelling admits exactly the operator
vocabulary** — `+ - * / %`, `⊛`, and `< > <= >= == !=`. Any other
punctuator refuses `%parse-trait-op` at parse, rather than
registering silently. ⟨`t-trait-op-junk`⟩

**L-43 · Policy stays with registration, not spelling.** `!=`
refuses `%decl-op-eq`, being derived from `==`; rebinding an
already-claimed operator refuses `%decl-op-rebind`.
⟨`t-err-op-ne`, `t-err-op-rebind`⟩

**L-44 · An empty `()` is a nullary signature, not a hook** — which
the receiver rule then refuses, `%decl-trait-self`, trait dispatch
being receiver-based. ⟨`t-err-op-impl`, `t-err-op-impl-bool`,
`t-err-op-impl-char`⟩

**L-45 · `==` and `!=` stay `%same`.** The prelude claims
`+ - * /` and the ordered comparisons, with Float64 impls; `%` is
unclaimed and user-bindable. ⟨`t-err-op-rmod`⟩

Declarations (`struct`/`enum`/`trait`/`impl`/`alias`/`class`) and struct literals are **not** in this table: both are kernel forms (`%decl`, `%struct-literal`) because their rules need the environment (types.md S9.1, S8.12); desugar is a pure AST rewrite and stays that way.

## 9. What is deliberately absent

An absence is a rule like any other: something was asked for, ruled
out, and now refuses. Each row says what refuses and where the
positive rule lives.

**L-174 · Implicit composition of adjacent expressions is removed.**
The beta composed them; sequencing is now explicit with `;`, and
`a b` refuses `%parse-trailing`. Nothing in the grammar is
juxtaposition, which is what lets L-1 read whitespace as the only
adjacency signal. ⟨`t-arc-union-gone`, `t-parse-unglued`⟩

**L-175 · Juxtaposition collections are removed.** The beta's
`(a b)`, `[1 2 3]` and `{1 2}` do not parse — separators are commas
everywhere (L-79) — and `[1 2 3]` refuses `%parse-expected %']'`.
⟨`t-arc-ctor`, `t-arc-map-bracket`, `t-arc-set-ctor`⟩

**L-176 · The `((` pseudo-token is gone**, replaced by the lexer's
glued flag and the adjacency law (L-1, L-2).
⟨`t-lex-glue-p`, `t-lex-unglue-p`⟩

**L-177 · Whitespace-blind postfix binding is rejected.** C and
Swift read `f (x)` as a call; Jock does not (L-1, L-2).
⟨`t-parse-unglued`⟩

**L-178 · The glyph connectives `&&`, `||` and `!` are absent**, the
word operators `and`/`or`/`xor`/`not` taking their place. `&&` and
`||` refuse `%lex-connective` at the lexer, with a hint, rather than
reaching the parser as two punctuators.
⟨`t-hint-amp`, `t-hint-amp-mid`, `t-hint-bar`, `t-logic-and-tt`,
`t-logic-and-tf`, `t-logic-and-ft`, `t-logic-and-ff`,
`t-logic-or-tt`, `t-logic-or-tf`, `t-logic-or-ft`,
`t-logic-or-ff`, `t-logic-xor-tt`, `t-logic-xor-tf`,
`t-logic-xor-ft`, `t-logic-xor-ff`, `t-logic-not-t`,
`t-logic-not-f`, `t-logic-short`⟩ — the first three pin the
refusal, the rest run the replacement: a complete truth table
apiece, and `t-logic-short` carries the short circuit at the
surface (`false and crash` answers false, where `crash` would
refuse if it ran). Both halves are required of an absence that
*recommends* a spelling: until 2026-10-27 this rule's hint pointed
the reader at four words no vector in the corpus had ever executed
(jock#129), which also made it the standing exception to L-61's own
entry requirement of a positive and a negative row per keyword.

**L-179 · The opcode surface forms `+()` and `?()` are cut** — L-88
is the rule and names the stdlib spellings that replaced them
(rationale in POSSIBLES P-5). ⟨`t-nx-inc-p`, `t-abi-iscell-cell`⟩

**L-180 · The core algebra is not in the language.** `compose`,
`object`, and batteries and payloads as *user* concepts went with
P-3's promotion; cores are calling convention only (types.md S9.8).
Anonymous records may return later as ordinary products — POSSIBLES
P-3 records the residue. ⟨none — UNPINNED⟩

**L-181 · There are no TRAIT OBJECTS or existentials.** `any Trait`
does not parse. Dictionaries exist at generic call boundaries only,
never as storable values: closed heterogeneity is a declared union
(`List<Shape>`, L-169) and open polymorphism is a generic bound
(L-142; types.md S9.4). ⟨none — UNPINNED⟩

**L-182 · There are no exceptions, nulls, inheritance or macros.**
Failure is `crash` and the unit; optionality is `T?` (§3); reuse is
traits and generics; and code generation is the compiler's business,
not the program's. ⟨none — UNPINNED⟩

**L-183 · Self-hosting constructs are post-1.0.** Nothing in the
language is reserved for them, so adding them is a language change
rather than a filling-in. ⟨none — UNPINNED⟩

## 10. Decision ids

Every `OPEN-n` decision is resolved. The deliberations — what was
asked, when it was settled, and what was superseded — live in
[`docs/record/language-arc.md`](../record/language-arc.md). The ids
are cited from `crates/`, `tests/` and `tools/`, so they are
permanent: never renumbered, never deleted.

What each decision *settled* is stated as a rule in the body. The
index below says where, so a reader following a citation from the
compiler lands on the rule rather than on its history.

| id | the rule it settled now lives in |
|---|---|
| OPEN-1 | L-79 (comma separators), L-1 |
| OPEN-2 | L-95 (`T?`), L-97 (`Bool`) |
| OPEN-3 | L-46 to L-51 (the index family) |
| OPEN-4 | L-97 (`Base`) |
| OPEN-5 | L-107 (the precedence table) |
| OPEN-6 | L-74 to L-76 (`in`), L-108 |
| OPEN-7 | L-111 (no `unary` keyword) |
| OPEN-8 | L-107 — **and the row is stale; read L-110 and L-112** |
| OPEN-9 | L-87, L-152 |
| OPEN-10 | §1 (the kernel/sugar criterion), L-135 |
| OPEN-11 | L-77, L-145 (underscore grouping) |
| OPEN-12 | L-1 — dissolved by the glued-paren move |
| OPEN-13 | L-178, L-61 (word connectives) |
| OPEN-14 | L-130 to L-132 (shallow widening) |
| OPEN-15 | L-151 (`switch` retired) |
| OPEN-16 | L-90 (`->`) |
| OPEN-17 | L-95 (`?` confined to optionality) |
| OPEN-18 | L-88 (`hoon.iscell`) |
| OPEN-19 | L-129 (`eval` is call-shaped) |
| OPEN-20 | L-4 (bare `{}` is a block and refuses) |
| OPEN-21 | L-26 to L-32 (interpolation) |
| OPEN-22 | **not a language decision** — `docs/ROADMAP.md`; its ordering consequence is L-138 |

Shelved and promoted ideas keep their `P-n` ids in
[`docs/POSSIBLES.md`](../POSSIBLES.md); the promotions are dated in
the record.
