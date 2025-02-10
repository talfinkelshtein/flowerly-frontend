import { useEffect, useState, useCallback, useRef } from "react";
import { PostService } from "../services/PostService";
import { Post } from "../types/Post";
import usePagination from "./usePagination";

const usePosts = (userId?: string) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [limit, setLimit] = useState<number | null>(null);
    const [initialFetchDone, setInitialFetchDone] = useState(false); 
    const feedRef = useRef<HTMLDivElement | null>(null);
    const { page, hasMore, setHasMore, nextPage, resetPagination } = usePagination();

    useEffect(() => {
        const updateLimit = () => {
            if (!feedRef.current) return;
            const cardHeight = 250;
            const containerHeight = feedRef.current.clientHeight;
            const cardsFit = Math.floor(containerHeight / cardHeight) * 2;
            setLimit((prev) => prev ?? Math.max(7, cardsFit));
        };

        updateLimit();
        const observer = new ResizeObserver(updateLimit);
        if (feedRef.current) observer.observe(feedRef.current);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        setPosts([]);
        resetPagination();
        setInitialFetchDone(false); 
    }, [userId, resetPagination]);

    const fetchPosts = useCallback(async () => {
        if (isLoading || !hasMore || limit === null) return;

        setIsLoading(true);
        try {
            const newPosts = await PostService.getPosts(userId, page, limit);
            setPosts((prev) => {
                const postIds = new Set(prev.map((p) => p.id));
                return [...prev, ...newPosts.filter((p) => !postIds.has(p.id))];
            });

            setHasMore(newPosts.length === limit);
        } catch (error) {
            setError("Failed to load posts");
            console.error("Error fetching posts:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userId, page, limit, hasMore]);

    useEffect(() => {
        if (limit !== null && (!initialFetchDone || page > 1)) {
            setInitialFetchDone(true);
            fetchPosts();
        }
    }, [limit, page]);

    const fetchMorePosts = useCallback(() => {
        if (!isLoading && hasMore) nextPage();
    }, [isLoading, hasMore, nextPage]);

    return { posts, setPosts, isLoading, error, fetchMorePosts, hasMore, feedRef };
};

export default usePosts;
