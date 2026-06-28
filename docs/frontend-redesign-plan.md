# AIBLOG Frontend Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved Ocean Slate design to the real app while fixing API, route, comment, list-key, async-state, and responsive-layout defects.

**Architecture:** Centralize Axios and safe error normalization, add lightweight reusable UI classes/state components, then repair shells and pages in dependency order. Limit backend changes to public blog-detail GET and authenticated comment-AI POST, with regression tests written before those changes.

**Tech Stack:** React 19, React Router 7, TypeScript/JSX, Tailwind CSS 4, Axios, Express 5, Node test runner.

---

## File map

**Create:**
- `Frontend/src/utils/apiErrors.ts` — safe error type, message normalization, and 401 detection.
- `Frontend/src/utils/apiClient.ts` — one Axios instance, base URL, and image URL helper.
- `Frontend/src/styles/ui.ts` — shared Ocean Slate class constants.
- `Frontend/src/components/ui/AsyncState.tsx` — loading, empty, and inline error states.
- `Frontend/tests/apiErrors.test.ts` — frontend error-helper regression tests.
- `Backend/tests/access.routes.test.js` — public/protected access regression tests.

**Modify:**
- Frontend API/auth: `Frontend/package.json`, `Frontend/src/utils/authApi.ts`, `blogsApi.ts`, `commentApi.ts`, `Frontend/src/context/AuthContext.tsx`.
- Frontend structure: `Frontend/src/App.jsx`, `Frontend/src/index.css`, `Frontend/src/layout/DashboardLayout.tsx`.
- Frontend shells/components: `Navbar.tsx`, `DashboardSidebar.tsx`, `DashboardHeader.tsx`, `CategoriesBar.tsx`, `BlogCard.tsx`, `BlogTable.tsx`, `BlogComments.tsx`.
- Frontend pages: `Home.tsx`, `Dashboard.tsx`, `AddBlog.tsx`, `BlogDetails.tsx`, `DashboardComments.tsx`, `Login.tsx`, `Register.tsx`.
- Backend access only: `Backend/routes/blog.routes.js`, `Backend/controllers/comment.controller.js`.

No intermediate implementation commits will be made because target files contain overlapping uncommitted user work.

### Task 1: Shared API client and safe errors

- [ ] Create `Frontend/tests/apiErrors.test.ts` with Node tests asserting that provider messages are preserved, non-Axios errors get a readable fallback, and status 401 is detectable.
- [ ] Add `"test": "node --test tests/*.test.ts"` to `Frontend/package.json` and run `npm test`; expect failure because `apiErrors.ts` does not exist.
- [ ] Create `apiErrors.ts` exporting `ApiError`, `normalizeApiError(error, fallback)`, and `isUnauthorized(error)`.
- [ ] Run `npm test`; expect all error-helper tests to pass.
- [ ] Create `apiClient.ts` exporting `api`, `API_BASE_URL`, and `getAssetUrl(path)` using `VITE_API_URL || "http://localhost:5000"`.
- [ ] Update auth/blog/comment API modules to use `api`; remove local Axios clients, malformed auth code, raw Axios logging, hardcoded auth localhost, and the trailing-space logout route.
- [ ] Update `AuthContext.tsx` to call the shared auth functions and preserve quiet session-check behavior.

### Task 2: Shared Ocean Slate UI primitives

- [ ] Create `styles/ui.ts` with shared `buttonStyles`, `fieldStyles`, `cardStyles`, `pageStyles`, and focus/disabled classes.
- [ ] Create `components/ui/AsyncState.tsx` with `LoadingState`, `EmptyState`, and `ErrorState` accepting concise text and optional retry action.
- [ ] Replace the invalid global `root` selector in `index.css` with normalized body/root sizing, Ocean Slate colors, font smoothing, and accessible selection/focus defaults.

### Task 3: Route/import cleanup and access regression tests

- [ ] Create `Backend/tests/access.routes.test.js` that mounts the blog and comment-AI routers, stubs model/provider calls, and asserts anonymous blog detail returns 200 while anonymous comment AI returns JSON 401 without calling OpenRouter.
- [ ] Run `npm test` in Backend; expect both new access tests to fail against current middleware placement.
- [ ] Remove `authMiddleware` only from `GET /blogs/:id` and add it only to `POST /commentAi/generate-comment`.
- [ ] Run Backend tests; expect all access and AI tests to pass.
- [ ] Correct swapped imports in `DashboardLayout.tsx`, the `BlogComments`-as-`BlogCard` import in `Home.tsx`, and nested route declarations in `App.jsx`.
- [ ] Keep `/add-blog` as a compatibility redirect to `/dashboard/add-blog` and keep `/blog-details/:id` public.

### Task 4: Public Navbar redesign

