# The reference generator

## N. E. Davis `~lagrev-nocfep` — drafted 2026-10-10

A design note, not an implementation. Companion to `OUTLINE.md`: the
outline plans the *narrative* layer of the book, and this plans the
**reference** layer, which should not be written by hand at all.

## Thesis

Jock's reference material has two audiences whose needs conflict in
ordering and redundancy but **not in content**. So: one checked source
of truth, two renderings.

| | human rendering | agent rendering |
|---|---|---|
| lives in | the book's R1–R11 | `llms.txt` (and a fuller sibling) |
| ordered by | what *motivates* | what is *load-bearing* |
| cross-references | a feature (margin rail, planted/cashed) | a cache miss |
| wants | continuity | redundancy |
| examples are | interesting, graded | minimal, plus the refusal that looks right |
| staleness is | an annoyance a reader notices | silent corruption a model cannot notice |

Three reasons this is worth building before chapter 1 exists.

**1. The book's back matter and the agent corpus are the same artifact.**
R2 (keyword reference), R3 (precedence), R4 (erasure table), R5 (guards),
R6 (operators), R7 (literals), R8 (judgments), R9 (glossary), R10
(examples as exercises) are *all* table-shaped facts already pinned
elsewhere in the repo. `llms.txt` is those same facts in a different
order with more redundancy. Writing both by hand means maintaining the
same truth twice, in two repositories, by hand — which is the position
we are in today.

**2. For a model, stale docs are not an inconvenience, they are wrong
output.** A human reading a stale listing hits the error and adapts;
they have a compiler and judgment. A model generates the retired syntax
confidently and has no way to notice. The precedent is local and
recent: the normative specs' own worked examples silently stopped
compiling during the syntax arc, and nothing caught it until someone
compiled them by hand. `llms.txt` is hand-maintained today and carries
exactly that exposure.

