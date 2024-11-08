import { getPostList } from "@/app/action/post";
import PostManagement from "./cpage";

export default async function page() {
  const posts = await getPostList();
  return(
    <PostManagement posts={posts} />
  )
};
