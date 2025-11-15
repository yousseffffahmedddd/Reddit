
import { useMemo, useState } from 'react'
import { CreatePostModal } from './components/CreatePostModal'
import { Header } from './components/Header'
import { LeftSidebar } from './components/LeftSidebar'
import { RightSidebar } from './components/RightSidebar'
import { HomeFeed } from './pages/HomeFeed'
import { CommunityPage } from './pages/CommunityPage'
import { PostPage } from './pages/PostPage'
import { ProfilePage } from './pages/ProfilePage'
import { mockComments, mockCommunities, mockPosts, mockUser } from './data/mockData'
import type { Comment, PageView, Post } from './types'

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>('home')
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [joinedCommunityIds, setJoinedCommunityIds] = useState<string[]>(mockUser.joinedCommunityIds)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const communitiesById = useMemo(() => Object.fromEntries(mockCommunities.map((community) => [community.id, community])), [])
  const selectedCommunity = selectedCommunityId ? communitiesById[selectedCommunityId] ?? null : null
  const selectedPost = selectedPostId ? posts.find((post) => post.id === selectedPostId) ?? null : null

  const normalizedQuery = searchTerm.trim().toLowerCase()
  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) return posts
    return posts.filter((post) => {
      const haystack = `${post.title} ${post.body} ${post.author}`.toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [posts, normalizedQuery])

  const communityPosts = selectedCommunityId
    ? filteredPosts.filter((post) => post.communityId === selectedCommunityId)
    : filteredPosts

  const userPosts = useMemo(() => posts.filter((post) => post.author === mockUser.username), [posts])
  const trendingCommunities = useMemo(
    () => [...mockCommunities].sort((a, b) => b.trendingScore - a.trendingScore).slice(0, 3),
    [],
  )

  const handleNavigateHome = () => {
    setCurrentView('home')
    setSelectedCommunityId(null)
    setSelectedPostId(null)
  }

  const handleSelectCommunity = (communityId: string) => {
    setSelectedCommunityId(communityId)
    setCurrentView('community')
  }

  const handleSelectPost = (post: Post) => {
    setSelectedPostId(post.id)
    setSelectedCommunityId(post.communityId)
    setCurrentView('post')
  }

  const handleVote = (postId: string, votes: number) => {
    setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, votes } : post)))
  }

  const handleToggleJoin = (communityId: string) => {
    setJoinedCommunityIds((prev) =>
      prev.includes(communityId) ? prev.filter((id) => id !== communityId) : [...prev, communityId],
    )
  }

  const handleCreatePost = ({ title, body, communityId }: { title: string; body: string; communityId: string }) => {
    const newPost: Post = {
      id: `p-${Date.now()}`,
      title,
      body,
      communityId,
      author: mockUser.username,
      votes: 0,
      commentsCount: 0,
      createdAt: 'just now',
    }
    setPosts((prev) => [newPost, ...prev])
    setCurrentView('home')
    setSelectedCommunityId(null)
    setSelectedPostId(newPost.id)
  }

  const handleAddComment = (postId: string, body: string) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      postId,
      author: mockUser.username,
      body,
      createdAt: 'just now',
    }
    setComments((prev) => [newComment, ...prev])
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, commentsCount: post.commentsCount + 1 } : post)),
    )
  }

  const renderMainContent = () => {
    switch (currentView) {
      case 'community':
        if (!selectedCommunity) {
          return (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500">
              Select a community to explore posts.
            </div>
          )
        }
        return (
          <CommunityPage
            community={selectedCommunity}
            posts={communityPosts}
            joined={joinedCommunityIds.includes(selectedCommunity.id)}
            onToggleJoin={() => handleToggleJoin(selectedCommunity.id)}
            onSelectPost={handleSelectPost}
            onVote={handleVote}
          />
        )
      case 'post':
        if (!selectedPost || !selectedCommunity) {
          return (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500">
              Pick a post from the feed to view the discussion.
            </div>
          )
        }
        return (
          <PostPage
            post={selectedPost}
            community={selectedCommunity}
            comments={comments.filter((comment) => comment.postId === selectedPost.id)}
            joined={joinedCommunityIds.includes(selectedCommunity.id)}
            onToggleJoin={() => handleToggleJoin(selectedCommunity.id)}
            onVote={handleVote}
            onAddComment={handleAddComment}
          />
        )
      case 'profile':
        const profilePosts = normalizedQuery
          ? userPosts.filter((post) =>
              `${post.title} ${post.body}`.toLowerCase().includes(normalizedQuery),
            )
          : userPosts
        return (
          <ProfilePage
            user={mockUser}
            posts={profilePosts}
            communities={mockCommunities}
            onSelectPost={handleSelectPost}
            onSelectCommunity={handleSelectCommunity}
            onVote={handleVote}
          />
        )
      case 'home':
      default:
        return (
          <HomeFeed
            posts={filteredPosts}
            communities={mockCommunities}
            onSelectPost={handleSelectPost}
            onSelectCommunity={handleSelectCommunity}
            onVote={handleVote}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenCreatePost={() => setIsCreateModalOpen(true)}
        onNavigateHome={handleNavigateHome}
        onNavigateProfile={() => setCurrentView('profile')}
      />
      <div className="mx-auto mt-3 flex max-w-3xl gap-3 px-4 text-sm font-semibold text-slate-600 lg:hidden">
        <button className="flex-1 rounded-full border border-slate-200 bg-white/80 px-3 py-2" onClick={handleNavigateHome}>
          Home
        </button>
        <button
          className="flex-1 rounded-full border border-slate-200 bg-white/80 px-3 py-2"
          onClick={() => setCurrentView('profile')}
        >
          Profile
        </button>
        <button
          className="flex-1 rounded-full border border-slate-200 bg-white/80 px-3 py-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create
        </button>
      </div>
      <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 py-6">
        <LeftSidebar
          communities={mockCommunities}
          joinedCommunityIds={joinedCommunityIds}
          onSelectHome={handleNavigateHome}
          onSelectCommunity={handleSelectCommunity}
          onOpenCreatePost={() => setIsCreateModalOpen(true)}
        />
        <main className="flex-1 space-y-4 pb-20">{renderMainContent()}</main>
        <RightSidebar trendingCommunities={trendingCommunities} />
      </div>
      <CreatePostModal
        isOpen={isCreateModalOpen}
        communities={mockCommunities}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreatePost}
      />
    </div>
  )
}
