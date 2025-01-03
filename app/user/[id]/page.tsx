import { redirect } from "next/navigation";
import Image from "next/image";
import { getCurrentSession } from "@/lib/session";
import { getProfileUser } from "@/app/action/User";
import EditButton from "./components/edit-botton";
import PostList from "@/app/components/PostList";
import type { Metadata } from "next";
import { getUserPost } from "@/app/action/post";


export const metadata: Metadata = {
  title: "用户信息",
  description: "用户信息",
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user } = await getCurrentSession();
  if (user == null) {
    return redirect("/login");
  }
  const user_id = parseInt((await params).id);

  const v_user = await getProfileUser(user_id);

  if (v_user == null) {
    return <div>用户不存在</div>;
  }

  // 获取用户发布的帖子
  const userPosts = await getUserPost(user_id);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        {/* 用户信息 */}
        <div className="flex items-center space-x-6 mb-8">
          <div className="relative w-24 h-24 rounded-full overflow-hidden">
            <Image
              src="https://api.dicebear.com/9.x/pixel-art/svg"
              alt="用户头像"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{v_user?.name}</h1>
            {user.id === user_id && <EditButton user_id={user_id} />}
          </div>
        </div>

        {/* 基本信息 */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">基本信息</h2>
            <div className="space-y-3">
              <div className="flex">
                <span className="w-24 text-gray-600">邮箱：</span>
                <span>{v_user.email}</span>
              </div>
              <div className="flex">
                <span className="w-24 text-gray-600">电话：</span>
                <span>{v_user.phone}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">个人标签</h2>
            <div className="flex flex-wrap gap-2">
              {v_user.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 用户发布的帖子 */}
      <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-md p-8">
        <h2 className="text-lg font-semibold mb-4">发布的帖子</h2>
        {userPosts.length > 0 ? (
          <PostList posts={userPosts} />
        ) : (
          <p className="text-gray-600">用户尚未发布任何帖子。</p>
        )}
      </div>
    </div>
  );
}