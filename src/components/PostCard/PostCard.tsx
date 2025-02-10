import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, Button, Card, CardContent, CardMedia, Dialog, DialogActions, DialogTitle, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessageSnackBar from '../../components/errorMessageSnackBar/errorMessageSnackBar';
import { config } from '../../config';
import { PostService } from '../../services/PostService';
import { getUserId } from '../../services/UserService';
import { Post } from '../../types/Post';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
}

const PostCard = forwardRef<HTMLDivElement, PostCardProps>(({ post, onDelete }, ref) => {
  const navigate = useNavigate();
  const numberOfLikesRef = useRef(post.likedBy.length);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [actionError, setActionError] = useState<unknown>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleDelete = useCallback(async () => {
    try {
      setConfirmOpen(false);
      await PostService.deletePost(post.id);
      onDelete(post.id);
    } catch (err) {
      console.error('Failed to delete post:', err);
      setActionError(err);
      setSnackbarOpen(true);
    }
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

  const handleCardClick = () => {
    navigate(`/post/${post.id}`);
  };

  return (
    <>
      <Card className={styles.postCard} onClick={handleCardClick} ref={ref} style={{ cursor: 'pointer' }}>
        <CardContent className={styles.postHeader}>
        <div className={styles.usernameAndAvatar}>
      <Avatar
        src={post.owner.profilePicture ? `${config.API_BASE_URL}${post.owner.profilePicture}` : ''}
        alt={post.owner.username}
        sx={{ width: 30, height: 30 }} 
      />
      <Typography variant="subtitle2" className={styles.owner}>
        {post.owner.username}
      </Typography>
    </div>
          <IconButton
            onClick={(clickEvent) => {
              clickEvent.stopPropagation();
              handleMenuOpen(clickEvent);
            }}
            className={styles.menuButton}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            onClick={(event) => event.stopPropagation()}  
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem
              component={Link}
              to={`/edit/${post.id}`}
              onClick={(clickEvent) => {
                clickEvent.stopPropagation();
                handleMenuClose();
              }}
            >
              <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
            </MenuItem>
            <MenuItem
              onClick={(clickEvent) => {
                clickEvent.stopPropagation();
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
          <IconButton
            className={styles.actionButton}
            onClick={(clickEvent) => {
              clickEvent.stopPropagation();
              handleToggleLike();
            }}
            sx={{ color: hasLiked ? 'red' : 'grey' }}
          >
            {hasLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {numberOfLikesRef.current}
            </Typography>
          </IconButton>
          <IconButton
            className={styles.commentButton}
            component={Link}
            to={`/post/${post.id}`}
            onClick={(clickEvent) => clickEvent.stopPropagation()}
          >
            <ChatBubbleOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">{post.commentsCount ?? 0}</Typography>
          </IconButton>
        </CardContent>

        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
          <DialogActions>
            <Button
              onClick={(clickEvent) => {
                clickEvent.stopPropagation();
                setConfirmOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={(clickEvent) => {
                clickEvent.stopPropagation();
                handleDelete();
              }}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Card>

      <ErrorMessageSnackBar open={snackbarOpen} onClose={() => setSnackbarOpen(false)} errorMessage={actionError} />
    </>
  );
});

export default PostCard;
