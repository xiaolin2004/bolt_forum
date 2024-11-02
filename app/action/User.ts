"use server";
import { PrismaClient } from "@prisma/client";
import { deleteSessionTokenCookie, getCurrentSession } from "../lib/session";
import { cardUser  as User} from "../types/user";
import { revalidatePath } from "next/cache";

export async function getCardUser():Promise<User> {
  const session = await getCurrentSession();
  if (!session) {
    const user: User = {
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
  const ex_user: User = {
    id: session.user?.id,
    name: user?.name || "",
    avatar: user?.avatar || "/default-avatar.png",
    isLoggedIn: true,
  };
  return ex_user;
}

export async function logOut() {
  await deleteSessionTokenCookie();
  revalidatePath('/');
}

export async function logIn(){

}

export async function Register(){

}

export async function updateProfile(){

}

export async function getProfileUser(){

}