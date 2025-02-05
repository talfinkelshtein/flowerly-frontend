import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PostService } from "../../services/PostService";
import { Post } from "../../types/Post";
import styles from "./EditPostPage.module.css";

const EditPostPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [content, setContent] = useState("");
    const [plantType, setPlantType] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postData = await PostService.getPostById(postId!);
                setPost(postData);
                setContent(postData.content);
                setPlantType(postData.plantType);
            } catch (error) {
                console.error("Failed to load post:", error);
            }
        };
        fetchPost();
    }, [postId]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await PostService.updatePost(postId!, { content, plantType }, image || undefined);
            navigate("/");
        } catch (error) {
            console.error("Failed to update post:", error);
        }
    };

    if (!post) return <p>Loading...</p>;

    return (
        <div className={styles.editPostContainer}>
            <h1>Edit Post</h1>
            <form onSubmit={handleSubmit} className={styles.editPostForm}>
                <label>Plant Type</label>
                <input type="text" value={plantType} onChange={(e) => setPlantType(e.target.value)} />

                <label>Content</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} />

                <label>Upload New Image (optional)</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />

                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default EditPostPage;
