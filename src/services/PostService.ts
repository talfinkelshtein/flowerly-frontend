import { config } from '../config';
import { NewPost, Post } from '../types/Post';
import api from '../utils/axiosConfig';
import { getUserId } from './UserService';

export const PostService = {
  uploadPost: async (post: NewPost, image: File, userToken: string | null): Promise<Post> => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('plantType', post.plantType);
    formData.append('content', post.content);
    formData.append('owner', post.ownerId);

    const response = await api.post(config.UPLOAD_IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userToken}`,
      },
    });

    return response.data;
  },

  getPosts: async (userId?: string, page: number = 1, limit: number = 4): Promise<Post[]> => {
    const response = await api.get(config.POSTS, { params: { owner: userId, page, limit } });
    return response.data;
  },

  getPostById: async (postId: string): Promise<Post> => {
    return (await api.get(config.POST_BY_ID(postId))).data;
  },

  updatePost: async (postId: string, updatedPost: Partial<Post>, image?: File): Promise<Post> => {
    const formData = new FormData();
    formData.append('userId', getUserId());

    if (image) formData.append('image', image);
    if (updatedPost.plantType) formData.append('plantType', updatedPost.plantType);
    if (updatedPost.content) formData.append('content', updatedPost.content);

    const response = await api.put(config.POST_BY_ID(postId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  },

  deletePost: async (postId: string): Promise<void> => {
    await api.delete(config.POST_BY_ID(postId), { data: { userId: getUserId() } });
  },

  hasLiked: async (postId: string): Promise<{ hasLiked: boolean }> => {
    return (await api.get(config.POST_LIKED(postId, getUserId()))).data;
  },

  toggleLike: async (postId: string): Promise<{ hasLiked: boolean; message: string; likedBy: string[] }> => {
    return (await api.post(config.POST_TOGGLE_LIKE(postId, getUserId()))).data;
  },

  generateAiDescription: async (plantType: string): Promise<{ description: string }> => {
    return (await api.get(config.AI_DESCRIPTION, { params: { plantType } })).data;
  },
};
