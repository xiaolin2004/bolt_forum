"use server";

import { prisma } from "@/prisma/client";

/**
 * Fetch dashboard statistics.
 */
import { DashboardStats } from "@/types/dashboard";

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalUsers, totalPosts, newUsersToday, newPostsToday] =
    await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.user.count({
        where: {
          created_at: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      prisma.post.count({
        where: {
          created_at: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
    ]);

  return {
    totalUsers,
    totalPosts,
    newUsersToday,
    newPostsToday,
  };
}

/**
 * Fetch recent activity for the dashboard.
 */
import { DashboardActivity } from "@/types/dashboard";

export async function getRecentActivity(): Promise<DashboardActivity> {
  const recentPosts = await prisma.post.findMany({
    orderBy: { created_at: "desc" },
    take: 5,
    include: {
      user: {
        select: { name: true, avatar: true },
      },
    },
  });

  const recentAnnouncements = await prisma.announcement.findMany({
    orderBy: { updated_at: "desc" },
    take: 5,
  });

  return {
    recentPosts: recentPosts.map((post) => ({
      id: post.id,
      title: post.title,
      authorName: post.user.name,
      avatar: post.user.avatar|| "https://api.dicebear.com/9.x/pixel-art/svg",
      createdAt: post.created_at.toISOString().replace("T", " ").substring(0, 16),
    })),
    recentAnnouncements: recentAnnouncements.map((announcement) => ({
      id: announcement.id,
      title: announcement.title,
      updatedAt: announcement.updated_at.toISOString().replace("T", " ").substring(0, 16),
    })),
  };
}
