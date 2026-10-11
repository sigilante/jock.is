# jock.is x402 proxy

Vendored from Cloudflare's [`x402-proxy-template`](https://github.com/cloudflare/templates/tree/main/x402-proxy-template)
(everything below the next section is that template's own docs, unmodified).
Byte-for-byte diffs live in `wrangler.jsonc` only — re-sync by re-copying the
upstream template and reapplying that diff.

## What's configured here

- **Nothing load-bearing is gated** (revised 2026-10-10): the site's pages
  are **not** protected, and neither is the agent corpus — `llms.txt` and the
  generated reference index stay free permanently, because they are the
  adoption funnel. Only `/demo/*` requires payment, which exists so there is a
  working x402 endpoint to point at. See `PROTECTED_PATTERNS` in
  `wrangler.jsonc`, and the revised rollout plan below for why the docs are no
  longer the object being metered.
- **Origin**: DNS-based mode (`ORIGIN_URL` left unset). External Origin Mode
  was tried first and doesn't work here — GitHub Pages routes purely on the
  Host header, but Workers' `fetch()` always sends the target URL's own
  hostname as `Host`, not the original request's (confirmed locally: proxying
  to `https://sigilante.github.io` got GitHub's generic 404, not jock.is —
  see the `ORIGIN_URL` comment in `wrangler.jsonc`). DNS-based mode has no
  such issue, because the client's URL stays `https://jock.is/...` the whole
  way; only *where Cloudflare routes it* changes, once Phase 2 below is done.
- **Network**: `base-sepolia` (testnet). It used to be `base` (mainnet) while
  `PAY_TO` was the burn address `0x…dEaD` — routes were commented out so
  nothing was live, but that pairing committed to the repo is the worst one
  available, since if it were ever routed real USDC would go somewhere
  irrecoverable. On testnet the dead address is correct and harmless.
  **Mainnet is now a deliberate one-line edit at go-live, together with a real
  `PAY_TO`.**
- **Price**: `$0.01` per hour of access — an arbitrary starting point, and fine
  for a demo. Per-*hour* pricing is the wrong shape for a service an agent
  calls in a loop; see the check-loop note in the plan below.
- **Bot Management filtering** (humans free, only bots pay) is documented below
  but **not enabled** — it needs a paid/Enterprise Cloudflare plan. This is not
  a nice-to-have: without it the template charges *all* traffic on a protected
  route, so "humans free" is unimplementable here, which is the first reason
  the rollout plan was revised.

## Rollout plan (revised 2026-10-10)

The original plan gated `/docs/*` and `/reference/*` and went live on
jock.is in two phases. That has been revised, for three reasons found
on review rather than in principle.

### Why it changed

**1. The policy we want is not implementable on this plan.** The
intent is *humans free, only agents pay*. That needs Cloudflare **Bot
Management**, which is paid/Enterprise. Without it the template's own
behaviour applies — "all traffic to protected routes requires
payment" — so a human following a link to `/reference/` gets a 402.
That is the opposite of the intent, and no `PROTECTED_PATTERNS` tuning
fixes it: the patterns here carry no `bot_score_threshold` or
`except_detection_ids`, so the policy is not configured even
aspirationally.

**2. Metering the corpus works against adoption, and earns ~nothing.**
A prospective human user tries Jock *with an agent* in the first ten
minutes, so the agent's competence at Jock is upstream of human
adoption. Almost no agent harness can settle an x402 invoice today, so
the practical effect of a 402 on `/docs/*` is that agents get nothing
and fall back to confabulating Jock from Rust and Hoon priors — which
is exactly the failure `llms.txt` exists to prevent. Expected revenue
is ~0; expected adoption cost is not. It would not even bite where it
matters: `llms.txt` is served from the site root, free, and is the file
agents actually read.

**3. Docs are the wrong object to meter.** Reading docs is a one-time
act with no marginal cost to us, and the buyer can substitute by
reading the spec on GitHub. *Checking* is a loop — an agent writing
Jock validates every iteration — it has real marginal cost (compute),
and a model genuinely cannot substitute for it, because it cannot
self-verify a language it does not know. x402 is a per-request payment
protocol; a per-request service is its natural fit, and a static
document is not. See "If we ever meter the check loop" below — and note
that it would want **per-call** pricing, not the per-hour window used
here: an hour of access either lets one payment burn unbounded compute
or charges an agent for idle time, and neither is intended.

