import type { Comment, Community, Post, UserProfile } from '../types'

export const mockCommunities: Community[] = [
  {
    id: 'reactdev',
    name: 'r/reactjs',
    description: 'Talk about hooks, Suspense, and everything React.',
    members: 2170000,
    trendingScore: 98,
  },
  {
    id: 'webdev',
    name: 'r/webdev',
    description: 'Frontend, backend, and everything between.',
    members: 1910000,
    trendingScore: 92,
  },
  {
    id: 'design',
    name: 'r/Design',
    description: 'UI/UX inspiration, critiques, and resources.',
    members: 800000,
    trendingScore: 84,
  },
  {
    id: 'productivity',
    name: 'r/productivity',
    description: 'Share tips, workflows, and motivation boosts.',
    members: 450000,
    trendingScore: 76,
  },
]

export const mockPosts: Post[] = [
  {
    id: 'p1',
    title: 'State machines rescued our complex UI',
    body: 'I swapped a tangled web of booleans for XState and never looked back. Here is how the refactor went down and what I would change next time...',
    communityId: 'reactdev',
    author: 'patternseeker',
    votes: 742,
    commentsCount: 86,
    createdAt: '2h ago',
  },
  {
    id: 'p2',
    title: 'CSS container queries in production',
    body: 'After a month of shipping container queries, here are the patterns that stuck and the pitfalls I encountered with legacy layouts.',
    communityId: 'webdev',
    author: 'cascadequeen',
    votes: 512,
    commentsCount: 64,
    createdAt: '4h ago',
  },
  {
    id: 'p3',
    title: 'My checklist before any UX research session',
    body: 'Over 20 interviews later, this is the ritual that keeps the team aligned and the participants comfortable.',
    communityId: 'design',
    author: 'uxnotes',
    votes: 298,
    commentsCount: 31,
    createdAt: '6h ago',
  },
  {
    id: 'p4',
    title: 'Building a personal zk todo app',
    body: 'Messing around with zero-knowledge proofs for something as mundane as todos taught me a ton about constraints.',
    communityId: 'webdev',
    author: 'cryptocurious',
    votes: 188,
    commentsCount: 22,
    createdAt: '8h ago',
  },
  {
    id: 'p5',
    title: 'Small habits to stay energized at work',
    body: 'These micro-breaks and journaling prompts have made the last quarter surprisingly calm.',
    communityId: 'productivity',
    author: 'morningmaker',
    votes: 355,
    commentsCount: 47,
    createdAt: '1d ago',
  },
]

export const mockComments: Comment[] = [
  {
    id: 'c1',
    postId: 'p1',
    author: 'frontierdev',
    body: 'Love hearing success stories with state machines. Any tips on convincing leadership to adopt them?',
    createdAt: '1h ago',
  },
  {
    id: 'c2',
    postId: 'p1',
    author: 'calmbuilder',
    body: 'The diagrams alone make onboarding smoother. Great write-up!',
    createdAt: '58m ago',
  },
  {
    id: 'c3',
    postId: 'p2',
    author: 'layoutnerd',
    body: 'Container queries + clamp() is such a power combo.',
    createdAt: '3h ago',
  },
  {
    id: 'c4',
    postId: 'p5',
    author: 'dopamineloop',
    body: 'Blocking time for daydreaming is underrated. Appreciate the reminder.',
    createdAt: '22h ago',
  },
]

export const mockUser: UserProfile = {
  id: 'u1',
  username: 'devcoffee',
  avatar: 'https://avatars.githubusercontent.com/u/583231?v=4',
  bio: 'Frontend tinkerer, indie hacker, perpetual prototype hoarder.',
  joinedCommunityIds: ['reactdev', 'webdev', 'productivity'],
}
