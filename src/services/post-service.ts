import { Post } from "../types/Post";
import apiClient, { CanceledError } from "./api-client";
export { CanceledError }

const getAllPosts = () => {
    const abortController = new AbortController();
    const request = apiClient.get<Post[]>('/posts', { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}
export default { getAllPosts }