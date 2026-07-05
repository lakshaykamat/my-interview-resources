# Notion Interview Reader Design

## Goal

Build a minimal Next.js page that fetches interview question notes from one root Notion page and presents them in a clean, readable layout.

## Scope

- Use the Notion API.
- Read content from one root Notion page.
- Fetch content server-side only.
- Render a read-only document-style page.
- Keep the UI minimal and clean.
- Handle missing configuration and Notion API failures with readable states.

Out of scope:

- Search.
- Topic filters.
- Editing.
- Authentication UI.
- Database support.
- Offline sync.
- Build-time content generation.

## Configuration

The app will read these environment variables from `.env.local`:

- `NOTION_TOKEN`
- `NOTION_ROOT_PAGE_ID`

The token must stay server-side and must not be exposed to client components.

## Data Flow

1. The browser requests `/`.
2. `src/app/page.tsx` runs as a server component.
3. The page calls a Notion data function with `NOTION_ROOT_PAGE_ID`.
4. The Notion data function fetches child blocks for the root page.
5. If a block is a Notion child page, the function fetches that page's blocks.
6. The page renders the normalized content as HTML.

## Content Model

Centralized types will live in one file, `src/types/notion.ts`.

The internal content model will represent only the block types the UI renders:

- Page sections.
- Headings.
- Paragraphs.
- Bulleted list items.
- Numbered list items.
- Toggles.
- Code blocks.
- Quotes.
- Callouts.
- Dividers.
- Unsupported blocks with a quiet fallback.

## Code Organization

- `src/app/page.tsx`
  - Reads configuration state.
  - Calls the Notion content loader.
  - Chooses between success, setup, and error UI states.

- `src/lib/notion.ts`
  - Owns the Notion client.
  - Fetches blocks.
  - Recursively fetches child pages.
  - Converts Notion API blocks into the internal content model.

- `src/components/notion-content.tsx`
  - Renders normalized content.
  - Keeps rendering logic separate from fetching logic.

- `src/types/notion.ts`
  - Centralizes all app-owned content types.

## UI Design

The page will use a restrained document layout:

- Light neutral background.
- Centered reading column.
- Clear page title.
- Subtle section spacing.
- Crisp typography.
- Simple borders for nested child pages.
- Monospace styling for code blocks.

The layout should feel like a focused study notebook, not a dashboard or landing page.

## Error Handling

Missing environment variables:

- Show a setup message listing the required variables.
- Do not throw an uncaught runtime error.

Notion API failure:

- Show a concise error message.
- Log the underlying server-side error with useful context.

Unsupported blocks:

- Render a subtle placeholder that names the unsupported block type.
- Do not break the whole page.

## Coding Constraints

The implementation must prioritize clarity over cleverness:

- Use simple, readable code.
- Prefer self-explanatory names.
- Keep functions single-purpose.
- Keep business logic lean.
- Extract utilities only for reused operations.
- Centralize types.
- Avoid circular dependencies.
- Handle errors idiomatically.
- Log meaningful server-side errors.
- Avoid comments that explain what code does; rewrite unclear code instead.
- Do not build abstractions for future requirements.

## Verification

Run:

- `npm run lint`
- `npm run build`

Manual verification after adding `.env.local`:

- The page loads without exposing the Notion token.
- Missing config displays the setup state.
- A valid root page displays interview content.
- Child pages render under their parent sections.
