import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { searchPost } from "../action/post";
import type { Metadata } from "next";

const metadata: Metadata = {
  title: "搜索结果",
  description: "搜索结果",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SearchResults({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q } = await searchParams;
  const results = await searchPost(q as string);

  const handlePostClick = (postId: number) => {
    redirect(`/post/${postId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">搜索结果</h1>
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              返回首页
            </Link>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">
              {`共找到 ${results.length} 个与"${q}"相关的结果`}
            </p>
          </div>

          {
            <div className="space-y-6">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="border-b pb-6 last:border-0 hover:bg-gray-50 p-4 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center mb-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                      <Image
                        src="https://api.dicebear.com/9.x/pixel-art/svg"
                        alt={result.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">
                        {result.author}
                      </span>
                      <span className="mx-2">·</span>
                      <span>{result.timestamp}</span>
                    </div>
                  </div>

                  <h2 className="text-xl font-medium mb-2 text-gray-900 hover:text-blue-600">
                    {result.title}
                  </h2>

                  <p className="text-gray-600 mb-4">{result.content}</p>

                  <div className="flex items-center text-sm text-gray-500">
                    <span>
                      <span className="mr-1">💬</span>
                      {result.replies} 条回复
                    </span>
                  </div>
                </div>
              ))}

              {results.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">未找到相关内容</p>
                  <p className="text-sm text-gray-400 mt-2">
                    试试其他关键词，或者
                    <Link
                      href="/post/create"
                      className="text-blue-500 hover:text-blue-600 ml-1"
                    >
                      发布新帖子
                    </Link>
                  </p>
                </div>
              )}
            </div>
          }
        </div>
      </div>
    </div>
  );
}
