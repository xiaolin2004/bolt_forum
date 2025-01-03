import { getPostList } from "@/app/action/post";
import PostManagement from "./cpage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "需求管理",
  description: "需求管理",
};
export default async function page() {
  const posts = await getPostList();
  return <PostManagement posts={posts} />;
}
