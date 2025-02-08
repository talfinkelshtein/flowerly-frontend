export interface Post {
    id: string;
    plantType: string;
    content: string;
    owner: string;
    likedBy: string[];
    commentsCount: number;
    imagePath: string;
}

export type NewPost = Omit<Post, "id" | "likedBy" | "commentsCount" | "imagePath">;

export interface Comment {
    commenter: string;
    description: string;
}
