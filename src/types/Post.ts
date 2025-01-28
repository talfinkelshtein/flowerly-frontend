export interface Post {
    id: string;
    content: string;
    owner: string;
    likes: number;
    commentsCount: number;
    imageUrl?: string;
}

export interface Comment {
    commenter: string;
    description: string;
}
