# Listings

**Status: NORMATIVE for the book.** This document owns one question:
what may be set as a code listing, and what pins it. It is the rule
half of `OUTLINE.md` §5's blocking item — the half that can be written
before any chapter exists, and must be, because retrofitting it across
thirty chapters is the expensive version. The mechanism half is
implementation and is specified here only to the extent the rules
constrain it.

Companions: [`OUTLINE.md`](OUTLINE.md) plans the narrative layer and
states the listings rule in §3; [`GENERATOR.md`](GENERATOR.md) plans
the reference layer, whose listings are the densest in the book. The
normative language itself is `docs/spec/language.md` in the compiler
repo; nothing here rules on syntax.

Rules carry flat append-only `X-n` ids. `L-` belongs to
`docs/spec/language.md`, so listings take `X-` for *extract*, which is
what a listing is. Each rule ends with what pins it: a corpus vector
id, a `⟨lane …⟩` for a rule about an interface rather than about
program behaviour, or `⟨none — UNPINNED⟩` where nothing does yet. The
unpinned ones are collected again in §7 so they can be worked rather
than admired. A few rules are purely editorial — how a fragment is
captioned, where an ellipsis may sit — and carry no citation at all,
because no lane can hold a typographic convention and pretending
otherwise would put a mark on the page that nothing stands behind.

## 1. Why the rule is unconditional

`OUTLINE.md` §3 does not say "extracted where feasible". The evidence
for the stronger rule is local and twice-observed:

- the normative specs' own worked examples silently stopped compiling
  during the syntax arc, and nothing caught it until someone compiled
  them by hand;
- `llms.txt` is hand-maintained today and carries the same exposure,
  which is `GENERATOR.md`'s second argument for existing.

A book has the same exposure and a worse blast radius, because its
readers are by definition the people who cannot tell. And per
`OUTLINE.md` §4 the exposure is asymmetric in the medium: a stale
listing on the web is a fix, in print it is a run of permanently wrong
copies.

So the rule is not a quality aspiration. It is the precondition the
print edition is gated on.

## 2. What a listing is

**X-1 · A listing is an extract.** Every Jock listing in the book is
produced mechanically from a file that a lane compiles and runs. Prose
may describe a program in any words it likes; only an extract may be
*set as a listing*. A listing that is not extracted is a
transcription, and transcriptions drift. ⟨lane `tools/examples.sh`⟩

**X-2 · A listing carries a pinned value.** A listing without a pinned
value is not a listing. For a whole program the pin is its own
`// expect:` directive; for anything smaller the pin is inherited, per
X-9. ⟨lane `tools/examples.sh`⟩

**X-3 · The pinned value is the lane's, not the author's.** The
`// expect:` line is checked against the real run under NockVM, and a
mismatch reports the product it actually got. An author who writes the
value by hand is writing a claim the lane will adjudicate, not
documentation the lane will believe. ⟨lane `tools/examples.sh`⟩

**X-4 · There is no chapter-local program.** A program the book needs
lives in `examples/` in the compiler repo first, and the chapter
extracts it. This is the rule that makes everything else cheap: the
45 programs there are already compiled, run and value-checked on every
push, so a listing drawn from them costs no new verification at all.
A chapter that wants a program not yet in `examples/` adds it there,
in a compiler-repo commit, before the chapter is written.
⟨lane `tools/examples.sh`⟩

**X-5 · One directive of each kind per source.** `tools/examples.sh`
reads the **first** `// expect:` line and the **first** `// kernel:`
line in a file and ignores any later one without comment. A second
directive is therefore not an error today but dead text, which is the
worse failure. One of each, at the top. ⟨none — UNPINNED⟩

## 3. The four kinds, and what pins each

Listings are not all the same artifact, and the common mistake would
be to pin them all the same way.

**X-6 · A *program* listing is a whole `examples/*.jock` file**, pinned
by its `// expect:` value. All 45 carry one; 10 also carry
`// kernel:`, and those are run as kernels — built, poked through arm
23, peeked through arm 22 — so a kernel listing's pin is a
round trip, not a return value. ⟨lane `tools/examples.sh`⟩

**X-7 · A *fragment* listing is a named region of a program listing**,
pinned by its parent's value and never by one of its own. A fragment
is the common case in a tutorial chapter: the reader sees twelve lines,
not the whole file. ⟨lane `tools/examples.sh`⟩

**X-8 · A *refusal* listing is a corpus vector**, pinned by its **tag**.
The book's refusal examples — the error that looks right, which
`GENERATOR.md` names as something the agent rendering specifically
wants — must each be a `%err` or `%neg` row in the corpus, cited by
vector id, so that the tag the book prints is the tag the compiler
emits. `tools/hilite.py`'s own `REFUSE` table is **not** this: its 13
rows are hand-written strings that exercise the *highlighter's* error
token, not the compiler's refusal. A book refusal pinned only by
`hilite.py` is unpinned. ⟨lane `tools/vex.sh`⟩

**X-9 · An *exhibit* is a compiler artifact, pinned by its command.**
A nasm dump, a Nock noun, a diagnostic transcript, a formula hash —
Part VI's material. These are not programs and have no `// expect:`
value; what pins an exhibit is the exact command that produces it,
printed with it, and a lane that re-runs that command and diffs.
⟨none — UNPINNED⟩

**X-10 · An exhibit is not highlighted as Jock.** The landing page is
the precedent and the reason highlighting is opt-in at all: its plate
holds the Nock noun a program compiles to, which must not be lexed as
Jock. ⟨lane `tools/hilite.py`⟩

## 4. Fragments, regions and elision

**X-11 · A fragment is a named region, not a line range.** Line ranges
reframe silently when anything above them is edited, and the reframing
is invisible in both repositories. A region is named in the source file
and the name is what the chapter cites.

