import Link from "next/link";
import { getCurrentSession } from "../../lib/session";
import { redirect } from "next/navigation";


function ReturnHome() {
  return (
    <Link
    href={"/"}
      className="text-gray-500 hover:text-gray-700"
    >
      返回前台
    </Link>
  );
}
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session =await getCurrentSession();
  if (session == null) {
    redirect("/login");
  }
  if(session.user?.user_type_id!=2){
    redirect("/");
  }
  const menuItems = [
    { path: "/admin", label: "控制台", icon: "📊" },
    { path: "/admin/users", label: "用户管理", icon: "👥" },
    { path: "/admin/posts", label: "帖子管理", icon: "📝" },
    { path: "/admin/announcements", label: "公告管理", icon: "📢" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">管理后台</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={
                      "border-transparent text-gray-900 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    }
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <ReturnHome />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
