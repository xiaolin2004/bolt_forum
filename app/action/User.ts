"use server";
import {
  deleteSessionTokenCookie,
  getCurrentSession,
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from "../lib/session";
import { cardUser, UserProfile, ListUser } from "../types/user";
import { revalidatePath } from "next/cache";
import { prisma } from "@/prisma/client";
import { redirect } from "next/navigation";

export async function getCardUser(): Promise<cardUser> {
  const session = await getCurrentSession();
  if (session.session == null) {
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

export async function Logout() {
  const nu = await deleteSessionTokenCookie();
  revalidatePath("/login");
}

export async function logIn(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  const rawFormData = {
    email: formData.get("email")?.toString().trim(),
    password: formData.get("password")?.toString().trim(),
  };
  const user = await prisma.user.findUnique({
    where: {
      email: rawFormData.email,
    },
  });
  if (user == null) {
    return { message: `Email ${rawFormData.email} not found` };
  }
  if (user.password !== rawFormData.password) {
    return { message: "Incorrect password" };
  }
  const token = generateSessionToken();
  const session = await createSession(token, user.id);
  await setSessionTokenCookie(token, session.expiresAt);
  revalidatePath("/");
  redirect("/");
}

export async function Register(
  prevState: { message: string },
  formData: FormData
) {
  const rawFormData = {
    name: formData.get("name")?.toString().trim(),
    email: formData.get("email")?.toString().trim(),
    password: formData.get("password")?.toString().trim(),
    confirmPassword: formData.get("confirmPassword")?.toString().trim(),
  };
  const user = await prisma.user.count({
    where: {
      email: rawFormData.email,
    },
  });
  if (user > 0) {
    return { message: "User already exists" };
  }
  if (rawFormData.password !== rawFormData.confirmPassword) {
    return { message: "Password mismatch" };
  }
  await prisma.user.create({
    data: {
      name: rawFormData.name ?? "",
      email: rawFormData.email ?? "",
      password: rawFormData.password ?? "",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  redirect("/login");
}

export async function updateProfile(userId: number, formData: FormData) {
  const session = await getCurrentSession();
  if (session == null) {
    return;
  }
  if (session.user?.id != userId) {
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

export async function getUserList() {
  const users = (
    await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        avatar: true,
        email: true,
        created_at: true,
        user_type_id: true,
      },
    })
  ).map((user) => {
    const list_user: ListUser = {
      id: user.id,
      name: user.name,
      avatar: user.avatar ?? "",
      email: user.email,
      created_at:
        user.created_at.toISOString().replace("T", " ").substring(0, 16) ?? "",
      user_type_id: user.user_type_id,
    };
    return list_user;
  });
  return users;
}

export async function deleteUser(formData: FormData) {
  const id = parseInt(formData.get("id")?.toString() ?? "0");
  await prisma.user.delete({
    where: {
      id: id,
    },
  });
  revalidatePath("/admin/users");
}