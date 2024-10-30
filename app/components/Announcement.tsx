"use client";
import { useState } from 'react';

export default function Announcement() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const announcements = [
    { title: '社区规范更新', date: '2023-10-01' },
    { title: '新功能上线公告', date: '2023-09-30' },
    { title: '每周优质内容推荐', date: '2023-09-29' },
  ];

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full p-4 text-left hover:bg-gray-100 flex items-center justify-between"
      >
        {!isCollapsed && <span className="font-bold">公告栏</span>}
        <span className="text-gray-500">{isCollapsed ? '←' : '→'}</span>
      </button>
      {!isCollapsed && (
        <div className="p-4">
          {announcements.map((announcement) => (
            <div key={announcement.title} className="mb-4 pb-2 border-b">
              <h3 className="font-medium">{announcement.title}</h3>
              <p className="text-sm text-gray-500">{announcement.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}