**3. It discharges `OUTLINE.md` §5's blocking item.** The listings rule
("a listing that is not extracted is a transcription, and
transcriptions drift") has no mechanism. This is the mechanism, for the
part of the book where listings are densest. The print edition is gated
on it too (`OUTLINE.md` §4 — a stale listing on the web is a fix, in
print it is a run of permanently wrong copies), which makes three
independent arguments for building this first.

## Sources — everything it reads is already CI-checked

The generator invents nothing. Each source already has a lane standing
behind it, which is the whole reason this is cheap:

| source | owns | checked by |
|---|---|---|
| the corpus `value.jam` (`[%vex report gates jets vectors]`) | 1,055 `$tvec` rows: `[id judgment mode in out]`, `mode` ∈ `%pos`/`%neg`/`%err` | `tools/vex.sh`, every push |
| `examples/*.jock` | 45 programs with pinned `// expect:` values | `tools/examples.sh`, 45/45 |
| `docs/spec/language.md` | surface syntax, precedence, keywords — NORMATIVE | the spec is the authority |
| `docs/spec/types.md` | judgment inventory, the `$typ` lattice, erasure table, ledger D-1..D-24 | ditto |
| `docs/spec/runtime.md` | the pinned ABI arm records, operator table, `Kernel` trait, Effect union | `t-fabi-frozen` mug-pins `+harms` |
| `crates/jockc/hoon/lib/lex.hoon` | keyword and punctuator molds | `tools/hilite.py` holds the web highlighter to them |
| the compiler's `~|` clue sites **and `+$ diag`** | every refusal tag that can reach a user | `tools/tags.py`, which computes the coverage gap below |

**The rule: emit only what is checked.** A fact with no vector, no
pinned example, and no normative table does not get emitted — or gets
emitted *marked unpinned*. This is the repo's own discipline ("a rule
without a vector is not a rule") applied to documentation. It is also
what makes the output trustworthy enough to meter.

## What it emits

### Rendering A — the agent corpus

Replaces hand-maintained `llms.txt`. In rough priority order, because
the first two are most of the value:

**A1. The tag index.** The highest-value artifact in this whole note,
and it does not exist in either audience's material today. For every
refusal tag: what it means, the *minimal program that triggers it*, the
exact message, and the correct spelling. A model's loop with an
unfamiliar language is write → refuse → read tag → fix, so the tag
index is the thing it actually consumes. The minimal programs are not
written: they are the `%err`/`%neg` corpus vectors, which already pin
the tag.

**A2. The negative-transfer table.** `%lex-connective` for `&&`/`||`,
`%parse-not` for `!a`, `%parse-ternary` for `?:`, `%parse-let-mut` for
Rust's `let mut`, `%mint-cast-sint` for `42 as Int`. A model's failure
mode is not ignorance — it is confident transfer from Rust, Swift and
Hoon. These refusals are the map of that, they are already *in the
compiler*, and they are worth more to a model than any worked example.
Generated by joining the did-you-mean tag family against its vectors.

**A3. Canonical spellings.** For each kernel form and each sugar form,
the smallest correct program and its value — extracted from the corpus,
never transcribed. The sugar forms additionally carry their lowering,
since the kernel/sugar split is exactly the kind of structure that lets
a model generalize instead of memorize.

**A4. The tables.** Precedence, operators, erasure, guards, literal
forms, the `$typ` lattice. Straight projections of the spec tables.

**A5. The pinned ABI.** All 57 `+harms` arms with signatures, flagged
hot. The one list a model needs to know what it can call and stay
jetted.

**A6. Deliberate absences.** What refuses and why: no `$(…)` re-entry
(`%parse-todo`), no unary minus, no `**`, no multi-bound binder
(jock#100), no runtime type information. Absence is unguessable, so a
model will invent whatever its priors suggest unless told. This section
is load-bearing and has no human-book equivalent.

**A7. Machine interface.** The `--diag` JSON schema and exit codes,
already pinned by `t-chkj-*`, plus the warm-kernel path.

**A8. Provenance header.** Commit, corpus size, build date, and the
language's build channel (`+root`). A model should be able to tell
whether what it is reading is current — which is the only defence
against the staleness failure mode that does not require the reader to
be a person.

### Rendering B — the book's R-sections

The same facts, human ordering, with railroad diagrams for the grammar
and prose for the glossary. R10 (examples as graded exercises) comes
from the same example set, with difficulty taken from the gradient
`OUTLINE.md` §1 already describes. The narrative chapters stay
hand-written; only the back matter is generated.

## The coverage gap, measured (2026-10-27)

`tools/tags.py` now computes this exactly, joining a scan of the
compiler against the **built** corpus:

- **206** refusal tags exist — 200 distinct `~|` heads plus the six
  members of `+$ diag`
- **183** (89%) are pinned by an `%err` vector, which checks the tag
- **23** (11%) are pinned by nothing

The 23 are simultaneously a documentation gap (no verified explanation
to emit) and a test gap (no vector). The whole list, which is short
enough to print and therefore short enough to close:

`%mint-case` `%mint-field` `%mint-join` `%mint-list-join`
`%mint-meth-fore` `%mint-method` `%match-duplicate-default`
`%match-needs-default` `%pfix-plug` `%pfix-snap` `%desugar-snap`
`%duplicate-schema-name` `%habi-empty` `%impl-conflict` `%in-module`
`%kernel-trait` `%modl-synims-count` `%module-type`
`%nock-payload-needs-two-elements` `%op-conflict` `%opcode`
`%parse-eof` `%raw-cell-needs-two-elements`

Four of them (`%mint-case`, `%field`, `%method`, and `%mint-join`'s
neighbours) are `+$ diag` members, which is the natural first vector
sitting: one union, one `%err` row each.

### Why the earlier figures were wrong

This section previously read **~170 / ~109 / ~62**, and all three
numbers came from **one grep of the test corpus**. 170 is the count of
`[~ %tag]` *occurrences* in `tests/hoon/lib/vex-*.hoon`; 109 is the
distinct count of the same thing; 62 is their difference. So
"tags that exist in the compiler" was measured on the test side of a
join whose entire purpose is to cross the two sides, and the compiler
was never read at all.

Both halves were wrong, in opposite directions:

- the inventory was **under**-counted (170 for 206), because the
  compiler was not consulted;
- the pinned set was **under**-counted too (109 for 183), because the
  test sources spell a row three ways — a literal `[~ %tag]`, and
  helper gates like `+er` and `+be` that take the tag as a plain
  argument and build the unit themselves. A regex sees the first and
  misses the rest.

Reading the **built** corpus rather than its sources removes the
second error entirely, which is why `tools/tags.py` takes a
`value.jam` and not a glob. A `%neg` row is also not counted as
pinning: it refuses without naming a tag, so it pins *that* the
program is rejected and never *in what words*. 36 rows are `%neg`.

The one carried-over claim that survives revision only in part:
`%parse-dot-expr` was described here as a tag appearing in vectors but
not in the compiler. It is neither. `t-parse-dot-expr` is a vector
**id**, and `%parse-dot-expr` appears once in `vex-parse.hoon` in a
**comment**. Nothing asserts it.

## The argument that replaced the coverage gap

An 11% gap is a weaker case for building this than a 36% one, so the
honest thing is to say what turned out to be the stronger argument.
Running the join for the first time found **seven wrong refusal-tag
names in the normative specs** — not missing documentation, but
documentation that names tags the compiler cannot emit:

| the spec said | the compiler emits |
|---|---|
| `language.md` L-137 `%mint-grp-dup` | `%mint-func-dup` |
| L-157 `%mint-decl-dup` | `%decl-dup` |
| L-157 `%mint-decl-redecl` | `%decl-dup` — *the same tag* |
| L-171 `%mint-import-unknown` | `%mint-import` |
| L-171 `%mint-import-arity` | `%mint-call-arity` |
| L-171 `%mint-import-gen` | `%mint-inst` |
| `imports.md` §3 `%module-import-todo` | `%import-unknown` |

Every one of those rules **cites a vector, and the citation resolves**
— `tools/citecheck.py` is green at 913 citations and always was. The
tag names were derived from the vector *ids* (`t-mint-grp-dup` →
`%mint-grp-dup`), which is the join run backwards, and nothing could
see it: citecheck checks that a cited vector exists, never that the
prose agrees with what that vector pins.

L-157 is the one that is more than a spelling: the spec distinguished
two refusals by tag and the compiler does not distinguish them at all.

All seven are corrected. That is the generator's real argument — not
that the docs might be incomplete, but that they were **confidently
wrong in a way no existing lane could catch**, in the document that
had just been recomposed rule-by-rule.

## The chunking contract (Rendering A only)

Because retrieval returns one chunk, not a book:

1. **No narrative dependencies.** No "as we saw above", no "hold that
   thought". Every section stands alone.
2. **Each rule restates the one adjacent fact it needs.** Redundancy is
   a feature here; it is the opposite of the margin-rail device.
3. **Every listing carries its imports and its expected value.** A
   fragment a model cannot run is a fragment it will complete wrongly.
4. **Stable anchors**, so a retrieval layer can cite a rule rather than
   a file.
5. **Rationale survives compression.** Cut voice, keep *why*: "glued
   means one token, spaced means two" is derivable, while a list of
   glued forms is only memorizable. This is where the naive "strip the
   prose for machines" instinct goes wrong.

## Mechanism

Follow the convention the check JSON already set: **one writer, in the
compiler** — with one exception, now known, stated below.

1. A façade arm in `lib/jock.hoon` — the sibling of `+chkj` — emits the
   language surface as one JSON object: keywords, punctuators,
   precedence, operator table, erasure table, the `+harms` signatures,
   the tag list. These are things the compiler *knows*; anything derived
   by re-reading the spec by hand is a second writer.
2. A python tool joins that with (a) the corpus vectors, cued from the
   same `value.jam` the CI lane reads, and (b) the examples with their
   `// expect:` values.
3. It writes both renderings. Output is committed; CI regenerates and
   **fails on a diff** — the same shape as `VENDOR.txt` pinning and the
   jet hash-diff protocol. That is what makes `llms.txt` stop being
   able to go stale: it stops being a document and becomes a build
   target.

### The one place "one writer" cannot hold

**The tag inventory must be a source scan.** A `~|` clue site is a
static source construct: no arm can enumerate its own hint sites at
runtime, so the façade arm of step 1 cannot emit the tag list, and
`tools/tags.py` reads `crates/jockc/hoon/lib/*.hoon` instead. The rule
is honoured as closely as it can be — the scan reads *the compiler*,
never the spec, so a renamed tag moves the inventory on the next run
rather than going stale in a document.

Two shapes it has to know about, both found by running it:

- **`+$ diag`** (`mint.hoon`) is a second refusal mechanism: a typed
  six-member union behind a single untagged `~|(dg !!)`. None of its
  members appears as a literal tag anywhere, so a `~|`-only scan
  misses all six. The union exists because a hint typed `*` renders as
  a `%noun` vase that `+mook` drops, so an untyped clue arrives
  carrying nothing — the mold is what makes the refusal printable.
- **Five families discriminate on their second element**, and the
  index key for those is the pair, not the head: `%mint-todo` (8
  literal leaves), `%mint-mold` (4), `%module-form` (2),
  `%parse-todo` (2), `%sugar-todo` (2) — 18 leaves in all. Every one
  is an "unsupported thing" family, which is exactly where the
  compiler has to say *which* thing. The other 195 heads carry a
  position, a name or a type there, which is data. `%module-form` and
  `%mint-mold` also have leaves that are *computed*, so those are not
  enumerable from source at all and the index must say so rather than
  imply completeness.

## What it must not do

- **Invent prose.** The narrative layer is hand-written; the generator
  owns tables, spellings, tags and listings.
- **Emit an unpinned fact silently.** Mark it or drop it.
- **Become a second authority.** Where it and the spec disagree, the
  spec wins — `llms.txt` already says this, and the generator should
  make the case impossible rather than adjudicate it.

## Open questions

- ~~**Where does it live?**~~ **SETTLED 2026-10-27 — generator in
  `jock/tools/`, output committed, `JOCK_SITE=` for the site side**,
  which is what `tools/tags.py` already does. `site/LISTINGS.md` X-16
  rules the same way for listings and gives the two structural reasons:
  jock.is has no build step and is served by Pages from the repo root,
  and the sources live in a different repository from the pages.
- **Hosted docs platform — considered and declined.** GitBook (the
  `docs.urbit.org` model: one `.gitbook.yaml`, a `content/` tree, a
  `SUMMARY.md`, bidirectional Git Sync) would supply search, navigation
  and PR previews for nothing. Three reasons it does not fit *this*
  content, in increasing order of weight:
  1. **Its editing UI is a hazard rather than a feature here.** Git
     Sync is documented as bidirectional, with the direction chosen
     only at initial sync and no read-only mode; the guard against an
     in-GitBook edit landing on generated output is therefore a
     permissions setting, which is a social guard where this repo uses
     mechanical ones everywhere else.
  2. **It cannot highlight Jock.** Highlighting is Prism with a fixed
     language list and no custom grammar. Jock has a tokenizer ported
     from the compiler's own `lex.hoon`, held to the keyword and
     punctuator molds by `tools/hilite.py` on every push — an asset
     a hosted platform throws away.
  3. **A near-miss language would be actively harmful.** Rendering A2
     exists because a model's failure mode is confident transfer from
     Rust, Swift and Hoon. Colouring Jock as Rust reinforces precisely
     that prior, visually, on every page.
  So: generated into `jock.is` in the existing design system. If a
  hosted platform is revisited, the content is Markdown either way, so
  the cost of changing course stays low — that is the property worth
  protecting, and it is the reason not to decide under pressure.
- **One file or a tree?** The emerging convention is a small `llms.txt`
  index plus a large `llms-full.txt`. Purely a retrieval question now:
  metering is closed (the compiler is going open source), so both are
  free and the split is about context budget, not tiers.
- **Does the tag index ship before its 23 unpinned tags are vectored?**
  Emitting them unexplained is honest but weak; waiting means the
  generator blocks on test work. Probably: ship with them listed as
  unpinned, which makes the gap visible and creates the pressure to
  close it.
- **Railroad diagrams**: generated from the grammar, or drawn once into
  the style guide's keyword-railroad figure type? The figure grammar
  exists; the generator would need to emit something it can consume.
