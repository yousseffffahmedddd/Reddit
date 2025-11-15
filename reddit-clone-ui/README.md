# Reddit Clone UI (Frontend Only)

A polished, frontend-only Reddit experience powered by **Vite + React (TypeScript) + Tailwind CSS**. Navigation is handled exclusively with React state (no routing libraries, no backend) so you can showcase UX flows with mock data only.

### Highlights

- Global chrome with logo, search, quick create button, profile access, plus responsive mobile nav pills.
- Left sidebar for Home, Create Post, and "My Communities" shortcuts; Right sidebar featuring trending communities and an about card.
- Pages rendered via internal state switching: Home feed, Community view, Post details, and Profile.
- Reusable components: `PostCard`, `VoteButton` (optimistic state), `JoinLeaveButton`, `CreatePostModal`, `CommentList`, `CommunityHeader`, and a generic `Modal` helper.
- Mock posts, communities, comments, and profile data live entirely in-memory. Create-post and comment flows update the local state immediately for smooth prototyping.

### Getting Started

1. Install dependencies (includes TypeScript + Tailwind toolchain):

```powershell
npm install
```

2. Start the Vite dev server:

```powershell
npm run dev
```

3. Build for production:

```powershell
npm run build
```

> **Note:** If `npm install` reports `ENOSPC` (no space left on device), clear disk space and rerun the install so Tailwind/TypeScript packages can be downloaded.

### Project Structure

```
src/
├── App.tsx                 # Layout, navigation state, and modal orchestration
├── main.tsx                # React entry point
├── index.css               # Tailwind layers + base theme tokens
├── components/             # Header, sidebars, PostCard, VoteButton, modal, etc.
├── pages/                  # Home feed, Community, Post, Profile screens
├── data/mockData.ts        # Communities, posts, comments, profile mocks
└── types.ts                # Shared TypeScript types
```

### Mock Data & Behavior

- Upvoting/downvoting updates the UI immediately and syncs the in-memory post list.
- Creating a post opens a modal with title/body/community inputs and prepends to the home feed.
- Community view filters posts by the selected community; join/leave toggles purely update UI state.
- Post detail view renders full content plus a comment form and `CommentList` backed by mock data.
- Profile view surfaces the user bio and their posts; search filtering works across pages, including profile.

### Tooling

- **Vite** for lightning-fast dev/build.
- **React 19 + Hooks** only; no React Router.
- **Tailwind CSS** for modern, utility-first styling.
- **TypeScript** for type safety across components, data, and hooks.

Happy prototyping! 🎯
