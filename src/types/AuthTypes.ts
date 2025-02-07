export interface LoggedUserInfo {
  accessToken: string;
  refreshToken: string;
  _id: string;
}

export interface LoginRequirements {
  email: string;
  password: string;
}
