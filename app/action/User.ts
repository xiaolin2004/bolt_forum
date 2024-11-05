"use server";
import { PrismaClient } from "@prisma/client";
import { deleteSessionTokenCookie, getCurrentSession } from "../lib/session";
import { cardUser, UserProfile } from "../types/user";
import { revalidatePath } from "next/cache";
import { prisma } from "./client";
import { redirect } from "next/navigation";

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

export async function updateProfile(userId: number, formData: FormData) {
  const session = await getCurrentSession();
  if (session == null) {
    return;
  }
  if(session.user?.id!=userId){
    return;
  }
  const user = session.user;
  const rawFormData = {
    name: formData.get("name")?.toString().trim() ?? user?.name,
    phone: formData.get("phone")?.toString().trim() ?? user?.phone,
    tags: formData.getAll("tags"),
  };
  const uuser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: rawFormData.name,
      phone: rawFormData.phone,
    },
  });
  revalidatePath(`/user/${user.id.toString()}`);
  redirect(`/user/${user.id.toString()}`);
}

export async function getProfileUser(id: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      avatar: true,
      email: true,
      phone: true,
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
  };
  return r_user;
}
