import {prisma} from '@/prisma/client';
import { revalidatePath } from 'next/cache';

export async function addtag_user({tag,user_id}:{tag:string,user_id:number}){ {
    let tag_id = (await prisma.tag.findUnique({
        where:{
            feature:tag
        }
    }))?.id??null;
    if(tag_id==null){
        tag_id = (await prisma.tag.create({
            data:{
                feature:tag
            }
        })).id;
    }
    const link = await prisma.tag_user.create({
        data:{
            tag_id:tag_id,
            user_id:user_id
        }
    })
    revalidatePath(`/user/${user_id}`);
};
}
