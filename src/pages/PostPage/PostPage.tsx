import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { config } from '../../config';
import useComments from '../../custom_hooks/useComments';
import { PostService } from '../../services/PostService';
import { Post } from '../../types/Post';
import styles from './PostPage.module.css';

const PostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');
  const { comments, setComments, isLoading, error, addComment } = useComments(postId!);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        const postData = await PostService.getPostById(postId);
        setPost(postData);
      } catch (err) {
        console.error('Failed to load post:', err);
      }
    };

    fetchPost();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const comment = await addComment(newComment, 'CurrentUser');
      setComments([...comments, comment]);
      setNewComment('');
      setPost((prev) => (prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : prev));
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  if (!post) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  if (isLoading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box className={styles.postPage}>
      <Card className={styles.postContainer}>
        <Box className={styles.postHeader}>
          <Avatar className={styles.avatar}>{post.owner[0].toUpperCase()}</Avatar>
          <Box className={styles.postMeta}>
            <Typography variant="subtitle2" className={styles.postOwner}>
              {post.owner}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Posted on {new Date().toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
        <CardMedia component="img" image={`${config.API_BASE_URL}${post.imagePath}`} alt="Post" className={styles.postImage} />{' '}
        <CardContent className={styles.postContent}>
          <Typography variant="h5" className={styles.postTitle}>
            {post.plantType}
          </Typography>
          <Typography variant="body1" className={styles.postDescription}>
            {post.content}
          </Typography>
        </CardContent>
      </Card>

      <Paper className={styles.commentsSection} elevation={3}>
        <Typography variant="h6" className={styles.commentsTitle}>
          Comments
        </Typography>
        <List className={styles.commentList}>
          {comments.length === 0 ? (
            <Typography variant="body2" color="textSecondary" className={styles.noCommentsMessage}>
              No comments yet. Be the first to comment!
            </Typography>
          ) : (
            comments.map((comment) => (
              <React.Fragment key={comment.id}>
                <ListItem alignItems="flex-start">
                  <Avatar className={styles.avatar}>{comment.owner[0].toUpperCase()}</Avatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" className={styles.commentOwner}>
                        {comment.owner}
                      </Typography>
                    }
                    secondary={comment.content}
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))
          )}
        </List>

        <Box className={styles.commentInputSection}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={styles.commentInput}
          />
          <Button variant="contained" color="primary" onClick={handleAddComment} className={styles.postButton}>
            Post
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PostPage;
