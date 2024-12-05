"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import InviteUsersModal from "@/app/components/InviteUsersModal";
import { createReply, deleteReply, deletePost, updatePost } from "@/app/action/post";
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
  const [modalData, setModalData] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: async () => { },
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);

  const createReplyWithId = createReply.bind(null, id);

  const openDeletePostModal = () => {
    setModalData({
      isOpen: true,
      title: "确认删除帖子",
      message: "你确定要删除这个帖子吗？此操作无法撤销。",
      onConfirm: async () => {
        try {
          const formData = new FormData();
          formData.append("id", post.id.toString());
          await deletePost(formData);
          setModalData((prev) => ({ ...prev, isOpen: false }));
          window.location.href = "/";
        } catch (error) {
          console.error("删除帖子失败:", error);
        }
      },
    });
  };

  const openEditPostModal = () => {
    setCurrentPost(post);
    setIsEditModalOpen(true);
  };

  const openDeleteReplyModal = (reply: Reply) => {
    setModalData({
      isOpen: true,
      title: "确认删除回复",
      message: "你确定要删除这个回复吗？此操作无法撤销。",
      onConfirm: async () => {
        try {
          const formData = new FormData();
          formData.append("id", reply.id.toString());
          await deleteReply(formData);
          post.replies = post.replies.filter((r) => r.id !== reply.id);
          setModalData((prev) => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error("删除回复失败:", error);
        }
      },
    });
  };

  const handleUpdatePost = async (formData: FormData) => {
    try {
      await updatePost(formData);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("更新帖子失败:", error);
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
                  onClick={openEditPostModal}
                  className="inline-flex items-center px-4 py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-50"
                >
                  编辑需求
                </button>
                <button
                  onClick={openDeletePostModal}
                  className="inline-flex items-center px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
                >
                  删除需求
                </button>
              </div>
            )}
          </div>

          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center mb-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
              <Image
                src={post.avatar || "https://api.dicebear.com/9.x/pixel-art/svg"}
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
                      onClick={() => openDeleteReplyModal(reply)}
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

      <ConfirmModal {...modalData} onClose={() => setModalData((prev) => ({ ...prev, isOpen: false }))} />

      {isEditModalOpen && (
        <EditModal
          post={currentPost}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdatePost}
        />
      )}
    </div>
  );
}

function EditModal({
  post,
  onClose,
  onSubmit,
}: {
  post: Post | null;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-xl font-semibold mb-4">编辑需求</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            formData.append("id", post?.id.toString() || "");
            await onSubmit(formData);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              需求标题
            </label>
            <input
              name="title"
              type="text"
              defaultValue={post?.title || ""}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              需求内容
            </label>
            <textarea
              rows={4}
              name="content"
              defaultValue={post?.content || ""}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              提交
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onClose,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="mt-2 text-sm text-gray-500">{message}</p>
          <div className="mt-5 sm:flex sm:justify-end sm:space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
            >
              确认
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}