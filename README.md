# jock.is

Static landing page for the [Jock](https://github.com/zorp-corp/jock-lang) programming
language — a single `index.html`, no build step.

## Syntax highlighting

`jock-highlight.js` and `jock-highlight.css` highlight the Jock listings on the
page.  Nothing to build, nothing to configure: the two files are already linked
from `index.html`, and a listing opts in with `class="code jock"`.  Opt-in by
design — the plate on the landing page also holds the Nock noun a program
compiles to, which must not be lexed as Jock.

**Both files are VENDORED.**  Their source of truth is
[`editors/web`](https://github.com/sigilante/jock/tree/master/editors/web) in
the compiler repo, where the tokenizer is a port of the compiler's own lexer
(`lib/lex.hoon`) and is held to the language's keyword and punctuator molds by
`tools/hilite.py` on every push.  A page cannot `<script src>` across
repositories, so the copies here must stay byte-identical:

- edit `editors/web` in the compiler repo, never the copies here
- re-copy both files, and update the sha256 lines in `VENDOR.txt`
- `JOCK_SITE=<this checkout> python3 tools/hilite.py` over there verifies both
  the copies and every listing on this page — a listing that goes stale against
  the language is a failure, not a wrong colour

Because that check reads the pages, the listings in `index.html` are held to the
frozen surface syntax: they are tokenized, must round-trip exactly, and must
produce no refusal.

## Serving locally

    python3 -m http.server 8000

then open http://localhost:8000/index.html. Any static file server works equally well
(`npx serve`, `caddy file-server`, etc.) — the page has no dependencies beyond Google
Fonts (Zilla Slab, Sometype Mono), loaded over CDN.

## Deploying to jock.is

This repo is served via GitHub Pages with a custom apex domain. One-time setup:

1. **Enable Pages** — repo Settings → Pages → Source: "Deploy from a branch" →
   branch `master`, folder `/ (root)`.
2. **Custom domain** — in that same Pages settings panel, set the custom domain to
   `jock.is`. GitHub will write/verify the `CNAME` file already committed in this repo
   (contains just `jock.is`) — don't remove it, Pages regenerates it from the settings
   field but its presence is what routes the domain.
3. **DNS at the registrar** — point the apex domain at GitHub Pages:

   | Type | Host | Value |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | AAAA | @ | 2606:50c0:8000::153 |
   | AAAA | @ | 2606:50c0:8001::153 |
   | AAAA | @ | 2606:50c0:8002::153 |
   | AAAA | @ | 2606:50c0:8003::153 |

   (AAAA/IPv6 records are optional but recommended.) If the registrar supports
   ALIAS/ANAME records instead of bare A records at the apex, an ALIAS to
   `sigilante.github.io` is equivalent and simpler to maintain.
4. **Wait for DNS to propagate**, then re-check the Pages settings panel — GitHub
   verifies the domain and issues a Let's Encrypt certificate automatically.
5. Once the certificate shows as issued, enable **"Enforce HTTPS"** in the same panel.

Pages redeploys automatically on every push to `master`.
