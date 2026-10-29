# lib/http

the NockApp http driver, from the Jock side.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` writes this from `crates/jockc/hoon/lib/http.jock` and the examples that import it.
>
> 22 public declarations — 3 types, 19 arms. 13 pinned by a lane, 9 not. channel `%rc` · commit `dda291b`

## Import

A module arrives by name and nothing in it is ambient. Every arm below is reached as `http.<name>`.

```jock
import http;
```

The name is the file name minus `.jock`: `http` is `crates/jockc/hoon/lib/http.jock`, and it is found because the directory holding it was passed as a `--data-dir`. There is no search path and no implicit import; `tools/libs.py` holds the whole discovery rule, and the compiler itself is a pure function of source and libraries.

## About

The runtime owns the driver.  What a kernel owes it is a shape: requests arrive as [%req id uri method headers body] causes inside an ovum, and the kernel answers with Effect.res --- [%res id status headers body], the driver's own parse verbatim.  This module is that shape, once, so an app is routing and state rather than marshalling.

Ported from the Hoon side's lib/http.hoon, which every nockd example shares for exactly this reason. the driver's response effect, [%res id status headers body] --- its own parse verbatim (tuple payloads right-nest;  T? erasure is the unit;  Octs is hoon's).  Declared HERE because this is the module that owns the http driver's side of the wire;  it lived in the prelude until 2026-10-24 (runtime.md §8).

## Types

3 types. A type’s members ARE its interface, so each is shown whole rather than by name.

### `Effect`

```jock
enum Effect { res((@, @, List<Header>, Octs?)) };
```

No comment in the source. The signature above is the whole of what `Effect` states about itself.

*used by examples/conway.jock*

```jock
class Life(Board) impl Kernel<http.Effect> {
```

### `Ovum`

```jock
struct Ovum { num: Nat, wire: *, eny: @, our: @, now: @, cause: * };
```

the NockApp ovum (runtime.md §5).  Only `cause` is ever read here; the rest is named so the mold matches the wire noun.

`Nat` IS NARROWER THAN `@` --- it is the number aura, and a cord does not nest into it.  So the fields that carry numbers are Nat and the ones that carry raw atoms of another aura (entropy, a ship, a date) stay `@`.  Spelling them all Nat would look modern and refuse the wire.

### `Req`

```jock
struct Req { tag: @, id: Nat, uri: String, method: String, headers: List<Header>, body: Octs?, };
```

the %req cause.  `tag` is the %req atom --- a CORD, hence `@` --- so an ovum whose cause is shaped like a request but tagged otherwise is not one.

*used by examples/conway.jock*

```jock
func route(b: Board, r: http.Req, eny: @) -> Board {
```

## Arms

19 arms, in source order. The signature is reproduced exactly; the prose is the comment above the arm in `crates/jockc/hoon/lib/http.jock`.

| arm | signature | pinned by |
|---|---|---|
| `none` | `func none() -> Req` | — |
| `isReq` | `func isReq(r: Req) -> Bool` | `conway` (use) |
| `request` | `func request(e: *) -> Req` | `conway` (use) |
| `entropy` | `func entropy(e: *) -> @` | `conway` (use) |
| `isGet` | `func isGet(r: Req) -> Bool` | `http-counter` (use) |
| `isPost` | `func isPost(r: Req) -> Bool` | `conway` (use) |
| `header` | `func header(hs: List<Header>, k: String) -> String?` | — |
| `body` | `func body(s: String) -> Octs?` | — |
| `respond` | `func respond(id: Nat, status: Nat, hs: List<Header>, b: Octs?) -> Effect` | — |
| `html` | `func html(id: Nat, status: Nat, s: String) -> Effect` | `conway` (use) |
| `text` | `func text(id: Nat, status: Nat, s: String) -> Effect` | `http-counter` (use) |
| `redirect` | `func redirect(id: Nat, loc: String) -> Effect` | `webserver` (use) |
| `status` | `func status(id: Nat, code: Nat) -> Effect` | — |
| `digits` | `func digits(bs: List<Byte>, acc: @) -> @` | — |
| `param` | `func param(s: String, key: String) -> @` | `conway` (use) |
| `bodyText` | `func bodyText(r: Req) -> String` | — |
| `fields` | `func fields(r: Req) -> String` | `wordle` (use) |
| `lowerRun` | `func lowerRun(bs: List<Byte>) -> List<Byte>` | — |
| `word` | `func word(s: String, key: String) -> String` | `wordle` (use) |

### `none`

```jock
func none() -> Req { ... }
```

Receipt. the not-a-request sentinel.  A zero tag is one the driver never sends, so it cannot collide with a real cause.

### `isReq`

```jock
func isReq(r: Req) -> Bool { ... }
```

No comment in the source. The signature above is the whole of what `isReq` states about itself.

*used by examples/conway.jock*

```jock
if http.isReq(r) {
```

### `request`

```jock
func request(e: *) -> Req { ... }
```

the ONE cascade.  A poke is an untyped noun: it may be an ovum, it may be a bare atom (the lanes poke those), and its cause may be anything.  Each step is a soft cast, so a poke that is not a request answers the sentinel rather than crashing the kernel.

IT ANSWERS A Req, NOT A Req?, and that is deliberate.  Jock cannot narrow a `T?` to its `T` --- the only way through is `??` with a fallback --- so a unit here would make every app invent the same sentinel to unwrap it.  The library owns the sentinel instead, and `isReq` is the test.

*used by examples/conway.jock*

```jock
let r = http.request(e);
```

### `entropy`

```jock
func entropy(e: *) -> @ { ... }
```

the ovum's entropy, or 0 when the poke is not an ovum.

A kernel that wants an unpredictable game has NO OTHER SOURCE. Its state is checkpointed, so a seed kept in that state is the same seed after every restart --- which is a fresh boot dealing the identical board, every time.  The driver puts entropy in the ovum for exactly this, and `request` throws the ovum away, so this arm is how a caller keeps it.

*used by examples/conway.jock*

```jock
let nb = route(view, r, http.entropy(e));
```

### `isGet`

```jock
func isGet(r: Req) -> Bool { ... }
```

No comment in the source. The signature above is the whole of what `isGet` states about itself.

*used by examples/http-counter.jock*

```jock
if http.isGet(r) { ([http.html(r.id, 200, page(self.count))], self) }
```

### `isPost`

```jock
func isPost(r: Req) -> Bool { ... }
```

No comment in the source. The signature above is the whole of what `isPost` states about itself.

*used by examples/conway.jock*

```jock
if http.isPost(r) {
```

### `header`

```jock
func header(hs: List<Header>, k: String) -> String? { ... }
```

a header by name, or ~.  Header names arrive lowercased from the driver, and this does not fold case: it compares what it is given.

### `body`

```jock
func body(s: String) -> Octs? { ... }
```

Emission. a String becomes a body.  Empty stays EMPTY --- hoon's +to-octs answers ~ for a zero-length payload and the driver expects that, so a blank page is a bodyless 200 rather than a zero-length one.

### `respond`

```jock
func respond(id: Nat, status: Nat, hs: List<Header>, b: Octs?) -> Effect { ... }
```

No comment in the source. The signature above is the whole of what `respond` states about itself.

### `html`

```jock
func html(id: Nat, status: Nat, s: String) -> Effect { ... }
```

the three shapes an app actually emits.

*used by examples/conway.jock*

```jock
( [http.html(r.id, 200, render(nb))],
```

### `text`

```jock
func text(id: Nat, status: Nat, s: String) -> Effect { ... }
```

No comment in the source. The signature above is the whole of what `text` states about itself.

*used by examples/http-counter.jock*

```jock
([http.text(r.id, 405, "method not allowed: {r.method}")], self)
```

### `redirect`

```jock
func redirect(id: Nat, loc: String) -> Effect { ... }
```

a redirect carries no body;  the driver caches 200s by FULL uri and never caches a 302, which is what makes `/x?{n}` busting work.

*used by examples/webserver.jock*

```jock
([http.redirect(r.id, "/?{n}")], Serve( hits: n ))
```

### `status`

```jock
func status(id: Nat, code: Nat) -> Effect { ... }
```

a bare status --- 400, 404, 405 --- with nothing to say.

### `digits`

```jock
func digits(bs: List<Byte>, acc: @) -> @ { ... }
```

Query and form parameters.

The driver hands the uri whole ("/reveal?x=3&y=5"), and a form body carries the same key=value&... shape, so one arm reads either.  A String is a cord, so the walk is over its bytes.

A MISSING KEY IS ZERO, not an error.  These are coordinates and counters from a browser, and a kernel that crashed on a truncated query would be a kernel a malformed link could kill. the leading run of digits as a number, stopping at the first non-digit ('&', the end of the uri, anything)

### `param`

```jock
func param(s: String, key: String) -> @ { ... }
```

param("/reveal?x=3&y=5", "x=") is 3.  The key carries its own `=` so a caller can ask for "x=" without matching "max=". `key` must be NON-EMPTY.  String.split crashes on an empty separator, where the old hand-rolled search silently answered "the whole string";  crashing is the louder of the two and every caller here passes a literal.

*used by examples/conway.jock*

```jock
toggle(b, http.param(r.uri, "x="), http.param(r.uri, "y="))
```

### `bodyText`

```jock
func bodyText(r: Req) -> String { ... }
```

the request body as text, or "" when there is none.

### `fields`

```jock
func fields(r: Req) -> String { ... }
```

WHERE A FORM'S FIELDS ACTUALLY ARE.  A link or a GET puts them in the query;  a POST form puts them in the BODY.  An app that reads only the uri sees nothing a form submitted, so this joins the two with the separator they already use between fields.

*used by examples/wordle.jock*

```jock
submit(g, http.word(http.fields(r), "w="))
```

### `lowerRun`

```jock
func lowerRun(bs: List<Byte>) -> List<Byte> { ... }
```

the run of ASCII letters following `key`, lowercased, stopping at the first non-letter.  The companion to `param`: that one reads a number out of a query, this one reads a word.

A browser may send either case, and a form may send none at all, so uppercase folds down and an absent key answers "".

### `word`

```jock
func word(s: String, key: String) -> String { ... }
```

No comment in the source. The signature above is the whole of what `word` states about itself.

*used by examples/wordle.jock*

```jock
submit(g, http.word(http.fields(r), "w="))
```

## What no lane pins

9 of 22 public declarations are named by no example in `examples/`. They compile — the module is built by `tools/modules.sh` on every push — but no assertion mentions them by name, so treat the signature as the only claim about them that a lane checks.

That count is of DIRECT mentions. An arm an assertion reaches only through a caller is not counted here, so a helper below may well be exercised on every push without appearing to be — what is true is that no lane fixes its result independently of its caller’s.

- `Ovum` — `struct Ovum { num: Nat, wire: *, eny: @, our: @, now: @, cause: * };`
- `none` — `func none() -> Req`
- `header` — `func header(hs: List<Header>, k: String) -> String?`
- `body` — `func body(s: String) -> Octs?`
- `respond` — `func respond(id: Nat, status: Nat, hs: List<Header>, b: Octs?) -> Effect`
- `status` — `func status(id: Nat, code: Nat) -> Effect`
- `digits` — `func digits(bs: List<Byte>, acc: @) -> @`
- `bodyText` — `func bodyText(r: Req) -> String`
- `lowerRun` — `func lowerRun(bs: List<Byte>) -> List<Byte>`

## Where it is used

5 examples import `http`. Each is a complete program whose value `tools/examples.sh` pins on every push.

- `examples/conway.jock` — a use
- `examples/http-counter.jock` — a use
- `examples/minesweeper.jock` — a use
- `examples/webserver.jock` — a use
- `examples/wordle.jock` — a use

The [worked examples](../../examples/) page shows the shortest of these in full.
