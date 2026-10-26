# Refusal tags

Every refusal the Jock compiler can raise, the minimal program
that raises it, and the vector that pins it.

> **GENERATED — do not edit.** `tools/refgen.py` in the compiler
> repo writes this file; edits here are overwritten.
>
> channel `%rc` · commit `8b5fbba` (sigilante/spec-recomposition) · corpus 1055 vectors · 2026-10-27

| | count | |
|---|---:|---|
| tags the compiler can raise | 206 | 200 `~|` heads + 6 `$diag` members |
| pinned by a vector | 183 | the tag itself is asserted |
| …with a runnable program | 123 | shown below |
| …vector is AST-level only | 60 | no program exists to show |
| pinned by nothing | 23 | listed at the end, unexplained |

A `%neg` vector refuses *without* naming a tag, so it pins that a
program is rejected and never in what words. 36 rows are `%neg`;
none of them pins a tag here.

## Tags with a minimal program

Each program is the vector's own input, verbatim — extracted,
never transcribed (`site/LISTINGS.md` X-1), and pinned by its
tag rather than a value (X-8). Running it reproduces the
refusal.

### `%decl-dup-field`

```
struct S { x: @, x: @ }; 1
```

pinned by `t-decl-dup-field` · spec: docs/spec/language.md L-157

### `%decl-dup-method`

```
struct S { x: @ }; class C(S) { m(self: C) -> @ { 1 }; m(self: C) -> @ { 2 }; }; 1
```

pinned by `t-decl-dup-method` · spec: docs/spec/language.md L-157

### `%decl-dup-tag`

```
enum E { a, a }; 1
```

pinned by `t-decl-dup-tag` · spec: docs/spec/language.md L-157

### `%decl-fond`

```
enum Rec { mk(Rec) }; 0
```

pinned by `t-decl-fond-only` · also `t-mint-decl-fond` (AST-level) · spec: docs/spec/language.md L-164

### `%decl-fond-deep`

```
struct S0 { x: @ }; struct S1 { x: S0 }; struct S2 { x: S1 }; struct S3 { x: S2 }; struct S4 { x: S3 }; struct S5 { x: S4 }; struct S6 { x: S5 }; struct S7 { x: S6 }; struct S8 { x: S7 }; struct S9 { x: S8 }; struct S10 { x: S9 }; struct S11 { x: S10 }; struct S12 { x: S11 }; struct S13 { x: S12 }; struct S14 { x: S13 }; struct S15 { x: S14 }; struct S16 { x: S15 }; struct S17 { x: S16 }; struct S18 { x: S17 }; struct S19 { x: S18 }; struct S20 { x: S19 }; struct S21 { x: S20 }; struct S22 { x: S21 }; struct S23 { x: S22 }; struct S24 { x: S23 }; struct S25 { x: S24 }; struct S26 { x: S25 }; struct S27 { x: S26 }; struct S28 { x: S27 }; struct S29 { x: S28 }; struct S30 { x: S29 }; struct S31 { x: S30 }; struct S32 { x: S31 }; struct S33 { x: S32 }; struct S34 { x: S33 }; struct S35 { x: S34 }; struct S36 { x: S35 }; struct S37 { x: S36 }; struct S38 { x: S37 }; struct S39 { x: S38 }; struct S40 { x: S39 }; struct S41 { x: S40 }; struct S42 { x: S41 }; struct S43 { x: S42 }; struct S44 { x: S43 }; struct S45 { x: S44 }; struct S46 { x: S45 }; struct S47 { x: S46 }; struct S48 { x: S47 }; struct S49 { x: S48 }; struct S50 { x: S49 }; struct S51 { x: S50 }; struct S52 { x: S51 }; struct S53 { x: S52 }; struct S54 { x: S53 }; struct S55 { x: S54 }; struct S56 { x: S55 }; struct S57 { x: S56 }; struct S58 { x: S57 }; struct S59 { x: S58 }; struct S60 { x: S59 }; struct S61 { x: S60 }; struct S62 { x: S61 }; struct S63 { x: S62 }; struct S64 { x: S63 }; struct S65 { x: S64 }; struct S66 { x: S65 }; struct S67 { x: S66 }; struct S68 { x: S67 }; struct S69 { x: S68 }; struct S70 { x: S69 }; 1
```

pinned by `t-decl-fond-deep` · spec: docs/spec/language.md L-164

