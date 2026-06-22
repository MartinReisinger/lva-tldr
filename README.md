# LVA TL;DR

Compact learning notes with small interactive examples. The first topic is the Formal Models exam reference; additional topics can be added as Markdown pages.

## Stack

| Area | Technology |
| --- | --- |
| Framework | Nuxt 4 and Vue 3 |
| UI | Nuxt UI 4 and Tailwind CSS 4 |
| Content | Nuxt Content 3 with Markdown/MDC |
| Mathematics | KaTeX through remark-math and rehype-katex |
| Tests | Vitest and Playwright |
| Runtime | Node.js 24, pnpm 11 |

## Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. To expose the development server on the local network, use `pnpm dev:host`.

## Verification

```bash
pnpm nuxi prepare
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

## Content

Topics live in `content/`. Each page needs this frontmatter:

```yaml
---
title: Topic title
description: Short overview text.
order: 1
kind: topic
---
```

The filename becomes the route. For example, `content/formal-models.md` is available at `/formal-models`.

One-level collections use a folder with an `index.md` marked as `kind: group`:

```text
content/pr-software2/
├── index.md       # /pr-software2
├── ai2026-1.md    # /pr-software2/ai2026-1
└── exam2025.md    # /pr-software2/exam2025
```

Child pages use `kind: topic`. Deeper nested collections are not supported.

Use `$...$` for inline LaTeX and `$$...$$` for display formulas. Fixed interactive examples use Nuxt Content MDC:

```md
::automata-example{variant="power"}
::
```

Keep examples small and explanatory. This is a reference site, not a quiz or graph editor.

## Project Structure

```text
app/                    Nuxt pages and components
content/                Canonical Markdown topics
tests/unit/             Vitest tests
tests/e2e/              Playwright tests
deploy/vps/compose.yml  VPS container definition
```

## Docker

```bash
docker build -t lva-tldr .
docker run --rm -p 3000:3000 lva-tldr
```

The production container runs the Nitro output with Node.js 24.

## Deployment

Pushes to `main` build, publish the image to GHCR, and deploy it over SSH. Configure these GitHub repository secrets:

- `SSH_HOST`
- `SSH_PRIVATE_KEY`

On the VPS, store the Compose file at `/home/deploy/lva-tldr/compose.yml`. The app binds to `127.0.0.1:3009`.

Set up a reverse proxy pointing `lva-tldr.martindev.at` to `3009` (e.g. using Caddy):

```caddyfile
lva-tldr.martindev.at {
    reverse_proxy 127.0.0.1:3009
}
```

## Relevant Documentation

- [Nuxt UI theming](https://ui.nuxt.com/getting-started/theming)
- [Nuxt UI ContentToc](https://ui.nuxt.com/docs/components/content-toc)
- [Nuxt Content Markdown and MDC](https://content.nuxt.com/docs/files/markdown)
- [Nuxt Content configuration](https://content.nuxt.com/docs/getting-started/configuration)
- [remark-math and rehype-katex](https://github.com/remarkjs/remark-math)
