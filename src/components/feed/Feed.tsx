import React, { useRef, useCallback, useEffect } from "react";
import usePosts from "../../custom_hooks/usePosts";
import PostCard from "../PostCard/PostCard";
import styles from "./Feed.module.css";
import { Post } from "../../types/Post";

interface FeedProps {
    userId?: string; 
    setReloadRef?: (reloadFunction: () => void) => void; 
}

const Feed: React.FC<FeedProps> = ({ userId, setReloadRef  }) => {
    const { posts, setPosts, isLoading, error, fetchMorePosts, hasMore, feedRef, reloadPosts  } = usePosts(userId);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const lastPostRef = useCallback(
        (node: HTMLDivElement) => {
            if (isLoading || !hasMore) return;

            if (observerRef.current) observerRef.current.disconnect();

            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    fetchMorePosts();
                }
            });

            if (node) observerRef.current.observe(node);
        },
        [isLoading, hasMore, fetchMorePosts]
    );

    const handleDelete = (postId: string) => {
        setPosts((prev) => prev.filter((post) => post.id !== postId));
    };

    useEffect(() => {
        if (setReloadRef) {
            setReloadRef(reloadPosts);
        }
    }, [setReloadRef, reloadPosts]);

    return (
        <div ref={feedRef} className={styles.feedContainer}>
            {isLoading && posts.length === 0 && <p>Loading posts...</p>}
            {error && <p>Error: {error}</p>}
            {posts.length === 0 && !isLoading && <p>No posts available.</p>}

            <div className={styles.postsFlexbox}>
                {posts.map((post: Post, index) => (
                    <PostCard 
                        key={post.id} 
                        post={post} 
                        onDelete={handleDelete} 
                        ref={index === posts.length - 1 ? lastPostRef : undefined} 
                    />
                ))}
            </div>

            {isLoading && posts.length > 0 && <p>Loading more posts...</p>}
        </div>
    );
};

export default Feed;