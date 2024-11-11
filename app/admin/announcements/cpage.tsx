"use client";
import { useState } from "react";
// @ts-expect-error
import { useFormStatus } from "react-dom";
import { ManageAnnouncement } from "@/types/announcement";
import {
  createOrUpdateAnnouncement,
  deleteAnnouncement,
} from "@/app/action/Announcement";

export default function AnnouncementManagement({
  announcements,
  user_id,
}: {
  announcements: ManageAnnouncement[];
  user_id: number;
}) {
  const create_or_update_announcement = createOrUpdateAnnouncement.bind(
    null,
    user_id
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] =
    useState<ManageAnnouncement | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] =
    useState<ManageAnnouncement | null>(null);

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">公告管理</h1>
        <button
          onClick={() => {
            setCurrentAnnouncement(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          发布新公告
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                公告标题
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                发布时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                过期时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {announcements.map((announcement) => (
              <tr key={announcement.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {announcement.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {announcement.content.substring(0, 50)}...
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full  bg-green-100 text-green-800   `}
                  >
                    已发布
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {announcement.createAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {announcement.updateAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      setCurrentAnnouncement(announcement);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => {
                      setAnnouncementToDelete(announcement);
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

      {/* 新增/编辑公告模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-semibold mb-4">
              {currentAnnouncement ? "编辑公告" : "发布新公告"}
            </h2>
            <form action={create_or_update_announcement} className="space-y-4">
              <div>
                <input
                  name="id"
                  type="hidden"
                  value={currentAnnouncement?.id}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  公告标题
                </label>
                <input
                  name="title"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue={currentAnnouncement?.title}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  公告内容
                </label>
                <textarea
                  rows={4}
                  name="content"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue={currentAnnouncement?.content}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  过期时间
                </label>
                <input
                  name="updatedAt"
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue={currentAnnouncement?.updateAt}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <EditSubmitButton />
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">确认删除</h2>
            <p className="mb-4">你确定要删除这个公告吗？此操作无法撤销。</p>
            <form action={deleteAnnouncement} className="space-y-4">
              <input name="id" type="hidden" defaultValue={announcementToDelete?.id} />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <DeleteSubmitButton />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function EditSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
    >
      {pending ? "提交中..." : "提交"}
    </button>
  );
}

function DeleteSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
    >
      {pending ? "删除中..." : "删除"}
    </button>
  );
}
