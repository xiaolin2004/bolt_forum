import SearchBar from "../components/SearchBar";
import Sidebar from "../components/Sidebar";
import PostList from "../components/PostList";
import Announcement from "../components/Announcement";
import CreatePostButton from "../components/CreatePostButton";
import UserCard from "../components/UserCard";
import { getCardUser } from "../action/User";
import { getPostList } from "../action/post";
import { getAnnouncement } from "../action/Announcement";
import { Logout } from "../action/User";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "首页",
    description: "这是首页",
};

async function LogoutButton() {
    return (
        <button
            onClick={await Logout}
            className="text-lg text-red-500 hover:text-red-600 py-2 px-4 border border-red-500 rounded"
        >
            退出登录
        </button>
    );
}

export default async function Home() {
    const postListData = getPostList();
    const announcementData = getAnnouncement();
    const cardUserData = getCardUser();
    const [postList, announcement, cardUser] = await Promise.all([
        postListData,
        announcementData,
        cardUserData,
    ]);

    const hotest_postList = postList.sort((a, b) => Number(a.replies) - Number(b.replies))
    return (
        <main className="min-h-screen bg-gray-100">
            <div className="container mx-auto py-6 px-4">
                {/* 搜索栏和创建按钮部分 */}
                <div className="flex justify-center items-center mb-6 gap-4">
                    <SearchBar />
                    <CreatePostButton />
                </div>

                {/* 主体内容部分 */}
                <div className="flex gap-6">
                    <Sidebar />
                    <PostList posts={hotest_postList} />
                    <Announcement announcements={announcement} />
                </div>

                {/* 用户卡片和退出按钮 */}
                <div className="fixed bottom-0 left-0 p-4">
                    <UserCard user={cardUser} />
                    <LogoutButton />
                </div>
            </div>
        </main>
    );
}