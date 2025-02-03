import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './PostCard.module.css';
import { Post } from '../../types/Post';
import { config } from '../../config';
import { PostService } from '../../services/PostService';

interface PostCardProps {
    post: Post;
    onLike: (id: string) => void;
    onDelete: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            await PostService.deletePost(post.id);
            onDelete(post.id);
        }
    };

    return (
        <div className={styles.postCard}>
            <div className={styles.postHeader}>
                <span className={styles.owner}>{post.owner}</span>
                <button
                    className={styles.menuButton}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ⋮
                </button>
                <div className={`${styles.menuDropdown} ${menuOpen ? styles.show : ''}`}>
                    <Link to={`/edit/${post.id}`} className={styles.menuItem}>✏ Edit</Link>
                    <button onClick={handleDelete} className={styles.menuItem}>🗑 Delete</button>
                </div>
            </div>
            <img src={`${config.API_BASE_URL}${post.imagePath}`} alt="Post" className={styles.postImage} />
            <div className={styles.postContent}>
                <h3 className={styles.plantType}>{post.plantType}</h3>
                <p>{post.content}</p>
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
