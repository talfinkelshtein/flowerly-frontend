import axios from "axios";
import { Post } from "../types/Post";
import { config } from "../config"; 

export const PostService = {
    uploadImage: async (image: File): Promise<string> => {
        try {
            const formData = new FormData();
            formData.append("image", image);

            const response = await axios.post(`${config.API_BASE_URL}${config.IMAGE_UPLOAD_PATH}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            return response.data.imageUrl;
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error;
        }
    },

    uploadPost: async (post: Post): Promise<void> => {
        try {
            await axios.post(`${config.API_BASE_URL}${config.POSTS_PATH}/create`, post);
        } catch (error) {
            console.error("Error uploading post:", error);
            throw error;
        }
    },

    getAllPosts: async (): Promise<Post[]> => {
        try {
            const response = await axios.get(`${config.API_BASE_URL}${config.POSTS_PATH}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching posts:", error);
            throw error;
        }
    }
};
