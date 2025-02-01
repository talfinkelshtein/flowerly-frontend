import React from 'react';
import styles from './Feed.module.css';
import usePosts from '../../custom_hooks/usePosts';
import PostCard from '../PostCard/PostCard';
import { Post } from '../../types/Post';

const Feed: React.FC = () => {
    const { posts, isLoading, error } = usePosts();

    const handleLike = (postId: string) => {
        console.log(`Liked post with ID: ${postId}`);
    };

    const handleViewComments = (postId: string) => {
        console.log(`View comments for post with ID: ${postId}`);
    };

    return (
        <div className={styles.feedContainer}>
            {isLoading && <p>Loading posts...</p>}
            {error && <p>Error: {error}</p>}
            {!isLoading && !error && posts.length === 0 && (
                <p>No posts available.</p>
            )}

            <div className={styles.postsFlexbox}>
                {posts.map((post: Post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onLike={handleLike}
                        onViewComments={handleViewComments}
                    />
                ))}
            </div>
        </div>
    );
};

export default Feed;
