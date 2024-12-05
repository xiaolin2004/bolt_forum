"use client";

import { useRouter } from 'next/navigation';

export default function CreatePostButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/post/create')}
      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-md flex items-center"
    >
      <span className="mr-2">+</span>
      发布需求
    </button>
  );
}