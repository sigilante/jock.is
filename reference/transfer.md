# Negative transfer

The 23 refusals that exist to catch a habit from another language, each with the compiler’s own correction. A model writing Jock does not usually fail from ignorance; it fails by writing confident Rust, Swift or Hoon. These are the places the compiler says so.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` in the compiler repo writes this page.
>
> channel `%rc` · commit `c26a0c8` (sigilante/pre-rc-sweep) · corpus 1156 vectors · 2026-10-30

A refusal is counted here when its `~|` clue carries a **prose sentence**. An ordinary refusal ships a tag and a position; only one that means to teach you something ships words. That is a mechanical test, so this set grows with the compiler rather than with anyone remembering to add a row.

Every message under **The corrections** is quoted from the compiler, not written here, so the words a reader sees are the words the terminal will use. The one section that is authored says so in its own heading, and even there the program and the value come from a vector.

|  | count |
|---|---:|
| refusals that correct you | 23 |
| …shown with the program that triggers one | 23 |
| …pinned only by an AST-level vector | 0 |
| …pinned by no vector at all | 0 |

## The corrections

### `%decl-fond`

```jock
enum Rec { mk(Rec) }; 0
```

> this type contains itself with no base case, so it has no smallest value

pinned by `t-decl-fond-only` · spec: docs/spec/language.md [L-164](/spec/language/#l-164)

### `%decl-fond-deep`

```jock
struct S0 { x: @ }; struct S1 { x: S0 }; struct S2 { x: S1 }; struct S3 { x: S2 }; struct S4 { x: S3 }; struct S5 { x: S4 }; struct S6 { x: S5 }; struct S7 { x: S6 }; struct S8 { x: S7 }; struct S9 { x: S8 }; struct S10 { x: S9 }; struct S11 { x: S10 }; struct S12 { x: S11 }; struct S13 { x: S12 }; struct S14 { x: S13 }; struct S15 { x: S14 }; struct S16 { x: S15 }; struct S17 { x: S16 }; struct S18 { x: S17 }; struct S19 { x: S18 }; struct S20 { x: S19 }; struct S21 { x: S20 }; struct S22 { x: S21 }; struct S23 { x: S22 }; struct S24 { x: S23 }; struct S25 { x: S24 }; struct S26 { x: S25 }; struct S27 { x: S26 }; struct S28 { x: S27 }; struct S29 { x: S28 }; struct S30 { x: S29 }; struct S31 { x: S30 }; struct S32 { x: S31 }; struct S33 { x: S32 }; struct S34 { x: S33 }; struct S35 { x: S34 }; struct S36 { x: S35 }; struct S37 { x: S36 }; struct S38 { x: S37 }; struct S39 { x: S38 }; struct S40 { x: S39 }; struct S41 { x: S40 }; struct S42 { x: S41 }; struct S43 { x: S42 }; struct S44 { x: S43 }; struct S45 { x: S44 }; struct S46 { x: S45 }; struct S47 { x: S46 }; struct S48 { x: S47 }; struct S49 { x: S48 }; struct S50 { x: S49 }; struct S51 { x: S50 }; struct S52 { x: S51 }; struct S53 { x: S52 }; struct S54 { x: S53 }; struct S55 { x: S54 }; struct S56 { x: S55 }; struct S57 { x: S56 }; struct S58 { x: S57 }; struct S59 { x: S58 }; struct S60 { x: S59 }; struct S61 { x: S60 }; struct S62 { x: S61 }; struct S63 { x: S62 }; struct S64 { x: S63 }; struct S65 { x: S64 }; struct S66 { x: S65 }; struct S67 { x: S66 }; struct S68 { x: S67 }; struct S69 { x: S68 }; struct S70 { x: S69 }; 1
```

> this type nests deeper than the checker unrolls (64); it may be well-founded

pinned by `t-decl-fond-deep` · spec: docs/spec/language.md [L-164](/spec/language/#l-164)

### `%decl-fond-order`

```jock
enum Rec { cell(Rec, Rec), leaf }; 0
```

> the FIRST case of this union contains it, so the bunt diverges;  a non-recursive case must come first --- reorder the cases

pinned by `t-decl-fond-cycl` · spec: docs/spec/language.md [L-164](/spec/language/#l-164)

### `%decl-indiscriminable`

```jock
struct P { a: @, b: @ }; struct Q { c: @, d: @ }; alias C is P | Q; 0
```

> this declaration holds a union whose members are not told apart by their nouns

pinned by `t-decl-dish-stub-still`

### `%elab-too-large`

```jock
alias A0 is @; alias A1 is (A0,A0); alias A2 is (A1,A1); alias A3 is (A2,A2); alias A4 is (A3,A3); alias A5 is (A4,A4); alias A6 is (A5,A5); alias A7 is (A6,A6); alias A8 is (A7,A7); alias A9 is (A8,A8); alias A10 is (A9,A9); alias A11 is (A10,A10); alias A12 is (A11,A11); alias A13 is (A12,A12); alias A14 is (A13,A13); alias A15 is (A14,A14); alias A16 is (A15,A15); alias A17 is (A16,A16); alias A18 is (A17,A17); alias A19 is (A18,A18); alias A20 is (A19,A19); alias A21 is (A20,A20); alias A22 is (A21,A21); alias A23 is (A22,A22); alias A24 is (A23,A23); let x: A24 = 1; 1
```

> this alias elaborates to more nodes than a type may hold; aliases expand inline at every use

pinned by `t-elab-too-large`

### `%kernel-trait`

```jock
struct KS { n: @ }; class Counter(KS) { load(self: Counter, old: *) -> Counter { old as! Counter }; peek(self: Counter, p: *) -> * { self.n }; poke(self: Counter, e: *) -> (List<*>, Counter) { (~, self) }; }; Counter( n: 0 )
```

> the class must impl Kernel<E> or FullKernel<E>, naming its effect type

pinned by `t-rch-kern-tr` · spec: docs/spec/runtime.md [R-70](/spec/runtime/#r-70)

### `%lex-connective`

```jock
let a = true; let b = false; a && b
```

> && is not Jock; the connectives are words: a and b, a or b, not a (bitwise is hoon.dis/con/mix)

> || is not Jock; the connectives are words: a and b, a or b, not a (| joins types: A | B)

pinned by `t-hint-amp` · spec: docs/spec/language.md [L-91](/spec/language/#l-91), docs/spec/language.md [L-178](/spec/language/#l-178)

### `%mint-call-arity`

```jock
func f(a: @, b: @) -> @ { a }; f(1)
```

> call supplies no arguments;  this one takes some

> no arguments minted for a call that supplied some

pinned by `t-rch-arity` · spec: docs/spec/language.md [L-171](/spec/language/#l-171)

### `%mint-cast-sealed`

*module*

```jock
struct CS { n: @ }; class Counter(CS) impl Add { add(self: Self, p: Self) -> Self { Counter( n: self.n + p.n ) }; bump(self: Self) -> Self { Counter( n: self.n + 1 ) }; twice(self: Self) -> Self { self.bump().bump() }; }; func mk(n: @) -> Counter { Counter( n: n ) }; 
```

*program*

```jock
import m; (5 as m.Counter).n
```

> a class is constructed only by the module that declares it; a cast would forge one

> a class is constructed only by the module that declares it; ask it for an arm that validates

pinned by `t-jimp-seal-cast` · spec: docs/imports.md I-5

### `%mint-cast-sint`

```jock
struct SB { a: Int, k: @ }; let s = (5, 4) as SB; if s.a == -3 { 111 } else { 222 }
```

> a cast reinterprets bits; sint(n) converts @ to Int

> a cast reinterprets bits; sint(n) converts @ to Int (an untyped noun may still be molded: it is ZigZag by provenance)

> a type test reinterprets bits; sint(n) converts @ to Int (an untyped noun may still be molded: it is ZigZag by provenance)

pinned by `t-cast-sint-deep` · spec: docs/imports.md I-5, docs/spec/language.md [L-12](/spec/language/#l-12), docs/spec/language.md [L-127](/spec/language/#l-127)

### `%mint-edit-sealed`

*module*

```jock
struct CS { n: @ }; class Counter(CS) impl Add { add(self: Self, p: Self) -> Self { Counter( n: self.n + p.n ) }; bump(self: Self) -> Self { Counter( n: self.n + 1 ) }; twice(self: Self) -> Self { self.bump().bump() }; }; func mk(n: @) -> Counter { Counter( n: n ) }; 
```

*program*

```jock
import m; var c = m.mk(1); c.n = 9; c.n
```

> a class is written only by the module that declares it; ask it for an arm that rebuilds

pinned by `t-jimp-seal-edit` · spec: docs/imports.md I-5

### `%mint-patt-bare`

```jock
enum C { red, green } let c = C.green; match c { red => 1, green => 2, }
```

> a bare name is a binding, never a case; write .name or Type.name to match the case

pinned by `t-arc-patt-bare` · spec: docs/spec/language.md [L-149](/spec/language/#l-149)

### `%mint-slit-sealed`

*module*

```jock
struct BS<T> { v: T }; class Box<T>(BS<T>) { get(self: Self) -> T { self.v } }; func mk(x: @) -> Box<@> { Box( v: x ) }; 
```

*program*

```jock
import m; m.Box( v: 6 ).get()
```

> a class is constructed only by the module that declares it; use a constructor it exports

pinned by `t-jimp-class-gen-seal` · spec: docs/imports.md I-5

### `%mint-unblessed`

*module*

```jock
func g() -> @ { 2 };
```

*program*

```jock
import evil; evil.g()
```

> module is not on the blessed list; see vendor/BLESSED.txt

pinned by `t-halo-unblessed`

### `%mint-unblessed-scry`

*program*

```jock
peekContext(42)
```

> the namespace is denied under --nockchain

pinned by `t-halo-scry-peek`

### `%parse-lark-cmp`

```jock
var p = (7, 9); p.>= 3; p
```

> p.>= is the lark p.> then =; write p.> >= 3 to compare, or p.> = 3 to assign

pinned by `t-lark-eq-glued` · spec: docs/spec/language.md [L-105](/spec/language/#l-105)

### `%parse-minus-glue`

```jock
let a = 5; a- 1
```

> write a - 1 to subtract; the glued and half-glued spellings are reserved

pinned by `t-minus-glued-l` · spec: docs/spec/language.md [L-10](/spec/language/#l-10), docs/spec/language.md [L-109](/spec/language/#l-109)

### `%parse-no-result`

```jock
let a = 1; let b = 2; let c = 3;
```

> a program ends in an EXPRESSION; this one ends after its last statement

pinned by `t-parse-no-result`

### `%parse-not`

```jock
let a = true; !a
```

> ! does not negate; write not e (! appears only in !=)

pinned by `t-hint-not`

### `%parse-private`

```jock
private let x = 1; x
```

> private marks a declaration or a func; nothing else exports

pinned by `t-err-private-let` · spec: docs/spec/language.md [L-20](/spec/language/#l-20)

### `%parse-private-impl`

```jock
private impl Meas for @ { len(self: @) -> @ { 1 } }; 0
```

> an impl is a global fact scoped by reachability; it cannot be private

pinned by `t-err-private-impl` · spec: docs/spec/language.md [L-20](/spec/language/#l-20)

### `%parse-ternary`

```jock
true ? 1 : 2
```

> no ternary ?: in Jock; if c { a } else { b } is an expression

pinned by `t-hint-ternary`

### `%parse-unglued`

```jock
f (3)
```

> f (x) does not call f; write f(x) to call, or ; to sequence

> xs [0] does not index xs; write xs[0] to index, or ; to sequence

pinned by `t-parse-unglued` · spec: docs/spec/language.md [L-85](/spec/language/#l-85)

## Divergences that do not refuse (authored)

Everything above is a refusal, which means the compiler already tells the reader they are wrong. This section is the other class: the same characters are legal in Jock and in the language the reader came from, and they mean different things. Nothing warns, in either direction.

> [!NOTE]
> **The contrast sentences here are written, not quoted** — a divergence with no refusal has no compiler message to quote. The program and the value under each heading are a corpus vector’s own claim, and `refgen` fails if the vector stops pinning one.

### A two-digit escape is hex, and collides with octal

```jock
"\41"
```

`t-str-esc-octal-trap` asserts 65 · spec: `language.md L-28`

C, Python, JavaScript and Ruby read `\41` as an **octal** escape and give `!`, because `0o41` is 33. Jock reads the pair as hexadecimal with no `x` marker, so the same four characters are `A` — `0x41`, the 65 the vector asserts. Both readings compile and neither warns. Ruled 2026-10-27: the collision stands rather than being respelled `\xNN`, and is recorded rather than left to be discovered.