### `%decl-fond-order`

```
enum Rec { cell(Rec, Rec), leaf }; 0
```

pinned by `t-decl-fond-cycl` · spec: docs/spec/language.md L-164

### `%decl-indiscriminable`

```
struct P { a: @, b: @ }; struct Q { c: @, d: @ }; alias C is P | Q; 0
```

pinned by `t-err-decl-indiscrim`, `t-err-or-arg-cell`, `t-err-or-arg-stub`, `t-err-or-headshape-both`, `t-err-or-headshape-onefield`

### `%decl-op-eq`

```
trait E { ne(!=); }; 0
```

pinned by `t-err-op-ne` · spec: docs/spec/language.md L-43

### `%decl-op-gen`

```
trait T<X> { add(+); }; 1
```

pinned by `t-decl-op-gen`

### `%decl-op-rebind`

```
trait MyAdd { add(+); }; 0
```

pinned by `t-err-op-rebind` · spec: docs/spec/language.md L-43, docs/spec/runtime.md R-62

### `%decl-trait-annot`

```
trait T { m(self: Self, a) -> @; }; 1
```

pinned by `t-decl-trait-annot`

### `%decl-trait-self`

```
trait Zero { zero() -> Self; }; 1
```

pinned by `t-trait-nullary` · also `t-mint-trait-self` (AST-level) · spec: docs/spec/language.md L-44

### `%elab-indiscriminable`

```
struct P { a: @, b: @ }; struct Q { c: @, d: @ }; func f(c: P | Q) -> @ { 1 }; 0
```

pinned by `t-err-elab-indiscrim-sig` · also `t-elab-union-n` (AST-level)

### `%elab-too-large`

```
alias A0 is @; alias A1 is (A0,A0); alias A2 is (A1,A1); alias A3 is (A2,A2); alias A4 is (A3,A3); alias A5 is (A4,A4); alias A6 is (A5,A5); alias A7 is (A6,A6); alias A8 is (A7,A7); alias A9 is (A8,A8); alias A10 is (A9,A9); alias A11 is (A10,A10); alias A12 is (A11,A11); alias A13 is (A12,A12); alias A14 is (A13,A13); alias A15 is (A14,A14); alias A16 is (A15,A15); alias A17 is (A16,A16); alias A18 is (A17,A17); alias A19 is (A18,A18); alias A20 is (A19,A19); alias A21 is (A20,A20); alias A22 is (A21,A21); alias A23 is (A22,A22); alias A24 is (A23,A23); let x: A24 = 1; 1
```

pinned by `t-elab-too-large`

### `%elab-unbound`

```
private struct Hidden { h: @ }; struct Shown { s: @ };
```

pinned by `t-jimp-private-type`, `t-timp-type-unbound` · also `t-elab-unbound-err`, `t-elab-unbound-n` (AST-level) · spec: docs/imports.md I-5, docs/spec/runtime.md R-83

### `%elab-unimported`

```
struct P { v: @ }; func mkp(n: @) -> P { P( v: n ) }; 
```

pinned by `t-jdag-layer-spell` · spec: docs/imports.md I-3

### `%export-private`

```
private struct Key { k: @ }; func mkKey(n: @) -> Key { Key( k: n ) };
```

pinned by `t-jimp-export-private`, `t-jimp-export-private-alias`, `t-jimp-export-private-field` · spec: docs/imports.md I-5, docs/spec/language.md L-21

### `%import-cycle`

```
import b; func fa(n: @) -> @ { n }; 
```

pinned by `t-jdag-cycle`

### `%import-unknown`

```
import bar; func f(n: @) -> @ { n };
```

pinned by `t-jimp-mimp` · spec: docs/imports.md I-6, docs/spec/language.md L-171

### `%join-aura`

```
if 2 == 2 { 1 } else { 1.5 }
```

pinned by `t-err-join-if`, `t-err-join-list` · also `t-join-aura-chars-e`, `t-join-aura-loob-e`, `t-join-aura-real-e` (AST-level)

### `%kernel-shape`

```
42
```

pinned by `t-kern-shape`

### `%lex-comment-open`

```
/* x
```

pinned by `t-lex-blokop-n`

### `%lex-connective`

```
let a = true; let b = false; a && b
```

pinned by `t-hint-amp`, `t-hint-amp-mid`, `t-hint-bar` · spec: docs/spec/language.md L-91, docs/spec/language.md L-178

