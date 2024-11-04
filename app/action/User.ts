"use server";
import { PrismaClient } from "@prisma/client";
import { deleteSessionTokenCookie, getCurrentSession } from "../lib/session";
import { cardUser, UserProfile } from "../types/user";
import { revalidatePath } from "next/cache";
import { prisma } from "./client";

export async function getCardUser(): Promise<cardUser> {
  const session = await getCurrentSession();
  if (!session) {
    const user: cardUser = {
      id: undefined,
      name: "",
      avatar: "/default-avatar.png",
      isLoggedIn: false,
    };
    return user;
  }
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: {
      id: session.user?.id,
    },
    select: {
      name: true,
      avatar: true,
    },
  });
  const ex_user: cardUser = {
    id: session.user?.id,
    name: user?.name || "",
    avatar: user?.avatar || "/default-avatar.png",
    isLoggedIn: true,
  };
  return ex_user;
}

export async function logOut() {
  await deleteSessionTokenCookie();
  revalidatePath("/");
}

export async function logIn() {}

export async function Register() {}

export async function updateProfile() {}

export async function getProfileUser(id: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (user == null) {
    return null;
  }
  const tagPromises = (
    await prisma.tag_user.findMany({
      where: {
        user_id: user.id,
      },
    })
  ).map(async (tag_id) => {
    const tag =
      (
        await prisma.tag.findUnique({
          where: {
            id: tag_id.tag_id,
          },
        })
      )?.feature ?? "";
    return tag;
  });
  const tags = await Promise.all(tagPromises);
  const r_user: UserProfile = {
    id: user.id,
    name: user.name,
    avatar: user.avatar ?? "",
    email: user.email,
    phone: user.phone ?? "",
    tags: tags,
    createdAt: user.created_at.toISOString(),
    updatedAt: user.updated_at.toISOString(),
  };
  return r_user;
}
