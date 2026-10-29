# Refusal tags

Every refusal the Jock compiler can raise, the minimal program that raises it, and the vector that pins it.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` in the compiler repo writes this page.
>
> channel `%rc` · commit `080874d` (sigilante/pre-rc-sweep) · corpus 1154 vectors · 2026-10-30

|  | count |  |
|---|---:|---|
| tags the compiler can raise | 202 | 197 `~|` heads + 7 `$diag` members |
| **with a runnable program** | **162** | the vector carries source, and the page shows it |
| no input can reach the guard | 36 | registered with the reason, and the registry is checked |
| …of those, still pinned by a vector | 30 | an AST- or judgment-level row reaches the arm directly |
| …and pinned by nothing | 6 | nothing to point an input at |
| compiler invariant with a tripwire | 2 | a vector green only while the invariant holds |
| **reachable, and pinned by nothing** | **2** | the gap list |
| AST-level only, with no reason recorded | 0 | the other gap: pinned, but never watched from a program |

A `%neg` vector refuses *without* naming a tag, so it pins that a program is rejected and never in what words. 38 rows are `%neg`; none of them pins a tag here.

**The two gap rows are the ones to read.** Every other row is a refusal the corpus pins and this page can explain. A count of unpinned tags on its own cannot tell a missing test from a guard the compiler holds against itself, and this page published 82 of them as one list until the difference was worked out tag by tag.

## Tags with a minimal program

Each program is the vector’s own input, verbatim — extracted, never transcribed (`LISTINGS.md` X-1), and pinned by its tag rather than a value (X-8). Running it reproduces the refusal.

### `%axis-arg-must-be-atom`

A **Nock Assembly** program, not a Jock one — `nexpand` is the judgment, and `lib/nockasm` the language.

```nasm
(%slot [1 2])
```

pinned by `t-rch-nx-axarg` · also `t-nx-axarg-n` (AST-level)

### `%decl-class-state`

```jock
class C(@) { m(self: C) -> @ { 1 }; }; 1
```

pinned by `t-rch-cls-state` · also `t-mint-class-state` (AST-level) · spec: docs/spec/language.md L-159

### `%decl-dup`

```jock
struct S { x: @ }; struct S { y: @ }; 1
```

pinned by `t-rch-decl-dup` · also `t-mint-decl-dup`, `t-mint-decl-redecl` (AST-level) · spec: docs/spec/language.md L-73, docs/spec/language.md L-157

### `%decl-dup-field`

```jock
struct S { x: @, x: @ }; 1
```

pinned by `t-decl-dup-field` · spec: docs/spec/language.md L-157

### `%decl-dup-method`

```jock
struct S { x: @ }; class C(S) { m(self: C) -> @ { 1 }; m(self: C) -> @ { 2 }; }; 1
```

pinned by `t-decl-dup-method` · spec: docs/spec/language.md L-157

### `%decl-dup-tag`

```jock
enum E { a, a }; 1
```

pinned by `t-decl-dup-tag` · spec: docs/spec/language.md L-157

### `%decl-empty-struct`

```jock
struct S { }; 1
```

pinned by `t-rch-decl-mt` · also `t-mint-decl-empty` (AST-level)

### `%decl-fond`

```jock
enum Rec { mk(Rec) }; 0
```

pinned by `t-decl-fond-only` · also `t-mint-decl-fond` (AST-level) · spec: docs/spec/language.md L-164

### `%decl-fond-deep`

```jock
struct S0 { x: @ }; struct S1 { x: S0 }; struct S2 { x: S1 }; struct S3 { x: S2 }; struct S4 { x: S3 }; struct S5 { x: S4 }; struct S6 { x: S5 }; struct S7 { x: S6 }; struct S8 { x: S7 }; struct S9 { x: S8 }; struct S10 { x: S9 }; struct S11 { x: S10 }; struct S12 { x: S11 }; struct S13 { x: S12 }; struct S14 { x: S13 }; struct S15 { x: S14 }; struct S16 { x: S15 }; struct S17 { x: S16 }; struct S18 { x: S17 }; struct S19 { x: S18 }; struct S20 { x: S19 }; struct S21 { x: S20 }; struct S22 { x: S21 }; struct S23 { x: S22 }; struct S24 { x: S23 }; struct S25 { x: S24 }; struct S26 { x: S25 }; struct S27 { x: S26 }; struct S28 { x: S27 }; struct S29 { x: S28 }; struct S30 { x: S29 }; struct S31 { x: S30 }; struct S32 { x: S31 }; struct S33 { x: S32 }; struct S34 { x: S33 }; struct S35 { x: S34 }; struct S36 { x: S35 }; struct S37 { x: S36 }; struct S38 { x: S37 }; struct S39 { x: S38 }; struct S40 { x: S39 }; struct S41 { x: S40 }; struct S42 { x: S41 }; struct S43 { x: S42 }; struct S44 { x: S43 }; struct S45 { x: S44 }; struct S46 { x: S45 }; struct S47 { x: S46 }; struct S48 { x: S47 }; struct S49 { x: S48 }; struct S50 { x: S49 }; struct S51 { x: S50 }; struct S52 { x: S51 }; struct S53 { x: S52 }; struct S54 { x: S53 }; struct S55 { x: S54 }; struct S56 { x: S55 }; struct S57 { x: S56 }; struct S58 { x: S57 }; struct S59 { x: S58 }; struct S60 { x: S59 }; struct S61 { x: S60 }; struct S62 { x: S61 }; struct S63 { x: S62 }; struct S64 { x: S63 }; struct S65 { x: S64 }; struct S66 { x: S65 }; struct S67 { x: S66 }; struct S68 { x: S67 }; struct S69 { x: S68 }; struct S70 { x: S69 }; 1
```

pinned by `t-decl-fond-deep` · spec: docs/spec/language.md L-164

### `%decl-fond-order`

```jock
enum Rec { cell(Rec, Rec), leaf }; 0
```

pinned by `t-decl-fond-cycl` · spec: docs/spec/language.md L-164

### `%decl-indiscriminable`

```jock
struct P { a: @, b: @ }; struct Q { c: @, d: @ }; alias C is P | Q; 0
```

pinned by `t-decl-dish-stub-still`, `t-err-decl-indiscrim`, `t-err-or-arg-cell`, `t-err-or-arg-stub`, `t-err-or-headshape-both`, `t-err-or-headshape-onefield`

### `%decl-op-eq`

```jock
trait E { ne(!=); }; 0
```

pinned by `t-err-op-ne` · spec: docs/spec/language.md L-43

### `%decl-op-gen`

```jock
trait T<X> { add(+); }; 1
```

pinned by `t-decl-op-gen`

### `%decl-op-rebind`

```jock
trait MyAdd { add(+); }; 0
```

pinned by `t-err-op-rebind` · spec: docs/spec/language.md L-43, docs/spec/runtime.md R-62

### `%decl-trait-annot`

```jock
trait T { m(self: Self, a) -> @; }; 1
```

pinned by `t-decl-trait-annot`

### `%decl-trait-self`

```jock
trait Zero { zero() -> Self; }; 1
```

pinned by `t-trait-nullary` · also `t-mint-trait-self` (AST-level) · spec: docs/spec/language.md L-44

### `%duplicate-schema-name`

A **Nock Assembly** program, not a Jock one — `nexpand` is the judgment, and `lib/nockasm` the language.

```nasm
:subject {.a .a}
(%self)
```

pinned by `t-rch-nx-schdup` · also `t-nx-schdup-n` (AST-level) · spec: docs/spec/nockasm-target.md N-39, docs/spec/nockasm-target.md N-40, docs/spec/nockasm.md N-13

### `%elab-arity`

```jock
struct BS<T> { v: T }; func f(b: BS) -> @ { 1 }; 1
```

pinned by `t-rch-el-arity` · also `t-elab-arity-n` (AST-level)

### `%elab-indiscriminable`

```jock
struct P { a: @, b: @ }; struct Q { c: @, d: @ }; func f(c: P | Q) -> @ { 1 }; 0
```

pinned by `t-err-elab-indiscrim-sig` · also `t-elab-union-n` (AST-level)

### `%elab-too-large`

```jock
alias A0 is @; alias A1 is (A0,A0); alias A2 is (A1,A1); alias A3 is (A2,A2); alias A4 is (A3,A3); alias A5 is (A4,A4); alias A6 is (A5,A5); alias A7 is (A6,A6); alias A8 is (A7,A7); alias A9 is (A8,A8); alias A10 is (A9,A9); alias A11 is (A10,A10); alias A12 is (A11,A11); alias A13 is (A12,A12); alias A14 is (A13,A13); alias A15 is (A14,A14); alias A16 is (A15,A15); alias A17 is (A16,A16); alias A18 is (A17,A17); alias A19 is (A18,A18); alias A20 is (A19,A19); alias A21 is (A20,A20); alias A22 is (A21,A21); alias A23 is (A22,A22); alias A24 is (A23,A23); let x: A24 = 1; 1
```

pinned by `t-elab-too-large`

### `%elab-trait-not-type`

```jock
trait G { g(self: Self) -> @; }; let x: @ = 1; x as! G
```

pinned by `t-rch-tr-type` · also `t-elab-trait-n` (AST-level)

### `%elab-unbound`

*module*

```jock
private struct Hidden { h: @ }; struct Shown { s: @ };
```

*program*

```jock
import m; let h: m.Hidden = m.Hidden( h: 1 ); h.h
```

pinned by `t-jimp-private-type`, `t-timp-type-unbound` · also `t-elab-unbound-err`, `t-elab-unbound-n` (AST-level) · spec: docs/imports.md I-5, docs/spec/runtime.md R-83

### `%elab-unimported`

```jock
import b; let p: a.P = b.getp(42); p.v
```

pinned by `t-jdag-layer-spell` · spec: docs/imports.md I-3

### `%export-private`

*module*

```jock
private struct Key { k: @ }; func mkKey(n: @) -> Key { Key( k: n ) };
```

*program*

```jock
import m; m.mkKey(3).k
```

pinned by `t-jimp-export-private`, `t-jimp-export-private-alias`, `t-jimp-export-private-field` · spec: docs/imports.md I-5, docs/spec/language.md L-21

### `%import-cycle`

```jock
import a; a.fa(1)
```

pinned by `t-jdag-cycle`

### `%import-unknown`

*module*

```jock
import bar; func f(n: @) -> @ { n };
```

*program*

```jock
import m; m.f(1)
```

pinned by `t-jimp-mimp` · spec: docs/imports.md I-6, docs/spec/language.md L-171

### `%in-module`

*module*

```jock
func f(n: @) -> @ { n + 1 };
let z = nosuchname;
```

*program*

```jock
import broke; broke.f(1)
```

pinned by `t-chkjm-coord`, `t-chkjm-parse`

### `%join-aura`

```jock
if 2 == 2 { 1 } else { 1.5 }
```

pinned by `t-err-join-if`, `t-err-join-list` · also `t-join-aura-chars-e`, `t-join-aura-loob-e`, `t-join-aura-real-e` (AST-level)

### `%join-fail`

```jock
let xs = [1, "a"]; xs
```

pinned by `t-dtags-list-join`, `t-rch-dtags-if`, `t-rch-join` · also `t-join-fail-n`, `t-join-ref-n`, `t-join-sub-miss-n`, `t-mint-join-err` (AST-level) · spec: docs/spec/chain.md C-48

### `%kernel-shape`

```jock
42
```

pinned by `t-kern-shape`

### `%kernel-trait`

```jock
struct KS { n: @ }; class Counter(KS) { load(self: Counter, old: *) -> Counter { old as! Counter }; peek(self: Counter, p: *) -> * { self.n }; poke(self: Counter, e: *) -> (List<*>, Counter) { (~, self) }; }; Counter( n: 0 )
```

pinned by `t-rch-kern-tr` · spec: docs/spec/runtime.md R-70

### `%let-shadows`

A **Nock Assembly** program, not a Jock one — `nexpand` is the judgment, and `lib/nockasm` the language.

```nasm
#let .a = (%const 1) in #let .a = (%const 2) in (%self)
```

pinned by `t-rch-nx-shadow` · also `t-nx-shadow-n` (AST-level)

### `%lex-comment-open`

```jock
/* x
```

pinned by `t-lex-blokop-n`

### `%lex-connective`

```jock
let a = true; let b = false; a && b
```

pinned by `t-hint-amp`, `t-hint-amp-mid`, `t-hint-bar` · spec: docs/spec/language.md L-91, docs/spec/language.md L-178

### `%lex-hex`

```jock
0x
```

pinned by `t-lex-hex-n`

### `%lex-interp-brace`

```jock
"} bad"
```

pinned by `t-err-interp-brace`

### `%lex-interp-open`

```jock
"{x
```

pinned by `t-err-interp-open`

### `%lex-interp-str`

```jock
"a{"b"}c"
```

pinned by `t-err-interp-str` · spec: docs/spec/language.md L-31

### `%lex-number`

```jock
1_
```

pinned by `t-lex-num-n`

### `%lex-quote-newline`

```jock
let s: String = "ab
cd"; s
```

pinned by `t-lex-quote-newline`

### `%lex-quote-open`

```jock
"open
```

pinned by `t-lex-strop-n`

### `%lex-real-prec`

```jock
3.12345678901234567
```

pinned by `t-lex-real-prec`

### `%lex-stray`

```jock
`
```

pinned by `t-lex-stray-n` · also `t-lex-uni-n` (AST-level)

### `%lex-string-escape`

```jock
"a\zzb"
```

pinned by `t-str-esc-bad`, `t-str-esc-short` · spec: docs/spec/language.md L-29

### `%lex-term`

```jock
%aB
```

pinned by `t-lex-term`

### `%lex-whitespace`

```jock
a	b
```

pinned by `t-lex-tab-n`

### `%match-duplicate-default`

A **Nock Assembly** program, not a Jock one — `nparse` is the judgment, and `lib/nockasm` the language.

```nasm
#match (%self) { _ => (%const 1) _ => (%const 2) }
```

pinned by `t-rch-nasm-mdup`

### `%match-needs-default`

A **Nock Assembly** program, not a Jock one — `nparse` is the judgment, and `lib/nockasm` the language.

```nasm
#match (%self) { 1 => (%const 2) }
```

pinned by `t-rch-nasm-mdef`

### `%mill-lambda`

```jock
let f: (@) -> @ = lambda () -> @ { 1 }; f(1)
```

pinned by `t-mill-lambda`

### `%mill-lambda-arity`

```jock
let f: (@) -> @ = lambda (x: @, y: @) -> @ { x }; f(1)
```

pinned by `t-mill-lambda-arity` · spec: docs/spec/language.md L-141

### `%mill-nest`

```jock
let u: UniChar = 0x1f600 as! UniChar; let b: Byte = u; b
```

pinned by `t-arc-unichar-narrow`, `t-err-class-gen-arg`, `t-err-map-annot-real`, `t-err-print-num`, `t-gen-rigid-arg`, `t-gen-rigid-unit`, `t-rigid-mcon`, `t-rigid-slit`, `t-roof-named-func`, `t-text-char-no`, `t-var-widen-shallow` · also `t-mint-annot`, `t-mint-cond`, `t-mint-guard`, `t-mint-inc-cell` (AST-level) · spec: docs/spec/language.md L-132, docs/spec/runtime.md R-102, docs/spec/runtime.md R-59

### `%mint-call`

```jock
1(2)
```

pinned by `t-rch-call` · also `t-mint-call-gate` (AST-level)

### `%mint-call-arity`

```jock
func f(a: @, b: @) -> @ { a }; f(1)
```

pinned by `t-rch-arity` · also `t-mint-call-arity`, `t-mint-import-arity` (AST-level) · spec: docs/spec/language.md L-171

### `%mint-call-bound`

```jock
func<T> f(x: T) -> T { g(x) }; func<T: Lt> g(x: T) -> T { x }; f(1)
```

pinned by `t-err-ggroup-unbound` · also `t-mint-gen-nobound` (AST-level)

### `%mint-case`

```jock
enum E { a }; E.b
```

pinned by `t-rch-case`

### `%mint-cast`

```jock
let n = 42; let b: Bool = n as Bool; b
```

pinned by `t-as-grd-bool`, `t-as-grd-char`, `t-err-chars-cast` · also `t-mint-cast` (AST-level) · spec: docs/spec/language.md L-24, docs/spec/language.md L-120, docs/spec/runtime.md R-44

### `%mint-cast-sealed`

*module*

```jock
struct CS { n: @ }; class Counter(CS) impl Add { add(self: Self, p: Self) -> Self { Counter( n: self.n + p.n ) }; bump(self: Self) -> Self { Counter( n: self.n + 1 ) }; twice(self: Self) -> Self { self.bump().bump() }; }; func mk(n: @) -> Counter { Counter( n: n ) }; 
```

*program*

```jock
import m; (5 as m.Counter).n
```

pinned by `t-jimp-seal-cast`, `t-jimp-seal-deep-arg`, `t-jimp-seal-deep-cast`, `t-jimp-seal-deep-soft`, `t-jimp-seal-soft`, `t-jimp-seal-test` · spec: docs/imports.md I-5

### `%mint-cast-sint`

```jock
struct SB { a: Int, k: @ }; let s = (5, 4) as SB; if s.a == -3 { 111 } else { 222 }
```

pinned by `t-cast-sint-deep`, `t-cast-sint-deep-nom`, `t-cast-sint-deep-nom-test`, `t-cast-sint-deep-soft`, `t-cast-sint-deep-test`, `t-cast-sint-deep-tuple`, `t-sint-cast`, `t-sint-castp`, `t-sint-castq`, `t-sint-castx` · spec: docs/imports.md I-5, docs/spec/language.md L-12, docs/spec/language.md L-127

### `%mint-ctor`

```jock
E.a(1)
```

pinned by `t-mint-ctor`

### `%mint-ctor-applied`

```jock
enum E { a(@) }; let f = E.a; 1
```

pinned by `t-text-ctor-applied` · also `t-mint-ctor-applied` (AST-level) · spec: docs/spec/language.md L-166

### `%mint-ctor-arity`

```jock
enum E { a(@) }; E.a()
```

pinned by `t-mint-ctor-arity` · spec: docs/spec/language.md L-165

### `%mint-ctor-nullary`

```jock
enum E { a }; E.a(1)
```

pinned by `t-mint-ctor-nullary` · spec: docs/spec/language.md L-165

### `%mint-ctor-tag`

```jock
enum E { a(@) }; E.b(1)
```

pinned by `t-mint-ctor-tag` · spec: docs/spec/language.md L-166

### `%mint-edit`

```jock
let a = 1; a.x = 2; a
```

pinned by `t-mint-edit`

### `%mint-edit-immutable`

```jock
let b = 1; b = 3; b
```

pinned by `t-let-no-edit` · also `t-mint-edit-let` (AST-level) · spec: docs/spec/language.md L-130

### `%mint-edit-sealed`

*module*

```jock
struct CS { n: @ }; class Counter(CS) impl Add { add(self: Self, p: Self) -> Self { Counter( n: self.n + p.n ) }; bump(self: Self) -> Self { Counter( n: self.n + 1 ) }; twice(self: Self) -> Self { self.bump().bump() }; }; func mk(n: @) -> Counter { Counter( n: n ) }; 
```

*program*

```jock
import m; var c = m.mk(1); c.n = 9; c.n
```

pinned by `t-jimp-seal-edit` · spec: docs/imports.md I-5

### `%mint-field`

```jock
struct S { x: @, y: @ }; trait T { dist(self: Self) -> @; } impl T for S { dist(self: Self) -> @ { self.x } } let v = S( x: 4, y: 5 ); let g = v.dist; 0
```

pinned by `t-dimb-meth-value`, `t-jimp-arm-value-deep`, `t-rch-field` · spec: docs/spec/language.md L-171

### `%mint-func-annot`

```jock
func f(a) -> @ { 1 }; f(1)
```

pinned by `t-mint-func-annot` · spec: docs/spec/language.md L-136

### `%mint-func-dup`

```jock
func f(a: @) -> @ { a }; func f(b: @) -> @ { b }; 1
```

pinned by `t-rch-fn-dup` · also `t-mint-grp-dup` (AST-level) · spec: docs/spec/language.md L-137

### `%mint-func-ret`

```jock
func f(a: @) { a }; 1
```

pinned by `t-rch-fn-ret` · also `t-mint-func-ret` (AST-level)

### `%mint-gen-unused`

```jock
func<T> bad(x: @) -> @ { x }; func<U> ok(x: U) -> U { x }; 0
```

pinned by `t-err-ggroup-unused` · also `t-mint-gen-unsolved` (AST-level)

### `%mint-impl-coh`

```jock
impl<T> Meas for List<T> { len(self: List<T>) -> @ { 0 }; }; 1
```

pinned by `t-mint-gimpl-coh` · also `t-mint-impl-coh` (AST-level)

### `%mint-impl-extra`

```jock
struct B { v: @ }; trait G { g(self: Self) -> @; }; impl G for B { g(self: B) -> @ { 1 }; h(self: B) -> @ { 2 }; }; 0
```

pinned by `t-rch-im-xtra` · also `t-mint-impl-extra` (AST-level)

### `%mint-impl-miss`

```jock
struct B { v: @ }; trait G { g(self: Self) -> @; }; impl G for B { }; 0
```

pinned by `t-rch-im-miss` · also `t-mint-impl-miss` (AST-level)

### `%mint-impl-orphan`

*module*

```jock
impl Show for @ { show(self: @) -> String { "x" } }; func noop(n: @) -> @ { n }; 
```

*program*

```jock
import m; 0
```

pinned by `t-jimp-orphan`

### `%mint-impl-shape`

```jock
impl<T> Str for List<(T, T)> { len(self: List<(T, T)>) -> @ { 0 }; cat(self: List<(T, T)>, t: String) -> String { t }; trip(self: List<(T, T)>) -> List<Byte> { t }; }; 1
```

pinned by `t-mint-gimpl-shape`

### `%mint-impl-sig`

```jock
struct B { v: @ }; trait G { g(self: Self) -> @; }; impl G for B { g(self: B) -> Bool { true }; }; 0
```

pinned by `t-rch-im-sig` · also `t-mint-impl-sig` (AST-level)

### `%mint-impl-targs`

```jock
trait G<A> { g(self: Self) -> A; }; struct S { v: @ }; class C(S) impl G { g(self: C) -> @ { 1 }; }; 0
```

pinned by `t-err-class-ptrait`, `t-err-targs-arity`

### `%mint-impl-trait`

```jock
struct P { x: @ }; impl Nope for P { }; 1
```

pinned by `t-mint-impl-trait`

### `%mint-import`

```jock
import my-lib; 1
```

pinned by `t-dtags-user-name`, `t-timp-absent` · also `t-mint-import-unknown` (AST-level) · spec: docs/imports.md I-6, docs/spec/language.md L-171

### `%mint-import-arm`

*module*

```jock
func dbl(n: @) -> @ { n + n };
```

*program*

```jock
import m; m.nope(1)
```

pinned by `t-jimp-absent`, `t-jimp-arm-value-absent`, `t-jimp-private-arm` · spec: docs/spec/language.md L-171

### `%mint-inexhaustive`

```jock
let o: @? = 5; match o { ~ => 0, }
```

pinned by `t-text-opt-no-cell`, `t-text-opt-no-null` · also `t-mint-match-inex`, `t-mint-witness` (AST-level)

### `%mint-inst`

```jock
struct BS<T> { v: @ }; BS( v: 1 )
```

pinned by `t-rch-inst` · also `t-mint-import-gen` (AST-level) · spec: docs/spec/language.md L-171

### `%mint-inst-annot`

```jock
enum E<T> { a }; E.a
```

pinned by `t-mint-inst-annot` · spec: docs/spec/language.md L-147

### `%mint-join`

```jock
if 1 == 1 { 1 } else { (1, 2) }
```

pinned by `t-rch-dtags-if`

### `%mint-lambda-annot`

```jock
let f = lambda (x) -> @ { x }; 1
```

pinned by `t-rch-lam` · also `t-mint-lam-annot` (AST-level)

### `%mint-limb`

```jock
nope
```

pinned by `t-chkj-refuse`, `t-chkjm-coord`, `t-dtags-one`, `t-repl-pos`, `t-text-grp-split-decl`, `t-text-grp-split-let` · also `t-mint-unbound` (AST-level) · spec: docs/spec/language.md L-139

### `%mint-list-join`

```jock
let xs = [1, "a"]; xs
```

pinned by `t-dtags-list-join`

### `%mint-meth-amb`

```jock
struct P { v: @ }; trait Ar { add(self: Self, o: Self) -> Self; }; impl Ar for P { add(self: P, o: P) -> P { P( v: 0 ) } }; impl Add for P { add(self: P, o: P) -> P { P( v: self.v + o.v ) } }; let a = P( v: 2 ); a.add(a).v
```

pinned by `t-op-amb-bare` · also `t-mint-meth-amb` (AST-level)

### `%mint-meth-annot`

```jock
struct S { x: @ }; class C(S) { m(self: C, a) -> @ { 1 }; }; 1
```

pinned by `t-mint-meth-annot`

### `%mint-meth-arity`

```jock
struct S { x: @ }; class C(S) { m(self: C) -> @ { 1 }; }; let c = C( x: 1 ); c.m(1, 2)
```

pinned by `t-mint-meth-arity`

### `%mint-meth-self`

```jock
struct S { x: @ }; class C(S) { m(self: @) -> @ { 1 }; }; let c = C( x: 1 ); c.m()
```

pinned by `t-mint-meth-self` · spec: docs/spec/language.md L-158

### `%mint-method`

```jock
struct S { x: @ }; let s = S( x: 1 ); s.nope()
```

pinned by `t-rch-meth`

### `%mint-mold`

```jock
let x: @ = 1; x as! Never
```

pinned by `t-rch-mold` · also `t-mint-asx-gate`, `t-mint-tt-gate` (AST-level) · spec: docs/spec/language.md L-124

### `%mint-naxis`

```jock
import chain; func f(m: chain.ZMap<@, @>) -> @ { m.< }; 1
```

pinned by `t-cimp-seal`, `t-lark-atom-n`, `t-lark-seal-n`, `t-naxis-seal-n`

### `%mint-op`

```jock
1.5 % 2.0
```

pinned by `t-err-op-rmod` · spec: docs/spec/language.md L-116

### `%mint-op-aura`

```jock
1 + 'a'
```

pinned by `t-err-op-aura-char`, `t-err-op-aura-real` · spec: docs/spec/language.md L-39, docs/spec/runtime.md R-51

### `%mint-op-impl`

```jock
struct P { v: @ }; let a = P( v: 1 ); let b = P( v: 2 ); let c = a + b; 0
```

pinned by `t-err-op-impl`, `t-err-op-impl-bool`, `t-err-op-impl-char` · spec: docs/spec/runtime.md R-51

### `%mint-patt`

```jock
enum E { a, b }; let s = E.a; match s { 7 => 1, _ => 0 }
```

pinned by `t-rch-patt` · also `t-mint-match-patt`, `t-mint-match-sing` (AST-level)

### `%mint-patt-bare`

```jock
enum C { red, green } let c = C.green; match c { red => 1, green => 2, }
```

pinned by `t-arc-patt-bare` · spec: docs/spec/language.md L-149

### `%mint-patt-tag`

```jock
enum E { a(@) }; let e = E.a(1); match e { .b(x) => x, _ => 0 }
```

pinned by `t-mint-patt-tag`

### `%mint-peek-arity`

```jock
peekUnder(1)
```

pinned by `t-mint-peek-arity`

### `%mint-recur`

```jock
var b: @ = 0; loop outer { if b == 3 { b } else { b = b + 1; recur inner } }
```

pinned by `t-loop-label-bad` · also `t-mint-recur-naked` (AST-level) · spec: docs/spec/language.md L-140, docs/spec/language.md L-153

### `%mint-slit`

*module*

```jock
private struct St { v: @ }; class C(St) { get(self: Self) -> @ { self.v } }; func mk(n: @) -> C { C( v: n ) }; 
```

*program*

```jock
import m; m.St( v: 9 ).v
```

pinned by `t-jimp-private-forge`

### `%mint-slit-cover`

```jock
struct Q { q: @, r: @ }; Q( q: 0 )
```

pinned by `t-rch-cover` · also `t-mint-slit-missing` (AST-level)

### `%mint-slit-missing`

```jock
struct Q { q: @ }; Q( r: 0 )
```

pinned by `t-slit-miss`

### `%mint-slit-sealed`

*module*

```jock
struct BS<T> { v: T }; class Box<T>(BS<T>) { get(self: Self) -> T { self.v } }; func mk(x: @) -> Box<@> { Box( v: x ) }; 
```

*program*

```jock
import m; m.Box( v: 6 ).get()
```

pinned by `t-jimp-class-gen-seal`, `t-jimp-seal-lit` · spec: docs/imports.md I-5

### `%mint-todo`

```jock
trait G<A> { g(self: Self) -> A; }; func<T: G> f(x: T) -> @ { 1 }; f(2)
```

pinned by `t-err-bound-ptrait`, `t-err-class-gen-bound`, `t-jdag-arm-generic-n`, `t-jimp-arm-gen`, `t-jimp-bound-qual-ptrait`, `t-mint-gimpl-bound` · spec: docs/spec/language.md L-171

### `%mint-unblessed`

*module*

```jock
func g() -> @ { 2 };
```

*program*

```jock
import evil; evil.g()
```

pinned by `t-halo-unblessed`

### `%mint-unblessed-abi`

*program*

```jock
1 + 41
```

pinned by `t-halo-abi-moved`

### `%mint-unblessed-scry`

*program*

```jock
peekContext(42)
```

pinned by `t-halo-scry-peek`, `t-halo-scry-try`, `t-halo-scry-under`

### `%mint-unimported`

```jock
import b; a.mkp(1).v
```

pinned by `t-jdag-unimported` · spec: docs/spec/language.md L-172

### `%mint-unreachable`

```jock
match 1 { _ => 0, 1 => 2 }
```

pinned by `t-rch-unrch` · also `t-mint-match-unreach` (AST-level)

### `%nock-payload-needs-two-elements`

A **Nock Assembly** program, not a Jock one — `nparse` is the judgment, and `lib/nockasm` the language.

```nasm
(%nock [1])
```

pinned by `t-rch-nasm-nock`

### `%parse-alias-is`

```jock
alias Foo @; let x: Foo = 1; x
```

pinned by `t-arc-alias-no-is`

### `%parse-axis-zero`

```jock
let p = (7, 9); p.+0
```

pinned by `t-naxis-zero-n`

### `%parse-block`

```jock
loop 5
```

pinned by `t-parse-block`

### `%parse-class`

```jock
struct S { x: @ }; class C { }; 1
```

pinned by `t-parse-class`

### `%parse-else`

```jock
if 1 == 1 { 2 }
```

pinned by `t-parse-noelse`

### `%parse-empty`

The program is **empty** — no characters at all. Not whitespace, and not a program whose value is `~`.

pinned by `t-parse-empty`, `t-rch-empty`

### `%parse-empty-brace`

```jock
let a = 1; { }
```

pinned by `t-parse-empty-brace` · spec: docs/spec/language.md L-85

### `%parse-enum-casing`

```jock
enum S { Point }; 1
```

pinned by `t-parse-casing` · spec: docs/spec/language.md L-163

### `%parse-eof`

```jock
not
```

pinned by `t-rch-eof`

### `%parse-eval`

```jock
eval 5
```

pinned by `t-parse-eval` · spec: docs/spec/language.md L-129

### `%parse-expected`

```jock
let a: @ = 3; match a { 1 => 0; _ => 84; }
```

pinned by `t-arc-arm-semi`, `t-arc-ctor-brace`, `t-chkjm-parse`, `t-eq-bind-raw`, `t-hint-index-q`, `t-index-gone-has`, `t-index-gone-slice`, `t-parse-match-nosep`, `t-parse-method-nosep` · spec: docs/spec/language.md L-84, docs/spec/language.md L-85

### `%parse-func-parens`

```jock
func f () -> @ { 1 }; f()
```

pinned by `t-parse-func-parens`

### `%parse-impl-for`

```jock
struct P { x: @ }; impl Show P { show(self: P) -> String { 1 as! String }; }; 1
```

pinned by `t-parse-impl-for`

### `%parse-interp`

```jock
let a = 1; "{a a}"
```

pinned by `t-parse-interp`

### `%parse-lambda`

```jock
lambda 5
```

pinned by `t-parse-lambda` · spec: docs/spec/language.md L-129

### `%parse-lark-cmp`

```jock
var p = (7, 9); p.>= 3; p
```

pinned by `t-lark-eq-glued`, `t-lark-eq-glued-lt` · spec: docs/spec/language.md L-105

### `%parse-method`

```jock
struct S { x: @ }; class C(S) { m () -> @ { 1 }; }; 1
```

pinned by `t-parse-method`

### `%parse-minus-glue`

```jock
let a = 5; a- 1
```

pinned by `t-minus-glued-l`, `t-minus-glued-r` · spec: docs/spec/language.md L-10, docs/spec/language.md L-109

### `%parse-name`

```jock
let 5 = 3; 5
```

pinned by `t-parse-name`

### `%parse-no-result`

```jock
let a = 1; let b = 2; let c = 3;
```

pinned by `t-parse-no-result`

### `%parse-nonassoc`

```jock
let s = Set<@>([1, 2]); if 1 in s in s { 7 } else { 9 }
```

pinned by `t-in-nonassoc`, `t-parse-nonassoc` · also `t-parse-subset-nonassoc`, `t-parse-supset-nonassoc` (AST-level) · spec: docs/spec/language.md L-108

### `%parse-not`

```jock
let a = true; !a
```

pinned by `t-hint-not`, `t-index-gone-pop`

### `%parse-or-face`

```jock
enum Shape { point, circle(r: Float64) }; 1
```

pinned by `t-parse-or-face` · spec: docs/spec/language.md L-165

### `%parse-path`

```jock
let p = /; p
```

pinned by `t-parse-path`

### `%parse-patt`

```jock
match 1 { , => 1; }
```

pinned by `t-parse-patt`

### `%parse-patt-as`

```jock
match 1 { as @ => 1, _ => 0 }
```

pinned by `t-parse-patt-as`

### `%parse-patt-bare`

```jock
enum E { circle(@) }; let e = E.circle(1); match e { circle(r) => r; _ => 0; }
```

pinned by `t-parse-patt-bare`

### `%parse-patt-case`

```jock
match 1 { . => 1; _ => 0; }
```

pinned by `t-parse-patt-case`

### `%parse-place`

```jock
struct T { z: @ }; func mt() -> T { T( z: 1 ) }; mt().z = 5; 0
```

pinned by `t-err-dot-place`, `t-err-slice-place` · spec: docs/spec/language.md L-114

### `%parse-print-pri`

```jock
let n = 2; print("x", n); 0
```

pinned by `t-err-print-pri-expr` · spec: docs/spec/language.md L-34

### `%parse-private`

```jock
private let x = 1; x
```

pinned by `t-err-private-let` · spec: docs/spec/language.md L-20

### `%parse-private-impl`

```jock
private impl Meas for @ { len(self: @) -> @ { 1 } }; 0
```

pinned by `t-err-private-impl` · spec: docs/spec/language.md L-20

### `%parse-set-ctor`

```jock
let s = Set<@> [1]; s
```

pinned by `t-parse-set-ctor`

### `%parse-stray`

```jock
let xs = [1]; xs[]
```

pinned by `t-index-gone-peek`, `t-index-gone-push` · spec: docs/spec/language.md L-10, docs/spec/language.md L-88

### `%parse-ternary`

```jock
true ? 1 : 2
```

pinned by `t-hint-ternary`, `t-hint-ternary-mid`

### `%parse-tex`

```jock
let x: 5 = 3; x
```

pinned by `t-parse-tex`

### `%parse-tex-qual`

```jock
import hoon; let x: hoon. = 1; x
```

pinned by `t-parse-tex-qual`

### `%parse-todo`

```jock
func fib(n: @) -> @ { if n == 0 { 1 } else { $(n - 1) } }; fib(3)
```

pinned by `t-recur-edits` · spec: docs/spec/language.md L-154

### `%parse-trailing`

```jock
union C { red, green } C.red
```

pinned by `t-arc-union-gone` · spec: docs/spec/language.md L-151, docs/spec/language.md L-174

### `%parse-trait-op`

```jock
trait Bad { go(~); }; 1
```

pinned by `t-trait-op-junk` · spec: docs/spec/language.md L-42

### `%parse-trait-sig`

```jock
trait T { m () -> @; }; 1
```

pinned by `t-parse-trait-sig`

### `%parse-type`

```jock
struct s { x: @ }; 1
```

pinned by `t-rch-ty-decl`, `t-rch-ty-impl` · also `t-parse-type-eof`, `t-parse-type-lower` (AST-level)

### `%parse-unglued`

```jock
f (3)
```

pinned by `t-parse-unglued` · spec: docs/spec/language.md L-85

### `%parse-var-patt`

```jock
var (a, b) = (1, 2); a
```

pinned by `t-parse-var-patt` · spec: docs/spec/language.md L-134

### `%raw-cell-needs-two-elements`

A **Nock Assembly** program, not a Jock one — `nparse` is the judgment, and `lib/nockasm` the language.

```nasm
[1]
```

pinned by `t-rch-nasm-cell`

### `%uint-neg`

```jock
import hoon; hoon.uint(-3)
```

pinned by `t-sint-uint-neg` · spec: docs/spec/language.md L-14, docs/spec/runtime.md R-15

### `%unbound-axis`

A **Nock Assembly** program, not a Jock one — `nexpand` is the judgment, and `lib/nockasm` the language.

```nasm
.z
```

pinned by `t-rch-nx-unbax` · also `t-nx-unbound-n` (AST-level)

### `%unknown-opcode`

A **Nock Assembly** program, not a Jock one — `nexpand` is the judgment, and `lib/nockasm` the language.

```nasm
(%zork)
```

pinned by `t-rch-nx-unkop` · also `t-nx-unkop-n` (AST-level)

## Tags no input can reach

36 refusals that no program, module or IR a user can write will raise. A guard the compiler holds against itself is not a missing test, and counting it as one invites a vector that pins nothing — so each is registered in `tests/hoon/run.hoon`’s `+unreach` table with the reason it is out of reach.

**The registry is checked, not asserted.** A registered tag that acquires a source-level vector reddens `t-unreach-registry`, because the recorded reason would have stopped being true. That is what lets this page subtract them from the gap list without taking anybody’s word for it. This section is read from that table; it is not written here.

### judgment-only — *the judgment has no caller in the compile path*

The arm implements a judgment `types.md` specifies, and the corpus calls it directly. Nothing in the compiler calls it, so no program can reach it.

| tag | why | pinned by |
|---|---|---|
| `%bunt-diverges` | the bunt judgment has no caller in the compile path | `t-bunt-fond-n` |
| `%bunt-empty-struct` | the bunt judgment has no caller in the compile path | `t-bunt-empty-struct` |
| `%bunt-trait` | the bunt judgment has no caller in the compile path | `t-bunt-trait` |
| `%bunt-unbound` | the bunt judgment has no caller in the compile path | `t-bunt-unbound` |
| `%bunt-var` | the bunt judgment has no caller in the compile path | `t-bunt-var-n` |
| `%bunt-void` | the bunt judgment has no caller in the compile path | `t-bunt-void-n` |
| `%embed-out` | the embed judgment is called only by the %agree oracle, harness-side | `t-embed-gate-n`, `t-embed-or-n`, `t-embed-ref-n`, `t-embed-sum-n`, `t-embed-var-n` |

### grammar — *the parser cannot build the shape*

The guard protects against an AST the grammar has no spelling for. Reaching it from source would mean the parser had a new form.

| tag | why | pinned by |
|---|---|---|
| `%desugar-snap` | %snap is the prelude checkpoint;  the parser has no spelling for it | — |
| `%empty-raw-cell` | the nasm raw-cell rule takes one or more elements, so an empty cell has no spelling | `t-nx-emptycell-n` |
| `%mint-axis` | +p-naxis and +p-lark only ever APPEND an %axis limb to an existing path (parse.hoon:639,647) or wrap a %dot over an expression, so a limb path never STARTS with one --- and +dimb reaches this branch only at k=0, the first segment.  An axis-headed path has no spelling:  bare `.+n` is %parse-stray, and `p.+99999` is %mint-naxis.  (The reason given here until 2026-10-28 was the prelude resolving every writable axis, which is unfalsifiable from source;  the grammar reason is checkable by reading one arm.) | `t-mint-axis` |
| `%mint-func-shape` | a func body is a %lambda by grammar | `t-mint-func-shape` |
| `%mint-meth-ret` | the method grammar requires `->` and a return type | `t-mint-meth-ret` |
| `%mint-meth-shape` | a method body is a %lambda by grammar | `t-mint-meth-shape` |
| `%mint-op-unary` | the %operator form always carries its second operand | `t-mint-op-unary` |
| `%mint-recur-arm` | recur edits refuse %parse-todo;  edits is always ~ | `t-mint-recur-arm` |
| `%mint-recur-limb` | recur edits refuse %parse-todo;  edits is always ~ | `t-mint-recur-limb` |
| `%mint-recur-outer` | recur edits refuse %parse-todo;  edits is always ~ | `t-mint-recur-outer` |
| `%sugar-index-place` | the put form takes a limb on its left by grammar | `t-des-put-place` |
| `%sugar-istring` | the parser lifts an istring jnoun to the %istring form;  one reaching desugar is a parser bug | `t-sugar-istring` |
| `%sugar-logic-arity` | the grammar supplies the second operand for and/or/xor and never one for not | `t-sugar-logic-arity` |
| `%sugar-op` | every operator the grammar admits in %operator position is in the desugar legal set | `t-des-op-bad` |
| `%sugar-op-unary` | the %operator form always carries its second operand | `t-des-op-unary` |
| `%sugar-todo` | both leaves are annotated collection literals, and the grammar has no spelling for annotating one | `t-sugar-todo` |

### upstream — *a different refusal always fires first*

The program that would reach this guard is rejected earlier, every time, so the message a reader actually gets is the other one.

| tag | why | pinned by |
|---|---|---|
| `%mint-patt-ambiguous` | +dish refuses an indiscriminable or-type AT DECLARATION, so by the time a pattern meets one at most one member fits;  the parser builds the shape fine, which is why this is upstream and not grammar | `t-mint-patt-ambiguous` |
| `%mint-slit-empty` | a fieldless struct refuses %decl-empty-struct at its declaration | `t-mint-slit-empty` |
| `%module-form` | THREE guard shapes, and the reason here described one.  (a) the bare form:  +jmod requires a module to END after a statement, so every violation is %parse-trailing first --- upstream, not an invariant.  (b) %private:  +p-private builds %private only over a %decl or %func and otherwise refuses %parse-private (parse.hoon:1370), so that leaf is unreachable by GRAMMAR.  (c) %if:  a coupling to +desugar %assert rather than a reachability fact, pinned by t-jimp-assert.  t-module-form pins only the dynamic default. | `t-module-form` |

### invariant — *the compiler against itself*

The pass that could violate the invariant is the pass that satisfies it. Two of these have mutation-verified tripwire vectors, which is the stronger treatment; these are the rest.

| tag | why | pinned by |
|---|---|---|
| `%habi-empty` | the curated battery is built from a non-empty arm list by the pass that then combs it | — |
| `%mint-cls-scope` | the class marker is pushed by the same pass that looks it up | `t-mint-cls-scope` |
| `%mint-dict-arm` | the synthetic arm name is written by +snam and read by the same pass | `t-mint-dict-arm` |
| `%mint-dict-scope` | the dictionary marker is pushed by the same pass that looks it up | `t-mint-dict-scope` |
| `%mint-grp-empty` | the closure battery is built from a non-empty member list by the pass that then combs it | `t-mint-grp-empty` |
| `%modl-synims-count` | a documented precondition:  +dimpls orders both lists and the caller keeps them in step | — |
| `%module-shape` | a module terminal is built by the +modl synthesis itself, which cannot build a non-cell for two names | `t-module-shape` |
| `%pfix-plug` | the prelude nasm spine is written by +pfix and read by +plug | — |
| `%pfix-snap` | the prelude nasm spine is written by +pfix and read by +psnap | — |

### clue — *reachable, but never the innermost tag*

The guard leaves a context clue around another arm’s refusal, so the innermost tag — the one `+dtag` reports and an `%err` row asserts — is always the other one. Where a chain judgment exists at that layer, the clue is pinned through it instead of appearing here.

| tag | why | pinned by |
|---|---|---|
| `%opcode` | an outer clue on the opcode dispatch;  the innermost tag is %unknown-opcode or an arity refusal | — |

## Compiler invariants with a tripwire

Stronger than a registry entry, and listed apart from it. No input reaches these either, but each has a vector that is green **only while the invariant holds** — so breaking the invariant reddens a named row rather than going unnoticed. Each pairing was verified by mutation, once, by hand, and is recorded at the guard and at the row. `run.hoon` refuses the whole run if one of these vectors disappears.

| tag | tripwire vector |
|---|---|
| `%mint-meth-fore` | `t-meth-fore-tripwire` |
| `%module-type` | `t-module-type-tripwire` |

## Tags pinned by nothing

Reachable, and no vector asserts them: 2 of 202. Simultaneously a documentation gap — there is no verified explanation to emit — and a test gap. Listed rather than dropped, so the gap is visible.

**`%impl-conflict`** — Two libraries supplying different impl facts for one (trait, head) pair. Not reached from any spelling tried: two modules each declaring their own trait do not collide, because a module’s trait is its own, and the single-module spelling refuses `%mint-impl-coh` first. Probed, not inferred.

**`%op-conflict`** — The operator half of the same shape — two libraries binding one operator to different (trait, method) pairs. Same reason it is still open, and it will probably fall to the same vector as `%impl-conflict`.

## Families

Five tags discriminate on a *second* element, so the thing to search for is the pair. Every one is an "unsupported thing" family, which is exactly where the compiler must say which.

- `%mint-mold` · `%deep` `%gate` `%var` `%void` — plus 4 computed leaf site(s), not enumerable from source
- `%mint-todo` · `%bound-ptrait` `%class-bound` `%export-class-ptrait` `%func-gen` `%impl-bound` `%impl-head` `%import-arm-gen` `%list-annot` `%trait-bound` — plus 1 computed leaf site(s), not enumerable from source
- `%module-form` · `%if` `%private` — plus 10 computed leaf site(s), not enumerable from source
- `%parse-todo` · `%defer` `%recur-edits`
- `%sugar-todo` · `%list-annot` `%map-annot`
