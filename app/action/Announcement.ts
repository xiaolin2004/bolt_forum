import {prisma} from "@/prisma/client";
import { BriefAnnouncement } from "@/app/types/announcement";
export async function getAnnouncement(){
    const announcement = (await prisma.announcement.findMany({
        select:{
            title:true,
            updated_at:true,
            id:true
        }
    }));
    const briefAnnouncement: BriefAnnouncement[] = announcement.map((announcement) => {
        return {
            title: announcement.title,
            date: announcement.updated_at.toString(),
            id: announcement.id
        }
    });
    return briefAnnouncement;
}