"use client";
import { redirect } from "next/navigation";
import Image from "next/image";
import { cardUser as User } from "../../types/user";
import { Logout } from "../action/User";


function LogoutButton(){
  return (
    <button
      onClick={Logout}
      className="text-lg text-red-500 hover:text-red-600 py-2 px-4 border border-red-500 rounded"
    >
      退出登录
    </button>
  );
}

export default function UserCard({ user }: { user: User }) {
  const handleClick = () => {
    if (user.isLoggedIn) {
      redirect(`/user/${user.id?.toString()}`);
    } else {
      redirect("/login");
    }
  };

  return (
    <div
      onClick={handleClick}
      className="mt-auto p-4 border-t cursor-pointer hover:bg-gray-50"
    >
      <div className="flex items-center space-x-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image
            src="https://api.dicebear.com/9.x/pixel-art/svg"
            alt="用户头像"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          {user.isLoggedIn ? (
            <>
              <p className="font-medium">{user.name}</p>
            </>
          ) : (
            <p className="text-blue-500 hover:text-blue-600">点击登录</p>
          )}
        </div>
      </div>
    </div>
  );
}
