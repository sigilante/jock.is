<!-- EDITING SOURCE for philosophy.html — the HTML is the published
     artifact; edit here, then ask for (or make) the HTML sync.
     Margin notes render as the bracketed asides; transcript captions
     are the indented paragraphs after each code block. -->

# The noun wins

*Design notes*

Jock is a statically-typed language that compiles to [Nock](https://nock.is/cool).
Its surface is Swift-inspired first and Rust-inspired second, and its
design brief fits in one sentence: *do nothing weird.* I have strained
to keep every spelling unsurprising, every refusal legible, and every
layer visible — and where Swift or Rust idiom conflicts with noun
semantics, the noun wins. This post is the reasoning behind that
brief, with the receipts. Every transcript here was run against the
current compiler.

> **[margin 1]** The influence stack: Swift's surface manners, Rust's
> discipline about mutation and matching, Hoon's substrate honesty —
> and none of their complexity budgets.
>
> **[margin 2]** Everything below is pinned by a corpus of 738 vectors
> that assert values, emitted code, and refusal tags byte-for-byte.
> When I say a rule holds, a test holds it.
>
> **[margin 3]** The whole compiler, compiled to Nock, is a 1.3 MB
> kernel image that runs as an ordinary NockApp. The language you are
> reading about ships as a noun.

## 01 · One meaning per spelling

The principle of least surprise is usually a vibe. Jock makes it a
grammar rule: no syntactic form may mean different things in
different contexts. The load-bearing case is the **adjacency law** —
a call `(`, an index `[`, or a struct-literal `{` attaches to the
expression before it only when no whitespace separates them.

```
jojo> func f(n: @) -> @ { n };
ok
jojo> f(2)
2
jojo> f (2)
error: %parse-unglued at col 3
```

  A whitespace-blind grammar would have to guess what `f (2)` means.
  Jock refuses to guess — the hint says: *f (x) does not call f;
  write f(x) to call, or ; to sequence.* The same law forecloses
  JavaScript's newline-swallow hazard and Rust's struct-literal
  ambiguity without a single special case.

The other habitual ambiguities are simply not present. Sequencing is
always `;` — adjacent expressions never compose silently. Comparisons
are non-associative, so `a < b < c` is a parse error rather than a
boolean surprise. Collections are comma-separated everywhere. There
is no juxtaposition anywhere in the grammar, which means there is
nothing for a reader to mis-parse in their head.

## 02 · Loud failure, in prose

Where a plausible mis-spelling would otherwise change meaning or die
illegibly, the grammar is arranged so it fails to parse — and the
failure names the habit you brought with you.

```
jojo> a && b
error: %lex-connective at col 3
jojo> let mut x = 5;
error: %parse-let-mut at col 9
```

  The batch compiler adds the prose: the first hint reads *&& is not
  Jock; the connectives are words: a and b, a or b, not a*, and the
  second *mut is not a Jock keyword; let x binds immutably, var x = e
  is the mutable binding*. Every refusal is a tagged crash with a
  position, every tag is asserted in the test corpus, and the same
  facts ship as a machine-readable JSON record — a tool parses what a
  person reads.

This is also why the error surface can be trusted by things that are
not people. Coding agents drive the compiler through a one-writer
JSON schema; the language documents itself to models in a single flat
reference. A language whose errors teach is a language that can be
learned by anything that reads.

## 03 · Reservation and redemption

Least surprise has a version axis too. Jock's rule for growing the
language: **a future feature may only land in a spelling that refuses
today.** Reserve the spelling loudly now; redeem it later; and no
legal program ever changes meaning under an upgrade.

```
jojo> let a-1 = 5; a-1
5
jojo> -7 / +2
-3
jojo> let a = 5; a +42
47
```

  Both redemptions in one transcript: glued hyphens were reserved
  refusals until they became Term-style names (`a-1` is one name),
  and glued signs were reserved until they became signed-integer
  literals (`+42`, `-42`, ZigZag-encoded, division truncating toward
  zero). `a +42` is still addition — the sign is a literal only in
  operand position, so position does the disambiguating and nothing
  was reinterpreted.

The ledger of spellings still held in reserve: `&` (no bitwise
operators — bitwise is explicit through the runtime library), `**`,
and unary minus. Each refuses with prose today, which is exactly what
makes it available tomorrow.

## 04 · A type system without knots

The type system is bidirectional checking over structs, tagged
unions, traits, classes, and declaration-site generics — and it earns
"straightforward" by what it declines to do. There are no implicit
coercions of any kind: mixed-aura arithmetic refuses, sequencing is
explicit, and a cast is always a bit-reinterpretation, never a
conversion. The type system knows the difference, and refuses the one
that would lie:

```
jojo> 42 as Sint
error: %mint-cast-sint at col 4
jojo> let v = eval(83, (0, 1)); (v as? Sint) ?? +7
-42
```

  The same five characters — `as? Sint` — refuse on a known natural
  (whose bits would be silently misread) and validate on an untyped
  noun (whose bits are signed by provenance). That is the whole
  coercion philosophy in one refusal — the hint spells it out: *a
  cast reinterprets bits; sint(n) converts @ to Sint*. Conversion is
  a function you call, validation is a mold you check, and neither
  ever happens behind your back.

Two quieter knots are also absent. Types never say more than
signatures promise — a literal's singleton type never survives a call
boundary, so inference cannot leak implementation detail into an
interface. And the language is closed-world where open-world buys
only ambiguity: no exceptions, no null, no inheritance, no trait
objects. A heterogeneous collection is a declared union; open
polymorphism is a generic bound, resolved statically. Functions are
values; the core machinery beneath them is calling convention, not
concept.

## 05 · The floor is visible

Jock compiles through **Nockasm**, a semantic IR whose lowering to
Nock's twelve instructions is specified, vendored, and
conformance-tested against a reference implementation. Above it, the
erasure story is deliberately honest: a tagged union erases to
`[tag payload]` verbatim — which is not a compromise but the ABI,
since that noun is exactly what runtime drivers pattern-match. The
REPL shows you values as the nouns they are, and shows you the floor
itself on request:

```
jojo> :nock 1 + 41
[8 [[9 [4 [0 8.796.093.022.206]]] [9 [2 [10 [[6 [[1 1] [1 41]]]
[0 2]]]]]]]
```

  Any expression's compiled formula, one command away. Nothing
  between the type system and the metal is hidden, because on this
  substrate the metal is twelve instructions and a noun.

The same honesty is why one language serves three runtimes. A Jock
program is a NockApp kernel on Nockchain infrastructure, a terminal
REPL, or — through the same namespace protocols — an Urbit-side
citizen, without a porting layer, because all three speak the noun
the program already is.

## 06 · Determinism, proof, and cost

Jock is zkVM-native in the only way that phrase can be honest: the
language is deterministic all the way down, and everything
nondeterministic is an *effect the runtime supplies*. A kernel
receives entropy in its event — cryptographically safe randomness is
the host's obligation and arrives as data — and the language has no
way to manufacture time, randomness, or I/O on its own. Builds are
pin-reproducible; sealed release artifacts are byte-checked against
their own rebuild.

Cost is treated as tested behavior rather than folklore. The test
corpus carries a cost lane whose budgets are calibrated so that a
super-linear regression in the compiler goes red at the smallest
depth first; the same discipline is the intended road to *provable*
compile-time and proving-cost tuning as the zkVM story is
cross-checked. Jets — native accelerations of known formulas —
currently ride the substrate's own registered arithmetic; the
stateless jet dashboard (`%wild`) is deliberately deferred to v1.1,
because shipping 1.0 on the proven mechanism beats shipping the
experiment.

## 07 · The constitution

The philosophy is enforced by how the language is built, not by
resolve. Every construct is either a *kernel form* — one typed
lowering rule, one code-generation production — or *sugar*, one AST
rewrite. A keyword enters the language only with its grammar entry,
its classification, its rule, and a positive and negative test
vector. The corpus pins values, emitted code noun-for-noun, refusal
tags, and the runtime ABI (by hash); if it is not pinned, it is not
ruled.

The foreign-function boundary follows the same temperament: the Hoon
runtime library is a hand-curated signature list — each arm mirrors
the Hoon type it wraps, callers adapt — because an open FFI at a
polymorphic signature is unsoundness with good ergonomics. And every
AST node, type, and emitted instruction carries its source position
by invariant, which is why positioned, machine-readable diagnostics
are cheap here rather than heroic.

## 08 · The road

Some of the brief is still ahead, and it is scheduled rather than
aspirational. Tooling grows along the agent axis first — the JSON
check lanes exist today; LSP-shaped queries and editor/MCP surfaces
ride the same compiler arms. A second, independent compiler in Rust
begins against the frozen spec and the vector corpus, which doubles
as a conformance suite for free. Self-hosting — Jock compiling Jock —
waits on the jet dashboard, around v1.2. And 1.0 ships with a suite
of Nockchain and Urbit modules, because a language earns its
philosophy in libraries, not manifestos.

One capability is already quietly present: limited internal DSLs.
Modules export traits, operators bind per-method, and an imported
operator dispatches on its receiver — so a parser combinator library
gives its users `parser.just('a') ⊛ parser.just('b')` with sequencing
binding tighter than alternation, and the glyph means nothing
anywhere else. The language lends its surface without lending its
semantics — which is, in the end, the whole idea.

---

*jock.is · compiled to nock · runs as a noun*