### `%lex-hex`

```
0x
```

pinned by `t-lex-hex-n`

### `%lex-interp-brace`

```
"} bad"
```

pinned by `t-err-interp-brace`

### `%lex-interp-open`

```
"{x
```

pinned by `t-err-interp-open`

### `%lex-interp-str`

```
"a{"b"}c"
```

pinned by `t-err-interp-str` · spec: docs/spec/language.md L-31

### `%lex-number`

```
1_
```

pinned by `t-lex-num-n`

### `%lex-quote-open`

```
"open
```

pinned by `t-lex-strop-n`

### `%lex-real-prec`

```
3.12345678901234567
```

pinned by `t-lex-real-prec`

### `%lex-string-escape`

```
"a\zzb"
```

pinned by `t-str-esc-bad`, `t-str-esc-short` · spec: docs/spec/language.md L-29

### `%lex-term`

```
%aB
```

pinned by `t-lex-term`

### `%mill-lambda`

```
let f: (@) -> @ = lambda () -> @ { 1 }; f(1)
```

pinned by `t-mill-lambda`

### `%mill-lambda-arity`

```
let f: (@) -> @ = lambda (x: @, y: @) -> @ { x }; f(1)
```

pinned by `t-mill-lambda-arity` · spec: docs/spec/language.md L-141

### `%mill-nest`

```
let u: UniChar = 0x1f600 as! UniChar; let b: Byte = u; b
```

pinned by `t-arc-unichar-narrow`, `t-err-class-gen-arg`, `t-err-map-annot-real`, `t-err-print-num`, `t-gen-rigid-arg`, `t-gen-rigid-unit`, `t-rigid-mcon`, `t-rigid-slit`, `t-text-char-no`, `t-var-widen-shallow` · also `t-mint-annot`, `t-mint-cond`, `t-mint-guard`, `t-mint-inc-cell` (AST-level) · spec: docs/spec/language.md L-132

### `%mint-call-bound`

```
func<T> f(x: T) -> T { g(x) }; func<T: Lt> g(x: T) -> T { x }; f(1)
```

pinned by `t-err-ggroup-unbound` · also `t-mint-gen-nobound` (AST-level)

### `%mint-cast`

```
let n = 42; let b: Bool = n as Bool; b
```

pinned by `t-as-grd-bool`, `t-as-grd-char`, `t-cast-sint-deep`, `t-err-chars-cast` · also `t-mint-cast` (AST-level) · spec: docs/spec/language.md L-24, docs/spec/language.md L-120, docs/spec/runtime.md R-44

### `%mint-cast-sealed`

```
struct CS { n: @ }; class Counter(CS) impl Add { add(self: Self, p: Self) -> Self { Counter( n: self.n + p.n ) }; bump(self: Self) -> Self { Counter( n: self.n + 1 ) }; twice(self: Self) -> Self { self.bump().bump() }; }; func mk(n: @) -> Counter { Counter( n: n ) }; 
```

pinned by `t-jimp-seal-cast`, `t-jimp-seal-deep-arg`, `t-jimp-seal-deep-cast`, `t-jimp-seal-deep-soft`, `t-jimp-seal-soft`, `t-jimp-seal-test` · spec: docs/imports.md I-5

### `%mint-cast-sint`

```
42 as Int
```

pinned by `t-sint-cast`, `t-sint-castp`, `t-sint-castq`, `t-sint-castx` · spec: docs/imports.md I-5, docs/spec/language.md L-12, docs/spec/language.md L-127

### `%mint-ctor`

```
E.a(1)
```

pinned by `t-mint-ctor`

### `%mint-ctor-applied`

```
enum E { a(@) }; let f = E.a; 1
```

pinned by `t-text-ctor-applied` · also `t-mint-ctor-applied` (AST-level) · spec: docs/spec/language.md L-166

### `%mint-ctor-arity`

```
enum E { a(@) }; E.a()
```

pinned by `t-mint-ctor-arity` · spec: docs/spec/language.md L-165

### `%mint-ctor-nullary`

```
enum E { a }; E.a(1)
```

pinned by `t-mint-ctor-nullary` · spec: docs/spec/language.md L-165

### `%mint-ctor-tag`

```
enum E { a(@) }; E.b(1)
```

pinned by `t-mint-ctor-tag` · spec: docs/spec/language.md L-166

