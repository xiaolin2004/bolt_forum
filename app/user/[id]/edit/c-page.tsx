"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import EditAvatarButton from '../components/edit-avatar-botton';
import { updateProfile } from '@/app/action/User';
import { UserProfile } from '@/app/types/user';
import EditSubmitButton from '../components/edit-submit-button';

export default function EditProfilePage({profile1}:{profile1:UserProfile}) {
  const router = useRouter();

  const updateProfileWithId  = updateProfile.bind(null,profile1.id);
  
  const [profile, setProfile] = useState<UserProfile>(profile1);

  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (newTag && !profile.tags.includes(newTag)) {
      setProfile(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <form action={updateProfileWithId} className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">编辑个人资料</h1>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
              <Image
                src={profile.avatar}
                alt="用户头像"
                fill
                className="object-cover"
              />
            </div>
            <EditAvatarButton user_id={1} />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                昵称
              </label>
              <input
                name='name'
                type="text"
                value={profile.name}
                onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                邮箱
              </label>
              <input
                name='email'
                type="email"
                value={profile.email}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-200 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                电话
              </label>
              <input
                name='phone'
                type="tel"
                value={profile.phone}
                onChange={e => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                个人标签
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {profile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  placeholder="添加新标签"
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  添加
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push(`/user/${profile.id}`)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              取消
            </button>
            <EditSubmitButton />
          </div>
        </div>
      </form>
    </div>
  );
}