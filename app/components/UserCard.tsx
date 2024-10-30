"use client";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface User {
  id: string;
  name: string;
  avatar: string;
  isLoggedIn: boolean;
}

export default function UserCard() {
  const router = useRouter();
  
  // 模拟用户状态，实际应用中应该从认证系统获取
  const user: User = {
    id: '1',
    name: '示例用户',
    avatar: '/default-avatar.png',
    isLoggedIn: false // 修改为默认未登录状态
  };

  const handleClick = () => {
    if (user.isLoggedIn) {
      router.push('/user/profile');
    } else {
      router.push('/login');
    }
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 实际应用中这里需要调用登出 API
    router.push('/login');
  };

  return (
    <div
      onClick={handleClick}
      className="mt-auto p-4 border-t cursor-pointer hover:bg-gray-50"
    >
      <div className="flex items-center space-x-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={user.avatar}
            alt="用户头像"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          {user.isLoggedIn ? (
            <>
              <p className="font-medium">{user.name}</p>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-600"
              >
                退出登录
              </button>
            </>
          ) : (
            <p className="text-blue-500 hover:text-blue-600">点击登录</p>
          )}
        </div>
      </div>
    </div>
  );
}