### `%mint-edit`

```
let a = 1; a.x = 2; a
```

pinned by `t-mint-edit`

### `%mint-edit-immutable`

```
let b = 1; b = 3; b
```

pinned by `t-let-no-edit` · also `t-mint-edit-let` (AST-level) · spec: docs/spec/language.md L-130

### `%mint-edit-sealed`

```
struct CS { n: @ }; class Counter(CS) impl Add { add(self: Self, p: Self) -> Self { Counter( n: self.n + p.n ) }; bump(self: Self) -> Self { Counter( n: self.n + 1 ) }; twice(self: Self) -> Self { self.bump().bump() }; }; func mk(n: @) -> Counter { Counter( n: n ) }; 
```

pinned by `t-jimp-seal-edit` · spec: docs/imports.md I-5

### `%mint-func-annot`

```
func f(a) -> @ { 1 }; f(1)
```

pinned by `t-mint-func-annot` · spec: docs/spec/language.md L-136

### `%mint-gen-unused`

```
func<T> bad(x: @) -> @ { x }; func<U> ok(x: U) -> U { x }; 0
```

pinned by `t-err-ggroup-unused` · also `t-mint-gen-unsolved` (AST-level)

### `%mint-impl-coh`

```
impl<T> Meas for List<T> { len(self: List<T>) -> @ { 0 }; }; 1
```

pinned by `t-mint-gimpl-coh` · also `t-mint-impl-coh` (AST-level)

### `%mint-impl-orphan`

```
impl Show for @ { show(self: @) -> String { "x" } }; func noop(n: @) -> @ { n }; 
```

pinned by `t-jimp-orphan`

### `%mint-impl-shape`

```
impl<T> Str for List<(T, T)> { len(self: List<(T, T)>) -> @ { 0 }; cat(self: List<(T, T)>, t: String) -> String { t }; trip(self: List<(T, T)>) -> List<Byte> { t }; }; 1
```

pinned by `t-mint-gimpl-shape`

### `%mint-impl-targs`

```
trait G<A> { g(self: Self) -> A; }; struct S { v: @ }; class C(S) impl G { g(self: C) -> @ { 1 }; }; 0
```

pinned by `t-err-class-ptrait`, `t-err-targs-arity`

### `%mint-impl-trait`

```
struct P { x: @ }; impl Nope for P { }; 1
```

pinned by `t-mint-impl-trait`

### `%mint-import`

```
import nope; 1
```

pinned by `t-timp-absent` · also `t-mint-import-unknown` (AST-level) · spec: docs/imports.md I-6, docs/spec/language.md L-171

### `%mint-import-arm`

```
func dbl(n: @) -> @ { n + n };
```

pinned by `t-jimp-absent`, `t-jimp-private-arm`

### `%mint-inexhaustive`

```
let o: @? = 5; match o { ~ => 0, }
```

pinned by `t-text-opt-no-cell`, `t-text-opt-no-null` · also `t-mint-match-inex`, `t-mint-witness` (AST-level)

### `%mint-inst-annot`

```
enum E<T> { a }; E.a
```

pinned by `t-mint-inst-annot` · spec: docs/spec/language.md L-147

### `%mint-limb`

```
func a() -> @ { b() }; struct S { v: @ }; func b() -> @ { 7 }; a()
```

pinned by `t-text-grp-split-decl`, `t-text-grp-split-let` · also `t-mint-unbound` (AST-level) · spec: docs/spec/language.md L-139

### `%mint-meth-amb`

```
struct P { v: @ }; trait Ar { add(self: Self, o: Self) -> Self; }; impl Ar for P { add(self: P, o: P) -> P { P( v: 0 ) } }; impl Add for P { add(self: P, o: P) -> P { P( v: self.v + o.v ) } }; let a = P( v: 2 ); a.add(a).v
```

pinned by `t-op-amb-bare` · also `t-mint-meth-amb` (AST-level)

### `%mint-meth-annot`

```
struct S { x: @ }; class C(S) { m(self: C, a) -> @ { 1 }; }; 1
```

pinned by `t-mint-meth-annot`

### `%mint-meth-arity`

```
struct S { x: @ }; class C(S) { m(self: C) -> @ { 1 }; }; let c = C( x: 1 ); c.m(1, 2)
```

pinned by `t-mint-meth-arity`

### `%mint-meth-self`

