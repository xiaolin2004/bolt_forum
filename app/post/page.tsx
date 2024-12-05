import { Post, Reply } from "@/types/post";
import PostDetail from "@/app/post/component/post-detail";
import { prisma } from "@/prisma/client";
import type { Metadata } from "next";
import { getCurrentSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "需求详情",
  description: "需求详情",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const post_id = Number((await params).id);

  const postWithDetails = await prisma.post.findUnique({
    where: {
      id: post_id,
    },
    include: {
      user: {
        // 需求作者信息
        select: {
          id: true,
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
              id: true,
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
    author_id: reply.user.id,
    author: reply.user?.name ?? "",
    avatar: reply.user?.avatar ?? "",
    timestamp: reply.created_at?.toISOString() ?? "",
  }));

  // 格式化需求数据，确保符合 Post 类型
  const attr_post: Post = {
    id: postWithDetails.id.toString(),
    title: postWithDetails.title,
    content: postWithDetails.content,
    author_id : postWithDetails.user.id,
    author: postWithDetails.user?.name ?? "",
    avatar: postWithDetails.user?.avatar ?? "",
    timestamp: postWithDetails.created_at.toISOString().replace("T", " ").substring(0, 16),
    replies: replies,
  };

  const session = await getCurrentSession();

  return <PostDetail visitor={session?.user?.id??-1} id={post_id} post={attr_post} />;
}
