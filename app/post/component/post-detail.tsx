"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import InviteUsersModal from "@/app/components/InviteUsersModal";
import { createReply } from "@/app/action/post";
import ReplySubmitButton from "./reply-submit-button";
import { Reply, Post } from "@/app/types/post";

export default function PostDetail({ id,post }: { id: number,post:Post }) {
  const [isReplying, setIsReplying] = useState(false);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const createReplyWithId = createReply.bind(null, id);

  // Mock post data - in real app, fetch from API using params.id

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
            <form action={createReplyWithId} className="mt-4">
              <input
              name="content"
              id="content"
              type="text"
              required
              placeholder="写下你的回复..."
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="mt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsReplying(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  取消
                </button>
                <ReplySubmitButton />
              </div>
            </form>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">
            全部回复 ({post.replies.length})
          </h2>
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