```
struct S { x: @ }; class C(S) { m(self: @) -> @ { 1 }; }; let c = C( x: 1 ); c.m()
```

pinned by `t-mint-meth-self` · spec: docs/spec/language.md L-158

### `%mint-naxis`

```
import chain; func f(m: chain.ZMap<@, @>) -> @ { m.< }; 1
```

pinned by `t-cimp-seal`, `t-lark-atom-n`, `t-lark-seal-n`, `t-naxis-seal-n`

### `%mint-op`

```
1.5 % 2.0
```

pinned by `t-err-op-rmod` · spec: docs/spec/language.md L-116

### `%mint-op-aura`

```
1 + 'a'
```

pinned by `t-err-op-aura-char`, `t-err-op-aura-real` · spec: docs/spec/language.md L-39, docs/spec/runtime.md R-51

### `%mint-op-impl`

```
struct P { v: @ }; let a = P( v: 1 ); let b = P( v: 2 ); let c = a + b; 0
```

pinned by `t-err-op-impl`, `t-err-op-impl-bool`, `t-err-op-impl-char` · spec: docs/spec/runtime.md R-51

### `%mint-patt-bare`

```
enum C { red, green } let c = C.green; match c { red => 1, green => 2, }
```

pinned by `t-arc-patt-bare` · spec: docs/spec/language.md L-149

### `%mint-patt-tag`

```
enum E { a(@) }; let e = E.a(1); match e { .b(x) => x, _ => 0 }
```

pinned by `t-mint-patt-tag`

### `%mint-peek-arity`

```
peekUnder(1)
```

pinned by `t-mint-peek-arity`

### `%mint-recur`

```
var b: @ = 0; loop outer { if b == 3 { b } else { b = b + 1; recur inner } }
```

pinned by `t-loop-label-bad` · also `t-mint-recur-naked` (AST-level) · spec: docs/spec/language.md L-140, docs/spec/language.md L-153

### `%mint-slit`

```
private struct St { v: @ }; class C(St) { get(self: Self) -> @ { self.v } }; func mk(n: @) -> C { C( v: n ) }; 
```

pinned by `t-jimp-private-forge`

### `%mint-slit-missing`

```
struct Q { q: @ }; Q( r: 0 )
```

pinned by `t-slit-miss`

### `%mint-slit-sealed`

```
struct BS<T> { v: T }; class Box<T>(BS<T>) { get(self: Self) -> T { self.v } }; func mk(x: @) -> Box<@> { Box( v: x ) }; 
```

pinned by `t-jimp-class-gen-seal`, `t-jimp-seal-lit` · spec: docs/imports.md I-5

### `%mint-todo`

```
trait G<A> { g(self: Self) -> A; }; func<T: G> f(x: T) -> @ { 1 }; f(2)
```

pinned by `t-err-bound-ptrait`, `t-err-class-gen-bound`, `t-jimp-bound-qual-ptrait`, `t-mint-gimpl-bound`

### `%mint-unblessed`

```
import evil; evil.g()
```

pinned by `t-halo-unblessed`

### `%mint-unblessed-abi`

```
1 + 41
```

pinned by `t-halo-abi-moved`

### `%mint-unblessed-scry`

```
peekContext(42)
```

pinned by `t-halo-scry-peek` · also `t-halo-scry-try`, `t-halo-scry-under` (AST-level)

### `%mint-unimported`

```
struct P { v: @ }; func mkp(n: @) -> P { P( v: n ) }; 
```

pinned by `t-jdag-unimported`

### `%parse-alias-is`

```
alias Foo @; let x: Foo = 1; x
```

pinned by `t-arc-alias-no-is`

### `%parse-axis-zero`

```
let p = (7, 9); p.+0
```

pinned by `t-naxis-zero-n`

### `%parse-block`

```
loop 5
```

pinned by `t-parse-block`

### `%parse-class`

```
struct S { x: @ }; class C { }; 1
```

pinned by `t-parse-class`

### `%parse-else`

```
if 1 == 1 { 2 }
```

pinned by `t-parse-noelse`

### `%parse-empty-brace`

```
let a = 1; { }
```

pinned by `t-parse-empty-brace` · spec: docs/spec/language.md L-85

### `%parse-enum-casing`

```
enum S { Point }; 1
```

pinned by `t-parse-casing` · spec: docs/spec/language.md L-163

### `%parse-eval`

