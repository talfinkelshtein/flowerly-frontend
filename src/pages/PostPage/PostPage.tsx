import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PostService } from "../../services/PostService";
import useComments from "../../custom_hooks/useComments";
import { Post } from "../../types/Post";
import styles from "./PostPage.module.css";
import { config } from "../../config";

const PostPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [newComment, setNewComment] = useState("");
    const { comments, setComments, isLoading, error, addComment } = useComments(postId!);

    useEffect(() => {
        if (!postId) return;

        const fetchPost = async () => {
            try {
                const postData = await PostService.getPostById(postId);
                setPost(postData);
            } catch (err) {
                console.error("Failed to load post:", err);
            }
        };

        fetchPost();
    }, [postId]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const comment = await addComment(newComment, "CurrentUser");
            setComments([...comments, comment]);
            setNewComment("");

            setPost((prev) => prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : prev);
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    };

    if (!post) return <p>Loading post...</p>;
    if (isLoading) return <p>Loading comments...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.postPage}>
            <div className={styles.postContainer}>
                <div className={styles.postContent}>
                    <img src={`${config.API_BASE_URL}${post.imagePath}`} alt="Post" className={styles.postImage} />
                    <h3>{post.plantType}</h3>
                    <p>{post.content}</p>
                    <small>Posted by: {post.owner}</small>
                </div>

                <div className={styles.commentsSection}>
                    <h4>Comments</h4>
                    <div className={styles.commentList}>
                        {comments.length === 0 ? (
                            <p>No comments yet.</p>
                        ) : (
                            comments.map((comment) => (
                                <p key={comment.id}><strong>{comment.owner}:</strong> {comment.content}</p>
                            ))
                        )}
                    </div>

                    <div className={styles.commentInput}>
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                        />
                        <button onClick={handleAddComment}>Post</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostPage;
