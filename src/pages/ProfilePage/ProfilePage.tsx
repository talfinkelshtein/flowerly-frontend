import React, { useEffect, useState } from "react";
import { TextField, Button, Avatar, Container, Typography, CircularProgress, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { getUserProfile, updateUserProfile } from "../../services/UserService";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./ProfilePage.module.css";

const ProfilePage: React.FC = () => {
    const { userToken } = useAuth();
    const [profile, setProfile] = useState<{ username: string; email: string; profilePicture: string | null } | null>(null);
    const [loading, setLoading] = useState(true);
    const [newUsername, setNewUsername] = useState("");
    const [newImage, setNewImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const userId = localStorage.getItem("userId"); // Ensure we get userId

    useEffect(() => {
        if (!userToken || !userId) return;

        const fetchProfile = async () => {
            try {
                const data = await getUserProfile(userId);
                setProfile(data);
                setNewUsername(data.username);
            } catch (error) {
                console.error("Failed to load profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userToken, userId]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) {
            const file = event.target.files[0];
            setNewImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!profile || !userId) return;

        try {
            const formData = new FormData();
            formData.append("username", newUsername);
            if (newImage) formData.append("image", newImage);

            const updatedProfile = await updateUserProfile(userId, formData);
            setProfile(updatedProfile);
            setPreview(null);
            setNewImage(null);
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    if (loading) return <CircularProgress />;
    if (!profile) return <p>User not found.</p>;

    return (
        <Container className={styles.profileContainer}>
            <Typography variant="h4" className={styles.title}>My Profile</Typography>

            <div className={styles.profileInfo}>
                <div className={styles.avatarContainer}>
                    <Avatar src={preview || profile?.profilePicture || ""} className={styles.avatar} />
                    <input type="file" accept="image/*" onChange={handleImageChange} className={styles.fileInput} />
                    <IconButton className={styles.editIcon} component="label">
                        <EditIcon />
                        <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                    </IconButton>
                </div>

                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
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

                <Button variant="contained" color="primary" onClick={handleSave} className={styles.saveButton}>
                    Save Changes
                </Button>
            </div>
        </Container>
    );
};

export default ProfilePage;