**X-12 · A region is marked by source comments**, in the style of the
directives already there:

    // region: step-one
    ...
    // end: step-one

Comments, so the file with its markers in place is the file the lane
compiles and runs — the extracted region and the verified program are
the same text, not two texts that agree today.
⟨none — UNPINNED⟩

**X-13 · Regions may nest and may overlap.** A chapter that builds a
program in four passes wants a region per pass plus one around the
whole; forbidding that would push authors back to line ranges, which
is the failure X-11 exists to prevent.

**X-14 · No elision inside a region.** A `…` inside an extracted
region produces text that is not a program, so nothing can pin it, and
the reader cannot run what they are looking at. Where a chapter needs
to skip material, it sets two regions with a typographic separator
between them, outside both. The separator is the book's, not the
source's.

**X-15 · A fragment is captioned with its source and region**, so the
pin is visible to the reader and runnable by them. A listing whose
provenance is not printed is asking for trust it has not earned, which
is the opposite of what chapter 30 is for.

## 5. The mechanism

**X-16 · RULED — extraction is a generated, committed extract with a
lane diff, not a build-time include.** `OUTLINE.md` §5 left the choice
open; two facts settle it, and both are structural rather than matters
of taste:

1. **There is no build step.** `jock.is` is served by GitHub Pages from
   the repository root, and the README's first sentence is "a single
   `index.html`, no build step". A build-time include directive means
   introducing a build, and then the published pages are no longer the
   pages in the repository.
2. **The listings live in a different repository from the pages.** The
   extract crosses from `sigilante/jock` to `sigilante/jock.is`, and a
   page cannot reach across — the same reason `jock-highlight.js` is
   vendored rather than linked.

So the extract is generated in the compiler repo, committed into the
site repo, and held byte-identical by a lane. This is not a new
discipline; it is the one `VENDOR.txt` already applies to the
highlighter, and the one `vendor/SNAPSHOT.txt` applies to nockasm and
hoon-138.

**X-17 · The extract carries its provenance beside it**, in the shape
`VENDOR.txt` already uses: for each extract, the source path, the
region name, the sha256 of the extracted text, and the lane that
verified the program it came from. ⟨lane `ci:pins`⟩

**X-18 · A drifted extract is a red lane, not a wrong colour.** The
check runs in the compiler repo, where the sources are, and reads the
site through `JOCK_SITE=` exactly as the highlighter check does today.
⟨lane `tools/hilite.py`⟩

**X-19 · No page holds a hand-edited listing.** Today's six are
hand-written and predate this document; they are grandfathered only
until the extractor exists, and then they convert or go. A hand-edited
listing beside extracted ones is worse than one in a book of them,
because the reader cannot tell which they are reading.
⟨none — UNPINNED⟩

## 6. The page contract

**X-20 · One opt-in spelling: `<pre class="code jock">`.** Highlighting
is opt-in by design (X-10), and the set of listings that is *coloured*
must equal the set that is *checked*.

**X-21 · Today those two sets are equal only by luck, and the lane says
otherwise.** The highlighter colours four selector forms —

    pre.jock, code.jock, pre[data-lang="jock"], code[data-lang="jock"]

— while `tools/hilite.py` finds listings with a regex for the literal
string `<pre class="code jock"`, which is sensitive to both the element
and the class order. So `<pre class="jock">`, `<code class="jock">`,
`<pre data-lang="jock">` and even `<pre class="jock code">` are all
coloured and **none of them is checked**. The lane's own docstring
asserts the opposite — "which is also what the highlighter keys on, so
the set checked here is exactly the set that gets coloured" — and that
holds today only because `index.html` happens to use one spelling in
all six of its listings. The fix is for the lane to derive its set
from the highlighter's selector rather than restate it.
⟨none — UNPINNED⟩

**X-22 · The lane does not read `// expect:` out of a page**, so X-2 and
X-3 are enforced on `examples/` and not on the book. The extractor is
what closes this: a value that travels with its listing is a value the
diff covers. ⟨none — UNPINNED⟩

**X-23 · A listing's pinned value is set as part of the listing**, in
its `// expect:` comment, not as prose beneath it. It is a line of the
program, it survives copy-and-paste into a file, and the reader can
re-check it with `jockc.sh run`.

## 7. The honest gaps

Six rules above are unpinned. They are the extractor's specification,
in the order the dependencies run:

| rule | gap | closed by |
|---|---|---|
| X-21 | coloured ≠ checked; lane restates the selector | lane reads `SELECTOR` from `editors/web/jock-highlight.js` |
| X-12 | region markers have no reader | the extractor |
| X-22 | page `// expect:` values unchecked | the extractor |
| X-19 | six grandfathered hand-written listings | the extractor, then conversion |
| X-5 | a second directive is silently ignored | three lines in `tools/examples.sh` |
| X-9 | exhibits have no pinning mechanism | a Part VI lane, last |

X-21 and X-5 are both small and both independent of everything else,
which makes them the right first commits: they tighten lanes that
already run, and they do not wait on a decision.

## 8. What this document does not decide

- **Where the book lives.** `OUTLINE.md` §5's remaining open question
  —`jock.is/book`, its own host, or replacing the landing page — is a
  positioning call. It changes the extract's output paths and nothing
  above it.
- **Any syntax.** `docs/spec/language.md` is normative for the
  language; a listing that disagrees with it is a wrong listing, never
  a second opinion.
- **The reference layer's content.** `GENERATOR.md` owns R1–R11 and the
  agent corpus. This document only requires that whatever it emits
  obeys X-1 through X-23, which it already intends to: "emit only what
  is checked" is the same rule read from the other end.