```
eval 5
```

pinned by `t-parse-eval` · spec: docs/spec/language.md L-129

### `%parse-expected`

```
let a: @ = 3; match a { 1 => 0; _ => 84; }
```

pinned by `t-arc-arm-semi`, `t-arc-ctor-brace`, `t-eq-bind-raw`, `t-hint-index-q`, `t-index-gone-has`, `t-index-gone-slice`, `t-parse-match-nosep`, `t-parse-method-nosep` · spec: docs/spec/language.md L-84, docs/spec/language.md L-85

### `%parse-func-parens`

```
func f () -> @ { 1 }; f()
```

pinned by `t-parse-func-parens`

### `%parse-impl-for`

```
struct P { x: @ }; impl Show P { show(self: P) -> String { 1 as! String }; }; 1
```

pinned by `t-parse-impl-for`

### `%parse-interp`

```
let a = 1; "{a a}"
```

pinned by `t-parse-interp`

### `%parse-lambda`

```
lambda 5
```

pinned by `t-parse-lambda` · spec: docs/spec/language.md L-129

### `%parse-lark-cmp`

```
var p = (7, 9); p.>= 3; p
```

pinned by `t-lark-eq-glued`, `t-lark-eq-glued-lt` · spec: docs/spec/language.md L-105

### `%parse-let-mut`

```
let mut x = 5; x
```

pinned by `t-hint-let-mut`

### `%parse-method`

```
struct S { x: @ }; class C(S) { m () -> @ { 1 }; }; 1
```

pinned by `t-parse-method`

### `%parse-minus-glue`

```
let a = 5; a- 1
```

pinned by `t-minus-glued-l`, `t-minus-glued-r` · spec: docs/spec/language.md L-10, docs/spec/language.md L-109

### `%parse-name`

```
let 5 = 3; 5
```

pinned by `t-parse-name`

### `%parse-no-result`

```
let a = 1; let b = 2; let c = 3;
```

pinned by `t-parse-no-result`

### `%parse-nonassoc`

```
let s = Set<@>([1, 2]); if 1 in s in s { 7 } else { 9 }
```

pinned by `t-in-nonassoc`, `t-parse-nonassoc` · also `t-parse-subset-nonassoc` (AST-level) · spec: docs/spec/language.md L-108

### `%parse-not`

```
let a = true; !a
```

pinned by `t-hint-not`, `t-index-gone-pop`

### `%parse-or-face`

```
enum Shape { point, circle(r: Float64) }; 1
```

pinned by `t-parse-or-face` · spec: docs/spec/language.md L-165

### `%parse-path`

```
let p = /; p
```

pinned by `t-parse-path`

### `%parse-patt`

```
match 1 { , => 1; }
```

pinned by `t-parse-patt`

### `%parse-patt-as`

```
match 1 { as @ => 1, _ => 0 }
```

pinned by `t-parse-patt-as`

### `%parse-patt-bare`

```
enum E { circle(@) }; let e = E.circle(1); match e { circle(r) => r; _ => 0; }
```

pinned by `t-parse-patt-bare`

### `%parse-patt-case`

```
match 1 { . => 1; _ => 0; }
```

pinned by `t-parse-patt-case`

### `%parse-place`

```
struct T { z: @ }; func mt() -> T { T( z: 1 ) }; mt().z = 5; 0
```

pinned by `t-err-dot-place`, `t-err-slice-place` · spec: docs/spec/language.md L-114

### `%parse-print-pri`

```
let n = 2; print("x", n); 0
```

pinned by `t-err-print-pri-expr` · spec: docs/spec/language.md L-34

### `%parse-private`

```
private let x = 1; x
```

pinned by `t-err-private-let` · spec: docs/spec/language.md L-20

### `%parse-private-impl`

```
private impl Meas for @ { len(self: @) -> @ { 1 } }; 0
```

pinned by `t-err-private-impl` · spec: docs/spec/language.md L-20

### `%parse-set-ctor`

```
let s = Set<@> [1]; s
```

pinned by `t-parse-set-ctor`

### `%parse-stray`

```
let xs = [1]; xs[]
```

pinned by `t-index-gone-peek`, `t-index-gone-push` · spec: docs/spec/language.md L-10, docs/spec/language.md L-88

### `%parse-switch-gone`

```
let a: @ = 3; switch a { 1 => 0, _ => 84, }
```

