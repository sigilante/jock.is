# Jock

> Jock is a statically typed language that compiles to Nock (via the Nockasm
> intermediate form). Syntax is Swift-inspired first, Rust-inspired second;
> semantics are Nock-native: everything is a noun, functions are closures
> (cores at the ABI only), recursion is the loop primitive. Surface syntax is
> frozen for 1.0. Compiler and spec: https://github.com/sigilante/jock
> Site: https://jock.is

This is the HAND-WRITTEN half of the model-facing reference. The generated
half is <https://jock.is/llms.txt>, projected from the compiler and its corpus
on every push; it carries the keyword list, the precedence ladder, the literal
and aura tables, the erasure table, the absences, the refusal index and the
`--diag` schema. **Wherever both files carry a fact, llms.txt wins** — it is
checked and this one is written. The normative spec is `docs/spec/` in the
repository (language.md, types.md), and the spec wins over both.

What is here is what a generator cannot produce: program shape, the rules an
unfamiliar model gets wrong, how funcs and recursion actually compose, and the
REPL.

> **Audited 2026-10-27**, and it had drifted. Nothing checked this file: the
> citation lane read `docs/` and the repo root, and the site is its own repo,
> so every claim here was unlanded by construction. Four things were wrong and
> are corrected below — the recursion idiom, the trailing-NUL paragraph, the
> operator-binding example, and "no negative literals", which contradicted the
> `Int` bullet in this same file. The ladder that had gone stale is gone
> rather than re-typed; it is generated, and a second copy only drifts again.
> Every program below is now a corpus row, cited, so the next drift reddens a
> lane instead of teaching a model something false.

## Program shape

A program is a sequence of `;`-terminated statements followed by one final
expression, whose value is the program's value:

    let a: @ = 3;
    func inc(n: @) -> @ { n + 1 };
    inc(a)

⟨`t-gde-shape`⟩ — 4.

Bindings (`let`, `var`, `func`, declarations, `import`, `assert`, assignment)
are statements and REQUIRE the trailing `;`. Sequencing is always explicit
with `;` — adjacent expressions never compose silently. There is no
juxtaposition anywhere in the grammar.

## Rules models get wrong

- **The adjacency law.** Postfix forms bind only when GLUED: `f(x)` is a
  call, `f (x)` is a parse error with a hint (`%parse-unglued`); `xs[0]` is
  an index, `xs [0]` is not; `Point( x: 1 )` is a struct literal, a
  free-standing `{ ... }` is a block. No exceptions.
- **Casing is grammar.** Lowercase-initial identifiers are values/functions/
  fields; Uppercase-initial are types. Union case tags are lowercase (they
  erase to term atoms). No underscores in identifiers (`_` is the wildcard
  pattern). Names admit glued hyphens, Hoon-Term-style: `a-1` and `foo-bar`
  are each ONE name, never a subtraction. Type names take no hyphens.
- **Binary `-` is spaced on both sides.** `a - 1` is subtraction; `a- 1`
  and `a -1` refuse `%parse-minus-glue`; fully glued `a-1` is the NAME
  `a-1` (see casing rule above), refusing `%mint-limb` only if unbound.
- **Signed integers are `Int`** (ZigZag-encoded atoms), written as a
  sign GLUED to a decimal literal: `+42`, `-42`. `a +42` is still
  addition (position disambiguates). Arithmetic and comparisons work
  (`-7 / +2` is `-3`: division truncates toward zero); mixed `@`/Int
  arithmetic refuses. `42 as Int` REFUSES (`%mint-cast-sint`) — casts
  reinterpret bits; convert with `hoon.sint(n)` and `hoon.uint(s)`
  (`uint` crashes `%uint-neg` on a negative; `hoon.sabs` is the
  magnitude). There is no unary minus: negate with `0 - n` (naturals),
  `0.0 - x` (Float64), or a Int literal.
- **Commas everywhere.** Tuples `(a, b)`, lists `[1, 2, 3]`, maps
  `[1 -> 100, 2 -> 200]`, sets `Set<@>([1, 2])`, match arms, call
  arguments, type arguments. Trailing comma permitted. No
  space-separated collections.
