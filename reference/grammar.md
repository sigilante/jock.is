# The surface grammar

14 productions of Jock's surface syntax, drawn as railroad diagrams. They are projected from the parser, which is the only place the grammar has ever been written down — and each one is checked against its arm on every run.

> [!NOTE]
> **GENERATED — do not edit.** `tools/grammar.py` writes the productions and checks them against `crates/jockc/hoon/lib/parse.hoon`; `tools/refgen.py` lays out this page.
>
> channel `%rc` · commit `f1c3be4` (sigilante/pre-rc-sweep) · 2026-10-30

## Where these come from

Not from the specifications. Six normative documents carry exactly one grammar fence between them — `language.md` [L-92](/spec/language/#l-92)’s ten `tex` forms — and state everything else as prose constraints; `types.md` [S12.1](/spec/types/#s12.1) is titled *the pattern grammar* and is a typing table. A diagram set drawn from the specs would have been one drawing and a great many inventions.

The parser is the grammar. `parse.hoon` is hand-rolled recursive descent — there are no parser combinators to walk — but 63 of its arms are productions, one per form, and each reaches its terminals through six stream helpers that take **literal** arguments. Outside those helpers there are six inline token literals in the whole file, each declared with its reason, and a seventh fails the lane.

## How to read one

Follow the track from the left bar to the right. A **stadium** is a terminal — something you type; a **rectangle** is another production. A branch that leaves the main line and does not come back is a spelling the parser **refuses**, labelled with the tag it raises: Jock arranges its grammar so that a plausible mis-spelling fails to parse rather than quietly meaning something else (`language.md` [L-3](/spec/language/#l-3)), so the dead ends are part of the grammar and belong on the diagram.

| drawn | in EBNF | means |
|---|---|---|
| stadium, solid | `'x'` | a terminal |
| stadium, heavy edge, tied label | `⁀'x'` | a terminal that must be **glued** to the token before it — no whitespace. The adjacency law: `f(x)` calls, `f (x)` does not |
| stadium, dashed | `&'x'` | looked at and not consumed (PEG’s and-predicate) |
| stadium, dotted | `<Type>` | a token class |
| rectangle | `name` | another production |
| rectangle, dashed grey | `⟨name⟩` | a named guard in the parser that decides the branch |
| stadium, dashed red | `✗ %tag` | a dead end: this spelling refuses, with that tag |
| a loop back under the track | `{ e }` | zero or more |
| a bypass over the track | `[ e ]` | optional |

## The precedence chain

Thirteen frozen levels, loosest first — each arm takes the next tighter one and then looks for its own operator, which is what makes the table in [the keyword reference](/reference/keywords/#precedence) true. `p-expr` is the entry point; `p-prim` is the floor, and has no production here yet.

### p-expr

The entry point.  An expression is the loosest level, and every tighter level is reachable only through it.

```ebnf
p-expr := p-or
```

### p-or — level 13, left

```ebnf
p-or := p-xor { 'or' p-xor }
```

### p-xor — level 12, left

`xor` took its own station between `and` and `or` on 2026-10-27 --- the order C gives `&` `^` `|`, and so the order a reader arrives with.  `t-logic-prec-and-xor` pinned the old grouping so the change had to flip a row rather than pass unnoticed.

```ebnf
p-xor := p-and { 'xor' p-and }
```

### p-and — level 11, left

```ebnf
p-and := p-not { 'and' p-not }
```

### p-not — level 10, prefix

```ebnf
p-not := 'not' p-not | p-eq
```

### p-eq — level 9, none

Maximal munch:  `===` is tried before `==`, `!==` before `!=`.  The level is NON-ASSOCIATIVE, which is the dead end on the right --- `a == b == c` is a parse error rather than a reading anyone has to guess.

```ebnf
p-eq := p-ord [ ( '===' | '!==' | '==' | '!=' ) p-ord [ ✗ %parse-nonassoc ] ]
```

### p-ord — level 8, none

Membership (`in`, `∈`) and the subset glyphs sit with the ordered comparisons and are non-associative like them.

```ebnf
p-ord := p-qq [ ( 'in' | '∈' | '<=' | '>=' | '<' | '>' | '⊂' | '⊃' ) p-qq [ ✗ %parse-nonassoc ] ]
```

### p-qq — level 7, right

Coalesce binds tighter than the comparisons (Swift's placement) and looser than `+` `-`, so the fallback may be an arithmetic expression without parentheses.  A SINGLE `?` here is the ternary habit, and refuses --- except before a `]`, where it belongs to an enclosing form.

```ebnf
p-qq := p-add [ ( '??' p-qq | &'?' ( &']' | ✗ %parse-ternary ) ) ]
```

### p-add — level 6, left

Binary `-` is spaced on BOTH sides.  A hyphenated name is one token, so a glued `a-b` never reaches here;  the dead end catches the residual `7-3` and `a -1` shapes, whose spelling is reserved for the operand-position Int literal.

```ebnf
p-add := p-mul { ( '+' | '-' | '∪' | '⊕' | '⊖' | '±' | ✗ %parse-minus-glue ) p-mul }
```

### p-mul — level 5, left

```ebnf
p-mul := p-un { ( '*' | '/' | '%' | '×' | '÷' | '⊛' | '∩' | '⊗' | '∘' | '·' ) p-un }
```

### p-un

Unary minus sits between levels 5 and 4.  A `-` GLUED to a decimal is an Int literal and therefore a PRIMARY, so it passes straight through to the tighter levels:  `-42 as @` is `(-42) as @`.

```ebnf
p-un := '-' ⟨sintq⟩ p-un | p-pow
```

### p-pow — level 4, right

```ebnf
p-pow := p-as [ '**' p-pow ]
```

### p-as — level 3, left

The `as?` and `as!` particles are the keyword with a GLUED `?` or `!`.  Spaced, they are not the particle.

```ebnf
p-as := p-post { 'as' [ ( ⁀'?' | ⁀'!' ) ] p-tex }
```

### p-post — level 2, left

THE ADJACENCY LAW.  Call, index and the struct literal bind only when the opening token is glued;  an unglued one after a complete expression is a loud error with the did-you-mean-glued hint, rather than a guess.  The two spellings differ on these diagrams by the glue tie alone, which is exactly how they differ in a program.

```ebnf
p-post := p-prim { ( ⁀'(' p-args | ⁀'[' p-index | '.' ( <Type> [ ⁀'(' p-slit ] | p-naxis | p-lark | p-name ) | '(' ✗ %parse-unglued | '[' ✗ %parse-unglued ) }
```

## What the check verifies

For every production above, four reference sets are extracted from the parse arm by syntax alone and compared with the production: every **terminal** it tests with its gluedness, every **production** it calls, every named **guard** it consults, and every `%parse-*` tag it **refuses**. A member on one side and not the other fails the lane, in both directions. That is what catches the drift that actually happens — a glyph added to a level, and a diagram that keeps showing the old set.

**The check is blind to structure.** Order, nesting, repetition and associativity are not verified by it: two productions with the same reference sets pass equally. Those are pinned the other way round, by the corpus — every operator here appears in a vector that fixes its grouping, and `t-logic-prec-and-xor` is the one that caught a real re-levelling. A parser generated from this grammar and made to reproduce the recorded parse trees would close the gap properly. That is not built, and this page does not pretend it is.

## The rest of the surface

14 of `parse.hoon`’s 63 form arms have a production here. The declarations, the statement forms, the patterns and the type grammar do not yet, and are named in `ROADMAP.md` rather than sketched here — a diagram no lane checks is the thing this page exists to avoid.
