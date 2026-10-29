# lib/parser

parser combinators.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` writes this from `crates/jockc/hoon/lib/parser.jock` and the examples that import it.
>
> 38 public declarations — 7 types, 31 arms. 33 pinned by a lane, 5 not. channel `%rc` · commit `080874d`

## Import

A module arrives by name and nothing in it is ambient. Every arm below is reached as `parser.<name>`.

```jock
import parser;
```

The name is the file name minus `.jock`: `parser` is `crates/jockc/hoon/lib/parser.jock`, and it is found because the directory holding it was passed as a `--data-dir`. There is no search path and no implicit import; `tools/libs.py` holds the whole discovery rule, and the compiler itself is a pure function of source and libraries.

## About

import parser; parser.scan("1234", parser.plus(parser.dit()))

The shape follows Hoon (+rule / +nail / +edge in 4f) with the names spelled for readers who have not met it:  a Rule consumes a Nail (remaining text plus a position) and answers an Edge (the matched text and what is left, or the furthest position reached).

A rule matches TEXT and answers text. Hoon's rules produce arbitrary values through `cook`; ours cannot, because operator traits imply (Self, Self) -> Self and associated types are post-1.0. Matching is still most of lexing, and a caller converts once at the end. Nail:  remaining text and position.

## Types

7 types. A type’s members ARE its interface, so each is shown whole rather than by name.

### `Nail`

```jock
struct Nail { txt: List<Byte>, pos: @ };
```

No comment in the source. The signature above is the whole of what `Nail` states about itself.

*used by examples/parser.jock*

```jock
func nestRun(n: parser.Nail) -> parser.Edge {
```

### `Edge`

```jock
enum Edge { fail(@), ok((String, Nail)) };
```

Edge:  match result, either success or failure.

*used by examples/parser-arms.jock*

```jock
func consumed(e: parser.Edge) -> @ {
```

### `Rule`

```jock
struct Rule { run: Nail -> Edge };
```

Rule:  a parser, a function from Nail to Edge.

### `Seq`

```jock
trait Seq { then(⊛); };
```

Sequencing operator

Sequence composition. An importer writes

parser.just('a') ⊛ parser.just('b')

### `Seq for Rule`

```jock
impl Seq for Rule { then(self: Rule, p: Rule) -> Rule { plug(self, p) }; };
```

No comment in the source. The signature above is the whole of what `Seq for Rule` states about itself.

### `Alt`

```jock
trait Alt { alt(⊕); };
```

Alternation operator

Ordered choice, like +pose.  An importer writes

parser.dit() ⊕ parser.alf()

### `Alt for Rule`

```jock
impl Alt for Rule { alt(self: Rule, p: Rule) -> Rule { pose(self, p) }; };
```

No comment in the source. The signature above is the whole of what `Alt for Rule` states about itself.

## Arms

31 arms, in source order. The signature is reproduced exactly; the prose is the comment above the arm in `crates/jockc/hoon/lib/parser.jock`.

| arm | signature | pinned by |
|---|---|---|
| `rule` | `func rule(f: Nail -> Edge) -> Rule` | `parser-arms` (assert) |
| `nail` | `func nail(s: String) -> Nail` | `parser-arms` (assert) |
| `fails` | `func fails() -> Rule` | `parser-arms` (assert) |
| `easy` | `func easy(v: String) -> Rule` | `parser-arms` (assert) |
| `bite` | `func bite(test: Byte -> Bool) -> Rule` | `parser-arms` (assert) |
| `next` | `func next() -> Rule` | `parser-arms` (assert) |
| `just` | `func just(c: Byte) -> Rule` | `parser-arms` (assert) |
| `shim` | `func shim(lo: Byte, hi: Byte) -> Rule` | `parser-arms` (assert) |
| `plug` | `func plug(a: Rule, b: Rule) -> Rule` | `parser-arms` (assert) |
| `pose` | `func pose(a: Rule, b: Rule) -> Rule` | `parser-arms` (assert) |
| `starRun` | `func starRun(r: Rule, n: Nail, acc: String) -> Edge` | `parser-arms` (assert) |
| `star` | `func star(r: Rule) -> Rule` | `parser-arms` (assert) |
| `plus` | `func plus(r: Rule) -> Rule` | `parser-arms` (assert) |
| `opt` | `func opt(r: Rule) -> Rule` | `parser-arms` (assert) |
| `jestRun` | `func jestRun(want: List<Byte>, n: Nail, acc: String) -> Edge` | `parser-arms` (assert) |
| `jest` | `func jest(s: String) -> Rule` | `parser-arms` (assert) |
| `ifix` | `func ifix(l: Rule, r: Rule, t: Rule) -> Rule` | `parser-arms` (assert) |
| `moreRun` | `func moreRun(sep: Rule, r: Rule, n: Nail, acc: String) -> Edge` | `parser-arms` (assert) |
| `more` | `func more(sep: Rule, r: Rule) -> Rule` | `parser-arms` (assert) |
| `dit` | `func dit() -> Rule` | `parser-arms` (assert) |
| `low` | `func low() -> Rule` | `parser-arms` (assert) |
| `hig` | `func hig() -> Rule` | `parser-arms` (assert) |
| `alf` | `func alf() -> Rule` | `parser-arms` (assert) |
| `aln` | `func aln() -> Rule` | `parser-arms` (assert) |
| `ace` | `func ace() -> Rule` | `parser-arms` (assert) |
| `gap` | `func gap() -> Rule` | `parser-arms` (assert) |
| `rush` | `func rush(s: String, r: Rule) -> String?` | `parser-arms` (assert) |
| `scan` | `func scan(s: String, r: Rule) -> String` | `parser-arms` (assert) |
| `spot` | `func spot(s: String, r: Rule) -> @` | `parser-arms` (assert) |
| `seq3` | `func seq3(a: Rule, b: Rule, c: Rule) -> Rule` | `parser-arms` (assert) |
| `altseq` | `func altseq(a: Rule, b: Rule, c: Rule) -> Rule` | `parser-arms` (assert) |

### `rule`

```jock
func rule(f: Nail -> Edge) -> Rule { ... }
```

Primitives. rule: a raw Nail -> Edge function, as a Rule.

func exprRun(n: parser.Nail) -> parser.Edge { … parser.rule(exprRun) … }; let expr = parser.rule(exprRun);

An importer can spell `parser.Rule( run: f )` directly; `rule` provides a shorter idiom and the seam where rule-level instrumentation would go.

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("a", parser.rule(parser.next().run)) ?? "x") === "a";
```

### `nail`

```jock
func nail(s: String) -> Nail { ... }
```

nail: text to parser input.

*asserted by examples/parser-arms.jock*

```jock
assert consumed(parser.starRun(parser.just('a'), parser.nail("aa"), "")) == 2;
```

### `fails`

```jock
func fails() -> Rule { ... }
```

fails: never matches.

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("a", parser.fails()) ?? "no") === "no";
```

### `easy`

```jock
func easy(v: String) -> Rule { ... }
```

easy: matches nothing, produces a fixed string.

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("", parser.easy("E")) ?? "x") === "E";
```

### `bite`

```jock
func bite(test: Byte -> Bool) -> Rule { ... }
```

bite: one character satisfying a test, as a rule. Every single-character rule below is this one with a different test.

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("a", parser.bite(isa)) ?? "x") === "a";
```

### `next`

```jock
func next() -> Rule { ... }
```

next: any one character.

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("a", parser.rule(parser.next().run)) ?? "x") === "a";
```

