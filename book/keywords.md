# R2 · Keywords and their lowerings

Every keyword by the slot it occupies, and for the sugar forms, what each one rewrites to. The kernel-and-sugar split is one of Jock’s four design principles, so the lowering is the part of a keyword worth knowing second.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` writes this page.
>
> 30 keywords · channel `%rc` · commit `dd95321`

## No railroad diagrams, and that is a ruling

`OUTLINE.md` R2 asks for railroad diagrams. A railroad diagram is a rendering of a grammar, and [the agent reference](/reference/keywords/) already rules on writing one:

> Jock’s parser is recursive descent (`parse.hoon`); no grammar artifact exists to project from, so a written-out grammar would be a second author of the syntax rather than a rendering of it.

That ruling binds this page. It also says what would lift it — a formal grammar is expressible, and should arrive with the corpus as its acceptance suite, every source-bearing `%pos` vector parsing and every `%parse` and `%lex` refusal failing to, so that it is a lane and not a claim. Until then: the slots below, and the lowerings, which are normatively stated.

## The keywords, by slot

### Declaration (14)

| keyword | stated at |
|---|---|
| `alias` | `L-61`, `L-66`, `L-22`, `L-81`, `L-45` |
| `class` | `L-61`, `L-22`, `L-146`, `L-45` |
| `enum` | `L-61`, `L-69`, `L-22`, `L-149`, `L-170`, `L-45` |
| `for` | `L-61` |
| `func` | `L-185`, `L-61`, `L-17`, `L-20`, `L-87`, `L-135`, `L-136`, `L-137`, `L-139`, `L-140`, `L-143` |
| `impl` | `L-61`, `L-20`, `L-45` |
| `import` | `L-185`, `L-61` |
| `is` | `L-61`, `L-69` |
| `lambda` | `L-61` |
| `let` | `L-185`, `L-61`, `L-20`, `L-129`, `L-130`, `L-131`, `L-134`, `L-171` |
| `private` | `L-61`, `L-37`, `L-17`, `L-25` |
| `struct` | `L-61`, `L-45` |
| `trait` | `L-61`, `L-22`, `L-45` |
| `var` | `L-61`, `L-129`, `L-130`, `L-131`, `L-132`, `L-134` |

### Control (10)

| keyword | stated at |
|---|---|
| `assert` | `L-185`, `L-61` |
| `crash` | `L-61`, `L-178`, `L-182` |
| `defer` | `L-61` |
| `else` | `L-61` |
| `eval` | `L-61`, `L-13`, `L-129`, `L-183` |
| `if` | `L-185`, `L-61` |
| `loop` | `L-185`, `L-61`, `L-87`, `L-140` |
| `match` | `L-185`, `L-61`, `L-84`, `L-101`, `L-126`, `L-148`, `L-150`, `L-151`, `L-173` |
| `print` | `L-61`, `L-76`, `L-35` |
| `recur` | `L-61`, `L-140`, `L-152` |

### Operator (6)

| keyword | stated at |
|---|---|
| `and` | `L-61`, `L-107`, `L-173`, `L-178` |
| `as` | `L-61`, `L-24`, `L-12`, `L-107`, `L-120` |
| `in` | `L-61`, `L-73`, `L-107`, `L-108`, `L-115`, `L-173`, `L-183` |
| `not` | `L-61`, `L-107`, `L-173`, `L-178` |
| `or` | `L-61`, `L-107`, `L-173`, `L-178` |
| `xor` | `L-61`, `L-107`, `L-173`, `L-178` |

## The sugar rewrite index

`language.md` §8, projected. Each sugar form is normatively stated once, at the id named in the third column, and `lib/sugar.hoon` must match it. A form not in this table is kernel: it has no rewrite because it is what the rewrites land on.

| Sugar | Rewrite | Stated at |
|---|---|---|
| `assert c; e` | `if c { e } else { crash }` | L-61 (the inventory) |
| `a ?? b` | `match` on unit | L-126 |
| binary operators | stdlib calls | L-38 to L-45 |
| `===` / `!==` | kernel `%same` | L-106 |
| `and` / `or` | nested `%if` (short-circuit) | L-61 |
| `xor` / `not` | `%if` and stdlib rewrites | L-61 |
| `%dot` (postfix `.`, non-limb receiver) | irrefutable match binding the receiver once | L-113 |
| index family | `.at(i)` / `.slice(a, b)` / `.put(i, v)` | L-46 to L-51 |
| lark | head/tail by axis | L-100 to L-105 |
| Unicode glyph aliases | `∈`→`in`, `×`→`*`, `÷`→`/` | L-115 |
| `print e; k` | `%slog` dynamic hint | L-33 to L-37 |
| string interpolation | `.show()` per head | L-26 to L-32 |
| collection literals | constructor calls / raw nouns | L-79 |
