# Deliberate absences

What Jock does not have, and what you get instead. 10 rules, each one something that was asked for, ruled out, and now refuses — an absence is a rule like any other, and the only kind a reader cannot guess at.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` in the compiler repo writes this page.
>
> channel `%rc` · commit `c3b03d9` (sigilante/review-fixes) · corpus 1143 vectors · 2026-10-28

A missing feature is the one thing documentation cannot leave implicit: a reader who does not find `&&` will try it, and a model will write it confidently. Each rule below is stated as `language.md` states it, with the vectors that pin it or an honest `⟨none — UNPINNED⟩`.

|  | count |
|---|---:|
| absences stated as rules | 10 |
| …pinned by at least one vector | 6 |
| …marked `⟨none — UNPINNED⟩` | 4 |

### L-174 · Implicit composition of adjacent expressions is removed.

```jock
union C { red, green } C.red
```

from `t-arc-union-gone` · also cites `t-parse-unglued`

### L-175 · Juxtaposition collections are removed.

```jock
struct P { x: @, y: @ } let p = P(x: 1, y: 2); p.x
```

from `t-arc-ctor` · also cites `t-arc-map-bracket`, `t-arc-set-ctor`

### L-176 · The `((` pseudo-token is gone

```jock
fib(n)
```

from `t-lex-glue-p` · also cites `t-lex-unglue-p`

### L-177 · Whitespace-blind postfix binding is rejected.

```jock
f (3)
```

from `t-parse-unglued`

### L-178 · The glyph connectives `&&`, `||` and `!` are absent

```jock
let a = true; let b = false; a && b
```

from `t-hint-amp` · also cites `t-hint-amp-mid`, `t-hint-bar`, `t-logic-and-tt`, `t-logic-and-tf`, `t-logic-and-ft`, `t-logic-and-ff`, `t-logic-or-tt`, `t-logic-or-tf`, `t-logic-or-ft`, `t-logic-or-ff`, `t-logic-xor-tt`, `t-logic-xor-tf`, `t-logic-xor-ft`, `t-logic-xor-ff`, `t-logic-not-t`, `t-logic-not-f`, `t-logic-short`, `t-logic-short`

### L-179 · The opcode surface forms `+()` and `?()` are cut

```jock
if hoon.iscell([1, 2]) { 11 } else { 22 }
```

from `t-abi-iscell-cell` · also cites `t-nx-inc-p`

### L-180 · The core algebra is not in the language.

⟨none — UNPINNED⟩ — `language.md` states this rule and no corpus vector pins it.

### L-181 · There are no TRAIT OBJECTS or existentials.

⟨none — UNPINNED⟩ — `language.md` states this rule and no corpus vector pins it.

### L-182 · There are no exceptions, nulls, inheritance or macros.

⟨none — UNPINNED⟩ — `language.md` states this rule and no corpus vector pins it.

### L-183 · Self-hosting constructs are post-1.0.

⟨none — UNPINNED⟩ — `language.md` states this rule and no corpus vector pins it.
