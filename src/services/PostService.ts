import axios from "axios";
import { Post, NewPost } from "../types/Post";
import { config } from "../config";
import { CommentService } from "./CommentService";

export const PostService = {
    uploadPost: async (post: NewPost, image: File): Promise<Post> => {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("plantType", post.plantType);
        formData.append("content", post.content);
        formData.append("owner", post.owner);

        const response = await axios.post(`${config.API_BASE_URL}/posts`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    },

    getAllPosts: async (): Promise<Post[]> => {
        const response = await axios.get(`${config.API_BASE_URL}/posts`);
        const posts = response.data;

        const postsWithCommentsCount = await Promise.all(
            posts.map(async (post: Post) => {
                const comments = await CommentService.getCommentsByPost(post.id);
                return { ...post, commentsCount: comments.length };
            })
        );

        return postsWithCommentsCount;
    },

    getPostById: async (postId: string): Promise<Post> => {
        const response = await axios.get(`${config.API_BASE_URL}/posts/${postId}`);
        return response.data;
    },

    updatePost: async (postId: string, updatedPost: Partial<Post>, image?: File): Promise<Post> => {
        const formData = new FormData();
        if (image) formData.append("image", image);
        if (updatedPost.plantType) formData.append("plantType", updatedPost.plantType);
        if (updatedPost.content) formData.append("content", updatedPost.content);

        const response = await axios.put(`${config.API_BASE_URL}/posts/${postId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    },

    deletePost: async (postId: string): Promise<void> => {
        await axios.delete(`${config.API_BASE_URL}/posts/${postId}`);
    }
};