pinned by `t-switch-gone` · spec: docs/spec/language.md L-61, docs/spec/language.md L-151

### `%parse-ternary`

```
true ? 1 : 2
```

pinned by `t-hint-ternary`, `t-hint-ternary-mid`

### `%parse-tex`

```
let x: 5 = 3; x
```

pinned by `t-parse-tex`

### `%parse-tex-qual`

```
import hoon; let x: hoon. = 1; x
```

pinned by `t-parse-tex-qual`

### `%parse-todo`

```
func fib(n: @) -> @ { if n == 0 { 1 } else { $(n - 1) } }; fib(3)
```

pinned by `t-recur-edits` · spec: docs/spec/language.md L-154

### `%parse-trailing`

```
union C { red, green } C.red
```

pinned by `t-arc-union-gone` · spec: docs/spec/language.md L-174

### `%parse-trait-op`

```
trait Bad { go(~); }; 1
```

pinned by `t-trait-op-junk` · spec: docs/spec/language.md L-42

### `%parse-trait-sig`

```
trait T { m () -> @; }; 1
```

pinned by `t-parse-trait-sig`

### `%parse-unglued`

```
f (3)
```

pinned by `t-parse-unglued` · spec: docs/spec/language.md L-85

### `%parse-var-patt`

```
var (a, b) = (1, 2); a
```

pinned by `t-parse-var-patt` · spec: docs/spec/language.md L-134

### `%uint-neg`

```
import hoon; hoon.uint(-3)
```

pinned by `t-sint-uint-neg` · spec: docs/spec/language.md L-14, docs/spec/runtime.md R-15

## Tags with no runnable program

These are pinned by vectors that build an AST or an environment
directly, so the corpus proves the refusal without ever
expressing it as source. A1 cannot show a program for them, and
this is where the specs' tag names drifted: of the seven wrong
names this join found, five were tags in this list — tags nobody
had watched come out of a program. **This is the priority list
for source-level vectors.**

