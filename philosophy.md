<!-- EDITING SOURCE for philosophy.html — the HTML is the published
     artifact; edit here, then ask for (or make) the HTML sync.
     Margin notes render as the bracketed asides; transcript captions
     are the indented paragraphs after each code block. -->

Jock is a friendly statically-typed language that compiles to the
[Nock instruction set architecture](https://nock.is/cool) (Nock ISA).
Jock aims to be to Hoon what Swift is to Objective-C:  a modern,
ergonomic, safe language that is a better surface for the same
substrate.  (In fact, Jock's design was directly based on Swift and
Rust.)  I have endeavored to make the Jock language as legible and
learnable as possible, following a principle of least surprise.
Every spelling should be unsurprising, every refusal legible, and
every layer visible.  Where the Swift or Rust idiom conflicts with
Nock ISA's obligatory noun semantics, the noun always wins.

Here we review the design philosophy which guided the language's
surface, type system, and compiler.

> **[margin 1]** The influence stack: Swift's surface manners, Rust's
> discipline about mutation and matching, Hoon's substrate honesty,
> but none of their complexity budgets.
>
> **[margin 2]** The whole compiler, compiled to Nock, is a
> few-megabyte kernel image that runs as an ordinary NockApp or Urbit
> library.  The language ships as a noun, whether serialized or no.

## One meaning per spelling

The [principle of least surprise](https://en.wikipedia.org/wiki/Principle_of_least_astonishment) is usually a vibe with a
corollary:

> If a necessary feature has a high astonishment factor, it may be
> necessary to redesign the feature.

Jock holds the PoLS as a grammar rule:  no syntactic form may mean
different things in different contexts.  Our load-bearing case is
the **adjacency law**:  a call `(`, an index `[`, or a struct-literal
`{` attaches to the expression before it only when no whitespace
separates them.  (Otherwise, Jock almost does not concern itself
with whitespace at all.)

```
jojo> func f(n: @) -> @ { n };
ok
jojo> f(2)
2
jojo> f (2)
error: %parse-unglued at col 3
```

Since `()` can be a cell or a cell constructor, we differentiate
the two by requiring the latter to be glued.  The same is true for
`[]` (indexing) and `{}` (struct literal), respectively.  (The
grammar is otherwise whitespace-blind.)  Jock will not guess
what `f (2)` means; the refusal is tagged to state that *`f (x)`
does not call `f`; write `f(x)` to call, or `;` to sequence.*

> **[margin 3]** The same law forecloses JavaScript's
> newline-swallow hazard and Rust's struct-literal
> ambiguity without a single special case.

Other habitual ambiguities are simply elided from the language.
Sequencing is always `;` so that adjacent expressions never compose
silently. Comparisons are non-associative, so `a < b < c` is a parse
error rather than a boolean surprise. Collections are comma-separated
everywhere. There is no juxtaposition anywhere in the grammar, which
means there is nothing for a reader to mis-parse in their head.

> **[margin 4]** Collections were space-separated in the Jock
> alpha, but the comma was added to constrain ambiguity at several
> places in the language surface.

## Loud failures, legible prose

Compiler errors should be as helpful as possible for both humans
and agents.  Where a plausible mis-spelling would otherwise change
meaning or die illegibly, the grammar is arranged so it fails to
parse, and the failure names the habit you brought with you
inadvertently.

```
jojo> a && b
error: %lex-connective at col 3
jojo> let mut x = 5;
error: %parse-let-mut at col 9
```

The batch compiler adds the prose: the first hint reads *`&&` is not
Jock; the connectives are words: `a and b`, `a or b`, `not a`*, and the
second *`mut` is not a Jock keyword; `let x` binds immutably, `var x = e`
is the mutable binding*. Every refusal is a tagged crash with a
position, every tag is asserted in the test corpus, and the same
facts ship as a machine-readable JSON record — a tool parses what a
person reads.

> **[margin 5]** Symbols like `&&` and `mut` are reserved keywords,
> but they are not currently implemented.  `let mut` in particular
> was reserved to bar Rust-trained agents from pattern-matching too
> freely.

This is also why the error surface can be trusted by things that are
not people.  Coding agents drive the compiler through a one-writer
JSON schema; the language documents itself to models in a single flat
reference.  The errors are the pedagogy:  a language whose errors
teach is a language that will be learned quickly by anything that reads.

## A type system without knots

The type system is bidirectional checking over structs, tagged
unions, traits, classes, and declaration-site generics, earning
its straightforwardness by what it declines to do.  There are no
implicit coercions of any kind:  mixed-aura arithmetic refuses,
sequencing is explicit, and a cast is always a C-like
bit-reinterpretation, not a conversion.

```
jojo> 42 as Sint
error: %mint-cast-sint at col 4
jojo> let v = eval(83, (0, 1)); (v as? Sint) ?? +7
-42
```

However, because you can always check a value's type, you can
always convert it safely.  The `as?` operator is a type-safe cast
that returns `null` on failure, and the `??` operator is a
null-coalescing operator that returns the right-hand side if the
left is `null`.  (Think of this as `Option`).

```
jojo> let v = eval(83, (0, 1)); (v as? Sint) ?? +7
-42
```

A type coercion may be explicit, as with `as!`:

```
jojo> let v = eval(83, (0, 1)); (v as! Sint) + +7
-35
```

More examples of nesting and type coercion:

- `let s: String = ~;` → refuses `%mill-nest` — a plain `String` can
  never be absent, so nothing ever checks for null.
- `let x: String? = ~; x ?? "d"` → `"d"`; absence where declared,
  eliminated totally.
- `"abc" ?? "d"` → refuses (`??` doesn't exist on non-options).
- `let x: @ = ~` is legal and equals `0` because `~` is just the
  atom zero and `@` is a number type.

Conversion is a function you call, validation is a type you check,
and neither ever happens behind your back.

> **[margin 6]** Think of `as` like Hoon's `^-`, `as?` like Hoon's
> `+soft`, and `as!` like Hoon's `;;`.

Two quieter knots are also absent:
1. Types never say more than signatures promise; a literal's
singleton type never survives a call boundary, so inference cannot
leak implementation detail into an interface.
2. The language is closed-world where open-world buys only ambiguity:
no exceptions, no inheritance, no trait objects — and no null, in
the precise sense that no absent value inhabits every type.
Absence is a type you opt into, `T?`, and `??` is its total
eliminator:

```
jojo> let s: String = ~;
error: %mill-nest at col 17
jojo> let x: String? = ~; x ?? "d"
"d"
```

  A plain `String` can never be `~` — nothing checks for null
  because nothing can be null unannounced — while a `String?`
  admits absence and `??` eliminates it.  (And `~` itself is just
  the atom zero: `let x: @ = ~` is the number 0, not an absence.)

A heterogeneous collection is a declared union; open polymorphism is
a generic bound, resolved statically.  Functions are values; the
Hoon-style core machinery beneath them is merely the calling convention.

## The floor is visible

Jock compiles through [Nockasm](https://github.com/sigilante/nockasm),
a semantic IR whose lowering to Nock's twelve instructions is
specified, vendored, and conformance-tested against a reference
implementation.  Above it, the erasure story is honest:  a tagged
union erases to `[tag payload]` verbatim, which is the ABI since that
noun is exactly what runtime drivers pattern-match. The REPL shows you
values as the nouns they are, and shows you the floor itself on request:

```
jojo> :nock 1 + 41
[8 [[9 [4 [0 4.398.046.511.102]]] [9 [2 [10 [[6 [[1 1] [1 41]]]
[0 2]]]]]]]
```

Any expression's compiled formula lies one command away.  Nothing
between the type system and the metal is hidden.

A Jock program is a NockApp kernel on Nockchain infrastructure,
a terminal REPL, or—via the same namespace protocols—an Urbit-side
citizen, without a porting layer, because all three speak the noun the
program already is.

## Determinism, proof, and cost

*Aspirational; see [PR #38](https://github.com/sigilante/jock/pull/38)
for the current state of the story.*

Jock is zkVM-native:  it supports a `Based` Goldilocks-field `Atom`
restriction, a `Belt` type in the standard library, and other affordances
like access to cryptographically safe randomness and transaction
builders as well as circuit cost accounting.

## The constitution

The philosophy is enforced by how the language is built. Every
construct is either a *kernel form*—one typed lowering rule, one
code-generation production—or *sugar*, one AST rewrite. A keyword
enters the language only with its grammar entry, its classification,
its rule, and a positive and negative test vector. The corpus pins
values, emitted code noun-for-noun, refusal tags, and the runtime
ABI (by hash).

The foreign-function boundary follows the same temperament:  the Hoon
runtime library is a hand-curated signature list—each arm mirrors
the Hoon type it wraps, callers adapt—because an open FFI at a
polymorphic signature is unsoundness with good ergonomics.  Every
AST node, type, and emitted instruction carries its source position
by invariant, which is why positioned, machine-readable diagnostics
remain cheap here.

## Nockchain and Urbit are first-class

While Urbit and Nockchain/NockApp have different requirements, Jock is
designed to serve both.  The language is a kernel image that runs
on either platform, and the compiler is a library that can be linked
into either platform's runtime.  The language is a noun, and the compiler
is a noun, thus both are first-class citizens of the same substrate.

Jock protocols exist in the standard library to support either target,
and the compiler is designed to be agnostic to the target platform.
(This will be a point of maintenance friction as Urbit continues to
advance its Hoon kelvin version from Nockchain's index at 138k.)

## The road

Some of the brief is still ahead. Tooling grows along the agent axis
first:  JSON check lanes exist today; LSP-shaped queries and
editor/MCP surfaces ride the same compiler arms.  A second,
independent compiler in Rust begins against the frozen spec and the
vector corpus, which doubles as a conformance suite for free.
Self-hosting (Jock compiling Jock) awaits the jet dashboard,
around v1.2.

One capability is already quietly present: limited internal DSLs.
Modules export traits, operators bind per-method, and an imported
operator dispatches on its receiver — so a parser combinator library
gives its users `parser.just('a') ⊛ parser.just('b')` with sequencing
binding tighter than alternation, and the glyph means nothing
anywhere else. The language lends its surface without lending its
semantics — which is, in the end, the whole idea.
