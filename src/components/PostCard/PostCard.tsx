import React from 'react';
import styles from './PostCard.module.css';
import rose from '../../assets/rose.jpg'; 
import { Post } from '../../types/Post';

interface PostCardProps {
    post: Post;
    onLike: (id: string) => void;
    onViewComments: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onViewComments }) => {
    return (
        <div className={styles.postCard}>
            <img src={rose} alt="Post" className={styles.postImage} />
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
