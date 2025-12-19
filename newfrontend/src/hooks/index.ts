// Core hooks
export { useVote } from './useVote';
export { usePosts, usePost, useCreatePost, useUpdatePost, useDeletePost, useVoteOnPost } from './usePosts';
export { useComments, useCreateComment, useDeleteComment, useUpdateComment, useCommentCount, useUserComments, useVoteComment } from './useComments';
export { useCommunities, useCommunity, useJoinedCommunities, useJoinCommunity, useOwnedCommunities, useUpdateCommunity, useUploadCommunityIcon } from './useCommunities';
export { useAuthStore, useLogin, useRegister, useLogout, useCurrentUser, useGoogleAuth } from './useAuth';
export { useSearch, useUser } from './useSearch';

// New hooks for backend features
export {
  useConversations,
  useMessages,
  useSendMessage,
  useCreateConversation,
  useChatUsers,
  useSearchChatUsers
} from './useChat';

export {
  useSummarizePost,
  useAskChatbot
} from './useAI';

export {
  useUserProfile,
  useUpdateProfile,
  useUploadProfilePicture,
  useDeleteProfilePicture,
  getProfilePictureUrl
} from './useUserProfile';

// Note: useCurrentUser removed - backend doesn't have /api/auth/me endpoint
// User data is stored in zustand store after login/signup

