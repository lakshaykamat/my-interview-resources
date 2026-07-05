# Zed Mode Design

## Context

The app is a Next.js 16 App Router project that loads Notion content on the server and renders child pages through `src/components/notion-content.tsx`. Detail pages currently show the full Notion page as one continuous article with a table of contents generated from headings.

Next.js local docs confirm pages are Server Components by default, and interactive UI should be isolated in Client Components with `"use client"`. Zed mode needs client-side state for the toggle and question navigation, but Notion fetching should remain server-side.

## Goal

Add an optional Zed mode to child Notion pages. When the user turns it on, the page shows exactly one question and its answer at a time, with Previous and Next controls.

## Content Model

Questions are Notion headings:

- `heading_1`
- `heading_2`
- `heading_3`

The answer for a question is every following block until the next heading. Empty answer groups are allowed and should render the question with a muted empty-answer message instead of breaking navigation.

Blocks before the first heading are intro content. In normal mode they render as they do today. In Zed mode they should not become a question.

## UI Behavior

Normal mode remains the default and keeps the current full article rendering.

The child page adds a compact Zed mode control near the article header. When enabled:

- Show one question heading and its answer blocks.
- Show progress as `current / total`.
- Provide Previous and Next buttons.
- Disable Previous on the first question.
- Disable Next on the last question.
- Clamp the active question index if the grouped question list changes.
- If no headings exist, do not render the Zed mode control and keep the full article visible.

The mode does not need to persist across page reloads in the first version.

## Architecture

Keep Notion loading in the existing server page. Add a client component that receives the already-normalized `NotionContentBlock[]`, builds question groups in the browser, and decides whether to render the full article or the current Zed card.

Expose small pure helpers for:

- detecting heading blocks
- converting rich text to plain text labels where needed
- grouping blocks into `{ question, answerBlocks }`

Reuse the existing `NotionContent` renderer for both full article mode and answer rendering so block support stays centralized.

## Accessibility

The toggle must be a real button or switch-style button with clear pressed state. Navigation buttons must be disabled using native `disabled` attributes. The current question heading should remain a semantic heading, and progress text should be available to assistive technology.

## Testing

Run lint after implementation. Add focused tests only if the project already has a test harness by implementation time; otherwise verify grouping manually with representative heading/content arrays during development.

## Out of Scope

- Editing Notion content.
- Persisting Zed mode in local storage.
- URL-driven question index.
- Special handling for question markers like `Q:`.
