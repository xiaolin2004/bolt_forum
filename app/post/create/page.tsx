import Link from 'next/link';
import { createPost } from '@/app/action/post';
import PostSubmitButton from '../component/post-submit-button';

export default function CreatePost() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">发布新帖子</h1>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800"
            >
              取消
            </Link>
          </div>

          <form action={createPost} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                标题
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="请输入帖子标题"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                内容
              </label>
              <textarea
                id="content"
                name="content"
                placeholder="请输入帖子内容..."
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={12}
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href="/"
                className="px-6 py-2 border rounded-md hover:bg-gray-50"
              >
                取消
              </Link>
              <PostSubmitButton/>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}