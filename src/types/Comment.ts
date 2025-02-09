import { UserProfileWithoutEmail } from './AuthTypes';

export interface Comment {
  id?: string;
  content: string;
  owner: UserProfileWithoutEmail;
  postId: string;
}
