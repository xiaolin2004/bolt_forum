import { type user as User, type session as Session } from "@prisma/client";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { cookies } from "next/headers";
import { cache } from "react";
import { prisma } from "@/prisma/client";

// Redis 初始化
import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:16379",
});

redis.on("error", (error) => console.error("Redis Error:", error));

(async () => {
  await redis.connect();
})();

// 工具函数
async function redisSet(key: string, value: any, expireSeconds: number) {
  await redis.set(key, JSON.stringify(value), { EX: expireSeconds });
}

async function redisGet<T>(key: string): Promise<T | null> {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

// Token 生成
export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}

// 创建会话
export async function createSession(
  token: string,
  userId: number
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const expireSeconds = 60 * 60 * 24 * 5; // 5天过期

  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + expireSeconds * 1000),
  };

  // 存储到 Redis，设置过期时间
  await redisSet(`session:${sessionId}`, session, expireSeconds);

  return session;
}

// 验证会话
export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  // 从 Redis 获取会话
  const session = await redisGet<Session>(`session:${sessionId}`);
  if (!session) {
    return { session: null, user: null }; // 会话不存在或已过期
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  return user ? { session, user } : { session: null, user: null };
}

// 使会话失效
export async function invalidateSession(sessionId: string): Promise<void> {
  await redis.del(`session:${sessionId}`);
}

// 设置会话 Cookie
export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

// 删除会话 Cookie
export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

// 获取当前会话
export const getCurrentSession = cache(
  async (): Promise<SessionValidationResult> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value ?? null;
    if (!token) {
      return { session: null, user: null };
    }
    return await validateSessionToken(token);
  }
);

// 类型定义
export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
