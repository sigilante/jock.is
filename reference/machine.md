# Machine interface

`jockc.sh --diag` emits one JSON object per run. The schema is pinned by corpus vectors that assert the exact string, so a change to it is deliberate and versioned rather than drift.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` in the compiler repo writes this page.
>
> channel `%rc` · commit `f1c3be4` (sigilante/pre-rc-sweep) · corpus 1156 vectors · 2026-10-30

An agent driving the compiler should parse this rather than the human output, which is built for a terminal and whose alignment is meaningful.

## Fields

| Field | On success | On refusal |
|---|---|---|
| `status` | `"ok"` | `"refused"`, or `"crashed"` with no tag |
| `type` | the program’s type, as a string | absent |
| `tag` | absent | the refusal tag, without its `%` |
| `line`, `col` | absent | 1-indexed position; `0,0` means end of input |
| `module` | absent | the `--data-dir` module the refusal came from, or `null` |
| `report` | absent | the human report, one string per line |

## Exit codes

| Code | Meaning |
|---|---|
| `0` | the program compiled (and ran, for `run`) |
| `1` | refused or crashed — a JSON object was still emitted |
| `2` | usage error: an unknown flag, or no mode given |

`1` and `0` both produce output. A tool should read `status` rather than branch on the exit code alone, since a refusal is a successful compile *run* that reports a rejection.

## Pinned examples

Each is a corpus vector asserting the whole output string verbatim.

### `t-chkj-ok`

```jock
1 + 41
```

*the JSON it emits*

```json
{"status":"ok","type":"Nat"}
```

### `t-chkj-refuse`

```jock
nope
```

*the JSON it emits*

```json
{"status":"refused","tag":"mint-limb","line":1,"col":1,"module":null,"report":["refused: %mint-limb at 1:1","  1 | nope","    | ^","  hint: [ %mint-limb","            '`nope` is unbound: no binding, declaration, or import provides it; if it is a `func` declared below, only ADJACENT funcs see each other --- move them together'","            p=1","            q=1","          ]"]}
```

### `t-chkjm-parse`

*module*

```jock
import b; b.viab(
```

*program*

```jock
import badparse; 1
```

*the JSON it emits*

```json
{"status":"refused","tag":"parse-expected","line":0,"col":0,"module":"badparse","report":["refused: %parse-expected at end of input (in module badparse)","  hint: [%parse-expected %')' p=0 q=0]","  hint: [%in-module %badparse]"]}
```

### `t-chkjm-coord`

*module*

```jock
func f(n: @) -> @ { n + 1 };
let z = nosuchname;
```

*program*

```jock
import broke; broke.f(1)
```

*the JSON it emits*

```json
{"status":"refused","tag":"mint-limb","line":2,"col":9,"module":"broke","report":["refused: %mint-limb at 2:9 (in module broke)","  2 | let z = nosuchname;","    |         ^","  hint: [ %mint-limb","            '`nosuchname` is unbound: no binding, declaration, or import provides it; if it is a `func` declared below, only ADJACENT funcs see each other --- move them together'","            p=2","            q=9","          ]","  hint: [%in-module %broke]"]}
```
