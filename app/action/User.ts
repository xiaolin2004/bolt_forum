"use server";

import {
  deleteSessionTokenCookie,
  getCurrentSession,
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
  invalidateSession,
} from "../../lib/session";
import {
  cardUser,
  UserProfile,
  ListUser,
  InvitationUser,
} from "../../types/user";
import { revalidatePath } from "next/cache";
import { prisma } from "@/prisma/client";
import { redirect } from "next/navigation";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { cookies } from "next/headers";

/**
 * Get the current user's card details.
 */
export async function getCardUser(): Promise<cardUser> {
  const session = await getCurrentSession();

  if (!session?.user) {
    return {
      id: undefined,
      name: "",
      avatar: "https://api.dicebear.com/9.x/pixel-art/svg",
      isLoggedIn: false,
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      avatar: true,
    },
  });

  return {
    id: user?.id,
    name: user?.name || "",
    avatar: user?.avatar || "https://api.dicebear.com/9.x/pixel-art/svg",
    isLoggedIn: Boolean(user),
  };
}

/**
 * Log out the current user.
 */
export async function Logout(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value ?? null;

  if (token) {
    // 计算 sessionId
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

    // 删除 Redis 中的 session 数据
    await invalidateSession(sessionId);
  }

  // 删除浏览器中的 session cookie
  await deleteSessionTokenCookie();

  // 重新验证页面路径
  revalidatePath("/login");
}

/**
 * Log in a user with email and password.
 */
export async function LogIn(
  prevState: { message: string },
  formData: FormData
): Promise<{ message: string }> {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString().trim();

  if (!email || !password) {
    return { message: "Email and password are required" };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { message: `Email ${email} not found` };
  }

  if (user.password !== password) {
    return { message: "Incorrect password" };
  }

  const token = generateSessionToken();
  const session = await createSession(token, user.id);
  await setSessionTokenCookie(token, session.expiresAt);

  revalidatePath("/");
  redirect("/");
}

/**
 * Register a new user.
 */
export async function Register(
  prevState: { message: string },
  formData: FormData
): Promise<{ message: string } | void> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString().trim();
  const confirmPassword = formData.get("confirmPassword")?.toString().trim();
  const isCompanyRepresentative = formData.get("isCompanyRepresentative") === "on";

  if (!name || !email || !password || !confirmPassword) {
    return { message: "All fields are required" };
  }

  if (password !== confirmPassword) {
    return { message: "Passwords do not match" };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { message: "User already exists" };
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password,
      created_at: new Date(),
      updated_at: new Date(),
      avatar: "https://api.dicebear.com/9.x/pixel-art/svg",
      user_type_id: isCompanyRepresentative ? 3 : 1, // 动态设置 user_type_id
    },
  });

  redirect("/login");
}

/**
 * Update a user's profile, including tags and password (no hashing).
 */
export async function updateProfile(
  userId: number,
  formData: FormData
): Promise<void> {
  const name = formData.get("name")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const tags = formData.getAll("tags").map((tag) => tag.toString().trim());

  const newPassword = formData.get("newPassword")?.toString().trim();
  const confirmPassword = formData.get("confirmPassword")?.toString().trim();

  // Validate passwords if provided
  if (newPassword || confirmPassword) {
    if (newPassword !== confirmPassword) {
      throw new Error("New password and confirmation password do not match");
    }
    
    // Update password in the database
    await prisma.user.update({
      where: { id: userId },
      data: { password: newPassword },
    });
  }

  await prisma.$transaction(async (prisma) => {
    // Update user info
    await prisma.user.update({
      where: { id: userId },
      data: { name: name || undefined, phone: phone || undefined },
    });

    // Clear and recreate tag-user relations
    await prisma.tag_user.deleteMany({ where: { user_id: userId } });

    const tagPromises = tags.map(async (tag) => {
      const tagRecord = await prisma.tag.upsert({
        where: { feature: tag },
        update: {},
        create: { feature: tag },
      });

      await prisma.tag_user.create({
        data: { user_id: userId, tag_id: tagRecord.id },
      });
    });

    await Promise.all(tagPromises);
  });

  revalidatePath(`/user/${userId}`);
  redirect(`/user/${userId}`);
}

/**
 * Get a user's profile, including tags.
 */
export async function getProfileUser(id: number): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      avatar: true,
      email: true,
      phone: true,
      tag_user: { select: { tag: { select: { feature: true } } } },
    },
  });

  if (!user) return null;

  const tags = user.tag_user.map((tagUser) => tagUser.tag.feature);

  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar || "https://api.dicebear.com/9.x/pixel-art/svg",
    email: user.email,
    phone: user.phone || "",
    tags,
  };
}

/**
 * Get a list of all users.
 */
export async function getUserList(): Promise<ListUser[]> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      avatar: true,
      email: true,
      created_at: true,
      user_types:{select:{name:true}} ,
    },
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    avatar: user.avatar || "https://api.dicebear.com/9.x/pixel-art/svg",
    email: user.email,
    created_at: user.created_at.toISOString().replace("T", " ").substring(0, 16),
    user_type: user.user_types.name
  }));
}

/**
 * Delete a user by ID.
 */
export async function deleteUser(formData: FormData): Promise<void> {
  const id = parseInt(formData.get("id")?.toString() || "0", 10);

  if (isNaN(id) || id <= 0) {
    throw new Error("Invalid user ID");
  }

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

/**
 * Get a list of users available for invitations.
 */
export async function getInvitationUsers(): Promise<InvitationUser[]> {
  const users = await prisma.user.findMany({
    where: { user_type_id: 1 },
    select: { id: true, name: true, avatar: true },
  });

  return users.map((user) => ({
    id: user.id.toString(),
    name: user.name,
    avatar: user.avatar || "https://api.dicebear.com/9.x/pixel-art/svg",
  }));
}
