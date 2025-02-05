import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./PostCard.module.css";
import { Post } from "../../types/Post";
import { config } from "../../config";
import { PostService } from "../../services/PostService";

interface PostCardProps {
    post: Post;
    onLike: (id: string) => void;
    onDelete: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            await PostService.deletePost(post.id);
            onDelete(post.id);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
                <div
                    ref={menuRef}
                    className={`${styles.menuDropdown} ${menuOpen ? styles.show : ""}`}
                >
                    <Link to={`/edit/${post.id}`} className={styles.menuItem}>
                        ✏ Edit
                    </Link>
                    <button onClick={handleDelete} className={`${styles.menuItem} ${styles.deleteButton}`}>
                        🗑 Delete
                    </button>
                </div>
            </div>
            <img src={`${config.API_BASE_URL}${post.imagePath}`} alt="Post" className={styles.postImage} />
            <div className={styles.postContent}>
                <h3 className={styles.plantType}>{post.plantType}</h3>
                <p>{post.content}</p>
            </div>
            <div className={styles.postActions}>
                <button className={styles.actionButton} onClick={() => onLike(post.id)}>
                    👍 Like ({post.likes ?? 0})
                </button>
                <Link to={`/post/${post.id}`} className={styles.commentButton}>
                    💬 Comment ({post.commentsCount ?? 0})
                </Link>
            </div>


        </div>
    );
};

export default PostCard;
