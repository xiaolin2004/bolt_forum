"use client";
import { useState } from 'react';
import Image from 'next/image';

interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
}

interface InviteUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle: string;
}

export default function InviteUsersModal({
  isOpen,
  onClose,
  postId,
  postTitle,
}: InviteUsersModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isSending, setIsSending] = useState(false);

  // Mock user data - in real app, fetch from API based on search query
  const users: User[] = [
    {
      id: '1',
      name: '李四',
      avatar: '/default-avatar.png',
      bio: '技术专家，对Web开发有深入研究'
    },
    {
      id: '2',
      name: '王五',
      avatar: '/default-avatar.png',
      bio: '全栈开发者，热爱分享技术经验'
    },
  ];

  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleInvite = async () => {
    if (selectedUsers.size === 0) return;

    setIsSending(true);
    try {
      // In real app, send invitation to API
      // await sendInvitations({
      //   postId,
      //   userIds: Array.from(selectedUsers)
      // });
      onClose();
    } catch (error) {
      console.error('Failed to send invitations:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">邀请用户回答</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索用户..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="max-h-60 overflow-y-auto mb-4">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => toggleUserSelection(user.id)}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                selectedUsers.has(user.id) ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.bio}</p>
              </div>
              {selectedUsers.has(user.id) && (
                <span className="text-blue-500 ml-2">✓</span>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleInvite}
            disabled={selectedUsers.size === 0 || isSending}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
              (selectedUsers.size === 0 || isSending) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSending ? '发送中...' : '发送邀请'}
          </button>
        </div>
      </div>
    </div>
  );
}