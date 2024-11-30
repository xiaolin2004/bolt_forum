import { redirect } from "next/navigation";
import Image from "next/image";
import { getCurrentSession } from "@/lib/session";
import { getProfileUser } from "@/app/action/User";
import EditButton from "./components/edit-botton";

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

  console.log("v_user:", v_user);
  console.log("v_user.tags:", v_user?.tags);

  if (v_user == null) {
    return <div>用户不存在</div>;
  }
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-6 mb-8">
          <div className="relative w-24 h-24 rounded-full overflow-hidden">
            <Image
              src={v_user?.avatar ?? ""}
              alt="用户头像"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{v_user?.name}</h1>
            {user.id === user_id && (
              <EditButton user_id={user_id} />
            )}
          </div>
        </div>

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
    </div>
  );
}
