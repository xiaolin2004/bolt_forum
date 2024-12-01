export type DashboardStats = {
  totalUsers: number; // 总用户数
  totalPosts: number; // 总帖子数
  newUsersToday: number; // 今日新增用户
  newPostsToday: number; // 今日新增帖子
};

export type RecentPost = {
  id: number; // 帖子 ID
  title: string; // 帖子标题
  authorName: string; // 作者名称
  avatar: string; // 作者头像
  createdAt: string; // 发布时间，格式化后的字符串
};

export type RecentAnnouncement = {
  id: number; // 公告 ID
  title: string; // 公告标题
  updatedAt: string; // 更新时间，格式化后的字符串
};

export type DashboardActivity = {
  recentPosts: RecentPost[]; // 最近的帖子
  recentAnnouncements: RecentAnnouncement[]; // 最近的公告
};

export type DashboardData = {
  stats: DashboardStats; // 统计数据
  activity: DashboardActivity; // 活动数据
};
