import AnnouncementManagement from "./cpage";
import { prisma } from "@/prisma/client";
import { ManageAnnouncement } from "@/types/announcement";
import { getCurrentSession } from "@/lib/session";
import type { Metadata } from "next";

const metadata: Metadata = {
  title: "公告管理",
  description: "公告管理",
};

export default async function page() {
  const user_id = (await getCurrentSession()).user?.id;
  if (user_id == null) {
    return <div>Unauthorized</div>;
  }
  const list = await prisma.announcement.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      created_at: true,
      updated_at: true,
      author: true,
    },
  });
  const announcementList = list.map((announcement) => {
    const announcementData: ManageAnnouncement = {
      title: announcement.title,
      content: announcement.content,
      author: announcement.author,
      createAt: announcement.created_at.toISOString().split("T")[0],
      updateAt: announcement.updated_at.toISOString().split("T")[0],
      id: announcement.id.toString(),
    };
    return announcementData;
  });
  return (
    <AnnouncementManagement
      user_id={user_id}
      announcements={announcementList}
    />
  );
}
