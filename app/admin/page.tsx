import Link from 'next/link';

export default function AdminDashboard() {
  const stats = [
    { label: '总用户数', value: '1,234', icon: '👥' },
    { label: '总帖子数', value: '5,678', icon: '📝' },
    { label: '今日新增用户', value: '45', icon: '📈' },
    { label: '今日新增帖子', value: '123', icon: '📊' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.label}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {item.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              最近活动
            </h3>
            <div className="mt-5 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gray-200" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500">
                      用户xxx发布了新帖子
                      <span className="ml-2">2分钟前</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              系统通知
            </h3>
            <div className="mt-5 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-xl">📢</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500">
                      系统维护通知
                      <span className="ml-2">1小时前</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}