import axios from "axios";
import { Post, NewPost } from "../types/Post";
import { config } from "../config";

export const PostService = {
    uploadPost: async (post: NewPost, image: File): Promise<Post> => {
        const formData = new FormData();
        formData.append("image", image);

        formData.append("content", post.content);
        formData.append("owner", post.owner);

        const response = await axios.post(`${config.API_BASE_URL}/posts`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    },

    getAllPosts: async (): Promise<Post[]> => {
        const response = await axios.get(`${config.API_BASE_URL}/posts`);
        return response.data;
    }
};
