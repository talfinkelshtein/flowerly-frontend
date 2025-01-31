import { useEffect, useState } from "react";
import { PostService } from "../services/PostService";
import { Post } from "../types/Post";

const usePosts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const data = await PostService.getAllPosts();
                setPosts(data);
            } catch (error) {
                setError("Failed to load posts");
                console.error("Error fetching posts:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return { posts, setPosts, error, setError, isLoading, setIsLoading };
};

export default usePosts;
