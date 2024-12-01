"use server";

import { prisma } from "@/prisma/client";
import { BriefAnnouncement } from "@/types/announcement";
import { revalidatePath } from "next/cache";

/**
 * Fetch all announcements and return brief information.
 */
export async function getAnnouncement(): Promise<BriefAnnouncement[]> {
  try {
    const announcements = await prisma.announcement.findMany({
      select: {
        title: true,
        updated_at: true,
        id: true,
      },
    });

    return announcements.map((announcement) => ({
      title: announcement.title,
      date:
        announcement.updated_at
          ?.toISOString()
          .replace("T", " ")
          .substring(0, 16) ?? "",
      id: announcement.id,
    }));
  } catch (error) {
    console.error("Failed to fetch announcements:", error);
    throw new Error("Failed to fetch announcements");
  }
}

/**
 * Create or update an announcement based on provided data.
 */
export async function createOrUpdateAnnouncement(
  userId: number,
  formData: FormData
): Promise<void> {
  try {
    // Extract and sanitize form data
    const id = Number(formData.get("id")?.toString().trim());
    const title = formData.get("title")?.toString().trim() ?? "";
    const content = formData.get("content")?.toString().trim() ?? "";
    const updatedAt = formData.get("updatedAt")
      ? new Date(formData.get("updatedAt")!.toString().trim())
      : new Date();

    // Upsert the announcement
    await prisma.announcement.upsert({
      where: { id: id || 0 }, // If id is not provided, it will create a new record
      update: {
        title,
        content,
        updated_at: updatedAt,
      },
      create: {
        author: userId,
        title,
        content,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // Revalidate cache for announcements page
    revalidatePath("/admin/announcements");
  } catch (error) {
    console.error("Failed to create or update announcement:", error);
    throw new Error("Failed to create or update announcement");
  }
}

/**
 * Delete an announcement by its ID.
 */
export async function deleteAnnouncement(formData: FormData): Promise<void> {
  try {
    const id = Number(formData.get("id")?.toString().trim());
    if (isNaN(id)) {
      throw new Error("Invalid announcement ID");
    }

    // Delete the announcement
    await prisma.announcement.delete({
      where: { id },
    });

    // Revalidate cache for announcements page
    revalidatePath("/admin/announcements");
  } catch (error) {
    console.error("Failed to delete announcement:", error);
    throw new Error("Failed to delete announcement");
  }
}
