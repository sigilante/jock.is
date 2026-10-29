# R11 · For Hoon programmers

Where Jock deliberately differs from Hoon. The fast path for a reader who already has the noun model and needs only the deltas.

> [!NOTE]
> **GENERATED — do not edit.** `tools/refgen.py` writes this page.
>
> 4 landmarks · 28 rules that name Hoon · channel `%rc` · commit `dd95321`

## The four the outline names

`OUTLINE.md` R11 names four differences as the ones worth leading with. Each is paired here with the rule that states it.

### first-case bunt

> L-71 · Bunt is the FIRST case's bunt

`docs/spec/language.md` L-71 · pinned by `t-arc-enum`

### flat auras

> S3.1 · Auras are flat: every named aura sits directly under bare `@` (aura `%$`). There is no Hoon-style prefix nesting; `@ud` vs `@u` subtlety does not exist. The initial semantic vocabulary (open-ended; surface-utterable set in language.md §3.1):

`docs/spec/types.md` S3.1

### spaced minus

> L-109 · Binary `-` is SPACED ON BOTH SIDES.

`docs/spec/language.md` L-109 · pinned by `t-minus-glued-l`, `t-minus-glued-r`, `t-minus-spaced`

### no runtime types

> S10.1 · Total function `⟦τ⟧` from types to noun-shape families. Hoon-compatible for every interop type (decision D-1):

`docs/spec/types.md` S10.1

## Every rule that reaches for Hoon

A mechanical set, and the page says so because the alternative would be a list somebody chose. "Where Jock differs from Hoon" is classified nowhere in this tree — the 23 did-you-mean corrections name Hoon exactly once, and that once is incidental, pointing at `hoon.dis` as the replacement for `&&`. What does exist is the normative rules, of which 28 say the word out loud across `language.md`, `types.md` and `runtime.md`. A rule that reaches for Hoon to explain itself is a rule about a difference.

`chain.md` names Hoon more often than any of the three and is not swept: it is about one package’s interop, not about the language.

