"use server";
import {
  deleteSessionTokenCookie,
  getCurrentSession,
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from "../../lib/session";
import { cardUser, UserProfile, ListUser } from "../../types/user";
import { revalidatePath } from "next/cache";
import { prisma } from "@/prisma/client";
import { redirect } from "next/navigation";

export async function getCardUser(): Promise<cardUser> {
  const session = await getCurrentSession();

  // 如果没有 session，直接返回默认用户信息
  if (session.session == null) {
    return {
      id: undefined,
      name: "",
      avatar: "/default-avatar.png",
      isLoggedIn: false,
    };
  }

  // 一次性查询用户信息
  const user = await prisma.user.findUnique({
    where: {
      id: session.user?.id,
    },
    select: {
      id: true,
      name: true,
      avatar: true,
    },
  });

  // 如果用户不存在，返回默认信息
  if (!user) {
    return {
      id: undefined,
      name: "",
      avatar: "/default-avatar.png",
      isLoggedIn: false,
    };
  }

  // 返回用户信息
  return {
    id: user.id,
    name: user.name || "",
    avatar: user.avatar || "/default-avatar.png",
    isLoggedIn: true,
  };
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
  try {
    // 获取基础信息
    const name = formData.get("name")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();

    // 获取所有 tags 数据
    const tags = formData.getAll("tags").map((tag) => tag.toString().trim());

    // 更新用户基本信息
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        phone: phone || undefined,
      },
    });

    // 清除旧的标签关联
    await prisma.tag_user.deleteMany({
      where: { user_id: userId },
    });

    // 逐个处理标签
    const tagPromises = tags.map(async (tag) => {
      // 检查标签是否存在
      let existingTag = await prisma.tag.findUnique({
        where: { feature: tag },
      });

      // 如果不存在则创建
      if (!existingTag) {
        existingTag = await prisma.tag.create({
          data: { feature: tag },
        });
      }

      // 创建关联
      await prisma.tag_user.create({
        data: {
          user_id: userId,
          tag_id: existingTag.id,
        },
      });
    });

    // 等待所有标签操作完成
    await Promise.all(tagPromises);

    console.log("Profile updated successfully.");
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }

  revalidatePath(`/user/${userId.toString()}`);
  redirect(`/user/${userId.toString()}`);
}

export async function getProfileUser(id: number) {
  const userWithTags = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      avatar: true,
      email: true,
      phone: true,
      tag_user: {
        select: {
          tag: {
            select: {
              feature: true,
            },
          },
        },
      },
    },
  });

  // 如果用户不存在，直接返回 null
  if (!userWithTags) {
    return null;
  }

  // 如果 tag_user 为 null 或 undefined，则初始化为空数组
  const tags = (userWithTags.tag_user || []).map(
    (tagUser) => tagUser.tag.feature
  );

  return {
    id: userWithTags.id,
    name: userWithTags.name,
    avatar: userWithTags.avatar ?? "",
    email: userWithTags.email,
    phone: userWithTags.phone ?? "",
    tags,
  };
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
