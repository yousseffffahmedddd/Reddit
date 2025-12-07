# Reddit Clone

A production-ready, frontend-only Reddit clone built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. Uses Mock Service Worker (MSW) to simulate a backend API with seeded demo data.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC)
![React Query](https://img.shields.io/badge/React%20Query-5.0-FF6B6B)
![MSW](https://img.shields.io/badge/MSW-2.0-FF6B6B)

## 🚀 Features

### Core Features
- 📝 **Posts** - Create, read, delete text/image/link posts
- 💬 **Comments** - Threaded comments with nested replies
- ⬆️ **Voting** - Upvote/downvote with optimistic UI updates
- 🏘️ **Communities** - Browse communities and filtered feeds
- 👤 **User Profiles** - View user posts and profile information
- 🔍 **Search** - Search posts, communities, and users
- 🌙 **Dark Mode** - Toggle with localStorage persistence
- 🔔 **Notifications** - Badge count and notification dropdown with types
- 💾 **Save Posts** - Save and unsave posts for later

### Technical Features
- ⚡ **Fully Typed** - TypeScript with strict mode enabled
- 🎨 **Responsive Design** - Mobile-first Tailwind CSS
- 📦 **Mock API** - MSW with seeded data, offline-capable
- 🔄 **React Query** - Server state management with optimistic updates
- 🧪 **Testing Ready** - Jest + React Testing Library config
- 🎭 **E2E Testing** - Playwright happy-path test
- 🚀 **CI/CD** - GitHub Actions workflow for lint & test
- 🎯 **State Management** - Zustand for client auth state
- 🎪 **Smooth Transitions** - Dark/light mode transitions
- ✨ **Beautiful UI** - Modern component library with variants

## 📦 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3 |
| **State Management** | Zustand + React Query (TanStack Query) |
| **API Mocking** | MSW (Mock Service Worker) |
| **Icons** | Lucide React |
| **Testing** | Jest, React Testing Library, Playwright |
| **CI/CD** | GitHub Actions |
| **Code Quality** | ESLint, Prettier |

## 🛠️ Getting Started

### Prerequisites
- **Node.js** 18.17+ (recommended: 20+)
- **npm** 9+ or **yarn** 1.22+

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yousseffffahmedddd/Reddit.git
cd reddit
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will automatically reload on code changes.

## 📖 Usage

### Demo Credentials
The app uses mocked authentication. You can log in with any username/password:
- **Username:** demo_user (or any username)
- **Password:** any password

### Navigation
- **Home** (`/`) - All communities' latest posts
- **Community** (`/r/[communityId]`) - Posts filtered by community
- **Post** (`/r/[communityId]/post/[postId]`) - Full post with comments
- **User Profile** (`/u/[username]`) - User's posts and profile
- **Search** (`/search?q=query`) - Search across posts and communities
- **Legal** (`/legal`) - User Agreement, Privacy Policy, Content Policy

### Key Features to Try
1. **Vote on Posts** - Click up/down arrows (optimistic updates)
2. **Create Posts** - Click the "+" button in the header
3. **Comment** - Open a post and add comments in the thread
4. **Dark Mode** - Toggle with the sun/moon icon in the header
5. **View Notifications** - Click the bell icon to see notifications with badge count
6. **Search** - Use the search bar to find communities and posts
7. **Save Posts** - Click bookmark to save posts for later

## 🏗️ Project Structure

```
reddit/
├── public/
│   └── mockServiceWorker.js    # MSW service worker
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── globals.css          # Global styles with theme variables
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── page.tsx             # Home feed
│   │   ├── r/[communityId]/     # Community pages
│   │   ├── u/[username]/        # User profile pages
│   │   ├── search/              # Search results page
│   │   └── legal/               # Legal pages (Terms, Privacy, Content Policy)
│   ├── components/
│   │   ├── ui/                  # Reusable UI components (Button, Avatar, etc.)
│   │   ├── post/                # Post components (PostCard, VoteButton, etc.)
│   │   ├── comment/             # Comment components (Comment, CommentTree, etc.)
│   │   └── layout/              # Layout components (Header, Sidebar, etc.)
│   ├── hooks/                   # React hooks (useAuth, usePosts, etc.)
│   ├── lib/
│   │   └── utils.ts             # Utility functions
│   ├── mocks/
│   │   ├── seed.ts              # Mock data (users, posts, comments)
│   │   ├── handlers.ts          # MSW request handlers
│   │   ├── browser.ts           # MSW browser setup
│   │   └── MSWProvider.tsx      # MSW React provider
│   ├── providers/               # Context providers (Theme, Query)
│   └── types/                   # TypeScript type definitions
├── e2e/
│   └── happy-path.spec.ts       # Playwright E2E test
├── jest.config.js               # Jest configuration
├── jest.setup.ts                # Jest setup file
├── playwright.config.ts         # Playwright configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
└── package.json                 # Dependencies and scripts
```

## 🔧 Available Scripts

### Development
```bash
npm run dev          # Start dev server on http://localhost:3000
```

### Building
```bash
npm run build        # Build for production
npm start            # Start production server
```

### Testing
```bash
npm test             # Run Jest unit tests
npm run test:watch   # Run tests in watch mode
npm run e2e          # Run Playwright E2E tests
npm run e2e:ui       # Run E2E tests with UI
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check formatting without changing files
```

## 🔌 API Endpoints (Mocked)

All endpoints are mocked using MSW and respond with seeded data:

### Posts
- `GET /api/posts` - Get paginated posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post
- `PATCH /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/save` - Save post

### Comments
- `GET /api/comments?postId=:id` - Get post comments
- `POST /api/comments` - Create comment
- `DELETE /api/comments/:id` - Delete comment

### Votes
- `POST /api/votes` - Submit vote (up/down/neutral)

### Communities
- `GET /api/communities` - Get all communities
- `GET /api/communities/:id` - Get community details

### Auth
- `POST /api/auth/login` - Login (mocked)
- `POST /api/auth/register` - Register (mocked)
- `GET /api/auth/me` - Get current user

### Notifications
- `GET /api/notifications` - Get user notifications with count
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `PATCH /api/notifications/read-all` - Mark all as read

### Search
- `GET /api/search?q=query` - Search posts, communities, users

## 🎨 Theming

The app includes a comprehensive theme system:

- **CSS Variables** - Color system defined in `globals.css`
- **Dark Mode** - Full dark mode support with localStorage persistence
- **Smooth Transitions** - 0.3s transitions between light/dark modes
- **Responsive** - Mobile-first responsive design

### Theme Colors
- Primary: Orange (`#f97316`)
- Destructive: Red (`#ef4444`)
- Upvote: Orange (`#ff4500`)
- Downvote: Blue (`#7193ff`)

## 🧪 Testing

### Unit Tests
```bash
npm test
```

Tests are configured with Jest and React Testing Library. Example test files exist for components like `VoteButton` and `PostCard`.

### E2E Tests
```bash
npm run e2e
```

Uses Playwright with a happy-path test that:
1. Loads home feed
2. Opens a post
3. Adds a comment
4. Upvotes a post
5. Verifies UI changes

### Coverage
```bash
npm test -- --coverage
```

## 📱 Responsive Design

The app is fully responsive:
- **Mobile** (< 768px) - Single column, condensed header
- **Tablet** (768px - 1024px) - Two columns with sidebar
- **Desktop** (> 1024px) - Three columns with full layout

## 🔐 Security & Privacy

- **HTTPS Ready** - Can be deployed with SSL
- **CSRF Protection** - Built into Next.js
- **XSS Prevention** - React's automatic escaping
- **Privacy Focused** - No real data collection, mocked only
- **Legal Compliance** - Includes User Agreement, Privacy Policy, Content Policy

## 📚 Documentation

- **User Agreement** - `/legal/user-agreement`
- **Privacy Policy** - `/legal/privacy-policy`
- **Content Policy** - `/legal/content-policy`

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
EXPOSE 3000
```

### Other Platforms
The app can be deployed to any Node.js hosting platform (Heroku, AWS, DigitalOcean, etc.).

## 🔗 Connecting to a Real Backend

To switch from MSW to a real backend:

1. **Remove MSW Provider** - Delete MSWProvider from `providers.tsx`
2. **Update API URLs** - Change fetch calls from `/api/` to your backend URL
3. **Update Hooks** - Modify hooks in `src/hooks/` to point to real endpoints
4. **Add Authentication** - Replace mocked auth with real JWT/session tokens
5. **Update Types** - Adjust TypeScript types if response shapes differ

Example endpoint conversion:
```typescript
// Before (MSW)
const res = await fetch('/api/posts');

// After (Real API)
const res = await fetch('https://api.example.com/posts');
```

## 🐛 Debugging

### Browser DevTools
- React Developer Tools extension recommended
- Use Redux DevTools for state inspection

### Server Logs
```bash
# View detailed logs
DEBUG=* npm run dev
```

### MSW Network Tab
- Open DevTools Network tab to see MSW intercepted requests
- MSW handles all `/api/*` requests

## 📊 Performance

- **Fast Builds** - Next.js incremental builds
- **Optimized Images** - Next.js Image component
- **Code Splitting** - Automatic route-based splitting
- **Caching** - React Query handles server state caching
- **Bundle Size** - ~150KB (gzipped, without node_modules)

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code follows the existing style
- Tests pass (`npm test`)
- TypeScript compiles without errors
- Prettier formatting is applied

## 📝 License

This project is provided as-is for educational and demonstration purposes.

## 🆘 Support

For questions, issues, or feedback:
- Open an issue on GitHub
- Email: support@example.com

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- React Query team for state management
- MSW team for API mocking
- Tailwind CSS for the utility-first approach
- Lucide for beautiful icons

## 📈 Roadmap

- [ ] Real authentication (OAuth 2.0)
- [ ] Image upload and optimization
- [ ] Advanced search filters
- [ ] User following/followers
- [ ] Awards and badges
- [ ] Post scheduling
- [ ] Analytics dashboard
- [ ] Admin panel
- [ ] Mobile app (React Native)
- [ ] Real-time updates (WebSockets)

---

**Made with ❤️ by the community**

[Back to Top](#reddit-clone)

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_USE_MSW` | Enable MSW mocking | `true` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | - |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ using Next.js and TypeScript
