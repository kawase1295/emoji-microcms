# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language Preference

**Always communicate in Japanese (日本語) when working in this repository.** The project is developed for Japanese users using microCMS, and all user-facing communication should be in Japanese.

## Project Overview

This is a microCMS field extension that provides an emoji picker interface. It runs as an iframe within the microCMS admin panel and communicates with the parent frame via postMessage API.

## Development Commands

```bash
# Install dependencies
bun install

# Development server with HMR (http://localhost:3000)
bun dev

# Production build (outputs to dist/)
bun run build

# Production server (requires build first)
NODE_ENV=production bun src/index.ts
```

## Architecture

### Core Communication Flow

The application uses an iframe-based architecture:

1. **microCMS admin panel** (parent) creates an iframe pointing to this extension
2. **Extension** (child iframe) loads and initializes `useFieldExtension` hook
3. **Two-way postMessage communication**:
   - Parent → Extension: Initial emoji data (when editing existing content)
   - Extension → Parent: Selected emoji data via `sendMessage()`

### Key Files & Responsibilities

- **`src/index.ts`**: Bun HTTP server serving static files with HMR support in dev mode
- **`src/frontend.tsx`**: React DOM mount point (entry for browser)
- **`src/App.tsx`**: Main component containing emoji picker logic and microCMS integration
- **`src/config.ts`**: Environment-based configuration (microCMS origin URL resolution)
- **`build.ts`**: Custom build orchestration with CLI argument parser

### Data Structure

The extension sends/receives emoji data in this format:

```typescript
interface EmojiData {
  id: string;        // emoji-mart ID (e.g., "grinning")
  native: string;    // Actual emoji character (e.g., "😀")
  unified: string;   // Unicode codepoint (e.g., "1F600")
  name?: string;     // Human name (e.g., "grinning face")
}
```

When sending to microCMS, the data is wrapped with metadata:
- `title`: The emoji itself (used for preview)
- `description`: Human-readable name + unicode
- `imageUrl`: Apple-style emoji image from jsDelivr CDN
- `data`: The EmojiData object above

### Build System

**Important**: The build process uses `build.ts` which:
- Parses CLI arguments (supports `--key=value`, `--key value`, boolean flags)
- Cleans `dist/` directory before building
- **Embeds environment variables at build time** via Bun's `define` option
- Processes Tailwind CSS via `bun-plugin-tailwind`
- Outputs minified bundles with external sourcemaps

**Critical**: `MICROCMS_ORIGIN` is **baked into the bundle** at build time. Changing this environment variable requires a rebuild.

## Environment Variables

### `MICROCMS_ORIGIN`

**Purpose**: CORS origin for postMessage validation between iframe and microCMS parent.

**Values**:
- **Development**: `*` (wildcard, automatically used when env var is not set)
- **Production**: `https://your-service-id.microcms.io` (REQUIRED for security)

**Configuration**:
```bash
# Create .env file (see .env.example)
echo "MICROCMS_ORIGIN=https://your-service-id.microcms.io" > .env
```

**Security Warning**: Never deploy to production without setting `MICROCMS_ORIGIN` to a specific origin. The wildcard `*` allows any parent frame to communicate with the extension.

## Dependency Constraints

### React Version Limitation

**The project MUST use React 18.x**, not React 19. The `@emoji-mart/react@1.1.1` package has a peer dependency that only supports `react@"^16.8 || ^17 || ^18"`.

If you see dependency resolution errors during `npm install` or deployment, check that:
- `react` and `react-dom` are pinned to `^18.3.1`
- `@types/react` and `@types/react-dom` are `^18`

## Deployment

### Build for Production

```bash
# Set environment variable
export MICROCMS_ORIGIN=https://your-service-id.microcms.io

# Build (env var is embedded in bundle)
bun run build

# Deploy dist/ folder to static hosting (Vercel, Netlify, Cloudflare Pages, etc.)
```

### Platform-Specific Notes

**Cloudflare Pages / Vercel / Netlify**:
- Set `MICROCMS_ORIGIN` environment variable in platform settings
- Build command: `bun run build`
- Output directory: `dist`
- Node version: 18+ (for build compatibility)

**Note**: The deployment may fail if using `npm` instead of `bun` due to peer dependency resolution. Use `npm install --legacy-peer-deps` or prefer `bun install`.

## Common Issues

### Build fails with "ERESOLVE unable to resolve dependency tree"

This happens when React 19 is installed. Downgrade to React 18:
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18",
    "@types/react-dom": "^18"
  }
}
```

### Data not saving in microCMS (production)

1. Verify `MICROCMS_ORIGIN` is set correctly in deployment platform
2. Ensure the origin matches your microCMS service domain exactly (no trailing slash)
3. Rebuild after changing environment variables (they're embedded at build time)

### Extension loads but doesn't respond to clicks

Check browser console for CORS/postMessage errors. This usually indicates:
- Incorrect `MICROCMS_ORIGIN` value
- microCMS service domain doesn't match the configured origin

## Integration with microCMS

### Setup in microCMS Admin

1. Navigate to API schema settings
2. Add a new field of type "拡張フィールド" (Extension Field)
3. Set the field URL to:
   - Development: `http://localhost:3000`
   - Production: Your deployed URL
4. Save the field

### Accessing Data from Frontend

The emoji data is returned in microCMS API responses:

```typescript
// API response structure
{
  emoji: {
    id: "grinning",
    native: "😀",
    unified: "1F600",
    name: "grinning face"
  }
}

// Usage in React/Next.js
<div className="text-6xl">{content.emoji.native}</div>
```

## TypeScript Configuration

The project uses strict TypeScript with:
- `strict: true` - Full type checking enabled
- `module: "Preserve"` - ESM syntax preserved for Bun
- Path alias: `@/*` → `./src/*`
- `allowImportingTsExtensions` - Direct `.ts`/`.tsx` imports allowed

## Tailwind CSS

Tailwind v4.1.11 is configured via `bun-plugin-tailwind`:
- `src/index.css` contains `@import` directives
- Processed during build by the plugin
- Custom animations defined in `index.css` (slide-in, spin-slow)
