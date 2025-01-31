import React, { useState, ChangeEvent, FormEvent } from "react";
import styles from "./UploadPostPage.module.css";
import { PostService } from "../../services/PostService";
import { Post } from "../../types/Post";
import { useNavigate } from "react-router-dom";

const UploadPostPage: React.FC = () => {
    const [content, setContent] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!image || !content) {
            alert("Please add an image and a description.");
            return;
        }

        try {
            const imageUrl = await PostService.uploadImage(image); 

            const newPost: Post = {
                id: Math.random().toString(36).substr(2, 9), 
                content,
                owner: "CurrentUser", 
                likes: 0,
                commentsCount: 0,
                imageUrl,
            };

            await PostService.uploadPost(newPost); 
            navigate("/");
        } catch (error) {
            console.error("Error uploading post:", error);
        }
    };

    return (
        <div className={styles.uploadContainer}>
            <h1>Upload a Post</h1>
            <form onSubmit={handleSubmit} className={styles.uploadForm}>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {preview && <img src={preview} alt="Preview" className={styles.imagePreview} />}

                <textarea
                    placeholder="Write a caption..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default UploadPostPage;
