import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PostCard.module.css';
import { Post } from '../../types/Post';
import { config } from '../../config';

interface PostCardProps {
    post: Post;
    onLike: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
    return (
        <div className={styles.postCard}>
            <img src={`${config.API_BASE_URL}${post.imagePath}`} alt="Post" className={styles.postImage} />
            <div className={styles.postContent}>
                <h3 className={styles.plantType}>{post.plantType}</h3>
                <p>{post.content}</p>
                <small>Posted by: {post.owner}</small>
            </div>
            <div className={styles.postActions}>
                <button onClick={() => onLike(post.id)}>👍 Like ({post.likes ?? 0})</button>
                <Link to={`/post/${post.id}`} className={styles.commentButton}>
                    💬 Comment ({post.commentsCount ?? 0})
                </Link>
            </div>
        </div>
    );
};

export default PostCard;