- [ ] Replace placeholder navigation with route-aware `NavLink` entries: Home for all; Dashboard, Write Blog, and Comments for authenticated users.
- [ ] Keep Login/Sign Up for guests and an accessible profile menu with Logout for authenticated users.
- [ ] Await Logout, close the mobile/profile menu, and navigate to Home only after the action finishes.
- [ ] Apply Ocean Slate desktop/mobile styling with visible active, focus, hover, and disabled states.

### Task 5: Dashboard shell/sidebar redesign

- [ ] Rebuild `DashboardLayout.tsx` as a full-height grid/flex shell with the actual sidebar beside a flexible content column.
- [ ] Redesign `DashboardSidebar.tsx` with route-aware links, a fixed desktop width, mobile overlay/drawer, accessible labels, and async Logout handling.
- [ ] Redesign `DashboardHeader.tsx` as a compact header with page context, user identity, and a New Blog action.
- [ ] Ensure the sidebar and content remain usable at mobile, tablet, and desktop widths without horizontal page overflow.

### Task 6: Home redesign and list-key cleanup

- [ ] Redesign `Home.tsx` with compact hero, request loading/error/empty states, filtered empty state, and responsive cards.
- [ ] Add stable `key={cat}` to `CategoriesBar.tsx`; apply consistent active and focus styles.
- [ ] Redesign `BlogCard.tsx` as a clickable article card using `getAssetUrl`, semantic metadata, image fallback, and `/blog-details/:id` navigation.
- [ ] Audit every frontend `.map()` and use `_id`, path, category, or another stable domain value instead of array index when available.

### Task 7: Dashboard and blog-table behavior

- [ ] Fetch dashboard counts/blogs with mounted cancellation protection, safe error state, and a single loading lifecycle.
- [ ] Add polished blog/comment stat cards plus a New Blog action.
- [ ] Pass an `onDelete` handler into `BlogTable` that removes the deleted item and updates count immediately.
- [ ] Add per-row deletion state, disable duplicate clicks, keep confirmation, use safe errors, and provide responsive table overflow.

### Task 8: Add Blog redesign and controls

- [ ] Move unauthenticated navigation into `useEffect` and avoid navigation during render.
- [ ] Redesign the form with bounded width, shared fields/buttons, compact dashboard spacing, responsive two-column metadata, and clear section labels.
- [ ] Preserve AI generation into `description`; disable AI during generation and show readable failures.
- [ ] Validate selected files as images, revoke replaced preview URLs, add preview/removal control, and clear the file input after success.
- [ ] Preserve Publish immediately; disable submit while loading; reset state and navigate to Dashboard after successful creation.

### Task 9: Blog Details and Blog Comments

- [ ] Redesign `BlogDetails.tsx` with shared asset URLs, valid-ID guard, loading/error/not-found states, public content, and comments rendered only for a valid loaded blog.
- [ ] In `BlogComments.tsx`, fetch only for a valid `blogId`, catch inside the effect, avoid console rejection noise, and show loading/error/empty states.
- [ ] Add independent `posting` and `suggesting` states; disable relevant buttons during work.
- [ ] For guests clicking Post or AI Suggestions, toast “Please log in to comment.” and navigate to `/login` without hiding public comments.
- [ ] For authenticated users, preserve comment creation and AI suggestions with clean messages and stable comment/suggestion keys.

### Task 10: Login, registration, and dashboard comments

- [ ] Redesign Login/Register using AIBLOG branding and shared form/card/button styles.
- [ ] Route successful login to `/dashboard`; keep registration behavior and replace invalid copy/markup with a Login link.
- [ ] Redesign `DashboardComments.tsx` with safe loading/error/empty states and responsive table overflow.

### Task 11: Console and async cleanup audit

- [ ] Run `rg -n "\.map\(|console\.error|axios\.create|localhost|href=\"#\"|navigate\(" Frontend/src` and inspect every result.
- [ ] Remove uncaught async effects, duplicate clients, placeholder routes, raw user-facing Axios errors, and duplicate-click opportunities within spec scope.
- [ ] Confirm list keys use stable IDs/values and no component fetches comments with an undefined blog ID.

### Task 12: Verification and browser flow

- [ ] Run `npm test`, `npm run lint`, and `npm run build` in Frontend.
- [ ] Run `npm test` in Backend and `node --check` for touched backend routes/controllers.
- [ ] Run `git diff --check` from the repository root.
- [ ] Start Backend and Frontend; exercise guest flows for public detail/comment reading and protected-action login redirects.
- [ ] Exercise authenticated flow: Login → Dashboard → Add Blog → Generate AI → upload thumbnail → publish → open detail → add comment → generate suggestion → delete blog → Logout.
- [ ] Capture browser screenshots at desktop and mobile widths when the browser surface is available; otherwise report the exact unavailable capability and provide API/build evidence without claiming click verification.

