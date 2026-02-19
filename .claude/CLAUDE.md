Project Overview
- A Figma plugin that enables designers to insert formatted biblical text directly into their designs. The plugin fetches content from a Bible API and converts it into native Figma text objects with proper markdown formatting (bold, italic, superscripts for verse numbers).

Core Value Proposition
- Streamline the workflow for designers working with biblical content by eliminating manual copy-paste and formatting tasks.

Monorepo Structure
- This project is a **pnpm monorepo**. When working on tasks, first determine whether the change belongs to the **plugin** (`packages/plugin/`) or the **web app** (`packages/web-app/`), then explore that package accordingly.


Documentation:
- Use Context 7 when you're trying to understand the latest documentation.


Technical Architecture:

```jsx
Architecture Overview
┌─────────────────────────────────────────────────────────┐
│ Figma Plugin (code.ts - Main Thread/Sandbox)           │
│  - Receives messages from iframe                        │
│  - Creates/manipulates Figma nodes                      │
│  - Calls figma.showUI() with external URL               │
└──────────────────┬──────────────────────────────────────┘
                   │ postMessage
                   ↓
┌─────────────────────────────────────────────────────────┐
│ iframe (loads external URL)                             │
│  https://yourdomain.com/plugin                          │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────────┐
│ Hosted Web App (web-app/)                                │
│  - React SPA                                            │
│  - Same-origin with Bible API (or proper CORS)         │
│  - Sends commands to parent via postMessage             │
│  - Receives data from parent via postMessage            │
└──────────────────┬──────────────────────────────────────┘
                   │ fetch (proper CORS headers)
                   ↓
┌─────────────────────────────────────────────────────────┐
│ Bible API                                               │
│  - Returns verse data                                   │
│  - CORS headers allow yourdomain.com                    │
└─────────────────────────────────────────────────────────┘
```

Project Structure:

```
bible-plugin/
├── packages/
│   ├── plugin/                   # Figma plugin (sandbox main thread)
│   └── web-app/src/              # Hosted React SPA
│       ├── main.tsx              # Entry point (RouterProvider)
│       ├── router.tsx            # Router creation + type registration
│       ├── routeTree.gen.ts      # Auto-generated (do not edit)
│       ├── routes/               # TanStack file-based routes (keep thin)
│       ├── features/             # Screen-specific co-located code
│       │   └── <screen>/         # e.g. home/, passage/, settings/
│       │       ├── components/
│       │       └── hooks/
│       ├── components/           # Shared reusable components
│       ├── hooks/                # Shared hooks
│       ├── lib/                  # Shared utilities
│       ├── types/                # Shared type definitions
│       └── styles/               # globals.css (Tailwind + design tokens)
│
└── shared/                       # Types shared across plugin & web-app
```

### Co-location Conventions

1. **Route files are thin** - Only `createFileRoute` + import from `features/`. The `routes/` directory is owned by TanStack Router's plugin.
2. **Co-locate by screen** - Screen-specific components/hooks live in `features/<screen>/`, not inside `routes/`.
3. **Promote when shared** - Code starts in `features/<screen>/`. When used by 2+ screens, move it to the shared `components/`, `hooks/`, or `lib/` directories.
4. **Path alias** - Use `@/` to import from `src/` (e.g., `import { foo } from '@/lib/foo'`). 

Component Breakdown:

1. Figma Plugin Component (plugin/)
- Runs in Figma's sandbox environment
- Has access to Figma scene APIs (text creation, styling)
- Loads external web app URL in iframe
- Listens for postMessage events containing verse data
- Creates/updates Figma text nodes with formatted content

2. Web App Component (web-app/)
- React SPA built with React 19 and TypeScript
- Hosted on external server (proper origin for CORS)
- Makes requests to Bible API
- Sends formatted verse data to plugin via postMessage

3. Shared Code (shared/)
- TypeScript types for message contracts
- Utility functions used by both components
- Ensures type safety across iframe boundary

---

## Development Commands

```bash
# Install dependencies (from root)
pnpm install

# Build plugin
pnpm run build:plugin
pnpm run dev:plugin

# Build web app
pnpm run build:web
pnpm run dev:web

```
