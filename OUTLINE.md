# The Jock Programming Language
## N. E. Davis `~lagrev-nocfep`

- **Audience**: mainstream developers (Swift/Rust background) meeting Nock for the first time. Hoon appears only as interop context.
- **Voice**: tutorial register — conversational, example-driven, builds real programs — with a full reference section at the end (keywords, grammar, precedence, erasure, operators).
- **Ordering**: language-first. Jock from chapter 1; the noun view and the Nock ISA are revealed where erasure makes them necessary, then treated fully.
- **Interactivity**: static listings only, each carrying its CI-verified `// expect:` value. No in-browser REPL for now.

> **Currency.** Revised 2026-09-19 against the syntax arc
> (`docs/syntax-arc.md`): angle-bracket generics, named constructor
> calls, `enum`, `impl … for …`, the re-cut container literals,
> qualified case patterns, `alias … is …`, and the `Nat`/`Int`/
> `Float64`/`Byte`/`UniChar` names. Chapter text below uses current
> syntax throughout. Where a chapter names something that does not
> exist yet, it says so.

## Structure

Six parts plus a reference section. Jock from page one; the noun/Nock layer surfaces mid-book, exactly where erasure and kernels force it — so the reveal ("your structs were binary trees all along, and the whole machine is twelve instructions") lands as a payoff, not a prerequisite. Each chapter builds or extends a real program whose final listing carries its `// expect:` value.

Language beginners will work through the first two parts of the book first, then
pivot to either Parts IV and VI (Nockchain and NockApp) or Part V (Urbit) depending on
their interests.  Part III, on the compiler, is essential for those who want to
understand how Jock programs are translated into Nock, but it can be read independently
of the other parts.

### Part I — Writing Jock
1. **First program.** Statements and the final expression; `let`;
   `func`; calling. The adjacency law introduced the honest way: make
   the `fib (n)` mistake, read the loud hint, learn the rule. Running
   programs with `tools/jockc.sh run`.
