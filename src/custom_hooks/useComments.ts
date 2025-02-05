import { useState, useEffect } from "react";
import { Comment } from "../types/Comment";
import { CommentService } from "../services/CommentService";

const useComments = (postId: string) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!postId) return;

        const fetchComments = async () => {
            setIsLoading(true);
            try {
                const commentsData = await CommentService.getCommentsByPost(postId);
                setComments(commentsData);
            } catch {
                setError("Failed to load comments");
            } finally {
                setIsLoading(false);
            }
        };

        fetchComments();
    }, [postId]);

    const addComment = async (content: string, owner: string) => {
        try {
            const newComment = await CommentService.addComment(postId, owner, content);
            setComments((prev) => [...prev, newComment]);
            return newComment;
        } catch {
            setError("Failed to add comment");
            throw new Error("Failed to add comment");
        }
    };

    return { comments, setComments, isLoading, error, addComment };
};

export default useComments;
