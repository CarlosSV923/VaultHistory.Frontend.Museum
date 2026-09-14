# VaultHistory.Frontend.Museum

Vault History's web frontend. This repository hosts the public experience for exploring and generating stories, together with the authenticated library, profile, and subscription experiences.

The application uses **Next.js 16**, the App Router, and TypeScript. Server-side routes and the BFF communicate with the User and History microservices, so service tokens and other secrets are never exposed to the browser.

## Architecture

The codebase is organized with a simple, maintainable separation:

- `app/`: routes, layouts, and page composition with the App Router.
- `features/`: product use cases such as anonymous story generation, authentication, and the library.
- `entities/`: client-side domain contracts and models.
- `shared/`: UI components, utilities, configuration, and the HTTP client.

The initial routes are available at `/explore`, `/library`, `/sign-in`, `/register`, `/profile`, and `/subscription`. The App Router provides a shared loading state and reusable error boundary. Each screen intentionally starts from an initial state; integrations and forms are added in their respective stories.

A visitor's first visit is an anonymous experience. It does not show profiles or sample data as though it belonged to the current visitor.

## Local requirements

To work on this repository, you need:

- Node.js LTS.
- pnpm 11.
- Access to Vault History services or their development environment variables.

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

`USER_API_URL`, `HISTORY_API_URL`, and `HISTORY_FRONTEND_TOKEN` are server-only values. Do not rename them with the `NEXT_PUBLIC_` prefix or include them in client code. The authenticated session is stored in an HTTP-only cookie, and BFF routes forward authorized requests to User and History.

## Account, library, and subscription

`/register` and `/sign-in` use User through server-side routes and never store the JWT in `localStorage`. The `/library`, `/profile`, and `/subscription` routes only use the frontend BFF routes to list, create, and remove personal stories, and to update profile, password, and birthday preferences. An expired session returns the visitor to sign-in without exposing another account's stories.

## Theme and accessibility

The header control switches between light and dark themes. The preference is stored in the browser, and a pre-hydration script applies the theme to avoid a flash during loading. The UI includes visible focus, keyboard navigation, a skip-to-content link, and respects the system reduced-motion preference.

## Anonymous visitor experience

`/explore` can create and retrieve anonymous stories through `/api/anonymous-histories`. This BFF route reads `HISTORY_API_URL` and `HISTORY_FRONTEND_TOKEN` only on the server, resolves the request IP address, and forwards the contract required by History. The browser never receives that token or uses `localStorage` as the source of truth for the quota.

When History returns `429`, the UI displays a dialog with options to create an account, sign in, or keep exploring.

## Quality and testing

Run the following checks before opening a pull request or deploying to production:

```bash
pnpm validate:env
pnpm audit:dependencies
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm build
pnpm exec playwright install chromium # only before the first local E2E run
pnpm test:e2e
```

`pnpm verify` runs linting, type checking, unit tests, the production build, and E2E tests. Unit and component tests use Vitest with React Testing Library. Playwright covers the anonymous daily limit, theme persistence, and the sign-in-to-library journey in Chromium without calling real services: browser requests are intercepted with explicit test doubles.

Before a production release, run `pnpm audit:dependencies` and `pnpm verify`. If an E2E test fails, inspect its Playwright trace or screenshot, and verify that the pull request records responsive review and any User or History contract change.

## Deployment and security

Configure the following values only in the server environment or the hosting platform's secret store. Do not commit `.env.local`, and do not use the `NEXT_PUBLIC_` prefix for these values.

| Variable | Purpose |
| --- | --- |
| `USER_API_URL` | Trusted internal origin of the User service. |
| `HISTORY_API_URL` | Trusted internal origin of the History service. |
| `HISTORY_FRONTEND_TOKEN` | Server-only service token for History's anonymous BFF flow. |

Run `pnpm validate:env` before a local deployment. It validates required variable names and URL format without printing configured values. Production values belong in the deployment platform's secret store.

The browser communicates only with same-origin `/api/*` routes. Next.js route handlers attach a server-side service token or read the authenticated user's HTTP-only cookie before forwarding to User or History. JWTs and service tokens are never returned to browser JavaScript or stored in browser storage.

The frontend does not enable permissive CORS for BFF endpoints. When User or History are deployed to another origin, allow only the trusted frontend/BFF origin at the service boundary, or preferably keep the services on a private network. Never accept a client-selected upstream URL, identity, or visitor IP as a substitute for authorization.

`next.config.ts` disables `X-Powered-By` and adds content security, framing, content type, referrer, permissions, DNS-prefetch, and cross-origin opener policies to every route. The current CSP retains `unsafe-inline` only because the theme bootstrap runs before hydration; avoid adding inline code so this exception can later be replaced with a nonce-based policy.

All `/api/*` responses use `Cache-Control: private, no-store, max-age=0`. BFF fetches explicitly use `no-store`, so account data, JWT-protected lists, and anonymous quotas cannot be shared by an intermediary cache. Next.js keeps its standard immutable cache policy for hashed static assets.

Route handlers forward safe HTTP status and error payloads to the UI. The interface differentiates validation errors, expired sessions, quota limits, and transient network failures, and offers retry or sign-in when appropriate. Do not log request bodies, authorization headers, cookies, environment variables, or unredacted provider responses.

## Releases

This is a deployable frontend, not an installable package. Release Please tracks the application version in `package.json`, maintains `CHANGELOG.md`, and creates GitHub Releases and tags; it does not publish to npm.

The release baseline is `1.0.0`. On every push to `main`, Release Please analyzes Conventional Commit messages and creates or updates a release pull request. Merge that release pull request when the deployment is ready to create the version tag, GitHub Release, changelog entry, and next application version.

Use Conventional Commits for release-relevant changes: `fix:` creates a patch release, `feat:` creates a minor release, and a `!` suffix (for example, `feat!:`) creates a major release.

## Branches and contribution

- `main` is the stable, default branch.
- `develop` integrates work prepared for the next delivery.
- Each story starts from `develop` in a branch named `feature/task-<number>/<change>`.
- Changes are integrated through pull requests: feature branches are reviewed against `develop`, and releases are promoted from `develop` to `main` through another pull request.

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a change.
