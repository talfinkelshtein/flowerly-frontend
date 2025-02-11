import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import {
  Box,
  Button,
  CardMedia,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessageSnackBar from "../../components/errorMessageSnackBar/errorMessageSnackBar";
import { config } from "../../config";
import { PostService } from "../../services/PostService";
import { Post } from "../../types/Post";
import styles from "./EditPostPage.module.css";
import { usePlants } from "../../custom_hooks/usePlants";

const editPostSchema = z.object({
  content: z.string().min(1, "Content cannot be empty"),
  plantType: z.string().min(1, "Please select a plant type"),
  image: z.instanceof(File).optional(),
});

type EditPostFormData = z.infer<typeof editPostSchema>;

const EditPostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { plants, loading: loadingPlants } = usePlants(); 
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [actionError, setActionError] = useState<unknown>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditPostFormData>({
    resolver: zodResolver(editPostSchema),
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await PostService.getPostById(postId!);
        setPost(postData);
        setValue("content", postData.content);
        setValue("plantType", postData.plantType);
        setImagePreview(`${config.API_BASE_URL}${postData.imagePath}`);
      } catch (error) {
        console.error("Failed to load post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId, setValue]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setValue("image", event.target.files[0]);
      setImagePreview(URL.createObjectURL(event.target.files[0]));
    }
  };

  const fetchAIContent = async () => {
    const plantType = watch("plantType");
    if (!plantType) {
      alert("Please select a plant type first.");
      return;
    }

    setAiLoading(true);
    try {
      const response = await PostService.generateAiDescription(plantType);
      setValue("content", response.description);
    } catch (error) {
      console.error("Failed to generate AI content:", error);
      alert("Failed to generate AI content.");
    } finally {
      setAiLoading(false);
    }
  };

  const onSubmit = async (formData: EditPostFormData) => {
    try {
      await PostService.updatePost(
        postId!,
        { content: formData.content, plantType: formData.plantType },
        formData.image || undefined
      );
      navigate("/");
    } catch (err) {
      console.error("Failed to update post:", err);
      setActionError(err || null);
      setSnackbarOpen(true);
    }
  };

  if (loading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;
  if (!post) return <p>Post not found.</p>;

  return (
    <Box className={styles.editPostContainer}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        Edit Post
      </Typography>

      {imagePreview && (
        <CardMedia
          component="img"
          height="300"
          image={imagePreview}
          alt="Post Preview"
          sx={{ borderRadius: "8px", mb: 2 }}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.editPostForm}>
        <FormControl fullWidth error={!!errors.plantType} sx={{ mb: 2 }}>
          <InputLabel id="plant-type-label">Plant Type</InputLabel>
          <Select
            {...register("plantType")}
            value={watch("plantType") || ""}
            onChange={(e) => setValue("plantType", e.target.value)}
            labelId="plant-type-label"
          >
            <MenuItem value="" disabled>
              Select a plant
            </MenuItem>
            {loadingPlants ? (
              <MenuItem disabled>Loading...</MenuItem>
            ) : (
              plants.map((plant) => (
                <MenuItem key={plant.id} value={plant.name}>
                  {plant.name} ({plant.scientific_name})
                </MenuItem>
              ))
            )}
          </Select>

          {errors.plantType && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errors.plantType.message}
            </Typography>
          )}
        </FormControl>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <TextField
            label="Content"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            {...register("content")}
            error={!!errors.content}
            helperText={errors.content?.message}
            sx={{ resize: "vertical" }}
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
