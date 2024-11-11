"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BriefAnnouncement } from '../../types/announcement';

export default function Announcement({announcements}:{announcements:BriefAnnouncement[]}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

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
              <h3 
                className="font-medium cursor-pointer text-blue-500 hover:underline"
                onClick={() => router.push(`/announcement/${announcement.id}`)}
              >
                {announcement.title}
              </h3>
              <p className="text-sm text-gray-500">{announcement.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}