2. **Values.** Atoms; auras as units-of-measure on numbers; `Nat`
   as the aura a decimal literal carries and `Atom` above it;
   `true`/`false`, `%terms`, bytes and strings; `Int` (ZigZag) and
   `Float64` literals; cells.
   (Margin note, planted early, cashed later: "an atom is just an
   unsigned integer; a cell is just a pair — hold that thought.")
3. **Flow.** `if`/`else`; `loop`/`recur` and labelled loops
   (`loop outer { … recur outer }`, and why a bare `recur` re-enters
   the innermost); `var` and assignment; word connectives and
   short-circuit; the counter as the running example. (`$(…)`
   re-entry is reserved and **unimplemented** — it refuses
   `%parse-todo`; mention it only as a margin note, if at all.)
4. **Functions in full.** Multi-parameter funcs, lambdas, functions
   as values; adjacency groups as mutual recursion; the twelve-level
   precedence table by example; non-associative comparisons.
5. **Collections.** `List<T>` and list literals; the bracket carries
   list *and* map, told apart by the arrow the type also writes
   (`Map<K->V>`, `[1 -> 100]`, empties `[]` and `[->]`); a set is
   *constructed*, `Set<T>([…])`, because braces are blocks; index
   sugar `e[i]`, `e[i] = v`; `len`; strings as data — `Byte` as a
   guarded byte, `UniChar` as a Unicode scalar, and the honest note
   that a String **is a cord of UTF-8 bytes**, so the two are not
   interchangeable and encoding between them is explicit;
   interpolation. Worked example: `matmul.jock`.
6. **Shapes of your own.** Structs and **named constructor calls**
   (`Point( x: 1, y: 2 )` — the glued paren constructs); field
   access; `alias New is Old`; `enum` with payloads; `match`,
   exhaustiveness with witness patterns, unreachable-case errors.
   **Case patterns are qualified** (`.circle(r)` or
   `Shape.circle(r)`) and a bare name is a *binding* — worth a full
   aside, because it is "one meaning per spelling" earning its keep:
   the two used to be told apart by whether the name happened to be
   a case, so adding a case to an enum could silently turn a binding
   into a match and kill every arm below it. Worked example:
   `poker.jock` (built across the chapter).
7. **Maybe, either, and casts.** `T?` and `??`; untagged unions
   `A | B`; `as` / `as?` / `as!`; validating foreign data (the
   `molds.jock` story: `300 as? Byte` fails because the type means
   byte). Discriminability introduced informally: "the compiler must
   be able to tell the members apart by looking — here's what looking
   means."
8. **Traits, classes, operators.** Traits and impls; coherence in one
   paragraph; classes as sealed state + methods; operator traits
   (`add(+)`), `Show` powering interpolation; `==` via `Eq` vs `===`
   identity. Worked example: `point.jock`.
9. **Generics.** Type parameters in angle brackets on funcs,
   structs, enums, traits, impls (`func<T>`, `List<@>`); bounds as
   dictionaries (one formula per generic function — stated,
   demystified later); parameterized traits closing the loop on
   `e[i]`. Higher-order functions: `lib/hof` is the exhibit —
   currying needs no encoding, since `A -> B -> C` is
   right-associative and a multi-argument func has a tuple domain.
   State the ceiling honestly: rank-1 means a generic function is
   **not first-class**, so passing one to a higher-order function
   wraps it at a pinned type. Worked examples: `sort.jock`,
   `lib/hof`.
10. **Modules.** `import hoon` and the ambient prelude; writing and
    importing a Jock module; `--data-dir`; qualified names and types;
    the 1.0 fences stated honestly. Worked examples: `parser.jock`
    and `rational.jock` (a sealed class crossing an import boundary).

### Part II — The reveal: nouns and Nock
11. **Everything is a noun.** Erasure, from above: what your values
    *are* — structs as right-nested tuples, enums as `[tag payload]`,
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
23. **Jock on Urbit.** What changes and what does not: the same
    language and the same erasure, a different host. The desk layout
    (`urbit/desk/`), building and installing, and the honest framing
    that this track is younger than Part IV's.
24. **The agent protocol.** `trait GallAgent` — `onInit`, `onPoke`,
    `onWatch`, `onLeave`, `onAgent`, `onArvo`, `onFail`, `onPeek`,
    each answering `(List<*>, Self)`: effects out, new state back,
    the same pure-state-machine shape Part IV established, widened to
    Gall's eight entry points. `counter.jock` and `timer.jock` as the
    two smallest complete agents.
25. **Talking to vanes.** The vane libraries in `urbit/desk/lib/` —
    `behn` (timers), `clay` (files), `dill` (terminal), `eyre` (HTTP
    in), `iris` (HTTP out), `jael` (keys), `gall` itself — as ordinary
    Jock modules over arvo-shaped nouns. `timer.jock` for behn,
    `irisdemo.jock` for iris, `claydemo.jock` for clay.
26. **Subscriptions.** `pub.jock` and `sub.jock` as a pair: the
    publish/subscribe round trip, what `onWatch` and `onAgent` are
    for, and why the wire format is just the erasure again.
27. **A real application.** `signup.jock` end to end — HTTP in through
    eyre, a hand-rolled parser over the request path, state across
    requests, rendered output. The chapter where the Urbit track
    stops being demos.

### Part VI — The chain *(in development on this branch; write last)*
28. **Reading the chain.** ZMap/ZSet vs Map/Set (TIP5 vs mug ordering
    — treap shape as consensus data); the watcher kernel; the package
    mechanism and its stated trust model.
29. **Building transactions.** Phase-2 material — hold until the
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
- `docs/spec/language.md` — surface syntax, NORMATIVE. Frozen
  2026-08-06 and **re-cut 2026-09-17** by the syntax arc
  (`docs/syntax-arc.md`), which changed generics to angle brackets,
  moved construction to the glued paren, retired `union` and
  `switch`, re-cut the container literals and renamed the numeric and
  character types. Precedence is frozen; the OPEN table is resolved,
  with OPEN-12 *dissolved* rather than resolved and OPEN-15 landed.
  Treat the tables as current rather than as a 1.0 contract — the
  release may ship zero-versioned so the syntax can settle further.
  The four design principles — one meaning per spelling; kernel and sugar; loud
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

**Runnable exhibits:** 28 examples in `examples/`, each executable
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

## 2. *(section removed; numbering kept so the gap is visible rather than looking like a typo)*

---

## 3. Production notes

- **Home**: `site/`, using the style-guide design system as-is; the
  six figure types cover every diagram the outline needs — no new
  visual vocabulary required. The 186px margin rail carries asides,
  honesty notes ("planned, not current"), and the planted-early /
  cashed-later cross-references the language-first ordering depends on.
- **Listings**: every listing carries its `// expect:` value and is
  **extracted from** the CI lanes, not transcribed into the prose.
  Not "where feasible" — unconditionally. The evidence for the
  stronger rule is recent and local: the normative specs' own worked
  examples silently stopped compiling during the syntax arc, and
  nothing caught it until someone compiled them by hand. A book has
  the same exposure and a worse blast radius, since its readers are
  by definition the people who cannot tell. *A listing without a
  pinned value is not a listing; a listing that is not extracted is
  a transcription, and transcriptions drift.*
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
