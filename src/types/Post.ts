export interface Post {
    id: string;
    plantType?: string;
    content: string;
    owner: string;
    likes: number;
    commentsCount: number;
    imageUrl?: string;
}

export type NewPost = Omit<Post, "id">; 

export interface Comment {
    commenter: string;
    description: string;
}
