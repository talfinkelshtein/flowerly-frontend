import axios from "axios";
import { config } from "../config";
import { Comment } from "../types/Comment";

export const CommentService = {
    getCommentsByPost: async (postId: string): Promise<Comment[]> => {
        const response = await axios.get(`${config.API_BASE_URL}/comments/byPost/${postId}`);
        return response.data;
    },

    addComment: async (postId: string, owner: string, content: string): Promise<Comment> => {
        const response = await axios.post(`${config.API_BASE_URL}/comments`, {
            postId,
            owner,
            content,
        });
        return response.data;
    },

    deleteComment: async (commentId: string): Promise<void> => {
        await axios.delete(`${config.API_BASE_URL}/comments/${commentId}`);
    }
};
