# Quiz authoring

Quizzes use a shared trainer and scheduler. A new quiz normally needs only a Nuxt Content question bank and a topic Markdown page. Do not copy quiz questions into Vue components or load them from an external HTML file.

## 1. Create the question bank

Add `content/quizzes/<quiz-id>.json`. The quiz ID must contain only lowercase letters, numbers, and hyphens, and it should match the filename.

```json
{
  "quizId": "example-course",
  "version": 1,
  "questions": [
    {
      "id": 1,
      "revision": 1,
      "type": "text",
      "question": "How many segments are required?",
      "answer": "2",
      "reason": "One primary segment reaches the surface and one shadow segment reaches the light."
    },
    {
      "id": 2,
      "revision": 1,
      "type": "single",
      "question": "Which complexity is the target?",
      "options": [
        {
          "text": "Sub-linear",
          "correct": true,
          "explanation": "The hierarchy rejects groups of candidates at once."
        },
        {
          "text": "Cubic",
          "correct": false,
          "explanation": "Cubic growth would be worse than brute-force testing."
        }
      ]
    },
    {
      "id": 3,
      "revision": 1,
      "type": "multiple",
      "question": "Which effects require distribution sampling?",
      "options": [
        {
          "text": "Soft shadows",
          "correct": true,
          "explanation": "An area light is sampled at multiple positions."
        },
        {
          "text": "Glossy reflections",
          "correct": true,
          "explanation": "Several directions in the reflection lobe are sampled."
        },
        {
          "text": "Depth buffering",
          "correct": false,
          "explanation": "Depth buffering is a rasterization visibility technique."
        }
      ]
    }
  ]
}
```

### Bank fields

- `quizId`: Stable identifier used by Nuxt Content, local storage, API routes, and SQLite.
- `version`: Bank release metadata. Increment it for a meaningful bank-wide revision; it does not reset user progress by itself.
- `questions`: At least six question objects so five different questions can always separate repeated attempts.

### Fields shared by every question

- `id`: Stable, unique positive integer within the bank. Never reuse an ID for a different question.
- `revision`: Positive integer for the expected answer. Increment it when correctness changes; saved progress resets only for that question.
- `type`: `text`, `single`, or `multiple`.
- `question`: Plain question text.
- `reason`: Optional explanation, normally used by text questions.

### Answer rules

- `text` requires `answer`. Comparison trims surrounding whitespace and ignores letter case, but is otherwise exact.
- `single` requires a non-empty `options` array and should have exactly one correct option.
- `multiple` requires a non-empty `options` array and may have several correct options. The submission is correct only when the selected set matches all correct options exactly.
- Every option requires `text` and `correct`. Add `explanation` so learners can understand both correct and incorrect choices.
- Keep question and answer strings as plain text. Do not embed scripts or interactive HTML.

## 2. Create the topic page

Add a direct child topic according to the repository's one-level collection rules, for example `content/example-course/quiz.md`:

```md
---
title: Example Course Quiz
description: Practice the course question bank with spaced mastery.
order: 6
kind: topic
updatedAt: "2026-08-09T16:30:00+02:00"
---

::quiz-trainer{quiz-id="example-course"}
::
```

Use the actual Europe/Vienna timestamp. The generic trainer loads the matching bank; no quiz-specific Vue component, API route, database table, or registry entry is needed.

For the widest quiz layout, keep a dedicated quiz page free of additional Markdown headings. Normal topic headings enable the page TOC column.

## 3. Understand saved progress

The shared trainer automatically provides:

- Two correct submissions to complete each question.
- At least five different submitted questions between appearances.
- Priority for questions that do not currently have a correct answer; questions waiting for their second correct answer return later.
- Completed questions return as review questions when needed to preserve spacing near the end. Review results do not undo their completed status.
- A reset to streak `0/2` after a wrong unfinished submission.
- A persistent question order that users can shuffle for questions they have not seen yet.
- A fresh randomized answer-option order on every question appearance.
- Keyboard controls: number keys select visible options or toggle their explanations, and Enter checks or advances.
- Local browser persistence for anonymous users.
- Optional Google synchronization when configured.
- Conflict-safe merging between local and synchronized progress.
- Per-question progress resets when `revision` changes.

Authenticated progress is stored in the existing `quiz_progress` table under the `(user_id, quiz_id)` key. Adding a bank does not require a migration.

## 4. Validate the quiz

Before committing:

```bash
pnpm typecheck
pnpm test
```

Also add focused unit coverage for bank-specific assumptions such as question count, unique IDs, valid correct-option counts, and required explanations. Add Playwright coverage for any behavior that differs from the shared trainer.

Review this checklist:

- The filename and `quizId` match.
- The bank contains at least six questions.
- Question IDs are unique and stable.
- Every question has `revision: 1` initially.
- Text questions have an `answer`.
- Single-choice questions have exactly one correct option.
- Multiple-choice questions have at least one correct option.
- Options include useful explanations.
- The topic uses `::quiz-trainer` and valid frontmatter.
- The question bank is the canonical source; its prose is not duplicated in Vue files.
