import { config } from "../config";
import { Comment } from "../types/Comment";
import api from "../utils/axiosConfig";

export const CommentService = {
    getCommentsByPost: async (postId: string): Promise<Comment[]> => {
        const response = await api.get(config.COMMENTS_BY_POST(postId));
        return response.data;
    },

    addComment: async (postId: string, owner: string, content: string): Promise<Comment> => {
        const response = await api.post(config.COMMENTS, { postId, owner, content });
        return response.data;
    },

    deleteComment: async (commentId: string): Promise<void> => {
        await api.delete(config.COMMENT_BY_ID(commentId));
    }
};
