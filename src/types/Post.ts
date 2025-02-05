export interface Post {
    id: string;
    plantType: string;
    content: string;
    owner: string;
    likes: number;
    commentsCount: number;
    imagePath: string;
}

export type NewPost = Omit<Post, "id" | "likes" | "commentsCount" | "imagePath">;

export interface Comment {
    commenter: string;
    description: string;
}
