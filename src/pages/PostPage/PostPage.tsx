import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    Box
} from "@mui/material";
import { PostService } from "../../services/PostService";
import useComments from "../../custom_hooks/useComments";
import { Post } from "../../types/Post";
import { config } from "../../config";
import styles from "./PostPage.module.css";

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

    if (!post) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;
    if (isLoading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box className={styles.postPage}>
            <Card className={styles.postContainer}>
                <CardMedia
                    component="img"
                    image={`${config.API_BASE_URL}${post.imagePath}`}
                    alt="Post"
                    className={styles.postImage}
                />
                <CardContent className={styles.postContent}>
                    <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                        {post.plantType}
                    </Typography>
                    <Typography variant="body1">{post.content}</Typography>
                    <Typography variant="caption" color="textSecondary">
                        Posted by: {post.owner}
                    </Typography>
                </CardContent>
            </Card>

            <Paper className={styles.commentsSection}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>Comments</Typography>
                <List className={styles.commentList}>
                    {comments.length === 0 ? (
                        <Typography variant="body2" color="textSecondary">No comments yet.</Typography>
                    ) : (
                        comments.map((comment) => (
                            <React.Fragment key={comment.id}>
                                <ListItem>
                                    <ListItemText
                                        primary={<Typography sx={{ fontWeight: "bold" }}>{comment.owner}</Typography>}
                                        secondary={comment.content}
                                    />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))
                    )}
                </List>

                <Box className={styles.commentInput}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddComment}
                        sx={{ ml: 1, height: "100%" }}
                    >
                        Post
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default PostPage;
