"use client";
import { useState } from "react";
import Link from "next/link";
import { deletePost } from "@/app/action/post";
import { ListPost } from "@/types/post";

export default function PostManagement({ posts }: { posts: ListPost[] }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<ListPost | null>(null);
  const [allPosts, setAllPosts] = useState(posts); // 动态管理帖子列表
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  const currentPosts = allPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 防止默认行为

    if (!postToDelete) {
      console.error("没有选择要删除的帖子！");
      return;
    }

    try {
      const formData = new FormData(e.currentTarget);
      await deletePost(formData); // 调用删除 API
      setAllPosts((prevPosts) =>
        prevPosts.filter((p) => p.id !== postToDelete.id)
      ); // 更新帖子列表
      setIsDeleteModalOpen(false); // 关闭模态框
    } catch (error) {
      console.error("删除帖子失败：", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">帖子管理</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              placeholder="搜索帖子..."
              className="form-input rounded-md w-full sm:w-64"
            />
          </div>
          <select className="form-select rounded-md">
            <option value="">所有分类</option>
            <option value="tech">技术讨论</option>
            <option value="life">生活分享</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                帖子信息
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                分类
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                回复数
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPosts.map((post) => (
              <tr key={post.id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {post.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      作者: {post.author} | 发布时间: {post.lastReply}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    需求
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.replies}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/post/${post.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    查看
                  </Link>
                  <button
                    onClick={() => {
                      setPostToDelete(post);
                      setIsDeleteModalOpen(true);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">确认删除</h2>
            <p className="mb-4">你确定要删除这个帖子吗？此操作无法撤销。</p>
            <form onSubmit={handleDelete}>
              <input type="hidden" name="id" value={postToDelete?.id || ""} />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  删除
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 分页控件 */}
      <div className="mt-6 flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
