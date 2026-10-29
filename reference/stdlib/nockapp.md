# lib/nockapp

the NockApp host's own effect vocabulary.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` writes this from `crates/jockc/hoon/lib/nockapp.jock` and the examples that import it.
>
> 1 public declaration — 1 type, 0 arms. 1 pinned by a lane, 0 not. channel `%rc` · commit `8b5492e`

## Import

A module arrives by name and nothing in it is ambient. Every arm below is reached as `nockapp.<name>`.

```jock
import nockapp;
```

The name is the file name minus `.jock`: `nockapp` is `crates/jockc/hoon/lib/nockapp.jock`, and it is found because the directory holding it was passed as a `--data-dir`. There is no search path and no implicit import; `tools/libs.py` holds the whole discovery rule, and the compiler itself is a pure function of source and libraries.

## About

These two cases are the drivers every NockApp has:  `exit` terminates the process with a code (drivers/exit.rs, matching `eq_bytes(b"exit")`) and `markdown` renders a cord (drivers/markdown.rs) --- the "print" of the nockapp world.

THE CASE NAMES ARE WIRE FORMAT.  A Jock union erases to [tag payload], and that noun IS what the pinned drivers scan, so renaming a case is a protocol change rather than a refactor. String's erasure is its cord, so `Effect.markdown("bye")` is [%markdown 'bye'] verbatim.

This lived in the prelude until 2026-10-24.  It left under the rule in docs/spec/runtime.md §8:  the prelude carries only what is true in every world Jock targets, and a driver's vocabulary is not that.  A kernel now names what it answers with.

## Types

1 type. A type’s members ARE its interface, so each is shown whole rather than by name.

### `Effect`

```jock
enum Effect { exit(@), markdown(String) };
```

No comment in the source. The signature above is the whole of what `Effect` states about itself.

*used by examples/counter-v2.jock*

```jock
class CounterV2(KS2) impl Kernel<nockapp.Effect> {
```

## What no lane pins

Nothing. All 1 public declaration is named by an example that runs on every push.

## Where it is used

4 examples import `nockapp`. Each is a complete program whose value `tools/examples.sh` pins on every push.

- `examples/counter-v2.jock` — a use
- `examples/counter.jock` — a use
- `examples/stoplight.jock` — a use
- `examples/watcher.jock` — a use

The [worked examples](/reference/examples/) page shows the shortest of these in full.
