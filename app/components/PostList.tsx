"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  author: string;
  replies: number;
  views: number;
  lastReply: string;
}

export default function PostList() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const posts: Post[] = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: `这是一个示例帖子标题 ${i + 1}`,
    author: `用户${i + 1}`,
    replies: Math.floor(Math.random() * 100),
    views: Math.floor(Math.random() * 1000),
    lastReply: '2023-10-01',
  }));

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handlePostClick = (postId: number) => {
    router.push(`/post/${postId}`);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex-1">
      <div className="space-y-4">
        {currentPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => handlePostClick(post.id)}
            className="border-b pb-4 hover:bg-gray-50 p-4 rounded-lg transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium hover:text-blue-600">
                {post.title}
              </h3>
              <div className="text-sm text-gray-500">
                <span className="mr-4">回复: {post.replies}</span>
                <span>浏览: {post.views}</span>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500 flex justify-between">
              <span>作者: {post.author}</span>
              <span>最后回复: {post.lastReply}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === i + 1
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}