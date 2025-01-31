import axios from "axios";
import { Post, NewPost } from "../types/Post";
import { config } from "../config";

export const PostService = {
    uploadImage: async (image: File): Promise<string> => {
        const formData = new FormData();
        formData.append("image", image);

        const response = await axios.post(`${config.API_BASE_URL}/upload-image`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data.imageUrl;
    },

    uploadPost: async (post: NewPost): Promise<Post> => {
        const response = await axios.post(`${config.API_BASE_URL}/posts`, post);
        return response.data; 
    },

    getAllPosts: async (): Promise<Post[]> => {
        const response = await axios.get(`${config.API_BASE_URL}/posts`);
        return response.data;
    }
};
