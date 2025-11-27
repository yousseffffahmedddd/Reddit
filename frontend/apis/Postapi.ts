// frontend/src/api/postsApi.ts
const dummyUserId = "67a0123bcf1234abcd567890";
const dummyCommunityId = "67a0222bcf1234abcd567111";
import axios from 'axios';
export interface CreatePostData {
 title: string;
  content: string;
  postType: string;
  author: string;
  community: string;
}

const API_BASE = "http://localhost:3000/apis/Postapi";

export const createPost = async (postData: CreatePostData) => {
  const { data } = await axios.post(API_BASE, postData);
  return data;
};

export const fetchPosts = async () => {
  const { data } = await axios.get(API_BASE);
  return data;
};