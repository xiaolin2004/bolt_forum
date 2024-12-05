"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import InviteUsersModal from "@/app/components/InviteUsersModal";
import { createReply } from "@/app/action/post";
import { deleteReply,deletePost } from "@/app/action/post"; // 假设存在删除回复的函数
import ReplySubmitButton from "./reply-submit-button";
import { Reply, Post } from "@/types/post";

export default function PostDetail({
  visitor,
  id,
  post,
}: {
  visitor: number;
  id: number;
  post: Post;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [isReplyDeleteModalOpen, setIsReplyDeleteModalOpen] = useState(false);
  const [replyToDelete, setReplyToDelete] = useState<Reply | null>(null);

  // 帖子删除状态
  const [isPostDeleteModalOpen, setIsPostDeleteModalOpen] = useState(false);

  const createReplyWithId = createReply.bind(null, id);

  const handleDeleteReply = (reply: Reply) => {
    setReplyToDelete(reply);
    setIsReplyDeleteModalOpen(true);
  };

  const handleDeletePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      await deletePost(formData); // 假设执行帖子删除操作
      setIsPostDeleteModalOpen(false); // 关闭模态框
      // 跳转回首页或提示用户
      window.location.href = "/";
    } catch (error) {
      console.error("删除帖子失败:", error);
    }
  };

  const handleDeleteConfirmation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 阻止默认表单提交行为
    try {
      const formData = new FormData(e.currentTarget);
      await deleteReply(formData); // 假设执行删除操作
      post.replies = post.replies.filter((r) => r.id !== replyToDelete?.id); // 更新前端数据
      setIsReplyDeleteModalOpen(false); // 关闭模态框
    } catch (error) {
      console.error("删除回复失败:", error);
    }
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
            {visitor === post.author_id && (
              <div className="flex space-x-4">
                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
                >
                  <span className="mr-2">✉️</span>
                  邀请开发者
                </button>
                <button
                  onClick={() => setIsPostDeleteModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
                >
                  删除帖子
                </button>
              </div>
            )}
          </div>

          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center mb-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
              <Image
                src={
                  post.avatar ||
                  "https://api.dicebear.com/9.x/pixel-art/svg"
                }
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
              <div key={reply.id} className="flex items-center border-b pb-4 last:border-0">
                <div className="flex-grow">
                  <div className="flex items-center mb-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                      <Image
                        src="https://api.dicebear.com/9.x/pixel-art/svg"
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
                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveReplyId(
                        activeReplyId === reply.id ? null : reply.id
                      )
                    }
                    className="text-gray-500 hover:text-gray-700 px-2"
                  >
                    ：
                  </button>
                  {activeReplyId === reply.id && (
                    <button
                      onClick={() => handleDeleteReply(reply)}
                      className={`absolute top-0 right-0 mt-6 px-3 py-1 rounded-md text-sm ${reply.author_id === visitor
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      disabled={reply.author_id !== visitor}
                    >
                      删除
                    </button>
                  )}
                </div>
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

      {isReplyDeleteModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    确认删除
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      你确定要删除这个回复吗？此操作无法撤销。
                    </p>
                  </div>
                </div>
              </div>
              <form onSubmit={handleDeleteConfirmation}>
                <input type="hidden" name="id" value={replyToDelete?.id} />
                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    删除
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setIsReplyDeleteModalOpen(false)}
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 删除帖子模态框 */}
      {isPostDeleteModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    确认删除帖子
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      你确定要删除这个帖子吗？此操作无法撤销。
                    </p>
                  </div>
                </div>
              </div>
              <form onSubmit={handleDeletePost}>
                <input type="hidden" name="id" value={post.id} />
                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    删除
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setIsPostDeleteModalOpen(false)}
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}