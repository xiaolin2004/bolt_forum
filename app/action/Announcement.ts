"use server";
import { prisma } from "@/prisma/client";
import { BriefAnnouncement } from "@/app/types/announcement";
import { revalidatePath } from "next/cache";

export async function getAnnouncement() {
  const announcement = await prisma.announcement.findMany({
    select: {
      title: true,
      updated_at: true,
      id: true,
    },
  });
  const briefAnnouncement: BriefAnnouncement[] = announcement.map(
    (announcement) => {
      return {
        title: announcement.title,
        date: announcement.updated_at.toString(),
        id: announcement.id,
      };
    }
  );
  return briefAnnouncement;
}

export async function createOrUpdateAnnouncement(
  user_id: number,
  formData: FormData
) {
  const rawFormData = {
    id: formData.get("id")?.toString().trim(),
    title: formData.get("title")?.toString().trim(),
    content: formData.get("content")?.toString().trim(),
    updateAt: formData.get("updatedAt")?.toString().trim(),
  };
  const id = Number(rawFormData.id);
  const updatedAtDate = rawFormData.updateAt ? new Date(rawFormData.updateAt) : new Date();
  const announcement = await prisma.announcement.upsert({
    where: {
      id: id,
    },
    update: {
      title: rawFormData.title,
      content: rawFormData.content,
      updated_at: updatedAtDate
    },
    create: {
      author: user_id,
      title: rawFormData.title ?? "",
      content: rawFormData.content ?? "",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  revalidatePath("/admin/announcements");
}

export async function deleteAnnouncement(formData:FormData) {
  const id = Number(formData.get("id")?.toString().trim());
  await prisma.announcement.delete({
    where: {
      id: id,
    },
  });
  revalidatePath("/admin/announcements");
}