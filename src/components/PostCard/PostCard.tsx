import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite'; // Filled heart
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // Outlined heart
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button, Card, CardContent, CardMedia, Dialog, DialogActions, DialogTitle, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { config } from '../../config';
import { PostService } from '../../services/PostService';
import { getUserId } from '../../services/UserService';
import { Post } from '../../types/Post';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const numberOfLikesRef = useRef(post.likedBy.length);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

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

  const handleToggleLike = useCallback(async () => {
    try {
      const response = await PostService.toggleLike(post.id);
      const userId = getUserId();
      const hasLiked = response.likedBy.includes(userId);
      setHasLiked(hasLiked);
      numberOfLikesRef.current = response.likedBy.length;
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  }, [post]);

  useEffect(() => {
    const checkLikedStatus = async () => {
      try {
        const response = await PostService.hasLiked(post.id);
        setHasLiked(response.hasLiked);
      } catch (error) {
        console.error('Failed to fetch like status:', error);
      }
    };
    checkLikedStatus();
  }, [post.id]);

  return (
    <Card className={styles.postCard}>
      <CardContent className={styles.postHeader}>
        <Typography variant="subtitle2" className={styles.owner}>
          {post.owner.username}
        </Typography>
        <IconButton onClick={handleMenuOpen} className={styles.menuButton}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
          <MenuItem component={Link} to={`/edit/${post.id}`} onClick={handleMenuClose}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              setConfirmOpen(true);
            }}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 1, color: 'red' }} /> Delete
          </MenuItem>
        </Menu>
      </CardContent>

      <CardMedia component="img" height="200" image={`${config.API_BASE_URL}${post.imagePath}`} alt="Post Image" className={styles.postImage} />

      <CardContent className={styles.postContent}>
        <Typography variant="subtitle1" className={styles.plantType}>
          {post.plantType}
        </Typography>
        <Typography className={styles.postDescription}>{post.content}</Typography>
      </CardContent>

      <CardContent className={styles.postActions}>
        <IconButton className={styles.actionButton} onClick={handleToggleLike} sx={{ color: hasLiked ? 'red' : 'grey' }}>
          {hasLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          <Typography variant="body2" sx={{ ml: 0.5 }}>
            {numberOfLikesRef.current}
          </Typography>
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
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PostCard;
