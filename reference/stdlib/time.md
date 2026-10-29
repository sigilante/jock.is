# lib/time

civil dates, ISO 8601, and the Urbit `@da`.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` writes this from `crates/jockc/hoon/lib/time.jock` and the examples that import it.
>
> 21 public declarations — 1 type, 20 arms. 21 pinned by a lane, 0 not. channel `%rc` · commit `f1c3be4`

## Import

A module arrives by name and nothing in it is ambient. Every arm below is reached as `time.<name>`.

```jock
import time;
```

The name is the file name minus `.jock`: `time` is `crates/jockc/hoon/lib/time.jock`, and it is found because the directory holding it was passed as a `--data-dir`. There is no search path and no implicit import; `tools/libs.py` holds the whole discovery rule, and the compiler itself is a pure function of source and libraries.

## About

Jock has `Date` and `Span` as TYPES — the `%date` and `%span` auras — and no literal for either (language.md [L-189](/spec/language/#l-189)). Nothing in the ABI produces one, so until now a `Date` was a name with no way to make a value that meant anything. This module is the way: a broken-down `Stamp`, the conversions between it and an absolute instant, and ISO 8601 in both directions.

THE ARITHMETIC IS NOT INVENTED HERE. Every calendar arm is a transliteration of the vendored Hoon's own date core — `+yawn`, `+yall`, `+yelp` and the `+yo` constants in `vendor/hoon-138.hoon`, which `vendor/SNAPSHOT.txt` pins. That is deliberate: a calendar written twice is a calendar that disagrees with itself at some leap year nobody tests, and `@da` round-tripping through Urbit is the whole reason to have `Date` at all. Where this file differs from the Hoon it says so.

THE EPOCH. An Urbit `@da` counts seconds from the start of the Urbit epoch in its high 64 bits and a binary fraction of a second in its low 64. The epoch begins 292_277_024_400 years before 1 AD, so an ordinary year `y` is the internal year `y + EPOCH`. A Stamp carries the ORDINARY year; the conversion happens at the boundary.

AD ONLY. `+year` takes a BC flag and this does not: a Stamp's year is AD, which is what ISO 8601's four-digit year means anyway. `fromDate` on an instant before 1 AD crashes rather than answering a wrong year, which is the honest failure for a thing this module does not model.

import time;

let t = time.parse("2026-10-30T12:00:00Z"); match t { ~ => "unparseable", (~, s) => time.show(s) } An instant, broken down. Fields are plain atoms and nothing validates them on construction — `show` of a nonsense Stamp is nonsense, and `valid` is how you ask.

## Types

1 type. A type’s members ARE its interface, so each is shown whole rather than by name.

### `Stamp`

```jock
struct Stamp { year: @, month: @, day: @, hour: @, minute: @, second: @ } // EPOCH: years from the start of the Urbit epoch to 1 AD. // `+year:hoon` adds this to an AD year;
```

No comment in the source. The signature above is the whole of what `Stamp` states about itself.

*asserted by examples/time-arms.jock*

```jock
assert not time.valid(time.Stamp(year: 2026, month: 2, day: 30,
```

## Arms

20 arms, in source order. The signature is reproduced exactly; the prose is the comment above the arm in `crates/jockc/hoon/lib/time.jock`.

| arm | signature | pinned by |
|---|---|---|
| `epoch` | `func epoch() -> @` | `time-arms` (assert) |
| `daySecs` | `func daySecs() -> @` | `time-arms` (assert) |
| `hourSecs` | `func hourSecs() -> @` | `time-arms` (assert) |
| `minuteSecs` | `func minuteSecs() -> @` | `time-arms` (assert) |
| `leap` | `func leap(y: @) -> Bool` | `time-arms` (assert) |
| `monthDays` | `func monthDays(y: @, m: @) -> @` | `time-arms` (assert) |
| `dayOf` | `func dayOf(y: @, m: @, d: @) -> @` | `time-arms` (assert) |
| `toSecs` | `func toSecs(t: Stamp) -> @` | `time-arms` (assert) |
| `fromSecs` | `func fromSecs(secs: @) -> Stamp` | `time-arms` (use) |
| `toDate` | `func toDate(t: Stamp) -> Date` | `time-arms` (use) |
| `fromDate` | `func fromDate(d: Date) -> Stamp` | `time-arms` (assert) |
| `span` | `func span(secs: @) -> Span` | `time-arms` (assert) |
| `spanSecs` | `func spanSecs(s: Span) -> @` | `time-arms` (assert) |
| `between` | `func between(a: Stamp, b: Stamp) -> Span` | `time-arms` (assert) |
| `unixEpoch` | `func unixEpoch() -> @` | `time-arms` (assert) |
| `toUnix` | `func toUnix(t: Stamp) -> Int` | `time-arms` (assert) |
| `fromUnix` | `func fromUnix(secs: Int) -> Stamp` | `time-arms` (assert) |
| `valid` | `func valid(t: Stamp) -> Bool` | `time-arms` (assert) |
| `parse` | `func parse(s: String) -> Stamp?` | `time-arms` (assert) |
| `show` | `func show(t: Stamp) -> String` | `time-arms` (assert) |

### `epoch`

```jock
func epoch() -> @ { ... }
```

No comment in the source. The signature above is the whole of what `epoch` states about itself.

*asserted by examples/time-arms.jock*

```jock
assert time.epoch() == 292277024400;
```

### `daySecs`

```jock
func daySecs() -> @ { ... }
```

Seconds in a day, an hour, a minute — `+yo:hoon`.

*asserted by examples/time-arms.jock*

```jock
assert time.daySecs() == 86400;
```

### `hourSecs`

```jock
func hourSecs() -> @ { ... }
```

No comment in the source. The signature above is the whole of what `hourSecs` states about itself.

*asserted by examples/time-arms.jock*

```jock
assert time.hourSecs() == 3600;
```

### `minuteSecs`

```jock
func minuteSecs() -> @ { ... }
```

No comment in the source. The signature above is the whole of what `minuteSecs` states about itself.

*asserted by examples/time-arms.jock*

```jock
assert time.minuteSecs() == 60;
```

### `leap`

```jock
func leap(y: @) -> Bool { ... }
```

+yelp:hoon. Note this is the FULL Gregorian test, and is right for the internal year as well as the ordinary one: both differ by a multiple of 400.

*asserted by examples/time-arms.jock*

```jock
assert time.leap(2024);
```

### `monthDays`

```jock
func monthDays(y: @, m: @) -> @ { ... }
```

Length of month m (1-12) in year y. The `+moh`/`+moy` lists of `+yo`, as a test rather than a list, because Jock indexes a List in O(n) and this is a seven-way compare either way.

*asserted by examples/time-arms.jock*

```jock
assert time.monthDays(2024, 2) == 29;
```

### `dayOf`

```jock
func dayOf(y: @, m: @, d: @) -> @ { ... }
```

+yawn:hoon: the day number of an ordinary (AD) y-m-d.

*asserted by examples/time-arms.jock*

```jock
assert time.dayOf(2026, 10, 30) - time.dayOf(1970, 1, 1) == 20756;
```

### `toSecs`

```jock
func toSecs(t: Stamp) -> @ { ... }
```

Seconds from the start of the Urbit epoch. This is the high half of a `@da`, and the quantity all the arithmetic happens in.

*asserted by examples/time-arms.jock*

```jock
assert time.toSecs(noon) - time.toSecs(time.fromUnix(+0)) == 1793363696;
```

### `fromSecs`

```jock
func fromSecs(secs: @) -> Stamp { ... }
```

The inverse. Crashes on an instant before 1 AD rather than answering a wrong year — see the AD ONLY note above.

*used by examples/time-arms.jock*

```jock
let back = time.fromSecs(time.toSecs(noon));
```

### `toDate`

```jock
func toDate(t: Stamp) -> Date { ... }
```

A `@da` is the second count in the high 64 bits and a binary fraction in the low 64. These two arms are the whole bridge to Urbit, and they drop the fraction: a Stamp has no sub-second field, so `fromDate` of an instant with one is the instant truncated to its second.

*used by examples/time-arms.jock*

```jock
let d = time.toDate(noon);
```

### `fromDate`

```jock
func fromDate(d: Date) -> Stamp { ... }
```

No comment in the source. The signature above is the whole of what `fromDate` states about itself.

*asserted by examples/time-arms.jock*

```jock
assert time.toUnix(time.fromDate(d)) == +1793363696;
```

### `span`

```jock
func span(secs: @) -> Span { ... }
```

A Span is a DURATION in the same fixed-point shape: whole seconds in the high 64 bits. The difference of two instants.

*asserted by examples/time-arms.jock*

```jock
assert time.spanSecs(time.span(90)) == 90;
```

### `spanSecs`

```jock
func spanSecs(s: Span) -> @ { ... }
```

No comment in the source. The signature above is the whole of what `spanSecs` states about itself.

*asserted by examples/time-arms.jock*

```jock
assert time.spanSecs(time.span(90)) == 90;
```

### `between`

```jock
func between(a: Stamp, b: Stamp) -> Span { ... }
```

No comment in the source. The signature above is the whole of what `between` states about itself.

*asserted by examples/time-arms.jock*

```jock
assert time.spanSecs(time.between(newyear, newyear)) == 0;
```

### `unixEpoch`

```jock
func unixEpoch() -> @ { ... }
```

Unix time, which is what everything outside Urbit means by a timestamp. The constant is COMPUTED, not written down.

SIGNED, and that is not fussiness: a Nat `toUnix` crashes on every instant before 1970, so `time.toUnix` of an 1900 date --- an ordinary thing to want --- would have been a crash rather than a negative number. The whole AD range answers.

*asserted by examples/time-arms.jock*

```jock
assert time.unixEpoch() == time.dayOf(1970, 1, 1) * 86400;
```

### `toUnix`

```jock
func toUnix(t: Stamp) -> Int { ... }
```

No comment in the source. The signature above is the whole of what `toUnix` states about itself.

*asserted by examples/time-arms.jock*

```jock
assert time.toUnix(noon) == +1793363696;
```

### `fromUnix`

```jock
func fromUnix(secs: Int) -> Stamp { ... }
```

No comment in the source. The signature above is the whole of what `fromUnix` states about itself.

*asserted by examples/time-arms.jock*

```jock
assert time.toSecs(noon) - time.toSecs(time.fromUnix(+0)) == 1793363696;
```

### `valid`

```jock
func valid(t: Stamp) -> Bool { ... }
```

Is this Stamp a real instant? Nothing validates on construction, so this is how you ask. `show` of an invalid Stamp is nonsense rather than a refusal.

*asserted by examples/time-arms.jock*

```jock
assert time.valid(noon);
```

### `parse`

```jock
func parse(s: String) -> Stamp? { ... }
```

Parse `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SS` with an optional trailing `Z`. Anything else is `~`, including a well-formed date that is not a real one — `parse("2026-02-30")` is `~`, because a Stamp that cannot happen is not a successful parse.

*asserted by examples/time-arms.jock*

```jock
assert match time.parse("2026-10-30") { ~ => 0, (~, s) => s.day } == 30;
```

### `show`

```jock
func show(t: Stamp) -> String { ... }
```

No comment in the source. The signature above is the whole of what `show` states about itself.

*asserted by examples/time-arms.jock*

```jock
assert time.show(time.fromDate(d)) === "2026-10-30T12:34:56Z";
```

## What no lane pins

Nothing. All 21 public declarations are named by an example that runs on every push.

14 further declarations are `private` and therefore not reachable by an importer at all: `monthsBefore`, `yawnLoop`, `yallMonth`, `yallYear`, `yall`, `isDigit`, `digits`, `lit`, `some`, `none`, `parseTime`, `padLoop`, `pad`, `showFull`.

## Where it is used

1 example imports `time`. Each is a complete program whose value `tools/examples.sh` pins on every push.

- `examples/time-arms.jock` — the arms sheet: one assertion per arm

The [worked examples](/reference/examples/) page shows the shortest of these in full.
