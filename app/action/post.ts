"use server";
import { getCurrentSession } from "../../lib/session";
import { prisma } from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { ListPost, SearchResult } from "../../types/post";

export async function createPost(formData: FormData) {
  const session = await getCurrentSession();
  if (session == null) {
    return;
  }
  const rawFormData = {
    title: formData.get("title")?.toString().trim(),
    content: formData.get("content")?.toString().trim(),
  };
  const post = await prisma.post.create({
    data: {
      title: rawFormData.title ?? "",
      content: rawFormData.content ?? "",
      author: session.user?.id ?? 0,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  return;
}

export async function createReply(postId: number, formData: FormData) {
  const session = await getCurrentSession();
  if (session == null) {
    return;
  }
  const rawFormData = {
    content: formData.get("content")?.toString().trim(),
    userId: session.user?.id,
  };
  const reply = await prisma.reply.create({
    data: {
      content: rawFormData.content ?? "",
      created_at: new Date(),
      post_id: postId,
      user_id: rawFormData.userId ?? 0,
    },
  });
  revalidatePath(`/post/${postId}`);
}

export async function getPostList() {
  const posts = (
    await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        author: true,
        content: true,
        created_at: true,
        updated_at: true,
      },
    })
  ).map(async (post) => {
    const author = await prisma.user.findUnique({
      where: {
        id: post.author,
      },
      select: {
        name: true,
      },
    });
    const replies = await prisma.reply.count({
      where: {
        post_id: post.id,
      },
    });
    const lastReply = await prisma.reply.findFirst({
      where: {
        post_id: post.id,
      },
      orderBy: {
        created_at: "desc",
      },
      select: {
        created_at: true,
      },
    });
    const listPost: ListPost = {
      id: post.id,
      title: post.title,
      author: author?.name ?? "",
      replies: replies,
      lastReply:
        lastReply?.created_at
          ?.toISOString()
          .replace("T", " ")
          .substring(0, 16) ?? "",
    };
    return listPost;
  });
  return Promise.all(posts);
}

export async function deletePost(formData: FormData) {
  const postId = parseInt(formData.get("id")?.toString() ?? "0");
  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
  revalidatePath("/admin/posts");
}

export async function searchPost(keyword: string) {
  const posts = (
    await prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: keyword,
            },
          },
          {
            content: {
              contains: keyword,
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: true,
        updated_at: true,
      },
    })
  ).map(async (post) => {
    const author = await prisma.user.findUnique({
      where:{
        id: post.author,
      },
      select:{
        name: true,
        avatar:true,
      }
    });
    const replies_cnt = await prisma.reply.count({
      where:{
        post_id: post.id,
      },
    });
    const result: SearchResult = {
      id: post.id,
      title: post.title,
      content: post.content,
      author: author?.name ?? "",
      avatar: author?.avatar ?? "",
      timestamp: post.updated_at.toISOString().replace("T", " ").substring(0, 16),
      replies: replies_cnt,
    };
    return result;
  });
  return Promise.all(posts);
}
