import { http, HttpResponse, delay } from 'msw';
import { posts, communities, users, comments, currentUser, notifications } from './seed';
import type {
  Post,
  Comment,
  VoteInput,
  CreatePostInput,
  CreateCommentInput,
  LoginInput,
  RegisterInput,
  Notification,
} from '@/types';

// Mutable copies for CRUD operations
let postsData = [...posts];
let commentsData = [...comments];
let notificationsData = [...notifications];
let isLoggedIn = false;

// Helper to simulate network delay
const DELAY_MS = 200;

export const handlers = [
  // Posts
  http.get('/api/posts', async ({ request }) => {
    await delay(DELAY_MS);
    const url = new URL(request.url);
    const cursor = url.searchParams.get('cursor');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const communityId = url.searchParams.get('communityId');
    const sort = url.searchParams.get('sort') || 'hot';
    const userId = url.searchParams.get('userId');

    let filteredPosts = [...postsData];

    if (communityId) {
      filteredPosts = filteredPosts.filter((p) => p.communityId === communityId);
    }

    if (userId) {
      filteredPosts = filteredPosts.filter((p) => p.authorId === userId);
    }

    // Sort
    if (sort === 'new') {
      filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'top') {
      filteredPosts.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
    } else {
      // hot (simplified)
      filteredPosts.sort((a, b) => {
        const scoreA = (a.upvotes - a.downvotes) / Math.pow(Date.now() - new Date(a.createdAt).getTime(), 0.8);
        const scoreB = (b.upvotes - b.downvotes) / Math.pow(Date.now() - new Date(b.createdAt).getTime(), 0.8);
        return scoreB - scoreA;
      });
    }

    const startIndex = cursor ? filteredPosts.findIndex((p) => p.id === cursor) + 1 : 0;
    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit);
    const nextCursor = paginatedPosts.length === limit ? paginatedPosts[paginatedPosts.length - 1]?.id : null;

    return HttpResponse.json({
      data: paginatedPosts,
      nextCursor,
      hasMore: nextCursor !== null,
      total: filteredPosts.length,
    });
  }),

  http.get('/api/posts/:id', async ({ params }) => {
    await delay(DELAY_MS);
    const post = postsData.find((p) => p.id === params.id);
    if (!post) {
      return HttpResponse.json({ message: 'Post not found', code: 'NOT_FOUND', status: 404 }, { status: 404 });
    }
    return HttpResponse.json(post);
  }),

  http.post('/api/posts', async ({ request }) => {
    await delay(DELAY_MS);
    if (!isLoggedIn) {
      return HttpResponse.json({ message: 'Unauthorized', code: 'UNAUTHORIZED', status: 401 }, { status: 401 });
    }

    const body = (await request.json()) as CreatePostInput;
    const community = communities.find((c) => c.id === body.communityId);
    if (!community) {
      return HttpResponse.json({ message: 'Community not found', code: 'NOT_FOUND', status: 404 }, { status: 404 });
    }

    const newPost: Post = {
      id: `post-${Date.now()}`,
      title: body.title,
      content: body.content || null,
      type: body.type,
      imageUrl: body.imageUrl || null,
      linkUrl: body.linkUrl || null,
      authorId: currentUser.id,
      author: currentUser,
      communityId: body.communityId,
      community,
      upvotes: 1,
      downvotes: 0,
      commentCount: 0,
      userVote: 1,
      isSaved: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    postsData.unshift(newPost);
    return HttpResponse.json(newPost, { status: 201 });
  }),

  http.put('/api/posts/:id', async ({ params, request }) => {
    await delay(DELAY_MS);
    if (!isLoggedIn) {
      return HttpResponse.json({ message: 'Unauthorized', code: 'UNAUTHORIZED', status: 401 }, { status: 401 });
    }

    const body = (await request.json()) as Partial<Post>;
    const postIndex = postsData.findIndex((p) => p.id === params.id);
    if (postIndex === -1) {
      return HttpResponse.json({ message: 'Post not found', code: 'NOT_FOUND', status: 404 }, { status: 404 });
    }

    postsData[postIndex] = {
      ...postsData[postIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(postsData[postIndex]);
  }),

  http.delete('/api/posts/:id', async ({ params }) => {
    await delay(DELAY_MS);
    if (!isLoggedIn) {
      return HttpResponse.json({ message: 'Unauthorized', code: 'UNAUTHORIZED', status: 401 }, { status: 401 });
    }

    const postIndex = postsData.findIndex((p) => p.id === params.id);
    if (postIndex === -1) {
      return HttpResponse.json({ message: 'Post not found', code: 'NOT_FOUND', status: 404 }, { status: 404 });
    }

    postsData.splice(postIndex, 1);
    return HttpResponse.json({ success: true });
  }),

  // Communities
  http.get('/api/communities', async ({ request }) => {
    await delay(DELAY_MS);
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase();

    let filteredCommunities = [...communities];
    if (search) {
      filteredCommunities = filteredCommunities.filter(
        (c) => c.name.toLowerCase().includes(search) || c.displayName.toLowerCase().includes(search)
      );
    }

    return HttpResponse.json({
      data: filteredCommunities,
      total: filteredCommunities.length,
    });
  }),

  http.get('/api/communities/:id', async ({ params }) => {
    await delay(DELAY_MS);
    const community = communities.find((c) => c.id === params.id || c.name === params.id);
    if (!community) {
      return HttpResponse.json({ message: 'Community not found', code: 'NOT_FOUND', status: 404 }, { status: 404 });
    }
    return HttpResponse.json(community);
  }),

  // Comments
  http.get('/api/posts/:postId/comments', async ({ params, request }) => {
    await delay(DELAY_MS);
    const url = new URL(request.url);
    const sort = url.searchParams.get('sort') || 'best';

    let postComments = commentsData.filter((c) => c.postId === params.postId);

    // Sort
    if (sort === 'new') {
      postComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'top') {
      postComments.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
    } else if (sort === 'old') {
      postComments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      // best (simplified)
      postComments.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
    }

    // Build tree structure
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    postComments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    postComments.forEach((comment) => {
      const currentComment = commentMap.get(comment.id)!;
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(currentComment);
        }
      } else {
        rootComments.push(currentComment);
      }
    });

    return HttpResponse.json({
      data: rootComments,
      total: postComments.length,
    });
  }),

  http.post('/api/comments', async ({ request }) => {
    await delay(DELAY_MS);
    if (!isLoggedIn) {
      return HttpResponse.json({ message: 'Unauthorized', code: 'UNAUTHORIZED', status: 401 }, { status: 401 });
    }

    const body = (await request.json()) as CreateCommentInput;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      content: body.content,
      authorId: currentUser.id,
      author: currentUser,
      postId: body.postId,
      parentId: body.parentId || null,
      upvotes: 1,
      downvotes: 0,
      userVote: 1,
      replies: [],
      replyCount: 0,
      isCollapsed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    commentsData.push(newComment);

    // Update post comment count
    const postIndex = postsData.findIndex((p) => p.id === body.postId);
    if (postIndex !== -1) {
      postsData[postIndex].commentCount++;
    }

    // Update parent reply count
    if (body.parentId) {
      const parentIndex = commentsData.findIndex((c) => c.id === body.parentId);
      if (parentIndex !== -1) {
        commentsData[parentIndex].replyCount++;
      }
    }

    return HttpResponse.json(newComment, { status: 201 });
  }),

  http.delete('/api/comments/:id', async ({ params }) => {
    await delay(DELAY_MS);
    if (!isLoggedIn) {
      return HttpResponse.json({ message: 'Unauthorized', code: 'UNAUTHORIZED', status: 401 }, { status: 401 });
    }

    const commentIndex = commentsData.findIndex((c) => c.id === params.id);
    if (commentIndex === -1) {
      return HttpResponse.json({ message: 'Comment not found', code: 'NOT_FOUND', status: 404 }, { status: 404 });
    }

    const comment = commentsData[commentIndex];

    // Update post comment count
    const postIndex = postsData.findIndex((p) => p.id === comment.postId);
    if (postIndex !== -1) {
      postsData[postIndex].commentCount--;
    }

    commentsData.splice(commentIndex, 1);
    return HttpResponse.json({ success: true });
  }),

  // Votes
  http.post('/api/votes', async ({ request }) => {
    await delay(DELAY_MS);
    if (!isLoggedIn) {
      return HttpResponse.json({ message: 'Unauthorized', code: 'UNAUTHORIZED', status: 401 }, { status: 401 });
    }

    const body = (await request.json()) as VoteInput;

    if (body.targetType === 'post') {
      const postIndex = postsData.findIndex((p) => p.id === body.targetId);
      if (postIndex !== -1) {
        const post = postsData[postIndex];
        const previousVote = post.userVote;

        // Remove previous vote
        if (previousVote === 1) post.upvotes--;
        if (previousVote === -1) post.downvotes--;

        // Apply new vote
        if (body.value === 1) post.upvotes++;
        if (body.value === -1) post.downvotes++;

        post.userVote = body.value;
        return HttpResponse.json({ success: true, upvotes: post.upvotes, downvotes: post.downvotes });
      }
    } else {
      const commentIndex = commentsData.findIndex((c) => c.id === body.targetId);
      if (commentIndex !== -1) {
        const comment = commentsData[commentIndex];
        const previousVote = comment.userVote;

        // Remove previous vote
        if (previousVote === 1) comment.upvotes--;
        if (previousVote === -1) comment.downvotes--;

        // Apply new vote
        if (body.value === 1) comment.upvotes++;
        if (body.value === -1) comment.downvotes++;

        comment.userVote = body.value;
        return HttpResponse.json({ success: true, upvotes: comment.upvotes, downvotes: comment.downvotes });
      }
    }

    return HttpResponse.json({ message: 'Target not found', code: 'NOT_FOUND', status: 404 }, { status: 404 });
  }),

  // Save/unsave post
  http.post('/api/posts/:id/save', async ({ params }) => {
    await delay(DELAY_MS);
    if (!isLoggedIn) {
      return HttpResponse.json({ message: 'Unauthorized', code: 'UNAUTHORIZED', status: 401 }, { status: 401 });
    }

    const postIndex = postsData.findIndex((p) => p.id === params.id);
    if (postIndex === -1) {
      return HttpResponse.json({ message: 'Post not found', code: 'NOT_FOUND', status: 404 }, { status: 404 });
    }

    postsData[postIndex].isSaved = !postsData[postIndex].isSaved;
    return HttpResponse.json({ success: true, isSaved: postsData[postIndex].isSaved });
  }),

  // Users
  http.get('/api/users/:username', async ({ params }) => {
    await delay(DELAY_MS);
    const user = users.find((u) => u.username === params.username);
    if (!user) {
      return HttpResponse.json({ message: 'User not found', code: 'NOT_FOUND', status: 404 }, { status: 404 });
    }
    return HttpResponse.json(user);
  }),

  // Auth
  http.post('/api/auth/login', async ({ request }) => {
    await delay(DELAY_MS);
    const body = (await request.json()) as LoginInput;

    // Mock authentication - any username/password works
    if (body.username && body.password) {
      isLoggedIn = true;
      return HttpResponse.json({
        user: currentUser,
        token: 'mock-jwt-token-' + Date.now(),
      });
    }

    return HttpResponse.json({ message: 'Invalid credentials', code: 'INVALID_CREDENTIALS', status: 401 }, { status: 401 });
  }),

  http.post('/api/auth/register', async ({ request }) => {
    await delay(DELAY_MS);
    const body = (await request.json()) as RegisterInput;

    if (body.username && body.email && body.password) {
      isLoggedIn = true;
      return HttpResponse.json({
        user: { ...currentUser, username: body.username, email: body.email },
        token: 'mock-jwt-token-' + Date.now(),
      });
    }

    return HttpResponse.json({ message: 'Invalid input', code: 'INVALID_INPUT', status: 400 }, { status: 400 });
  }),

  http.post('/api/auth/logout', async () => {
    await delay(DELAY_MS);
    isLoggedIn = false;
    return HttpResponse.json({ success: true });
  }),

  http.get('/api/auth/me', async () => {
    await delay(DELAY_MS);
    if (!isLoggedIn) {
      return HttpResponse.json({ message: 'Unauthorized', code: 'UNAUTHORIZED', status: 401 }, { status: 401 });
    }
    return HttpResponse.json(currentUser);
  }),

  // Search
  http.get('/api/search', async ({ request }) => {
    await delay(DELAY_MS);
    const url = new URL(request.url);
    const query = url.searchParams.get('q')?.toLowerCase() || '';
    const type = url.searchParams.get('type') || 'all';

    const results = {
      posts: type === 'all' || type === 'posts'
        ? postsData.filter((p) => p.title.toLowerCase().includes(query) || p.content?.toLowerCase().includes(query))
        : [],
      communities: type === 'all' || type === 'communities'
        ? communities.filter((c) => c.name.toLowerCase().includes(query) || c.displayName.toLowerCase().includes(query))
        : [],
      users: type === 'all' || type === 'users'
        ? users.filter((u) => u.username.toLowerCase().includes(query) || u.displayName.toLowerCase().includes(query))
        : [],
    };

    return HttpResponse.json(results);
  }),

  // Notifications
  http.get('/api/notifications', async () => {
    await delay(DELAY_MS);
    if (!isLoggedIn) {
      return HttpResponse.json({ message: 'Unauthorized', code: 'UNAUTHORIZED', status: 401 }, { status: 401 });
    }
    return HttpResponse.json({
      notifications: notificationsData,
      unreadCount: notificationsData.filter((n) => !n.read).length,
    });
  }),

  http.patch('/api/notifications/:id/read', async ({ params }) => {
    await delay(DELAY_MS);
    if (!isLoggedIn) {
      return HttpResponse.json({ message: 'Unauthorized', code: 'UNAUTHORIZED', status: 401 }, { status: 401 });
    }
    const { id } = params;
    const notification = notificationsData.find((n) => n.id === id);
    if (!notification) {
      return HttpResponse.json({ message: 'Notification not found', code: 'NOT_FOUND', status: 404 }, { status: 404 });
    }
    notification.read = true;
    return HttpResponse.json(notification);
  }),

  http.patch('/api/notifications/read-all', async () => {
    await delay(DELAY_MS);
    if (!isLoggedIn) {
      return HttpResponse.json({ message: 'Unauthorized', code: 'UNAUTHORIZED', status: 401 }, { status: 401 });
    }
    notificationsData = notificationsData.map((n) => ({ ...n, read: true }));
    return HttpResponse.json({ success: true });
  }),
];
