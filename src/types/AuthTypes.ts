export interface LoggedUserInfo {
  accessToken: string;
  refreshToken: string;
  _id: string;
}

export interface LoginRequirements {
  email: string;
  password: string;
}

export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
}

export type UserProfileWithoutEmail = Omit<UserProfile, 'email'>;
