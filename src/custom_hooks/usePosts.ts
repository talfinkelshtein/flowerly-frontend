import { useEffect, useState, useCallback } from "react";
import { PostService } from "../services/PostService";
import { Post } from "../types/Post";

const usePosts = (userId?: string) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        setPosts([]);
        setPage(1);
        setHasMore(true);
    }, [userId]);

    const fetchPosts = useCallback(async () => {
        if (isLoading || !hasMore) return; 

        setIsLoading(true);
        try {
            const newPosts = await PostService.getPosts(userId, page);

            setPosts((prev) => {
                const postIds = new Set(prev.map((p) => p.id));
                const uniqueNewPosts = newPosts.filter((p) => !postIds.has(p.id));
                return [...prev, ...uniqueNewPosts]; 
            });

            setHasMore(newPosts.length === 4); 
        } catch (error) {
            setError("Failed to load posts");
            console.error("Error fetching posts:", error);
        } finally {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, page]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const fetchMorePosts = useCallback(() => {
        setPage((prevPage) => prevPage + 1);
    }, []);

    return { posts, setPosts, isLoading, error, fetchMorePosts, hasMore };
};

export default usePosts;
