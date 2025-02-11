export interface LoggedUserInfo {
  accessToken: string;
  refreshToken: string;
  _id: string;
}

export interface LoginRequirements {
  email: string;
  password: string;
}

export interface UserProfileServerResponse {
  _id: string;
  email: string;
  password: string;
  username: string;
  profilePicture?: string;
  refreshToken?: string[];
}

export type UserProfile = Omit<UserProfileServerResponse, 'refreshToken' | 'password'>;

export type UserProfileWithoutEmail = Omit<UserProfile, 'email'>;
