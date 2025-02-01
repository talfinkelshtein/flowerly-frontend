import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PostService } from "../../services/PostService";
import { CommentService, Comment } from "../../services/CommentService";
import { Post } from "../../types/Post";
import styles from "./PostPage.module.css";
import { config } from "../../config";

const PostPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const fetchPostAndComments = async () => {
            try {
                const postData = await PostService.getPostById(postId!);
                setPost(postData);
                const commentsData = await CommentService.getCommentsByPost(postId!);
                setComments(commentsData);
            } catch (error) {
                console.error("Failed to load post:", error);
            }
        };
        fetchPostAndComments();
    }, [postId]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const comment = await CommentService.addComment(postId!, "CurrentUser", newComment);
            setComments([...comments, comment]);
            setNewComment("");

            setPost((prevPost) => prevPost ? { ...prevPost, commentsCount: prevPost.commentsCount + 1 } : prevPost);
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    };

    if (!post) return <p>Loading...</p>;

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
                            comments.map((comment, index) => (
                                <p key={index}><strong>{comment.owner}:</strong> {comment.content}</p>
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
