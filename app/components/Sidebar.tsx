"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Sidebar() {
  // have to be client-side
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: '首页', icon: '🏠', path: '/' },
    { name: '热门讨论', icon: '🔥', path: '/hot' },
    { name: '最新发布', icon: '⭐', path: '/latest' },
    { name: '我的需求', icon: '📝', path: '/my-posts' },
    { name: '邀请回答', icon: '✉️', path: '/invitations' },
  ];

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 h-[calc(100vh-2rem)] flex flex-col ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full p-4 text-left hover:bg-gray-100 flex items-center justify-between"
      >
        {!isCollapsed && <span className="font-bold">论坛导航</span>}
        <span className="text-gray-500">{isCollapsed ? '→' : '←'}</span>
      </button>
      <nav className="p-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className="flex items-center p-3 rounded-lg hover:bg-gray-100 mb-1"
          >
            <span className="text-xl">{item.icon}</span>
            {!isCollapsed && <span className="ml-3">{item.name}</span>}
          </Link>
        ))}
      </nav>
      {!isCollapsed}
    </div>
  );
}