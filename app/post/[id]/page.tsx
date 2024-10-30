"use client";
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import InviteUsersModal from '@/app/components/InviteUsersModal';

interface Reply {
  id: number;
  author: string;
  content: string;
  avatar: string;
  timestamp: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  avatar: string;
  timestamp: string;
  replies: Reply[];
}

export default function PostDetail() {
  const params = useParams();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Mock post data - in real app, fetch from API using params.id
  const post: Post = {
    id: params.id as string,
    title: '这是一个示例帖子标题',
    content: '这是帖子的详细内容。可以包含多个段落，支持长文本显示。这里是示例内容，实际应用中应该从后端 API 获取真实数据。',
    author: '张三',
    avatar: '/default-avatar.png',
    timestamp: '2023-10-01 14:30',
    replies: [
      {
        id: 1,
        author: '李四',
        content: '这是一条回复内容',
        avatar: '/default-avatar.png',
        timestamp: '2023-10-01 15:00'
      },
      {
        id: 2,
        author: '王五',
        content: '这是另一条回复内容',
        avatar: '/default-avatar.png',
        timestamp: '2023-10-01 15:30'
      }
    ]
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    // In real app, send to API
    const newReply: Reply = {
      id: post.replies.length + 1,
      author: '当前用户',
      content: replyContent,
      avatar: '/default-avatar.png',
      timestamp: new Date().toLocaleString()
    };

    post.replies.push(newReply);
    setReplyContent('');
    setIsReplying(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <Link 
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              ← 返回首页
            </Link>
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
            >
              <span className="mr-2">✉️</span>
              邀请回答
            </button>
          </div>
          
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center mb-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
              <Image
                src={post.avatar}
                alt={post.author}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{post.author}</p>
              <p className="text-sm text-gray-500">{post.timestamp}</p>
            </div>
          </div>

          <div className="prose max-w-none mb-6">
            <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
          </div>

          <button
            onClick={() => setIsReplying(!isReplying)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            回复
          </button>

          {isReplying && (
            <form onSubmit={handleReplySubmit} className="mt-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="写下你的回复..."
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsReplying(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  发送
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">全部回复 ({post.replies.length})</h2>
          <div className="space-y-6">
            {post.replies.map((reply) => (
              <div key={reply.id} className="border-b pb-4 last:border-0">
                <div className="flex items-center mb-2">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                    <Image
                      src={reply.avatar}
                      alt={reply.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{reply.author}</p>
                    <p className="text-sm text-gray-500">{reply.timestamp}</p>
                  </div>
                </div>
                <p className="text-gray-800 ml-10">{reply.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <InviteUsersModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        postId={post.id}
        postTitle={post.title}
      />
    </div>
  );
}