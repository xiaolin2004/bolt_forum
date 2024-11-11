"use client";
import { useState } from 'react';
import { redirect } from 'next/navigation';
import {ListPost} from '@/types/post';


export default function PostList({posts}:{posts:ListPost[]}) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handlePostClick = (postId: number) => {
    redirect(`/post/${postId}`);
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