# The Jock Programming Language
## N. E. Davis `~lagrev-nocfep`

- **Audience**: mainstream developers (Swift/Rust background) meeting Nock for the first time. Hoon appears only as interop context.
- **Voice**: tutorial register — conversational, example-driven, builds real programs — with a full reference section at the end (keywords, grammar, precedence, erasure, operators).
- **Ordering**: language-first. Jock from chapter 1; the noun view and the Nock ISA are revealed where erasure makes them necessary, then treated fully.
- **Interactivity**: static listings only, each carrying its CI-verified `// expect:` value. No in-browser REPL for now.

## Structure

Six parts plus a reference section. Jock from page one; the noun/Nock layer surfaces mid-book, exactly where erasure and kernels force it — so the reveal ("your structs were binary trees all along, and the whole machine is twelve instructions") lands as a payoff, not a prerequisite. Each chapter builds or extends a real program whose final listing carries its `// expect:` value.

### Part I — Writing Jock
1. **First program.** Statements and the final expression; `let`;
   `func`; calling. The adjacency law introduced the honest way: make
   the `fib (n)` mistake, read the loud hint, learn the rule. Running
   programs with `tools/jockc.sh run`.
2. **Values.** Atoms; auras as units-of-measure on numbers; `true`/
   `false`, `%terms`, chars and strings; `Real` literals; cells.
   (Margin note, planted early, cashed later: "an atom is just an
   unsigned integer; a cell is just a pair — hold that thought.")
3. **Flow.** `if`/`else`; `loop`/`recur`; `var` and assignment;
   `$()` recursion points; word connectives and short-circuit;
   the counter as the running example.
4. **Functions in full.** Multi-parameter funcs, lambdas, functions
   as values; adjacency groups as mutual recursion; the twelve-level
   precedence table by example; non-associative comparisons.
5. **Collections.** `List(T)` and list literals; `Map`/`Set` literals;
   index sugar `e[i]`, `e[i] = v`; `len`; strings as data, `Char` as
   a guarded byte; interpolation. Worked example: `matmul.jock`.
6. **Shapes of your own.** Structs and struct literals; field access;
   `alias`; unions with payloads; `match`, exhaustiveness with witness
   patterns, unreachable-case errors. Worked example: `poker.jock`
   (built across the chapter).
7. **Maybe, either, and casts.** `T?` and `??`; untagged unions
   `A | B`; `as` / `as?` / `as!`; validating foreign data (the
   `molds.jock` story: `300 as? Char` fails because the type means
   byte). Discriminability introduced informally: "the compiler must
   be able to tell the members apart by looking — here's what looking
   means."
8. **Traits, classes, operators.** Traits and impls; coherence in one
   paragraph; classes as sealed state + methods; operator traits
   (`add(+)`), `Show` powering interpolation; `==` via `Eq` vs `===`
   identity. Worked example: `point.jock`.
9. **Generics.** Type parameters on funcs, structs, unions, traits,
   impls; bounds as dictionaries (one formula per generic function —
   stated, demystified later); parameterized traits closing the loop
   on `e[i]`. Higher-order functions, currying, etc. Worked example:
   `sort.jock`.
10. **Modules.** `import hoon` and the ambient prelude; writing and
    importing a Jock module; `--data-dir`; qualified names and types;
    the 1.0 fences stated honestly. Worked example: `parser.jock`.

### Part II — The reveal: nouns and Nock
11. **Everything is a noun.** Erasure, from above: what your values
    *are* — structs as right-nested tuples, unions as `[tag payload]`,
    `T?` as unit, lists null-terminated, `Bool` as 0/1. Axes and the
    tree numbering; lark (`p.<`, `p.+5`) now makes sense. The compact
    noun and cell-tree figures do the heavy lifting.
12. **The machine.** The Nock ISA in one chapter, adapted from
    nock.is: `*[subject formula]`; the twelve opcodes grouped as
    nock.is groups them (basic: 0–5, 10; composite: 6–9, 11), each
    with a small evaluation-flow figure; opcode 9 and the core idiom;
    opcode 11 hints as the value-transparent escape valve (%spot
    provenance, %slog printing, jets). Why determinism is the whole
    point. Depth delegated: per-opcode worked examples, the six
    "understanding" lenses, and the version history stay on nock.is,
    cross-linked from the margin rail.
13. **Types that vanish.** The type system, now explainable: nest and
    join by example; singletons and shallow widening (the anti-TMI
    design); guards checked at construction, erased after;
    discriminability in full — the three-instruction discriminant
    bound, and why `as?` compiles to one self-contained predicate
    formula. No runtime types, and what that buys.

### Part III — The compiler (how source becomes formula)
14. **The pipeline.** tokenize → parse → desugar → mint → expand;
    kernel and sugar — the desugar table as a guided tour ("`assert`
    is just `if`+`crash`; `a + b` is just a call"). AST plates as the
    figures.
15. **Nockasm.** The IR as the readable middle layer; `#let` and axis
    doubling (the `codegen.md` walkthrough of `+kbatt` is this
    chapter's spine); reading a `.nasm` artifact; the conformance law.
16. **Crashes with addresses, and speed.** Provenance: a runtime crash
    mapped to a source position end-to-end via `%spot`; jets by
    formula identity (why `20 + 22` is fast with no hint anywhere);
    wilts as the stated future.
17. **Why you can trust it.** The five verification lanes; refusal
    vectors that assert their error tag; the hoonc differential; the
    `+ut` oracle. Tutorial framing: "how would *you* know a compiler
    is right?" — the corpus discipline as the answer.

### Part IV — NockApp Kernels
18. **A program that stays alive.** The kernel model: pure state
    machine; the quad (poke, peek, load, state); the slam formula and
    axes 4/22/23/6; checkpointing. `counter.jock` line by line — seven
    lines, a complete persistent app.
19. **Effects and drivers.** The closed Effect union; erasure as wire
    format (the noun the Rust driver parses *is* the union's
    erasure); arvo-shaped pokes and the mirror-struct idiom.
    Worked example: `stoplight.jock`.
20. **A web server.** `webserver.jock` + the stock http driver; the
    request/response round trip; state across requests; the GET-cache
    lesson as a real-world aside.
21. **Upgrade without downtime.** `counter-v2.jock`; `load` as an
    ordinary function; `old as! Self` vs writing a migration.
22. **The REPL is a kernel.** The whole compiler in a 1.3 MB jam;
    history as state; what this proves about the model. (Also serves
    as the "run it yourself locally" chapter for motivated readers.)

### Part V — Urbit Kernels

### Part VI — The chain *(in development on this branch; write last)*
23. **Reading the chain.** ZMap/ZSet vs Map/Set (TIP5 vs mug ordering
    — treap shape as consensus data); the watcher kernel; the package
    mechanism and its stated trust model.
24. **Building transactions.** Phase-2 material — hold until the
    branch lands; fixture-identity is the story.

### Reference (the back of the book)
R1. The Nock specification (one page, the 4K reduction rules verbatim;
everything else links to nock.is). R2. Keyword-by-keyword
reference with railroad diagrams (kernel forms and sugar, each with
its lowering/rewrite). R3. Precedence table. R4. The erasure table.
R5. The guard set. R6. The operator table. R7. Literal forms. R8. The
judgment table (for readers who want the spec's view). R9. Glossary
(noun, subject, aura, bunt, nest, sugar, kernel, jet, wilt…). R10. The
examples as graded exercises. R11. For Hoon programmers: where Jock
deliberately differs (first-case bunt, flat auras, spaced minus, no
runtime types) — the fast path for the secondary audience.

---

## 1. What the audit found — the raw material

The book is unusually well-provisioned. Almost every chapter has a
normative source, a runnable exhibit, and a test lane already standing
behind it.

**Normative sources (all frozen or near-frozen):**
- `docs/spec/language.md` — surface syntax, NORMATIVE since 2026-08-06
  (precedence frozen, all 22 OPENs resolved). The four design
  principles — one meaning per spelling; kernel and sugar; loud
  failure; provenance — are a ready-made thesis statement.
- `docs/spec/types.md` — the judgment inventory (elab, nest, join,
  dish, seek, bunt, erase, embed, mint/mill) as ⇒/⇐ rules, the closed
  `$typ` lattice, erasure table, decision ledger D-1..D-24.
- `docs/spec/nockasm.md` + `nockasm-target.md` — the IR, the
  conformance law, the deterministic lift.
- `docs/spec/runtime.md` — the FFI arm records, operator table, the
  `Kernel` trait, the NockApp slam formula and axes (4 load / 22 peek /
  23 poke / 6 state), the Effect union and driver wire formats.
- `docs/spec/chain.md`, `docs/imports.md`, `docs/codegen.md`,
  `docs/POSSIBLES.md`, `docs/ROADMAP.md` — the interop story, module
  system, a worked hand-emission walkthrough, and the design ledger.

**Runnable exhibits:** 16 examples in `examples/`, each executable
documentation with a pinned `// expect:` value, forming a natural
difficulty gradient: `counter` (7 lines, a whole kernel) → `sort`
(bounded generics) → `poker` (the big pure-functional program) →
`stoplight`/`counter-v2` (kernels, upgrade) → `webserver` (HTTP) →
`chainkernel`/`txbuild` (chain track, in development on this branch).
These are the book's worked examples *and* its exercise set, already
run in CI on every push.

**An existing Nock tutorial to draw on:** nock.is
(`~/Documents/nock.is`, same author, freely reusable) — a Jupyter-Book
with per-opcode chapters (0–11, basic vs composite, worked examples as
executable notebooks), six "ways to understand Nock" lenses
(combinator, Turing machine, lambda calculus, assembly, cellular
automaton, alchemy), a hints & jetting chapter (static vs dynamic
hints, jet mismatch), building chapters (kernels, virtualization,
NockApp/Nockchain — including the load/peek/poke kernel shape, the
PMA, and the zkVM story), a Nocksasm notebook, the Nock version
history (4K back to 13K and the U model), and a glossary. This removes
the burden of teaching Nock from scratch: the Jock book teaches the
*minimum* inline and delegates depth. Note: nock.is's "Relationship to
Jock" page is stale (describes the zorp-corp alpha) — an update target
once the book exists, and the natural cross-link back.

**A finished design system:** `site/design/style-guide.html` — warm
paper ground, Zilla Slab + Sometype Mono, a 64ch column with a 186px
margin-note rail, framed plates, and a fixed grammar of exactly six
figure types with four fill states. The figure grammar maps one-to-one
onto the book's needs:

| figure type (style guide §4) | chapters it serves |
|---|---|
| cell tree, red axis numbers | nouns, axes, subject addressing, lark |
| abstract-syntax plate | parse, desugar, the kernel/sugar split |
| atom bit strip (LSB-first) | atoms, auras, cords, jam |
| compact noun (halving plate) | erasure, kernel state layout |
| keyword railroad | the grammar reference section |
| evaluation flow (diamond tests) | Nock reduction, match compilation, dispatch |

**Distinctive ideas the book must own** (things no other language book
covers, in roughly the order a reader can absorb them):
1. Everything is a noun; the subject is the only environment.
2. The adjacency law — glued vs spaced as the one parsing rule.
3. Kernel and sugar — every construct is either one typed lowering
   rule or one AST rewrite, never both, never neither.
4. Singleton types with shallow widening (the anti-TMI design).
5. Discriminability (`dish`) as *the* Jock-specific type concept: `A | B`
   and `T?` are legal exactly when a three-instruction discriminant
   (cell test, root-tag test, head-tag test) can tell the members apart.
6. Total erasure — no runtime type information; the erasure table is
   also the Hoon/chain interop contract.
7. Cores as ABI, never as semantics: closures, dictionaries, and
   function groups are calling convention; `%core` does not exist in
   `$typ`.
8. Kernels as pure state machines; drivers own the world; the Effect
   union's erasure *is* the driver wire format.
9. Jets by formula identity; provenance by `%spot` hints; determinism
   as a per-commit invariant.
10. "A rule without a vector is not a rule" — the corpus discipline as
    a way of building a language.

---


---

## 3. Production notes

- **Home**: `site/`, using the style-guide design system as-is; the
  six figure types cover every diagram the outline needs — no new
  visual vocabulary required. The 186px margin rail carries asides,
  honesty notes ("planned, not current"), and the planted-early /
  cashed-later cross-references the language-first ordering depends on.
- **Listings**: every listing carries its `// expect:` value and,
  where feasible, is extracted from or round-tripped against the CI
  lanes, so the book inherits the repo's no-drift discipline: *a
  listing without a pinned value is not a listing.*
- **Tutorial mechanics**: each Part I–IV chapter builds or extends a
  real program (mostly drawn from `examples/`), ending with exercises
  that reference R10.
- **nock.is division of labor**: the Jock book owns the language and
  the compiler; nock.is owns Nock itself. Adapt (don't duplicate) the
  prose the book needs inline — restyled into the book's design system
  and voice — and link out for depth (per-opcode notebooks, the
  lenses, history, deep-nock). The NockApp/kernel chapters (Part IV)
  can likewise draw on nock.is's building section for the runtime-side
  framing (PMA, drivers, the zkVM story) while the book owns the
  Jock-kernel side. After launch, refresh nock.is's stale
  "Relationship to Jock" page and cross-link both ways.
- **Chain chapters** ride the feature branch; structure them last.
- **Not in the book** (or margin-note only): the slice-by-slice build
  history, honk findings, POSSIBLES — though a closing essay on *how
  the language was built* (specs-first, a vector per rule, five lanes)
  may be worth keeping as an epilogue; it is the most broadly
  interesting methodological content in the repo.

## 4. Remaining open questions

- **Chain scope**: is Part V in the 1.0 book, an online-only later
  addition, or out entirely? (Deferred while the branch is in flight.)
- **Epilogue**: include the "how it was built" essay?
- **Title and URL** for the site (and whether it lives beside nock.is
  as a sibling — e.g. a jock.* domain — with shared cross-linking).
