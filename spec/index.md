# The specs

The six normative documents, mirrored from the compiler repo. Every rule id is an anchor, so a citation anywhere on this site is a link into the rule that states it.

> [!NOTE]
> **MIRRORED — do not edit.** `tools/refgen.py` copies these from `docs/spec/` in the compiler repo. The `.md` of each is the file byte for byte.

These are the authority. Where a generated page and a spec disagree, the spec is right and the page is a bug — the pages are projections of these rules, and `refgen --check` exists to keep them so.

| spec | rules | lines | raw |
|---|---:|---:|---|
| [`language.md`](/spec/language/) | 184 | 1770 | [`language.md`](/spec/language.md) |
| [`types.md`](/spec/types/) | 35 | 1181 | [`types.md`](/spec/types.md) |
| [`runtime.md`](/spec/runtime/) | 102 | 1121 | [`runtime.md`](/spec/runtime.md) |
| [`nockasm.md`](/spec/nockasm/) | 25 | 248 | [`nockasm.md`](/spec/nockasm.md) |
| [`nockasm-target.md`](/spec/nockasm-target/) | 22 | 512 | [`nockasm-target.md`](/spec/nockasm-target.md) |
| [`chain.md`](/spec/chain/) | 80 | 672 | [`chain.md`](/spec/chain.md) |

448 rule ids in all. A citation is linked only if its id is in that set, so a rule that is renumbered away stops being a link rather than becoming one that resolves to the right document and the wrong place.
