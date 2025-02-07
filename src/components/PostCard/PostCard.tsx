import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography, IconButton, Menu, MenuItem, Dialog, DialogActions, DialogTitle, Button } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Post } from "../../types/Post";
import { config } from "../../config";
import { PostService } from "../../services/PostService";
import styles from "./PostCard.module.css";

interface PostCardProps {
    post: Post;
    onLike: (id: string) => void;
    onDelete: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onDelete }) => {
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const handleDelete = useCallback(async () => {
        setConfirmOpen(false);
        await PostService.deletePost(post.id);
        onDelete(post.id);
    }, [post.id, onDelete]);

    return (
        <Card className={styles.postCard}>
            <CardContent className={styles.postHeader}>
                <Typography variant="subtitle2" className={styles.owner}>{post.owner}</Typography>
                <IconButton onClick={handleMenuOpen} className={styles.menuButton}>
                    <MoreVertIcon />
                </IconButton>
                <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
                    <MenuItem component={Link} to={`/edit/${post.id}`} onClick={handleMenuClose}>
                        <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                    </MenuItem>
                    <MenuItem onClick={() => { handleMenuClose(); setConfirmOpen(true); }}>
                        <DeleteIcon fontSize="small" sx={{ mr: 1, color: "red" }} /> Delete
                    </MenuItem>
                </Menu>
            </CardContent>

            <CardMedia component="img" height="200" image={`${config.API_BASE_URL}${post.imagePath}`} alt="Post Image" className={styles.postImage} />

            <CardContent className={styles.postContent}>
                <Typography variant="subtitle1" className={styles.plantType}>{post.plantType}</Typography>
                <Typography variant="body2">{post.content}</Typography>
            </CardContent>

            <CardContent className={styles.postActions}>
                <IconButton className={styles.actionButton} onClick={() => onLike(post.id)}>
                    <ThumbUpIcon fontSize="small" sx={{ mr: 0.5 }} /> 
                    <Typography variant="body2">{post.likes ?? 0}</Typography>
                </IconButton>
                <IconButton className={styles.commentButton} component={Link} to={`/post/${post.id}`}>
                    <ChatBubbleOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">{post.commentsCount ?? 0}</Typography>
                </IconButton>
            </CardContent>

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default PostCard;
