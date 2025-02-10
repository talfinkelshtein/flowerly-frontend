import { config } from "../config";
import { UserProfileWithoutEmail } from "../types/AuthTypes";

 export const getAvatarUrl = (user: UserProfileWithoutEmail) =>{
    console.log(user);
    return user.profilePicture ? `${config.API_BASE_URL}${user.profilePicture}` : user.username[0].toUpperCase();
  }