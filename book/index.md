# The back of the book

R1–R11, the book’s reference sections. The same checked facts as [the agent reference](/reference/), ordered by what motivates rather than by what is load-bearing — `GENERATOR.md`’s two renderings of one source of truth.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` in the compiler repo writes these pages.
>
> channel `%rc` · commit `080874d` (sigilante/pre-rc-sweep) · corpus 1154 vectors · 2026-10-30

The narrative chapters are hand-written and are not here. Only the back matter is generated, which is what makes it checkable: `refgen --check` regenerates these pages and fails on a diff.

## The sections

|  | section | where |
|---|---|---|
| R1 | The Nock specification | [partial](nock/) |
| R2 | Keyword reference, with lowerings | [partial](keywords/) |
| R3 | Precedence table | [reference/keywords/#precedence](/reference/keywords/#precedence) |
| R4 | The erasure table | [reference/erasure/](/reference/erasure/) |
| R5 | The guard set | [guards/](guards/) |
| R6 | The operator table | [reference/abi/](/reference/abi/) |
| R7 | Literal forms | [reference/literals/](/reference/literals/) |
| R8 | The judgment table | [reference/tags/](/reference/tags/) |
| R9 | Glossary | [glossary/](glossary/) |
| R10 | The examples as exercises | [exercises/](exercises/) |
| R11 | For Hoon programmers | [hoon/](hoon/) |

**R3, R4, R6, R7 and R8 are linked, not copied.** They are table-shaped facts projected verbatim from normative rules that say the table *is* the rule, so the agent rendering already carries them in the only form they have. Two renderings of one source of truth is the thesis; two copies of one rendering is a second place to go stale.

## Where this back matter stops

Two sections cannot be generated as the outline describes them, and say so on their own pages rather than looking finished.

- **R1** wants the Nock 4K reduction rules verbatim and this repo has no copy of them. The page links `nock.is` and carries the IR’s closed opcode set instead.
- **R2** wants railroad diagrams. A diagram is a rendering of a grammar, and there is no grammar artifact to render — the parser is recursive descent. The page carries the sugar rewrite index, which is the lowering half of what R2 asks for, and quotes the ruling that would have to be lifted first.

Two more are generated in a weaker form than the outline asks: the glossary is an **index to defining rules** rather than prose, because the specs use their terms without defining them; and the exercises carry the outline’s six named landmarks rather than a grading of all of them, because nothing grades the rest.
