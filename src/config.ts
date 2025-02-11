const API_BASE_URL = import.meta.env.VITE_BACKEND_URL as string;

const POSTS_BASE = `${API_BASE_URL}/posts`;
const COMMENTS_BASE = `${API_BASE_URL}/comments`;
const USERS_BASE = `${API_BASE_URL}/users`;
const AUTH_BASE = `${API_BASE_URL}/auth`;
const AI_BASE = `${API_BASE_URL}/ai`;
const PLANTS_BASE = `${API_BASE_URL}/plants`;

export const config = {
    API_BASE_URL,

    AUTH_REGISTER: `${AUTH_BASE}/register`,
    AUTH_GOOGLE: `${AUTH_BASE}/google`,
    AUTH_LOGIN: `${AUTH_BASE}/login`,

    USERS: USERS_BASE,
    USER_PROFILE: (userId: string) => `${USERS_BASE}/${userId}`,

    POSTS: POSTS_BASE,
    UPLOAD_IMAGE: POSTS_BASE,
    POST_BY_ID: (postId: string) => `${POSTS_BASE}/${postId}`,
    POST_LIKED: (postId: string, userId: string) => `${POSTS_BASE}/${postId}/hasLiked/${userId}`,
    POST_TOGGLE_LIKE: (postId: string, userId: string) => `${POSTS_BASE}/${postId}/toggleLike/${userId}`,

    COMMENTS: COMMENTS_BASE,
    COMMENTS_BY_POST: (postId: string) => `${COMMENTS_BASE}/byPost/${postId}`,
    COMMENT_BY_ID: (commentId: string) => `${COMMENTS_BASE}/${commentId}`,

    AI_DESCRIPTION: `${AI_BASE}/flower-description`,

    PLANTS: PLANTS_BASE,
};
