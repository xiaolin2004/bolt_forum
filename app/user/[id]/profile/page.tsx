"use client";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  tags: string[];
}

export default function ProfilePage() {
  const router = useRouter();
  
  // 模拟用户数据，实际应用中应从 API 获取
  const user: UserProfile = {
    name: '示例用户',
    email: 'example@email.com',
    phone: '13800138000',
    avatar: '/default-avatar.png',
    tags: ['技术爱好者', '摄影', '旅行']
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-6 mb-8">
          <div className="relative w-24 h-24 rounded-full overflow-hidden">
            <Image
              src={user.avatar}
              alt="用户头像"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <button
              onClick={() => router.push('/user/profile/edit')}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              编辑资料
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">基本信息</h2>
            <div className="space-y-3">
              <div className="flex">
                <span className="w-24 text-gray-600">邮箱：</span>
                <span>{user.email}</span>
              </div>
              <div className="flex">
                <span className="w-24 text-gray-600">电话：</span>
                <span>{user.phone}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">个人标签</h2>
            <div className="flex flex-wrap gap-2">
              {user.tags.map((tag) => (
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