### `just`

```jock
func just(c: Byte) -> Rule { ... }
```

just: one specific character.

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("a", parser.just('a')) ?? "x") === "a";
```

### `shim`

```jock
func shim(lo: Byte, hi: Byte) -> Rule { ... }
```

shim: one character in an inclusive range.

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("c", parser.shim('a', 'z')) ?? "x") === "c";
```

### `plug`

```jock
func plug(a: Rule, b: Rule) -> Rule { ... }
```

Combinators. plug: a then b, matched text concatenated. `⊛` in this module.

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("ab", parser.plug(parser.just('a'), parser.just('b'))) ?? "x") === "ab";
```

### `pose`

```jock
func pose(a: Rule, b: Rule) -> Rule { ... }
```

pose: a, or b if a fails.

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("b", parser.pose(parser.just('a'), parser.just('b'))) ?? "x") === "b";
```

### `starRun`

```jock
func starRun(r: Rule, n: Nail, acc: String) -> Edge { ... }
```

starRun / star: zero or more. A rule that can match the empty string will not terminate here — the same hazard Hoon's +star carries, and for the same reason.

*asserted by examples/parser-arms.jock*

```jock
assert consumed(parser.starRun(parser.just('a'), parser.nail("aa"), "")) == 2;
```

### `star`

```jock
func star(r: Rule) -> Rule { ... }
```

No comment in the source. The signature above is the whole of what `star` states about itself.

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("aaa", parser.star(parser.just('a'))) ?? "x") === "aaa";
```

### `plus`

```jock
func plus(r: Rule) -> Rule { ... }
```

plus:  one or more.

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("aa", parser.plus(parser.just('a'))) ?? "x") === "aa";
```

### `opt`

```jock
func opt(r: Rule) -> Rule { ... }
```

opt:  zero or one.

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("a", parser.opt(parser.just('a'))) ?? "x") === "a";
```

### `jestRun`

```jock
func jestRun(want: List<Byte>, n: Nail, acc: String) -> Edge { ... }
```

jest:  a literal string.

*asserted by examples/parser-arms.jock*

```jock
assert consumed(parser.jestRun(hoon.trip("ab"), parser.nail("ab"), "")) == 2;
```

### `jest`

```jock
func jest(s: String) -> Rule { ... }
```

No comment in the source. The signature above is the whole of what `jest` states about itself.

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("hello", parser.jest("hello")) ?? "x") === "hello";
```

