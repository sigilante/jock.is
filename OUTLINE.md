# The Jock Programming Language
## N. E. Davis `~lagrev-nocfep`

- **Audience**: mainstream developers (Swift/Rust background) meeting Nock for the first time. Hoon appears only as interop context.
- **Voice**: tutorial register — conversational, example-driven, builds real programs — with a full reference section at the end (keywords, grammar, precedence, erasure, operators).
- **Ordering**: language-first. Jock from chapter 1; the noun view and the Nock ISA are revealed where erasure makes them necessary, then treated fully. The compiler comes *last*, because it is the one part a reader can skip.
- **Interactivity**: static listings only, each carrying its CI-verified `// expect:` value. No in-browser REPL for now.

> **Currency.** Revised 2026-10-10 against the beta RC
> (`v0.1.0-beta-rc`, tagged 2026-09-27) and the two language features
> that landed just before it: `private` (jock#108) and generic
> classes (jock#99). The 2026-09-19 revision against the syntax arc
> still holds — angle-bracket generics, named constructor calls,
> `enum`, `impl … for …`, the re-cut container literals, qualified
> case patterns, `alias … is …`, and the `Nat`/`Int`/`Float64`/
> `Byte`/`UniChar` names. Chapter text below uses current syntax
> throughout. Where a chapter names something that does not exist
> yet, it says so.
>
> **This revision also re-ordered the parts.** The compiler moved
> from Part III to Part VI; see "Reading paths" below for why.
>
> **Publication settled 2026-10-12** (§4): USTJ, serialized
> back-to-front against syntax risk, with the collected print edition
> gated on the 1.0 syntax freeze and the reference sections staying
> online.

## Structure

Six parts plus a reference section. Jock from page one; the noun/Nock layer surfaces mid-book, exactly where erasure and kernels force it — so the reveal ("your structs were binary trees all along, and the whole machine is twelve instructions") lands as a payoff, not a prerequisite. Each chapter builds or extends a real program whose final listing carries its `// expect:` value.

The application parts come before the compiler part. That is a change
from the first draft, and the reason is the stated audience: a reader
who came to write programs should not meet four chapters of compiler
internals before the chapter where a program stays alive. Nothing in
Parts III–V needs Part VI — they need Part II, for axes and erasure —
so the compiler is genuinely last rather than merely late. It also
puts **"Why you can trust it"** at the end of the book, which is where
that argument belongs: it is the closing chapter of the compiler part
and of the whole book at once, and it absorbs what was going to be a
separate methodological epilogue.

### Reading paths

| reader | path |
|---|---|
| new to Jock *and* Nock (the default) | I → II, then pick an application part |
| building NockApps | I → II → **III** |
| building on Urbit | I → II → **IV** (III first is useful but not required) |
| working on the chain | I → II → **V** |
| "how does it *work*" / "how do I know it's right" | I → II → **VI**, readable at any point after Part II |
| already knows Nock | start at I; read II as reference |
| Hoon programmer | **R11** first (where Jock deliberately differs), then skim I, then II onward |

Part VI is self-contained after Part II, so a reader who wants the
pipeline early can take it early; the ordering is a default, not a
dependency.

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
   interpolation. Worked examples: `collections.jock` (the
   literals and the index sugar, one at a time) and `matmul.jock`.
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
   identity. "Sealed" is enforced rather than conventional: a class
   refuses construction outside its module, and marking the state
   struct `private` closes the other door — the one where a caller
   reaches the state's *erasure* by casting. Full treatment in
   chapter 10, which owns visibility. Worked example: `point.jock`.
9. **Generics.** Type parameters in angle brackets on funcs,
   structs, enums, traits, impls and **classes** (`func<T>`,
   `List<@>`); bounds as
   dictionaries (one formula per generic function — stated,
   demystified later); parameterized traits closing the loop on
   `e[i]`. Higher-order functions: `lib/hof` is the exhibit —
   currying needs no encoding, since `A -> B -> C` is
   right-associative and a multi-argument func has a tuple domain.
   State both ceilings honestly. Rank-1 means a generic function is
   **not first-class**, so passing one to a higher-order function
   wraps it at a pinned type. And **a binder takes exactly one
   bound** — there is no `T: Add + Lt` and no trait inheritance,
   because the `$bnd` ABI passes one dictionary per binder — so any
   abstraction needing two capabilities of its element type is
   unexpressible without an aggregate trait. That is why `lib/interval`
   is still monomorphic over `rational.Rat` rather than generic over
   anything ordered and arithmetic; the limitation is documented in
   the repo at `examples/generic-class.jock`, which is the exhibit for
   both the feature and its edge. Worked examples: `sort.jock`,
   `generic-class.jock`, `lib/hof`.
10. **Modules and visibility.** `import hoon` and the ambient
    prelude; writing and importing a Jock module; `--data-dir`;
    qualified names and types; the 1.0 fences stated honestly.
    **`private`** gets its own treatment here, because it is the
    chapter's real subject: a declaration marked `private` may not
    appear in the module's export surface, and the check covers *both*
    surfaces — a `private` type cannot escape in an exported
    function's signature, nor in an exported typedef's body. The one
    deliberate exemption is a class's own state type, which is what
    makes a sealed class expressible at all. Say why the rule is
    shaped this way: `as` is **reinterpretation, not conversion**, so
    privacy that leaked through a nominal's erasure would not be
    privacy. Worked examples: `parser.jock`; `rational.jock` (a sealed
    class crossing an import boundary, its state `private`);
    `interval.jock` with `rational.jock` beneath it (modules that
    *stack* — a dependency's type in your own interface, legal since
    the transit check); and `twoc.jock` (width-parameterized two's-
    complement arithmetic — the width lives in sealed state, so
    `t.add(a, b)` *is* 8-bit or 64-bit arithmetic rather than a pile
    of width arguments).

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
    provenance, %slog printing, jets); opcode 12 as the namespace
    read, forward-referenced to the Urbit part where `roof.jock`,
    `scry.jock` and `peektry.jock` put it to work. Why determinism is
    the whole point. Depth delegated: per-opcode worked examples, the six
    "understanding" lenses, and the version history stay on nock.is,
    cross-linked from the margin rail.
13. **Types that vanish.** The type system, now explainable: nest and
    join by example; singletons and shallow widening (the anti-TMI
    design); guards checked at construction, erased after;
    discriminability in full — the three-instruction discriminant
    bound, and why `as?` compiles to one self-contained predicate
    formula. No runtime types, and what that buys.

### Part III — NockApp Kernels
14. **A program that stays alive.** The kernel model: pure state
    machine; the quad (poke, peek, load, state); the slam formula and
    axes 4/22/23/6; checkpointing. `counter.jock` line by line — seven
    lines, a complete persistent app.
15. **Effects and drivers.** The closed Effect union; erasure as wire
    format (the noun the Rust driver parses *is* the union's
    erasure); arvo-shaped pokes and the mirror-struct idiom.
    Worked example: `stoplight.jock`.
16. **A web server.** `webserver.jock` + the stock http driver; the
    request/response round trip; state across requests; the GET-cache
    lesson as a real-world aside. `http-counter.jock` is the smaller
    companion: the Part III counter, now reachable over HTTP, which
    makes the driver boundary the only new idea in the chapter.
17. **Upgrade without downtime.** `counter-v2.jock`; `load` as an
    ordinary function; `old as! Self` vs writing a migration.
18. **The REPL is a kernel.** The whole compiler in a 1.3 MB jam;
    history as state; what this proves about the model. (Also serves
    as the "run it yourself locally" chapter for motivated readers.)

### Part IV — Urbit Kernels
19. **Jock on Urbit.** What changes and what does not: the same
    language and the same erasure, a different host. The desk layout
    (`urbit/desk/`), building and installing, and the honest framing
    that this track is younger than Part III's.
20. **The agent protocol.** `trait GallAgent` — `onInit`, `onPoke`,
    `onWatch`, `onLeave`, `onAgent`, `onArvo`, `onFail`, `onPeek`,
    each answering `(List<*>, Self)`: effects out, new state back,
    the same pure-state-machine shape Part III established, widened to
    Gall's eight entry points. `counter.jock` and `timer.jock` as the
    two smallest complete agents.
21. **Talking to vanes.** The vane libraries in `urbit/desk/lib/` —
    `behn` (timers), `clay` (files), `dill` (terminal), `eyre` (HTTP
    in), `iris` (HTTP out), `jael` (keys), `gall` itself — as ordinary
    Jock modules over arvo-shaped nouns. `timer.jock` for behn,
    `irisdemo.jock` for iris, `claydemo.jock` for clay. The
    **namespace read** lands here too, cashing chapter 12's opcode-12
    forward reference: `roof.jock` builds a namespace a program can be
    read against, `scry.jock` performs the read, and `peektry.jock` is
    the honest failure case. `patp.jock` covers `@p` phonetic names,
    which is where an Urbit reader first meets an aura doing real
    work.
22. **Subscriptions.** `pub.jock` and `sub.jock` as a pair: the
    publish/subscribe round trip, what `onWatch` and `onAgent` are
    for, and why the wire format is just the erasure again.
23. **A real application.** `signup.jock` end to end — HTTP in through
    eyre, a hand-rolled parser over the request path, state across
    requests, rendered output. The chapter where the Urbit track
    stops being demos.

### Part V — The chain
24. **Reading the chain.** ZMap/ZSet vs Map/Set (TIP5 vs mug ordering
    — treap shape as consensus data); block reads for interop; the
    watcher kernel. The scope ruling stated honestly: native Jock owns
    types, transacting and block reads, while tip5 and cheetah stay
    FFI. Worked example: `chainwatcher.jock`.
25. **Packages, and the trust you place in them.** The package
    mechanism: a `%nock` library with curated signatures and no Jock
    source. Why a package must carry its construction *formula* rather
    than its value — shipped as a value its construction never runs in
    the consuming process, nothing registers, and every arm inside it
    interprets; the measurement was ~9s per chain signature against
    ~14ms (jock#81). Teach the one fact this needs **inline** — a jet
    is matched when a core is *created*, so a core that was built
    somewhere else and shipped as a finished value was never offered
    to the runtime for matching — so the chapter stands without Part
    VI, which then covers the same ground from the compiler's side.
    The stated trust model: `%nock` signatures are
    pinned *assertions*, since nothing verifies the core matches them,
    where a `%jock` module's signatures are derived by minting and
    cannot lie. Cross-references the jets chapter in Part VI.
26. **Building transactions.** `txbuild.jock` end to end, with
    `chainkey-arms`/`chainrand-arms`/`chaintx-arms` as the arm-level
    exhibits; fixture identity as the story — the fixtures are the
    oracle, and a transaction that round-trips against them is the
    claim. The honest note on randomness: the story is poor, the LCG
    is fine for demos, and a chain seed comes from the ovum's entropy
    because kernel state is checkpointed.

### Part VI — The compiler (how source becomes formula)
27. **The pipeline.** tokenize → parse → desugar → mint → expand;
    kernel and sugar — the desugar table as a guided tour ("`assert`
    is just `if`+`crash`; `a + b` is just a call"). AST plates as the
    figures.
28. **Nockasm.** The IR as the readable middle layer; `#let` and axis
    doubling (the `codegen.md` walkthrough of `+kbatt` is this
    chapter's spine); reading a `.nasm` artifact; the conformance law.
29. **Crashes with addresses, and speed.** Provenance: a runtime crash
    mapped to a source position end-to-end via `%spot`; jets by
    formula identity (why `20 + 22` is fast with no hint anywhere);
    wilts as the stated future. The chapter's claim is *inspectable*
    rather than asserted: `jockc.sh jets` reports which of a program's
    calls land on formulas the runtime recognizes and which interpret,
    so a reader can see the cliff instead of being told about it.
    (*Unmerged as of 2026-10-10* — jock#110, `sigilante/jet-residency`.
    Do not write this paragraph against it until it lands.) Open
    with the surprise that motivates the whole topic — the program
    `42` already carries `+add`'s formula verbatim, because closure
    capture drags the whole pinned core in — which is the shortest
    route to "jets are matched by content, not by name."
    Cross-references chapter 25 on packages, the same mechanism seen
    from the consuming side.
30. **Why you can trust it.** The verification lanes; refusal
    vectors that assert their error tag; mutation testing as the rule
    behind the rule ("a rule without a vector is not a rule", and a
    vector that does not redden when you break the rule is not a
    vector); the hoonc differential; the `+ut` oracle. Tutorial
    framing: "how would *you* know a compiler is right?" — the corpus
    discipline as the answer.

    **This is the last chapter of the book, deliberately.** It is the
    compiler part's conclusion and the book's at once, and it is where
    the methodological essay lives rather than in a separate epilogue:
    specs first, a vector per rule, a lane per claim. Front matter
    should plant a one-line promise that points here, in the same
    planted-early / cashed-later style chapter 2 uses for nouns.

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

**Runnable exhibits:** **45** examples in `examples/`, each executable
documentation with a pinned `// expect:` value, forming a natural
difficulty gradient: `counter` (7 lines, a whole kernel) → `sort`
(bounded generics) → `poker` (the big pure-functional program) →
`stoplight`/`counter-v2` (kernels, upgrade) → `webserver` (HTTP) →
`chainkernel`/`txbuild` (the chain track, shipped). These are the
book's worked examples *and* its exercise set, already run in CI on
every push — 45/45 green.

The chapter list above names about eighteen of them. The rest fall
into four families, and **R10 is their home** rather than a chapter:

- *games and puzzles* — `conway`, `minesweeper`, `wordle`: the best
  graded exercises in the set, because each is a complete program a
  reader can want to write;
- *`-arms` exhibits* — `hof-arms`, `parser-arms`, `rational-arms`,
  `interval-arms`, `twoc-arms`, `rand-arms`, `chainkey-arms`,
  `chainrand-arms`, `chaintx-arms`: arm-level coverage for a library,
  which makes them reference material, not narrative;
- *library demonstrations* — `parser-combinators`, `string-views`,
  `tap`, `sort-imported`, `errol` (the float-rendering algorithm,
  which also makes a good aside in chapter 2 on where `Float64`
  printing comes from);
- *larger kernels* — `walletkernel`, honestly labelled: the wallet
  line is **paused** and the example is demo-grade by intent, not a
  recommendation.

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
- **Tutorial mechanics**: each Part I–V chapter builds or extends a
  real program (mostly drawn from `examples/`), ending with exercises
  that reference R10. Part VI is the exception by nature: its exhibits
  are the compiler's own artifacts, not programs the reader writes.
- **nock.is division of labor**: the Jock book owns the language and
  the compiler; nock.is owns Nock itself. Adapt (don't duplicate) the
  prose the book needs inline — restyled into the book's design system
  and voice — and link out for depth (per-opcode notebooks, the
  lenses, history, deep-nock). The NockApp/kernel chapters (Part III)
  can likewise draw on nock.is's building section for the runtime-side
  framing (PMA, drivers, the zkVM story) while the book owns the
  Jock-kernel side. After launch, refresh nock.is's stale
  "Relationship to Jock" page and cross-link both ways.
- **Chain chapters**: the feature branch landed and the examples ship
  — `chainkernel`, `chainwatcher`, `txbuild` and the three `chain*-arms`
  exhibits all run in CI — so Part V is writable now rather than held.
  What remains genuinely in flight is depth, not existence.
- **Not in the book** (or margin-note only): the slice-by-slice build
  history, honk findings, POSSIBLES. The *methodological* content —
  specs-first, a vector per rule, a lane per claim — is **not** cut and
  **not** an epilogue: it is chapter 30, which is the end of the book.

## 4. Publication

**The publisher question is closed: USTJ (2026-10-12).** Neal runs the
*Urbit Systems Technical Journal*, so there is no pitch, no gatekeeper,
no revenue split and no external timeline — and the audience is already
the right one. There is also already a thread: the co-design paper
(*Jet-Accelerated Code and the Co-Design Problem*, USTJ vol. 3,
mechanized in `lean-nock`) is a published precursor to chapter 29.

### Serialize first, collect second

A journal admits a path the trade-book framing does not: **publish
parts as USTJ articles as they are written, and collect them into the
book afterwards.** Three reasons this is the right shape and not just a
convenience.

1. It spreads 400–600 pages across issues instead of one monolithic
   push, which is the dominant risk for a solo author with nothing
   drafted.
2. Each part is read, cited and criticised while the structure can
   still change, rather than after it is printed.
3. **The chapters least exposed to syntax churn are the ones most
   publishable now.** Part VI (pipeline, Nockasm, provenance and jets,
   trust) and Part II (nouns, the machine, erasure) barely touch
   surface syntax; Part I is where the churn lives. So the serial order
   runs *back-to-front against the risk*: write the stable material
   first and let the syntax settle under the chapters that depend on
   it.

**Serial order:** chapter 30 and Part VI → Part II → Parts III–V →
Part I last. Chapter 30 is a standalone article already — §3 calls that
methodology the most broadly interesting content in the repo — and it
needs no syntax decision that is still in flight.

### Print is gated on the 1.0 syntax freeze

The collected print edition waits for frozen syntax, and should then
*mark* 1.0 rather than gamble on it. The reason is specific, not
cautious: the syntax arc re-cut generics to angle brackets, moved
construction to the glued paren, retired `union` and `switch`, re-cut
the container literals and renamed the numeric types — **three weeks
before the RC**. The web edition absorbs a change like that in an
afternoon; print absorbs it in a second edition.

Owning the press removes the one thing that would have enforced the
wait, so it is written down here as a rule instead.

Two consequences:

- **R1–R11 do not go in print**, or go in heavily abridged with a
  pointer. They are the part a reader looks up rather than reads, and
  the part that costs the most pages. Generated and online, always
  current (`GENERATOR.md`). This is the same split as the human/agent
  one, which is a good sign: print gets the narrative, the generator
  gets the tables.
- **The extraction rule becomes a precondition for printing**, not
  merely for chapter 1. A stale listing on the web is a fix; in print
  it is a run of permanently wrong copies.

### What self-publishing does not supply

Recorded because these are the publisher's real services, and they are
now unstaffed rather than solved:

- **An editor.** The valuable thing a publisher gives a solo author is
  not distribution — it is someone who says the book is too long, the
  ordering is wrong, chapter 14 does not work. Author and publisher
  being the same person leaves that role vacant. `reviewers.html` is
  beta-tester orientation: it tests the *language*, not the *book*.
  **Recruit one critical reader who is not the author.**
- **Scope discipline.** A publisher pushes back on thirty chapters plus
  eleven appendices. Nothing does now, which makes a per-chapter status
  and a word budget more necessary rather than less.
- **External legitimacy.** The print edition's main return is making
  the language look permanent, and a book published by the journal its
  author edits carries less third-party signal than one somebody else
  accepted. Not a reason against it — a reason the legitimacy has to
  come from the content and from named reviewers rather than from the
  imprint.

## 5. Remaining open questions

Two of the three questions this section used to hold are now answered,
and are recorded as closed rather than deleted so the reasoning
survives:

- ~~**Chain scope**: is the chain part in the 1.0 book?~~
  **CLOSED 2026-10-10 — in, as Part V.** The question was deferred
  while the chain branch was in flight; it landed, and six examples
  ship and run in CI. The part grew from two chapters to three, the
  new one being packages and their trust model.
- ~~**Epilogue**: include the "how it was built" essay?~~
  **CLOSED 2026-10-10 — yes, and it is not an epilogue.** It is
  chapter 30, "Why you can trust it", which the re-ordering put at the
  end of the book. An epilogue would have been the same content with
  less standing.
- **Title and URL** for the *web* edition. The publisher half of this
  question closed with §4; what remains is hosting. `jock.is` already
  serves the landing page, so the practical choice is whether the book
  lives at `jock.is/book`, at its own host, or replaces the landing
  page as the site's front door. Related: whether it sits beside
  nock.is as a sibling, with shared cross-linking.
- **The extraction mechanism does not exist yet**, and the listings
  rule in §3 is unconditional, so this is the one open item that
  blocks chapter 1 rather than merely preceding it — and, per §4, the
  one that gates printing. `tools/hilite.py`
  is the seed: with `JOCK_SITE=` it already reads the pages, tokenizes
  every listing, requires an exact round-trip, and asserts that
  refusal vectors produce an error token. What it does **not** do is
  check a listing's `// expect:` value, or source a listing from
  `examples/` in the first place. Decide what it becomes — a listing
  include directive resolved at build time, or a checked-in extract
  with a CI diff — before the first chapter is written. Retrofitting
  extraction across thirty chapters is the expensive version.
