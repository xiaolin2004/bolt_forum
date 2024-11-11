import { Post, Reply } from "@/types/post";
import PostDetail from "@/app/post/component/post-detail";
import {prisma} from "@/prisma/client";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);
  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
  });
  if (post == null) {
    return <div>Post not found</div>;
  }
  const author = await prisma.user.findUnique({
    where: {
      id: post.author,
    },
    select: {
      avatar: true,
      name: true,
    },
  });
  const replies = await prisma.reply.findMany({
    where: {
      post_id: id,
    },
    select: {
      id: true,
      content: true,
      user_id: true,
      created_at: true,
    },
  });

  const reply = await Promise.all(
    replies.map(async (reply) => {
      const reply_author = await prisma.user.findUnique({
        where: {
          id: reply.user_id,
        },
        select: {
          avatar: true,
          name: true,
        },
      });
      const preply: Reply = {
        id: reply.id,
        content: reply.content,
        author: reply_author?.name ?? "",
        avatar: reply_author?.avatar ?? "",
        timestamp: reply.created_at?.toString() ?? "",
      };
      return preply;
    })
  );
  const attr_post: Post = {
    id: post.id.toString(),
    title: post.title,
    content: post.content,
    author: author?.name ?? "",
    avatar: author?.avatar ?? "",
    timestamp: post.created_at.toString(),
    replies: reply,
  };
  return <PostDetail id={id} post={attr_post} />;
}