### `ifix`

```jock
func ifix(l: Rule, r: Rule, t: Rule) -> Rule { ... }
```

ifix:  r between two delimiters; the delimiters are dropped.

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("(a)", parser.ifix(parser.just('('), parser.just('a'), parser.just(')'))) ?? "x") === "a";
```

### `moreRun`

```jock
func moreRun(sep: Rule, r: Rule, n: Nail, acc: String) -> Edge { ... }
```

more:  r separated by sep, zero or more, separators dropped.

*asserted by examples/parser-arms.jock*

```jock
assert consumed(parser.moreRun(parser.just(','), parser.just('a'), parser.nail("a,a"), "")) == 3;
```

### `more`

```jock
func more(sep: Rule, r: Rule) -> Rule { ... }
```

No comment in the source. The signature above is the whole of what `more` states about itself.

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("a,a", parser.more(parser.just(','), parser.just('a'))) ?? "x") === "aa";
```

### `dit`

```jock
func dit() -> Rule { ... }
```

Character classes (Hoon's 4e, abbreviated).

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("7", parser.dit()) ?? "x") === "7";
```

### `low`

```jock
func low() -> Rule { ... }
```

No comment in the source. The signature above is the whole of what `low` states about itself.

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("k", parser.low()) ?? "x") === "k";
```

### `hig`

```jock
func hig() -> Rule { ... }
```

No comment in the source. The signature above is the whole of what `hig` states about itself.

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("K", parser.hig()) ?? "x") === "K";
```

### `alf`

```jock
func alf() -> Rule { ... }
```

No comment in the source. The signature above is the whole of what `alf` states about itself.

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("m", parser.alf()) ?? "x") === "m";
```

### `aln`

```jock
func aln() -> Rule { ... }
```

No comment in the source. The signature above is the whole of what `aln` states about itself.

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("4", parser.aln()) ?? "x") === "4";
```

### `ace`

```jock
func ace() -> Rule { ... }
```

No comment in the source. The signature above is the whole of what `ace` states about itself.

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush(" ", parser.ace()) ?? "x") === " ";
```

### `gap`

```jock
func gap() -> Rule { ... }
```

No comment in the source. The signature above is the whole of what `gap` states about itself.

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("  ", parser.gap()) ?? "x") === "  ";
```

### `rush`

```jock
func rush(s: String, r: Rule) -> String? { ... }
```

Drivers. rush:  run a rule, answering what it matched or nothing.

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("", parser.easy("E")) ?? "x") === "E";
```

### `scan`

```jock
func scan(s: String, r: Rule) -> String { ... }
```

scan:  run a rule, or crash. The strict reading.

*asserted by examples/parser-arms.jock*

```jock
assert parser.scan("aa", parser.star(parser.just('a'))) === "aa";
```

### `spot`

```jock
func spot(s: String, r: Rule) -> @ { ... }
```

spot:  how far a rule got (0 on success, the furthest position on failure).

*asserted by examples/parser-arms.jock*

```jock
assert parser.spot("aab", parser.star(parser.just('a'))) == 0;
```

### `seq3`

```jock
func seq3(a: Rule, b: Rule, c: Rule) -> Rule { ... }
```

seq3:  three in sequence.

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("abc", parser.seq3(parser.just('a'), parser.just('b'), parser.just('c'))) ?? "x") === "abc";
```

### `altseq`

```jock
func altseq(a: Rule, b: Rule, c: Rule) -> Rule { ... }
```

altseq:  fused compose-sequence, `(a ⊛ b) ⊕ c`, i.e. "a then b, else c".

*asserted by examples/parser-arms.jock*

```jock
assert (parser.rush("ab", parser.altseq(parser.just('a'), parser.just('b'), parser.just('c'))) ?? "x") === "ab";
```

## What no lane pins

5 of 38 public declarations are named by no example in `examples/`. They compile — the module is built by `tools/modules.sh` on every push — but no assertion mentions them by name, so treat the signature as the only claim about them that a lane checks.

That count is of DIRECT mentions. An arm an assertion reaches only through a caller is not counted here, so a helper below may well be exercised on every push without appearing to be — what is true is that no lane fixes its result independently of its caller’s.

- `Rule` — `struct Rule { run: Nail -> Edge };`
- `Seq` — `trait Seq { then(⊛); };`
- `Seq for Rule` — `impl Seq for Rule { then(self: Rule, p: Rule) -> Rule { plug(self, p) }; };`
- `Alt` — `trait Alt { alt(⊕); };`
- `Alt for Rule` — `impl Alt for Rule { alt(self: Rule, p: Rule) -> Rule { pose(self, p) }; };`

## Where it is used

3 examples import `parser`. Each is a complete program whose value `tools/examples.sh` pins on every push.

- `examples/parser-arms.jock` — the arms sheet: one assertion per arm
- `examples/parser-combinators.jock` — a use
- `examples/parser.jock` — a use

The [worked examples](/reference/examples/) page shows the shortest of these in full.
