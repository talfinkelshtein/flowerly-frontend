import EditIcon from "@mui/icons-material/Edit";
import { Avatar, Box, Button, CircularProgress, Container, IconButton, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../contexts/AuthContext";
import { getCurrentUserProfile, updateUserProfile } from "../../services/UserService";
import { UserProfile } from "../../types/AuthTypes";
import { getAvatarUrl } from "../../utils/userUtils";
import styles from "./ProfilePage.module.css";
import Feed from "../../components/Feed/Feed";

const profileSchema = z.object({
  username: z
    .string()
    .min(1, "Username must have at least one character")
    .regex(/[a-zA-Z]/, "Username must contain at least one letter")
    .regex(/^[a-zA-Z0-9?!@.]+$/, "Only letters, numbers, dots (.), and ?!@ are allowed"),
  image: z.instanceof(File).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfilePage: React.FC = () => {
  const { userToken } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const userId = localStorage.getItem("userId") || undefined;

  const reloadPostsRef = useRef<(() => void) | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (!userToken || !userId) return;

    const fetchProfile = async () => {
      try {
        const data = await getCurrentUserProfile();
        setProfile(data);
        setValue("username", data.username);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userToken, userId, setValue]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (formData: ProfileFormData) => {
    if (!profile || !userId) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      if (formData.image) formDataToSend.append("image", formData.image);

      const updatedProfile = await updateUserProfile(userId, formDataToSend);
      setProfile(updatedProfile);
      setPreview(null);
      reloadPostsRef.current?.();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (loading) return <CircularProgress />;
  if (!profile) return <p>User not found.</p>;

  return (
    <Container className={styles.profileContainer}>
      <Typography variant="h4" className={styles.title}>
        My Profile
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.profileInfo}>
          <Box display="flex" alignItems="center">
            <Box flex="1">
              <div className={styles.avatarContainer}>
                <Avatar
                  sx={{
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    objectFit: "cover",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                    position: "relative",
                    zIndex: 1,
                  }}
                  src={preview || getAvatarUrl(profile)}
                />
                <IconButton
                  className={styles.editIcon}
                  component="label"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    zIndex: 100,
                    background: "#fff",
                    borderRadius: "50%",
                    padding: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <EditIcon />
                  <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                </IconButton>
              </div>
            </Box>

            <Box flex="1" display="flex" flexDirection="column" alignItems="center" width="100%">
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
                className={styles.inputField}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={profile?.email}
                disabled
                className={styles.inputField}
              />
              <Button type="submit" variant="contained" color="primary" className={styles.saveButton}>
                Save Changes
              </Button>
            </Box>
          </Box>
        </div>
      </form>

      <Typography variant="h5" className={styles.feedTitle}>
        My Posts
      </Typography>
      <Feed userId={userId} setReloadRef={(ref) => (reloadPostsRef.current = ref)} />
    </Container>
  );
};

export default ProfilePage;
