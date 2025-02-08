import React from 'react';
import usePosts from '../../custom_hooks/usePosts';
import PostCard from '../PostCard/PostCard';
import styles from './Feed.module.css';
import { Post } from '../../types/Post';

const Feed: React.FC = () => {
    const { posts, setPosts, isLoading, error } = usePosts();

    const handleDelete = (postId: string) => {
        setPosts(posts.filter((post) => post.id !== postId));
    };

    return (
        <div className={styles.feedContainer}>
            {isLoading && <p>Loading posts...</p>}
            {error && <p>Error: {error}</p>}
            {posts.length === 0 && !isLoading && <p>No posts available.</p>}

            <div className={styles.postsFlexbox}>
                {posts.map((post: Post) => (
                    <PostCard 
                        key={post.id} 
                        post={post} 
                        onDelete={handleDelete} 
                    />
                ))}
            </div>
        </div>
    );
};

export default Feed;
