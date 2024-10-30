import SearchBar from './components/SearchBar';
import Sidebar from './components/Sidebar';
import PostList from './components/PostList';
import Announcement from './components/Announcement';
import CreatePostButton from './components/CreatePostButton';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <SearchBar />
          <CreatePostButton />
        </div>
        <div className="flex gap-6">
          <Sidebar />
          <PostList />
          <Announcement />
        </div>
      </div>
    </main>
  );
}