- **Brackets carry list AND map**, told apart by the arrow the type
  also writes (`Map<K->V>`). `[]` is the empty list, `[->]` the empty
  map. A set is CONSTRUCTED, `Set<T>([...])` / `Set<T>()`, because
  braces are blocks and `{1, 2}` could not say whether it meant a set
  or a block with a stray comma.
- **Word connectives.** `and`, `or`, `xor`, `not` — there is no `&&`, `||`,
  or `!`. `==`/`!=` dispatch through the Eq trait; `===`/`!==` are raw noun
  equality (Nock 5), never overloadable.
- **Comparisons are non-associative.** `a < b < c` is a parse error;
  parenthesize.
- **`{` inside a string interpolates.** `"x = {x}"` renders `x` through the
  Show trait; `{{` and `}}` are literal braces. No string literals and no
  newlines inside a fragment (`%lex-interp-str`).
- **Bare `{}` refuses** (`%parse-empty-brace`): a block must produce a
  value. Empty collections are `[]`, `[->]` and `Set<T>()`.
- **Tabs and CR are lexical errors.** Source is UTF-8, LF lines.
- **Statement vs expression bodies.** `if`/`match`/`loop` are
  expressions; as the final expression they take no trailing `;`.
- **Assignment edits an existing `var`.** `let` is immutable; assigning a
  `let`-bound or unbound name is an error. Assignment is not a declaration.

## Types (surface)

    @       Atom    any-aura atom         Bool     true / false
    *               any noun              Byte     'a'
    Hex             0x2a                  String   "hello"
    Float64         3.14                  Base     atom < 2^64 - 2^32 + 1
    Int             +42, -42 (signed)     Path     /a/b/c
    %foo            term constant         List<@>  [1, 2, 3]
    Map<@->Bool>    [1 -> true]           Set<@>   Set<@>([1, 2])
    (Float64, Float64)  tuple / product
    T?              option (postfix)      A | B    erasure-disjoint union

The full literal grammar, the utterable aura set and the 41 reserved type
names are generated: <https://jock.is/reference/literals/>.

Type expressions: `TypeName`, application `List<@>`, products `(A, B)`,
function `A -> B`. `T?` is option sugar; `A | B` members must be
distinguishable at bounded depth (atom vs cell, or distinct head tags).

## Operators

**The ladder is generated** — <https://jock.is/reference/keywords/> carries
every operator keyword with its level, its associativity and a working
program, and llms.txt carries the same table in text. A copy here went stale
the day `xor` took its own station (2026-10-27, thirteen levels now, not
twelve) and would again, so there is no copy here.

What is worth saying in prose, because the table cannot:

Casts: `p as (Float64, Float64)` static (must nest, compile-time); `x as? Atom`
soft (produces option); `x as! Atom` forced (crash on failure);
`(x as? Atom) ?? 99` coalesce. `eval(subj, form)` is Nock 2, call-shaped.

Positional access into anonymous products: `p.<` head, `p.>` tail (compose
left-to-right: `p.<>` is tail of head), `p.+5` names a Nock axis directly
(literal only — an axis the subject does not have refuses `%mint-naxis`).
Indexing: `e[i]` and `e[i] = v` only, desugaring to `.at()` / `.put()` through
the Idx/Put traits; slices/has/del/pop are not spellings.

The Unicode glyphs split three ways, probed 2026-10-27 — all fourteen lex, and
that is where the resemblance ends:

- `×` `÷` are ASCII SUGAR for `*` and `/`, and work out of the box.
- `∈` routes through a trait METHOD, so it refuses `%mint-method` on a type
  that provides none — not `%mint-op`.
- the other eleven — `± ⊕ ⊗ ⊖ ∘ · ∩ ∪ ⊂ ⊃ ⊛` — are PLACED but unbound:
  each holds a precedence level and refuses `%mint-op` until a trait binds it.
  That is the extension point; see the `trait` note under Declarations.

## Functions, recursion, shadowing

    func fib(n: @) -> @ {
      if n == 0 { 1 }
      else if n == 1 { 1 }
      else { fib(n - 1) + fib(n - 2) }
    };
    fib(5)

⟨`t-gde-fib`⟩ — 8.

