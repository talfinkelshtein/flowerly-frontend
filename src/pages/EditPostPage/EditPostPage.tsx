import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Box, Button, CardMedia, CircularProgress, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorMessageSnackBar from '../../components/errorMessageSnackBar/errorMessageSnackBar';
import { config } from '../../config';
import { PostService } from '../../services/PostService';
import { Post } from '../../types/Post';
import styles from './EditPostPage.module.css';

const exampleFlowers = ['Rose', 'Sunflower', 'Tulip', 'Daisy', 'Lavender', 'Orchid', 'Lily', 'Peony', 'Marigold', 'Jasmine'];

const EditPostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [content, setContent] = useState('');
  const [plantType, setPlantType] = useState('Rose');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [actionError, setActionError] = useState<unknown>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await PostService.getPostById(postId!);
        setPost(postData);
        setContent(postData.content);
        setPlantType(postData.plantType);
        setImagePreview(`${config.API_BASE_URL}${postData.imagePath}`);
      } catch (error) {
        console.error('Failed to load post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const fetchAIContent = async () => {
    if (!plantType) {
      alert('Please select a plant type first.');
      return;
    }

    setAiLoading(true);
    try {
      const response = await PostService.generateAiDescription(plantType);
      setContent(response.description);
    } catch (error) {
      console.error('Failed to generate AI content:', error);
      alert('Failed to generate AI content.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await PostService.updatePost(postId!, { content, plantType }, image || undefined);
      navigate('/');
    } catch (err) {
      console.error('Failed to update post:', err);
      setActionError(err || null);
      setSnackbarOpen(true);
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  if (!post) return <p>Post not found.</p>;

  return (
    <Box className={styles.editPostContainer}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Edit Post
      </Typography>

      {imagePreview && <CardMedia component="img" height="300" image={imagePreview} alt="Post Preview" sx={{ borderRadius: '8px', mb: 2 }} />}

      <form onSubmit={handleSubmit} className={styles.editPostForm}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="plant-type-label">Plant Type</InputLabel>
          <Select labelId="plant-type-label" value={plantType} onChange={(e) => setPlantType(e.target.value)} label="Plant Type">
            {exampleFlowers.map((flower) => (
              <MenuItem key={flower} value={flower}>
                {flower}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <TextField
            label="Content"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ resize: 'vertical' }}
          />
          <Button variant="contained" color="primary" onClick={fetchAIContent} disabled={aiLoading}>
            <AutoAwesomeIcon />
          </Button>
        </Stack>

        <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
          Upload New Image (Optional)
          <input type="file" hidden accept="image/*" onChange={handleImageChange} />
        </Button>

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.5 }}>
          Save Changes
        </Button>
      </form>
      <ErrorMessageSnackBar open={snackbarOpen} onClose={() => setSnackbarOpen(false)} errorMessage={actionError} />
    </Box>
  );
};

export default EditPostPage;