| rule | states |
|---|---|
| `language.md` L-59 | Names admit glued hyphens, Hoon-Term-style.** `a-1` and `foo-bar` are each ONE name token, never a subtraction. A trailing hyphen (`a-`) is not a name and refuses. Hyphens never appear in type names — a `-` after a type name is minus. The readings cannot collide because binary `-` is spaced on both  |
| `language.md` L-71 | Bunt is the FIRST case's bunt**, by declaration order. This deliberately breaks Hoon's last-case `$%` convention, so a reader coming from Hoon should not assume. Well-foundedness is checked at registration (types.md S10.3). ⟨`t-arc-enum`⟩ |
| `language.md` L-6 | Int is ZigZag `@s`.** `+n` encodes as `2n` and `-n` as `2n−1` — Hoon's own encoding, so small magnitudes stay small and the FFI arms mirror `+si`. ⟨`t-sint-lit`⟩ |
| `language.md` L-133 | A singleton never survives a CALL boundary** — the signature governs, a singleton nesting into its own aura on the way in (types.md S4). This is the structural defense against Hoon-style TMI pain. Flow-sensitive narrowing is deferred (POSSIBLES P-7). ⟨`t-nest-sa-p`, `t-nest-sing-p`, `t-nest-sing-n`⟩ |
| `language.md` L-171 | `import <lib>;` brings a Hoon-compiled library into scope as FFI.** An import parses to a plain AST node; binding happens at environment construction, governed by the runtime-library interface spec. An unknown library refuses `%mint-import`, a wrong arity `%mint-call-arity`, and a generic import `%m |
| `types.md` S3.1 | Auras are flat: every named aura sits directly under bare `@` (aura `%$`). There is no Hoon-style prefix nesting; `@ud` vs `@u` subtlety does not exist. The initial semantic vocabulary (open-ended; surface-utterable set in language.md §3.1): |
| `types.md` S3.4 | Guards are a **closed, enumerated set** — `%based` (value < 2⁶⁴ − 2³² + 1, the Goldilocks prime), `%byte` (< 256), `%unic` (a Unicode scalar, `0x0`–`0x10FFFF`), `%loob` (< 2), `%term` (a valid Hoon term). **Five.** A guard is not a general refinement mechanism and never will be. |
| `types.md` S5.1 | `nest(Δ, want, have)` carries the definition environment (like `dish`): rule N13 unfolds **data nominals** (S9.2) on the want side. All other rules are Δ-blind. |
| `types.md` S7.1 | Two spellings, one meaning. **`p.+5`** names the axis directly; **`p.<>`** spells the same path as a run of head/tail steps. Lark is self-describing at shallow depth (`<>` reads "tail of the head"); the numeric form is the general one, for deep or generated axes. Both make the same `%axis` limb, so  |
| `types.md` S8.2 | - `%atom` (constant): ⇒ `%sing aura val`. Non-constant: ⇒ `%atom aura ~`. - **The null literal** (`%null`; surface lexeme owned by language.md): ⇒ `%sing %n 0` — the only spelling that inhabits `T?`'s none member. Flat auras (D-7) make this a real requirement, exactly as in Hoon: a `%number` zero do |
| `types.md` S9.8 | The core algebra is calling convention only (P-3, promoted): |
| `types.md` S10.1 | Total function `⟦τ⟧` from types to noun-shape families. Hoon-compatible for every interop type (decision D-1): |
| `types.md` S10.2 | `bunt(e, τ)` — the default value, as nasm (typically `%const`): |
| `types.md` S10.3 | First-case bunting kills Hoon's reorder-the-last-case pitfall but admits its mirror: `enum Rec { cell(Rec, Rec), leaf }` has a divergent bunt. Registration (S9.1) therefore checks well-foundedness: over each declaration group, build the **bunt-dependency graph** — edges from each name to the names i |
| `types.md` S11.1 | `embed(τ)` renders the embeddable fragment as a Hoon `$type`, CI-only. **In (implemented)**: auras (`%atom a ~` with no constant), singletons (Hoon's constant atoms — cubes), cells, faces, `%noun`, `%void`. **In (spec'd, not yet implemented — `+embed` currently crashes on these, so the oracle runs o |
| `types.md` S11.2 | There is **no** Hoon-`$type`-to-`$typ` projection judgment. Every imported arm — dry and wet alike — is typed by its **curated pinned signature** (`$scheme`) from the runtime-library interface spec; `def.imports` stores `[hvase arms]` (`$hlib`). Wet arms get hand-assigned ∀-signatures (unglamorous a |
| `types.md` S12.3 | **Exhaustiveness checking** over constructor spaces derived from the scrutinee type. *The implementation (`+mcov`) is a conservative five-case cover test, not Maranget specialize/default matrices; it is sound for exhaustiveness and weaker for redundancy, which is what S12.3's redundancy note now rec |
| `runtime.md` R-3 | Kernel state types are CLOSURE-FREE**, normative for shipped kernels. Gate-containing types are not mold-checkable (types.md S8.10), so they cannot cross poke or peek anyway; keeping them out of *internal* state as well keeps checkpoints compact and avoids the Hoon-vase-adjacent failure mode where s |
| `runtime.md` R-14 | Curating an arm that takes a GATE turns on one question: does the Hoon arm read or seed the gate's SAMPLE before calling it?** If it only slams the gate, a Jock closure crosses as itself and the arm needs no wrapper — `mink`'s scry gate, `lturn`'s mapper. If it touches the sample, as `+reel` and `+r |
| `runtime.md` R-15 | The failure mode when R-14 is got wrong is UNKIND**, which is why it is written down. Editing *into* a Jock closure's sample — axis 13, the sample's tail, which is what seeding an accumulator touches — dies with `Invalid axis for edit: NotCell`, the sample being the atom `0` and having no tail. Edit |
| `runtime.md` R-17 | A user closure crosses to `lturn` AS ITSELF.** A Jock closure *is* a Hoon gate (types.md S9.8), and a `$-` sample in the wrapper is nest-checked rather than normalized, so nothing rebuilds it on the way in. ⟨`t-list-turn-lambda`, `t-list-turn-retype`⟩ |
| `runtime.md` R-18 | `lib/hof` delegates to these arms**, so a program writes one spelling and gets the kernel's formula — jetted where the Jock recursion was interpreted. `hof.foldr` already takes `(item, acc)`, which is Hoon's order and therefore the arms', and passes straight through; `hof.foldl` is accumulator-first |
| `runtime.md` R-25 | The roof answers `T??`, which is R-24's gate type with no glue.** `trait Roof` declares `answer(self: Self, r: *, p: *) -> *??`, so a roof says what mink's contract says and the three outcomes are each reachable: |
| `runtime.md` R-26 | A roof may instead answer a BARE value, and is then LIFTED.** A `lambda (r, p) -> * { v }` is accepted: its body is checked against the contract and optional injection — `+mint`'s only checking-mode coercion — wraps it **twice** into `[~ [~ v]]`, which `+mink` strips with `u.u.result`. Lift-two and  |
| `runtime.md` R-31 | Exactly ONE formula enters artifacts outside the import path: `(sane %tas)`**, embedded by the `%term` mold check (`+mtst:mold`). That is the deliberate call-Hoon's-own decision (types.md S3.4) — a second implementation of the term grammar would be a correctness bug at the boundary it guards. It is  |
| `runtime.md` R-38 | `String` is a data nominal over the UTF-8 CORD** — the compact form — and `List<Byte>` is the processing form, a Hoon `tape` byte for byte. The Hoon-compatible List erasure makes `trip`'s product a `List<Byte>` value by construction, and `crip`/`trip` convert. ⟨`t-text-bytes`, `t-text-chars-2`⟩ |
| `runtime.md` R-43 | A String has TWO VIEWS and neither is the default.** One cord answers two different questions: |
| `runtime.md` R-49 | `Path` is a data nominal over list-of-`String`, with NO KNOTS.** Segments are Strings; Hoon's `@ta` discipline was aura bookkeeping and the nouns round-trip without it. `/a/b/c` desugars to the `%null`-terminated segment chain, cast. ⟨`t-des-path`, `t-parse-path`, `t-text-path`⟩ |

## Where to go next

[Negative transfer](/reference/transfer/) carries the 23 refusals that exist to catch a habit from another language, each quoting the compiler’s own correction — start there if Jock rejected something that would be correct Hoon. [Deliberate absences](/reference/absences/) carries what Jock does not have at all.
