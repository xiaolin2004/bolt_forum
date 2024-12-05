"use server";

import { getCurrentSession } from "../../lib/session";
import { prisma } from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { ListPost, SearchResult } from "../../types/post";
import { redirect } from "next/navigation";

/**
 * Create a new post.
 */
export async function createPost(formData: FormData): Promise<void> {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error("User is not authenticated.");
  }

  const title = formData.get("title")?.toString().trim() ?? "";
  const content = formData.get("content")?.toString().trim() ?? "";

  await prisma.post.create({
    data: {
      title,
      content,
      author: session.user?.id ?? 0,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  revalidatePath("/");
  redirect("/");
}

/**
 * Create a reply for a post.
 */
export async function createReply(
  postId: number,
  formData: FormData
): Promise<void> {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error("User is not authenticated.");
  }

  const content = formData.get("content")?.toString().trim() ?? "";

  await prisma.reply.create({
    data: {
      content,
      created_at: new Date(),
      post_id: postId,
      user_id: session.user?.id ?? 0,
    },
  });

  revalidatePath(`/post/${postId}`);
}

/**
 * Delete a reply by ID.
 */
export async function deleteReply(formData: FormData): Promise<void> {
  const replyId = parseInt(formData.get("id")?.toString() ?? "0", 10);

  if (isNaN(replyId) || replyId <= 0) {
    throw new Error("Invalid reply ID.");
  }

  await prisma.reply.delete({
    where: { id: replyId },
  });

  revalidatePath(`/post/${formData.get("postId")}`);
}


/**
 * Get a list of posts with additional metadata.
 */
export async function getPostList(): Promise<ListPost[]> {
  const posts = await prisma.post.findMany({
    include: {
      user: {
        select: { name: true },
      },
      _count: {
        select: { reply: true },
      },
      reply: {
        orderBy: { created_at: "desc" },
        take: 1,
        select: { created_at: true },
      },
    },
  });

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    author: post.user?.name ?? "Unknown",
    replies: post._count.reply,
    lastReply:
      post.reply[0]?.created_at
        ?.toISOString()
        .replace("T", " ")
        .substring(0, 16) ?? "",
  }));
}

/**
 * Delete a post by ID.
 */
export async function deletePost(formData: FormData): Promise<void> {
  const postId = parseInt(formData.get("id")?.toString() ?? "0", 10);

  if (isNaN(postId) || postId <= 0) {
    throw new Error("Invalid post ID.");
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  revalidatePath("/admin/posts");
}

/**
 * Search for posts by keyword in title or content.
 */
export async function searchPost(keyword: string): Promise<SearchResult[]> {
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: keyword } },
        { content: { contains: keyword } },
      ],
    },
    include: {
      user: {
        select: { name: true, avatar: true },
      },
      _count: {
        select: { reply: true },
      },
    },
  });

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    author: post.user?.name ?? "Unknown",
    avatar: post.user?.avatar ?? "https://api.dicebear.com/9.x/pixel-art/svg",
    timestamp: post.updated_at.toISOString().replace("T", " ").substring(0, 16),
    replies: post._count.reply,
  }));
}

/**
 * Get a list of posts with additional metadata by UserId.
 */
export async function getUserPost(id:number): Promise<ListPost[]> {
  const posts = await prisma.post.findMany({
    where: { author: id },
    include: {
      user: {
        select: { name: true },
      },
      _count: {
        select: { reply: true },
      },
      reply: {
        orderBy: { created_at: "desc" },
        take: 1,
        select: { created_at: true },
      },
    },
  });

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    author: post.user?.name ?? "Unknown",
    replies: post._count.reply,
    lastReply:
      post.reply[0]?.created_at
        ?.toISOString()
        .replace("T", " ")
        .substring(0, 16) ?? "",
  }));
}