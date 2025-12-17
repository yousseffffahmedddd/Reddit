import axios from 'axios';

export interface Post {
  _id: string;
  title: string;
  content: string;
  postType: string;
  createdAt: string;
  author: { _id: string; username: string };
  community: { _id: string; name: string };
}

export interface CreatePostData {
 title: string;
  content: string;
  postType: string;
  author: string;
  community: string;
}

const API_BASE = "http://localhost:3000/apis/Postapi";

export const createPost = async (postData: CreatePostData): Promise<Post> => {
  const { data } = await axios.post<Post>(API_BASE, postData);
  return data;
};

export const fetchPosts = async (): Promise<Post[]> => {
  const { data } = await axios.get<Post[]>(API_BASE);
  return data;
};