**A named `func` is recursive by construction: call it by its name.** This
paragraph used to say `$(...)` re-enters the enclosing func with edited
arguments, and showed the fib above spelled with it. It does not work. `$` in
expression position refuses `%parse-todo %recur-edits` — the edit syntax is
parsed and reserved, not implemented, so there is no `$(...)` and no
`recur(x: 1)` either. `recur` re-enters a `loop` as a bare word, and a `loop`
carries its state in the `var`s the body assigns:

    var a: @ = 3;
    var b: @ = 0;
    loop { if a == b + 1 { b } else { b = b + 1; recur } }

⟨`t-gde-loop`⟩ — 2. Labelled loops nest: `loop outer { … recur outer }`.

Lambdas: `lambda (b: @) -> @ { b + 1 }` — monomorphic, immediately callable
with a glued paren, and every parameter and the return must be annotated
(`%mint-lambda-annot` otherwise).

**Adjacent `func`s form a mutually recursive group** and a group may not
repeat a name (`%mint-func-dup`). Any interposed statement splits the group;
a `func` after a split SHADOWS an earlier binding of the same name, like
`let` shadowing. Calling forward across a split is an error.

Generics: binder parens on the declaring keyword for values —
`func<T> id(x: T) -> T { x };`, bounds `func<T: Arithmetic>` — and on the
declared name for types — `struct Pair<T> { a: T, b: T };`. Instantiation is
inferred; there is no call-site instantiation syntax.

## Declarations

    struct Circle { radius: Float64 };            // fields comma-separated
    enum Shape { point, circle(Circle) };     // first case is the bunt;
                                               // tags lowercase, positional
                                               // payloads, once per enum
    trait Area { area(self: Self) -> Float64; };  // methods ;-terminated
    impl Area for Circle {
      area(self: Circle) -> Float64 { 3.14 * self.radius * self.radius };
    };
    class Point(PointState) impl Arithmetic { ... };

Construction is qualified and applied: `Shape.point`, `Shape.circle(c)`.
Case patterns are QUALIFIED and positional: `match s { .point => 0.0,
.circle(c) => c.area(), }` — a leading `.` (or `Shape.point`) marks a
case; a BARE name is a binding and refuses `%mint-patt-bare` if it
names a case. Arms are comma-separated (`=>` not `->`), terminator
optional on the last arm, exhaustiveness checked (non-exhaustive match errors with a
witness). `switch` is RETIRED (reserved; refuses %parse-switch-gone) —
`match` takes literal values as patterns, so it always covered value
dispatch. `self` is an
ordinary parameter name, not a keyword. Operator binding in traits is
per-method, and the glyph must be one nothing has claimed:
`trait Scale { s(⊛); }` binds `⊛`. The example here used to be
`trait Add { add(+); }`, which refuses `%decl-op-rebind` — the prelude's own
`Add` already owns `+`, and `t-err-op-rebind` pins exactly that text as a
refusal. The eleven placed-but-unbound glyphs under Operators are what this
feature is for.

String's prelude methods (the `Str` trait): `.len()` (bytes),
`.cat(t)` (concatenation), `.trip()` (to `List<Byte>`),
`.starts-with(pre)` (byte-prefix test; the empty prefix is a prefix
of everything). These are byte-semantics on LSB-first cords, not
character-aware. This used to add that a cord cannot hold a TRAILING NUL, with
`"ab\0"` as the illustration; the lexer does not accept that escape at all
(`%lex-string-escape`), so the sentence described an erasure of a program that
does not compile. The underlying fact about cords stands and is the lexer's
reason for refusing.

Adjacent declarations register simultaneously (mutual recursion). Behavior
attaches by trait impls; a union is a nominal head so impls attach to it too.
Heterogeneous collections are closed unions (`List<Shape>`) — there are no
trait objects.

`import hoon;` brings the Hoon FFI library into scope: `hoon.add(a, b)`,
`hoon.dec`, `hoon.sub`, `hoon.mul`, `hoon.div`, `hoon.mod`, `hoon.lth`,
`hoon.lte`, `hoon.gth`, `hoon.gte`. A local binding shadows an import.
Other libraries (e.g. `import urbit;`) resolve only when the compiler is
given their sources (`--data-dir`); an unknown library refuses.

