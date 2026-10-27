# Jock reference

Generated from the compiler and its corpus. Every table is projected from a normative spec, every program is extracted from a vector that runs on each push, and every page says what it cannot pin.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` in the compiler repo writes these pages.
>
> channel `%rc` · commit `273416c` (sigilante/review-fixes) · corpus 1136 vectors · 2026-10-28

## Writing Jock

What the language offers and how it is spelled.

### [Keywords](keywords/)

All 31 keywords, each with its syntactic slot, its precedence where it has one, a working program that uses it, and the `language.md` rules that define it.

[`keywords/`](keywords/) — the page · [`keywords.md`](keywords.md) — the same content as raw Markdown

### [Literals and names](literals/)

15 literal forms, the utterable aura set, the 41 reserved type names and the 2 builtin functions — which is worth stating plainly, because everything else arrives through `import`.

[`literals/`](literals/) — the page · [`literals.md`](literals.md) — the same content as raw Markdown

### [Worked examples](examples/)

45 complete programs with the values `tools/examples.sh` pins on every push. The 15 shortest are shown in full.

[`examples/`](examples/) — the page · [`examples.md`](examples.md) — the same content as raw Markdown

### [Deliberate absences](absences/)

10 things Jock does not have, each stated as a rule that refuses. The only part of a language a reader cannot guess at, so it is written down.

[`absences/`](absences/) — the page · [`absences.md`](absences.md) — the same content as raw Markdown

## When it refuses

The compiler talking back, and what it means.

### [Negative transfer](transfer/)

25 refusals that exist to catch a habit from another language, each quoting the compiler’s own correction. Start here if Jock rejected something that would be correct Rust, Swift or Hoon.

[`transfer/`](transfer/) — the page · [`transfer.md`](transfer.md) — the same content as raw Markdown

### [Refusal tags](tags/)

All 204 refusals the compiler can raise: 164 with the minimal program that triggers one, 30 pinned only by an AST-level vector, 10 pinned by nothing at all.

[`tags/`](tags/) — the page · [`tags.md`](tags.md) — the same content as raw Markdown

## Driving the compiler

Reading its output from a program.

### [Machine interface](machine/)

`jockc.sh --diag` emits one JSON object per run, with a schema corpus vectors pin by asserting the whole string. Parse this rather than the human output.

[`machine/`](machine/) — the page · [`machine.md`](machine.md) — the same content as raw Markdown

## What it becomes

The noun on the other side of the compiler.

### [Erasure and lowering](erasure/)

How each type erases to a noun, and what each sugar form rewrites to. Types erase totally — a running Jock program knows nothing about its own types.

[`erasure/`](erasure/) — the page · [`erasure.md`](erasure.md) — the same content as raw Markdown

### [The pinned ABI](abi/)

37 pinned arms with signatures and vectors, the 22 prelude traits with their methods and existing impls, and how an operator resolves.

[`abi/`](abi/) — the page · [`abi.md`](abi.md) — the same content as raw Markdown

## For an agent

Every page has a `.md` sibling that serves as raw text: `/reference/keywords.md`, `/reference/tags.md`, and so on. Those are the same content, generated from the same block list, and are what a retrieval layer should fetch.

Each section is written to stand alone — no "see above", no narrative dependency on a section a chunker might not return — and each repeats the one adjacent fact it needs.

## What generates this

`tools/refgen.py` in the compiler repo. It reads the `$keyword` and `$jpunc` molds, the `~|` refusal sites and `+$ diag`, the prelude source, the built corpus (`value.jam`), the `examples/` directory, and the normative tables in `docs/spec/`. `--check` regenerates and fails on a diff, so these pages cannot drift from the compiler without a lane going red.

It invents nothing. Where a fact has no vector behind it, the page marks it unpinned rather than stating it quietly.
