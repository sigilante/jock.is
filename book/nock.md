# R1 · The Nock specification

Jock compiles to Nock. This is the whole of Nock 4K, quoted from `nock.is`, which is the normative source and is vendored into this repo so that the quotation can be checked.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` emits this page from `vendor/nock-4k.txt`.
>
> channel `%rc` · commit `8c0074a`

## Nock 4K

```text
Nock 4K

A noun is an atom or a cell.  An atom is a natural
number.  A cell is an ordered pair of nouns.

Reduce by the first matching pattern; variables match
any noun.

nock(a)             *a
[a b c]             [a [b c]]

?[a b]              0
?a                  1
+[a b]              +[a b]
+a                  1 + a
=[a a]              0
=[a b]              1

/[1 a]              a
/[2 a b]            a
/[3 a b]            b
/[(a + a) b]        /[2 /[a b]]
/[(a + a + 1) b]    /[3 /[a b]]
/a                  /a

#[1 a b]            a
#[(a + a) b c]      #[a [b /[(a + a + 1) c]] c]
#[(a + a + 1) b c]  #[a [/[(a + a) c] b] c]
#a                  #a

*[a [b c] d]        [*[a b c] *[a d]]

*[a 0 b]            /[b a]
*[a 1 b]            b
*[a 2 b c]          *[*[a b] *[a c]]
*[a 3 b]            ?*[a b]
*[a 4 b]            +*[a b]
*[a 5 b c]          =[*[a b] *[a c]]

*[a 6 b c d]     *[a *[[c d] 0 *[[2 3] 0 *[a 4 4 b]]]]
*[a 7 b c]          *[*[a b] c]
*[a 8 b c]          *[[*[a b] a] c]
*[a 9 b c]          *[*[a c] 2 [0 1] 0 b]
*[a 10 [b c] d]     #[b *[a c] *[a d]]

*[a 11 [b c] d]     *[[*[a c] *[a d]] 0 3]
*[a 11 b c]         *[a c]

*a                  *a
```

49 lines, reproduced character for character from `vendor/nock-4k.txt`. Reduce by the first matching pattern; variables match any noun.

## Where it comes from, and why it is vendored

The text above is the fenced block of <https://nock.is/_sources/content/history/nock-4k.md>, which cites <https://docs.urbit.org/language/nock/reference/definition> as its own source. Quoted here with the owner’s permission.

It is **vendored rather than transcribed**. `vendor/nock-4k.txt` holds the block and nothing else — no header, no reflow, no commentary — and its `sha256` is recorded in `vendor/SNAPSHOT.txt`, which the `pins` lane verifies on every push. So the hash is a hash of the specification rather than of this project’s presentation of it, and the word *verbatim* above is a claim a lane can check. A copy pasted into `tools/refgen.py` would have been a claim nobody could.

## What Jock actually emits

Jock does not emit Nock directly. It emits `nockasm`, an IR whose opcode set is closed, and `nockasm.md` [N-19](/spec/nockasm/#n-19) states the set:

> [N-19](/spec/nockasm/#n-19) · Twenty-one is the count because `%scry` joined.

`+expa-op` refines against that set, so an unknown opcode is a crash at expansion time rather than an unknown formula at runtime.

Pinned by `t-nx-scry-p`, `t-nx-law-scry-p`, `t-nx-unkop-n`.

The IR’s twenty-one opcodes are not Nock’s 12: several name subject structure (`%self`, `%battery`, `%payload`, `%sample`, `%context`) that lowers to axis reads, and the conformance law and deterministic lift in `docs/spec/nockasm-target.md` are what relate the two. For the formula a given program compiles to, `tools/jockc.sh nock` prints it with the prelude’s push spine stripped.
