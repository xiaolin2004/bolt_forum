import { Post, Reply } from "@/types/post";
import PostDetail from "@/app/post/component/post-detail";
import { prisma } from "@/prisma/client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "帖子详情",
  description: "帖子详情",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);

  // 合并查询，获取帖子及其相关信息
  const postWithDetails = await prisma.post.findUnique({
    where: {
      id: id,
    },
    include: {
      user: {
        // 帖子作者信息
        select: {
          name: true,
          avatar: true,
        },
      },
      reply: {
        // 回复及其作者信息
        select: {
          id: true,
          content: true,
          created_at: true,
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  });

  if (!postWithDetails) {
    return <div>Post not found</div>;
  }

  // 格式化回复数据，确保符合 Reply 类型
  const replies: Reply[] = postWithDetails.reply.map((reply) => ({
    id: reply.id,
    content: reply.content,
    author: reply.user?.name ?? "",
    avatar: reply.user?.avatar ?? "",
    timestamp: reply.created_at?.toISOString() ?? "",
  }));

  // 格式化帖子数据，确保符合 Post 类型
  const attr_post: Post = {
    id: postWithDetails.id.toString(),
    title: postWithDetails.title,
    content: postWithDetails.content,
    author: postWithDetails.user?.name ?? "",
    avatar: postWithDetails.user?.avatar ?? "",
    timestamp: postWithDetails.created_at.toISOString(),
    replies: replies,
  };

  return <PostDetail id={id} post={attr_post} />;
}
