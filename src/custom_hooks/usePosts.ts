import { useEffect, useState } from "react";
import { PostService } from "../services/PostService";
import { Post } from "../types/Post";

const usePosts = (userId?: string) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = userId ? await PostService.getUserPosts(userId) : await PostService.getAllPosts();
                setPosts(data);
            } catch (error) {
                setError("Failed to load posts");
                console.error("Error fetching posts:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [userId]);

    return { posts, setPosts, isLoading, error };
};

export default usePosts;
