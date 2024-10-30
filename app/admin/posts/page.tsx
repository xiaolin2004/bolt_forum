"use client";
import { useState } from 'react';

interface Post {
  id: string;
  title: string;
  author: string;
  category: string;
  status: string;
  createDate: string;
  replies: number;
}

export default function PostManagement() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: '这是一个示例帖子标题',
      author: '张三',
      category: '技术讨论',
      status: '正常',
      createDate: '2023-10-01',
      replies: 23,
    },
    // 更多帖子数据...
  ]);

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">帖子管理</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              placeholder="搜索帖子..."
              className="form-input rounded-md w-full sm:w-64"
            />
          </div>
          <select className="form-select rounded-md">
            <option value="">所有分类</option>
            <option value="tech">技术讨论</option>
            <option value="life">生活分享</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                帖子信息
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                分类
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                回复数
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {post.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      作者: {post.author} | 发布时间: {post.createDate}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {post.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={post.status}
                    onChange={(e) => {
                      setPosts(posts.map(p =>
                        p.id === post.id ? { ...p, status: e.target.value } : p
                      ));
                    }}
                    className="text-sm rounded-md border-gray-300"
                  >
                    <option value="正常">正常</option>
                    <option value="置顶">置顶</option>
                    <option value="隐藏">隐藏</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.replies}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">
                    查看
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页控件 */}
      <div className="flex justify-center mt-4">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            上一页
          </button>
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            1
          </button>
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            2
          </button>
          <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            下一页
          </button>
        </nav>
      </div>
    </div>
  );
}