What survives unchanged: the worker itself, DNS-based mode, and the
finding that External Origin Mode cannot work here (GitHub Pages routes
on the `Host` header, and Workers' `fetch()` sends the target URL's
host, not the original request's).

### The plan

**Step 1 — Phase 1, unchanged and worth doing.** Deploy under
`*.workers.dev` with `NETWORK: "base-sepolia"` and the dead-address
`PAY_TO`. No `routes`, so live jock.is is untouched and there is
nothing to roll back. This proves the 402/payment machinery in
isolation.

```bash
cd worker
npm install
cp .dev.vars.example .dev.vars
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))" >> .dev.vars
npm run dev                                    # local: http://localhost:8787
curl http://localhost:8787/__x402/health       # -> 200, public
curl http://localhost:8787/demo/anything       # -> 402, payment required
npx wrangler secret put JWT_SECRET             # then, for a real deploy:
npm run deploy
```

**Step 2 — gate `/demo/*`, not the docs.** `PROTECTED_PATTERNS` now
protects `/demo/*` only. The positioning value of x402 is real and
specific to this project — a language that compiles to Nock, in a
Nockchain context, metering agent access over x402 is thematically
coherent and worth being able to point at. That value is a *working
endpoint*, not a paywalled manual, so nothing load-bearing goes behind
it.

**Step 3 — the agent corpus stays free, permanently.** `llms.txt` and
the generated reference index (see `../GENERATOR.md`) are the adoption
funnel and a build target, not a product. They are not candidates for
metering at any point.

**Step 4 — `NETWORK` defaults to testnet in the committed config.**
It was `"base"` (mainnet) *and* `PAY_TO` was the burn address
`0x…dEaD`, simultaneously. Routes were commented out so nothing was
live, but that pairing committed to the repository is the worst one
available: if it were ever routed, real USDC would go somewhere
irrecoverable. The committed default is now `base-sepolia`, where the
dead address is correct and harmless. **Switching to mainnet is a
deliberate one-line edit at go-live, together with a real `PAY_TO`.**

**Step 5 — hold Phase 2.** Going live on jock.is moves the domain's
**nameservers** to Cloudflare. That is a cutover, not a record edit:
rollback is real but propagates on TTL, so a botched one is up to 48
hours of a wrong-or-absent landing page. For a one-page public face,
taken on for ~$0 of expected revenue, that trade is not available yet.
The Phase 2 steps are preserved verbatim below for when there is a
reason — and the reason should be a demand signal, not a milestone:
bulk crawling that actually costs something, or an operator asking for
an SLA.

### If we ever meter the check loop

Not now, and recorded so the design is not re-derived later.

The thing worth charging for is `check`: an endpoint that takes Jock
source and returns the `+chkj` JSON. **No compiler change is
required** — `+chkj` is already the single writer for that schema,
pinned by `t-chkj-*` and `t-kchk-ok`, and `--diag`, `tools/check.sh`
and the REPL's `%check` poke all serialize through it. An HTTP caller
is a fourth consumer of a frozen schema.

Both halves already exist and are proven:

- **HTTP in and out of a Jock kernel**: `examples/webserver.jock` plus
  `drivers/webserve/jock_serve.rs` — the stock `http_driver()`, zero
  custom protocol Rust, curl-verified end to end, built by
  `tools/serve.sh`.
- **The check itself**: the REPL kernel's poke scanner already handles
  `[%check @]` and answers `[%json cord]` (`lib/jock.hoon`), at ~0.7 s
  warm for a module-free kernel.

What does not exist is one kernel that does both — a `checkserver.jock`
whose route pokes the compiler path where `webserver.jock` pokes a hit
counter. That is example-level assembly over prelude vocabulary, not a
language or compiler feature.

**The real cost is operational, not code.** jock.is is static GitHub
Pages; a Worker cannot host a NockVM binary. Serving `/check` means
running a process somewhere, which converts this project from "a static
site" into "a service with uptime." Two specifics to design for before
that is worth it:

- **Compile time is not bounded by input size.** The repo's own history
  has an exponential `+mop` found by a hang and a 25-minute unmemoized
  noun walk. A public checker needs a step budget per request; the
  `--slam` lane's "step budget exhausted" is the existing precedent.
- **The abuse surface is narrower than it looks, and worth stating.**
  `check` compiles *without running* — no expansion, no execution — so
  a caller cannot execute arbitrary code, only make the type checker
  work. That is a real safety property, not a mitigation.

### Multiple chains, and a better rate on Nockchain

Asked 2026-10-10. The idea is good and the mechanism is further away
than it looks, so both halves are recorded.

**What x402 can do.** A 402 response carries `accepts`, a *list* of
payment requirements, so advertising several networks at several prices
is within the protocol. The vendored `x402@1.0.1` supports 17 networks
— `abstract`, `avalanche`, `base`, `educhain`, `iotex`, `peaq`,
`polygon`, `sei`, `skale-base-sepolia`, `solana`, `story` and testnets
— with exactly one scheme, `exact`. Solana being on that list matters:
x402 is not EVM-only, so a non-EVM chain is not excluded in principle.

**What it cannot do today.** **Nockchain is not an x402 network**, and
adding it is three layers deep, none of them configuration:

1. a **scheme** for Nockchain — how a payment authorization is
   represented and verified (`exact` is signature-authorization
   shaped, with per-chain bindings);
2. a **facilitator** that verifies and settles Nockchain payments;
3. **client** support, in whatever wallet the paying agent drives.

That is protocol and ecosystem work with a dependency on people who are
not us.

**And this template is single-network by construction.** One `NETWORK`
var and one `PAY_TO`, global — not per pattern. Emitting multiple
`accepts` entries means editing `src/`, which breaks the vendoring
discipline stated at the top of this file ("byte-for-byte diffs live in
`wrangler.jsonc` only") and puts us on the hook for re-applying a
source diff every time the upstream template moves. That cost is the
reason to look for another seam.

**The cheaper seam, which gets what the question actually wants.** The
gate here is **a JWT cookie, not x402**. `src/auth.ts` checks for a
valid cookie first and applies the payment middleware *only when cookie
auth fails*. So x402 is one **issuer** of the cookie, not the
gatekeeper. A second issuer is additive:

    POST /pay/nock  →  verify a Nockchain payment  →  mint the same JWT

with a longer TTL, or a lower implied price, than the x402 path grants.
The discount is then expressed as *what a cookie costs you* rather than
as an x402 price, the x402 middleware is untouched, and the vendored
template stays byte-identical. This is where a Nockchain rate should
live.

**What that still costs.** Verifying a Nockchain payment from a Worker
needs a node or indexer reachable over HTTP, which the project does not
have. That lands in the same place as the check-service question above:
going from a static site to operating something. Both decisions want
the same prerequisite, so they should be taken together.

**Timing.** Premature while the only protected path is `/demo/*`.
Recorded because it is the strategically distinctive piece: Jock
compiles to Nock, so pricing the toolchain's own services in Nock
closes a loop, and a discount is an adoption lever for Nockchain rather
than only for Jock.

**The testable intermediate**, if the idea is worth exercising before
Nockchain can carry a payment: differential pricing across networks
x402 *already* supports — Base against Polygon against Solana. It still
needs the template fork for multiple `accepts`, but no new scheme, no
new facilitator, and no node to run. That would prove the pricing shape
without the ecosystem dependency.

### Phase 2, preserved for later

These steps need registrar/Cloudflare account access directly.

1. Add `jock.is` as a zone in Cloudflare (free plan is enough).
2. In Cloudflare DNS, recreate the apex as a CNAME-flattened record to
   `sigilante.github.io`, proxied (orange cloud) — replacing the four A
   and four AAAA records in the top-level `README.md`'s DNS table.
3. At the registrar, change jock.is's nameservers to the two Cloudflare
   assigns. **This is the cutover**; until this step nothing changes for
   live traffic.
4. Uncomment the `routes` block in `wrangler.jsonc` (`jock.is/*`, zone
   `jock.is`) and redeploy.
5. Replace the placeholder `PAY_TO` with a real Base mainnet receiving
   address and switch `NETWORK` to `"base"`.
6. Verify `https://jock.is/` still returns the ordinary free site, and
   that a request under the protected pattern returns 402.

Rolling back is reverting the nameservers at the registrar; jock.is's
own A/AAAA records do not need to be touched or deleted, only the
nameserver delegation.

<!-- dash-content-start -->

# x402 Payment-Gated Proxy (upstream template docs)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/x402-proxy-template)

A Cloudflare Worker that acts as a transparent proxy with payment-gated access using the [x402 protocol](https://x402.org) and stateless cookie-based authentication.

**Live Demo** - Try the built-in endpoints (other routes will fail as no origin is configured):

- [/\_\_x402/health](https://x402proxy-template.news.eti.cfdata.org/__x402/health) - Public health check (200 OK)
- [/\_\_x402/protected](https://x402proxy-template.news.eti.cfdata.org/__x402/protected) - Protected endpoint (402 Payment Required)

<!-- dash-content-start -->

## Overview

This template implements a **smart proxy** that:

1. **Forwards all requests** to the origin server by default
2. **Intercepts protected routes** based on configurable patterns
3. **Requires payment** via the x402 protocol for protected routes
4. **Issues JWT cookies** valid for 1 hour after payment
5. **Allows access** to protected routes without additional payments during the valid period

> **Note:** This template is configured for Base Sepolia testnet. For production, update `NETWORK` in `wrangler.jsonc` to a mainnet network (e.g., `"base"`).

### Use Cases

This proxy is ideal for:

- **API Monetization** - Charge per API request or time-based access
- **Premium Content** - Paywall specific routes without modifying your backend
- **Rate Limiting with Payments** - Convert rate limits into paid tiers
- **Microservice Access Control** - Add payment gates to existing services
- **Demo/Testing Payment Flows** - Prototype payment-gated services quickly

### Key Features

- 🔄 **Transparent Proxy** - Forwards all non-protected requests unchanged
- 🎯 **Pattern-Based Protection** - Configure which routes require payment
- 🔐 **Stateless Authentication** - JWT cookies with HMAC-SHA256 signatures
- 💰 **x402 Protocol Integration** - Accept crypto payments for access
- 🍪 **Cookie-Based Sessions** - No server-side storage required
- ⚡ **Edge Computing** - Runs on Cloudflare Workers at the edge
- 🔒 **Secure** - HttpOnly, Secure, SameSite cookies
- 📦 **Lightweight** - Minimal overhead, custom JWT implementation (~2-3 KB)

## Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  Cloudflare Worker (x402 Proxy)          │
│                                          │
│  ┌────────────────────────────────┐     │
│  │  Pattern Matcher               │     │
│  │  Is path protected?            │     │
│  └────────┬──────────────┬────────┘     │
│           │ NO           │ YES          │
│           ▼              ▼              │
│  ┌────────────┐  ┌──────────────────┐  │
│  │ Pass       │  │ Auth Middleware  │  │
│  │ Through    │  │ • Check cookie   │  │
│  └────────────┘  │ • Verify payment │  │
│                  │ • Issue cookie   │  │
│                  └──────────────────┘  │
│                           │             │
└───────────────────────────┼─────────────┘
                            ▼
                  ┌──────────────────┐
                  │  Origin Server   │
                  │  (Your Backend)  │
                  └──────────────────┘
```

<!-- dash-content-end -->

## Quick Start

Get up and running in under 2 minutes:

```bash
# Install dependencies
npm install

# Configure JWT secret for local development
cp .dev.vars.example .dev.vars
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))" >> .dev.vars

# Start the dev server
npm run dev
```

Visit `http://localhost:8787` to see the proxy in action.

- Try `http://localhost:8787/__x402/health` for a public endpoint
- Try `http://localhost:8787/__x402/protected` to see payment requirements

## Getting Started

> _Already ran Quick Start above? Skip to [How It Works](#how-it-works)._

### Prerequisites

- Node.js 18+
- npm or yarn
- Cloudflare account (for deployment)
- A wallet address to receive payments (see [Getting a Wallet Address](#getting-a-wallet-address) below)
- Testnet tokens for testing payments (get from [CDP Faucet](https://docs.cdp.coinbase.com/faucets/introduction/welcome))

### Getting a Wallet Address

You need a wallet address (`PAY_TO`) to receive payments. Any Ethereum-compatible wallet works—use an existing wallet (MetaMask, Coinbase Wallet, etc.) or create one programmatically with [Coinbase Developer Platform](https://docs.cdp.coinbase.com/server-wallets/v2/introduction/quickstart).

### Installation

```bash
npm install
```

### Configuration

#### Configuration Options

The proxy is configured via environment variables in `wrangler.jsonc`:

| Variable             | Required | Description                                    | Example                          |
| -------------------- | -------- | ---------------------------------------------- | -------------------------------- |
| `PAY_TO`             | Yes      | Wallet address to receive payments             | `"0x..."`                        |
| `NETWORK`            | Yes      | Blockchain network for payments                | `"base-sepolia"` or `"base"`     |
| `JWT_SECRET`         | Yes      | Secret for signing auth tokens (set as secret) | (64 hex chars)                   |
| `PROTECTED_PATTERNS` | Yes      | Array of route pricing configurations          | See below                        |
| `ORIGIN_URL`         | No       | External URL to proxy to (if not using DNS)    | `"https://api.example.com"`      |
| `ORIGIN_SERVICE`     | No       | Service Binding to origin Worker               | Configured in wrangler.jsonc     |
| `FACILITATOR_URL`    | No       | x402 facilitator endpoint (defaults to CDP)    | `"https://x402.org/facilitator"` |

#### PROTECTED_PATTERNS

Each entry defines a protected route and its payment requirements:

```jsonc
"PROTECTED_PATTERNS": [
  {
    "pattern": "/premium/*",
    "price": "$0.01",
    "description": "Access to premium content for 1 hour"
  },
  {
    "pattern": "/api/pro/*",
    "price": "$0.10",
    "description": "Pro API access"
  }
]
```

#### Proxy Modes

The proxy supports three modes for routing requests to your backend. Choose based on your architecture:

##### DNS-Based Mode (Default)

**Best for:** Traditional backend servers (VMs, containers, other hosting providers)

When `ORIGIN_URL` is **not set**, requests are forwarded to the origin server defined in your Cloudflare DNS records.

**Setup:**

1. Add a DNS record in Cloudflare pointing to your origin server:
   - Type: `A` (for IP address) or `CNAME` (for hostname)
   - Name: `api` (or your subdomain)
   - Content: Your origin server IP or hostname
   - Proxy status: **Proxied** (orange cloud)

2. Configure a route in `wrangler.jsonc`:

   ```jsonc
   "routes": [
     { "pattern": "api.example.com/*", "zone_name": "example.com" }
   ]
   ```

3. Deploy. The proxy will forward requests to your origin server automatically.

```
User → api.example.com → x402 Proxy → Origin Server (via DNS)
```

##### External Origin Mode

**Best for:** Another Cloudflare Worker, or any external service with a public URL

When `ORIGIN_URL` **is set**, requests are rewritten to that URL. This lets you proxy to another Worker on a Custom Domain or any external API.

**Setup:**

1. Set `ORIGIN_URL` in `wrangler.jsonc`:

   ```jsonc
   "vars": {
     "ORIGIN_URL": "https://my-origin-worker.example.com",
     // ... other vars
   }
   ```

2. If your origin is a Worker, deploy it with a [Custom Domain](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).

3. Deploy the proxy. Requests are rewritten to the origin URL while preserving the original `Host` header.

```
User → api.example.com → x402 Proxy → my-origin-worker.example.com (URL rewrite)
```

**Why External Origin mode?** Cloudflare routes a hostname to one Worker only. You can't chain Workers on the same hostname via routing. External Origin mode solves this by rewriting the URL to a different hostname where your origin Worker lives.

##### Service Binding Mode

**Best for:** Another Cloudflare Worker in your account (fastest option)

When `ORIGIN_SERVICE` **is bound**, requests are sent directly to the bound Worker with zero network overhead. Both Workers run on the same thread.

**Setup:**

1. Add a service binding in `wrangler.jsonc`:

   ```jsonc
   "services": [
     { "binding": "ORIGIN_SERVICE", "service": "my-origin-worker" }
   ]
   ```

2. Deploy. The proxy will call the origin Worker directly via the binding.

```
User → api.example.com → x402 Proxy → Origin Worker (via Service Binding)
```

**Why Service Binding mode?** [Service Bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/) provide the fastest Worker-to-Worker communication with no network hop. The origin Worker doesn't even need a public route.

##### Quick Comparison

| Mode            | Config           | Origin Type           | Use Case                                          |
| --------------- | ---------------- | --------------------- | ------------------------------------------------- |
| DNS-Based       | (default)        | Traditional server    | Your backend is a VM, container, or external host |
| External Origin | `ORIGIN_URL`     | Worker or any URL     | Your backend is another Worker or external API    |
| Service Binding | `ORIGIN_SERVICE` | Worker (same account) | Fastest option for Worker-to-Worker               |

#### Local Development Setup

1. **Copy the example environment file:**

   ```bash
   cp .dev.vars.example .dev.vars
   ```

2. **Generate a secure JWT secret:**

   ```bash
   node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))" >> .dev.vars
   ```

3. **Verify your `.dev.vars` file contains:**
   ```bash
   JWT_SECRET=<your-generated-secret>
   ```

### Development

Start the development server:

```bash
npm run dev
```

The server will be available at `http://localhost:8787`

### Available Scripts

**Most commonly used:**

| Command          | Description                    |
| ---------------- | ------------------------------ |
| `npm run dev`    | Start local development server |
| `npm run deploy` | Deploy to Cloudflare Workers   |

**Other scripts:**

| Command                | Description                                  |
| ---------------------- | -------------------------------------------- |
| `npm run cf-typegen`   | Generate TypeScript types from Worker config |
| `npm run typecheck`    | Run TypeScript type checking                 |
| `npm run format`       | Format code with Prettier                    |
| `npm run format:check` | Check code formatting                        |
| `npm run lint`         | Run all checks (typecheck + format + ESLint) |
| `npm run lint:fix`     | Auto-fix formatting and linting issues       |
| `npm run test:client`  | Run automated end-to-end test                |

## How It Works

### Key Implementation Details

Understanding the core concepts will help you configure and use this proxy effectively.

#### Stateless JWT Authentication

The proxy uses a custom JWT implementation built on Web Crypto API:

- **Signing:** HMAC-SHA256 with secret key
- **Payload:** `{ paid: true, iat, exp }`
- **Validation:** Signature verification + expiration check
- **Size:** ~2-3 KB minified (no dependencies)

#### Payment Flow

1. Client requests protected route (e.g., `/premium`) without cookie
2. Proxy responds with `402 Payment Required` + payment details
3. Client creates signed payment (e.g., for USDC on Base Sepolia)
4. Client retries request with `X-PAYMENT` header
5. x402 middleware verifies payment via facilitator
6. Proxy issues JWT cookie + forwards request to origin
7. Subsequent requests use cookie (valid for 1 hour) - no payment needed
8. Origin server receives authenticated requests transparently

**Key insight:** The origin server never knows about the payment logic. It just receives authenticated requests as if the proxy wasn't there.

### Proxy Behavior

The worker acts as a **transparent proxy** that forwards all requests to your origin server, except for routes matching the `PROTECTED_PATTERNS` configuration.

### Public Routes (Default)

Any route NOT in `PROTECTED_PATTERNS` is forwarded directly to the origin:

```bash
curl https://your-worker.dev/any-path
# → Proxied directly to origin server
```

### Protected Routes

Routes matching `PROTECTED_PATTERNS` require payment or a valid authentication cookie:

**Without payment or cookie:**

- Returns `402 Payment Required`
- Includes payment requirements in response body

**With valid payment:**

- Verifies payment via x402 facilitator
- Issues JWT cookie (valid for 1 hour)
- Proxies request to origin server

**With valid cookie:**

- Validates JWT signature and expiration
- Proxies request to origin immediately (no payment required)

### Example: `/premium` endpoint

```bash
# First request without auth
curl https://your-worker.dev/premium
# → 402 Payment Required

# Request with payment
curl https://your-worker.dev/premium -H "X-PAYMENT: <encoded-payment>"
# → Cookie issued + request proxied to origin

# Subsequent requests with cookie
curl https://your-worker.dev/premium -H "Cookie: auth_token=..."
# → Proxied to origin (no payment needed)
```

## Testing

### Automated Testing

Run the automated test client:

```bash
PRIVATE_KEY=0x... npm run test:client
```

This will:

1. Request `/premium` without payment (receives 402)
2. Create and sign a payment with your wallet
3. Submit payment and receive premium content
4. Extract JWT cookie
5. Test cookie authentication (no payment needed)

See [TESTING.md](./TESTING.md) for detailed testing instructions.

### Manual Testing with curl

1. **Test public endpoint:**

```bash
curl http://localhost:8787/__x402/health
```

2. **Request protected endpoint (no payment):**

```bash
curl -v http://localhost:8787/__x402/protected
# Returns 402 with payment requirements
```

3. **Request with payment (requires x402 SDK):**
   See test-client.ts for implementation example

> **Note:** Automated testing with `npm run test:client` requires a funded wallet with testnet tokens. If you're just evaluating the template, the Playwright tests (`pnpm test:e2e x402-proxy-template` from repo root) cover core functionality without requiring payments.

## Project Structure

```
.
├── src/
│   ├── index.ts          # Main application and routes
│   ├── auth.ts           # Authentication middleware
│   └── jwt.ts            # JWT utilities (sign/verify)
├── public/
│   └── index.html        # Static assets
├── test-client.ts        # Automated test client
├── wrangler.jsonc        # Cloudflare Worker configuration
├── .dev.vars             # Local environment variables (gitignored)
├── .prettierrc           # Prettier configuration
├── eslint.config.js      # ESLint configuration
└── tsconfig.json         # TypeScript configuration
```

## Advanced Configuration

### Proxy Architecture

The worker uses a single catch-all middleware that:

1. **Checks path** against `PROTECTED_PATTERNS`
2. **For unprotected paths**: Proxies request immediately to origin
3. **For protected paths**:
   - Checks for valid JWT cookie
   - If no valid cookie, requires x402 payment
   - Issues JWT cookie on successful payment
   - Proxies authenticated request to origin

The proxy mode (DNS-based, External Origin, or Service Binding) determines how requests reach your backend. See [Proxy Modes](#proxy-modes) for details.

### Configuration Examples

**Single route with one price:**

```jsonc
"PROTECTED_PATTERNS": [
  {
    "pattern": "/premium",
    "price": "$0.01",
    "description": "Access to premium content for 1 hour"
  }
]
```

**Multiple routes with different prices:**

```jsonc
"PROTECTED_PATTERNS": [
  {
    "pattern": "/premium",
    "price": "$0.01",
    "description": "Basic premium access"
  },
  {
    "pattern": "/api/pro/*",
    "price": "$0.10",
    "description": "Pro API access"
  },
  {
    "pattern": "/dashboard",
    "price": "$1.00",
    "description": "Full dashboard access"
  }
]
```

**Wildcard patterns:**

```jsonc
"PROTECTED_PATTERNS": [
  {
    "pattern": "/api/private/*",
    "price": "$0.05",
    "description": "Private API access"
  }
]
```

## Security Considerations

### Cookie Security

Cookies are configured with security best practices:

- `HttpOnly`: Prevents JavaScript access (XSS protection)
- `Secure`: HTTPS only in production
- `SameSite=Strict`: CSRF protection
- 1-hour expiration: Limits exposure window

### JWT Security

- Secret key stored in environment variables (not in code)
- HMAC-SHA256 cryptographic signing
- Expiration validation on every request
- No sensitive data in payload

### Payment Security

- All payments verified through facilitator
- Client cannot forge payment proofs
- Payment amount validation
- Network/token validation

## Bot Management Filtering (Optional)

With **Bot Management for Enterprise** enabled on your domain, x402-proxy can distinguish between human and automated traffic:

- Humans can access protected routes without payment
- Bots are charged unless explicitly exempted
- You can allow specific crawlers (e.g., Googlebot, search engines) free access

### Configuration Example

```jsonc
"PROTECTED_PATTERNS": [
  {
    "pattern": "/api/premium/*",
    "price": "$0.10",
    "description": "Premium API access",
    "bot_score_threshold": 30,           // Lower score = more likely automated
    "except_detection_ids": [
      120623194,  // Googlebot
      132995013   // ChatGPT-User
    ]
  }
]
```

The configuration uses two settings:

- `bot_score_threshold` (1-99) - determines the cutoff for blocking bot traffic and allowing humans through. See [Bot Score](https://developers.cloudflare.com/bots/concepts/bot-score/) for how scores are calculated.
- `except_detection_ids` - array of bot detection IDs to whitelist. A sample list is available in [`src/bots.ts`](./src/bots.ts).

Without Bot Management, all traffic to protected routes requires payment.

## Deployment

### Production Deployment

> **Important:** For production, update `NETWORK` in `wrangler.jsonc` to a mainnet network (e.g., `"base"`).

1. **Set up secrets:**

```bash
wrangler secret put JWT_SECRET
# Enter your production JWT secret
```

2. **Update configuration:**
   Edit `wrangler.jsonc` with your production wallet address and mainnet network

3. **Deploy:**

```bash
npm run deploy
```

### Environment-Specific Configuration

For multiple environments (dev/staging/prod), use [Wrangler environments](https://developers.cloudflare.com/workers/wrangler/configuration/#environments).

## Development

### Code Quality

The project enforces code quality through:

- **TypeScript** - Full type safety
- **ESLint** - Code quality rules
- **Prettier** - Consistent formatting
- **Pre-commit checks** - All checks run via `npm run lint`

### Adding New Protected Routes

Simply add a new entry to `PROTECTED_PATTERNS` in `wrangler.jsonc`:

```jsonc
{
	"vars": {
		"PROTECTED_PATTERNS": [
			{
				"pattern": "/premium",
				"price": "$0.01",
				"description": "Premium content access",
			},
			{
				"pattern": "/api/private/*",
				"price": "$0.05",
				"description": "Private API access",
			},
			{
				"pattern": "/dashboard",
				"price": "$0.10",
				"description": "Dashboard access",
			},
		],
	},
}
```

**That's it!** No code changes needed. The proxy will automatically:

- Require payment for routes matching any pattern
- Apply the correct price for each route
- Issue cookies after payment
- Forward authenticated requests to your origin server

## Troubleshooting

### "Invalid payment" error

- Check wallet has enough testnet tokens
- Verify you're on Base Sepolia network
- Ensure payment amount matches requirement

### Cookie doesn't work

- Check cookie isn't expired (1 hour validity)
- Verify JWT_SECRET is set in `.dev.vars`
- Ensure cookie is being sent in request headers

### TypeScript errors

- Run `npm run cf-typegen` to regenerate types after changing `wrangler.jsonc`
- Check `tsconfig.json` includes correct files

## Resources

- [x402 Protocol Documentation](https://x402.gitbook.io/x402)
- [x402 GitHub](https://github.com/coinbase/x402) - Open source repository
- [CDP Server Wallet Quickstart](https://docs.cdp.coinbase.com/server-wallets/v2/introduction/quickstart) - Create wallets programmatically
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Service Bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/) - Worker-to-Worker communication
- [Base Sepolia Testnet](https://docs.base.org/network-information/#base-testnet-sepolia)

## License

This project is provided as-is for educational and demonstration purposes.

## Contributing

This is a demonstration project. For questions or issues, please refer to the [x402 Discord](https://discord.gg/invite/cdp).
