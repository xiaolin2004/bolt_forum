"use client";

import { useEffect, useState } from "react";
import { getDashboardStats, getRecentActivity } from "@/app/action/dashboard";
import { DashboardStats, DashboardActivity } from "@/types/dashboard";

export default function AdminDashboard() {
  // 初始化状态类型
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPosts: 0,
    newUsersToday: 0,
    newPostsToday: 0,
  });

  const [activity, setActivity] = useState<DashboardActivity>({
    recentPosts: [],
    recentAnnouncements: [],
  });

  // 加载数据
  useEffect(() => {
    async function fetchData() {
      const statsData: DashboardStats = await getDashboardStats();
      const activityData: DashboardActivity = await getRecentActivity();
      setStats(statsData);
      setActivity(activityData);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* 统计数据 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "总用户数", value: stats.totalUsers, icon: "👥" },
          { label: "总帖子数", value: stats.totalPosts, icon: "📝" },
          { label: "今日新增用户", value: stats.newUsersToday, icon: "📈" },
          { label: "今日新增帖子", value: stats.newPostsToday, icon: "📊" },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.label}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {item.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 最近活动 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* 最近帖子 */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              最近帖子
            </h3>
            <div className="mt-5 space-y-4">
              {activity.recentPosts.map((post) => (
                <div key={post.id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <img
                      src={post.avatar}
                      alt={post.authorName}
                      className="h-8 w-8 rounded-full"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">{post.authorName}</span>{" "}
                      发布了新帖子{" "}
                      <span className="ml-2 text-gray-400">
                        {post.createdAt}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 最近公告 */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              最近公告
            </h3>
            <div className="mt-5 space-y-4">
              {activity.recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-xl">📢</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">{announcement.title}</span>{" "}
                      <span className="ml-2 text-gray-400">
                        {announcement.updatedAt}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
