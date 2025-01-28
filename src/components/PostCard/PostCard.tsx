import React from 'react';
import './PostCard.css';
import rose from '../../assets/rose.jpg'; 
import { Post } from '../../types/Post';

interface PostCardProps {
    post: Post;
    onLike: (id: string) => void;
    onViewComments: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onViewComments }) => {
    return (
        <div className="post-card">
            <img src={rose} alt="Post Image" className="post-image" />
            <div className="post-content">
                <p>{post.content}</p>
                <small>Posted by: {post.owner}</small>
            </div>
            <div className="post-actions">
                <button onClick={() => onLike(post.id)}>Like ({post.likes})</button>
                <button onClick={() => onViewComments(post.id)}>
                    Comments ({post.commentsCount})
                </button>
            </div>
        </div>
    );
};

export default PostCard;
