# Worked examples

38 complete Jock programs, each with the value it produces. `tools/examples.sh` compiles and runs every one under NockVM on every push, so none of them can silently rot.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` in the compiler repo writes this page.
>
> channel `%rc` · commit `a1f9572` (sigilante/pre-rc-sweep) · corpus 1154 vectors · 2026-10-30

The descriptions are the authors’ own header comments, not written here: `examples/README.md` calls each example "executable documentation — the header comments are the prose, and a `// expect: <noun>` trailer pins the program’s value". 8 of them are **kernels**, carrying `// kernel: N` — built, poked N times, then peeked.

Ordering is by **size**, shortest first. That is a proxy a reader can check, not a difficulty grading, which would be a judgement this page has no basis to make.

|  | count |
|---|---:|
| worked examples | 38 |
| …with a pinned value | 38 |
| …that are kernels | 8 |
| …shown in full on this page | 14 |
| total lines of Jock | 2917 |

## Every example

| Example | Lines | Value | What it is |
|---|---:|---|---|
| `counter` | 13 | `3` | **kernel (3 pokes).** The zero-ceremony counter kernel (runtime.md sections 5 and 8). The program ends at its initial state; the compiler finds the class, checks impl Kerne |
| `counter-v2` | 14 | `[2 102]` | **kernel (2 pokes).** The upgrade target: a NEW state shape whose load MIGRATES the old kernel's exported state (a bare atom) into it. Boot fresh, slam load (axis 4) with t |
| `cons` | 15 | `[3 2 1 0]` | cons.jock — the prelude's list constructor. |
| `hof` | 23 | `72` | hof.jock — higher-order functions from lib/hof. |
| `peektry` | 24 | `[42 7 9]` | peekTry(roof, path): the GRACEFUL namespace read --- the .^-vs-peekTry partner.  peekUnder reads a value and crashes on a bad read (like .^);  peekTry |
| `point` | 26 | `.~143.0` | point.jock — the operator-trait user story. |
| `patp` | 28 | `[1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1]` | @p ship names (lib/urbit), both directions, the whole rank ladder — the +po syllable tables and the +ob Feistel (and its inverse) translated to Jock,  |
| `collections` | 29 | `601` | collections.jock — Map and Set. |
| `errol` | 30 | `'3.14 0.1 100.0 1e+23 1.7976931348623157e+308 5e-324 -0.0 0.3333333333333333'` | errol.jock --- Float64 rendering, end to end. |
| `scry` | 30 | `[1 1 1]` | peekUnder(roof, path): read a path under an in-code roof --- the mink-based namespace primitive (pure-Urbit, no gall).  peekUnder installs the roof, e |
| `sort` | 30 | `[1 2 3 5 8 9 0]` | sort.jock — generic insertion sort: bounded generics meet operator traits. |
| `strings` | 31 | `'hello, world (12 bytes) - top suit hearts, a < b true'` | strings.jock — text: concatenation, methods, interpolation. |
| `twoc` | 31 | `16.235.262` | twoc.jock — two's-complement arithmetic at a chosen bit width. |
| `tap` | 33 | `616` | tap.jock |
| `sort-imported` | 41 | `'1/3|1/2|2/3|3/4|'` | sort-imported.jock --- the sort of sort.jock, over a type this program did not declare. |
| `roof` | 44 | `[1 1 1 1]` | Roof — the namespace-answering protocol, the read-only analogue of Kernel.  A class `impl Roof` carries served state plus an `answer` arm;  peekUnder( |
| `stoplight` | 45 | `%green` | **kernel (4 pokes).** stoplight.jock — a state-machine kernel. |
| `molds` | 50 | `'atom 42, byte A, rejected x, cmd op 3, kind 2'` | molds.jock — checking foreign nouns: as?, as!, and guards. |
| `parser` | 53 | `'1234|abc|x|2'` | parser.jock---using the parser combinator library. |
| `webserver` | 54 | `0` | **kernel (2 pokes).** webserver.jock — a NockApp that serves HTTP, on lib/http. |
| `interval` | 60 | `'[5/2, 4]|[1, 3]|[1/2, 3]|1/2|yes|[0, 1]'` | interval.jock — modules that STACK. |
| `rational-arms` | 64 | `19` | rational-arms.jock |
| `http-counter` | 68 | `0` | **kernel (2 pokes).** http-counter.jock — a NockApp whose counter PERSISTS across restarts, ported from nockd's examples/http-counter. |
| `parser-combinators` | 70 | `'aaa|ab|<x>|x|123|Q7 |zz|ok|9|2|a b|~'` | parser-combinators.jock --- coverage for lib/parser.jock. |
| `matmul` | 74 | `[[58 64 0] [139 154 0] 0]` | matmul.jock — matrix multiplication over unsigned integers. |
| `twoc-arms` | 77 | `29` | twoc-arms.jock |
| `units` | 77 | `.~24.0` | units.jock — dimensioned quantities: magnitude and dimension. |
| `hof-arms` | 79 | `18` | hof-arms.jock |
| `interval-arms` | 80 | `23` | interval-arms.jock |
| `generic-class` | 84 | `14` | generic-class.jock |
| `rand-arms` | 90 | `11` | rand-arms.jock |
| `parser-arms` | 100 | `33` | parser-arms.jock |
| `watcher` | 121 | `[2 2 1 1]` | Chain watcher — the TWO-MAP STORE (chain.md §6.1's state shape, unblocked by %mold-gen: class state can hold containers, so load's `old as! Watch` mol |
| `string-views` | 126 | `45` | string-views.jock |
| `poker` | 167 | `%first` | poker.jock — score and compare two 5-card poker hands. |
| `conway` | 237 | `0` | **kernel (2 pokes).** conway.jock — Life on a bounded 25x25 grid. Ported from nockd's examples/conway. |
| `minesweeper` | 335 | `0` | **kernel (2 pokes).** minesweeper.jock — 9x9, 10 mines, all game logic in the kernel. Ported from nockd's examples/minesweeper. |
| `wordle` | 364 | `0` | **kernel (2 pokes).** wordle.jock — six guesses at a five-letter word. Ported from nockd's examples/wordle. |

## The short ones, in full

Every example of 40 lines or fewer, verbatim. The 24 longer ones are listed in the table on this page with their values; their sources live in `examples/` in the compiler repo.

### `counter`

The zero-ceremony counter kernel (runtime.md sections 5 and 8). The program ends at its initial state; the compiler finds the class, checks impl Kernel<nockapp.Effect>, and synthesizes the kernel quad.

```jock
// The zero-ceremony counter kernel (runtime.md sections 5 and 8).
// The program ends at its initial state; the compiler finds the
// class, checks impl Kernel<nockapp.Effect>, and synthesizes the kernel quad.
// kernel: 3
// expect: 3
import nockapp;
struct KS { n: @ };
class Counter(KS) impl Kernel<nockapp.Effect> {
  load(self: Counter, old: *) -> Counter { old as! Counter };
  peek(self: Counter, p: *) -> * { self.n };
  poke(self: Counter, e: *) -> (List<nockapp.Effect>, Counter) { (~, Counter( n: self.n + 1 )) };
};
Counter( n: 0 )
```

value `3` · kernel, 3 pokes · imports `nockapp` · run by `tools/examples.sh`

### `counter-v2`

The upgrade target: a NEW state shape whose load MIGRATES the old kernel's exported state (a bare atom) into it. Boot fresh, slam load (axis 4) with the old state, and the serf Import flow carries the counter across the shape change.

```jock
// The upgrade target: a NEW state shape whose load MIGRATES the
// old kernel's exported state (a bare atom) into it. Boot fresh,
// slam load (axis 4) with the old state, and the serf Import
// flow carries the counter across the shape change.
// kernel: 2
// expect: [2 102]
import nockapp;
struct KS2 { n: @, total: @ };
class CounterV2(KS2) impl Kernel<nockapp.Effect> {
  load(self: CounterV2, old: *) -> CounterV2 { CounterV2( n: old as! @, total: 100 ) };
  peek(self: CounterV2, p: *) -> * { (self.n, self.total) };
  poke(self: CounterV2, e: *) -> (List<nockapp.Effect>, CounterV2) { (~, CounterV2( n: self.n + 1, total: self.total + 1 )) };
};
CounterV2( n: 0, total: 100 )
```

value `[2 102]` · kernel, 2 pokes · imports `nockapp` · run by `tools/examples.sh`

### `cons`

cons.jock — the prelude's list constructor.

```jock
// cons.jock — the prelude's list constructor.
//
// `cons(x, xs)` prepends, TYPED as List<T>. Naming the prepend is
// what makes a recursive list BUILDER type-check with no per-program
// helper: the step arm `cons(n, countdown(n - 1))` is a list VALUE
// (cons returns List<T>), so join J0 merges it with the `~` base arm
// — two arms that are otherwise a %sing-null and a %cell, which the
// lattice join alone refuses. Peer to the prelude's at/put/len.
//
// Language features: prelude generic cons, recursion, if/match join.
// expect: [3 2 1 0]
func countdown(n: @) -> List<@> {
  if n == 0 { ~ } else { cons(n, countdown(n - 1)) }
};
countdown(3)
```

value `[3 2 1 0]` · run by `tools/examples.sh`

### `hof`

hof.jock — higher-order functions from lib/hof.

```jock
// hof.jock — higher-order functions from lib/hof.
//
// The three shapes of a function value, in one pipeline.
// `bind1` partially applies a two-argument func, keeping the
// first argument in the closure. `pipe` composes two one-
// argument functions in reading order. `turn` and `foldl` then
// take the composed closure as an ordinary value — which is the
// point: a function in Jock is a noun, so it binds to a `let`
// and passes as an argument with no special form.
//
// add10 is (@) -> @, f is add10 then dbl, so the list maps to
// 22, 24, 26 and the left fold sums it.
//
// Language features: function types (A -> B), closures as
// values, partial application, composition, generic HOFs over
// List, module import.
// expect: 72
import hof;
func add(x: @, y: @) -> @ { x + y };
func dbl(x: @) -> @ { x * 2 };
let add10 = hof.bind1(add, 10);
let f = hof.pipe(add10, dbl);
hof.foldl(0, hof.turn([1, 2, 3], f), add)
```

value `72` · imports `hof` · run by `tools/examples.sh`

### `peektry`

peekTry(roof, path): the GRACEFUL namespace read --- the .^-vs-peekTry partner.  peekUnder reads a value and crashes on a bad read (like .^);  peekTry VIRTUALIZES the scry (mock, not mink), so a roof that crashes or a scry that blocks comes back as `none` instead of bringing the caller down.  The result is a unit --- exactly the option `as?` produces --- so `??` (default) and `match` consume it, and the some-payload molds out with as?/as! just like peekUnder's bare answer.

```jock
// peekTry(roof, path): the GRACEFUL namespace read --- the
// .^-vs-peekTry partner.  peekUnder reads a value and crashes on a
// bad read (like .^);  peekTry VIRTUALIZES the scry (mock, not
// mink), so a roof that crashes or a scry that blocks comes back as
// `none` instead of bringing the caller down.  The result is a unit
// --- exactly the option `as?` produces --- so `??` (default) and
// `match` consume it, and the some-payload molds out with as?/as!
// just like peekUnder's bare answer.
//
// Three reads prove the arms.  A roof that answers 42 yields
// some(42) (the ?? default is untaken);  a roof that CRASHES yields
// none (the default, 7, stands in);  and a roof that reports
// absence --- some(none), spelled `~ as? *?` --- yields none too,
// so the default 9 stands in.
//
// Those last two are the same outcome on purpose.  peekTry's
// contract is "a value, or nothing you can use", and a roof that
// crashed and a path that holds nothing are both nothing you can
// use.  A caller that must tell them apart wants peekUnder, which
// crashes on the first and traces on the second.
// expect: [42 7 9]
(peekTry(lambda (r: *, p: *) -> * { 42 }, 0) ?? 0,
 peekTry(lambda (r: *, p: *) -> * { crash }, 0) ?? 7,
 peekTry(lambda (r: *, p: *) -> *?? { ~ as? *? }, 0) ?? 9)
```

value `[42 7 9]` · run by `tools/examples.sh`

### `point`

point.jock — the operator-trait user story.

```jock
// point.jock — the operator-trait user story.
//
// A sealed class over a struct state, conforming to the prelude's
// Add and Sub operator traits: `p + q` dispatches through class
// conformance, while the `self.x + p.x` INSIDE the methods
// dispatches through the prelude's Add(Float64) impl — one
// mechanism, two levels. Note the field types are Float64 (@rd):
// integer literals will not cross into Float64 fields (no silent
// coercion), so coordinates are spelled 101.0, not 101.
//
// Language features: classes, sealed state, operator traits,
// Float64 literals and arithmetic, method-body Self, postfix . on
// an expression ((p + q).x binds the sum once, then reads x).
// expect: .~143.0
struct PointState { x: Float64, y: Float64 };
class Point(PointState) impl Add, Sub {
  add(self: Self, p: Self) -> Self {
    Point( x: self.x + p.x, y: self.y + p.y )
  };
  sub(self: Self, p: Self) -> Self {
    Point( x: self.x - p.x, y: self.y - p.y )
  };
};
let p = Point( x: 101.0, y: 105.0 );
let q = Point( x: 42.0, y: 7.0 );
(p + q).x
```

value `.~143.0` · run by `tools/examples.sh`

### `patp`

@p ship names (lib/urbit), both directions, the whole rank ladder — the +po syllable tables and the +ob Feistel (and its inverse) translated to Jock, verified against hoon (scot %p / slaw %p). === is raw identity, so topatp's String compares to the literal ~name directly;  frompatp's atom compares with ==. galaxy (<256, suffix)         ~zod ~nec ~fes star   (<2^16, prefix+suffix) ~marzod ~fipfes ~laszod planet (<2^32, obfuscated)    ~dapnep-ronmyl ~biltyc-mitfyl ... moon   (<2^64)                ~doznec-dozzod-dozzod ... comet  (>=2^64, group of 4)   ~doznec--dozzod-... The three lanes: render (chk), round-trip (rt: parse . render = id), and a direct parse of each literal name back to its atom (fp).

```jock
// @p ship names (lib/urbit), both directions, the whole rank ladder
// — the +po syllable tables and the +ob Feistel (and its inverse)
// translated to Jock, verified against hoon (scot %p / slaw %p).
// === is raw identity, so topatp's String compares to the literal
// ~name directly;  frompatp's atom compares with ==.
//   galaxy (<256, suffix)         ~zod ~nec ~fes
//   star   (<2^16, prefix+suffix) ~marzod ~fipfes ~laszod
//   planet (<2^32, obfuscated)    ~dapnep-ronmyl ~biltyc-mitfyl ...
//   moon   (<2^64)                ~doznec-dozzod-dozzod ...
//   comet  (>=2^64, group of 4)   ~doznec--dozzod-...
// The three lanes: render (chk), round-trip (rt: parse . render = id),
// and a direct parse of each literal name back to its atom (fp).
// expect: [1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1]
import urbit;
func chk(n: @, want: String) -> @ { if urbit.topatp(n) === want { 1 } else { 0 } };
func rt(n: @) -> @ { if urbit.frompatp(urbit.topatp(n)) == n { 1 } else { 0 } };
func fp(name: String, n: @) -> @ { if urbit.frompatp(name) == n { 1 } else { 0 } };
(chk(0, "~zod"), chk(1, "~nec"), chk(255, "~fes"),
 chk(256, "~marzod"), chk(65535, "~fipfes"), chk(32768, "~laszod"),
 chk(65536, "~dapnep-ronmyl"), chk(65537, "~milrys-soglec"),
 chk(3735928559, "~biltyc-mitfyl"), chk(4294967295, "~dostec-risfen"),
 chk(4294967296, "~doznec-dozzod-dozzod"), chk(109951162777, "~dozput-bidmev-nalrev"),
 chk(18446744073709551616, "~doznec--dozzod-dozzod-dozzod-dozzod"),
 rt(0), rt(1), rt(255), rt(256), rt(65535), rt(32768),
 rt(65536), rt(65537), rt(3735928559), rt(4294967295),
 rt(4294967296), rt(109951162777), rt(18446744073709551616),
 fp("~zod", 0), fp("~fes", 255), fp("~marzod", 256),
 fp("~dapnep-ronmyl", 65536), fp("~doznec--dozzod-dozzod-dozzod-dozzod", 18446744073709551616))
```

value `[1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1]` · imports `urbit` · run by `tools/examples.sh`

### `collections`

collections.jock — Map and Set.

```jock
// collections.jock — Map and Set.
//
// Map<K->V> and Set<T> are boot-registered data nominals over
// hoon's treap shapes, so the nouns are exactly what a hoon
// map/set is — the operations are curated wrappers over the
// kernel's own +by/+in doors, which means the balance logic
// (and its jets) is inherited rather than reimplemented.
//
// Reading is per-head method dispatch: m[k] goes through the
// prelude's Idx<K, V?> impl for Map, so it answers a UNIT —
// hence the ?? coalesce. Writing needs a var place: m[k] = v
// rewrites to an edit through Put.
//
// Language features: map literals and the Set constructor,
// annotated collection bindings, index sugar (get and put),
// coalesce, forall-signed imports (shas instantiates at Set<@>).
//
// The brackets carry both list and map: [1, 2] is a List and
// [1 -> 100] a Map, told apart by the arrow that the type also
// writes. A Set is constructed rather than spelled, Set<@>([…]),
// because braces are blocks now and {1, 2} could not say whether
// it meant a set or a block with a stray comma.
// expect: 601
var m: Map<@->@> = [1 -> 100, 2 -> 200];
m[3] = 300;
let s = Set<@>([5, 9]);
let total = (m[1] ?? 0) + (m[2] ?? 0) + (m[3] ?? 0);
let bonus = if hoon.shas(s, 5) { 1 } else { 0 };
total + bonus
```

value `601` · run by `tools/examples.sh`

### `errol`

errol.jock --- Float64 rendering, end to end.

```jock
// errol.jock --- Float64 rendering, end to end.
//
// Every value below goes through `.show()`, which reaches the
// prelude's Errol3 implementation --- shortest, correctly-rounded,
// and COMPLETE:  every double round-trips through its rendering and
// no shorter decimal does, with no fallback path.
//
// Andrysco, Jhala and Lerner, POPL 2016, transcribed from
// marcandrysco/Errol lib/errol.c.  Findings, including the two places
// this deliberately departs from upstream, are in docs/record/errol.md.
//
// One value from each interesting corner:  a plain decimal, the
// double-double path, the fixed path, the CORRECTED carry (upstream
// Errol prints 1e23 as the empty string), an exception-table entry
// that also defeats fpnext, the smallest subnormal, signed zero, and
// a seventeen-digit shortest form.
//
// Language features: Show over Float64, string interpolation reaching a
// prelude impl, hex-literal bit patterns cast to Float64.
// expect: '3.14 0.1 100.0 1e+23 1.7976931348623157e+308 5e-324 -0.0 0.3333333333333333'
let plain: Float64 = 3.14;
let dbldbl: Float64 = 0.1;
let fixed: Float64 = 100.0;
let carry = 0x44b5_2d02_c7e1_4af6 as Float64;
let maxdbl = 0x7fef_ffff_ffff_ffff as Float64;
let subnorm = 0x0000_0000_0000_0001 as Float64;
let negzero = 0x8000_0000_0000_0000 as Float64;
let third = hoon.rdiv(1.0, 3.0);

"{plain} {dbldbl} {fixed} {carry} {maxdbl} {subnorm} {negzero} {third}"
```

value `'3.14 0.1 100.0 1e+23 1.7976931348623157e+308 5e-324 -0.0 0.3333333333333333'` · run by `tools/examples.sh`

### `scry`

peekUnder(roof, path): read a path under an in-code roof --- the mink-based namespace primitive (pure-Urbit, no gall).  peekUnder installs the roof, emits the scry (Nock 12), and returns the answer; consume with as!/as? (the .^-vs-peekTry partner).

```jock
// peekUnder(roof, path): read a path under an in-code roof --- the
// mink-based namespace primitive (pure-Urbit, no gall).  peekUnder
// installs the roof, emits the scry (Nock 12), and returns the
// answer; consume with as!/as? (the .^-vs-peekTry partner).
//
// A roof answers `*??`, mink's own contract, so it can say all
// three things a namespace has to say:
//
//     some(some(v))   here is the value
//     some(none)      there is NO VALUE at this path
//     none            block --- escapes the jet today (R-29)
//
// `as?` is the some-idiom, so `(42 as? @) as? @?` is some(some(42))
// and `~ as? *?` is some(none).
//
// A bare `lambda (r, p) -> * { v }` is ALSO accepted, and answers
// v: its body is checked against the contract and optional
// injection lifts it twice.  Convenient, and the reason absence was
// unsayable until 2026-10-29 --- a lifted body can only ever
// answer.  Prefer the explicit shape;  the lifted one is shown in
// the second row below so both are exercised.
//
// Three roofs prove the roof is consulted and that both spellings
// work --- all pure Jock, the caller supplies the namespace in-line.
// expect: [1 1 1]
(if peekUnder(lambda (r: *, p: *) -> *?? { (42 as? @) as? @? }, 0) === 42 { 1 } else { 0 },
 // the lifted spelling, answering a bare value
 if peekUnder(lambda (r: *, p: *) -> * { 99 }, 0) === 99 { 1 } else { 0 },
 // absence reaches peekTry as none, so the ?? default stands in
 if (peekTry(lambda (r: *, p: *) -> *?? { ~ as? *? }, 0) ?? 7) === 7 { 1 } else { 0 })
```

value `[1 1 1]` · run by `tools/examples.sh`

### `sort`

sort.jock — generic insertion sort: bounded generics meet operator traits.

```jock
// sort.jock — generic insertion sort: bounded generics meet
// operator traits.
//
// `func<T: Lt>` bounds the element type by the Lt operator
// trait, so `x < h` inside the generic body dispatches through
// the bound's dictionary — the same `<` that is a direct kernel
// arm on concrete atoms becomes a trait call on a type variable.
// Instantiating at @ works because the prelude carries an
// explicit Lt(@) impl for exactly this purpose (direct `1 < 2`
// never consults it; bounded generics do).
//
// Language features: bounded generics, operator traits as
// bounds, recursion, list literals, match on list shape.
// The two funcs are ADJACENT, so they form a mutual-recursion
// group — generic groups instantiate sibling calls through the
// ordinary generic-call path.
// expect: [1 2 3 5 8 9 0]
func<T: Lt> insert(x: T, xs: List<T>) -> List<T> {
  match xs {
    (h, t) => if x < h { (x, xs) } else { (h, insert(x, t)) },
    _ => [x],
  }
};
func<T: Lt> isort(xs: List<T>) -> List<T> {
  match xs {
    (h, t) => insert(h, isort(t)),
    _ => ~,
  }
};
isort([5, 3, 8, 1, 9, 2])
```

value `[1 2 3 5 8 9 0]` · run by `tools/examples.sh`

### `strings`

strings.jock — text: concatenation, methods, interpolation.

```jock
// strings.jock — text: concatenation, methods, interpolation.
//
// A String is a data nominal over the UTF-8 cord, so its
// erasure IS the cord — text costs nothing at runtime. The +
// operator concatenates through the prelude's Add(String) impl
// (the numeric aura family owns the pinned arithmetic column;
// every other head dispatches through traits, which is exactly
// how + gets a second meaning without ambiguity).
//
// Interpolation renders each {expr} through the Show trait, so
// user types join in by implementing it — here Show(Suit) makes
// a union render as text.
//
// Language features: String concat, method calls, interpolation,
// Show impls on a user union, Byte comparison.
// expect: 'hello, world (12 bytes) - top suit hearts, a < b true'
enum Suit { hearts, spades };
impl Show for Suit {
  show(self: Suit) -> String {
    match self {
      .hearts => "hearts",
      .spades => "spades",
    }
  };
};
let name = "world";
let greeting = "hello, " + name;
let n = greeting.len();
let top = Suit.hearts;
let cmp = 'a' < 'b';
"{greeting} ({n} bytes) - top suit {top}, a < b {cmp}"
```

value `'hello, world (12 bytes) - top suit hearts, a < b true'` · run by `tools/examples.sh`

### `twoc`

twoc.jock — two's-complement arithmetic at a chosen bit width.

```jock
// twoc.jock — two's-complement arithmetic at a chosen bit width.
//
// lib/twoc carries the width in a sealed class, so `t` below IS
// eight-bit arithmetic and no call has to repeat the width. The
// values are ordinary Nats holding the low w bits, with the sign
// in bit w-1 — not Jock's ZigZag `Int`, which is why crossing
// between them goes through fromInt/toInt rather than a cast.
//
// Everything wraps. That is the point of the library rather than a
// limitation of it: this is what hardware does, and a checked type
// is a different library.
//
// Language features: sealed classes with state, methods, module
// import, the pinned bit arms (lsh/rsh/end/con/mix), Int literals.
// expect: 16.235.262
import twoc;

let t = twoc.w8();

let a = t.fromInt(-14);        // 242 — the sign is bit 7, nothing else
let b = t.fromInt(+5);         // 5

let s = t.add(a, b);           // -9  = 247
let p = t.mul(a, b);           // -70 = 186
let q = t.div(a, b);           // -2  = 254, truncating toward zero

// the sign-aware order: -14 is below +5, though 242 > 5 unsigned
assert t.lth(a, b);

// pack the three bytes into one atom so the lane can pin them
hoon.con(hoon.lsh(16, s), hoon.con(hoon.lsh(8, p), q))
```

value `16.235.262` · imports `twoc` · run by `tools/examples.sh`

### `tap`

tap.jock

```jock
  //  tap.jock
////
//    walking a Map and a Set
//
// mtap/stap are the arms that make a treap FOLDABLE. Before them a
// Map could be built and queried but never walked, so every
// aggregate over one had to be threaded by hand through the keys.
// With them `m.tap()` hands an ordinary List to lib/hof and the
// fold applies.
//
// The prelude spells both through one parameterized trait,
// `Tap<A>`, over two honest item types: a map's item is a [key
// value] pair, a set's is the element.
//
// ORDER IS THE TREAP'S — mug order — and NOT sorted by key. It is
// deterministic for a language version and carries no other
// meaning, so sort the product if you need an order. Summing is
// order-independent, which is why this example sums.
//
// Language features: parameterized traits, method dispatch per
// receiver head, treap traversal, higher-order functions over the
// product, lark tail access (`p.>`).
// expect: 616
import hof;

func val(p: (@, @)) -> @ { p.> };
func add(a: @, b: @) -> @ { a + b };

let m: Map<@->@> = [1 -> 100, 2 -> 200, 3 -> 300];
let s = Set<@>([5, 9, 2]);

//  600 from the map's values, 16 from the set's members
add(hof.foldl(0, hof.turn(m.tap(), val), add), hof.foldl(0, s.tap(), add))
```

value `616` · imports `hof` · run by `tools/examples.sh`

## What this page leaves out

7 programs in `examples/` are not listed above. Each reaches the nockchain line — the `chain` package or one of the modules [the library page](/reference/stdlib/) names as undocumented — and that line is off the site for the reason given there: its interface is half of a contract with a driver this project does not own.

| program | lines | imports |
|---|---:|---|
| `chainkey-arms` | 56 | `chainkey` |
| `chainwatcher` | 59 | `chain`, `nockapp` |
| `chaintx-arms` | 68 | `chain`, `chaintx` |
| `chainrand-arms` | 74 | `chain`, `chainrand` |
| `txbuild` | 83 | `chain` |
| `chainkernel` | 127 | `chain`, `nockapp` |
| `walletkernel` | 740 | `chain`, `chainkey`, `chaintx`, `nockapp`, `wallet` |

They are NOT excluded from the lane. `tools/examples.sh` compiles and runs all 45 programs on every push, these included, which is what keeps the chain modules compiling. The boundary here is what the site documents, not what the repo tests.
