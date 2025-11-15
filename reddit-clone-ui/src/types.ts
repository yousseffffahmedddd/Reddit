export type Community = {
  id: string
  name: string
  description: string
  members: number
  trendingScore: number
}

export type Post = {
  id: string
  title: string
  body: string
  communityId: string
  author: string
  votes: number
  commentsCount: number
  createdAt: string
}

export type Comment = {
  id: string
  postId: string
  author: string
  body: string
  createdAt: string
}

export type UserProfile = {
  id: string
  username: string
  avatar: string
  bio: string
  joinedCommunityIds: string[]
}

export type PageView = 'home' | 'community' | 'post' | 'profile'
