import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Box, Button, CardMedia, Container, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PostService } from '../../services/PostService';
import styles from './UploadPostPage.module.css';

const exampleFlowers = ['Rose', 'Sunflower', 'Tulip', 'Daisy', 'Lavender', 'Orchid', 'Lily', 'Peony', 'Marigold', 'Jasmine'];

const UploadPostPage: React.FC = () => {
  const { userToken } = useAuth();
  const [plantType, setPlantType] = useState('');
  const [description, setDescription] = useState('');
  const userId = localStorage.getItem('userId');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const fetchFlowerDescription = async () => {
    if (!plantType) {
      alert('Please select a flower first.');
      return;
    }
    setLoading(true);

    try {
      const data = await PostService.generateAiDescription(plantType);
      setDescription(data.description);
    } catch (error) {
      console.error('Error fetching description:', error);
      alert('Failed to fetch flower description.');
    }

    setLoading(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!image || !plantType || !description || !userId) {
      alert('Please fill all fields before submitting.');
      return;
    }
    try {
      await PostService.uploadPost(
        {
          content: description,
          ownerId: userId,
          plantType,
        },
        image,
        userToken
      );

      navigate('/');
    } catch (error) {
      console.error('Error uploading post:', error);
    }
  };

  return (
    <Container className={styles.uploadContainer}>
      <Typography variant="h5" className={styles.title}>
        Upload a New Post
      </Typography>
      <form onSubmit={handleSubmit} className={styles.uploadForm}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
          <Box className={styles.imageContainer} onClick={() => document.getElementById('fileInput')?.click()}>
            {preview ? (
              <Box className={styles.imageWrapper}>
                <CardMedia component="img" image={preview} alt="Preview" className={styles.imagePreview} />
                <Box className={styles.overlay}>
                  <PhotoCameraIcon fontSize="large" />
                  <Typography variant="body2">Click to change</Typography>
                </Box>
              </Box>
            ) : (
              <Box className={styles.placeholder}>
                <Typography variant="body2" className={styles.previewText}>
                  Click to upload image
                </Typography>
              </Box>
            )}
          </Box>
          <input type="file" id="fileInput" hidden accept="image/*" onChange={handleImageChange} />

          <Stack spacing={2} flex={1}>
            <FormControl fullWidth>
              <InputLabel>Plant Type</InputLabel>
              <Select value={plantType} onChange={(e) => setPlantType(e.target.value)} required>
                {exampleFlowers.map((flower) => (
                  <MenuItem key={flower} value={flower}>
                    {flower}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label="Description"
                multiline
                rows={3}
                fullWidth
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <Button variant="contained" color="primary" onClick={fetchFlowerDescription} disabled={loading}>
                <AutoAwesomeIcon />
              </Button>
            </Stack>

            <Button type="submit" variant="contained" className={styles.submitButton}>
              Upload Post
            </Button>
          </Stack>
        </Stack>
      </form>
    </Container>
  );
};

export default UploadPostPage;
