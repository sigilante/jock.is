# Deliberate absences

What Jock does not have, and what you get instead. 6 rules, each one something that was asked for, ruled out, and now refuses — an absence is a rule like any other, and the only kind a reader cannot guess at.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` in the compiler repo writes this page.
>
> channel `%rc` · commit `02c0e74` (master) · corpus 1189 vectors · 2026-11-20

A missing feature is the one thing documentation cannot leave implicit: a reader who does not find `&&` will try it, and a model will write it confidently. Each rule below is stated as `language.md` states it, with the vectors that pin it or an honest `⟨none — UNPINNED⟩`.

|  | count |
|---|---:|
| absences stated as rules | 6 |
| …pinned by at least one vector | 2 |
| …marked `⟨none — UNPINNED⟩` | 4 |

### [L-178](/spec/language/#l-178) · There are no glyph connectives `&&`, `||` or `!`

```jock
let a = true; let b = false; a && b
```

from `t-hint-amp` · also cites `t-hint-amp-mid`, `t-hint-bar`, `t-logic-and-tt`, `t-logic-and-tf`, `t-logic-and-ft`, `t-logic-and-ff`, `t-logic-or-tt`, `t-logic-or-tf`, `t-logic-or-ft`, `t-logic-or-ff`, `t-logic-xor-tt`, `t-logic-xor-tf`, `t-logic-xor-ft`, `t-logic-xor-ff`, `t-logic-not-t`, `t-logic-not-f`, `t-logic-short`, `t-logic-short`

### [L-180](/spec/language/#l-180) · There is no core algebra in the language.

⟨none — UNPINNED⟩ — `language.md` states this rule and no corpus vector pins it.

### [L-181](/spec/language/#l-181) · There are no trait objects or existentials.

⟨none — UNPINNED⟩ — `language.md` states this rule and no corpus vector pins it.

### [L-182](/spec/language/#l-182) · There are no exceptions, nulls, inheritance or macros.

⟨none — UNPINNED⟩ — `language.md` states this rule and no corpus vector pins it.

### [L-183](/spec/language/#l-183) · There are no self-hosting constructs.

⟨none — UNPINNED⟩ — `language.md` states this rule and no corpus vector pins it.

### [L-188](/spec/language/#l-188) · No word is reserved against a form that does not exist.

```jock
func fib(n: @) -> @ { if n == 0 { 1 } else { $(n - 1) } }; fib(3)
```

from `t-recur-edits`
