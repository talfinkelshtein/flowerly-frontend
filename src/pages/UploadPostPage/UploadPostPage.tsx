import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import {
  Box,
  Button,
  CardMedia,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../contexts/AuthContext";
import { PostService } from "../../services/PostService";
import styles from "./UploadPostPage.module.css";
import { usePlants } from "../../custom_hooks/usePlants";

const uploadPostSchema = z.object({
  plantType: z.string().min(1, "Please select a plant type"),
  description: z.string().min(1, "Description cannot be empty"),
  image: z.instanceof(File, { message: "An image is required" }),
});

type UploadPostFormData = z.infer<typeof uploadPostSchema>;

const UploadPostPage: React.FC = () => {
  const { userToken } = useAuth();
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const { plants, loading: loadingPlants } = usePlants(); 

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UploadPostFormData>({
    resolver: zodResolver(uploadPostSchema),
    defaultValues: { plantType: "" },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      setValue("image", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const fetchFlowerDescription = async () => {
    const plantType = watch("plantType");
    if (!plantType) {
      alert("Please select a plant first.");
      return;
    }
    setLoading(true);

    try {
      const data = await PostService.generateAiDescription(plantType);
      setValue("description", data.description);
    } catch (error) {
      console.error("Error fetching description:", error);
      alert("Failed to fetch flower description.");
    }

    setLoading(false);
  };

  const onSubmit = async (formData: UploadPostFormData) => {
    try {
      await PostService.uploadPost(
        {
          content: formData.description,
          ownerId: userId!,
          plantType: formData.plantType,
        },
        formData.image,
        userToken
      );

      navigate("/");
    } catch (error) {
      console.error("Error uploading post:", error);
    }
  };

  return (
    <Container className={styles.uploadContainer}>
      <Typography variant="h5" className={styles.title}>
        Upload a New Post
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.uploadForm}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="center">
          <Box className={styles.imageContainer} onClick={() => document.getElementById("fileInput")?.click()}>
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

          {errors.image && (
            <Typography color="error" variant="body2">
              {errors.image.message}
            </Typography>
          )}

          <Stack spacing={2} flex={1}>
            <FormControl fullWidth error={!!errors.plantType}>
              <InputLabel id="plant-type-label">Plant Type</InputLabel>
              <Select
                {...register("plantType")}
                value={watch("plantType") || ""}
                onChange={(e) => setValue("plantType", e.target.value)}
                labelId="plant-type-label"
                displayEmpty
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

            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label="Description"
                multiline
                rows={3}
                fullWidth
                variant="outlined"
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
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
