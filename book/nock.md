# R1 · The Nock specification

Jock compiles to Nock. This page is NOT the 4K specification — see below — and carries instead the one thing this repo pins about the Nock it emits.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` writes this page.
>
> channel `%rc` · commit `080874d`

## What the outline asks for, and why it is not here

`OUTLINE.md` R1 asks for "one page, the 4K reduction rules verbatim; everything else links to nock.is". **There is no copy of the 4K rules in this repository.** Writing them out from memory would not be verbatim, and a reference whose whole claim is that it invents nothing cannot start with the specification of its own target.

The rules themselves are at <https://nock.is>, where they are normative. How many there are and what they say is not stated here either: this page declines to transcribe the specification, and a count recalled rather than read is the same failure one number smaller.

## What this repo does pin

Jock does not emit Nock directly. It emits `nockasm`, an IR whose opcode set is closed, and `nockasm.md` N-19 states the set:

> N-19 · Twenty-one is the count because `%scry` joined.

`+expa-op` refines against that set, so an unknown opcode is a crash at expansion time rather than an unknown formula at runtime.

Pinned by `t-nx-scry-p`, `t-nx-law-scry-p`, `t-nx-unkop-n`.

What each opcode becomes is `docs/spec/nockasm-target.md`’s conformance law and deterministic lift. For the formula a given program compiles to, `tools/jockc.sh nock` prints it with the prelude’s push spine stripped.
