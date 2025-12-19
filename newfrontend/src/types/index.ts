// User types
export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  karma: number;
  cakeDay: string;
  bio: string | null;
  createdAt: string;
}

export interface AuthUser extends User {
  email: string;
}

// Community types
export interface Community {
  id: string;
  name: string;
  displayName: string;
  description: string;
  iconUrl: string | null;
  bannerUrl: string | null;
  memberCount: number;
  createdAt: string;
  rules: CommunityRule[];
  moderators: string[];
  isJoined?: boolean;
}

export interface CommunityRule {
  id: string;
  title: string;
  description: string;
  order: number;
}

// Post types
export type PostType = 'text' | 'image' | 'link';

export interface Post {
  id: string;
  title: string;
  content: string | null;
  type: PostType;
  imageUrl: string | null;
  linkUrl: string | null;
  authorId: string;
  author: User;
  communityId: string;
  community: Community;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  userVote: VoteValue;
  isSaved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostInput {
  title: string;
  content?: string;
  type: PostType;
  imageUrl?: string;
  linkUrl?: string;
  communityId: string;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
}

// Comment types
export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: User;
  postId: string;
  parentId: string | null;
  upvotes: number;
  downvotes: number;
  userVote: VoteValue;
  replies: Comment[];
  replyCount: number;
  isCollapsed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentInput {
  content: string;
  postId: string;
  parentId?: string;
}

export interface UpdateCommentInput {
  content: string;
}

// Vote types
export type VoteValue = 1 | 0 | -1;
export type VoteTargetType = 'post' | 'comment';

export interface Vote {
  id: string;
  userId: string;
  targetId: string;
  targetType: VoteTargetType;
  value: VoteValue;
}

export interface VoteInput {
  targetId: string;
  targetType: VoteTargetType;
  value: VoteValue;
}

// Auth types
export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface GoogleAuthInput {
  token: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

// Search types
export interface SearchResult {
  posts: Post[];
  communities: Community[];
  users: User[];
}

export interface SearchParams {
  query: string;
  type?: 'all' | 'posts' | 'communities' | 'users';
  communityId?: string;
}

// Sort types
export type PostSortType = 'hot' | 'new' | 'popular' | 'top' | 'rising';
export type CommentSortType = 'best' | 'top' | 'new' | 'controversial' | 'old';
export type TimeFilter = 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';

// Notification types
export type NotificationType = 'comment_reply' | 'post_reply' | 'mention' | 'upvote' | 'award' | 'community_update';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  linkUrl: string;
  actor?: User;
  postId?: string;
  commentId?: string;
  communityId?: string;
}
// Add this to your types file

export interface FetchPostsParams {
    communityId?: string;
    userId?: string;
    sort?: PostSortType;
    cursor?: string;
    limit?: number;
}