| tag | pinned by | spec |
|---|---|---|
| `%axis-arg-must-be-atom` | `t-nx-axarg-n` | — |
| `%bunt-diverges` | `t-bunt-fond-n` | — |
| `%bunt-empty-struct` | `t-bunt-empty-struct` | — |
| `%bunt-trait` | `t-bunt-trait` | — |
| `%bunt-unbound` | `t-bunt-unbound` | — |
| `%bunt-var` | `t-bunt-var-n` | — |
| `%bunt-void` | `t-bunt-void-n` | — |
| `%decl-class-state` | `t-mint-class-state` | docs/spec/language.md L-159 |
| `%decl-dup` | `t-mint-decl-dup`, `t-mint-decl-redecl` | docs/spec/language.md L-73, docs/spec/language.md L-157 |
| `%decl-empty-struct` | `t-mint-decl-empty` | — |
| `%elab-arity` | `t-elab-arity-n` | — |
| `%elab-gate-noarg` | `t-elab-gate-noarg-n` | — |
| `%elab-infer` | `t-elab-infer-err`, `t-elab-infer-n` | — |
| `%elab-trait-not-type` | `t-elab-trait-n` | — |
| `%embed-out` | `t-embed-gate-n`, `t-embed-or-n`, `t-embed-ref-n`, `t-embed-sum-n`, `t-embed-var-n` | docs/spec/language.md L-173 |
| `%empty-raw-cell` | `t-nx-emptycell-n` | — |
| `%join-fail` | `t-join-fail-n`, `t-join-ref-n`, `t-join-sub-miss-n`, `t-mint-join-err` | docs/spec/chain.md C-48 |
| `%let-shadows` | `t-nx-shadow-n` | — |
| `%lex-quote-newline` | `t-lex-quote-newline` | — |
| `%lex-stray` | `t-lex-stray-n`, `t-lex-uni-n` | — |
| `%lex-whitespace` | `t-lex-tab-n` | — |
| `%mint-axis` | `t-mint-axis` | — |
| `%mint-call` | `t-mint-call-gate` | — |
| `%mint-call-arity` | `t-mint-call-arity`, `t-mint-import-arity` | docs/spec/language.md L-171 |
| `%mint-cls-scope` | `t-mint-cls-scope` | — |
| `%mint-dict-arm` | `t-mint-dict-arm` | — |
| `%mint-dict-scope` | `t-mint-dict-scope` | docs/imports.md I-4 |
| `%mint-func-dup` | `t-mint-grp-dup` | docs/spec/language.md L-137 |
| `%mint-func-ret` | `t-mint-func-ret` | — |
| `%mint-func-shape` | `t-mint-func-shape` | — |
| `%mint-grp-empty` | `t-mint-grp-empty` | — |
| `%mint-impl-extra` | `t-mint-impl-extra` | — |
| `%mint-impl-miss` | `t-mint-impl-miss` | — |
| `%mint-impl-sig` | `t-mint-impl-sig` | — |
| `%mint-inst` | `t-mint-import-gen` | docs/spec/language.md L-171 |
| `%mint-lambda-annot` | `t-mint-lam-annot` | — |
| `%mint-meth-ret` | `t-mint-meth-ret` | — |
| `%mint-meth-shape` | `t-mint-meth-shape` | — |
| `%mint-mold` | `t-mint-asx-gate`, `t-mint-tt-gate` | docs/spec/language.md L-124 |
| `%mint-op-unary` | `t-mint-op-unary` | docs/spec/language.md L-111 |
| `%mint-patt` | `t-mint-match-patt`, `t-mint-match-sing` | — |
| `%mint-patt-ambiguous` | `t-mint-patt-ambiguous` | — |
| `%mint-recur-arm` | `t-mint-recur-arm` | — |
| `%mint-recur-limb` | `t-mint-recur-limb` | — |
| `%mint-recur-outer` | `t-mint-recur-outer` | — |
| `%mint-slit-cover` | `t-mint-slit-missing` | — |
| `%mint-slit-empty` | `t-mint-slit-empty` | — |
| `%mint-unreachable` | `t-mint-match-unreach` | — |
| `%module-form` | `t-module-form` | — |
| `%module-shape` | `t-module-shape` | — |
| `%parse-empty` | `t-parse-empty` | — |
| `%parse-type` | `t-parse-type-eof`, `t-parse-type-lower` | — |
| `%sugar-index-place` | `t-des-put-place` | — |
| `%sugar-istring` | `t-sugar-istring` | — |
| `%sugar-logic-arity` | `t-sugar-logic-arity` | — |
| `%sugar-op` | `t-des-op-bad` | docs/spec/language.md L-118 |
| `%sugar-op-unary` | `t-des-op-unary` | docs/spec/language.md L-10, docs/spec/language.md L-111 |
| `%sugar-todo` | `t-sugar-todo` | — |
| `%unbound-axis` | `t-nx-unbound-n` | — |
| `%unknown-opcode` | `t-nx-unkop-n` | — |

## Tags pinned by nothing

Reachable, and no vector asserts them. Simultaneously a
documentation gap (no verified explanation to emit) and a test
gap. Listed rather than dropped, so the gap is visible.

- `%desugar-snap`
- `%duplicate-schema-name`  — docs/spec/nockasm-target.md N-39, docs/spec/nockasm-target.md N-40, docs/spec/nockasm.md N-13
- `%habi-empty`
- `%impl-conflict`
- `%in-module`
- `%kernel-trait`  — docs/spec/runtime.md R-70
- `%match-duplicate-default`
- `%match-needs-default`
- `%mint-case`
- `%mint-field`
- `%mint-join`
- `%mint-list-join`
- `%mint-meth-fore`
- `%mint-method`
- `%modl-synims-count`
- `%module-type`
- `%nock-payload-needs-two-elements`
- `%op-conflict`
- `%opcode`
- `%parse-eof`
- `%pfix-plug`
- `%pfix-snap`
- `%raw-cell-needs-two-elements`

## Families

Five tags discriminate on a *second* element, so the thing to
search for is the pair. Every one is an "unsupported thing"
family, which is exactly where the compiler must say which.

- `%mint-mold` · `%deep` `%gate` `%var` `%void` — plus 4 computed leaf site(s), not enumerable from source
- `%mint-todo` · `%bound-ptrait` `%class-bound` `%export-class-ptrait` `%func-gen` `%impl-bound` `%impl-head` `%list-annot` `%trait-bound` — plus 1 computed leaf site(s), not enumerable from source
- `%module-form` · `%if` `%private` — plus 10 computed leaf site(s), not enumerable from source
- `%parse-todo` · `%defer` `%recur-edits`
- `%sugar-todo` · `%list-annot` `%map-annot`
