import SearchBar from './components/SearchBar';
import Sidebar from './components/Sidebar';
import PostList from './components/PostList';
import Announcement from './components/Announcement';
import CreatePostButton from './components/CreatePostButton';
import UserCard from './components/UserCard';
import {getCardUser} from './action/User';
import { getPostList } from './action/post';
import { getAnnouncement } from './action/Announcement';

export default async function Home() {
  const postListData = getPostList();
  const announcementData = getAnnouncement();
  const cardUserData = getCardUser();
  const [postList, announcement, cardUser] = await Promise.all([postListData, announcementData, cardUserData]);
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <SearchBar />
          <CreatePostButton />
        </div>
        <div className="flex gap-6">
          <Sidebar />
          <PostList posts = {postList}/>
          <Announcement announcements={announcement}/>
        </div>
        <div className="fixed bottom-0 left-0 p-4"> 
          <UserCard user = {cardUser}
          /> 
        </div>
      </div>
    </main>
  );
}