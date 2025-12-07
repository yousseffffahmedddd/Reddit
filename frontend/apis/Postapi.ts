

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