## Deliberately absent

No exceptions, no null, no inheritance, no macros, no trait objects, no
implicit composition, no whitespace-blind calls, no `&&`/`||`/`!`, no
variadic print (`print e;` takes ONE String; render by interpolation), no
computed axes, no user-visible core algebra.

"No negative literals" was in that list and was wrong — it contradicted the
`Int` bullet above it in this same file. A sign glued to a decimal **is** a
literal (`-42`, `+42`, ZigZag-encoded); what does not exist is unary minus as
an operator, which is a different claim. The generated list is
<https://jock.is/reference/absences/>, which states each absence as the rule
that refuses it.

## The REPL

Statements (entries ending `;`) trial-compile and accumulate into the
session history; expressions evaluate against the history and print their
value. The session is a program written one statement at a time — the
language rules above apply unchanged (including func-group adjacency: two
consecutive `func f` entries are one group and refuse `%mint-func-dup`;
interpose any statement to shadow instead). Atoms print with dot-grouped
decimals (`3.628.800`).

`:nock <expr>` prints the expression's compiled Nock formula, with the
prelude's push spine stripped — `:nock 42` is `[1 42]` ⟨`t-repl-nock`⟩ and
`:nock (1, 2)` is `[[1 1] [1 2]]` ⟨`t-repl-nock2`⟩. `jockc.sh nock f.jock`
is the same thing from the CLI. The stripping is not cosmetic: every program
grafts the prelude, so an unstripped formula for `42` is megabytes of library.
More at <https://jock.is/reference/erasure/>.

## Errors

Every refusal is a tagged crash with a 1-based line:col position. The two
renderings differ, and only the tag is stable:

    error: %mint-limb at col 1              (REPL)
    refused: %parse-unglued at 1:14         (CLI, with source line + caret
                                             and a hint chain)

**Parse the tag; read the report.** The report's formatting is unstable by
declaration — it carries the hint chain, which line:col cannot reconstruct,
but its shape is not a contract.

The tag INDEX is generated: <https://jock.is/reference/tags/> lists all 204
refusals the compiler can raise, 164 of them with the minimal program that
raises one, plus the five tag families that discriminate on a second element
and the refusals no input can reach. A hand-written taxonomy stood here and
is gone; it named tag families accurately but could only ever be a subset,
and the generated index is a join against the compiler. For the refusals that
specifically catch a habit from another language, with the compiler's own
correction quoted, <https://jock.is/reference/transfer/>.

## Machine interface (for agent tooling)

`tools/check.sh [-e EXPR | file | -]` (batch, ~5 s) and
`jojo <kernel.jam> --check file.jock` (warm kernel: ~0.7 s module-free; a
`--data-dir`-bearing kernel resolves imports per check, ~2 s) both emit ONE
JSON object, written by the compiler itself.

**The schema is generated** — <https://jock.is/reference/machine/> carries it
with the corpus vectors that pin each field by asserting the whole string.
A copy of a JSON schema in hand-written prose is the worst kind of duplicate,
so there is no copy here. What is worth knowing in prose:

`module` names the `--data-dir` module a crash belongs to — its line/col index
THAT module's source, and `report` excerpts it (null = the main program).
Every configured module compiles at build time (its top-level statements run
then), so a broken module in a `--data-dir` fails every build that configures
it, and the diagnostic names the culprit.

Exit 0 = typechecks, 1 = refusal, 2 = tool error. `check` compiles WITHOUT
running: a program that typechecks but would crash at runtime still checks
green. `jockc.sh run f.jock` compiles and evaluates; `jockc.sh nock f.jock` prints
the compiled Nock formula (see The REPL). `--diag` puts any of them on the
JSON schema. `--data-dir DIR` supplies library modules to all of them.

## Pointers

- Spec: https://github.com/sigilante/jock/tree/master/docs/spec
  (language.md surface syntax; types.md type system, both normative)
- Examples: https://github.com/sigilante/jock/tree/master/examples
- Reviewer orientation (REPL walkthrough): https://jock.is/reviewers.html
- Runtime host (REPL + checks): https://github.com/sigilante/jojo
