import React from 'react';
import styles from './PostCard.module.css';
import { Post } from '../../types/Post';
import { config } from '../../config';

interface PostCardProps {
    post: Post;
    onLike: (id: string) => void;
    onViewComments: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onViewComments }) => {
    return (
        <div className={styles.postCard}>
            <img src={`${config.API_BASE_URL}${post.imagePath}`} alt="Post" className="post-image" />
            <div className={styles.postContent}>
                <p>{post.content}</p>
                <small>Posted by: {post.owner}</small>
            </div>
            <div className={styles.postActions}>
                <button onClick={() => onLike(post.id)}>Like ({post.likes})</button>
                <button onClick={() => onViewComments(post.id)}>
                    Comments ({post.commentsCount})
                </button>
            </div>
        </div>
    );
};

export default PostCard;
