"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SearchResult {
  id: number;
  title: string;
  content: string;
  author: string;
  avatar: string;
  timestamp: string;
  replies: number;
  views: number;
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟 API 调用
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        // 实际应用中这里应该调用搜索 API
        // const response = await searchPosts(query);
        // setResults(response.data);
        
        // 模拟数据
        const mockResults: SearchResult[] = Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          title: `包含"${query}"的示例帖子 ${i + 1}`,
          content: `这是一个包含搜索关键词"${query}"的帖子内容预览...`,
          author: `用户${i + 1}`,
          avatar: '/default-avatar.png',
          timestamp: '2023-10-01',
          replies: Math.floor(Math.random() * 100),
          views: Math.floor(Math.random() * 1000)
        }));
        
        setResults(mockResults);
      } catch (error) {
        console.error('搜索失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  const handlePostClick = (postId: number) => {
    router.push(`/post/${postId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">搜索结果</h1>
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800"
            >
              返回首页
            </Link>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">
              {isLoading ? (
                '搜索中...'
              ) : (
                `共找到 ${results.length} 个与"${query}"相关的结果`
              )}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {results.map((result) => (
                <div
                  key={result.id}
                  onClick={() => handlePostClick(result.id)}
                  className="border-b pb-6 last:border-0 hover:bg-gray-50 p-4 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center mb-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                      <Image
                        src={result.avatar}
                        alt={result.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">{result.author}</span>
                      <span className="mx-2">·</span>
                      <span>{result.timestamp}</span>
                    </div>
                  </div>

                  <h2 className="text-xl font-medium mb-2 text-gray-900 hover:text-blue-600">
                    {result.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4">{result.content}</p>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4">
                      <span className="mr-1">👁️</span>
                      {result.views} 次浏览
                    </span>
                    <span>
                      <span className="mr-1">💬</span>
                      {result.replies} 条回复
                    </span>
                  </div>
                </div>
              ))}

              {results.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <p className="text-gray-500">未找到相关内容</p>
                  <p className="text-sm text-gray-400 mt-2">
                    试试其他关键词，或者
                    <Link href="/post/create" className="text-blue-500 hover:text-blue-600 ml-1">
                      发布新帖子
                    </Link>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}