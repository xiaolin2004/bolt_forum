"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索帖子..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button 
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600"
        >
          搜索
        </button>
      </form>
    </div>
  );
}