# LVA TL;DR

Compact learning notes with small interactive examples.

## Stack

| Area | Technology |
| --- | --- |
| Framework | Nuxt 4 and Vue 3 |
| UI | Nuxt UI 4 and Tailwind CSS 4 |
| Content | Nuxt Content 3 with Markdown/MDC and validated quiz banks |
| Quiz sync | Optional Google OAuth, Drizzle ORM, and SQLite |
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

In `content/`, use the same KaTeX math style as the existing pages: `$...$` for inline formulas and `$$...$$` for display formulas.

```md
$A_1 \subseteq A_2$

$$
B_i = E_i + \rho_i \sum_j F_{ij} B_j
$$
```

Raw Markdown downloads in `public/` are plain notes. Do not use inline math there; put formulas in fenced `math` code blocks instead.

Fixed interactive examples use Nuxt Content MDC:

```md
::automata-example{variant="power"}
::
```

Keep examples small and explanatory. Larger practice systems use the reusable quiz component instead of being embedded in topic prose.

## Quiz authoring

Question banks are Nuxt Content data files in `content/quizzes/`. Each bank has a stable `quizId`, a bank `version`, and an array of questions. Questions need a stable numeric `id`, a `revision`, a supported `type`, and either a text answer or answer options.

See [Quiz authoring](docs/quiz-authoring.md) for the complete JSON format, examples for every question type, revision rules, page integration, persistence behavior, and the validation checklist.

Render a bank from a topic Markdown file with:

```md
::quiz-trainer{quiz-id="computer-graphics"}
::
```

The shared trainer completes a question after two correct submissions, always keeps five different questions between attempts, and prioritizes questions without a current correct answer. Answer options are randomized on each appearance; shuffling deals a new current question and reorders the unseen queue. A wrong answer resets the unfinished streak. Increment a question's `revision` when its expected answer changes; only that question's saved mastery is reset.

## Optional quiz sync

Quiz progress is always saved locally in the browser. Google sign-in optionally synchronizes it between devices. Copy `.env.example` to `.env` and configure a Google OAuth web client plus a session password of at least 32 characters. The authorized redirect URI is `/auth/google` on the deployed origin.

Authenticated users and their per-quiz progress are stored through Drizzle ORM in SQLite. The database defaults to `.data/quiz-progress.sqlite`; production mounts `.data` on the `quiz-data` Docker volume. Google access tokens are not stored.

## Project Structure

```text
app/                    Nuxt pages and components
content/                Canonical Markdown topics
content/quizzes/        Validated quiz question banks
server/db/              Drizzle schema and SQLite migrations
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

## Relevant Documentation

- [Nuxt UI theming](https://ui.nuxt.com/getting-started/theming)
- [Nuxt UI ContentToc](https://ui.nuxt.com/docs/components/content-toc)
- [Nuxt Content Markdown and MDC](https://content.nuxt.com/docs/files/markdown)
- [Nuxt Content configuration](https://content.nuxt.com/docs/getting-started/configuration)
- [remark-math and rehype-katex](https://github.com/remarkjs/remark-math)
