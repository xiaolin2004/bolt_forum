import Link from "next/link";
import Image from "next/image";
import {prisma} from "@/prisma/client";
import { Announcement } from "@/app/types/announcement";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
    const id = Number((await params).id);
    const announcement = (await prisma.announcement.findUnique({
        where:{
            id:id
        },
        select:{
            title:true,
            content:true,
            created_at:true,
            updated_at:true,
            author:true
    }}));
    if (announcement == null) {
        return <div>Announcement not found</div>;
    }
    const announcementData: Announcement = {
        title: announcement.title,
        content: announcement.content,
        author: announcement.author,
        createAt: announcement.created_at.toString(),
        updateAt: announcement.updated_at.toString(),
    }
    const author = await prisma.user.findUnique({
        where:{
            id:announcement.author
        },
        select:{
            avatar:true,
            name:true
        }
    })
    if (author == null) {
        return <div>Author not found</div>;
    }
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              ← 返回首页
            </Link>
          </div>

          <h1 className="text-2xl font-bold mb-4">{announcementData.title}</h1>

          <div className="flex items-center mb-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
              <Image
                src={author.avatar??""}
                alt={author.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{author.name}</p>
              <p className="text-sm text-gray-500">
                {announcementData.createAt} 更新于 {announcementData.updateAt}
              </p>
            </div>
          </div>

          <div className="prose max-w-none mb-6">
            <p className="text-gray-800 whitespace-pre-wrap">
              {announcementData.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


