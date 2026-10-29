# R10 · The examples as exercises

38 programs, each with the value it produces and each run on every push. Six are landmarks on a difficulty gradient; the rest are ungraded, and this page says so rather than inventing a grading.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` writes this page.
>
> channel `%rc` · commit `7b85ef8`

## The gradient

`OUTLINE.md` §1 describes the example set as "forming a natural difficulty gradient" and names its landmarks. Those are projected here. The outline’s last two landmarks were the chain track, which is off this site, so the gradient ends at `webserver`.

| step | example | lines | what it introduces |
|---:|---|---:|---|
| 1 | `counter` | 13 | a whole kernel |
| 2 | `sort` | 30 | bounded generics |
| 3 | `poker` | 167 | the big pure-functional program |
| 4 | `stoplight` | 45 | kernels, and upgrade |
| 5 | `counter-v2` | 14 | kernels, and upgrade |
| 6 | `webserver` | 54 | HTTP |

The steps are the outline’s order, which is by what each one introduces — so the line column is not sorted, and `poker` at step 3 is the longest program on the page.

## Everything else, ungraded

32 further programs, by size. Size is a proxy a reader can check; difficulty is a judgement, and nothing in the tree makes it for these, so this page does not either.

| example | lines | value | imports |
|---|---:|---|---|
| `cons` | 15 | `[3 2 1 0]` | — |
| `hof` | 23 | `72` | `hof` |
| `peektry` | 24 | `[42 7 9]` | — |
| `point` | 26 | `.~143.0` | — |
| `patp` | 28 | `[1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1]` | `urbit` |
| `collections` | 29 | `601` | — |
| `errol` | 30 | `'3.14 0.1 100.0 1e+23 1.7976931348623157e+308 5e-324 -0.0 0.3333333333333333'` | — |
| `scry` | 30 | `[1 1 1]` | — |
| `strings` | 31 | `'hello, world (12 bytes) - top suit hearts, a < b true'` | — |
| `twoc` | 31 | `16.235.262` | `twoc` |
| `tap` | 33 | `616` | `hof` |
| `sort-imported` | 41 | `'1/3|1/2|2/3|3/4|'` | `rational` |
| `roof` | 44 | `[1 1 1 1]` | — |
| `molds` | 50 | `'atom 42, byte A, rejected x, cmd op 3, kind 2'` | — |
| `parser` | 53 | `'1234|abc|x|2'` | `parser` |
| `interval` | 60 | `'[5/2, 4]|[1, 3]|[1/2, 3]|1/2|yes|[0, 1]'` | `interval`, `rational` |
| `rational-arms` | 64 | `19` | `rational` |
| `http-counter` | 68 | `0` | `http` |
| `parser-combinators` | 70 | `'aaa|ab|<x>|x|123|Q7 |zz|ok|9|2|a b|~'` | `parser` |
| `matmul` | 74 | `[[58 64 0] [139 154 0] 0]` | — |
| `twoc-arms` | 77 | `29` | `twoc` |
| `units` | 77 | `.~24.0` | — |
| `hof-arms` | 79 | `18` | `hof` |
| `interval-arms` | 80 | `23` | `interval`, `rational` |
| `generic-class` | 84 | `14` | — |
| `rand-arms` | 90 | `11` | `rand` |
| `parser-arms` | 100 | `33` | `parser` |
| `watcher` | 121 | `[2 2 1 1]` | `nockapp` |
| `string-views` | 126 | `45` | — |
| `conway` | 237 | `0` | `http` |
| `minesweeper` | 335 | `0` | `hof`, `http` |
| `wordle` | 364 | `0` | `http` |

Every source is in [worked examples](/reference/examples/), with the 14 shortest shown in full.
