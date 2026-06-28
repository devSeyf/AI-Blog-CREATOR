# AIBLOG Frontend Redesign Design

## Objective

Create a cohesive, responsive Ocean Slate experience across AIBLOG while repairing broken imports, routes, list rendering, comment loading, and asynchronous button behavior. Existing AI generation and content features remain intact.

## Visual system

- Use a slate-and-white foundation: deep navy (`slate-900`) for primary navigation, white surfaces, slate text, cyan primary actions, emerald success/status accents, amber warnings, and rose destructive actions.
- Use consistent rounded cards, subtle slate borders, restrained shadows, and predictable spacing.
- Use one typography hierarchy: compact uppercase eyebrow text, strong page titles, readable body text, and muted metadata.
- Give every interactive control visible hover, focus-visible, disabled, and loading states.
- Keep the `AIBLOG` wordmark in both public and dashboard navigation.

## Shared frontend foundation

### API client

Create one Axios client using `VITE_API_URL` with the existing localhost fallback. Export helpers that convert Axios failures into safe messages and identify 401 responses. All auth, blog, and comment API modules reuse this client. Components receive readable `Error` messages rather than Axios response objects.

401 behavior remains action-specific: authentication checks can quietly clear the session, while protected comment actions show “Please log in to comment.” and navigate to `/login`.

### UI primitives

Keep the implementation lightweight with shared class constants and small state components rather than a component library. Provide consistent button variants, form-control classes, cards, page containers, loading states, empty states, and inline error states.

## Application structure

### Public shell and navigation

- Navbar uses working React Router links only: Home for all users; Dashboard, Write Blog, and Comments for authenticated users; Login and Sign Up for guests.
- Remove placeholder Team, Projects, Calendar, and Profile links because no matching features or routes exist.
- Mobile navigation uses the same destinations and active-route treatment as desktop navigation.
- Logout awaits the API result, clears the user, closes menus, and returns to Home.

### Dashboard shell

- Correct the swapped sidebar/header imports.
- Use a full-height navy sidebar on desktop and an accessible slide-over drawer on smaller screens.
- Keep the content column independently flexible with a compact header and bounded page width.
- Remove nested full-height page wrappers that create excessive top space.
- Highlight the current dashboard route and keep Home, Dashboard, Add Blog, Comments, and Logout controls functional.

## Page designs and behavior

### Home

- Correctly render `BlogCard`, not `BlogComments`.
- Use a compact hero, consistent category pills, responsive blog-card grid, loading state, request-error state, and distinct empty-filter state.
- Category buttons use stable category keys.
- Blog cards link to public blog details and use the shared API base URL for images.

### Dashboard

- Load counts and blog data without uncaught promises.
- Show polished stat cards and a responsive recent-blog table/card view.
- Delete actions disable during deletion, report failures safely, and remove the deleted blog from local state so counts and rows update immediately.
- Add a clear New Blog action.

### Add Blog

- Use a centered, bounded form card without a second `min-h-screen` inside the dashboard shell.
- Preserve title, subtitle, category, content, thumbnail, publish checkbox, AI generation, and submission behavior.
- Move navigation redirects into effects rather than render-time calls.
- Revoke replaced preview URLs, validate image selection, show preview/removal controls, and disable submit/AI buttons while active.
- On success, reset all fields and navigate to the dashboard so the created blog is visible.

### Blog details

- Make backend blog-detail GET public by removing authentication middleware from only that GET route.
- Use the shared image URL instead of a hardcoded deployment domain.
- Show loading, not-found/request-error, metadata, content, and public comments in a consistent reading card.
- Do not render `BlogComments` until a valid blog ID exists.

### Blog comments

- Fetch only when `blogId` is valid; catch errors inside the effect and never leave an unhandled promise.
- Treat an empty comments array as a normal empty state.
- Keep existing comments publicly readable.
- Require authentication for Post and AI Suggestions. The backend protects comment creation and comment AI generation and returns JSON 401 through the existing middleware.
- A guest clicking either action sees “Please log in to comment.” and navigates to `/login`.
- Authenticated actions have independent loading states, disabled controls, readable errors, and stable keys (`comment._id`; suggestion text when unique).

### Dashboard comments

- Keep the authenticated comments table, add safe request-error handling, and use a responsive table wrapper with an empty state.

### Login and registration

- Apply the shared form system and AIBLOG branding.
- Use the shared auth API client, remove malformed/duplicate auth utility behavior, disable submission while loading, and route successful login to Dashboard.
- Replace invalid registration copy/link markup with a valid Login link.

## Backend scope

Only two access-control adjustments are authorized:

1. Blog detail GET remains public.
2. Comment AI generation uses `authMiddleware`, matching comment creation.

Existing public comment GET, AI model configuration, blog creation, deletion, authentication, and database behavior otherwise remain unchanged.

## Keys and console safety

- Every rendered list uses a stable key: database `_id` for blogs/comments, route path or category string for static navigation/categories, and suggestion text with a duplicate-safe suffix only when necessary.
- Async effects always catch failures and stop loading in `finally`.
- User-visible errors never display raw Axios objects.
- Expected empty data does not produce console errors.

## Verification

- Add focused frontend tests only where a practical existing harness exists; otherwise verify behavior through build, lint, API tests, and browser flow.
- Run frontend lint and production build, backend tests, backend syntax checks for touched routes, and `git diff --check`.
- Browser flow: Login → Dashboard → Add Blog → Generate AI → Upload thumbnail → Submit → Open blog → Read comments → Add comment → Generate suggestion → Delete blog → Logout.
- Verify guest blog reading and guest redirects for Post and AI Suggestions separately.

