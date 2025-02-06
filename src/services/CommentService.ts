import { config } from "../config";
import { Comment } from "../types/Comment";
import api from "../utils/axiosConfig";

export const CommentService = {
    getCommentsByPost: async (postId: string): Promise<Comment[]> => {
        const response = await api.get(`${config.API_BASE_URL}/comments/byPost/${postId}`);
        return response.data;
    },

    addComment: async (postId: string, owner: string, content: string): Promise<Comment> => {
        const response = await api.post(`${config.API_BASE_URL}/comments`, {
            postId,
            owner,
            content,
        });
        return response.data;
    },

    deleteComment: async (commentId: string): Promise<void> => {
        await api.delete(`${config.API_BASE_URL}/comments/${commentId}`);
    }
};
