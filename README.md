# jock.is

Static landing page for the [Jock](https://github.com/zorp-corp/jock-lang) programming
language — a single `index.html`, no build step.

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
